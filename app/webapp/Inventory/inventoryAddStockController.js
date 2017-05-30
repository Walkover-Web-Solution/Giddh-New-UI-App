let inventoryAddStockController = function($scope, $rootScope, $timeout, toastr, localStorageService, stockService, $state, groupService) {
  
  let vm = this;
  vm.editMode = false;
  
  vm.purchaseAccounts = [];
  vm.salesAccounts = [];
  vm.customUnits = [];
  vm.mfsCmbItem = {};
  $rootScope.selectedCompany = {};
  $rootScope.selectedCompany = localStorageService.get("_selectedCompany");

  // init arr obj
  vm.initAcDetailsObj=()=>
    ({
      rate: undefined,
      stockUnitCode: undefined
    })
  ;

  vm.appendEmptyRow=function(){
    try {
      vm.addStockObj.purchaseAccountDetails.unitRates.push(vm.initAcDetailsObj());
      return vm.addStockObj.salesAccountDetails.unitRates.push(vm.initAcDetailsObj());
    } catch (e) {
      vm.addStockObj.purchaseAccountDetails={unitRates:[]};
      vm.addStockObj.salesAccountDetails={unitRates:[]};
      vm.addStockObj.purchaseAccountDetails.unitRates.push(vm.initAcDetailsObj());
      return vm.addStockObj.salesAccountDetails.unitRates.push(vm.initAcDetailsObj());
    }
  };

  // init stock obj
  vm.initStockObj =function(){
    vm.addStockObj = {
      purchaseAccountDetails:{
        unitRates: []
      },
      salesAccountDetails:{
        unitRates: []
      },
      manufacturingDetails:{
        linkedStocks: []
      }
    };
    return vm.appendEmptyRow();
  };

  // clear stock form
  vm.clearAddEditStockForm =()=> vm.initStockObj();

  //getPurchaseAccounts
  vm.getPurchaseAccounts = function(query) {
    let reqParam = {
      companyUniqueName: $rootScope.selectedCompany.uniqueName,
      q: query,
      page: 1,
      count: 0
    };
    let data = {
      groupUniqueNames: [$rootScope.groupName.purchase]
    };
    return groupService.postFlatAccList(reqParam,data).then(vm.getPurchaseAccountsSuccess,vm.onFailure);
  };

  vm.getPurchaseAccountsSuccess = res => vm.purchaseAccounts = res.body.results;

  vm.onFailure = res => toastr.error(res.data.message);


  //getSalesAccounts
  vm.getSalesAccounts = function(query) {
    let reqParam = {
      companyUniqueName: $rootScope.selectedCompany.uniqueName,
      q: query,
      page: 1,
      count: 0
    };
    let data = {
      groupUniqueNames: [$rootScope.groupName.sales]
    };
    return groupService.postFlatAccList(reqParam,data).then(vm.getSalesAccountsSuccess,vm.onFailure);
  };

  vm.getSalesAccountsSuccess = res => vm.salesAccounts = res.body.results;

  //getStockUnits
  vm.getStockUnits = function() {
    let reqParam = {
      companyUniqueName: $rootScope.selectedCompany.uniqueName
    };
    return stockService.getStockUnits(reqParam).then(vm.getStockUnitsSuccess,vm.onFailure);
  };

  vm.getStockUnitsSuccess = function(res) {
    if (res.body.length) {
      return _.each(res.body, o=> vm.customUnits.push(_.pick(o, 'code', 'name')));
    }
  };

  vm.checkPrevItem=o=> (_.isEmpty(o.stockUnitCode) || _.isEmpty(o.rate)) && (_.isUndefined(o.stockUnitCode) || _.isUndefined(o.rate)) ? false : true;

  vm.addUnitItem=function(item, arrayType){
    if (vm.checkPrevItem(item)) {
      if (arrayType === 'pArr') {
        return vm.addStockObj.purchaseAccountDetails.unitRates.push(vm.initAcDetailsObj());
      } else if (arrayType === 'sArr') {
        return vm.addStockObj.salesAccountDetails.unitRates.push(vm.initAcDetailsObj());
      }
    }
  };


  vm.removeUnitItem=function(item, arrayType){
    if (!(item.rate || item.stockUnitCode)) {
      return false;
    }

    if (arrayType === 'pArr') {
      return vm.addStockObj.purchaseAccountDetails.unitRates = _.reject(vm.addStockObj.purchaseAccountDetails.unitRates, o=> o === item);
    } else if (arrayType === 'sArr') {
      return vm.addStockObj.salesAccountDetails.unitRates = _.reject(vm.addStockObj.salesAccountDetails.unitRates, o=> o === item);
    }
  };

  vm.addStock=function(){
    this.success = function(res) {
      toastr.success('Stock Item added successfully');
      vm.clearAddEditStockForm();
      // _.extend(vm.addStockObj, res.body)
      // getting list from parent controller
      $scope.$parent.stock.getHeirarchicalStockGroups();
      return $scope.$parent.stock.getStockGroupDetail($state.params.grpId);
    };

    this.failure = res => toastr.error(res.data.message || 'Something went Wrong, please check all input values');

    let reqParam = { 
      companyUniqueName: $rootScope.selectedCompany.uniqueName,
      stockGroupUniqueName: $state.params.grpId
    };

    if (!($state.params.grpId)) {
      toastr.warning('Please select a group first');
    }

    vm.removeEmptyParamsFrom();
    if (!vm.addStockObj.isFsStock) {
      vm.addStockObj.manufacturingDetails = null;
    }
    
    return stockService.createStock(reqParam, vm.addStockObj).then(this.success, this.failure);
  };

  vm.deleteStockItem=function(){
    this.success = function(res) {
      toastr.success(res.body);
      let item = $state.params.grpId;
      return $state.go('inventory.add-group', { grpId: item }, {reload: true, notify: true});
    };

    let reqParam = { 
      companyUniqueName: $rootScope.selectedCompany.uniqueName,
      stockGroupUniqueName: $state.params.grpId,
      stockUniqueName: vm.addStockObj.uniqueName
    };
    return stockService.deleteStock(reqParam).then(this.success, vm.onFailure);
  };

  vm.updateStock = function() {
    this.success = function(res) {
      toastr.success('Stock updated successfully');
      return $state.go('inventory.add-group.add-stock', { stockId: res.body.uniqueName }, {notify: true, reload:true});
    };

    let reqParam = { 
      companyUniqueName: $rootScope.selectedCompany.uniqueName,
      stockGroupUniqueName: $state.params.grpId,
      stockUniqueName: $state.params.stockId
    };

    vm.addStockObj = _.omit(vm.addStockObj, 'stockUnit');
    vm.removeEmptyParamsFrom();

    if (vm.addStockObj.isFsStock) {
      if (_.isEmpty(vm.addStockObj.manufacturingDetails)) {
        vm.addStockObj.manufacturingDetails = null;
      }
    } else {
      vm.addStockObj.manufacturingDetails = null;
    }

    return stockService.updateStockItem(reqParam, vm.addStockObj).then(this.success, vm.onFailure);
  };

  vm.removeEmptyParamsFrom=function(){
    if (vm.addStockObj.salesAccountDetails && vm.addStockObj.salesAccountDetails.unitRates.length) {
      vm.addStockObj.salesAccountDetails.unitRates = _.reject(vm.addStockObj.salesAccountDetails.unitRates, function(item){
        if (_.isEmpty(item)) {
          return !item;
        } else {
          return !(item.rate || item.stockUnitCode);
        }
      });
    }
    if (vm.addStockObj.purchaseAccountDetails && vm.addStockObj.purchaseAccountDetails.unitRates.length) {
      return vm.addStockObj.purchaseAccountDetails.unitRates = _.reject(vm.addStockObj.purchaseAccountDetails.unitRates, function(item){ 
        if (_.isEmpty(item)) {
          return !item;
        } else {
          return !(item.rate || item.stockUnitCode);
        }
      });
    }
  };

  // get stock Item details
  vm.getStockItemDetails=function(uName){
    let reqParam= {
      companyUniqueName: $rootScope.selectedCompany.uniqueName,
      stockGroupUniqueName: $state.params.grpId,
      stockUniqueName: uName
    };
    return stockService.getStockItemDetails(reqParam).then(vm.getStockItemDetailsSuccess, vm.onFailure);
  };


  vm.getStockItemDetailsSuccess=function(res){
    vm.addStockObj = angular.copy(res.body);
    vm.addStockObj.stockUnitCode = angular.copy(res.body.stockUnit.code);
    if (vm.addStockObj.purchaseAccountDetails) {
      vm.appendEmptyRow();
    } else {
      vm.addStockObj.purchaseAccountDetails={unitRates:[]};
      vm.addStockObj.salesAccountDetails={unitRates:[]};
      vm.appendEmptyRow();
    }
    if (vm.addStockObj.manufacturingDetails) {
      return vm.addStockObj.isFsStock = true;
    } else {
      return vm.addStockObj.isFsStock = false;
    }
  };
    

  // addMfsCmbItem itesm
  vm.addMfsCmbItem=function(){
    if (!vm.mfsCmbItem.quantity || !vm.mfsCmbItem.stockUniqueName || !vm.mfsCmbItem.stockUnitCode) {
      vm.mfsCmbItemErrMsg = "All fields are required to add Item";
      return false;
    } else {
      vm.mfsCmbItemErrMsg = undefined;
      let o = _.clone(vm.mfsCmbItem);
      try {
        vm.addStockObj.manufacturingDetails.linkedStocks.push(o);
      } catch (e) {
        vm.addStockObj.manufacturingDetails ={
          linkedStocks: []
        };
        vm.addStockObj.manufacturingDetails.linkedStocks.push(o);
      }

      return vm.mfsCmbItem = angular.copy({});
    }
  };

  vm.editMfsCmbItem=function(item, idx){
    item.idx = idx;
    item.hasIdx = true;
    vm.mfsCmbItem = angular.copy(item);
    return console.log("after:", vm.mfsCmbItem);
  };

  vm.deleteMfsCmbItem=item=>
    vm.addStockObj.manufacturingDetails.linkedStocks = _.reject(vm.addStockObj.manufacturingDetails.linkedStocks, o=> _.isEqual(o, item))
  ;

  vm.updateMfsCmbItem=function(){
    if (!vm.mfsCmbItem.quantity || !vm.mfsCmbItem.stockUniqueName || !vm.mfsCmbItem.stockUnitCode) {
      vm.mfsCmbItemErrMsg = "All fields are required to add Item";
      return false;
    } else {
      vm.mfsCmbItemErrMsg = undefined;
      let o = _.clone(vm.mfsCmbItem);
      vm.addStockObj.manufacturingDetails.linkedStocks.splice(o.idx, 1, o);
      return vm.mfsCmbItem = angular.copy({});
    }
  };

  // init func on dom ready
  $timeout(function() {
    // if _.isEmpty($state.params.stockId)
    //   $state.go('inventory', {}, {reload: true, notify: true})

    if(!_.isEmpty($state.params) && angular.isDefined($state.params.stockId) && ($state.params.stockId !== '')) {
      vm.stockEditMode =  true;
      vm.getStockItemDetails($state.params.stockId);
    } else {
      vm.stockEditMode =  false;
      vm.initStockObj();
    }
    

    return vm.getStockUnits();
  }
  ,100);
  
  return vm;
};

giddh.webApp.controller('inventoryAddStockController', inventoryAddStockController);