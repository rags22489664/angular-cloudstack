cloudstack.factory('authentication', function($state) {

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