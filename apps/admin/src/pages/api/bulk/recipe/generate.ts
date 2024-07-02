import type { NextApiRequest, NextApiResponse } from 'next';
// pages/api/recipes/excel-template.ts
import { Workbook } from 'exceljs';

// Function to generate Excel file for recipes with column validation
const generateRecipeExcel = async () => {
    try {
        // Create workbook and worksheet
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Recipe Entry', { properties: { defaultColWidth: 35 }});

        // Define headers
        const headers = [
            'Name', 'Duration (in mins)','Calories', 'Meal Type',
            'Diet Type', 'Categories (comma separated)', 'Tags (comma separated)', 'Difficulty', 'Cuisine', 'contentType', 'description', 'allergens (comma separated)'
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
            formulae: [3]
        })
        // validation for duration
        worksheet.dataValidations.add("B2:B100", {
            type: 'whole',
            error: 'duration must be greater than 0',
            errorStyle: 'error',
            errorTitle: 'Invalid value',
            operator: 'greaterThanOrEqual',
            allowBlank: false,
            showErrorMessage: true,
            formulae: [0]
        })

          // validation for calories
          worksheet.dataValidations.add("C2:C100", {
            type: 'whole',
            error: 'calories must be greater than 0',
            errorStyle: 'error',
            errorTitle: 'Invalid value',
            operator: 'greaterThanOrEqual',
            allowBlank: false,
            showErrorMessage: true,
            formulae: [10]
        })

        // Define validation rules for Meal Type column
        worksheet.dataValidations.add("D2:D100", {
            type: 'list',
            error: 'Please select one',
            errorStyle: 'error',
            errorTitle: 'Invalid value',
            allowBlank: false,
            showErrorMessage: true,
            formulae: ['"BREAKFAST,LUNCH,DINNER,SNACK"']
        })
         // Define validation rules for Diet Type column
        worksheet.dataValidations.add("E2:E100", {
            type: 'list',
                error: 'Please select one',
                errorStyle: 'error',
                errorTitle: 'Invalid value',
                allowBlank: false,
                showErrorMessage: true,
                formulae: ['"Standard,Vegetarian,Vegan,Paleo"']
         })
        // validation for diffculty type 
        worksheet.dataValidations.add("H2:H100", {
            type: 'list',
                error: 'Please select one',
                errorStyle: 'error',
                errorTitle: 'Invalid value',
                allowBlank: false,
                showErrorMessage: true,
                formulae: ['"EASY,MEDIUM,HARD"']
         })
        // validation for cusine type 
        worksheet.dataValidations.add("I2:I100", {
            type: 'list',
                error: 'Please select one',
                errorStyle: 'error',
                errorTitle: 'Invalid value',
                allowBlank: false,
                showErrorMessage: true,
                formulae: ['"ITALIAN,MEXICAN,CHINESE, INDIAN,FRENCH, AFRICAN, JAPANESE, THAI, AMERICAN, MEDITERRANEAN,OTHER"']
         })

           // validation for content type 
        worksheet.dataValidations.add("J2:J100", {
            type: 'list',
                error: 'Please select one',
                errorStyle: 'error',
                errorTitle: 'Invalid value',
                allowBlank: true,
                showErrorMessage: true,
                formulae: ['"Freemium,Premium"']
         })

        // validation for content type 
        worksheet.dataValidations.add("K2:K100", {
                type: 'textLength',
                error: 'Text must be greater than 50',
                errorStyle: 'error',
                errorTitle: 'Invalid value',
                operator: 'greaterThanOrEqual',
                allowBlank: false,
                showErrorMessage: true,
                formulae: [50]
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
        const excelBuffer = await generateRecipeExcel();

        // Set response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=recipe_entry.xlsx');
        // res.setHeader('Content-Length', excelBuffer.);

        // Send Excel file as response
        res.status(200).send(excelBuffer);
    } catch (error) {
        console.error('Error generating Excel template:', error);
        res.status(500).send('Internal Server Error');
    }
}
