(function () {

    angular.module("loading", [])
           .directive("loading", function () {
               return {
                   restrict: "AE",
                   templateUrl: "/ngtemplates/loading.html",
                   scope: {
                       IsActive: "=loading",
                   }
               };
           });

})();