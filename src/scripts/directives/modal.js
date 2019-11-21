(function () {

    var modalDefaults = {
        Mask: true,
        CloseOnMaskClick: true,
        CloseButton: true,
        TemplateUrl: undefined,
        Closed: true,
        Draggable: true,
        Escapable: true,
    };

    angular.module('modal', ["ngAnimate"])

           // Handles requests for displaying a modal popup
           .factory("modal", [
               "$compile", "$rootScope", "$timeout", "$animate", function ($compile, $rootScope, $timeout, $animate) {

                   const _createModal = function (args) {

                       // Create an element for the modal to be inserted into
                       var temp = document.createElement("div");
                       temp.setAttribute("modal", 'model');
                       temp.setAttribute("config", 'config');
                       temp.setAttribute("ng-class", "{'active' : !config.Closed}");
                       //temp.classList = "modal__wrapper";
                       temp.className += "c-modal";

                       // Create a scope to insert into the modal
                       var modalScope = $rootScope.$new(true);
                       modalScope.model = args.model;
                       modalScope.config = angular.merge({}, modalDefaults, args ? args.config : {});

                       // Bootstrap angular onto that element with our new scope
                       $compile(temp)(modalScope);
                       var body  = document.getElementsByTagName("body")[0];
                       body.appendChild(temp);
                       body.classList.add('scrollLock');

                       modalScope.$on("CloseModal", function () {
                           // Todo - this should be done better
                           // Allow enough time to animate out, so after 0.5 seconds (after animation complete), remove the element from the DOM and free up the scope
                           $timeout(function () {
                               angular.element(temp).remove();
                               modalScope.$destroy();
                           }, 500);
                       });


                   };

                   return {
                       create: _createModal
                   };
               }
           ])

           // Handles rendering the modal popup
           .directive("modal", ["$timeout", "$document",
                function ($timeout, $document) {

                    return {
                        transclude: false,
                        require: '',
                        restrict: "AE",
                        scope: {
                            Config: "=config",
                            Model: "=modal"
                        },
                        templateUrl: '/ngtemplates/modal.html',
                        controller: ["$scope", function ($scope) {

                            $timeout(function () {
                                $scope.Config.Closed = false;
                            });

                            // Close the modal
                            $scope.close = function () {
                                $scope.Config.Closed = true;
                                $scope.$emit("CloseModal");
                                document.getElementsByTagName('body')[0].classList.remove('scrollLock');
                            };

                            // See if we should close the modal when clicking the mask
                            $scope.maskClick = function () {
                                if ($scope.Config.CloseOnMaskClick) { $scope.close(); }
                            };

                            // See if we should close the modal when pressing a key
                            $scope.keyPress = function ($event) {
                                if ($scope.Config.Escapable && $event.key === "Escape") { $scope.close(); }
                            }

                        }],
                        link: function (scope, el, attrs, ctrl, transcludeFn) {

                            // If scope.Escapable, find the element and focus on it so it can be escaped
                            if (scope.Config.Escapable) {
                                el[0].getElementsByClassName('c-modal__popup')[0].focus();
                            }

                            // If scope.DraggableBy, find the element, and handle start, move and end click events
                            if (scope.Config.Draggable) {

                                var draggableEl = el[0].getElementsByClassName('c-modal__dragger');

                                var startX = undefined;
                                var startY = undefined;

                                angular.element(draggableEl).on("mousedown", function (e) {
                                    // Get mouse x and y pos
                                    startX = e.pageX;
                                    startY = e.pageY;
                                });

                                $document.on("mousemove", function (e) {
                                    if (startX && startY) {
                                        // Find difference between mouse x and y pos now and at start
                                        var movedX = (startX - e.pageX) * -1;
                                        var movedY = (startY - e.pageY) * -1;

                                        var popup = el[0].getElementsByClassName("c-modal__body")[0];

                                        // Move the element by the difference
                                        var offset = offsetFromWindow(popup);
                                        popup.style.top = (offset.y + movedY) + "px";
                                        popup.style.left = (offset.x + movedX) + "px";

                                        // Ensure that things won't be selected by accident
                                        var body = $document.find("body")[0];
                                        body.style.userSelect = "none";
                                        var allElements = angular.element(document.getElementsByTagName("*"));
                                        allElements.attr("unselectable", "on");

                                        // Set start x and y to the new x and y
                                        startX = e.pageX;
                                        startY = e.pageY;
                                    }
                                });

                                var onMouseUp = function () {
                                    startX = undefined;
                                    startY = undefined;

                                    // Ensure that things can be selected again
                                    var body = $document.find("body")[0];
                                    body.style.userSelect = "";
                                    var allElements = angular.element(document.getElementsByTagName("*"));
                                    allElements.removeAttr("unselectable");
                                };

                                $document.on("mouseup", function (e) {
                                    if (startX && startY) {
                                        onMouseUp();
                                    }
                                });

                                $document.on("mouseout", function (e) {
                                    if (startX && startY && e.toElement == null && e.relatedTarget == null) {
                                        onMouseUp();
                                    }
                                });
                            }
                        }
                    };
                }
           ])

           // Handles opening a modal without requiring a controller
           .directive("modalTrigger", ["modal",
               function (modal) {

                   return {
                       scope: {
                           ModalConfig: "=modalConfig",
                           Model: "=modalModel"
                       },

                       controller: ["$scope",
                           function ($scope) {
                               $scope.onClick = function () {
                                   modal.create({
                                       config: $scope.ModalConfig,
                                       model: $scope.Model
                                   });
                               };
                           }
                       ],

                       link: function (scope, element, attrs) {
                           element.on("click", function (ev) {
                               if (ev) { ev.preventDefault(); }
                               scope.onClick();
                           });
                       }

                   };

               }
           ]);

})();