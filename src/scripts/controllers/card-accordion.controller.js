(function() {

    var data = [
        {
            "title": "card 1",
            "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        },
        {
            "title": "card 2",
            "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
        },
        {
            "title": "card 3",
            "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        },
        {
            "title": "card 4",
            "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        },
        {
            "title": "card 5",
            "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
        },
        {
            "title": "card 6",
            "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        },
        {
            "title": "card 7",
            "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        },
        {
            "title": "card 8",
            "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
        },
        {
            "title": "card 9",
            "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        },
        {
            "title": "card 10",
            "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        },
        {
            "title": "card 11",
            "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
        },
        {
            "title": "card 12",
            "body": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
        }
    ];

    angular.module('cardAccordionApp', [])
        .controller('cardAccordionCtrl', ['$scope',
            function($scope) {
                $scope.Model = data;

                $scope.getContnet = () => {

                };

                class Card {
                    constructor() {
                        
                    }
                }

                $scope.Columns = {
                    sm: 1,
                    med: 2,
                    lg: 3
                };
            }
        ])
        .directive('cardAccordion', ['$window', '$timeout', 'screenSizerConfig', 'screenSizerService',
            function($window, $timeout, ssCfg, ssSvc) {
                return {
                    restrict: 'A',
                    replace: true,
                    tansclude: true,
                    templateUrl: '/ngtemplates/card-accordion.html',
                    scope: {
                        Cards: '=cards',
                        NumColumns: '=numColumns',
                    },
                    controller: ['$scope',
                        function($scope) {
                            $scope.Active = false;

                            // 
                            const setColumns = () => {

                                if(ssSvc.isLargerThanOrEqualTo(ssCfg.sizes.mq_page.name, ssCfg.sizes.mq_page.large)) {

                                    $scope.ColClass = `g--1-${$scope.NumColumns.lg}`;
                                    $scope.Columns = $scope.NumColumns.lg;

                                } else if(ssSvc.isLargerThanOrEqualTo(ssCfg.sizes.mq_page.name, ssCfg.sizes.mq_page.medium)) {

                                    $scope.ColClass = `g--1-${$scope.NumColumns.med}`;
                                    $scope.Columns = $scope.NumColumns.med;

                                } else if(ssSvc.isLargerThanOrEqualTo(ssCfg.sizes.mq_page.name, ssCfg.sizes.mq_page.smallest)) {

                                    $scope.ColClass = $scope.NumColumns.sm == 1 ? `g--full` : `g--1-${$scope.NumColumns.sm}`;
                                    $scope.Columns = $scope.NumColumns.sm;

                                }
                            };

                            setColumns();

                            angular.element($window).on('resize', () => { 
                                setColumns();
                                $scope.$apply();
                            });
                           

                            /**
                             * Get the location to place the content of a card from it's index.
                             * Places the content using css grid order rule.
                             * @param { number } i = $index; The index of the selected card.
                             * @param { number } c = The number of columns.
                             * 
                             * NB. Order is set by $index. Thus 0 based.
                             *     CSS Grid order starts at 1.
                             */
                            const getOrder = (index, c) => {
                                // css grid order is not 0 index based
                                // so need to add 1 to index to prevent infinity if 1st card is selected
                                let i = index + 1;

                                // As the content container comes after the cards in source order
                                // we need to take one to ensure it is before the next card in the grid order
                                return (Math.ceil(i / c) * c) - 1;
                            };

                            $scope.onClick = (e, index, card) => {
                                e.preventDefault();

                                // Place the card in the row beneath the card



                                // Check if there's a card already open and give it time to close if there is
                                if($scope.Active) {
                                    $scope.close();
                                    $timeout(() => {
                                        openAccordion(card, index);
                                    }, 250);
                                } else {
                                    openAccordion(card, index);
                                }
                            };

                            function openAccordion(card, index) {
                                $scope.Order = getOrder(index, $scope.Columns);
                                
                                // Find accordion panel and apply focus
                                const content = angular.element(document.getElementById('cardAccordionPanel'))[0];
                                $timeout(() => { content.focus(); }, 100);

                                $scope.Selected = card;
                                $scope.Selected.Index = index;
                                $scope.Active = true;
                                $scope.ToggleAccordion();
                            }


                            $scope.close = () => {
                                $scope.Active = false;
                                $scope.ToggleAccordion();
                                let nextCard;

                                // Check there is a next card otherwise will error
                                if($scope.Selected.Index <= $scope.Cards.length) {
                                    // This is quite brittle. Could be improved. Would need changing if more than one button in a card
                                    nextCard = angular.element(document.getElementById(`card${$scope.Selected.Index + 1}`)).find('a')[0];
                                }
                                // Let card animate close
                                $timeout(() => {
                                    if (nextCard) {nextCard.focus(); }
                                    $scope.Selected = null;
                                }, 250);
                            };
                        }
                    ],
                    link: function(scope, el, attr) {
                        

                        const contentEl = angular.element(document.getElementById('cardAccordionPanel'))[0];

                        scope.ToggleAccordion = () => {
                            if (scope.Active) {
                                $timeout(() => {

                                    // Find height by getting current height
                                    var currentHeight = parseFloat(contentEl.clientHeight);
    
                                    // set height to auto
                                    contentEl.style.height = "auto";

                                    // find the height wanted
                                    var wantedheight = parseFloat(contentEl.clientHeight);

                                    // set height back to original height
                                    contentEl.style.height = currentHeight + "px";

                                    // Magic number makes the transition work without skipping
                                    $timeout(() => {
                                        contentEl.style.height = wantedheight + "px";
                                    }, 100);
                                });
                            } else {
    
                                // Magic number makes the transition work without skipping
                                $timeout(() => {
                                    contentEl.style.height = 0; contentEl.style.height = 0;
                                }, 100);
                            }
                        };
                        
                    }
                };
            }
        ]);
}());