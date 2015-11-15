import {loginRequired} from './../common/services/usuario.service';

export class RoutesConfig {
  static $inject = ['$stateProvider', '$urlRouterProvider'];

  constructor($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        template: '<login></login>'
      })
      .state('inicio', {
        url: '/inicio',
        template: '<inicio></inicio>',
        resolve: {loginRequired}
      })
      .state('perfil', {
        url: '/perfil',
        template: '<perfil></perfil>',
        resolve: {loginRequired}
      })
      .state('turma-list', {
        url: '/turma/list',
        template: '<turma-list></turma-list>',
        resolve: {loginRequired}
      })
      .state('turma-form', {
        url: '/turma/form/:id',
        template: '<turma-form></turma-form>',
        resolve: {loginRequired}
      });

    $urlRouterProvider.otherwise('/inicio');
  }
}

export class RoutesErrorConfig {
  static $inject = ['$rootScope', '$state'];

  constructor($rootScope, $state) {
    $rootScope.$on('$stateChangeError', (e) => {
      e.preventDefault();
      $state.go('login');
    });
  }
}
