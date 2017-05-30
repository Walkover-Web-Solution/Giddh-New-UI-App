let ConfirmModalController = function($scope, $uibModalInstance, data) {
  $scope.data = angular.copy(data);
  
  $scope.closePop = ()=> $uibModalInstance.close();

  return $scope.cancelPop = () => $uibModalInstance.dismiss('cancel');
};

giddh.webApp.controller('ConfirmModalController', ConfirmModalController);