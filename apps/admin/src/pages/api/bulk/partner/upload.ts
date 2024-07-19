import  {type  Cell, type Row, Workbook } from "exceljs";
import multer from "multer"
import type { NextApiRequest, NextApiResponse } from "next";
import { processExcelData, runMiddleware } from "../recipe/upload";
import fs from 'fs'
import { promisify } from 'util'


enum InstructorCategory {
    Fitness = 'Fitness',
    Wellness = 'Wellness'
}

type PartnerData = {
    name: string
    bio: string
    category: InstructorCategory
    subCategory: string[]
    phone: string
    socials: { url: string, name : string }[]
    amenities: string[]
}




export const unLinkAsync = promisify(fs.unlink)

const optionalColNums = [7]
const  supportedSocials = ['instagram', 'tiktok', 'facebook']


const parseCellData = (cell: Cell): string | number | InstructorCategory | null => {
    const value = cell.value;
    if (value === undefined || value === null) return null;
    if (typeof value === 'string') return value.trim();
    return value;
};

function parseRowData(row: Row, rowNumber: number):{ rowData: Partial<PartnerData> | null , errors: string[]| null} {
  
        const rowData: Partial<PartnerData> = {};
        const cellMappings = [
            { index: 1, key: 'name' },
            { index: 2, key: 'bio' },
            { index: 3, key: 'category' },
            { index: 6, key: 'subCategory', isSplit: true },
            { index: 4, key: 'phone' },
            { index: 5, key: 'dietType' },
            { index: 7, key: 'socials', isSplit: true },
            { index: 8, key: 'amenities' }
        ];
        const errors: string[] = [];
        cellMappings.forEach(mapping => {
            const cell = row.getCell(mapping.index);
            const isRequired = !optionalColNums.includes(mapping.index);
            if (isRequired && (cell.value === undefined || cell.value === null)) {
                errors.push(`Missing value in column ${cell.col} in row ${rowNumber}`);
            }else {

                if (mapping.index  === 7){
                    const links = (parseCellData(cell) as string)?.split(",").map(val => val.trim()) || []
                    const socials = links.map((link) => {
                        const matchedSocial = supportedSocials.find(social => link.includes(social));
                        return matchedSocial ? { name: matchedSocial, url: link } : null;
                    }).filter(social => social !== null);
                    rowData[mapping.key] = socials as { name: string, url: string }[];

                }else {
                    rowData[mapping?.key] = mapping.isSplit ? 
                    (parseCellData(cell) as string)?.split(",").map(val => val.trim()) || []
                   : parseCellData(cell);
                }
              
            }
        })
        if (errors.length > 0){
            return { rowData: null, errors }
        }
        
        return { rowData, errors: null };
}



const handler = async (req: NextApiRequest & { file: any }, res: NextApiResponse) => {
    try {
    console.log("Got here!!!!!!!!!")
    const multerUpload = multer({ dest: "uploads/" }).single('file')
    console.log({ multerUpload })
    await runMiddleware(req, res, multerUpload)
    console.log("got to 2!!!!!!!!!!!")
    // Extract the Excel file from the request
    const file = req.file
    if (!file) {
        return res.status(400).json({ error: "No file uploaded" })
    }
    console.log({ file })
    const filePath = file.path as string
    // Load the Excel file
    const workbook = new Workbook()
    await workbook.xlsx.readFile(filePath)

    // Get the first worksheet
    const worksheet = workbook.getWorksheet(1)
    // delete file 
    await unLinkAsync(filePath)

    if (!worksheet){
        throw new Error('worksheet not found')
    }

    // process excel file
    const  data = processExcelData(worksheet, parseRowData)


    res.status(200).json({ message: "Partner sheet uploaded successfully", data  })
    }catch(error: any){
        console.error("Error uploading Excel file:", error)
        res.status(500).json({ message: error.message })
    }
}
export default handler
