import { sign } from 'crypto';
import 'dotenv/config';
import * as joi from 'joi'

interface EnvVars {
    PORT: number;
    NATS_SERVERS: string[];
    GOOGLE_URI: string;
    SIGN: string,
    ROOT_FOLDER: string,
    NODE_ENV: string,
}

const envsSchema = joi.object({
    PORT: joi.number().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
    GOOGLE_URI: joi.string().uri().required(),
    SIGN: joi.string().required(),
    ROOT_FOLDER: joi.string().required(),
    NODE_ENV: joi.string().required(),
}).unknown(true)

const { error, value } = envsSchema.validate({
    ...process.env,
    NATS_SERVERS: process.env.NATS_SERVERS?.split(','),

})
if (error) {
    throw new Error('Config validation error: ' + error.message)
}

const envVars: EnvVars = value;

export const envs = {
    port: envVars.PORT,
    natsServers: envVars.NATS_SERVERS,
    googleURI: envVars.GOOGLE_URI,
    sign: envVars.SIGN,
    root_folder: envVars.ROOT_FOLDER,
    node_env: envVars.NODE_ENV,
    
}

