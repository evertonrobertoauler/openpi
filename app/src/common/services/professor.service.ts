import {Usuario} from './usuario.service';
import {Aula, IAula, StatusAvaliacao} from './aula.service';
import {IQuestao} from './questoes.service';
import {Url} from './url.service';

export class Professor {
  static $inject = ['$q', '$window', 'Usuario', 'Aula', 'Url'];

  constructor(private $q, private $window, private usuarioService: Usuario, private aulaService: Aula,
              private urlService: Url) {
  }

  obterAula() {
    if (this.usuarioService.perfil.aula) {
      return this.$q.when(this.aulaService.obterAula(this.usuarioService.perfil.aula));
    } else {
      return this.gerarNovoHash();
    }
  }

  gerarNovoHash(backup?: IAula) {
    return this.aulaService
      .obterHashDisponivel()
      .then(hash => {
        this.usuarioService.perfil.aula = hash;
        this.usuarioService.perfil.$save();

        const aula = this.aulaService.obterAula(hash);
        aula.status = StatusAvaliacao.PARADA;
        aula.professor = this.usuarioService.perfil;

        const longUrl = `${this.$window.location.origin}/#/aula/${hash}`;

        this.urlService.gerarShortUrl(longUrl).then(res => {
          aula.url = (res.result.id || '').replace('https://', '');
          aula.$save();
        });

        if (backup) {
          aula.pergunta = backup.pergunta || '';
          aula.alternativas = backup.alternativas || [];
          backup.$remove();
        }

        aula.$save();

        return aula;
      });
  }

  iniciarAtividade(questao: IQuestao, force = false) {
    return this.obterAula().then((aula: IAula) => {
      if (!force && aula.status !== StatusAvaliacao.PARADA) {
        return this.$q.reject('Você tem outra avaliação em andamento, tem certeza que deseja substituí-la?');
      } else {
        aula.status = StatusAvaliacao.INICIADA;
        aula.pergunta = questao.titulo;
        aula.alternativas = questao.alternativas;
        aula.respostas = null;
        aula.$save();
      }
    });
  }
}
