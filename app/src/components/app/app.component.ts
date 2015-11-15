import {Usuario} from './../../common/services/usuario.service';

export function app() {
  return {
    restrict: 'E',
    template: require('./app.component.html'),
    controller: AppComponent,
    controllerAs: 'app',
    bindToController: true
  };
}

class AppComponent {
  static $inject = ['Usuario'];

  public usuario: Usuario;

  constructor(usuario: Usuario) {
    this.usuario = usuario;
  }
}
