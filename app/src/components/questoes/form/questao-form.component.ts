import {Questao} from './../../../common/services/questao.service';

export function questaoForm() {
  return {
    restrict: 'E',
    template: require('./questao-form.component.html'),
    controller: FormComponent,
    controllerAs: 'form',
    bindToController: true
  };
}

class FormComponent {
  static $inject = ['Questao'];

  constructor(private questaoService: Questao) {
  }
}
