import {Usuario} from './../../common/services/usuario.service';

export function perfil() {
  return {
    restrict: 'E',
    template: require('./perfil.component.html'),
    controller: PerfilComponent,
    controllerAs: 'perfil',
    bindToController: true
  };
}

class PerfilComponent {
  static $inject = ['Usuario'];

  constructor(public usuario: Usuario) {
  }
}
