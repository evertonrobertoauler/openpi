import {Turma} from './../../../common/services/turma.service';

export function turmaList() {
  return {
    restrict: 'E',
    template: require('./turma-list.component.html'),
    controller: ListComponent,
    controllerAs: 'list',
    bindToController: true
  };
}

class ListComponent {
  static $inject = ['$filter', '$state', '$scope', 'Turma'];

  public turmas;

  constructor(private $filter, private $state, $scope, private turma: Turma) {
    this.turmas = turma.obterTurmas();

    $scope.$on('$destroy', () => this.turmas.$destroy());
  }

  abrirForm(turma) {
    this.$state.go('turma-form', {id: turma.$id});
  }

  novaTurma(dados) {
    this.turmas
      .$add({nome: dados.nome})
      .then(ref => this.$state.go('turma-form', {id: ref.key()}));

    dados.nome = '';
  }
}
