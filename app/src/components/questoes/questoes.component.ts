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

class QuestoesComponent {
  static $inject = ['Questoes'];

  texto: string;

  questoes: AngularFireArray;

  constructor(private questoesService: Questoes) {
    this.texto = EXEMPLO.join('\n');

    this.questoes = this.questoesService.obterQuestoes();

    // this.questoes.$loaded().then(() => {
    //   this.questoes.$add({
    //     titulo: 'Pergunta ?',
    //     alternativas: ['Sim', 'Não', 'Talves']
    //   });
    // });
  }
}
