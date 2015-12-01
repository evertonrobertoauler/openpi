import {Firebase} from './firebase.service';

export interface ITurma extends AngularFireObject {
  nome: string;
  alunos: string[];
  professor: string;
}

export class Turma {
  static $inject = ['Firebase', '$q'];

  constructor(private firebase: Firebase, private $q) {
  }

  obterTurmas() {
    return this.firebase.loadArray('/turmas');
  }

  obterTurma(id) {
    return <ITurma>this.firebase.loadObject(`/turmas/${id}`);
  }

  obterAlunos(turma: ITurma) {
    return this.$q
      .all([turma.$loaded(), this.firebase.loadObject('/usuarios').$loaded()])
      .then(list => {
        const usuarios = list.pop();
        return  (turma.alunos || []).map(a => usuarios[a]).filter(u => u !== undefined);
      });
  }
}
