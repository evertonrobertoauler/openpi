import {Usuario} from './../../common/services/usuario.service';
import {IAula, StatusAvaliacao, Aula} from './../../common/services/aula.service';

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
  static $inject = ['$scope', '$timeout', 'Usuario', 'Aula'];

  public aula: IAula;

  public status = StatusAvaliacao;

  constructor(private $scope, private $timeout, public usuarioService: Usuario, public aulaService: Aula) {
    if (this.usuarioService.perfil.aula) {
      this.aula = this.aulaService.obterAula(this.usuarioService.perfil.aula);
    } else {
      this.gerarNovoHash();
    }
  }

  get url() {
    const aula = this.aula && this.aula.professor && this.aula.professor.aula;
    return aula ? 'https://openpi.firebaseapp.com/#/aula/' + aula : '';
  }

  gerarNovoHash() {
    let backup = this.aula;

    return this.aulaService
      .obterHashDisponivel()
      .then(hash => {
        this.usuarioService.perfil.aula = hash;
        this.usuarioService.perfil.$save();

        this.aula = this.aulaService.obterAula(hash);
        this.aula.status = this.status.PARADA;
        this.aula.professor = this.usuarioService.perfil;

        if (backup) {
          this.aula.pergunta = backup.pergunta || '';
          this.aula.alternativas = backup.alternativas || [];
          backup.$remove();
        }

        this.aula.$save();
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
      this.$timeout(() => this.$scope.$broadcast(`alternativa-${this.aula.alternativas.length - 1}-focus`), 50);
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
    if (this.aula.status === this.status.PARADA) {
      this.aula.respostas = null;
    }

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
