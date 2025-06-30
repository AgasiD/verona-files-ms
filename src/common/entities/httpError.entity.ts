export class HttpError {

    fallo: boolean
    descripcion: string

    constructor(descripcion = ''){
        this.fallo = true;
        this.descripcion = descripcion
    }
}
