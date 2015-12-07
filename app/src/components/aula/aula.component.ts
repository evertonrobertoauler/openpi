import {Aula} from './../../common/services/aula.service';

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
  static $inject = ['$stateParams', 'Aula'];

  public aula: any;

  constructor($stateParams, aulaService: Aula) {
    aulaService
      .obterAulaAluno($stateParams.hash)
      .then(aula => {
        console.log(aulaService.authData);
        this.aula = aula;
      });
  }
}
