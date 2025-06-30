import { Tarea } from "./tarea.entity";

export class SubEtapa {

    id: string;
    etapa: string;
    subEtapa: string;
    descripcion: string;
    isDefault: boolean;
    orden: number;
    obraId?: string;
    tareas?: Tarea[];
    constructor({ id = '', obraId, etapa = '', subEtapa = '', descripcion = '', isDefault = true, orden = -1, tareas = [] }) {
        this.id = id
        this.etapa = etapa
        this.subEtapa = subEtapa;
        this.descripcion = descripcion;
        this.isDefault = isDefault;
        this.orden = orden;
        this.obraId = obraId;
        this.tareas = (tareas as Tarea[]).map( (tarea) => new Tarea(tarea.id, tarea));
    }


    get cantTareas(): number { return this.tareas!.length };
    get cantTareasTerminadas(): number {
        return this.tareas!.filter((element) => element.realizado).length;
    }
    get cantTareasIniciadas(): number { return this.tareas!.filter((element) => element.iniciado && !element.realizado).length; }
    get realizado(): boolean { return this.cantTareasTerminadas == this.cantTareas; }
    get porcentajeRealizado() {
        let porcen;
        this.tareas!.length > 0
            ? porcen = Number.parseFloat(
                ((this.cantTareasTerminadas + (this.cantTareasIniciadas / 2)) / this.tareas!.length * 100).toFixed(2))
            : porcen = 0;
            
            return porcen
    }
}
