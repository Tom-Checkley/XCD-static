(function () {
    var slideOutCardDefaults = {
        timer: 5000,
        templateUrl: undefined,
        maxCards: 1,
        isTimed: true,
        mask: true,
        externalClass: undefined,
        scrollLock: false
    };

    angular.module('slideOutCard', ['ngAnimate'])

        // Create new slideOutCard
        .factory('slideOutCard', ['$compile', '$rootScope', '$timeout', '$animate', function ($compile, $rootScope, $timeout, $animate) {
            var _slideOutCardScope = undefined;

            var _initSlideOutCardScope = function (args, key) {
                // Add initial scope and template
                if (_slideOutCardScope == undefined) {
                    // define temp html
                    var temp = document.createElement('div');
                    temp.setAttribute('data-slide-out-card', '');
                    temp.setAttribute('cards', 'cards');
                    temp.setAttribute('config', 'config');
                    temp.classList = 'c-slideOutCard';

                    // Add scope and config
                    _slideOutCardScope = $rootScope.$new(true);
                    _slideOutCardScope.cards = [];
                    _slideOutCardScope.config = {};

                    $compile(temp)(_slideOutCardScope);

                    document.getElementById('slideOutCardAnchor').appendChild(temp);
                }

                _slideOutCardScope.config = angular.merge({}, slideOutCardDefaults, args, _slideOutCardScope.config);
            };

            var _key;

            // Add new card to queue
            var _push = function (args, key) {
                if (_slideOutCardScope == undefined) {
                    _initSlideOutCardScope(undefined);
                }
                _key = key;
                _slideOutCardScope.cards.push(args);
                return _slideOutCardScope;
            };

            //DOUBLE CHECK
            // pass back to controller to close on screen resize
            var _close = function (key) {
                if (_key == key) {
                    _slideOutCardScope.$root.close();
                }
            };

            return {
                push: _push,
                close: _close
            };
        }])

        .directive('slideOutCard', ['$timeout', '$q', '$animate', function ($timeout, $q, $animate) {
            return {
                restrict: 'AE',
                scope: {
                    cards: '=',
                    config: '=',
                    model: '=?' // model is to pass through to whichever template is being called
                },
                templateUrl: '/ngtemplates/slideoutcontainer.html',

                controller: ['$rootScope', '$scope', '$timeout', '$animate', function ($rootScope, $scope, $timeout, $animate) {
                    $scope.card = [];
                    $scope.currentCard;
                    $scope.activeCard;
                    var timer;
                    var isActiveCard;

                    // To pass back to factory
                    $rootScope.close = function () {
                        $scope.removeCurrent();
                    };

                    // Watch for new cards added
                    $scope.$watch('cards', function (newValue, oldValue, scope) {
                        tryToPush().then(function () {
                            angular.forEach($scope.cards, function (card, i) {
                                pushToCard(card, i);
                            });
                        });
                    }, true);

                    // Display current card
                    $scope.$watch('card', function (newValue, oldValue, scope) {
                        if (!isActiveCard) {
                            if ($scope.card.length > 0) {
                                makeActive();
                            }
                        }
                    }, true);

                    // Push new card, delete current if one exists
                    var tryToPush = function () {
                        return $q(function (resolve) {
                            if ($scope.isCardDisplaying() && $scope.cards.length > 0) {
                                $scope.removeCurrent();
                            }
                            resolve();
                        });
                    };

                    // Take card from queue and add to active array
                    function pushToCard(card, i) {
                        $scope.card.push(card);
                        $scope.cards.splice(i, 1);
                    }

                    var body = angular.element(document.querySelector('body'));

                    // Make card active
                    function makeActive() {
                        $scope.currentCard = $scope.card[0];
                        $scope.activeCard = $scope.card[0];
                        // if ($scope.activeCard.config.scrollLock) {
                        //     body.addClass('scrollLock');
                        // }
                        $scope.config.isNextCard = $scope.activeCard.config.isNextCard;
                        // save the class from specified external class from ctrl config
                        $scope.currentCardClass = $scope.activeCard.config.externalClass;
                        // Time out lets the card load before the animation begins
                        $timeout(function () {
                            $scope.activeCard.class = 'active';
                        }, 100);
                        // Should the card slide back out automatically?
                        if ($scope.activeCard.config.isTimed) {
                            // Remove the card after x amount of time
                            timer = $timeout(function () {
                                $scope.removeCurrent();
                            }, $scope.activeCard.config.timer);
                        }
                    }

                    // Remove old Card
                    $scope.removeCurrent = function () {
                        body.removeClass('scrollLock');
                        $timeout.cancel(timer);

                        $scope.activeCard = null;
                        // $scope.activeCard.class = '';

                        $scope.card.splice(0, 1);

                    };

                    // To be passed down to card directive for close button
                    this.close = function () {
                        $scope.removeCurrent();
                    };

                    // Check if there is a current active card
                    $scope.isCardDisplaying = function() {
                        return $scope.card.length >= $scope.config.maxCards;
                    };
                }],
                controllerAs: 'cardCtrl',
                link: function (scope, el, attrs) {
                    scope.$watch('cards', function(newVal, oldVal) {
                        if(scope.isCardDisplaying) {
                            $timeout(function() {
                                var search = el[0].getElementsByClassName('c-search__input');
                                if(search.length != 0) {
                                    search[0].focus();
                                } else {
                                    el[0].getElementsByClassName('c-slideOutCard')[0].focus();
                                }
                            }, 10);
                        }
                    }, true);
                }
            };
        }])
        .directive('card', ['$timeout', '$animate', function ($timeout, $animate) {
            return {
                transclude: true,
                replace: true,
                require: '^^slideOutCard',
                restrict: 'AE',
                scope: {
                    model: '=',
                    config: '=',
                    close: '@'
                },
                templateUrl: '/ngtemplates/slideoutcard.html',
                link: function (scope, el, attrs, cardCtrl) {
                    scope.close = function () {
                        cardCtrl.close();
                    };
                }
            };
        }]);
}());