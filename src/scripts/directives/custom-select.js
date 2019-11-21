(function () {
    angular.module ('ngSelect', [])
        .directive('ngSelect', ['$timeout',
            function($timeout) {
                return {
                    restrict: 'A',
                    replace: true,
                    transclude: false,
                    scope: {
                        Options: '=options',
                        Placeholder: '=placeholder',
                        GroupName: '=groupName',
                        Output: '=?'
                    },
                    templateUrl: '/ngtemplates/ng-select.html',
                    controller: ['$scope',
                        function($scope) {

                            // Create a new Output with undefined value if not being passed through
                            if(!$scope.Output) {
                                $scope.Output = {
                                    Value: undefined
                                };
                            }

                            $scope.Prevent = function(e) {
                                e.preventDefault();
                            };

                            // Ensure has a selected option if not already set
                            function hasSelected() {
                                if ($scope.Expanded && $scope.Output.Value == undefined) {
                                    $scope.Output.Value = $scope.Options[0].Value;
                                }
                            };

                            $scope.Expanded = false;
                            $scope.ToggleDropdown = function() {
                                $scope.Expanded = !$scope.Expanded;
                                hasSelected();
                            };

                            // Add remove focus for giving focus state to outer container
                            $scope.AddFocus = function () {
                                $scope.Focus = true;
                            };    
                            $scope.RemoveFocus = function () {
                                $scope.Focus = false;
                            };

                            // Controls for keypresses when button has focus
                            $scope.KeyDown = function(e) {
                                var kC = e.keyCode;
                                if (kC == 13 || kC == 32 || kC == 38 || kC == 40) { // Prevent it running through the whole lot if not a up, down space or enter.
                                    e.preventDefault();
                                    if (kC == 13 || kC == 32) { // Enter & Space Key
                                        $scope.ToggleDropdown();
                                    } 
                                    else {
                                        if (kC == 40) { // Down Key
                                            if ($scope.Output.Value == undefined) {
                                                // Set as the first option if not already set
                                                $scope.Output.Value = $scope.Options[0].Value;
                                            } else {
                                                var l = $scope.Options.length;
                                                for (var i = 0; i < l; i++) {
                                                    if ((i + 1) == l) {
                                                        // jump back to top if last is the current
                                                        $scope.Output.Value = $scope.Options[0].Value;
                                                        break;
                                                    }
                                                    if ($scope.Output.Value == $scope.Options[i].Value) {
                                                        // Go to next
                                                        $scope.Output.Value = $scope.Options[i + 1].Value;
                                                        break;
                                                    }
                                                }
                                            }
                                        } else if (kC == 38) { // Up key, same as above but in reverse.
                                            var l = $scope.Options.length - 1;
                                            if ($scope.Output.Value == undefined) {
                                                $scope.Output.Value = $scope.Options[l].Value;
                                            } else {
                                                for (var i = l; i >= 0; i--) {
                                                    if ((i - 1) < 0) {
                                                        $scope.Output.Value = $scope.Options[l].Value;
                                                        break;
                                                    }
                                                    if ($scope.Output.Value == $scope.Options[i].Value) {
                                                        $scope.Output.Value = $scope.Options[i - 1].Value;
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            };

                            // Watch the output to display the selected option in the template
                            $scope.$watch("Output", function (newVal, oldVal) {
                                angular.forEach($scope.Options, function (item) {
                                    if (item.Value == newVal.Value) {
                                        $scope.Selected = item;
                                    }
                                });
                            }, true);

                        }
                    ],
                    link: function(scope, el) {

                        // Return the focus to the button that acts as the select
                        scope.ReturnFocus = function (e) {
                            var btn = el.find('button');
                            btn = btn[0];
                            $timeout(function () {
                                btn.focus();
                                scope.ToggleDropdown();
                            }, 10);
                        };
                    }
                };
            }
        ]
    );
})();