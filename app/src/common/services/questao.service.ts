import {Firebase} from './firebase.service';

export class Questao {
  static $inject = ['Firebase'];

  constructor(private firebase: Firebase) {
  }

  obterAvaliacoes() {
    return this.firebase.loadArray(``);
  }
}
