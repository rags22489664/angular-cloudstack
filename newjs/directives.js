cloudstack.directive("detailview", function() {
    return {
        restrict: "E",
        replace: true,
        scope: {
            title: '@'
        },
        controller: function($scope, $state, ApiService) {

        },
        link: function(scope, element, attrs) {

        },
        templateUrl: 'views/widgets/detailview.html'
    }
})

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
        controller: function($scope, $state, ApiService) {

            if (!$scope.title) {
                $scope.error = "Please pass the title attribute in the widget";
                return;
            }

            if (!$scope.responsename) {
                $scope.error = "Please pass the responsename attribute in the widget";
                return;
            }

            if (!$scope.responseobject) {
                $scope.error = "Please pass the responseobject attribute in the widget";
                return;
            }

            if (!$scope.command) {
                $scope.error = "Please pass the command attribute in the widget";
                return;
            }

            if (!$scope.columns) {
                $scope.error = "Please pass the columns attribute in the widget";
                return;
            }

            $scope.pageSizes = [10, 20, 50, 100, 500];

            $scope.selected = [];

            $scope.showFilter = false;

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
                if (filterDeferred.length) {
                    for (var index in filterDeferred) {
                        filterDeferred[index].then(function(data) {
                            $scope.filterValues.push(data);
                        })
                    }
                }
            }

            $scope.getRequest = function() {
                var command = $scope.command();
                command = angular.extend({}, command, $scope.filterObj, {
                    page: $scope.query.page,
                    pagesize: $scope.query.limit,
                    keyword: $scope.query.filter && $scope.query.filter.length ? $scope.query.filter : ''
                });
                return command;
            }

            $scope.getdata = function() {
                var command = $scope.getRequest();
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

            $scope.onRowClick = function(entity, index) {
                console.log(entity);
            };

            $scope.apiService = ApiService;

        },
        link: function(scope, element, attrs) {
            scope.deferred = scope.getdata();
        },
        templateUrl: 'views/widgets/listview.html'
    }
})