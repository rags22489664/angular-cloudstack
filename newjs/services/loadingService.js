cloudstack.service('LoadingService', function() {
    this.show = function(args) {
        console.log(args);
    };

    this.hide = function() {
        console.log("hide");
    };
});