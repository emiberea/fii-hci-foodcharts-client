app.controller("filtersController", function ($scope, $rootScope, $http, $modal, $location, $state, $q ) {


  $scope.foodName = [];
  $scope.nutrientAmount = [];
  $scope.nutrientName = [];

  $scope.nutrientOptions = [];
  $scope.nutrientShortOptions = [];

  $scope.foodOptions = [];
  $scope.foodShortOptions = [];

  $scope.foodGroupOptions = [];
  $scope.foodGroupShortOptions = [];

  $scope.foodSourceOptions = [];
  $scope.foodSourceShortOptions = [];

  $scope.selectedChartType = undefined;
  $scope.availableCharts = [
    { id: 'line', name: 'Line chart'},
    { id: 'bar', name: 'Bar chart'},
    { id: 'radar', name: 'Radar chart'},
    { id: 'polar', name: 'Polar area chart'},
    { id: 'pie', name: 'Pie chart'},
    { id: 'doughnut', name: 'Doughnut chart'}
  ];
  $scope.calories = [
    { id: 1, label: '0 - 100'},
    { id: 2, label: '100 - 200'},
    { id: 3, label: '200 - 300'},
    { id: 4, label: '300 - 400'},
    { id: 5, label: '400 - 500'},
    { id: 6, label: '500 - 600'},
    { id: 7, label: '600 - 700'},
    { id: 8, label: '700 - 800'},
    { id: 9, label: '800 - 900'},
    { id: 10, label: ' > 900'}
  ];


  $scope.readFoodJson = function(){
    $http.get('/json/food_name.json')
         .then(function(msg){       
          var data = angular.fromJson(msg.data);
          $scope.foodName = data;

          for(var i=0; i< data.length; i++){    
            var food = {
              foodId: data[i].FoodID,
              foodSourceId: data[i].FoodSourceID,
              foodGroupId: data[i].FoodGroupID,
              description: data[i].FoodDescription
            },
              group = {
                id: parseInt(data[i].FoodGroup.FoodGroupID),
                name: data[i].FoodGroup.FoodGroupName
            },
              source = {
                id: parseInt(data[i].FoodSource.FoodSourceID),
                name: data[i].FoodSource.FoodSourceDescription
            };

            $scope.foodOptions.push(food);
            addOnceToArray(group, $scope.foodGroupOptions, $scope.foodGroupShortOptions);
            addOnceToArray(source, $scope.foodSourceOptions, $scope.foodSourceShortOptions);

            if( i < 6){
              $scope.foodShortOptions.push(food);
            }
          }

         });
  };

  addOnceToArray = function(group, destination, shortDestionation){
    var ok = true,
        okShort = true;      

    if(group.name != undefined && group.id != undefined){
      for(var i = 0; i < destination.length; i++){
        if(destination[i].id == group.id){
          ok = false; break;
        }
      }

      if(ok)
          destination.push(group);

      if(shortDestionation.length < 6){
        for(var i = 0; i < shortDestionation.length; i++){
          if(shortDestionation[i].id == group.id){
            okShort = false; break;
          }
        }
        if(okShort)
          shortDestionation.push(group);
      }

    }
  };

  $scope.readNutrienAmountJson =  function(){
    $http.get('/json/nutrient_amount.json')
         .then(function(msg){
            var data =  angular.fromJson(msg.data);

            $scope.nutrientAmount = data;

            // for(var i = 0; i < data.length; i++){
            
            // }
         });
  };

  $scope.readNutrientNameJson = function(){
    $http.get('/json/nutrient_name.json')
         .then(function(msg){
          var data = angular.fromJson(msg.data);
          $scope.nutrientName = data;

          for(var i=0; i< data.length; i++){             
            $scope.nutrientOptions.push({
              id: data[i].NutrientID,
              name: data[i].NutrientName
             });

            if( i < 6){
              $scope.nutrientShortOptions.push({
                id: data[i].NutrientID,
                name: data[i].NutrientName
             });
            }
          }        
         });
  };

  $scope.readJsons = function(){
    var defer = $q.defer();
    
      if($scope.foodName.length == 0)
         $scope.readFoodJson();

      if($scope.nutrientAmount.length == 0)
        $scope.readNutrienAmountJson();
     
      if($scope.nutrientName.length==0)
        $scope.readNutrientNameJson();
   defer.resolve(true);

    return defer.promise;
  };  

  $scope.prepareFilters = function(){
    $scope.readJsons()
  }

  $scope.prepareFilters();


  $scope.changeChartType = function(){
    console.log("chartType", $scope.selectedChartType);
  }
  
});
