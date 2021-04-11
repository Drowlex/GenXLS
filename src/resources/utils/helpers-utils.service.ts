/**
 * Helpers Utils Service Class
 * Help functions
 * 
 * @class
 * 
 * @author
 *  @DKL
 */
export class HelpersUtilsService {
    /**
     * Convert json to array
     * 
     * @param data 
     * @returns 
     */
    async jsonToArray( data: any ) {
        let array = [];
        for (let key in data) {
            let obj = data[key]; 
            array.push((typeof obj == "string") ? (await this.apostrophesgenerator(obj, 3)) : obj);
        }
        return array;
    } 
    /**
     * This function generates apostrophes
     * 
     * @param data 
     * @param total 
     * @returns 
     */
    apostrophesgenerator( data: any , total: number ): any {
        if (data.length > 0) {
            let apos  = String.fromCharCode(39);
            let text  = '';
            let array = data.split(',');
            if (array.length > 1)
                for (let i = 0; i < total; i++)
                    text += apos;
            return `${text}${data}${text}`;
        }
        return null;
    }
    /**
     * Sorts the data in an array based on the position of the query inputs
     * 
     * @param model 
     * @returns 
     */
    getRulesDate( model: Array<any> ): Array<any> {
        let array = [];
        for (let item of model)
            if (item.hasOwnProperty('style'))
                if (item.style.hasOwnProperty('numFmt'))
                    array.push(item.key);
        return array;
    }
    /**
     * Apply a date format based on the applied rules
     * 
     * @param data 
     * @param rules 
     * @returns 
     */
     getFormattedData( data: Array<any>, rules: Array<string> ): Array<any> {
        return data.map( item => {
            rules.map( value => item[value] = new Date(item[value]));
            return item;
        });
    }
    /**
     * Gets the parameters needed to format headers and types separately, otherwise the headers are put in row A1
     * 
     * @param model 
     * @returns 
     */
    getTitlesAndManipulateModel( model: Array<any> ) {
        let titles  = [];
        for (let item of model) {
            titles.push(item.header);
            delete item.header;
        }
        return { titles: titles, model: model }
    }
}