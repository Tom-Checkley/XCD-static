(function() {
    angular.module('slideOutCardCtrl', [])
        .controller('slideOutCardCtrl', ['$scope', 'slideOutCard',
            function($scope, slideOutCard) {
                $scope.slideOutExample = function(e, model) {
                    e.preventDefault();

                    var args = {
                        config: {
                            timer: 5000,
                            templateUrl: undefined,
                            maxCards: 1,
                            isTimed: true,
                            mask: true,
                            scrollLock: false,
                            externalClass: 'example'
                        },
                        model: model
                    };

                    slideOutCard.push(args, 'example');
                };
            }
        ]);
}());