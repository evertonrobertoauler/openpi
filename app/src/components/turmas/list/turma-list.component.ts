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
  static $inject = ['$filter', '$state', 'Turma'];

  public turmas;

  public loaded = false;

  constructor(private $filter, private $state, private turma: Turma) {
    this.turmas = turma.obterTurmas();

    this.turmas.$loaded(() => this.loaded = true);
  }

  abrirForm(turma) {
    this.$state.go('turma-view', {id: turma.$id});
  }

  novaTurma(dados) {
    this.turmas
      .$add({nome: dados.nome})
      .then((ref: Firebase) => {
        ref.setPriority(-Date.now());
        this.$state.go('turma-form', {id: ref.key()});
      });

    dados.nome = '';
  }
}
