cloudstack.service('HttpService', function($http) {
    this.ajax = function(request) {
        request.withCredentials = true;
        return $http(request);
    };
});