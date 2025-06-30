import { IsBoolean, IsNumber, IsString, MinLength } from "class-validator"

export class TareaDTO {
    @IsString()
    @MinLength(2)
    obraId: string;

    @IsString()
    @MinLength(2)
    etapaId?: string;

    @IsString()
    @MinLength(2)
    subetapaId: string;

    @IsString()
    @MinLength(5)
    descripcion: string;

    @IsBoolean()
    isDefault: boolean;

    @IsBoolean()
    proximos?:boolean;

    @IsNumber()
    orden?: number
}