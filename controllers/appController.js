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
                 // .filter('groups', function($rootScope){
                    
                 //    return function(input, a, b){
                 //        var filters = $rootScope.groupFilters;

                 //        if(filters.length == 0){
                 //            return input;
                 //        }else{
                 //            for(var i = 0; i < filters.length; i++){
                 //                if(input.foodGroupId == filters.id)
                 //                    return input;
                 //            }                            
                 //        }                        
                 //    }
                 // });


app.run(function ($rootScope) {
    var size = localStorage.getItem('bodySizeClass');

    if(size){
        $rootScope.bodyClass = size;
    }else{
        $rootScope.bodyClass = "body25";
    }

    $rootScope.groupFilters = [];
    $rootScope.sourceFilters = [];
    $rootScope.foodsFilters = [];
    $rootScope.nutritionForFoodFilter = [];
    $rootScope.colors = [
        '#F44336', '#673AB7','#E91E63', '#2196F3', '#9C27B0', '#00BCD4',
        '#3F51B5', '#009688', '#03A9F4', '#4CAF50', '#CDDC39', '#8BC34A', 
        '#FFC107', '#FFEB3B', '#FF5722', '#FF9800', '#795548', '#607D8B',
        '#B71C1C', '#880E4F', '#4A148C', '#0D47A1', '#311B92', '#006064',
        '#01579B', '#1A237E', '#004D40', '#1B5E20', '#33691E', '#827717',
        '#FF6F00', '#3E2723', '#BF360C', '#E65100', '#F57F17', '#D50000',
        '#C51162', '#6200EA', '#AA00FF', '#304FFE', '#00B8D4', '#0091EA', 
        '#0091EA', '#00BFA5', '#00C853', '#AEEA00', '#64DD17', '#FFD600',
        '#FFAB00', '#FF6D00', '#DD2C00', '#9FA8DA', '#EF9A9A', '#F48FB1',
        '#CE93D8', '#B39DDB', '#90CAF9', '#80DEEA', '#81D4FA', '#80CBC4',
        '#A5D6A7', '#E6EE9C', '#C5E1A5', '#FFE082', '#FFF59D', '#FFAB91',
        '#FFCC80', '#BCAAA4', '#7B1FA2', '#512DA8', '#1976D2', '#303F9F',
        '#0097A7', '#0288D1', '#00796B', '#388E3C', '#AFB42B', '#689F38',
        '#FFA000', '#FBC02D', '#F57C00', '#E64A19', '#5D4037', '#616161',
        '#E91E63', '#F44336', '#9C27B0', '#673AB7', '#2196F3', '#3F51B5', 
        '#00BCD4', '#03A9F4', '#4CAF50', '#009688', '#C0CA33', '#FFB300', 
        '#8BC34A', '#FDD835', '#FF5722', '#FF9800', '#795548', '#9E9E9E'
    ]
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
