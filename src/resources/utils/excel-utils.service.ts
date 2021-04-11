import * as ExcelJS from 'exceljs';
import * as shortid from 'shortid';
import * as moment from 'moment';
import * as fs from 'fs';

/**
 * Excel class
 * 
 * @class
 * 
 * @author
 *  @DKL
 */
export class ExcelService {
    path     : string = '';
    format   : string = '';
    workbook : any = null;
    worksheet: any = null;
    filename : string = null;
    payload  : Array<any> = [];
    title    : string = '';
    headers  : Array<string> = [];
    constructor() {
        this.path              = '/code/export';
        this.title             = '@DKL&Drowlex';
        this.workbook          = new ExcelJS.Workbook();
        this.worksheet         = this.workbook.addWorksheet(this.title, {properties: {tabColor: {argb: 'FFC0000'}}});
        this.filename          = `GenXLS-${shortid.generate()}.xlsx`;
        this.worksheet.columns = [];
    }
    private checkFolder() {
        try { 
            fs.mkdirSync(this.path); 
        } catch(error) { 
            console.log("🐛 [ExcelService > checkFolder]: ", error);
            if (error.code != 'EEXIST')  {
                throw error; 
            }
        } 
    }
    //Setters
    setTitle( _title: string ): void { 
        this.title = _title; 
    }
    setFormat( _format: string ): void { 
        this.format = _format; 
    }
    setHeaders( _headers: Array<string> ): void { 
        this.headers = _headers; 
    }
    setColumns( _columns: Array<any> ): void { 
        this.worksheet.columns = _columns; 
    }
    setPayload( _payload: Array<any> ): void { 
        this.payload = _payload; 
    }
    // Private method
    /**
     * Create title
     * 
     */
    private createTitle() {
        this.worksheet.addRow([this.title]).commit();
        this.worksheet.mergeCells(1,1,1,this.headers.length);
        this.worksheet.getCell('A1').alignment = { horizontal: 'center' };
        //Merge 2 objects with the propagation operator
        this.worksheet.getCell('A1').font = {
            name   : 'arial',
            color  : {argb: "FFFFFF"},
            family : 2,
            size   : 18,
            type   : 'pattern',
            pattern: 'darkTrellis',
        };
        this.worksheet.getCell('A1').fill = {
            type   : 'pattern',
            pattern: 'solid',
            fgColor: {
                argb: '00487B'
            }
        };
    }
    /**
     * Create Headers
     * 
     */
    private createHeaders() {
        let pos = 2;
        this.worksheet.addRow(this.headers).commit();
        for (let i = 1; i <= this.headers.length; i++) {
            this.worksheet.getRow(pos).getCell(i).alignment = { horizontal: 'center' };
            this.worksheet.getRow(pos).getCell(i).border = {
                bottom: {
                    style: 'thin', 
                    color: {
                        argb: '000000'
                    }
                }
            };
            //Merge 2 objects with the propagation operator
            this.worksheet.getRow(pos).getCell(i).font = {
                name   : 'arial',
                color  : {argb: "000000"},
                family : 2,
                size   : 12,
                type   : 'pattern',
                pattern: 'darkTrellis',
                bold   : true
            }
            this.worksheet.getRow(pos).getCell(i).fill = {
                type   : 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: 'BDBDBD'
                }
            }
        }
    }
    /**
     * Create of information.
     * 
     */
    private createBody() {
        this.payload.map(item => {
            console.log("📝 Escribiendo...",item);
            this.worksheet.addRow(item).commit();
        });
    }
    // Public method
    /**
     * Function create format
     * 
     * @returns 
     */
    async exporting(): Promise<any> {
        return new Promise( async(resolve, reject) => {
            try {
                await this.checkFolder();
                this.createTitle();
                this.createHeaders();
                this.createBody();
                
                console.log("📂 Exporting...", this.filename);
                let location = `${this.path}/${this.filename}`;

                await this.workbook.xlsx.writeFile(location);
                resolve({ success: true, path: location, filename: this.filename });
            } catch (error) {
                console.log("🐛 [ExcelService > exporting > catch]: ", error);
                resolve({ success: false, details: error });
            }
        });

    }

}