(function () {

    angular.module('accordion', ["smoothScroll"])
           .config(["$anchorScrollProvider", function ($anchorScrollProvider) {
               $anchorScrollProvider.disableAutoScrolling();
           }])
           .directive("accordion", ["smoothScroll", function (smoothScroll) {

               return {
                   transclude: true,
                   replace: true,
                   restrict: "AE",
                   scope: {
                       ActiveIndexes: "=?activeIndexes",
                       AllowMultiple: "=?allowMultiple",
                       ActiveInAnchor: "=?activeInAnchor"
                   },
                   template: '<div ng-transclude aria-multiselectable="{{AllowMultiple ? \'true\' : \'false\'}}"></div>',
                   controller: ["$scope", "$timeout", "$location", function ($scope, $timeout, $location) {
                       if (!$scope.ActiveIndexes) { $scope.ActiveIndexes = []; }

                       if ($scope.ActiveInAnchor) {
                           $scope.ActiveIndexes.push($location.hash());
                           $timeout(function () {
                               var el = document.getElementById($location.hash());
                               if (el) {
                                   smoothScroll(el, {
                                       offset: 310
                                   });
                               }
                           }, 100);
                       }

                       if ($scope.AllowMultiple === undefined) {
                           $scope.AllowMultiple = true;
                       }

                       var _subscribers = [];

                       this.subscribe = function (index, setActiveFunction) {
                           if (_subscribers[index]) {
                               _subscribers[index].push(setActiveFunction);
                           }
                           else {
                               _subscribers[index] = [setActiveFunction];
                           }

                           // Init to whichever is called first, and if the index of this item is active, then let it know
                           $timeout(function () {
                               if ($scope.ActiveIndexes.indexOf(index) >= 0) {
                                   setActiveFunction(true);
                               } else {
                                   setActiveFunction(false);
                               }
                           }, 100);
                       };

                       this.onClick = function (index) {
                           var indexOf = $scope.ActiveIndexes.indexOf(index);

                           // Make this one not active anymore
                           if (indexOf >= 0) {

                               angular.forEach(_subscribers[index], function (subFnc) {
                                   subFnc(false);
                               });
                               $scope.ActiveIndexes.splice(indexOf, 1);
                               return;
                           }

                           // If we aren't allowed multiples, then close all others 
                           if (!$scope.AllowMultiple) {
                               angular.forEach($scope.ActiveIndexes, function (activeIndex) {
                                   angular.forEach(_subscribers[activeIndex], function (subFnc) {
                                       subFnc(false);
                                   });
                               });
                               $scope.ActiveIndexes = [];
                           }

                           // Add this one to the list of expanded
                           $scope.ActiveIndexes.push(index);
                           angular.forEach(_subscribers[index], function (sub) {
                               sub(true);
                           });

                           // HACK ---- Have to work with non-angular JS on anchor change to ensure the page doesn't auto-scroll to anchor
                           // Scroll to new element
                           var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                           window.location.hash = "#" + index;
                           document.documentElement.scrollTop = document.body.scrollTop = scrollTop;
                           $timeout(function () {
                               var el = document.getElementById(index);
                               if (el) {
                                   smoothScroll(el, {
                                       offset: 310
                                   });
                               }
                           });

                       };
                   }],
                   link: function (scope, el, attrs, ctrl, transcludeFn) {
                   }
               };

           }])
           .directive("accordionControl", [function () {

               return {
                   require: '^^accordion',
                   transclude: true,
                   replace: true,
                   restrict: "AE",
                   scope: {
                       Index: "=accordionControl",
                   },
                   template: '<div class="c-accordion__control" id="{{ControlName}}" ng-click="onClick()" ng-class="{active:Active}" ng-transclude role="tab" aria-controls="{{PanelName}}" aria-expanded="{{Active ? \'true\' : \'false\'}}"></div>',
                   link: function (scope, el, attrs, accordionCtrl, transcludeFn) {

                       scope.ControlName = getControlName(scope.Index);
                       scope.PanelName = getPanelName(scope.Index);

                       var setActive = function (isActive) {
                           scope.Active = isActive;
                       };

                       accordionCtrl.subscribe(scope.Index, setActive);

                       scope.onClick = function () {
                           accordionCtrl.onClick(scope.Index);
                       };
                   }
               };
           }])
           .directive("accordionPanel", ["$timeout", function ($timeout) {

               return {
                   require: '^^accordion',
                   transclude: true,
                   replace: true,
                   restrict: "AE",
                   scope: {
                       Index: "=accordionPanel",
                   },
                   template: '<div class="c-accordion__panel" ng-class="{active:Active}" ng-transclude role="tabpanel" aria-labeledby="{{ControlName}}" aria-hidden="{{Active ? \'false\' : \'true\'}}" data-ng-hide="IsHidden"></div>',
                   link: function (scope, el, attrs, accordionCtrl, transcludeFn) {

                       scope.ControlName = getControlName(scope.Index);
                       scope.PanelName = getPanelName(scope.Index);

                       var setActive = function (isActive) {

                           scope.Active = isActive;
                           if (scope.Active) {
                               scope.IsHidden = false;
                           } else {
                               $timeout(function () {
                                   scope.IsHidden = true;
                               }, 350);
                           }

                           // If we are setting active then make the height of the element 
                           var contentEl = el[0];

                           if (scope.Active) {
                               $timeout(function () {

                                   // Find height by getting current height
                                   var currentHeight = parseFloat(contentEl.clientHeight);

                                   // set height to auto
                                   contentEl.style.height = "auto";

                                   // find the height wanted
                                   var wantedheight = parseFloat(contentEl.clientHeight);

                                   // set height back to original height
                                   contentEl.style.height = currentHeight + "px";

                                   // Magic number makes the transition work without skipping
                                   $timeout(function () {
                                       contentEl.style.height = wantedheight + "px";
                                   }, 100);
                               });
                           } else {

                               // Magic number makes the transition work without skipping
                               $timeout(function () {
                                   contentEl.style.height = 0; contentEl.style.height = 0
                               }, 100);
                           }
                       };
                       accordionCtrl.subscribe(scope.Index, setActive);
                   }
               };
           }]);

    function getControlName(index) {
        return "acc_control_" + index;
    }

    function getPanelName(index) {
        return index;
    }

})();