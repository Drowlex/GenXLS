import * as  fbsql from 'node-firebird';

/**
 * Firebird class
 * 
 * @class
 * 
 * @author
 *  @DKL
 */

export class Firebird {
    private config: any;
    setConfig( _config: any ) { this.config = _config; }
    async execute( query: any, data: any = '' ) {
        return new Promise((resolve, reject) => {
            let pool = fbsql.pool(20, this.config);
            try {
                pool.get(( error, db ) => {
                    if (error) {
                        console.log("🐛 [Firebird > execute > get]: ", error);
                        resolve({ success: false, details: error.message });
                        return;
                    }
                    // console.log("\n\tQuery:", query);
                    // console.log("\n\tFilters:", JSON.stringify(data));
                    db.query(query, data, ( error, result ) => {
                        if (error) {
                            console.log("🐛 [Firebird > execute > query]: ", error);
                            resolve({ success: false, details: error.message });
                            return;
                        }
                        for (let item in result) {
                            for (let key in result[item]) {
                                // result[item][key] = result[item][key].toString('utf8');
                                if (result[item][key]) result[item][key] = result[item][key].toString();
                                // else result[item][key] = null;
                            }
                        }
                        // reject({ success: false, message: 'testing' });
                        resolve({ success: true, data: result });
                    });

                    db.detach( (error) => { 
                        if (error) {
                            console.log("🐛 [Firebird > execute > detach]: ", error);
                            resolve({ success: false, details: error.message });
                            return;
                        }
                    });
                });
            } catch (error) {
                console.log("🐛 [Firebird > execute > catch]: ", error);
                resolve({ success: false, details: error.message });
                return;
            }
        });
    }
}