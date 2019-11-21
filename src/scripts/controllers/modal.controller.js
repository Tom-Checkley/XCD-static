(function() {
    angular.module('modalApp', [])
        .controller('modalCtrl', ['$scope', 'modal', function($scope, modal) {

            const Config = {
                dragable: true,
                mask: true
            };

            const Model = {
                stuff: 'some stuff to pass to the model'
            };

            $scope.openModal = () => {
                modal.create({
                    model: Model,
                    config: Config
                });
            };
        }]);
}());