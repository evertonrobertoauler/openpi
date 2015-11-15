import * as Firebase from 'firebase';

export interface ITurma extends AngularFireObject {
  nome: string;
  alunos: string[];
  professor: string;
}

export class Turma {
  static $inject = ['FIREBASE_URL', '$firebaseArray', '$firebaseObject'];

  constructor(private FIREBASE_URL, private $firebaseArray, private $firebaseObject) {
  }

  obterTurmas() {
    return this.$firebaseArray(new Firebase(`${this.FIREBASE_URL}/turmas`));
  }

  obterTurma(id) {
    return this.$firebaseObject(new Firebase(`${this.FIREBASE_URL}/turmas/${id}`));
  }
}
