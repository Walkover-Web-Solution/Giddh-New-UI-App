let inventoryStockReportController = function($scope, $rootScope, $timeout, toastr, stockService, $state, $filter) {
  
  let vm = this;

  vm.selectedStock = {};

  vm.stockId = $state.params.stockId;
  if (_.isUndefined($rootScope.selectedCompany)) {
    $rootScope.selectedCompany = localStorageService.get('_selectedCompany');
  }
  
  vm.today = new Date();
  vm.fromDatePickerIsOpen = false;
  vm.toDatePickerIsOpen = false;
  vm.format = "dd-MM-yyyy";
  vm.dateOptions= {
    'year-format': "'yy'",
    'starting-day': 1,
    'showWeeks': false,
    'show-button-bar': false,
    'year-range': 1,
    'todayBtn': false
  };

  vm.report=
    {page: 0};

  vm.fromDate=
    {date:new Date(moment().subtract(1, 'month').utc())};

  vm.toDate =
    {date: new Date()};

  vm.findAndSet=()=>
    vm.selectedStock = _.find(vm.stockArr, item=> item.uniqueName === vm.stockId)
  ;

  vm.setStockArr=function(){
    vm.stockArr = $scope.$parent.stock.updateStockGroup.stocks;
    if (angular.isUndefined(vm.stockArr)) {
      return $timeout(function(){
        vm.stockArr = $scope.$parent.stock.updateStockGroup.stocks;
        return vm.findAndSet();
      }
      ,1500);
    } else {
      return vm.findAndSet();
    }
  };

  vm.fromDatePickerOpen = function(e){
    vm.fromDatePickerIsOpen = true;
    vm.toDatePickerIsOpen = false;
    return e.stopPropagation();
  };
      
  vm.toDatePickerOpen = function(e){
    vm.fromDatePickerIsOpen = false;
    vm.toDatePickerIsOpen = true;
    return e.stopPropagation();
  };

  vm.onFailure = res => toastr.error(res.data.message);

  vm.getStockReportSuccess=res=> vm.report = res.body;

  vm.getStockReport=function(){
    let reqParam= {
      companyUniqueName: $rootScope.selectedCompany.uniqueName,
      stockGroupUniqueName: $state.params.grpId,
      stockUniqueName: $state.params.stockId,
      to:$filter('date')(vm.toDate.date, 'dd-MM-yyyy'),
      from:$filter('date')(vm.fromDate.date, 'dd-MM-yyyy'),
      page:vm.report.page,
      count: 10
    };

    return stockService.getStockReport(reqParam).then(vm.getStockReportSuccess, vm.onFailure);
  };

  vm.goToManageStock=()=> $state.go('inventory.add-group.add-stock', { stockId: $state.params.stockId});

  // init func on dom ready
  $timeout(function() {
    if (_.isEmpty($state.params.stockId)) {
      return $state.go('inventory', {}, {reload: true, notify: true});
    } else {
      vm.getStockReport();
      return vm.setStockArr();
    }
  }
  ,100);
  
  return vm;
};

giddh.webApp.controller('inventoryStockReportController', inventoryStockReportController);