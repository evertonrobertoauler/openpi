import {FirebaseService} from './firebase.service';
import {Usuario} from './usuario.service';

export interface IQuestao extends AngularFireObject {
  titulo: string;
  alternativas: string[];
}

export class Questoes {
  static $inject = ['$q', 'FirebaseService', 'Usuario'];

  constructor(private $q, private firebase: FirebaseService, private usuario: Usuario) {
  }

  obterQuestoes() {
    return this.firebase.loadArray(`/questoes/${this.usuario.id}`);
  }
}
