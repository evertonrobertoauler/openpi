import * as angular from 'angular';
import * as ngMaterial from 'angular-material';
import * as ngMessages from 'angular-messages';
import * as angularfire from 'angularfire';
import 'angular-ui-router';
import 'angular-google-chart';

const ngModule = angular.module('openpi', [
  ngMaterial,
  angularfire,
  ngMessages,
  'ui.router',
  'googlechart'
]);

import './index.scss';

import {RoutesConfig, RoutesErrorConfig} from './config/routes.config';
import {ThemingConfig} from './config/theme.config';

import {Firebase} from './common/services/firebase.service';
import {Usuario} from './common/services/usuario.service';
import {Aula} from './common/services/aula.service';
import {Url} from './common/services/url.service';

import {focusMe} from './common/directives/focus-me.directive';

import {app} from './components/app/app.component';
import {login} from './components/login/login.component';
import {professor} from './components/professor/professor.component';
import {aula} from './components/aula/aula.component';

ngModule
  .value('FIREBASE_CONFIG', {
    apiKey: 'AIzaSyCqTDpKf7InJ-SZBSzSshzkyYoVU9Kg_Pk',
    authDomain: 'open-peer-instruction.firebaseapp.com',
    databaseURL: 'https://open-peer-instruction.firebaseio.com',
    storageBucket: 'open-peer-instruction.appspot.com'
  })

  .config(RoutesConfig)
  .config(ThemingConfig)

  .run(RoutesErrorConfig)

  .service('Firebase', Firebase)
  .service('Usuario', Usuario)
  .service('Aula', Aula)
  .service('Url', Url)

  .directive('focusMe', focusMe)

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
//      aula: 'hash'
//    }
//  },
//  aulas: {
//    hash: {
//      hash: 'hash',
//      professor: 'google:103174776322595326817',
//      pergunta: 'Are you sure?',
//      alternativas: ['YES', 'NO']
//    }
//  }
//};
//
//console.log(model);
