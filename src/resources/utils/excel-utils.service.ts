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
    subtitle : string = '';
    headers  : Array<string> = [];
    filters  : any = null;
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
    setSubtitle( subtitle: string ): void { 
        this.subtitle += `${subtitle} - Generated on ${moment().format(this.format)} to ${moment().format("hh:mm A")}`;
    }
    setFormat( _format: string ): void { 
        this.format = _format; 
    }
    setFilters( _filters: Array<any> ): void { 
        this.filters = _filters; 
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
    private createTitle() {
        let title = this.title;
        if ( this.filters.hasOwnProperty('FECHAINI') ) {
            // console.log("🤓FechaIni",this.filters.FECHAINI);
            // console.log("🤓FechaFin",this.filters.FECHAFIN);
            let objFini = new Date(this.filters.FECHAINI);
            let objFfin = new Date(this.filters.FECHAFIN);
            let fechaIni = moment(objFini).format(this.format);
            let fechaFin = moment(objFfin).format(this.format);
            // console.log("\n\tFormato:", this.format,"\n");
            // console.log("🐥FechaIni",fechaIni);
            // console.log("🐥FechaFin", fechaFin);

            title = `${this.title} del ${fechaIni} al ${fechaFin}`;
        }
        // Definimos el encabezado
        this.worksheet.addRow([title]).commit();
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
                argb: '8b0000'
            }
        };
    }
    private createFilters() {
        this.worksheet.addRow([JSON.stringify(this.filters)]).commit();
        this.worksheet.mergeCells(2,1,2,this.headers.length);
        this.worksheet.getCell('A2').alignment = { horizontal: 'center' };
        this.worksheet.getCell('A2').font = {
            name   : 'arial',
            color  : {argb: "FFFFFF"},
            family : 2,
            size   : 10,
            type   : 'pattern',
            pattern: 'darkTrellis',
        };
        this.worksheet.getCell('A2').fill = {
            type   : 'pattern',
            pattern: 'solid',
            fgColor: {
                argb: '8b0000'
            }
        };
    }
    private createSubtitle() {
        this.worksheet.addRow([this.subtitle]).commit();
        this.worksheet.mergeCells(3,1,3,this.headers.length);
        this.worksheet.getCell('A3').alignment = { horizontal: 'center' };
        //Merge 2 objects with the propagation operator
        this.worksheet.getCell('A3').font = {
            name   : 'arial',
            color  : {argb: "FFFFFF"},
            family : 2,
            size   : 13,
            type   : 'pattern',
            pattern: 'darkTrellis',
        };
        this.worksheet.getCell('A3').fill = {
            type   : 'pattern',
            pattern: 'solid',
            fgColor: {
                argb: '8b0000'
            }
        };

    }
    private createHeaders() {
        this.worksheet.addRow(this.headers).commit();
        for (let i = 1; i <= this.headers.length; i++) {
            this.worksheet.getRow(4).getCell(i).alignment = { horizontal: 'center' };
            this.worksheet.getRow(4).getCell(i).border = {
                bottom: {
                    style: 'thin', 
                    color: {
                        argb: '000000'
                    }
                }
            };
            //Merge 2 objects with the propagation operator
            this.worksheet.getRow(4).getCell(i).font = {
                name   : 'arial',
                color  : {argb: "000000"},
                family : 2,
                size   : 12,
                type   : 'pattern',
                pattern: 'darkTrellis',
                bold   : true
            }
            this.worksheet.getRow(4).getCell(i).fill = {
                type   : 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: 'C0C0C0'
                }
            }
        }
    }
    /**
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
                this.createFilters();
                this.createSubtitle();
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