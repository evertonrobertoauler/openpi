import {ITurma, Turma} from './../../../common/services/turma.service';
import {IPerfil} from './../../../common/services/usuario.service';

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
  static $inject = ['$stateParams', '$state', '$mdDialog', 'Turma'];

  public turma: ITurma;
  public alunos: IPerfil[];

  constructor($stateParams, private $state, private $mdDialog, private turmaService: Turma) {

    this.turma = this.turmaService.obterTurma($stateParams.id);

    this.turmaService
      .obterAlunos(this.turma)
      .then(alunos => this.alunos = alunos);
  }

  voltar() {
    this.$state.go('turma-list');
  }

  editar() {
    this.$state.go('turma-form', {id: this.turma.$id});
  }

  excluir($event) {
    const confirm = this.$mdDialog.confirm()
      .title('Tem certeza que deseja excluir esta turma?')
      .ariaLabel('Excluir turma').targetEvent($event).ok('Sim').cancel('Não');

    this.$mdDialog.show(confirm).then(() => {
      this.turma.$remove();
      this.voltar();
    });
  }
}
