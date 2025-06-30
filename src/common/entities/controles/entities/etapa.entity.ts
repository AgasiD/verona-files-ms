import { SubEtapa } from "./subetapa.entity";

export class Etapa {

    id: string;
    etapa: string;
    descripcion: string;
    isDefault: boolean;
    orden: number;
    subetapas?: SubEtapa[]

    constructor({
        id = '',
        etapa = '',
        descripcion = '',
        isDefault = true,
        orden = -1,
        subetapas
    }) {
        this.id = id;
        this.etapa = etapa;
        this.descripcion = descripcion;
        this.isDefault = isDefault;
        this.orden = orden == null ? -1 : orden;
        this.subetapas = subetapas?.map(sub => new SubEtapa(sub));
    }


    get cantSubEtapas() { return this.subetapas?.length };
    get cantTareasTerminadas() {
        let terminadas = 0;
        if(!this.subetapas) return 0;
        if (this.subetapas!.length > 0) {
            this.subetapas!.forEach((sub) => {
                terminadas += sub.cantTareasTerminadas;
            });
        }
        return terminadas;
    }

    get cantSubtareasIniciadas() {
        let iniciadas = 0;
        if(!this.subetapas) return 0;
        if (this.subetapas!.length > 0) {
            this.subetapas!.forEach((sub) => {
                iniciadas += sub.cantTareasIniciadas;
            });
        }
        return iniciadas;
    }

    get totalTareas() {
        let total = 0;
        if(!this.subetapas) return 0;
        if (this.subetapas!.length > 0) {
            this.subetapas!.forEach((sub) => {
                total += sub.cantTareas;
            });
            return total;
        }
        return 1;
    }

    get porcentajeRealizado() {

        let porcen
        this.totalTareas > 0
            ? porcen = Number.parseFloat(
                ((this.cantTareasTerminadas + (this.cantSubtareasIniciadas / 2)) / this.totalTareas * 100).toFixed(2))
            : porcen = 0;

            return porcen;
    }
}

