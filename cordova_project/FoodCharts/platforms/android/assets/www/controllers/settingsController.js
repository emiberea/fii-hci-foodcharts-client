app.controller("settingsController", function ($scope, $rootScope, $http, $modal, $location, $state ) {

  $scope.applyResizeClass = function(size){
    $rootScope.bodyClass = "body" + size;

    localStorage.setItem("bodySizeClass", "body" + size);
  }
  

  // $rootScope.data.logged = localStorage.getItem("logged");
  // if($rootScope.data.logged){

  //   $rootScope.loggedUser = localStorage.getItem("loggedUser");
  // }
  
  // $scope.goToActivities = function(){
  //   console.log("GOING TO ACTIVITIES");
  //   $state.go("/activities");
  // };

  // $scope.goToPersons = function(){
  //   $state.go("/persons");
  // };

  // $scope.loggout = function(){
  //   $rootScope.data.logged = false;
  //   $state.go("/")
  // }
});
