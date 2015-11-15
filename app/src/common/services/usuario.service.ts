import * as Firebase from 'firebase';

interface IPerfil extends AngularFireObject {
  id: string;
  name: string;
  image: string;
  professor: boolean;
}

export class Usuario {
  static $inject = ['FIREBASE_URL', '$firebaseAuth', '$firebaseObject', '$state'];

  public authObj: AngularFireAuth;
  public perfil: IPerfil;
  public authData: any;

  constructor(private FIREBASE_URL, $firebaseAuth, private $firebaseObject, $state) {
    this.authObj = $firebaseAuth(new Firebase(this.FIREBASE_URL));

    this.authObj.$onAuth((data) => {
      if (data) {
        this.authData = data;
        this.salvarPerfil();
        if ($state.is('login')) {
          $state.go('inicio');
        }
      }
    });
  }

  salvarPerfil() {
    this.perfil = this.$firebaseObject(new Firebase(`${this.FIREBASE_URL}/usuarios/${this.authData.uid}`));
    this.setarDadosPerfil();
    return this.perfil.$loaded().then(() => {
      this.setarDadosPerfil();
      return this.perfil.$save();
    });
  }

  obterUsuarios() {
    return this.$firebaseObject(new Firebase(`${this.FIREBASE_URL}/usuarios`)).$loaded();
  }

  setarDadosPerfil() {
    this.perfil.id = this.authData.uid;
    this.perfil.name = this.name;
    this.perfil.image = this.image;
  }

  get name() {
    if (this.authData) {
      if (this.authData.facebook) {
        return this.authData.facebook.displayName;
      }
      if (this.authData.google) {
        return this.authData.google.displayName;
      }
    }
  }

  get image() {
    if (this.authData) {
      if (this.authData.facebook) {
        return this.authData.facebook.profileImageURL;
      }
      if (this.authData.google) {
        return this.authData.google.profileImageURL;
      }
    }
  }

  login(provider) {
    return this.authObj.$authWithOAuthPopup(provider);
  }

  logout() {
    this.authObj.$unauth();
    this.authData = null;

    if (this.perfil) {
      this.perfil.$destroy();
      this.perfil = null;
    }
  }
}

loginRequired.$inject = ['Usuario'];

export function loginRequired(usuario: Usuario) {
  return usuario.authObj.$requireAuth().then(user => {
    return user;
  });
}

