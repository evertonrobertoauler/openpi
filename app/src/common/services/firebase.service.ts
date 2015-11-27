import * as FirebaseLib from 'firebase';
import * as _ from 'lodash';

export class Firebase {
  static $inject = ['FIREBASE_URL', '$firebaseArray', '$firebaseObject', '$firebaseAuth'];

  public auth: AngularFireAuth;

  private cache = {};

  constructor(private FIREBASE_URL, private $firebaseArray, private $firebaseObject, private $firebaseAuth) {
    this.auth = this.$firebaseAuth(new FirebaseLib(this.FIREBASE_URL));
  }

  loadArray(path): AngularFireArray {
    if (!this.cache[path]) {
      this.cache[path] = this.$firebaseArray(new FirebaseLib(this.FIREBASE_URL + path));
    }

    return this.cache[path];
  }

  loadObject(path): AngularFireObject {
    if (!this.cache[path]) {
      this.cache[path] = this.$firebaseObject(new FirebaseLib(this.FIREBASE_URL + path));
    }

    return this.cache[path];
  }

  unload() {
    _.forEach(<any[]>this.cache, ref => ref.$destroy());
    this.cache = {};
  }
}
