cloudstack.controller("HeaderCtrl", ['$scope', '$mdSidenav', function($scope, $mdSidenav) {
    $scope.toggleNav = function(id) {
        $mdSidenav(id).toggle();
    };
}]);