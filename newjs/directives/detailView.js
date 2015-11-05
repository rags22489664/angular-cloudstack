cloudstack.directive("detailview", function() {
    return {
        restrict: "E",
        replace: true,
        scope: {
            title: '@'
        },
        controller: function($scope, $state, ApiService) {

        },
        link: function(scope, element, attrs) {

        },
        templateUrl: 'views/widgets/detailview.html'
    }
});