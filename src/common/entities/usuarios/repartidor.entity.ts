import { Usuario } from "./usuario.entity";

export class Repartidor extends Usuario {

    constructor({id = '',  nombre = 'Repartidor', apellido = 'apellido', email = 'email', 
        telefono = 'telefono', dni = '1111111', username = 'username', chats = new Array<any>(), 
        password = '', tokenDevices = new Array<any>(), notifications = new Array<any>(), activo = true, profileURL = '', novedades = new Array<any>() }) {
        super({id, nombre, apellido, email, telefono, role:6, username, dni, chats, password, tokenDevices, notifications, activo, profileURL, novedades});
    }
}


