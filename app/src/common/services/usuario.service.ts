import {Firebase} from './firebase.service';

export interface IPerfil extends AngularFireObject {
  id: string;
  name: string;
  image: string;
  professor: boolean;
}

export class Usuario {
  static $inject = ['Firebase', '$state'];

  public perfil: IPerfil;
  public authData: any;

  constructor(private firebase: Firebase, $state) {
    this.firebase.auth.$onAuth((data) => {
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
    this.perfil = <IPerfil>this.firebase.loadObject(`/usuarios/${this.authData.uid}`);
    this.setarDadosPerfil();
    return this.perfil.$loaded().then(() => {
      this.setarDadosPerfil();
      return this.perfil.$save();
    });
  }

  obterUsuarios() {
    return this.firebase.loadObject('/usuarios');
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
    return this.firebase.auth.$authWithOAuthPopup(provider);
  }

  logout() {
    this.firebase.unload();
    this.firebase.auth.$unauth();
    this.authData = null;
    this.perfil = null;
  }
}

loginRequired.$inject = ['Firebase'];

export function loginRequired(firebase: Firebase) {
  return firebase.auth.$requireAuth().then(user => {
    return user;
  });
}

