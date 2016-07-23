import {Questoes, IQuestao} from './../../common/services/questoes.service';

export function questoes(): ng.IComponentOptions {
  return {
    template: require('./questoes.component.html'),
    controller: QuestoesComponent
  };
}

const EXEMPLO = [
  '1. Pergunta 1?',
  'a) Sim',
  'b) Não',
  '2. Pergunta 2?',
  'a) Sim',
  'b) Não',
  'c) Talvez',
];

const REGEXP_PERGUNTA = /^\s*\d+\s*\.\s*/;
const REGEXP_ALTERNATIVA = /^\s*\w+\s*\)\s*/;

class QuestoesComponent {
  static $inject = ['Questoes', '$mdDialog'];

  placeholder: string = EXEMPLO.join('\n');

  texto: string = '';

  questoes: AngularFireArray;

  constructor(private questoesService: Questoes, private $mdDialog: angular.material.IDialogService) {
    this.questoes = this.questoesService.obterQuestoes();
  }

  importarPerguntas($event) {
    const questoes = this.parseQuestoes(this.texto);

    this.$mdDialog
      .show({
        targetEvent: $event,
        template: require('./importacao.dialog.html'),
        controller: ImportacaoDialogController,
        controllerAs: '$ctrl',
        bindToController: true,
        locals: {questoes}
      })
      .then(() => questoes.map(questao => this.questoes.$add(questao)))
      .then(() => this.texto = '');
  }

  limparBanco($event) {
    const confirm = this.$mdDialog.confirm()
      .title('Tem certeza que deseja limpar o seu banco de questões?')
      .ariaLabel('Confirmar ação')
      .targetEvent($event)
      .ok('Limpar')
      .cancel('Não');

    this.$mdDialog.show(confirm).then(() => <any>this.questoes.$ref().remove());
  }

  apagarQuestao($event, questao: IQuestao) {
    const confirm = this.$mdDialog.confirm()
      .title('Tem certeza que deseja excluir?')
      .ariaLabel('Confirmar ação')
      .targetEvent($event)
      .ok('Excluir')
      .cancel('Não');

    this.$mdDialog.show(confirm).then(() => this.questoes.$remove(questao));
  }

  parseQuestoes(texto: string): IQuestao[] {
    const parser = (previous: IQuestao[], str: string) => {
      if (str.match(REGEXP_PERGUNTA)) {
        return [...previous, <IQuestao>{titulo: str.replace(REGEXP_PERGUNTA, ''), alternativas: []}];
      } else if (previous.length) {
        const questao = previous.pop();

        if (str.match(REGEXP_ALTERNATIVA)) {
          questao.alternativas = [...questao.alternativas, str.replace(REGEXP_ALTERNATIVA, '')];
        } else if (str && questao.alternativas.length) {
          const alternativa = questao.alternativas.pop();
          questao.alternativas = [...questao.alternativas, alternativa + '\n' + str];
        } else if (str) {
          questao.titulo = questao.titulo + '\n' + str;
        }

        return [...previous, questao];
      } else {
        return previous;
      }
    };

    const validate = (questao: IQuestao) => {
      return questao.titulo && questao.alternativas.length > 1;
    };

    return texto.split('\n').reduce(parser, []).filter(validate);
  }
}

class ImportacaoDialogController {
  static $inject = ['$mdDialog'];

  questoes: IQuestao[];

  constructor(private $mdDialog: angular.material.IDialogService) {
  }

  fechar() {
    this.$mdDialog.cancel();
  }

  importar() {
    this.$mdDialog.hide();
  }
}
