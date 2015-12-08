export class ThemingConfig {
  static $inject = ['$mdThemingProvider'];

  constructor($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('indigo')
      .accentPalette('amber')
      .warnPalette('red');
  }
}
