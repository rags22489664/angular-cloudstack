cloudstack.service('HttpService', function($http) {
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