(function () {

    angular.module('tabs', [])
        .directive("tabs", [function () {

            return {
                transclude: true,
                replace: true,
                restrict: "AE",
                scope: {
                    Index: "=?index"
                },
                template: '<div ng-transclude></div>',
                controller: ["$scope", "$timeout", function ($scope, $timeout) {
                    var _subscribers = [];

                    if ($scope.Index == undefined) {
                        $scope.Index = '';
                    }

                    this.subscribe = function (index, setActiveFunction) {
                        if (_subscribers[index]) {
                            _subscribers[index].push(setActiveFunction);
                        } else {
                            _subscribers[index] = [setActiveFunction];
                        }

                        // Init to whichever is called first, and if the index of this item is active, then let it know
                        if (!$scope.Index) {
                            $scope.Index = index;
                        }
                        setActiveFunction($scope.Index);
                    };

                    this.onClick = function (index) {
                        if ($scope.Index === index) {
                            return;
                        }
                        $scope.Index = index;

                        // If the array has a non-integer as it's key then we can't loop through it traditionally
                        for (var key in _subscribers) {
                            var subscriber = _subscribers[key];
                            angular.forEach(subscriber, function (sub) {
                                sub($scope.Index);
                            });
                        }
                    };
                }],
                link: function (scope, el, attrs, ctrl, transcludeFn) {}
            };
        }])
        .directive("tabButton", [function () {

            return {
                require: '^^tabs',
                transclude: true,
                replace: true,
                restrict: "AE",
                scope: {
                    Index: "=tabButton",
                },
                template: function (el) {
                    var tagType = el[0].tagName;
                    return '<' + tagType + ' id="{{ButtonName}}" ng-transclude ng-class="{active:Active}" ng-click="onClick()" role="tab" aria-selected="{{Active ? \'true\' : \'false\'}}" aria-controls="{{PanelName}}"></' + tagType + '>';
                },
                link: function (scope, el, attrs, tabsCtrl, transcludeFn) {
                    scope.ButtonName = getButtonName(scope.Index);
                    scope.PanelName = getPanelName(scope.Index);

                    var setActive = function (i) {
                        scope.Active = i === scope.Index;
                    };
                    tabsCtrl.subscribe(scope.Index, setActive);
                    scope.onClick = function () {
                        tabsCtrl.onClick(scope.Index);
                    };
                }
            };
        }])
        .directive("tabPanel", ["$timeout", function ($timeout) {

            return {
                require: '^^tabs',
                transclude: true,
                replace: true,
                restrict: "AE",
                scope: {
                    Index: "=tabPanel",
                },
                template: '<div ng-class="{active:Active}" id="{{PanelName}}" ng-transclude ng-hide="!Active" role="tabpanel" aria-hidden="{{Active ? \'false\' : \'true\'}}" aria-labelledby="{{ButtonName}}"></div>',
                link: function (scope, el, attrs, tabsCtrl, transcludeFn) {
                    scope.ButtonName = getButtonName(scope.Index);
                    scope.PanelName = getPanelName(scope.Index);

                    var setActive = function (i) {
                        scope.Active = i === scope.Index;
                    };
                    tabsCtrl.subscribe(scope.Index, setActive);
                }
            };
        }]);

    function getButtonName(index) {
        return "tab_button_" + index;
    }

    function getPanelName(index) {
        return "tab_content_" + index;
    }

})();