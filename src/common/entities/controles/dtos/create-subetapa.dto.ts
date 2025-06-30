import { IsBoolean, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateSubetapaDTO{

    @IsString()
    @IsOptional()
    id?: string

    @IsString()
    @MinLength(5)
    obraId: string; 
    @IsString()
    @MinLength(5)
    etapaId: string; 
    @IsString()
    @MinLength(5)
    descripcion: string; 

    @IsBoolean()
    isDefault: boolean; 

    @IsBoolean()
    proximos?: boolean;

    @IsNumber()
    @IsPositive()
    orden?: number;
}