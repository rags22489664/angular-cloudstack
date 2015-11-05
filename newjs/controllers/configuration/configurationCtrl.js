cloudstack.controller("ConfigurationCtrl", ['$scope', '$q', 'ApiService', function($scope, $q, ApiService) {

    $scope.getCommand = function() {
        return {
            command: 'listConfigurations'
        };
    };

    $scope.getColumns = function() {
        return [{
            field: 'name',
            displayName: 'Name'
        }, {
            field: 'value',
            displayName: 'Value',
            show: {
                md: true,
                gtmd: true,
                lg: true,
                gtlg: true
            }
        }, {
            field: 'description',
            displayName: 'Description',
            show: {
                lg: true,
                gtlg: true
            }
        }];
    };

    $scope.getFilters = function() {

        var filters = [];

        var categoryDeferred = $q.defer();

        categoryDeferred.resolve({
            field: 'category',
            displayName: 'Category',
            values: [{
                name: 'Account Defaults',
                value: 'Account Defaults'
            }, {
                name: 'Advanced',
                value: 'Advanced'
            }, {
                name: 'Alert',
                value: 'Alert'
            }, {
                name: 'Console Proxy',
                value: 'Console Proxy'
            }, {
                name: 'Developer',
                value: 'Developer'
            }, {
                name: 'Domain Defaults',
                value: 'Domain Defaults'
            }, {
                name: 'Hidden',
                value: 'Hidden'
            }, {
                name: 'Management Server',
                value: 'management-server'
            }, {
                name: 'Network',
                value: 'Network'
            }, {
                name: 'NetworkManager',
                value: 'NetworkManager'
            }, {
                name: 'Project Defaults',
                value: 'Project Defaults'
            }, {
                name: 'Secure',
                value: 'Secure'
            }, {
                name: 'Snapshots',
                value: 'Snapshots'
            }, {
                name: 'Storage',
                value: 'Storage'
            }, {
                name: 'Usage',
                value: 'Usage'
            }]
        });

        filters.push(categoryDeferred.promise);

        var zoneDeferred = $q.defer();

        ApiService.invoke({
            data: {
                command: 'listZones',
                listall: true
            },
            onSuccess: function(response) {

                var resFilter = {
                    field: 'zoneid',
                    displayName: 'Zone',
                    values: []
                };

                if (response.listzonesresponse && response.listzonesresponse.zone && response.listzonesresponse.zone.length) {
                    for (var index in response.listzonesresponse.zone) {
                        resFilter.values.push({
                            name: response.listzonesresponse.zone[index].name,
                            value: response.listzonesresponse.zone[index].id
                        });
                    }

                    if (resFilter.values.length) {
                        zoneDeferred.resolve(resFilter);
                    }
                }
            }
        });

        filters.push(zoneDeferred.promise);

        return filters;
    };

}]);