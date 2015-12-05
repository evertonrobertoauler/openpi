import {loginRequired} from './../common/services/usuario.service';

export class RoutesConfig {
  static $inject = ['$stateProvider', '$urlRouterProvider'];

  constructor($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        template: '<login></login>'
      })
      .state('professor', {
        url: '/',
        template: '<professor></professor>',
        resolve: {loginRequired}
      })
      .state('aula', {
        url: '/aula/:id',
        template: '<aula></aula>'
      });

    $urlRouterProvider.otherwise('/');
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
