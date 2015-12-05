import {Usuario} from './../../common/services/usuario.service';
import {Aula} from './../../common/services/aula.service';

export function professor() {
  return {
    restrict: 'E',
    template: require('./professor.component.html'),
    controller: ProfessorComponent,
    controllerAs: 'professor',
    bindToController: true
  };
}

class ProfessorComponent {
  static $inject = ['Usuario', 'Aula'];

  constructor(public usuario: Usuario, public aula: Aula) {
  }
}
