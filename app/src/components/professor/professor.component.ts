import {Usuario} from './../../common/services/usuario.service';
import {IAula, StatusAvaliacao, Aula} from './../../common/services/aula.service';
import {Url} from './../../common/services/url.service';
import * as _ from 'lodash';

export function professor(): ng.IComponentOptions {
  return {
    template: require('./professor.component.html'),
    controller: ProfessorComponent
  };
}

class ProfessorComponent {
  static $inject = ['$scope', '$window', '$timeout', 'Usuario', 'Aula', 'Url'];

  public aula: IAula;
  public resultado;

  public status = StatusAvaliacao;

  constructor(private $scope, private $window, private $timeout, public usuarioService: Usuario,
              public aulaService: Aula, private urlService: Url) {
    if (this.usuarioService.perfil.aula) {
      this.aula = this.aulaService.obterAula(this.usuarioService.perfil.aula);
      this.aula.$watch(() => this.calcularResultado());
    } else {
      this.gerarNovoHash();
    }
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

        const longUrl = `${this.$window.location.origin}/#/aula/${hash}`;

        this.urlService.gerarShortUrl(longUrl).then(res => {
          this.aula.url = (res.result.id || '').replace('https://', '');
          this.aula.$save();
        });

        if (backup) {
          this.aula.pergunta = backup.pergunta || '';
          this.aula.alternativas = backup.alternativas || [];
          backup.$remove();
        }

        this.aula.$save();
        this.aula.$watch(() => this.calcularResultado());
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
    this.aula.status = this.status.INICIADA;
    this.aula.$save();
  }

  pausar() {
    this.aula.status = this.status.PAUSADA;
    this.aula.$save();
  }

  parar() {
    this.aula.status = this.status.PARADA;
    this.aula.respostas = null;
    this.aula.$save();
  }

  calcularResultado() {
    if (this.aula.status !== this.status.PARADA) {

      let totais = this.aula.alternativas.map(() => 0);
      let qtRespostas = 0;
      let qtAlunos = Object.keys(this.aula.respostas || {}).length;

      _.forEach(this.aula.respostas, (resposta: any) => {
        if (resposta.alternativa !== -1) {
          qtRespostas++;
          totais[resposta.alternativa]++;
        }
      });

      const rows = this.aula.alternativas.map((a, i) => {
        return {c: [{v: `${i + 1}) ${a}`}, {v: totais[i]}]};
      });

      this.resultado = {
        qtRespostas,
        qtAlunos,
        prRespostas: (qtRespostas / qtAlunos) * 100,
        chart: {
          type: 'PieChart',
          title: 'Resultado',
          data: {
            cols: [
              {id: 't', label: 'Alternativa', type: 'string'},
              {id: 's', label: 'Resultado', type: 'number'}
            ],
            rows
          }
        }
      };
    }
  }
}
