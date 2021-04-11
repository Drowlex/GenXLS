import { Controller, Post, Body, UsePipes, ValidationPipe, Res, HttpStatus } from '@nestjs/common';
import { GeneratorService } from './generator.service';
import { CreateGeneratorDto } from './dto/create-generator.dto';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('generator')
@Controller('generator')
export class GeneratorController {
  constructor(private readonly generatorService: GeneratorService) {}

  @Post('/firebird')
  @ApiOperation({ summary: 'Get file excel' })
  @ApiResponse({ status: 200, description: 'Get file Excel' })
  // With this I avoid that the query is executed if it does not have the corresponding parameters
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createXlsIONFB(@Res() res: Response, @Body() payload: CreateGeneratorDto) {
    let result = await this.generatorService.createXlsIONFB( payload );
    // return res.status(HttpStatus.CREATED).send(result);
    return (result.success) ? res.download(result.path, result.filename) : res.status(HttpStatus.CONFLICT).send(result.details);
  }
}
