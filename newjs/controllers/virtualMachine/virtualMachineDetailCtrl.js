cloudstack.controller("virtualMachineDetailCtrl", ['$scope', '$stateParams', function($scope, $stateParams) {
    if ($stateParams.entity) {
        $scope.title = $stateParams.entity.displayname;
    }
}]);