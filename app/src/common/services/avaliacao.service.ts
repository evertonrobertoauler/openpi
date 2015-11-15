import * as Firebase from 'firebase';

export class Avaliacao {
  static $inject = ['FIREBASE_URL', '$firebaseArray'];

  constructor(private FIREBASE_URL, private $firebaseArray) {
  }

  obterAvaliacoes() {
    return this.$firebaseArray(new Firebase(`${this.FIREBASE_URL}/turmas`)).$loaded();
  }
}
