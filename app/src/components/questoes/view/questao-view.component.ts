import {Questao} from './../../../common/services/questao.service';

export function questaoView() {
  return {
    restrict: 'E',
    template: require('./questao-view.component.html'),
    controller: ViewComponent,
    controllerAs: 'view',
    bindToController: true
  };
}

class ViewComponent {
  static $inject = ['Questao'];

  constructor(private questaoService: Questao) {
  }
}
