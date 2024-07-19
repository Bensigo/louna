import type { NextApiRequest, NextApiResponse } from 'next';
// pages/api/recipes/excel-template.ts
import { Workbook } from 'exceljs';



// Function to generate Excel file for partners with column validation
const generatePartnerExcel = async () => {
    try {
        // Create workbook and worksheet
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Patners Entry', { properties: { defaultColWidth: 35 }});

        // Define headers
        const headers = [
            'name', 'bio', 'category',
            'sub-categories(comma separated))', 'phone', 'amenities(comma separated))', 'socials(comma separated))'
        ];

      
        

        // Add Header Row
        const headerRow = worksheet.addRow(headers);
      

        // Cell Style: Fill and Border
        headerRow.eachCell((cell, _) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFFFF00' },
                bgColor: { argb: 'FF0000FF' }
            }
            
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        });

        // validation for name  
        worksheet.dataValidations.add("A2:A100", {
            type: 'textLength',
            error: 'Text must be greater than 2',
            errorStyle: 'error',
            errorTitle: 'Invalid value',
            operator: 'greaterThanOrEqual',
            allowBlank: false,
            showErrorMessage: true,
            formulae: [2]
        })
 
        worksheet.dataValidations.add("B2:B100", {
            type: 'textLength',
            error: 'duration must be greater than 50 chars',
            errorStyle: 'error',
            errorTitle: 'Invalid value',
            operator: 'greaterThanOrEqual',
            allowBlank: false,
            showErrorMessage: true,
            formulae: [50]
        })
     
        worksheet.dataValidations.add("C2:C100", {
            type: 'list',
            error: 'Please select one',
            errorStyle: 'error',
            errorTitle: 'Invalid value',
            allowBlank: false,
            showErrorMessage: true,
            formulae: ['"Fitness","Wellness"']
        })
         
        worksheet.dataValidations.add("D2:D100", {
            type: 'textLength',
            error: 'Text must be greater than 8',
            errorStyle: 'error',
            errorTitle: 'Invalid value',
            operator: 'greaterThanOrEqual',
            allowBlank: false,
            showErrorMessage: true,
            formulae: [8]
         })

        // validation for diffculty type 
        worksheet.dataValidations.add("E2:E100", {
            type: 'textLength',
            error: 'Text must be greater than 8',
            errorStyle: 'error',
            errorTitle: 'Invalid value',
            operator: 'greaterThanOrEqual',
            allowBlank: false,
            showErrorMessage: true,
            formulae: [8]
         })


        worksheet.dataValidations.add("F2:F100", {
            type: 'textLength',
            error: 'Text must be greater than 8',
            errorStyle: 'error',
            errorTitle: 'Invalid value',
            operator: 'greaterThanOrEqual',
            allowBlank: false,
            showErrorMessage: true,
            formulae: [8]
         })


        worksheet.dataValidations.add("G2:G100", {
            type: 'textLength',
            error: 'Text must be greater than 8',
            errorStyle: 'error',
            errorTitle: 'Invalid value',
            operator: 'greaterThanOrEqual',
            allowBlank: false,
            showErrorMessage: true,
            formulae: [8]
         })


        // Generate Excel File with given name
        const excelBuffer = await workbook.xlsx.writeBuffer();
        return excelBuffer;
    } catch (error) {
        throw new Error(`Error generating Excel file: ${error}`);
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Generate Excel file
        const excelBuffer = await generatePartnerExcel();

        // Set response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=partner_entry.xlsx');
        // res.setHeader('Content-Length', excelBuffer.);

        // Send Excel file as response
        res.status(200).send(excelBuffer);
    } catch (error) {
        console.error('Error generating Excel template:', error);
        res.status(500).send('Internal Server Error');
    }
}
