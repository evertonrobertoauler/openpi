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
  static $inject = ['$filter', '$scope', '$stateParams', 'Usuario', 'Turma'];

  public modelAlunos = [];

  public turma: ITurma;

  public loaded = false;

  public usuariosDisponiveis = [];

  constructor(private $filter, $scope, $stateParams, private usuario: Usuario, private turmaService: Turma) {

    this.turma = this.turmaService.obterTurma($stateParams.id);

    usuario.obterUsuarios().then((usuarios) => {

      usuarios.$watch(() => this.onUsuariosUpdate(usuarios));
      $scope.$watch('form.modelAlunos.length', () => this.onUsuariosUpdate(usuarios));
      $scope.$on('$destroy', () => {
        usuarios.$destroy();
        this.turma.$destroy();
      });

      this.turma.$loaded(() => {
        this.modelAlunos = (this.turma.alunos || []).map(a => usuarios[a]).filter(u => u !== undefined);
        this.loaded = true;
      });
    });
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
