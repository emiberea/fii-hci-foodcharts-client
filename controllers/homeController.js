app.controller("homeController", function ($scope, $rootScope, $http, $modal, $location, $state ) {

  // $rootScope.data.logged = localStorage.getItem("logged");
  // if($rootScope.data.logged){

  //   $rootScope.loggedUser = localStorage.getItem("loggedUser");
  // }
  
  $scope.goToFilters = function(){
    console.log("GOING TO Filters");
    $state.go("/filters");
  };

  

  // $scope.goToPersons = function(){
  //   $state.go("/persons");
  // };

  // $scope.loggout = function(){
  //   $rootScope.data.logged = false;
  //   $state.go("/")
  // }
});
