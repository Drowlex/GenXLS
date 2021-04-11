import { Module } from '@nestjs/common';
import { GeneratorService } from './generator.service';
import { GeneratorController } from './generator.controller';
import { Firebird } from '../../database/Firebird';
import { HelpersUtilsService } from '../../resources/utils/helpers-utils.service';
import { ExcelService } from '../../resources/utils/excel-utils.service';


@Module({
  controllers: [GeneratorController],
  providers: [
    GeneratorService,
    Firebird,
    HelpersUtilsService,
    ExcelService
  ]
})
export class GeneratorModule {}
