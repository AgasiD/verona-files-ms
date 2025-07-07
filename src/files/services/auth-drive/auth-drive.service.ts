import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { google } from 'googleapis';
import * as fs from 'fs/promises';
import * as path from 'path';
import { envs } from 'src/config/envs';

@Injectable()
export class AuthDriveService {
  private readonly logger = new Logger(AuthDriveService.name);
  private auth: any;
  private readonly SCOPES = ['https://www.googleapis.com/auth/drive'];
  private readonly CREDENTIALS_PATH = path.join(process.cwd(), 'config/google_credentials.json');
  private readonly TOKEN_PATH = path.join(process.cwd(), 'config/token.json');

  async getAuth() {
    if (!this.auth) await this.initializeAuth();


    try {
      // Esto refresca automáticamente el token si es necesario
      await this.auth.getAccessToken();
      return this.auth;
    } catch (err) {
      this.logger.error('Token inválido o vencido', err);
      throw new UnauthorizedException('No se pudo autenticar con Google Drive');
    }
  }

  private async initializeAuth() {
    const credentials = await this.leerCredentials();
    const { client_secret, client_id, redirect_uris } = credentials.installed;

    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    try {
      const token = await this.loadOrCreateToken(oAuth2Client);
      oAuth2Client.setCredentials(token);

      // Hook para guardar nuevos tokens (ej: refresh)
      oAuth2Client.on('tokens', async (tokens) => {
        if (tokens.access_token || tokens.refresh_token) {
          const updatedToken = { ...token, ...tokens };
          await this.saveTokenToFile(updatedToken);
          this.logger.log('Token actualizado y guardado en disco');
        }
      });

      this.auth = oAuth2Client;
    } catch (err) {
      this.logger.error('Error inicializando token de Google Drive', err);
      throw new UnauthorizedException('No se pudo autenticar con Google Drive');
    }
  }

  private async loadOrCreateToken(oAuth2Client: any): Promise<any> {
    try {
      const tokenJson = await fs.readFile(this.TOKEN_PATH, 'utf8');
      return JSON.parse(tokenJson);
    } catch (err) {
      this.logger.warn('Archivo de token no encontrado, generando uno nuevo...');

      const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: this.SCOPES,
      });

      console.log('\n🔐 Autorizá esta app visitando este URL:\n', authUrl);
      const readline = await import('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      const code: string = await new Promise((resolve) =>
        rl.question('\n📥 Ingresá el código de autorización: ', (input) => {
          rl.close();
          resolve(input);
        }),
      );

      const { tokens } = await oAuth2Client.getToken(code);
      await this.saveTokenToFile(tokens);
      return tokens;
    }
  }

  private async saveTokenToFile(token: any) {
    try {
      await fs.mkdir(path.dirname(this.TOKEN_PATH), { recursive: true });
      await fs.writeFile(this.TOKEN_PATH, JSON.stringify(token, null, 2), 'utf8');
    } catch (err) {
      this.logger.error('Error al guardar token en archivo', err);
    }
  }

  private async leerCredentials() {
    let credentials;
    switch (envs.setCredentialsWay) {
      case 'file':
        credentials = JSON.parse(await fs.readFile(this.CREDENTIALS_PATH, 'utf8'));
        break;
      case 'env':
        credentials = JSON.parse(envs.googleCredentials);
    }

    if (!credentials) {
      this.logger.error('No se encontraron credenciales de Google Drive');
      throw new UnauthorizedException('No se encontraron credenciales de Google Drive');
    }

    return credentials;



  }
}
