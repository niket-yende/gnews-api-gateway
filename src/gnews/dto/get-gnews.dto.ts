/* eslint-disable new-cap */
import {IsOptional, IsString} from 'class-validator';
import {Expose} from 'class-transformer';

export default class GetGnewsDto {
    @Expose()
    @IsString({message: 'The query is required.'})
      q: string;

    @Expose()
    @IsString()
    @IsOptional()
      max?: string;

    @Expose()
    @IsString()
    @IsOptional()
      in?: string;

    @Expose()
    @IsString()
    @IsOptional()
      lang?: string;
}
