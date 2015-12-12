import {Firebase} from './firebase.service';
import {IPerfil} from './usuario.service';
import * as _ from 'lodash';

export interface IAula extends AngularFireObject {
  url: string;
  professor: IPerfil;
  pergunta: string;
  alternativas: string[];
  status: number;
  respostas: any;
}

export enum StatusAvaliacao {
  INICIADA,
  PAUSADA,
  PARADA
}

export class Aula {
  static $inject = ['$q', 'Firebase'];

  public authData: any;

  constructor(private $q, private firebase: Firebase) {
  }

  obterAulaAluno(hash: string) {
    let auth = this.firebase.auth.$getAuth()
      ? this.$q.when(this.firebase.auth.$getAuth())
      : this.firebase.auth.$authAnonymously();

    return auth
      .then(authData => {
        this.authData = authData;
        return this.firebase.exists(`/aulas/${hash}`);
      })
      .then((exists) => {
        if (!exists) {
          return this.$q.reject();
        } else {
          let [aula, resposta] = [this.obterAula(hash), this.obterRespostaAula(hash)];
          return {aula, resposta};
        }
      });
  }

  obterAula(hash: string) {
    return <IAula>this.firebase.loadObject(`/aulas/${hash}`);
  }

  obterRespostaAula(hash: string) {
    return <IAula>this.firebase.loadObject(`/aulas/${hash}/respostas/${this.authData.uid}`);
  }

  hashDisponivel(hash: string) {
    return this.firebase.exists(`/aulas/${hash}`).then(exists => !exists);
  }

  gerarHash(tamanho: number = 5) {
    const alfabeto = 'abcdefghijklmnopqrstuvwxyz0123456789';

    return _
      .range(tamanho)
      .reduce((text) => text + alfabeto.charAt(Math.floor(Math.random() * alfabeto.length)), '');
  }

  obterHashDisponivel() {
    const hash = this.gerarHash();

    return this
      .hashDisponivel(hash)
      .then(disponivel => disponivel ? hash : this.obterHashDisponivel());
  }
}
