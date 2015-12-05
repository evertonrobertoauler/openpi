import * as angular from 'angular';
import * as ngMaterial from 'angular-material';
import * as ngMessages from 'angular-messages';
import * as angularfire from 'angularfire';
import * as uiRouter from 'angular-ui-router';

const ngModule = angular.module('openpi', [
  ngMaterial,
  angularfire,
  ngMessages,
  uiRouter
]);

import './index.css';

import {RoutesConfig, RoutesErrorConfig} from './config/routes.config';

import {Firebase} from './common/services/firebase.service';
import {Usuario} from './common/services/usuario.service';
import {Aula} from './common/services/aula.service';

import {app} from './components/app/app.component';
import {login} from './components/login/login.component';
import {professor} from './components/professor/professor.component';
import {aula} from './components/aula/aula.component';

ngModule
  .value('FIREBASE_URL', 'https://openpi.firebaseio.com/')
  .config(RoutesConfig)
  .run(RoutesErrorConfig)

  .service('Firebase', Firebase)
  .service('Usuario', Usuario)
  .service('Aula', Aula)

  .directive('app', app)
  .directive('login', login)
  .directive('professor', professor)
  .directive('aula', aula);

const element = angular.element(document);

element.ready(() => {
  angular.bootstrap(element, [ngModule.name]);
});


//const model = {
//  usuarios: {
//    'google:103174776322595326817': {
//      nome: 'Teste',
//      foto: 'teste.jpg',
//      id: 'google:103174776322595326817',
//      aula: 'teste'
//    }
//  },
//  aulas: {
//    teste: {
//      professor: 'google:103174776322595326817',
//      pergunta: 'Are you sure?',
//      respostas: {
//        a: 'YES',
//        b: 'NO'
//      }
//    }
//  }
//};
//
//console.log(model);
