import { Injectable } from '@nestjs/common';
import { handlerError } from '../../../common/helpers/helper';
import { google } from 'googleapis';
import { AuthDriveService } from '../auth-drive/auth-drive.service';
import { basename, join, resolve } from 'path';
import * as fs from 'fs';
import { envs } from 'src/config/envs';

@Injectable()
export class DriveService {


    token: string;
    ROOT_FOLDER: string;
    SCOPES: string[] = [];
    TOKEN_PATH: string;
    keyFile: string;

    constructor(private readonly driveAuthService: AuthDriveService) {
        this.token = '';
        this.ROOT_FOLDER = envs.root_folder!;
        this.SCOPES = [
            'https://www.googleapis.com/auth/drive',
        ]
        this.TOKEN_PATH = 'enviroments/' + envs.node_env + '/token.json';
    }

    async getFolder(folderType, folderID) {
        try {
            let folders = (await this.filesInFolder(folderID));
            if (!folders) throw new Error('Error al recuperar archivos');
            switch (folderType) {
                case 0:
                    let carpetaFotos = (folders.filter(folder => folder.name?.toUpperCase().includes('12-FOTOS DE OBRA')))[0]
                    let foldersFotos = (await this.filesInFolder({ folderId: carpetaFotos.id}));
                    if (!foldersFotos) throw new Error('Error al recuperar archivos');
                    return (folders.filter(folder => folder.name?.toUpperCase().includes('01-PEDIDOS/EVIDENCIAS')))[0].id
                case 1:
                    return (folders.filter(folder => folder.name?.toUpperCase().includes('00-CLIENTE')))[0].id
                case 2:
                    let imagesFolder = (folders.filter(folder => folder.name?.includes('06-FOTOS DE OBRA')))[0]
                    if (imagesFolder.shortcutDetails) return imagesFolder.shortcutDetails.targetId;
                    return imagesFolder.id;
                case 3:
                    let clienteFolder = (folders.filter(folder => folder.name?.includes('00-CLIENTE')))[0]
                    let imagenesFolder = (await this.filesInFolder({ folderId: clienteFolder.id}))!;
                    return (imagenesFolder.filter(folder => folder.name?.includes('06-FOTOS DE OBRA')))[0].id;
            }
        } catch (err) {
            handlerError(err)
        }
    }

    async filesInFolder({folderId}) {
        try {
            let auth = await this.driveAuthService.getAuth()
            const drive = google.drive({ version: 'v3', auth });
            const config = {
                corpora: 'allDrives',
                includeItemsFromAllDrives: true,
                supportsAllDrives: true,
                includeTeamDriveItems: true,
                q: `parents='${folderId}'`,
                fields: 'nextPageToken, files(id, name, mimeType, thumbnailLink, permissions, shortcutDetails(targetId))',
            }
            const response = await drive.files.list(config).catch(err => console.log(err));
            return response?.data.files || [];
        } catch (error) {
            handlerError(error)
        }
    }

    async updateFile(id, fileMetadata) {
        try {
            let auth = await this.driveAuthService.getAuth()
            const drive = google.drive({ version: 'v3', auth });
            let update = await drive.files.update({
                fileId: id,
                requestBody: fileMetadata,
                fields: 'id'
            });
            return update.data.id;
        } catch (err) {
            handlerError(err)
        }
    }

    async addFileFromPath({nombre, parentFolderId, extension}) {

        let auth = await this.driveAuthService.getAuth()
        const drive = google.drive({ version: 'v3', auth });
        const fileMetadata = {
            'parents': [parentFolderId],
            'name': basename(`${nombre}`),
            'type': 'anyone',
            'role': 'reader',
        };
        const readTo = join(process.cwd() + '/src', 'uploads', `${nombre}.${extension}`);
        const media = {
            mimeType: this.getType(extension),
            body: fs.createReadStream(readTo)
        };
        const imgResponse = await drive.files.create({
            supportsAllDrives: true,
            media,
            fields: 'id',
            supportsTeamDrives: true,
            requestBody: fileMetadata
        }).catch(err => {
            console.log(err)
        });

        //elimino la imagen de memoria
        this.unlinkImage(readTo);

        return imgResponse?.data.id;
    }


    async addFileFromStream({stream, parentFolderId, nombre, extension}) {

        parentFolderId = '1PFu2CkSYgfPj-mxW5epIwgTmJ8Ty5UJC';
        let auth = await this.driveAuthService.getAuth()
        const drive = google.drive({ version: 'v3', auth });
        const fileMetadata = {
            'parents': [parentFolderId],
            'name': `${basename(nombre)}`,
        };
        const media = {
            mimeType: this.getType(extension),
            body: stream
        };
        const imgResponse = await drive.files.create({
            supportsAllDrives: true,
            media,
            fields: 'id',
            supportsTeamDrives: true,
            requestBody: fileMetadata
        })

        return imgResponse?.data.id;
    }

    async addFolder(name:string, parentId?:string) {
        let auth = await this.driveAuthService.getAuth()
        const drive = google.drive({ version: 'v3', auth });
        // si es undefines tomo valor de raiz, sino valor de carpeta
        if (!parentId) {
            parentId = this.ROOT_FOLDER
        }
        var fileMetadata = {
            'parents': [parentId],
            'name': name,
            'mimeType': 'application/vnd.google-apps.folder',
        };
        try {
            let response = await drive.files.create({
                supportsAllDrives: true,
                fields: 'id',
                supportsTeamDrives: true,
                requestBody: fileMetadata,
            });
            console.log(`Carpeta ${name} creada con éxito`)
            return response.data.id;
        } catch (err) {
            console.log('Error al crear carpeta en G-Drive')
            handlerError(err)

        }
    }

    async setPermissions(fileId) {
        let auth = await this.driveAuthService.getAuth()
        const drive = google.drive({ version: 'v3', auth });
        var permisos = {
            type: 'anyone',
            role: 'reader',
        };

        var permisoResponse = await drive.permissions.create({
            supportsTeamDrives: true,
            supportsAllDrives: true,
            requestBody: permisos,
            fileId: fileId,
            fields: 'id',
        });
        return permisoResponse;
    }


    private getType(type) {
        let extension = '';
        switch (type) {
            case 'pdf':
                extension = 'application/pdf';
                break;
            case 'jpg':
                extension = 'image/jpeg';
                break;
            case 'docx':
                extension = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                break;
            case 'xls':
                extension = 'application/vnd.ms-excel'
                break;
            case 'json':
                extension = 'application/json';
                break;
        }
        return extension;
    }

    private unlinkImage(path) {
        fs.unlink(path, (err) => {
            if (err) {
                console.log('Error al borrar imagen: ', err);
                throw err;
            }
        })
    }

}