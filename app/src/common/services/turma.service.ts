import {Firebase} from './firebase.service';
import {Usuario} from './usuario.service';

export interface ITurma extends AngularFireObject {
  nome: string;
  alunos: {[index: string]: any};
  professor: string;
}

export class Turma {
  static $inject = ['Firebase', 'Usuario', '$q'];

  constructor(private firebase: Firebase, private professor: Usuario, private $q) {
  }

  obterTurmas() {
    return this.firebase.loadArray(`/turmas/${this.professor.id}`);
  }

  obterTurma(id) {
    return <ITurma>this.firebase.loadObject(`/turmas/${this.professor.id}/${id}`);
  }

  obterAlunos(turma: ITurma) {
    return this.$q
      .all([turma.$loaded(), this.firebase.loadObject('/usuarios').$loaded()])
      .then(list => {
        const usuarios = list.pop();
        return Object.keys(turma.alunos || {}).map(a => usuarios[a]).filter(u => u !== undefined);
      });
  }
}
