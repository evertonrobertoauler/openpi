import {Usuario} from './../../common/services/usuario.service';

export function login() {
  return {
    restrict: 'E',
    template: require('./login.component.html'),
    controller: LoginComponent,
    controllerAs: 'login',
    bindToController: true
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
