import {Firebase} from './firebase.service';
import {Usuario} from './usuario.service';
import * as _ from 'lodash';

export interface IAula extends AngularFireObject {
  hash: string;
  professor: string;
  pergunta: string;
  alternativas: string[];
  status: number;
}

export enum StatusVotacao {
  INICIADA,
  PAUSADA,
  PARADA
}

export class Aula {
  static $inject = ['$q', 'Firebase', 'Usuario'];

  public authData: any;

  constructor(private $q, private firebase: Firebase, private usuario: Usuario) {
  }

  obterAulaAluno(hash: string) {
    let auth = this.firebase.auth.$getAuth()
      ? this.$q.when(this.firebase.auth.$getAuth())
      : this.firebase.auth.$authAnonymously();

    return auth.then(authData => {
      this.authData = authData;
      return this.obterAula(hash);
    });
  }

  obterAula(hash: string) {
    return <IAula>this.firebase.loadObject(`/aulas/${hash}`);
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
