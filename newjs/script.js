var cloudstack = angular.module("cloudstack", ['ngAnimate', 'ngAria', 'ui.router', 'md.data.table', 'ngMaterial']);

cloudstack.controller("BaseCtrl", ['$scope', function($scope) {

}])

.controller("HeaderCtrl", ['$scope', '$mdSidenav', function($scope, $mdSidenav) {
    $scope.toggleNav = function(id) {
        $mdSidenav(id).toggle();
    };
}])

.directive("listview", function() {
    return {
        restrict: "E",
        replace: true,
        scope: {
            command: '=',
            columns: '=',
            filters: '=',
            responsename: '@',
            responseobject: '@',
            title: '@'
        },
        controller: function($scope, ApiService) {

            $scope.pageSizes = [10, 20, 50, 100, 500];

            $scope.selected = [];

            $scope.query = {
                filter: '',
                order: '',
                limit: 10,
                page: 1
            };

            $scope.cols = $scope.columns();

            function success(response) {
                $scope.entities = {
                    data: response[$scope.responsename] && response[$scope.responsename][$scope.responseobject] ? response[$scope.responsename][$scope.responseobject] : [],
                    total: response[$scope.responsename] && response[$scope.responsename].count ? response[$scope.responsename].count : 0
                };
            }

            $scope.filterObj = {};
            $scope.filterValues = [];
            if ($scope.filters) {
                var filterDeferred = $scope.filters();
                if(filterDeferred.length) {
                    for(var index in filterDeferred) {
                        filterDeferred[index].then(function(data){
                            $scope.filterValues.push(data);
                        })
                    }
                }
            }

            $scope.getdata = function() {
                var command = $scope.command();
                command = angular.extend({}, command, $scope.filterObj, {
                    page: $scope.query.page,
                    pagesize: $scope.query.limit,
                    keyword: $scope.query.filter && $scope.query.filter.length ? $scope.query.filter : ''
                });
                var deferred = ApiService.invoke({
                    data: command,
                    onSuccess: success
                });
                return deferred;
            }

            $scope.onPredicateChange = function() {
                $scope.query.page = 1;
                $scope.deferred = $scope.getdata();
            };

            $scope.clearFilter = function(field) {
                $scope.filterObj[field] = undefined;
                $scope.onPredicateChange();
            };

            $scope.clearKeyword = function() {
                $scope.query.filter = undefined;
                $scope.onPredicateChange();
            };

            $scope.apiService = ApiService;

        },
        link: function(scope, element, attrs) {
            scope.apiService.login("/client/api", "admin", "password", null, function(data) {
                scope.deferred = scope.getdata();
            });

        },
        templateUrl: 'views/widgets/listview.html'
    }
})

.controller("ConfigurationCtrl", ['$scope', '$q', 'ApiService', function($scope, $q, ApiService) {

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
            displayName: 'Value'
        }, {
            field: 'description',
            displayName: 'Description'
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
            },{
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

                if(response.listzonesresponse && response.listzonesresponse.zone && response.listzonesresponse.zone.length) {
                    for(var index in response.listzonesresponse.zone) {
                        resFilter.values.push({
                            name: response.listzonesresponse.zone[index].name,
                            value: response.listzonesresponse.zone[index].id
                        });
                    }

                    if(resFilter.values.length) {
                        zoneDeferred.resolve(resFilter);
                    }
                }
            }
        });

        filters.push(zoneDeferred.promise);

        return filters;
    };

}])

.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');

    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'views/home.html'
        })
})

.service('HttpService', function($http) {
    this.ajax = function(request) {
        request.withCredentials = true;
        return $http(request);
    };
})

.service('NotificationService', function() {
    this.toast = function(message) {
        alert(message);
    };

})

