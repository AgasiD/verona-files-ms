import { Injectable } from '@nestjs/common';
import { DriveService } from './services/drive/drive.service';
import { Readable } from 'stream';
import { obtenerBackup } from './jobs/backup.job';

enum FolderType {
    IMAGES_PEDIDOS = 0,
    FOLDER_CLIENTE = 1,
    FOLDER_PROPS = 2,
    FOLDER_IMAGES = 3,
    FOLDER_ARTICULOS = 4
}


@Injectable()
export class FilesService {
    
    
    constructor(private readonly driveService: DriveService) {
    }
    
    async saveBackup(backupFolderId: any) {

      return await obtenerBackup(this.driveService, backupFolderId)
    }

    async generarCarpetasDrive(nombre) {

        const fs = require('fs');
        const path_esquema = process.cwd() + '/src/assets/esquema_carpetas_drive.json';

        let rawdata = fs.readFileSync(path_esquema);
        const carpetas = JSON.parse(rawdata);
        let idRaizObra = await this.agregarCarpeta(nombre, process.env.ROOT_FOLDER);
        for (let carpeta of carpetas) {
            let idCarpeta = await this.agregarCarpeta(carpeta.nombre, idRaizObra!);
            carpeta.subcarpetas.forEach(async subcarpeta => {
                await this.agregarCarpeta(subcarpeta.nombre, idCarpeta!);
            })
        };

        return idRaizObra;
    }

    async obtenerArticulosObraFile(driveFolderId: string) {
        let folder_obra = await this.driveService.filesInFolder({ folderId: driveFolderId });
        let folder_diseno = folder_obra!.filter(f => f.name!.toUpperCase().includes('DISEÑO DE INTERIOR') || f.name!.toUpperCase().includes('DISEÑO INTERIOR'));
        if (folder_diseno.length > 0) {
            let articulos_obra = (await this.driveService.filesInFolder({ folderId: folder_diseno[0].id }))!.filter(f => f.name!.toLowerCase().includes('detalles interiorismo'));
            if (articulos_obra.length > 0) {
                return articulos_obra[0];
            }
        }
    }


    async obtenerArchivos({ folderId }) {
        return await this.driveService.filesInFolder({ folderId });
    }
    async obtenerCarpetaImagenesPedido(rootFolderId) {
        return await this.driveService.getFolder(FolderType.IMAGES_PEDIDOS, rootFolderId)
    }
    async obtenerCarpetaProp(rootFolderId) {
        return await this.driveService.getFolder(FolderType.FOLDER_PROPS, rootFolderId)
    }
    async obtenerCarpetaCliente(rootFolderId) {
        return await this.driveService.getFolder(FolderType.FOLDER_CLIENTE, rootFolderId)
    }
    async obtenerCarpetaImagenes(rootFolderId) {
        return await this.driveService.getFolder(FolderType.FOLDER_IMAGES, rootFolderId)
    }
    async agregarArchivo({ nombre, parentFolderId, extension, file }) {
        const stream = Readable.from(Buffer.from(file.buffer.data));
        return await this.driveService.addFileFromStream({ nombre, parentFolderId, extension, stream });
    }
    async agregarCarpeta(nombre: string, parentFolderId?: string) {
        return await this.driveService.addFolder(nombre, parentFolderId);
    }
    async darPermisos(fileId) {
        return await this.driveService.setPermissions(fileId);

    }

}
