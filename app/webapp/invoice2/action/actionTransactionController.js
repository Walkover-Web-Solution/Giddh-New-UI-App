let actionTransactionController = function($scope, $rootScope, invoicePassed, invoiceService, toastr) {

  $scope.invoiceSelected = {};
  _.extend($scope.invoiceSelected, invoicePassed);
  return $scope.getTransactionList = function() {
    this.success = function(res) {
      $scope.getAllInvoices();
      return $scope.modalInstance.close();
    };
    this.failure = res => toastr.error(res.data.message);
    let infoToSend = {
      companyUniqueName: $rootScope.selectedCompany.uniqueName,
      invoiceUniqueName: $scope.invoiceSelected.uniqueName
    };
    let dataToSend = {
      amount: $scope.invoiceSelected.balanceDue,
      action: 'paid'
    };
    return invoiceService.performAction(infoToSend, dataToSend).then(this.success, this.failure);
  };
};


giddh.webApp.controller('actionTransactionController', actionTransactionController);