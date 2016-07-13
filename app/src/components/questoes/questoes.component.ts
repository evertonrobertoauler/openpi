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
  static $inject = [];

  texto: string;

  constructor() {
    this.texto = EXEMPLO.join('\n');
  }
}
