import {Usuario} from './../../common/services/usuario.service';

export function app(): ng.IComponentOptions {
  return {
    template: require('./app.component.html'),
    controller: AppComponent
  };
}

class AppComponent {
  static $inject = ['Usuario'];

  public usuario: Usuario;

  constructor(usuario: Usuario) {
    this.usuario = usuario;
  }
}
