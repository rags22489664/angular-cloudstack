cloudstack.controller("virtualMachinesCtrl", ['$scope', '$q', 'ApiService', function($scope, $q, ApiService) {

    $scope.getCommand = function() {
        return {
            command: 'listVirtualMachines'
        };
    };

    $scope.getColumns = function() {
        return [{
            field: 'displayname',
            displayName: 'Name'
        }, {
            field: 'state',
            displayName: 'State'
        }, {
            field: 'account',
            displayName: 'Account'
        }];
    };

    $scope.getFilters = function() {

        var filters = [];

        var networkDeferred = $q.defer();

        ApiService.invoke({
            data: {
                command: 'listNetworks',
                listall: true
            },
            onSuccess: function(response) {

                var resFilter = {
                    field: 'networkid',
                    displayName: 'Network',
                    values: []
                };

                if (response.listnetworksresponse && response.listnetworksresponse.network && response.listnetworksresponse.network.length) {
                    for (var index in response.listnetworksresponse.network) {
                        resFilter.values.push({
                            name: response.listnetworksresponse.network[index].displaytext,
                            value: response.listnetworksresponse.network[index].id
                        });
                    }

                    if (resFilter.values.length) {
                        networkDeferred.resolve(resFilter);
                    }
                }
            }
        });

        filters.push(networkDeferred.promise);

        return filters;
    };

}]);