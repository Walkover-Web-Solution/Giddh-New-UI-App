let taxController = function($scope, $rootScope, modalService, companyServices, toastr) {
// get taxes
  $scope.getTax=function(){
    $scope.taxList = [];
    if ($rootScope.canUpdate && $rootScope.canDelete) {
      return companyServices.getTax($rootScope.selectedCompany.uniqueName).then($scope.getTaxSuccess, $scope.getTaxFailure);
    }
  };

  $scope.getTaxSuccess = function(res) {
    if (res.body.length === 0) {
      return $scope.taxList = [];
    } else {
      return _.each(res.body, function(obj) {
        obj.isEditable = false;
        if (obj.account === null) {
          obj.account = {};
          obj.account.uniqueName = '';
        }
        obj.hasLinkedAcc = _.find($scope.fltAccntListPaginated, acc=> acc.uniqueName === obj.account.uniqueName);
        return $scope.taxList.push(obj);
      });
    }
  };

  $scope.getTaxFailure = res => $scope.noTaxes = true;


  $scope.clearTaxFields = () =>
    $scope.createTaxData = {
      duration: "MONTHLY",
      taxFileDate: 1
    }
  ;


  $scope.addNewTax = function(newTax) {
    newTax = {
      updateEntries: false,
      taxNumber:newTax.taxNumber,
      name: newTax.name,
      account: {
        uniqueName: newTax.account.uniqueName
      },
      duration:newTax.duration,
      taxFileDate:1,
      taxDetail:[
        {
          date : $filter('date')($scope.fromTaxDate.date, 'dd-MM-yyyy'),
          value: newTax.value
        }
      ]
    };
    return companyServices.addTax($rootScope.selectedCompany.uniqueName, newTax).then($scope.addNewTaxSuccess, $scope.addNewTaxFailure);
  };

  $scope.addNewTaxSuccess = function(res) {
// reset tax data
    $scope.createTaxData = {
      duration: "MONTHLY",
      taxFileDate: 1
    };
    $scope.fromTaxDate = {date: new Date()};
    $scope.getTax();
    return toastr.success("Tax added successfully.", "Success");
  };


  $scope.addNewTaxFailure = res => toastr.error(res.data.message);

  //delete tax
  $scope.deleteTaxconfirmation = data =>
    modalService.openConfirmModal({
      title: 'Delete Tax',
      body: `Are you sure you want to delete? ${data.name} ?`,
      ok: 'Yes',
      cancel: 'No'}).then(function() {
        let reqParam = {
          uniqueName: $rootScope.selectedCompany.uniqueName,
          taxUniqueName: data.uniqueName
        };
        return companyServices.deleteTax(reqParam).then($scope.deleteTaxSuccess, $scope.deleteTaxFailure);
    })
  ;

  $scope.deleteTaxSuccess = function(res) {
    $scope.getTax();
    return toastr.success(res.status, res.body);
  };

  $scope.deleteTaxFailure = res => toastr.error(res.status, res.data.message);

  //edit tax
  $scope.editTax = function(item) {
    item.isEditable = true;
    $scope.taxEditData = item;
    $scope.taxDetail_1 = angular.copy(item.taxDetail);
    return _.each($scope.taxList, function(tax) {
      if (tax.uniqueName !== item.uniqueName) {
        return tax.isEditable = false;
      }
    });
  };

  $scope.updateTax = function(item) {
    let newTax = {
      'taxNumber': item.taxNumber,
      'name': item.name,
      'account':{
        'uniqueName': item.account.uniqueName
      },
      'duration':item.duration,
      'taxFileDate': item.taxFileDate,
      'taxDetail': item.taxDetail
    };
    item.hasLinkedAcc = true;
    $scope.taxValueUpdated = false;

    _.each($scope.taxDetail_1, (tax_1, idx) =>
      _.each(item.taxDetail, function(tax, index) {
        if ((tax.taxValue.toString() !== tax_1.taxValue.toString()) && (idx === index)) {
          return $scope.taxValueUpdated = true;
        }
      })
    );

    _.each(newTax.taxDetail, detail => detail.value = detail.taxValue.toString());

    let reqParam = {
      uniqueName: $rootScope.selectedCompany.uniqueName,
      taxUniqueName: $scope.taxEditData.uniqueName,
      updateEntries: false
    };

    if ($scope.taxValueUpdated) {
// modalService.openConfirmModal(
//   title: 'Update Tax Value',
//   body: 'One or more tax values have changed, would you like to update tax amount in all entries as per new value(s) ?',
//   showConfirmBox: true,
//   ok: 'Yes',
//   cancel: 'No'
// ).then(->
//   console.log this
//   reqParam.updateEntries = true
//   companyServices.editTax(reqParam, newTax).then($scope.updateTaxSuccess, $scope.updateTaxFailure)
// )
      $scope.updateEntriesWithChangedTaxValue = false;
      $scope.taxObj = {
        reqParam,
        newTax
      };
      return $scope.updateTax.modalInstance = $uibModal.open({
        templateUrl:'public/webapp/Globals/modals/update-tax.html',
        size: "md",
        backdrop: 'static',
        scope: $scope
      });
    } else {
      companyServices.editTax(reqParam, newTax).then($scope.updateTaxSuccess, $scope.updateTaxFailure);
      return item.isEditable = false;
    }
  };

  $scope.updateTaxAndEntries = function(val) {
    let { reqParam } = $scope.taxObj;
    let { newTax } = $scope.taxObj;
    reqParam.updateEntries = val;
    return companyServices.editTax(reqParam, newTax).then($scope.updateTaxSuccess, $scope.updateTaxFailure);
  };


  $scope.updateTaxSuccess = function(res) {
    $scope.taxEditData.isEditable = false;
    $scope.getTax();
    toastr.success(res.status, "Tax updated successfully.");
    return $scope.updateTax.modalInstance.close();
  };

  $scope.updateTaxFailure = function(res) {
    $scope.getTax();
    return toastr.error(res.data.message);
  };

  // edit tax slab
  $scope.addNewSlabBefore = function(tax, index){
    tax.taxValue = parseInt(tax.taxValue);
    let newTax = {
      taxValue: tax.taxValue,
      date: $filter('date')($scope.today, 'dd-MM-yyyy')
    };
    return $scope.taxEditData.taxDetail.splice(index, 0, newTax);
  };

  $scope.addNewSlabAfter = function(tax, index) {
    tax.taxValue = parseInt(tax.taxValue);
    let newTax = {
      taxValue: tax.taxValue,
      date: $filter('date')($scope.today, 'dd-MM-yyyy')
    };
    return $scope.taxEditData.taxDetail.splice(index+1, 0, newTax);
  };

  // remove slab
  $scope.removeSlab = (tax, index) =>
    modalService.openConfirmModal({
      title: 'Remove Tax',
      body: 'Are you sure you want to delete?',
      ok: 'Yes',
      cancel: 'No'
    }).then(() => $scope.taxEditData.taxDetail.splice(index, 1))
  ;

  return $scope.cancelUpdateTax = function() {
    $scope.taxEditData.taxDetail = $scope.preSpliceTaxDetail;
    return $scope.modalInstance.close();
  };
};


giddh.webApp.controller('taxController', taxController);