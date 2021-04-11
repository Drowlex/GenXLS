import { Injectable } from '@nestjs/common';
import { HelpersUtilsService } from '../../resources/utils/helpers-utils.service';
import { ExcelService } from '../../resources/utils/excel-utils.service';
import { Firebird } from '../../database/Firebird';
import { environment } from '../../environments/environment';
import { CreateGeneratorDto } from './dto/create-generator.dto';

@Injectable()
export class GeneratorService {
  constructor(
    private helpersUtilsService: HelpersUtilsService,
    private firebird: Firebird
  ) {}
  /**
   * Service create Excel with firbird
   * @param payload 
   * @returns 
   */
  async createXlsIONFB( payload: CreateGeneratorDto ): Promise<any> {
    // Step 1 Validate the information received and organize...
    let array: Array<any> = await this.helpersUtilsService.jsonToArray(payload.data);

    // Step 2 Retrieve firebird info
    await this.firebird.setConfig(environment.database.firebird);
    let result: any = await this.firebird.execute(payload.query, array);
    // console.log("Result:", result);
    // return result;

    // Step 3 Create excel
    if ( result.success ) {
      // Get the fields to format by date
      let rules: Array<any> = this.helpersUtilsService.getRulesDate(payload.model);
      // Create new format with applied rules
      let data  = this.helpersUtilsService.getFormattedData(result.data, rules);
      let model_data = this.helpersUtilsService.getTitlesAndManipulateModel(payload.model);

      // Excel construction
      const excelService = new ExcelService();
      excelService.setTitle(payload.title);
      excelService.setFormat(payload.format);
      excelService.setHeaders(model_data.titles);
      excelService.setColumns(model_data.model);
      excelService.setPayload(data);
      
      let result_export: any = await excelService.exporting();
      return result_export;
    }
    return result;
  }

}
