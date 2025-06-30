export class Notificacion{
    
    type: string;
    leido: boolean;
    title: string;
    subtitle: string;
    route: string;
    tsLectura: number;
    ts: number;

    constructor(type ,title ,subtitle ,route){
        this.type = type;
        this.leido = false;
        this.title = title;
        this.subtitle = subtitle;
        this.route = route;
        this.tsLectura;
        this.ts = Date.now();
    }
}