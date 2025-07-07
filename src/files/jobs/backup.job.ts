import { RpcException } from "@nestjs/microservices";
import axios from "axios";
import { getFullDate } from "src/common/helpers/helper";
import { envs } from "src/config/envs";
import { DriveService } from "../services/drive/drive.service";
import { Readable } from "stream";
import { Logger } from "@nestjs/common";

export const obtenerBackup = async (driveService: DriveService, rootBackupFolder) => {

    const days = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO']
    const day = new Date().getDay();
    try {
        const url = `${envs.googleURI}/.json`
        console.log('Recuperando base de datos...');

        let response = await axios.get(url);
        if (response.status >= 300) throw new RpcException(response.statusText);

        let data = Readable.from(Buffer.from(JSON.stringify(response.data)));

        const parameters = {
            nombre: `${days[day]}-${getFullDate()}`,
            parentFolderId: rootBackupFolder,
            extension: 'json',
            stream: data
        }

        await driveService.addFileFromStream(parameters)
        console.log('Base de datos grabada')
        return { success: true };

    } catch (err) {
        Logger.error('Error al generar respaldo de la base de datos:', err);
        return {
            success: false,
            message: 'No se pudo generar respaldo de la base de datos. ' + err.message,
        }
    }
}