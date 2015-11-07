cloudstack.service('VirtualMachineService', function($q, ApiService) {

    //CRUD//

    var setCommand = function(args, command) {
        return angular.extend(args, {
            command: command
        })
    };

    this.create = function(args) {
        return ApiService.invoke({
            data: setCommand(args, 'deployVirtualMachine')
        });
    };

    this.list = function(args) {
        var listDeferred = $q.defer();

        ApiService.invoke({
            data: setCommand(args, 'listVirtualMachines')
        }).then(function(response) {
            var res = response.data.listvirtualmachinesresponse;
            listDeferred.resolve({
                data: res.virtualmachine,
                count : res.count
            });
        }, function(error) {
            listDeferred.reject(error);
        });

        return listDeferred.promise;
    };

    this.update = function(args) {
        return ApiService.invoke({
            data: setCommand(args, 'updateVirtualMachine')
        });
    };

    this.remove = function(args) {
        return ApiService.invoke({
            data: setCommand(args, 'destroyVirtualMachine')
        });
    };

    //CRUD//

    //ListView//

    this.listView = function() {
        return {
            columns: function() {
                return [{
                    field: 'displayname',
                    displayName: 'Name',
                    type: 'String'
                }, {
                    field: 'state',
                    displayName: 'State',
                    type: 'String'
                }];
            },
            filters: function() {
                var filters = [];
                var stateDeferred = $q.defer();
                stateDeferred.resolve({
                    field: 'state',
                    displayName: 'State',
                    values: [{
                        name: 'Running',
                        value: 'Running'
                    },{
                        name: 'Stopped',
                        value: 'Stopped'
                    }, {
                        name: 'Destroyed',
                        value: 'Destroyed'
                    }]
                });
            }
        };
    };

    //ListView//

});