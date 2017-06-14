let homeController = function($scope, $rootScope, getLedgerState, $state, $location, localStorageService, $http) {
  $scope.goToLedgerState = function() {
    $rootScope.firstLogin = getLedgerState.data.firstLogin;
    // if getLedgerState.data.shared && getLedgerState.data.firstLogin == false
    //   $rootScope.selectedCompany = getLedgerState.data
    // if getLedgerState.data.role.uniqueName == 'super_admin' || getLedgerState.data.role.uniqueName == 'view_only' || getLedgerState.data.role.uniqueName == 'super_admin_off_the_record'
    //   $state.go('dashboard')
    // else
    return $http.get('/state-details').then(
        function(res) {
            $rootScope.selectedCompany = localStorageService.get("_selectedCompany");
            if ($rootScope.selectedCompany.uniqueName === res.data.body.companyUniqueName) {
                if (res.data.body.lastState.indexOf('ledger') !== -1) {
                    let state = res.data.body.lastState.split('@');
                    return $state.go(state[0], {unqName:state[1]});
                } else if (res.data.body.lastState !== '/home') {
                    return $state.go(res.data.body.lastState);
                } else {
                    return $state.go('company.content.ledgerContent');
                }
            } else {
                let lastStateData =  res.data.body;
                return $rootScope.$emit('different-company', lastStateData);
            }
        },
        res => $state.go('company.content.ledgerContent'));
};
    //$state.go('company.content.ledgerContent')

    // else
    //   if (getLedgerState.data.role.uniqueName == 'super_admin' || getLedgerState.data.role.uniqueName == 'super_admin_off_the_record' || getLedgerState.data.role.uniqueName == 'view_only')
    //     $state.go('dashboard')
    //   else
    //     $state.go('company.content.manage')

  if (window.sessionStorage.getItem('_ak')) {
    $scope.goToLedgerState();
  }

  return $rootScope.setActiveFinancialYear(getLedgerState.data.activeFinancialYear);
};

//init angular app
giddh.webApp.controller('homeController', homeController);
