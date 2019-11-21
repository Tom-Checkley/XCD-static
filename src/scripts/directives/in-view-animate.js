(function () {
    angular.module ('inViewAnimate', [])
        .directive('inViewAnimate', ['ngIntersectionObserverService',
            function(intObsSrv) {
                return {
                    restrict: 'A',
                    replace: false,
                    link: function(scope, el, attrs, ctrl, transcludeFn) {
                        var jsAnim = function(element) {
                            angular.element(element)[0].classList.add('is-animated');
                        };

                        intObsSrv.subscribe(el, 'defaultObserver', jsAnim);
                    }
                };
            }
        ]
    );
})();