let inventoryCustomStockController = function($scope, $rootScope, $timeout, toastr, localStorageService, stockService, $state) {
  
  let vm = this;
  vm.editMode = false;
  $rootScope.selectedCompany = {};
  $rootScope.selectedCompany = localStorageService.get("_selectedCompany");

  //getStockUnits
  vm.getStockUnits = function() {
    let reqParam = {
      companyUniqueName: $rootScope.selectedCompany.uniqueName
    };
    return stockService.getStockUnits(reqParam).then(vm.getStockUnitsSuccess,vm.getStockUnitsFailure);
  };

  vm.getStockUnitsSuccess = function(res) {
    vm.unitTypes = res.body;
    return vm.makeUnits();
  };

  vm.getStockUnitsFailure = res => toastr.error(res.data.message);

  vm.clearCustomUnitStock =function(){
    vm.customUnitObj = angular.copy({});
    return vm.customUnitObj.parentStockUnit = null;
  };

  vm.addCustomUnitStock = function(){
    let reqParam = {
      companyUniqueName: $rootScope.selectedCompany.uniqueName
    };
    return stockService.createStockUnit(reqParam, vm.customUnitObj).then(vm.createStockUnitSuccess,vm.getStockUnitsFailure);
  };

  vm.createStockUnitSuccess = function(res) {
    vm.clearCustomUnitStock();
    vm.unitTypes.push(res.body);
    return vm.makeUnits();
  };

  vm.updateCustomUnitStock = function(){
    let reqParam=
      {companyUniqueName: $rootScope.selectedCompany.uniqueName};
    return stockService.updateStockUnit(reqParam, vm.customUnitObj).then(vm.updateStockUnitSuccess,vm.getStockUnitsFailure);
  };

  vm.updateStockUnitSuccess = function(res) {
    console.log(vm.customUnitObj, res.body);
    vm.unitTypes.splice(vm.customUnitObj.idx, 1, res.body);
    // vm.unitTypes = _.reject(vm.unitTypes, (o)->
    //   return o.code is res.body.code
    // )
    // vm.unitTypes.push(res.body)
    vm.makeUnits();
    return vm.cancelEditMode();
  };

  vm.deleteCustomUnitStock = function(item){
    vm.tempDelItem = item;
    let reqParam = {
      companyUniqueName: $rootScope.selectedCompany.uniqueName,
      uName: item.code
    };
    return stockService.deleteStockUnit(reqParam).then(vm.deleteStockUnitSuccess,vm.getStockUnitsFailure);
  };

  vm.deleteStockUnitSuccess = function(res) {
    toastr.success(res.body, res.status);
    vm.unitTypes = _.reject(vm.unitTypes, o=> o.code === vm.tempDelItem.code);
    vm.tempDelItem = undefined;
    return vm.makeUnits();
  };

  vm.cancelEditMode=function(){
    vm.editMode = false;
    return vm.customUnitObj = angular.copy({});
  };

  vm.editUnit=function(item, idx){
    vm.editMode = true;
    vm.customUnitObj = angular.copy(item);
    vm.customUnitObj.uName = _.clone(item.code);
    return vm.customUnitObj.idx = idx;
  };

  vm.makeUnits = function() {
    vm.customUnits = [];
    let arr = _.clone(vm.unitTypes);
    return _.each(arr, o=> vm.customUnits.push(_.pick(o, 'code', 'name')));
  };


  // init func on dom ready
  $timeout(() =>
    //get stocks
    vm.getStockUnits()
  
  ,10);
  
  return vm;
};

giddh.webApp.controller('inventoryCustomStockController', inventoryCustomStockController);