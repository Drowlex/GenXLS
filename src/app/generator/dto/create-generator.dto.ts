import { IsNotEmpty, IsArray, IsObject, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGeneratorDto {


    @ApiProperty({ type: String, example: "Report Test", description: 'Receive the title of the report' })
    @IsNotEmpty()
    @IsString()
    title: string;  
    
    @ApiProperty({ type: String, example: "DD/MM/YYYY", description: 'Receive date format' })
    @IsNotEmpty()
    @IsString()
    format: string;

    @ApiProperty({ type: Array, example: `[{"header": "TituloA","key": "CampoA"},{"header": "TituloB","key": "CampoB"},{"header": "TituloC.","key": "CampoC","style": {"numFmt": "mm/dd/yyyy"}}]`, description: 'Receives the data from the excel header' })
    @IsNotEmpty()
    @IsArray()
    model: Array<any>;

    @ApiProperty({ type: Object, example: `{"key1": "val1","key2": "val2","key3": "val3"}`, description: 'Receives the data that is passed in the query' })
    @IsNotEmpty()
    @IsObject()
    data: any;

    @ApiProperty({ type: String, example: "SELECT * FROM dummy WHERE val1 = ? AND val2 = ? AND val3 = ?", description: 'Receives a query to execute' })
    @IsNotEmpty()
    @IsString()
    query: string;
}
