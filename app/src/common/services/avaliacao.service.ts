import {Firebase} from './firebase.service';

export class Avaliacao {
  static $inject = ['Firebase'];

  constructor(private firebase: Firebase) {
  }

  obterAvaliacoes() {
    return this.firebase.loadArray(``);
  }
}
