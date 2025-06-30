import { Usuario } from "./usuario.entity";

export class Propietario extends Usuario{
    anotaciones: any[]
    constructor({id = '', nombre = 'Propietario', apellido='', email='', telefono='', 
        dni = '999999', username = '',chats = new Array<any>(), password = '', tokenDevices = new Array<any>(), notifications = new Array<any>(), 
        activo = true, profileURL = '', novedades = new Array<any>(), anotaciones = new Array<any>()}){
        super({id, nombre, apellido, email, telefono, role:3, username, dni, chats, password, tokenDevices, notifications, activo, profileURL, novedades});
        this.anotaciones = anotaciones || [];

    }
}
