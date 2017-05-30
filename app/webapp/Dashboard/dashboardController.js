let dashboard = angular.module('dashboard', [
  "networthModule",
  "liveaccountsModule",
  "piechartModule",
  "historicalModule",
  "compareModule",
  "revenuechartModule",
  "profitlossModule",
  "combinedModule"
]);

let dashboardController = function($scope, $rootScope, toastr) {
  $rootScope.cmpViewShow = true;

  $scope.$on('company-changed', function(event,changeData) {
    if ((changeData.type === 'CHANGE') || (changeData.type === 'SELECT')) {
      return $scope.$broadcast('reloadAll');
    }
  });

  toastr.warning("Data can be delayed by one hour");

  return $scope.hardRefresh = () => $scope.$broadcast('reloadAll');
};

dashboard.controller('dashboardController',dashboardController);
