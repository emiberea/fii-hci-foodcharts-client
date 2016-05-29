var app = angular.module('FoodCharts', ['ui.bootstrap','ui.router', 'ngRoute'])
                 .filter("toArray", function () {
                     return function (obj) {
                         var result = [];
                         angular.forEach(obj, function (val, key) {
                             result.push(val);
                         });
                         return result;
                     }
                 })
                 .filter('capitalize', function() {
                    return function(input, scope) {
                        if (input != null)
                        input = input.toLowerCase();
                        return input.substring(0,1).toUpperCase() + input.substring(1);
                  }
                });


app.run(function ($rootScope) {
    var size = localStorage.getItem('bodySizeClass');

    if(size){
        $rootScope.bodyClass = size;
    }else{
        $rootScope.bodyClass = "body25";
    }
});


app.config(function ($routeProvider, $stateProvider, $urlRouterProvider, $locationProvider) {
		$stateProvider
         .state('/', {
             url: '/',
             templateUrl: 'views/home.html',
             controller: "homeController"
         })
        .state('/filters', {
            url: '/filters',
            templateUrl: 'views/filters.html',
            controller: "filtersController"
        })
        .state('/settings', {
            url: '/settings',
            templateUrl: 'views/settings.html',
            controller: "settingsController"
        });
        // .state('/activities', {
            // url: '/activities',
            // templateUrl: 'views/activities.html',
            // controller: "activityController"
        // }).state('/persons', {
            // url: '/persons',
            // templateUrl: 'views/persons.html',
            // controller: "personController"
        // });

    $urlRouterProvider.otherwise('/');    
});

app.service("settings", function () {
    this.BASE_API_URL = "http://dev.phos.com/app_dev.php/api/";
});

app.service('loading', function () {
    this.show = function () {
        $('#loadingDiv').show();
    };
    this.hide = function () {
        $('#loadingDiv').hide();
    };
});


app.factory("Data", function () {

    var sharedService = {};

    sharedService.deviceList = [];

    return sharedService;
});
