import * as firebase from 'firebase';
import * as _ from 'lodash';

export class FirebaseService {
  static $inject = ['FIREBASE_CONFIG', '$firebaseArray', '$firebaseObject', '$firebaseAuth', '$q'];

  public auth: any;

  private cache = {};
  private lib: any = firebase;

  constructor(private FIREBASE_CONFIG, private $firebaseArray, private $firebaseObject, $firebaseAuth, private $q) {
    this.lib.initializeApp(this.FIREBASE_CONFIG);
    this.auth = $firebaseAuth();
  }

  loadArray(path): AngularFireArray {
    if (!this.cache[path]) {
      this.cache[path] = this.$firebaseArray(this.lib.database().ref(path));
    }

    return this.cache[path];
  }

  loadObject(path): AngularFireObject {
    if (!this.cache[path]) {
      this.cache[path] = this.$firebaseObject(this.lib.database().ref(path));
    }

    return this.cache[path];
  }

  exists(path) {
    return this.$q((resolve, reject) => {
      const ref = this.lib.database().ref(path);
      ref.once('value', value => resolve(value.exists()), reject);
    });
  }


  unload() {
    _.forEach(<any[]>this.cache, ref => ref.$destroy());
    this.cache = {};
  }
}
