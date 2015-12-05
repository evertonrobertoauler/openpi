import * as FirebaseLib from 'firebase';
import * as _ from 'lodash';

export class Firebase {
  static $inject = ['FIREBASE_URL', '$firebaseArray', '$firebaseObject', '$firebaseAuth', '$q'];

  public auth: AngularFireAuth;

  private cache = {};

  constructor(private FIREBASE_URL, private $firebaseArray, private $firebaseObject, $firebaseAuth, private $q) {
    this.auth = $firebaseAuth(new FirebaseLib(this.FIREBASE_URL));
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

  exists(path) {
    return this.$q((resolve, reject) => {
      const ref = (new FirebaseLib(this.FIREBASE_URL + path));
      ref.once('value', value => resolve(value.exists()), reject);
    });
  }


  unload() {
    _.forEach(<any[]>this.cache, ref => ref.$destroy());
    this.cache = {};
  }
}
