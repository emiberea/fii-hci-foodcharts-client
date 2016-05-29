app.controller("filtersController", function ($scope, $rootScope, $http, $modal, $location, $state, $q ) {


  $scope.foodName = [];
  $scope.nutrientAmount = [];
  $scope.nutrientName = [];

  $scope.nutrientOptions = [];
  $scope.nutrientShortOptions = [];

  $scope.foodOptions = [];
  //$scope.foodShortOptions = [];
  $scope.originalFoodOptions = [];

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
              foodId: parseInt(data[i].FoodID),
              foodSourceId: parseInt(data[i].FoodSourceID),
              foodGroupId: parseInt(data[i].FoodGroupID),
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

            // if( i < 6){
            //   $scope.foodShortOptions.push(food);
            // }
          }

          $scope.originalFoodOptions = $scope.foodOptions;

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

  $scope.filterByFoodGroup = function(param, checked){
    var items = $scope.foodOptions,
        filtered = [];

    if(checked){
      $rootScope.groupFilters.push(param);
    }else{
      var index = $rootScope.groupFilters.indexOf(param);
      if(index > -1)
        $rootScope.groupFilters.splice(index, 1);
    }    

    if($rootScope.groupFilters.length > 0){
      for(var i = 0; i < items.length; i++){      
        
        if($rootScope.groupFilters.indexOf(items[i].foodGroupId) > -1){          
          filtered.push(items[i]);
        }
      }
      $scope.foodOptions = filtered;
    }else{
      $scope.foodOptions = $scope.originalFoodOptions;
    }

    $rootScope.nutritionForFoodFilter = [];
  } 

  $scope.filterByFoodSource = function(param, checked){
     var items = $scope.foodOptions,
        filtered = [];        

      if(checked){
        $rootScope.sourceFilters.push(param);
      }else{
        var index = $rootScope.sourceFilters.indexOf(param);
        if(index > -1)
          $rootScope.sourceFilters.splice(index, 1);
      } 

      if($rootScope.sourceFilters.length > 0){
        for(var i = 0; i < items.length; i++){      
          
          if($rootScope.sourceFilters.indexOf(items[i].foodSourceId) > -1){          
            filtered.push(items[i]);
          }
        }
        $scope.foodOptions = filtered;
      }else{
        $scope.foodOptions = $scope.originalFoodOptions;
      }

      $rootScope.nutritionForFoodFilter = [];
  }

  $scope.filterByFood = function(param, checked, index){  
    var filteredNutrients = [],
        nutrients = $scope.nutrientAmount,
        currentSelectedFood = $scope.foodOptions[index];

    if(checked){
      $rootScope.foodsFilters.push(param);
    }else{
      var index = $rootScope.foodsFilters.indexOf(param);
      if(index > -1)
        $rootScope.foodsFilters.splice(index, 1);
    }

    if(checked){
      for(var i = 0; i < nutrients.length; i++){        
        if(nutrients[i].FoodID == param){
          var currentNutrient = getNutrientById(nutrients[i].NutrientID),
              newNutrient = {
                nutrientName: currentNutrient.NutrientName,
                nutrientValue: nutrients[i].NutrientValue,
                nutrientDecimals: currentNutrient.NutrientDecimals,
                nutrientUnit: currentNutrient.NutrientUnit
              };

           filteredNutrients.push(newNutrient);
        }        
      } 
      $rootScope.nutritionForFoodFilter.push({
        foodId: currentSelectedFood.foodId,
        foodSourceId: currentSelectedFood.foodSourceId,
        foodGroupId: currentSelectedFood.foodGroupId,
        description: currentSelectedFood.description,
        nutrients: filteredNutrients
      })      
    }else{
      for(var j = 0; j < $rootScope.nutritionForFoodFilter.length; j++){
        if($rootScope.nutritionForFoodFilter[j].foodId == param){
          $rootScope.nutritionForFoodFilter.splice(j, 1);
          break;
        }
      }
    }

    showDiagramBasedOnNutrients();
    console.log($rootScope.nutritionForFoodFilter)
  }

  getFoodById = function(foodId){
    var foods = $scope.originalFoodOptions;

    for(var i = 0; i < foods.length; i++){
      if(foods[i].foodId == foodId){
        return foods[i];
      }
    }
  }

  getNutrientById = function(nutrientId){
    var nutrients = $scope.nutrientName;
   // console.log(nutrientId);
    for(var i = 0; i < nutrients.length; i++){
      if(nutrients[i].NutrientID == nutrientId){
        return nutrients[i];
      }
    }
  }

  showDiagramBasedOnNutrients = function(){
    var foods = $rootScope.nutritionForFoodFilter;

    if(foods.length == 1){
      showPieChartDiagram(foods[0]);
    }
  }

  showPieChartDiagram = function(food){
    var nutrients = food.nutrients,
        canvas = document.getElementById('responseChart'),
        labels = [],
        infoData = [],
        options, pieChart;



    for(var i = 0; i < nutrients.length; i++){
      var unit = nutrients[i].nutrientUnit,
          name = nutrients[i].nutrientName,
          value = nutrients[i].nutrientValue;

      if(unit !="kCal" && unit != "kJ" && unit != "NE"){
       
        if(value > 0){
          if(unit == "mg"){
            infoData.push(value / 1000);
          }else if(unit == "µg"){
            infoData.push(value / 1000000);
          }else{
            infoData.push(value);
          }

          labels.push(name);
        }
        
      }
    }
    console.log(infoData)
    options = {
      responsive: true,
      responsiveAnimationDuration: 500,
      fontSize: 15
    };
    
    pieChart = new Chart(canvas,{
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            data: infoData,
            backgroundColor: $rootScope.colors
          }
        ]
      },
      options: options
    });

    $scope.selectedChartType = 'pie';
  }

});
