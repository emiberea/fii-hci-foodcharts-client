app.controller("filtersController", function ($scope, $rootScope, $http, $modal, $location, $state, $q ) {

  $scope.showDown = true;
  $scope.showFilters = true;
  $scope.showResults = true;
  $scope.showDiagram = false;

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
    { id: 'polarArea', name: 'Polar area chart'},
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

  $scope.canvas = document.getElementById('responseChart');
  $scope.chart = null;

  $scope.currentDiagram = null;
  // initScrollbar = function(){
  //   var bigContainer = document.getElementById('mySection');

  //   Ps.initialize(bigContainer);
  // }

  // initScrollbar();

  $scope.readFoodJson = function(){
    $http.get('json/food_name.json')
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
          $scope.showDiagram = false;

         });
  };

  $scope.readNutrienAmountJson =  function(){
    $http.get('json/nutrient_amount.json')
         .then(function(msg){
            var data =  angular.fromJson(msg.data);

            $scope.nutrientAmount = data;
         });
  };

  $scope.readNutrientNameJson = function(){
    $http.get('json/nutrient_name.json')
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
 
  $scope.readJsons();

  $scope.changeChartType = function(){    
    //console.log($scope.currentDiagram)
    var type = $scope.currentDiagram;

    resetChartCanvas();

    /*if($scope.currentDiagram){      
      var currentData = $scope.currentDiagram.data;
     // console.log("current data",currentData.labels);

      $scope.chart = new Chart($scope.canvas ,{
            type: $scope.selectedChartType,
            data: {
              labels: currentData.labels,
              datasets:currentData.datasets
            },            
            options: $scope.currentDiagram.options
          });
      
    }*/

    if($scope.nutritionForFoodFilter.length > 0){
      if(type == 'pie'){
        showPieChartDiagram($rootScope.nutritionForFoodFilter[0])
      }else if(type == "line"){
        showPieChartDiagram()
      }
    }
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
       $scope.showDiagram = false;
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
         $scope.showDiagram = false;
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
      if($rootScope.nutritionForFoodFilter.length == 0){
        resetChartCanvas();
      }
    }
    console.log($rootScope.nutritionForFoodFilter)
    if($rootScope.nutritionForFoodFilter.length > 0){
      showDiagramBasedOnNutrients();
    }
    
    
  }

  $scope.filterByNutrient = function(param, checked, index){
    var nutrientAmount = $scope.nutrientAmount,
        currentNutrient = nutrientAmount[index],
        foodContaining = [];

    if(checked){
      for(var i = 0; i < nutrientAmount.length; i++){
        if(nutrientAmount[i].NutrientID == currentNutrient.NutrientID){
          foodContaining.push(nutrientAmount[i].FoodID);
        }
      }

      console.log(foodContaining);

      for(var j = 0; j < $scope.foodOptions.length; j++){
        var currentId = $scope.foodOptions[j].foodId;
        if(foodContaining.indexOf(currentId) == -1){
          $scope.foodOptions.splice(j, 1);
        }
      }
    }
  }

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

  getNutrientById = function(nutrientId){
    var nutrients = $scope.nutrientName;
   // console.log(nutrientId);
    for(var i = 0; i < nutrients.length; i++){
      if(nutrients[i].NutrientID == nutrientId){
        return nutrients[i];
      }
    }
  }

  resetChartCanvas = function(){
    
    if($scope.chart)
     $scope.chart.destroy();
    
    if($scope.context){
      var context = $scope.canvas.getContext("2d");
      context.clearRect(0,0,$scope.canvas.width,$scope.canvas.height);
    }
  }

  showDiagramBasedOnNutrients = function(){
    var foods = $rootScope.nutritionForFoodFilter;

    resetChartCanvas();
    $scope.showDiagram = true;
    console.log(foods.length);
    if(foods.length == 1){
      console.log("Should pie chart");
     showPieChartDiagram($rootScope.nutritionForFoodFilter[0])
    }else{
      console.log("should line chart")
      resetChartCanvas();
      showLineChart();
    }
    
  }

  getFoodNutrientData = function(food){
    var nutrients = food.nutrients,
        labels = [],
        infoData = [],
        options;

    for(var i = 0; i < nutrients.length; i++){
      var unit = nutrients[i].nutrientUnit,
          name = nutrients[i].nutrientName,
          value = nutrients[i].nutrientValue,
          newValue;

      if(unit !="kCal" && unit != "kJ" && unit != "NE"){       
        if(value > 0){
          if(unit == "mg"){
            newValue = value / 1000            
          }else if(unit == "µg"){
            newValue = value / 1000000;
          }else{
           // infoData.push(value);
          }

          if(newValue != undefined && value > 1){
            infoData.push(newValue);
            labels.push(name);
          }
        }
        
      }
    }

    return {labels: labels, infoData: infoData};
  }

  $scope.filterByCalories = function(index, checked){
    var foods = [],
        nutrientAmounts = $scope.nutrientAmount,
        category = $scope.calories[index],
        minValue = category.minValue,
        maxValue = category.maxValue,
        current;

    if(checked) {
      for (var i = 0; i < nutrientAmounts.length; i++) {
        current = nutrientAmounts[i];
        if (current.NutrientID == 208 && minValue <= current.NutrientValue && maxValue >= current.NutrientValue) {
          foods.push(current.FoodID);
        }
      }

      for(var j = 0; j < $scope.foodOptions.length; j++){
        var currentId = $scope.foodOptions[j].foodId;
        if(foods.indexOf(currentId) == -1){
          $scope.foodOptions.splice(j, 1);
        }
      }
    }
    console.log(foods);
  };

  showPieChartDiagram = function(food){
    var info = getFoodNutrientData(food);
  
    options = {
      responsive: true,
      responsiveAnimationDuration: 500,
      fontSize: 15
    };
   // resetChartCanvas();

    $scope.chart = new Chart($scope.canvas ,{
      type: 'pie',
      data: {
        labels: info.labels,
        datasets: [
          {
            data: info.infoData,
            backgroundColor: $rootScope.colors
          }
        ]
      },
      options: options
    });

    // $scope.currentDiagram = {
    //   data : {
    //     labels: info.labels,
    //     datasets: [
    //       {
    //         data: info.infoData,
    //         backgroundColor: $rootScope.colors
    //       }
    //     ]
    //   },
    //   options: options
    // };

   // $scope.currentDiagramFoods = 

    $scope.selectedChartType = 'pie';
  };

  showLineChart = function(){
    console.log("SHOWING LINE CHART !!!")
    var currentFoods = $rootScope.nutritionForFoodFilter,
        results = [], datasets = [],
        options, data;

    for(var i = 0; i < currentFoods.length; i++){
      var result = getFoodNutrientData(currentFoods[i]);     
      results.push(result);
    }

    for(var j = 0; j < results.length; j++){   
    console.log(results[j]) 
      var newData = {
        label: currentFoods[j].description,
        data: results[j].infoData,
        backgroundColor: $rootScope.colors[j]
      };

      datasets.push(newData);
    }

    resetChartCanvas();
    $scope.chart = new Chart($scope.canvas,{
      type: 'line',
      data: {
        labels: results[0].labels,
        datasets: datasets
      },
      options: {
        responsive: true,
        responsiveAnimationDuration: 500,
        fontSize: 15
      }
    });

    $scope.selectedChartType = 'line';
  };


   window.addEventListener("resize", function(){
    var width = window.innerWidth;

    if(width > 992){
      $scope.showFilters = true;
      $scope.showResults = true;

    }else{
      if($scope.showDown){
        $scope.showFilters = false;
        $scope.showResults = true;
      }else{
        $scope.showFilters = true;
        $scope.showResults = false;
      }

    }

    console.log($scope.showFilters, $scope.showResults);


  });

  downloadCanvas = function downloadCanvas(link, canvasId, filename) {
    link.href = document.getElementById(canvasId).toDataURL();
    link.download = filename;
  }

  document.getElementById('download').addEventListener('click', function() {
    downloadCanvas(this, 'responseChart', 'chart.png');
  }, false);

});
