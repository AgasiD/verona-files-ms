import { Admin } from "./admin.entity";
import { Arquitecto } from "./arquitecto.entity";
import { Comprador } from "./comprador.entity";
import { Obrero } from "./obrero.entity";
import { Propietario } from "./propietario.entity";
import { Repartidor } from "./repartidor.entity";
import { Usuario } from "./usuario.entity";

export class UserFactory{

    static newUser(usuario): Usuario{
        let user_factory;
        switch (usuario.role) {
            case 1:
              //Admin
              user_factory = new Admin(usuario);
              break;
            case 2:
              // PM - Arq
              user_factory = new Arquitecto(usuario);
              break;
            case 3:
              // Propietario
              user_factory = new Propietario(usuario);
              break;
            case 4:
              // Obrero
              user_factory = new Obrero(usuario);
              break;
            case 5:
              // Comprador
              user_factory = new Comprador(usuario);
              break;
            case 6:
              // Delivery
              user_factory = new Repartidor(usuario);
              break;
            case 7:
              // PM - Arq
              user_factory = new Arquitecto({ ...usuario, externo: false });
              break;
          }

          return user_factory;
    }

}