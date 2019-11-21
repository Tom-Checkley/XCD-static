(function () {

    var config = {
        fixWidth: false,
        width: undefined,
        height: 100,
        lineWidth: 4,
        strokeStyle: '#3d3d3d',
        lineCap: 'round',
        fillColor: '#fff'
    };

    angular.module('drawingTool', ['ngTouch'])
        .directive('drawingTool', ['$window', '$timeout',
            function ($window, $timeout) {
                return {
                    restrict: 'AE',
                    replace: true,
                    transclude: false,
                    scope: {
                        ReturnFunc: '=returnFunc',
                        Config: '=?config'
                    },
                    templateUrl: '/ngtemplates/drawing-tool.html',
                    controller: ['$scope',
                        function ($scope) {

                            $scope.Config = $scope.Config ? $scope.Config : config;

                            // Check that if fixed width a width has been added
                            if ($scope.Config.fixWidth && !$scope.Config.width) {
                                console.error('If config setting fixWidth = true, a width must be provided');
                            }

                            // Store whether mousedown / touch is active
                            $scope.isDrawing = false;

                            // Store previous coordinates
                            $scope.lastMouseLocation = { x: 0, y: 0 };

                            /**
                             * GET COORDINATES
                             * @event
                             *  changedTouches handles touch changes;
                             *  offsetX handles mouse changes;
                             */
                            function getCoordinates(e) {
                                var x;
                                var y;

                                if (e.changedTouches && e.changedTouches[0]) {

                                    var offsetY = $scope.canvas.offsetTop || 0;
                                    var offsetX = $scope.canvas.offsetLeft || 0;

                                    x = e.changedTouches[0].pageX - offsetX;
                                    y = e.changedTouches[0].pageY - offsetY;

                                } else if (e.offsetX || 0 == e.offsetX) {
                                    x = e.offsetX;
                                    y = e.offsetY;
                                }

                                return {
                                    x: x,
                                    y: y
                                };
                            }

                            /**
                             * START THE DRAWING
                             */
                            $scope.onStartDrawing = function ($event) {
                                $event.preventDefault();
                                $event.stopPropagation();

                                let coordinates = getCoordinates($event);

                                // Save the previous mouse locations to draw from and to
                                $scope.lastMouseLocation.x = coordinates.x;
                                $scope.lastMouseLocation.y = coordinates.y;

                                // Begin new path
                                $scope.context.beginPath();
                                $scope.isDrawing = true;
                            };

                            /**
                             * DRAW STROKE
                             */
                            $scope.onDraw = function ($event) {
                                $event.preventDefault();
                                $event.stopPropagation();

                                let coordinates = getCoordinates($event);
                                if ($scope.isDrawing) {
                                    $scope.context.moveTo($scope.lastMouseLocation.x, $scope.lastMouseLocation.y);
                                    $scope.context.lineTo(coordinates.x, coordinates.y);

                                    // Style the stroke
                                    $scope.context.strokeStyle = $scope.Config.strokeStyle;
                                    $scope.context.lineCap = $scope.Config.lineCap;
                                    $scope.context.lineWidth = $scope.Config.lineWidth;

                                    // Draw
                                    $scope.context.stroke();

                                    // Update lastMouseLocation
                                    $scope.lastMouseLocation.x = coordinates.x;
                                    $scope.lastMouseLocation.y = coordinates.y;

                                }
                            };

                            /**
                             * STOP DRAWING
                             */
                            $scope.stopDraw = function ($event) {
                                $scope.isDrawing = false;
                            };

                            /**
                             * CLEAR CANVAS
                             */
                            $scope.clearCanvas = function () {
                                $scope.resetCanvas();
                            };

                            /**
                             * SAVE IMAGE AS PNG
                             */
                            $scope.saveDrawing = function () {
                                var imgSrc = $scope.canvas.toDataURL();
                                $scope.DrawingUrl = imgSrc;
                                /**
                                 * Gets passed in from the controller accessing
                                 * @returns { string: Base64 };
                                 */
                                $scope.ReturnFunc($scope.DrawingUrl);
                            };
                        }
                    ],
                    link: function (scope, el) {
                        // Find the canvas
                        scope.canvas = el.find('canvas')[0];

                        scope.resetCanvas = function () {

                            // Change the width to containers width
                            // If not fixed width, else the width will fall back to what is entered in Config
                            if (!scope.Config.fixWidth) {
                                scope.Config.width = el[0].clientWidth;
                            }

                            // Set canvas styles
                            scope.canvas.width = scope.Config.width;
                            scope.canvas.height = scope.Config.height;

                            // Set the context
                            scope.context = scope.canvas.getContext('2d');
                            scope.context.fillStyle = scope.Config.fillColor;
                            scope.context.fillRect(0, 0, scope.Config.width, scope.Config.height);
                        };

                        scope.resetCanvas();

                        // Resize the canvas on screen resize
                        angular.element($window).on('resize', function () {
                            if (!scope.Config.fixWidth) {

                                // Timeout to prevent bounce
                                $timeout(function () {
                                    scope.resetCanvas();
                                }, 10);
                            }
                        });

                    }
                };
            }
        ]
    );
})();