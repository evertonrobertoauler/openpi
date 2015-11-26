import {Turma} from './../../../common/services/turma.service';

export function turmaView() {
  return {
    restrict: 'E',
    template: require('./turma-view.component.html'),
    controller: ViewComponent,
    controllerAs: 'view',
    bindToController: true
  };
}

class ViewComponent {
  static $inject = ['$scope', '$stateParams', 'Turma'];

  public turma;

  constructor($scope, $stateParams, private turmaService: Turma) {
    this.turma = this.turmaService.obterTurma($stateParams.id);

    $scope.$on('$destroy', () => this.turma.$destroy());
  }
}
