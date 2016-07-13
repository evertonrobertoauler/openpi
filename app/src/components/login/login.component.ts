import {Usuario} from './../../common/services/usuario.service';

export function login(): ng.IComponentOptions {
  return {
    template: require('./login.component.html'),
    controller: LoginComponent
  };
}

class LoginComponent {
  static $inject = ['Usuario'];

  public usuario: Usuario;

  constructor(usuario: Usuario) {
    this.usuario = usuario;
    this.usuario.logout();
  }
}
