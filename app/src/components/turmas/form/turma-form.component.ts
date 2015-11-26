import {Usuario} from './../../../common/services/usuario.service';
import {Turma} from './../../../common/services/turma.service';
import * as _ from 'lodash';
import {ITurma} from '../../../common/services/turma.service';

export function turmaForm() {
  return {
    restrict: 'E',
    template: require('./turma-form.component.html'),
    controller: FormComponent,
    controllerAs: 'form',
    bindToController: true
  };
}

class FormComponent {
  static $inject = ['$filter', '$scope', '$q', '$state', '$stateParams', '$mdDialog', 'Usuario', 'Turma'];

  public modelAlunos = [];

  public turma: ITurma;

  public loaded = false;

  public usuariosDisponiveis = [];

  private usuarios;

  constructor(private $filter, $scope, $q, private $state, $stateParams, private $mdDialog, private usuario: Usuario,
              private turmaService: Turma) {
    this.turma = this.turmaService.obterTurma($stateParams.id);
    this.usuarios = usuario.obterUsuarios();

    $q.all([this.usuarios.$loaded(), this.turma.$loaded()])
      .then(() => {
        this.usuarios.$watch(() => this.onUsuariosUpdate(this.usuarios));
        $scope.$watch('form.modelAlunos.length', () => this.onUsuariosUpdate(this.usuarios));

        this.modelAlunos = (this.turma.alunos || []).map(a => this.usuarios[a]).filter(u => u !== undefined);
        this.loaded = true;
      });

    $scope.$on('$destroy', () => {
      this.usuarios.$destroy();
      this.turma.$destroy();
    });
  }

  excluir($event) {
    const confirm = this.$mdDialog.confirm().title('Tem certeza que quer excluir esta turma?')
      .ariaLabel('Excluir turma').targetEvent($event).ok('Sim').cancel('Não');

    this.$mdDialog.show(confirm).then(() => {
      this.turma.$remove();
      this.voltar();
    });
  }

  voltar() {
    this.$state.go('turma-list');
  }


  onUsuariosUpdate(usuarios) {
    delete usuarios[this.usuario.authData.uid];

    let todosUsuarios = [];

    usuarios.forEach(u => todosUsuarios.push(u));

    this.modelAlunos = _.intersection(this.modelAlunos, todosUsuarios);
    this.usuariosDisponiveis = _.difference(todosUsuarios, this.modelAlunos);

    this.turma.alunos = this.modelAlunos.map(a => a.id);

    if (this.loaded) {
      this.turma.$save();
    }
  }

  filtrarUsuarios(query) {
    return this.$filter('filter')(this.usuariosDisponiveis, query, 'name');
  }
}
