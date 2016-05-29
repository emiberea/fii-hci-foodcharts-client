app.controller("filtersController", function ($scope, $rootScope, $http, $modal, $location, $state, $q ) {


  $scope.foodName = [];
  $scope.nutrientAmount = [];
  $scope.nutrientName = [];

  $scope.readFoodJson = function(){
    $http.get('/json/food_name.json')
         .then(function(msg){       
          $scope.foodName = msg.data;
         });
  };

  $scope.readNutrienAmountJson =  function(){
    $http.get('/json/nutrient_amount.json')
         .then(function(msg){
          $scope.nutrientAmount= msg.data;

         });
  };

  $scope.readNutrientNameJson = function(){
    $http.get('/json/nutrient_name.json')
         .then(function(msg){
          $scope.nutrientName = msg.data;
         });
  };

  $scope.readJsons = function(){

    if($scope.foodName.length == 0)
       $scope.readFoodJson();

    if($scope.nutrientAmount.length == 0)
      $scope.readNutrienAmountJson();
   
    if($scope.nutrientName.length==0)
      $scope.readNutrientNameJson();
  };

  $scope.readJsons();

  $scope.prepareFilters = function(){

  }

  
});
