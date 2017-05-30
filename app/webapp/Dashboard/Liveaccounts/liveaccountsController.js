let liveaccount = angular.module('liveaccountsModule', []);

let liveaccountsController = function($rootScope, $scope, $uibModal, userServices, localStorageService, toastr) {
  $scope.unq = 1;
  $scope.showThis = [];
  $scope.dataAvailable = false;
  $scope.errorMessage = "";

  $scope.getLiveData = function() {
    $scope.showThis = [];
    $scope.dataAvailable = false;
    $scope.errorMessage = "";
    if (_.isUndefined($rootScope.selectedCompany)) {
      $rootScope.selectedCompany = localStorageService.get("_selectedCompany");
    }
    let companyUniqueName =  {
      cUnq: $rootScope.selectedCompany.uniqueName
    };
    return userServices.getAccounts(companyUniqueName).then($scope.getLiveAccountsSuccess, $scope.getLiveAccountsFailure);
  };

  $scope.getLiveAccountsSuccess = function(res) {
    $scope.showThis = res.body;
    if ($scope.showThis.length <= 0) {
      $scope.dataAvailable = false;
      return $scope.errorMessage = "No data available";
    } else {
      $scope.dataAvailable = true;
      return $scope.errorMessage = "";
    }
  };

  $scope.getLiveAccountsFailure = function(res) {
    $scope.dataAvailable = false;
    return $scope.errorMessage = res.data.message;
  };

  $scope.reconnectBank = function(account) {
    let reqParam = {
      companyUniqueName: $rootScope.selectedCompany.uniqueName,
      loginId: account.loginId
    };
    return userServices.reconnectAccount(reqParam).then($scope.reconnectAccountSuccess,$scope.reconnectAccountFailure);
  };

  $scope.reconnectAccountSuccess= function(res) {
    let url = res.body.connectUrl;
    $scope.connectUrl = url;
    let modalInstance = $uibModal.open({
      templateUrl: '/public/webapp/Globals/modals/refreshBankAccountsModal.html',
      size: "md",
      backdrop: 'static',
      scope: $scope
    });
    return modalInstance.result.then((function(selectedItem) {
      $scope.refreshAccounts();
    }), function() {
      $scope.refreshAccounts();
    });
  };

  $scope.reconnectAccountFailure = res => toastr.error(res.data.message, "Error");

  $scope.refreshAccounts = function() {
    let companyUniqueName =  {
      cUnq: $rootScope.selectedCompany.uniqueName,
      refresh: true
    };
    return userServices.refreshAll(companyUniqueName).then($scope.getLiveAccountsSuccess, $scope.getLiveAccountsFailure);
  };

  $scope.refreshBank = function(account) {
    let reqParam = {
      companyUniqueName: $rootScope.selectedCompany.uniqueName,
      loginId: account.loginId
    };
    return userServices.refreshAccount(reqParam).then($scope.refreshBankSuccess, $scope.refreshBankFailure );
  };

  $scope.refreshBankSuccess = function(res) {
    let url = res.body.connectUrl;
    $scope.connectUrl = url;
    return $uibModal.open({
      templateUrl: '/public/webapp/Globals/modals/refreshBankAccountsModal.html',
      size: "md",
      backdrop: 'static',
      scope: $scope
    });
  };

  $scope.refreshBankFailure = res => toastr.error(res.data.message, "Error");

  return $scope.$on('company-changed', function(event,changeData) {
    if ((changeData.type === 'CHANGE') || (changeData.type === 'SELECT')) {
      return $scope.getLiveData();
    }
  });
};


liveaccount.controller('liveaccountsController',liveaccountsController)

.directive('liveAccount', [($locationProvider,$rootScope) => ({
  restrict: 'E',
  templateUrl: '/public/webapp/Dashboard/Liveaccounts/liveaccounts.html'
//  controller: 'liveaccountsController'
}) ]);