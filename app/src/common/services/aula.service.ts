import {Firebase} from './firebase.service';

export class Aula {
  static $inject = ['Firebase'];

  constructor(private firebase: Firebase) {
  }

  obterPergunta() {
    return this.firebase.loadArray(``);
  }

  nomeDisponivel(nome: string) {
    return this.firebase.exists(`/aulas/${nome}`).then(exists => !exists);
  }
}
