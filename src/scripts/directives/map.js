(function () {
    /**
     * @TODO - create proper defaults and merge with what's passed into the model
     */
    // default map options
    var opts = {
        center: {
            lat: 51.443286,
            lng: -2.567456
        },
        zoom: 17
    };

    angular.module ('map', [])
        .service('gMapApi', ['$q', '$timeout', '$window', '$http',
            function($q, $timeout, $window, $http) {
                return {
                    /**
                     * load() will check if Google Maps exists on the window
                     * create and append script tag with correct url for gmap
                     * return a promise when complete
                     * @param { string } mapsUrl 
                     */
                    load: mapsUrl => {
                        var deferred = $q.defer();
                        var scriptEl;

                        // Check if google maps already is part of the window
                        if($window.google === undefined || $window.google.maps === undefined) {

                            // Declare function to be called on google maps loading
                            $window.lazyLoadCallback = () => {
                                
                                // Ensure it's loaded
                                $timeout(() => {
                                    // Resolve Promise
                                    deferred.resolve($window.google);
                                }, 100);
                            };

                            // Create the script tag
                            scriptEl = document.createElement('script');
                            // Set script src.
                            // Check whether there is already a query string
                            // If there is append (&) or add to (?) if not
                            // Add the callback function
                            scriptEl.src = mapsUrl + (mapsUrl.indexOf('?') > -1 ? '&' : '?') + 'callback=lazyLoadCallback';

                            if(!document.querySelector('script[src="' + scriptEl.src + '"]')) {
                                // Add script tag to the body if not already there
                                document.body.appendChild(scriptEl);
                            }

                        } else {
                            // If window already has google resolve promise.
                            deferred.resolve($window.google);
                        }

                        return deferred.promise;
                    },
                    getStyles: styleJsonPath => {
                        // Get map style json from file
                        return $http.get(styleJsonPath).then(data => {
                            return data;
                        });
                        
                    }
                };
            }
        ])
        .directive('map', ['gMapApi', '$timeout', '$window',
            function(gMapApi, $timeout, $window) {
                return {
                    restrict: 'AE',
                    replace: true,
                    transclude: false,
                    scope: {
                        Model: '=model',
                    },
                    template: '<div class="map"></div>',
                    controller: ['$scope',
                        function($scope) {
                            $scope.opts = $scope.Model.opts ? $scope.Model.opts : opts;
                            $scope.gmapUrl = `https://maps.googleapis.com/maps/api/js?key=${$scope.Model.apiKey}`;
                        }
                    ],
                    link: function(scope, el) {

                        let styles;
                        // Callback function - set style when getStyles promise returns
                        function onStylesLoaded(data) {
                            styles = data.data;
                        }
                        if(scope.Model.pathToStylesJson) {
                            gMapApi.getStyles(scope.Model.pathToStylesJson).then(onStylesLoaded).then(loadMap);
                        } else {
                            loadMap();
                        }

                        function loadMap() {
                            gMapApi.load(scope.gmapUrl).then(function() {

                                if (styles) {
                                    // pass styles if there are any
                                    scope.opts.styles = styles;
                                }

                                // Load the map
                                scope.mapholder = el[0];
                                scope.initMap = () => scope.map = new google.maps.Map(scope.mapholder, scope.opts);
                                scope.initMap();

                                // Add Markers
                                if(scope.Model.markers.length > 0) {
                                    angular.forEach(scope.Model.markers, (marker) => {

                                        // create temporary marker reference
                                        let _marker = {};

                                        // Set markers options
                                        if (marker.position) { _marker.position = marker.position; }
                                        if (marker.title) { _marker.title = marker.title; }
                                        if (marker.imgPath) { _marker.icon = marker.imgPath; }
                                        _marker.map = scope.map;

                                        // Add marker
                                        let newMarker = new google.maps.Marker(_marker);

                                        
                                        /**
                                         * Add the markers info window
                                         * @TODO Maybe split this out into a seperate directive
                                         *       This could be useful for using different templates
                                         *       Would also mean we can get rid of all the below html
                                         */
                                        if (marker.infoWindow) {
                                            let _infoWindow = marker.infoWindow;

                                            _infoWindow.mapCard = `
                                                <div class="c-mapcard">
                                                    <div class="c-mapcard__head">
                                                        ${ _infoWindow.imgPath ? '<img src="' + _infoWindow.imgPath + '" alt="Element78 Logo">' : ''}
                                                    </div>
                                                    <div class="c-mapcard__body">
                                                        <div class="c-mapcard__address">
                                                            <p>`;
                                                                
                                                                for(let line in _infoWindow.address) {
                                                                    if (line) { _infoWindow.mapCard += _infoWindow.address[line] + '<br>'; }
                                                                }

                                                                _infoWindow.mapCard +=
                                                            `</p>
                                                        </div>
                                                        ${
                                                            _infoWindow.imgPath ?
                                                            `
                                                            <div class="c-mapcard__img">
                                                                <img src="${ _infoWindow.imgPath }">
                                                            </div>
                                                            ` : ``
                                                        }
                                                    </div>
                                                    ${
                                                        _infoWindow.link ? 
                                                        `
                                                            <div class="c-mapcard__actions">
                                                                <a href="${ _infoWindow.link }" target="_blank" rel="noreferrer" class="c-mapcard__link">Get directions</a>
                                                            </div>
                                                        ` 
                                                        : ``
                                                    }
                                                </div>
                                            `;

                                            let newInfoWindow = new google.maps.InfoWindow({
                                                content: _infoWindow.mapCard
                                            });

                                            // add click listener to the marker
                                            newMarker.addListener('click', () => newInfoWindow.open(scope.map, newMarker));

                                            // Set whether infoWindow should be open on page load
                                            if (marker.infoWindow.open) { newInfoWindow.open(scope.map, newMarker); }
                                        }
                                    });
                                }

                            });
                        }
                    }
                
                };
            }
        ]
    );
})();