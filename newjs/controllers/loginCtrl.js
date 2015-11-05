cloudstack.controller("LoginCtrl", ['$scope', 'ApiService', '$state', function($scope, ApiService, $state) {
    $scope.loginForm = {};
    $scope.onSubmit = function() {
        ApiService.login("/client/api", $scope.loginForm.username, $scope.loginForm.password, $scope.loginForm.domain, function() {
            $state.go('home');
        }, function() {

        });
    };
}]);