cloudstack.config(function($stateProvider, $urlRouterProvider) {;

    $urlRouterProvider.otherwise('/home');

    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'views/login.html',
            auth: false
        })
        .state('home', {
            url: '/home',
            templateUrl: 'views/home.html'
        })
        .state('virtualMachines', {
            url: '/virtualMachines',
            templateUrl: 'views/virtualMachines.html'
        })
        .state('virtualMachinesDetail', {
            url: '/virtualMachines/:virtualMachineId',
            params: {
                entity: null
            },
            templateUrl: 'views/virtualMachineDetail.html'
        })
        .state('configurations', {
            url: '/configurations',
            templateUrl: 'views/configurations.html'
        });
});

cloudstack.run(function($rootScope, authentication, $state) {
    $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams) {
            if((toState.auth === undefined || toState.auth) && !authentication.currentUser) {
                event.preventDefault();
                $state.go('login');
            }
        });
});