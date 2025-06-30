import { HttpError } from "./httpError.entity";

export class MyResponse {

    data: any;
    fallo: boolean;
    error?: string;

    constructor( data, error?:HttpError) {
        this.data = data;
        this.fallo = error?.fallo ?? false;
        this.error = error?.descripcion;

    }
}

