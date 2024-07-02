import type { NextApiRequest, NextApiResponse } from "next"
import { Workbook, type Cell, type Row, type Worksheet } from "exceljs"
import multer from "multer"
import { prisma } from '@solu/admin-api'
import { unLinkAsync } from "../partner/upload"





export function runMiddleware(
    req: NextApiRequest & { [key: string]: any },
    res: NextApiResponse,
    fn: (...args: any[]) => void,
): Promise<any> {
    return new Promise((resolve, reject) => {
        fn(req, res, (result: any) => {
            if (result instanceof Error) {
                return reject(result)
            }

            return resolve(result)
        })
    })
}

enum MealType {
    BREAKFAST = "BREAKFAST",
    LUNCH = "LUNCH",
    DINNER = "DINNER",
    SNACK = "SNACK",
}

enum DietType {
    Standard = "Standard",
    Vegetarian = "Vegetarian",
    Vegan = "Vegan",
    Paleo = "Paleo",
}

enum PreparationDiffculty {
    EASY = "EASY",
    MEDIUM = "MEDIUM",
    HARD = "HARD",
}

enum ContentType {
    Freemium = "Freemium",
    Premium = "Premium",
}

enum CuisineType {
    ITALIAN = "ITALIAN",
    MEXICAN = "MEXICAN",
    CHINESE = "CHINESE",
    INDIAN = "INDIAN",
    FRENCH = "FRENCH",
    AFRICAN = "AFRICAN",
    JAPANESE = "JAPANESE",
    THAI = "THAI",
    AMERICAN = "AMERICAN",
    MEDITERRANEAN = "MEDITERRANEAN",
    OTHER = "OTHER",
}

type ProcessData = {
    name: string
    duration: number
    calories: number
    mealType: MealType
    dietType: DietType
    Categories: string[]
    tags: string[]
    difficulty: PreparationDiffculty
    cuisine: CuisineType
    contentType: ContentType
    description: string
    allergens: string[]
}

const optionalColNums = [6, 12]

const parseCellData = (cell: Cell): string | number | MealType | DietType | CuisineType | ContentType | null => {
    const value = cell.value;
    if (value === undefined || value === null) return null;
    if (typeof value === 'string') return value.trim();
    return value;
};

const parseRowData = (row: Row, rowNumber: number): { rowData: Partial<ProcessData> | null, errors: string[] | null} => {
    const rowData: Partial<ProcessData> = {};
    const cellMappings = [
        { index: 1, key: 'name' },
        { index: 2, key: 'duration' },
        { index: 3, key: 'calories' },
        { index: 4, key: 'mealType' },
        { index: 5, key: 'dietType' },
        { index: 6, key: 'categories', isSplit: true },
        { index: 7, key: 'tags', isSplit: true },
        { index: 8, key: 'difficulty' },
        { index: 9, key: 'cuisine' },
        { index: 10, key: 'contentType' },
        { index: 11, key: 'description' },
        { index: 12, key: 'allergens', isSplit: true }
    ];
    const errors: string[] = [];
    cellMappings.forEach(mapping => {
        const cell = row.getCell(mapping.index);
        const isRequired = !optionalColNums.includes(mapping.index);
        if (isRequired && (cell.value === undefined || cell.value === null)) {
            errors.push(`Missing value in column ${cell.col} in row ${rowNumber}`);
        } else {
            rowData[mapping?.key] = mapping.isSplit
                ? (parseCellData(cell) as string)?.split(",").map(val => val.trim()) || []
                : parseCellData(cell);
        }
    });
    if (errors.length > 0){
        return { rowData: null, errors }
    }
    
    return {rowData, errors: null };
};

export const processExcelData = (worksheet: Worksheet, parseRowData: (row: Row, rowNum: number) => any): ProcessData[] => {
    const data: ProcessData[] = [];
    const errors: string[] = [];

    worksheet.eachRow((row: Row, rowNumber: number) => {
        if (rowNumber === 1) return; // Skip header row

        const  { rowData, errors: rowErr } = parseRowData(row, rowNumber);
      
        if (!!rowErr && rowErr.length > 0) {
            errors.push(...rowErr)
        }
        if (rowData && rowData !== null){
            data.push(rowData as ProcessData);
        } 
       

    });
    if (errors.length > 0) {
        throw new Error(errors.join("\n"));
    }

    if (data.length === 0 && errors.length === 0) {
        throw new Error("No valid data found in the Excel file");
    }

   

    return data;
};



export const config = {
    api: {
        bodyParser: false, // Disabling bodyParser to handle multipart/form-data
    },
}

const handler = async (req: NextApiRequest  & { file: any }, res: NextApiResponse) => {
    try {
        const multerUpload = multer({ dest: "uploads/" }).single('file')
        await runMiddleware(req, res, multerUpload)
        // Extract the Excel file from the request
        const file = req.file
        if (!file) {
            return res.status(400).json({ error: "No file uploaded" })
        }

        const filePath = file.path as string
        // Load the Excel file
        const workbook = new Workbook()
        await workbook.xlsx.readFile(filePath)

        // Get the first worksheet
        const worksheet = workbook.getWorksheet(1)

         // delete file
         unLinkAsync(filePath)

         if (!worksheet){
            throw new Error('worksheet not found')
         }

        // Validate the Excel data
         const data = processExcelData(worksheet, parseRowData)

        

        const batchSize = 20
        const batches = []

        for (let i = 0; i <= data.length; i +=  batchSize){
            const batch = data.slice(i, i + batchSize);
            batches.push(batch)
        }

       for (const batch of batches){
            // handle prisma create here
            await prisma.recipe.createMany({
                data: batch
            })
       }

        res.status(200).json({ message: "Recipes uploaded successfully" })
    } catch (error: any) {
        console.error("Error uploading Excel file:", error)
        res.status(500).json({ message: error.message })
    }
}

export default handler

