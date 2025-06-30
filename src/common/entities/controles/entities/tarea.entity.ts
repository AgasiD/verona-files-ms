export class Tarea{

    id: string;
    subetapa: string;
    descripcion: string;
    isDefault: boolean;
    orden: number;
    multi: boolean;

    iniciado?: boolean;
    realizado?: boolean;
    tsIniciado?: number;
    tsRealizado?: number;
    idUsuario?: string;
    
    constructor(id = '', 
        {
            subetapa = '', 
            descripcion = '', 
            isDefault = true, 
            orden = 0,
            multi = false,
            iniciado = false,
            realizado = false,
            tsIniciado = 0,
            tsRealizado = 0,
            idUsuario = '',
        }){
        this.id = id;
        this.subetapa = subetapa
        this.descripcion = descripcion;
        this.isDefault = isDefault;
        this.orden = orden || -1;
        this.multi = multi;
        this.iniciado = iniciado;
        this.realizado = realizado;
        this.tsIniciado = tsIniciado;
        this.tsRealizado = tsRealizado;
        this.idUsuario = idUsuario;
    }
}
