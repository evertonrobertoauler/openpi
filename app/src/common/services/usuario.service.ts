import {Firebase} from './firebase.service';

export interface IPerfil extends AngularFireObject {
  id: string;
  nome: string;
  foto: string;
  aula: string;
}

export class Usuario {
  static $inject = ['Firebase', '$state'];

  public perfil: IPerfil;
  public authData: any;

  constructor(private firebase: Firebase, private $state) {
  }

  salvarPerfil() {
    this.perfil = <IPerfil>this.firebase.loadObject(`/usuarios/${this.authData.uid}`);
    this.setarDadosPerfil();
    return this.perfil.$loaded().then(() => {
      this.setarDadosPerfil();
      return this.perfil.$save();
    });
  }

  setarDadosPerfil() {
    this.perfil.id = this.id;
    this.perfil.nome = this.nome;
    this.perfil.foto = this.foto;
  }

  get id() {
    return this.authData && this.authData.uid;
  }

  get nome() {
    if (this.authData) {
      if (this.authData.facebook) {
        return this.authData.facebook.displayName;
      }
      if (this.authData.google) {
        return this.authData.google.displayName;
      }
    }
  }

  get foto() {
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
    return this.firebase.auth
      .$authWithOAuthPopup(provider)
      .then(() => this.$state.go('professor'));
  }

  logout() {
    this.firebase.unload();
    this.firebase.auth.$unauth();
    this.authData = null;
    this.perfil = null;
  }
}

loginRequired.$inject = ['Firebase', 'Usuario'];

export function loginRequired(firebase: Firebase, usuario: Usuario) {
  return firebase.auth.$requireAuth().then(authData => {
    if (authData.provider !== 'anonymous') {
      usuario.authData = authData;
      return usuario.salvarPerfil();
    } else {
      throw new Error('Login required!');
    }
  });
}

