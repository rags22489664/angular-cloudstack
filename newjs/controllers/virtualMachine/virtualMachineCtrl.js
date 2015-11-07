cloudstack.controller("virtualMachinesCtrl", ['$scope', 'VirtualMachineService', function($scope, VirtualMachineService) {
    var virtualMachinesView = VirtualMachineService.listView();
    $scope.columns = virtualMachinesView.columns();
    VirtualMachineService.list({}).then(function(vms) {
        $scope.vms = vms;
    });
}]);