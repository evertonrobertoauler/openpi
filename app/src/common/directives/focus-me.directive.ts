export function focusMe() {
  return {
    restrict: 'A',
    link(scope, element, attrs) {
      scope.$on(attrs.focusMe, () => element[0].focus());
    }
  };
}

