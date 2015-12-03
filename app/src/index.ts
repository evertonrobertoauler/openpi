import * as angular from 'angular';
import * as ngMaterial from 'angular-material';
import * as angularfire from 'angularfire';
import * as uiRouter from 'angular-ui-router';

const ngModule = angular.module('openpi', [
  ngMaterial,
  angularfire,
  uiRouter
]);

import './index.css';

import {RoutesConfig, RoutesErrorConfig} from './config/routes.config';

import {Firebase} from './common/services/firebase.service';
import {Usuario} from './common/services/usuario.service';
import {Turma} from './common/services/turma.service';
import {Questao} from './common/services/questao.service';

import {app} from './components/app/app.component';
import {login} from './components/login/login.component';
import {inicio} from './components/inicio/inicio.component';
import {perfil} from './components/perfil/perfil.component';
import {turmaList} from './components/turmas/list/turma-list.component';
import {turmaView} from './components/turmas/view/turma-view.component';
import {turmaForm} from './components/turmas/form/turma-form.component';
import {questaoView} from './components/questoes/view/questao-view.component';
import {questaoForm} from './components/questoes/form/questao-form.component';

ngModule
  .value('FIREBASE_URL', 'https://openpi.firebaseio.com/')
  .config(RoutesConfig)
  .run(RoutesErrorConfig)

  .service('Firebase', Firebase)
  .service('Usuario', Usuario)
  .service('Turma', Turma)
  .service('Questao', Questao)

  .directive('app', app)
  .directive('login', login)
  .directive('inicio', inicio)
  .directive('perfil', perfil)
  .directive('turmaList', turmaList)
  .directive('turmaView', turmaView)
  .directive('turmaForm', turmaForm)
  .directive('questaoView', questaoView)
  .directive('questaoForm', questaoForm);

const element = angular.element(document);

element.ready(() => {
  angular.bootstrap(element, [ngModule.name]);
});

/*
 menu
 -- app
 usuario
 -- login
 -- perfil
 aluno
 -- inicio
 professor
 -- turmas
 ---- list-turma
 ---- form-turma
 ---- view-turma
 -- questoes
 ---- form-questao
 ---- view-questao
 */
