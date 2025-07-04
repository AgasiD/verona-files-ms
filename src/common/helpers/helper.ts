import { RpcException } from "@nestjs/microservices";
const fs = require('fs').promises;
var jwt = require('jsonwebtoken');



export function handlerError(err: any) {
  let exception_info;
  let custom_error = err;
  if( err.error?.status ) {
    custom_error = err.error;
  }

  switch (custom_error.status) {
    case 404:
      exception_info = { status: 404, message: err.statusText ?? err.message ?? 'Error' }
      break
    case 401:
      exception_info = { status: 401, message: err.statusText ?? err.message ?? 'Error' }
      break;
    case 403:
      exception_info = { status: 403, message: err.statusText ?? err.message ?? 'Error' }
      break;
    default:
      exception_info = { status: 500, message: err.statusText ?? err.message ?? 'Error' }
  }

  throw new RpcException(exception_info)

}



export function addDays(date: string, days) {
  let result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function getFullDate(dia = new Date()): string {
  return (
    dia.getFullYear() + '-' + (dia.getMonth() + 1) + '-' + dia.getUTCDate()
  );
}

export function getDataFromJSON(array) {
  const arrayResult = Object.keys(array).map(item => {
    return {
      id: item,
      attributes: array[item]
    }
  });
  return arrayResult;
}


export async function leerArchivo(path) {

    let data = await fs.readFile(`${path}`);
    return data;
  
}


export async function encriptarPassword(password) {
  const bcrypt = require('bcrypt');
  try {
    const saltRounds = 10; // cuanto mayor el número, más seguro (y más lento)
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (err) {
    throw new Error('Error al encriptar la contraseña');
  }
};
