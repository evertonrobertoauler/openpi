import {Usuario} from './../../common/services/usuario.service';
import {IAula, StatusVotacao, Aula} from './../../common/services/aula.service';

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
  static $inject = ['$scope', 'Usuario', 'Aula'];

  public aula: IAula;

  public status = StatusVotacao;

  constructor(private $scope, public usuarioService: Usuario, public aulaService: Aula) {
    if (this.usuarioService.perfil.aula) {
      this.aula = this.aulaService.obterAula(this.usuarioService.perfil.aula);
    } else {
      this.gerarNovoHash();
    }
  }

  get url() {
    return this.aula ? 'https://openpi.firebaseapp.com/#/aula/' + this.aula.hash : '';
  }

  gerarNovoHash() {
    if (this.aula) {
      this.aula.$remove();
      this.usuarioService.perfil.aula = null;
      this.usuarioService.perfil.$save();
    }

    return this.aulaService
      .obterHashDisponivel()
      .then(hash => {
        this.aula = this.aulaService.obterAula(hash);
        this.aula.status = this.status.PARADA;
        this.aula.hash = hash;
        this.aula.professor = this.usuarioService.perfil.id;
        this.aula.$save();

        this.usuarioService.perfil.aula = hash;
        this.usuarioService.perfil.$save();
      });
  }

  limpar() {
    this.aula.pergunta = '';
    this.aula.alternativas = [];
    this.aula.$save();
  }

  adicionarAlternativa(alternativa: string) {
    if (alternativa) {
      this.aula.alternativas = (this.aula.alternativas || []).concat([alternativa]);
      this.aula.$save();
      this.$scope.$broadcast('nova-alternativa-focus');
    }
  }

  editarAlternativa(index: number, alternativa: string) {
    if (alternativa) {
      this.aula.alternativas[index] = alternativa;
    } else {
      this.aula.alternativas.splice(index, 1);
      this.$scope.$broadcast('nova-alternativa-focus');
    }

    this.aula.$save();
  }

  iniciar() {
    this.aula.status = this.status.INICIADA;
    this.aula.$save();
  }

  pausar() {
    this.aula.status = this.status.PAUSADA;
    this.aula.$save();
  }

  parar() {
    this.aula.status = this.status.PARADA;
    this.aula.$save();
  }
}
