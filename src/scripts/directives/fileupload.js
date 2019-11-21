(function () {
    angular.module ('fileUpload', [])
        .directive('fileUpload', [
            function() {
                return {
                    restrict: 'AE',
                    replace: true,
                    transclude: false,
                    /**
                     * SCOPE -
                     * @param {string} label - the label for the input. Obvs!
                     * @param {string} id - id for the input and for attribute for label
                     * @param {string} name - name for input needs to match the name of the input it will be replacing
                     * @param {bool} multiple - whether multiple files are selectable
                     * @param {string} acceptFormats - a string of comma seperated extensions. eg ".pdf, .txt".
                     * 
                     * NOTE The accept attribute on file input is a little flakey.
                     *      MIME types will also work eg "image/*" or "image/jpg, image/png".
                     */
                    scope: {
                        label: '=',
                        id: "=",
                        name: "=",
                        multiple: '=?',
                        acceptFormats: '=?'
                    },
                    templateUrl: '/ngtemplates/fileupload.html',
                    controller: ['$scope',
                        function($scope) {

                            // Primary focus state
                            $scope.focused = false;

                            // Truncate the file name if too long
                            function truncFunc(str) {
                                if(str.length > 21) {
                                    var str1 = str.substring(0, 11);
                                    var str2 = str.substring(str.length - 6);
                                    return str1 + '...' + str2;
                                } else {
                                    return str;
                                }
                            } 

                            $scope.onChange = function(event) {
                                var files = event.target.files;
                                // Create / clear initial values
                                $scope.selected = "";
                                $scope.files = [];
                                $scope.fileNames = [];
                                // check a file has been selected
                                if(files.length > 0) {
                                    
                                    if(!$scope.multiple) {
                                        $scope.files.push(files[0]);
                                        $scope.selected = truncFunc($scope.files[0].name);
                                        $scope.selectedFull = $scope.files[0].name;
                                    } else {
                                        
                                        for(var i = 0; i < files.length; i++) {
                                            // Store all the whole file
                                            $scope.files.push(files[i]);
                                            // Store the file name for display
                                            $scope.fileNames.push(truncFunc(files[i].name));
                                        }
                                    }
                                }
                                $scope.$apply();
                            };
                        }
                    ],
                };
            }
        ]
    )
    // input type file doesn't like ng-change, so we pass the onChange function through a seperate directive
    .directive('customOnChange', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var onChangeFunc = function (event) {
                    // Create custom change attribute, to get the function and create an event handler
                    scope.$eval(attrs.customOnChange)(event);
                };
                element.on('change', onChangeFunc);
                
                // Add the multiple attribute if multiple is selected
                if(scope.multiple) {
                    element.attr('multiple', 'multiple');
                } else {
                    element.removeAttr('multiple');
                }

                // If file types have been specified add the accept attribute
                if(scope.acceptFormats) {
                    element.attr('accept', scope.acceptFormats);
                }
            }
        };
    });
})();