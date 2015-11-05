cloudstack.service('AsyncService', function(ApiService) {
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
});