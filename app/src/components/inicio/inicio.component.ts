export function inicio() {
  return {
    restrict: 'E',
    template: require('./inicio.component.html'),
    controller: InicioComponent,
    controllerAs: 'inicio',
    bindToController: true
  };
}

class InicioComponent {
  static $inject = [];
}
