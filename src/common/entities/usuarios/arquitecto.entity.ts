import { Usuario } from "./usuario.entity";

export class Arquitecto extends Usuario{
    externo: boolean
    anotaciones: any[]
    
    constructor({id = '', nombre = 'Arquitecto', 
        apellido='', email='', 
        telefono='', externo = true, 
        dni = '', username = '',
        chats = new Array<any>(), password = '', 
        tokenDevices = new Array<string>(), notifications = new Array<any>(), 
        activo = true, profileURL = '', novedades = new Array<any>(), anotaciones = new Array<string>()}){
        super({id, nombre, apellido, email, telefono, role: 2, username, dni, chats, password, tokenDevices, notifications, activo, profileURL, novedades});
        this.externo = externo;
        this.anotaciones = anotaciones || [];
    }
}