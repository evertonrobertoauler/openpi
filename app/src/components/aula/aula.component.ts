import {Usuario} from './../../common/services/usuario.service';

export function aula() {
  return {
    restrict: 'E',
    template: require('./aula.component.html'),
    controller: AulaComponent,
    controllerAs: 'aula',
    bindToController: true
  };
}

class AulaComponent {
  static $inject = ['Usuario'];

  constructor(public usuario: Usuario) {
  }
}
