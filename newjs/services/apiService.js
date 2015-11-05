cloudstack.service('ApiService', function(HttpService, UtilityService, authentication, NotificationService) {
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
});