.service('ApiService', function(HttpService, UtilityService, authentication, NotificationService) {
    this.login = function(url, username, password, domain, onSuccess, onFailure) {

        var data = [];
        data.push('command=login');
        data.push('response=json');
        data.push('username=' + username);
        data.push('password=' + password);
        if (domain) {
            data.push('domain=' + domain);
        }

        var successfn = function(data, status, headers, config) {
            authentication.setCloudstackUrl(url);
            authentication.setCurrentUser(data.loginresponse);
            onSuccess(data, status, headers, config);
        };

        var failurefn = function(data, status, headers, config) {
            onFailure(data, status, headers, config);
        };

        HttpService.ajax({
            method: 'POST',
            url: url,
            data: data.join('&'),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(successfn).error(failurefn);

    };

    this.invoke = function(args) {

        var data = args.data;
        var method = args.method;
        var onSuccess = args.onSuccess;
        var onFailure = args.onFailure;
        var onFinally = args.onFinally;

        var url = authentication.cloudstackUrl;
        if (!url) {
            throw new Error('url cannot be null');
        }

        if (!method) {
            method = 'GET';
        }

        if (!data || typeof data !== 'object') {
            throw new Error('data is invalid');
        }

        data.sessionkey = authentication.currentUser.sessionkey;
        data._ = new Date().getTime();
        data.response = 'json';

        for (var key in data) {
            if (data[key] === '' || data[key] === undefined) {
                delete data[key];
            }
        }

        var request = {};

        request.url = url;

        if (method === 'GET') {

            request.method = 'GET';
            request.params = data;

        } else if (method === 'POST') {

            request.method = 'POST';
            request.data = data;
            request.headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
            };

        }

        var ajax = HttpService.ajax(request);

        ajax.success(function(data, status, headers, config) {

            if (UtilityService.isAFunction(onSuccess)) {
                onSuccess(data, status, headers, config);
            } else {
                console.log(data);
            }

        }).error(function(data, status, headers, config) {

            if (status === 401) {
                authentication.logout();
                NotificationService.toast('Session Timed Out');
            }

            if (UtilityService.isAFunction(onFailure)) {
                onFailure(data, status, headers, config);
            } else {
                console.log(data);
            }

        }).finally(function() {
            if (UtilityService.isAFunction(onFinally)) {
                onFinally();
            }
        });

        return ajax;

    };
})


.service('UtilityService', function() {
    this.isAFunction = function(functionToCheck) {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    };
})


.service('LoadingService', function() {
    this.show = function(args) {
        console.log(args);
    };

    this.hide = function() {
        console.log("hide");
    };
})

.service('AsyncService', function(ApiService) {
    this.queryAsync = function(arguments) {

        var queryFunction = function(args) {

            var query = {};

            query.command = 'queryAsyncJobResult';
            query.jobid = args.jobid;

            ApiService.invoke({
                data: query,
                onSuccess: function(data, status, headers, config) {
                    var result = data.queryasyncjobresultresponse.jobstatus;

                    switch (result) {

                        case 0:
                            {
                                setTimeout(function() {
                                    queryFunction(args);
                                }, 5000);
                                break;
                            }

                        case 1:
                            {
                                args.success();
                                break;
                            }

                        case 2:
                            {
                                args.error();
                                break;
                            }
                    }

                },
                onFailure: function(data, status, headers, config) {
                    args.error(data, status, headers, config);
                }
            });
        };

        queryFunction(arguments);
    };
})

.factory('authentication', function($state) {

    var isAuthenticated = localStorage.isAuthenticated;
    var cloudstackUrl = localStorage.cloudstackUrl;
    var currentUser = undefined;

    if (localStorage.currentUser !== undefined) {
        currentUser = JSON.parse(localStorage.currentUser);
    }

    return {
        isAuthenticated: isAuthenticated,
        currentUser: currentUser,
        cloudstackUrl: cloudstackUrl,
        setCurrentUser: function(user) {
            this.currentUser = user;
            this.isAuthenticated = true;
            localStorage.currentUser = JSON.stringify(user);
            localStorage.isAuthenticated = true;
        },
        setCloudstackUrl: function(url) {
            this.cloudstackUrl = url;
            localStorage.cloudstackUrl = url;
        },
        logout: function() {
            this.currentUser = undefined;
            this.isAuthenticated = undefined;
            this.cloudstackUrl = undefined;
            delete localStorage.currentUser;
            delete localStorage.isAuthenticated;
            delete localStorage.cloudstackUrl;
            $state.go('login');
        }
    }

});