import { Usuario } from "./usuario.entity";

export class Comprador extends Usuario{
    
    constructor({id = '', nombre = 'Comprador', apellido='',
         email='', telefono='', dni = '99999', username = '', 
         chats = new Array<any>(), password = '', tokenDevices = new Array<any>(), 
         notifications = new Array<any>(), activo = true, profileURL = '', novedades = new Array<any>()}){
        super({id, nombre, apellido, email, telefono, role:5, username, dni, chats, password, tokenDevices, notifications, activo, profileURL, novedades});
    }
}