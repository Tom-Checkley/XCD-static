(function () {

    var config = {
        Width: 720,
        Height: 405,
        Frameborder: 0,
        Allow: 'autoplay; encrypted-media',
        Allowfullscreen: true,
        ExternalClass: 'videoBox--modifier'
    };

    angular.module('videoBox', ['ngSanitize'])
        .directive('videoBox', ['$sce',
            function ($sce) {
                return {
                    restrict: 'A',
                    replace: true,
                    transclude: false,
                    scope: {
                        Model: "=model",
                        Config: "=?config",
                    },
                    templateUrl: '/ngtemplates/video-Box.html',
                    controller: ['$scope',
                        function ($scope) {
                            
                            // Prevents XOrigin errors
                            $scope.Title = $sce.trustAsHtml($scope.BoxTitle);
                            $scope.VidSrc = $sce.trustAsResourceUrl($scope.VideoSrc);

                            $scope.playing = false;

                            $scope.playPause = function () {
                                $scope.playing = !$scope.playing;
                            };
                        }
                    ]
                };
            }
        ]
    );
})();