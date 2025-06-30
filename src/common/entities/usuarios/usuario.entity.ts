
export class Usuario {


    id?: string
    nombre: string
    apellido: string
    email: string
    telefono: string
    role: any
    dni: string
    username: string
    password: string
    chats?: any[]
    tokenDevices: string[]
    notifications: any[]
    activo: boolean
    profileURL?: string
    novedades?: any[]
    needReLogIn?: boolean
    anotaciones?: any[] = []

    constructor({ id = '', nombre = 'Usuario', apellido = '', email = '', telefono = '',
        role, username = '', dni = '111111', chats = new Array<any>(), password = '',
        tokenDevices = new Array<string>(), notifications = new Array<any>(), activo = true,
        profileURL = '', novedades = new Array<string>(), needReLogIn = false,
        anotaciones = new Array<string>() }) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.telefono = telefono;
        this.role = role;
        this.dni = dni;
        this.username = username;
        this.password = password
        this.chats = chats || [];
        this.tokenDevices = tokenDevices;
        this.notifications = notifications || [];
        this.activo = activo;
        this.profileURL = profileURL;
        this.novedades = novedades || [];
        this.needReLogIn = needReLogIn;
        this.anotaciones = anotaciones;
    }


    agregarNotificacion(notificacion: any) {
        this.notifications.push(notificacion);
    }

    agregarNovedad(novedad: any) {
        if (!this.novedades) {
            this.novedades = [];
        }
        this.novedades.push(novedad);
    }

    get fullName() { return `${this.nombre} ${this.apellido}` }
    get notificacionesOrdenadas() {
        if (!this.notifications) {
            return [];
        }
        return this.notifications.sort((a, b) => {
            return b.ts - a.ts;
        });


    }


    quitarNovedadesObra(obraId: string) {
        if (this.novedades == undefined)
            this.novedades = [];
        let novedades = this.novedades.filter(novedad => novedad.obraId != obraId);
        if (novedades.length != this.novedades.length) {
            this.novedades = this.novedades.filter(novedad => novedad.obraId != obraId);
        }
    }

    quitarNovedadPedido(id: any) {
        this.novedades = this.novedades?.filter(novedad => novedad.pedidoId != id);
    }



}