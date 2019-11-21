(function() {

    angular.module('lazyload', [])
        .directive('lazyload', ['ngIntersectionObserverService', function(intObsSrv) {
            return {
                restrict: 'A',
                replace: false,
                link: function(scope, el, attrs) {
                    var preloadImage = function(element) {
                        var kids = angular.element(element).children();
                        angular.forEach(kids, function(kid) {
                            if(kid.dataset && kid.dataset.src) {
                                kid.src = kid.dataset.src;
                            }
                            if(kid.dataset && kid.dataset.srcset) {
                                kid.srcset = kid.dataset.srcset;
                            }
                        });

                    };

                    intObsSrv.subscribe(el, 'lazyloadObserver', preloadImage);
                }
            };
        }]);
}());