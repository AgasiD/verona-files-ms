import { Catch, RpcExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements RpcExceptionFilter<RpcException> {
    catch(exception: RpcException, host: ArgumentsHost) {

        const ctx = host.switchToRpc()
        const response = ctx.getContext();
        const rpcError = exception.getError()

        if (
            typeof rpcError === 'object' &&
            'status' in rpcError &&
            'message' in rpcError) {
            const status = isNaN(+rpcError.status!) ? 400 : +rpcError.status!;
            response.status(status).json(rpcError);
            return new Observable()

        }


        if (
            typeof rpcError === 'object' &&
            'message' in rpcError &&
            rpcError.message!.toString().includes('Empty response. There are no subscribers listening')
        ) {
            const status = 500
            console.log(rpcError.message)
            response.status(status).json(
                {
                    status,
                    message: 'Empty response. There are no subscribers listening'
                }
            );
            return new Observable()
        }



        response.status(400).json({
            status: 400,
            message: rpcError
        })


        return new Observable()
    }
}