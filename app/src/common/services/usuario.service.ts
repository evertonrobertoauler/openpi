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
    return this.authData && this.authData.displayName;
  }

  get foto() {
    return this.authData && this.authData.photoURL;
  }

  login(provider) {
    return this.firebase.auth
      .$signInWithPopup(provider)
      .then(() => this.$state.go('professor'))
      .catch(function (error) {
        console.error('Authentication failed:', error);
      });
  }

  logout() {
    this.firebase.unload();
    this.firebase.auth.$signOut();
    this.authData = null;
    this.perfil = null;
  }
}

loginRequired.$inject = ['Firebase', 'Usuario'];

export function loginRequired(firebase: Firebase, usuario: Usuario) {
  return firebase.auth.$requireSignIn().then(authData => {
    if (authData.provider !== 'anonymous') {
      usuario.authData = authData;
      return usuario.salvarPerfil();
    } else {
      throw new Error('Login required!');
    }
  });
}

