import {Aula, StatusAvaliacao} from './../../common/services/aula.service';

export function aula() {
  return {
    restrict: 'E',
    template: require('./aula.component.html'),
    controller: AulaComponent,
    controllerAs: 'aula',
    bindToController: true
  };
}

class AulaComponent {
  static $inject = ['$stateParams', 'Aula'];

  public aula;
  public resposta;
  public disponivel: boolean;

  public status = StatusAvaliacao;

  constructor($stateParams, aulaService: Aula) {

    if ($stateParams.hash) {
      aulaService
        .obterAulaAluno($stateParams.hash)
        .then(dados => {
          this.disponivel = true;

          this.aula = dados.aula;
          this.resposta = dados.resposta;

          this.aula.$watch(() => {
            if (this.aula.status === this.status.INICIADA) {
              this.setarRespostaDefault();
            }

            this.disponivel = this.aula.status !== undefined;
          });
        })
        .catch(() => this.disponivel = false);
    } else {
      this.disponivel = false;
    }
  }

  setarRespostaDefault() {
    if (this.resposta.alternativa === undefined) {
      this.resposta.alternativa = -1;
      this.resposta.$save();
    }
  }

  responder() {
    this.resposta.tentativas = (this.resposta.tentativas || []).concat([this.resposta.alternativa]);
    this.resposta.$save();
  }
}
