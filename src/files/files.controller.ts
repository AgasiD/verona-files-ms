import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FilesService } from './files.service';

@Controller()
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @MessagePattern('files.getFiles')
  async obtenerDocuementos(@Payload() payload: any) {
    return await this.filesService.obtenerArchivos(payload);
  }

  @MessagePattern('files.newFile')
  async newFile(@Payload() payload) {
    const { nombre, parentFolderId, extension, file } = payload;
    const data = await this.filesService.agregarArchivo(payload);
    await this.filesService.darPermisos(data)
    return { id: data };
  }

  @MessagePattern('files.backup')
  async saveBackup(@Payload() payload: any){
    const data = await this.filesService.saveBackup(payload.backupFolderId)
    return data;
  }
}
