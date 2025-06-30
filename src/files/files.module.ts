import { Module } from '@nestjs/common';

import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { NatsModule } from 'src/nats/nats.module';
import { AuthDriveService } from './services/auth-drive/auth-drive.service';
import { DriveService } from './services/drive/drive.service';

@Module({
  controllers: [FilesController],
  providers: [FilesService, AuthDriveService, DriveService],
  imports: [NatsModule]
})
export class FilesModule {}
