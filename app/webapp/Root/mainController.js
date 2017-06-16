let mainController = function($scope, $state, $rootScope, $timeout, $http, $uibModal, localStorageService, toastr, locationService, modalService, roleServices, permissionService, companyServices, $window,groupService, $location, DAServices) {

$scope.hideHeader = false
  $rootScope.scriptArrayHead = [
    "public/webapp/newRelic.js",
    "public/webapp/core_bower.min.js",
    "public/webapp/_extras.js",
    "public/webapp/app.js",
    "public/webapp/app.min.js"
  ];
  $rootScope.scriptArrayBody = [
    "/node_modules/rxjs/bundles/Rx.umd.js",
    "/node_modules/es6-shim/es6-shim.js",
    "/node_modules/angular2/bundles/angular2-polyfills.js",
    "/node_modules/angular2/bundles/angular2-all.umd.min.js",
    "public/webapp/ng2.js"
  ];
  $rootScope.groupName = {
    sundryDebtors : "sundrydebtors",
    revenueFromOperations : "revenuefromoperations",
    indirectExpenses : "indirectexpenses",
    operatingCost: "operatingcost",
    otherIncome: "otherincome",
    purchase: "purchases",
    sales:"sales"
  };


  $rootScope.flyAccounts = false;
  $rootScope.$stateParams = {};
//  $rootScope.prefixThis = ""
  $rootScope.cmpViewShow = true;
  $rootScope.showLedgerBox = true;
  $rootScope.showLedgerLoader = false;
  $rootScope.basicInfo = {};
  //$rootScope.flatAccntListWithParents = []
  $rootScope.canManageComp = true;
  $rootScope.canViewSpecificItems = false;
  $rootScope.canUpdate = false;
  $rootScope.canDelete = false;
  $rootScope.canAdd = false;
  $rootScope.canShare = false;
  $rootScope.canManageCompany = false;
  $rootScope.canVWDLT = false;
  $rootScope.companyLoaded = true;
  $rootScope.superLoader = false;
  $rootScope.hideHeader = false;
  $rootScope.phoneVerified = false;
  $rootScope.stateParams = null;
  $rootScope.search = {};
  $rootScope.search.acnt = '';
  $rootScope.flatAccList = {
    page: 1,
    count: 20000,
    totalPages: 0,
    currentPage : 1,
    limit: 5
  };
  $rootScope.queryFltAccnt = [];
  $rootScope.fltAccntListPaginated = [];
  $rootScope.fltAccountListFixed = [];
  $rootScope.CompanyList = [];
  $rootScope.companyIndex = 0;
  $rootScope.selectedAccount = {};
  $rootScope.hasOwnCompany = false;
  $rootScope.sharedEntity = "";
  $rootScope.croppedAcntList = [];

  //#Date range picker###
  // $scope.fixedDate = {
  //   startDate: moment().subtract(30, 'days')._d,
  //   endDate: moment()._d
  // };


  // $scope.singleDate = moment()
  // $scope.fixedDateOptions = {
  //     locale:
  //       applyClass: 'btn-green'
  //       applyLabel: 'Apply'
  //       fromLabel: 'From'
  //       format: 'D-MMM-YY'
  //       toLabel: 'To'
  //       opens: 'center'
  //       cancelLabel: 'Cancel'
  //       customRangeLabel: 'Custom range'
  //     ranges:
  //       'Last 1 Day': [
  //         moment().subtract(1, 'days')
  //         moment()
  //       ]
  //       'Last 7 Days': [
  //         moment().subtract(6, 'days')
  //         moment()
  //       ]
  //       'Last 30 Days': [
  //         moment().subtract(29, 'days')
  //         moment()
  //       ]
  //       'Last 6 Months': [
  //         moment().subtract(6, 'months')
  //         moment()
  //       ]
  //       'Last 1 Year': [
  //         moment().subtract(12, 'months')
  //         moment()
  //       ]
  //     eventHandlers : {
  //       'apply.daterangepicker' : (e, picker) ->
  //         $scope.fixedDate.startDate = e.model.startDate._d
  //         $scope.fixedDate.endDate = e.model.endDate._d
  //     }
  // }
  // $scope.setStartDate = ->
  //   $scope.fixedDate.startDate = moment().subtract(4, 'days').toDate()

  // $scope.setRange = ->
  //   $scope.fixedDate =
  //       startDate: moment().subtract(5, 'days')
  //       endDate: moment()
  /*date range picker end*/

  //get user details
  let getUserSuccess = function(res) {
    localStorageService.set('_userDetails', res.data.body);
    $rootScope.basicInfo = res.data.body;
   // bug fixed by ghlabs team
    // if user don't have space in name then previous logic will fail
    if ($rootScope.basicInfo.name.match(/\s/g)) {
        $scope.userName = $rootScope.basicInfo.name.split(" ");
        $scope.userName = $scope.userName[0] + $scope.userName[1];
    }

    $scope.userName = $rootScope.basicInfo.name;
    $rootScope.getCompanyList();
    if (!_.isEmpty($rootScope.selectedCompany)) {
      return $rootScope.cmpViewShow = true;
    }
  };

  let getUserFailure = res => toastr.error('unable to fetch user');

  let getUserDetail = () => {
      let user = localStorageService.get('_userDetails');
      let url = isElectron ? '/users/' + user.uniqueName : '/fetch-user';
      return $http.get(url).then(getUserSuccess, getUserFailure);
  }
  if (window.sessionStorage.getItem('_ak')) {
    getUserDetail();
  }

  $scope.addScript = function() {
    _.each($rootScope.scriptArrayHead, function(script) {
      let sc = document.createElement("script");
      sc.src = $scope.prefixUrl(script);
      sc.type = "text/javascript";
      return document.head.appendChild(sc);
    });
    return _.each($rootScope.scriptArrayBody, function(script) {
      let sc = document.createElement("script");
      sc.src = $scope.prefixUrl(script);
      sc.type = "text/javascript";
      return document.body.appendChild(sc);
    });
  };

  $scope.prefixUrl = function(path) {
    let str = `http://1.${location.host}${path}`;
    console.log(str);
    return str;
  };

  $scope.runSetupWizard = () =>
    $rootScope.setupModalInstance = $uibModal.open({
      templateUrl: 'public/webapp/SetupWizard/setup-wizard.html',
      size: "lg",
      backdrop: 'static',
      scope: $scope
    })
  ;
    //modalInstance.result.then($scope.onCompanyCreateModalCloseSuccess, $scope.onCompanyCreateModalCloseFailure)

  //get account details for ledger
  $rootScope.getSelectedAccountDetail = acc => console.log(acc);

  // check IE browser version
  $rootScope.GetIEVersion = function() {
    let ua = window.navigator.userAgent;
    let msie = ua.indexOf('MSIE ');
    let trident = ua.indexOf('Trident/');
    let edge = ua.indexOf('Edge/');
    if (msie > 0) {
      return toastr.error('For Best User Expreince, upgrade to IE 11+');
    }
  };

  $rootScope.GetIEVersion();

  // check browser
  $rootScope.msieBrowser = function(){
    let ua = window.navigator.userAgent;
    let msie = ua.indexOf('MSIE');
    if ((msie > 0) || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
      return true;
    } else {
      console.info(window.navigator.userAgent, 'otherbrowser', msie);
      return false;
    }
  };

  // open window for IE
  $rootScope.openWindow = function(url) {
    let win = window.open();
    win.document.write('sep=,\r\n', url);
    win.document.close();
    win.document.execCommand('SaveAs', true, 'abc.xls');
    return win.close();
  };

  $scope.logout = () => {
    if (!isElectron) {
        $http.post('/logout').then((function(res) {
        // don't need to clear below
        // _userDetails, _currencyList
        localStorageService.remove('_userDetails');
        localStorageService.remove('_roles');
        localStorageService.remove('_currencyList');
        localStorageService.remove('_selectedAccount');
        localStorageService.remove('_ledgerData');
        window.sessionStorage.clear();
        return window.location = "https://www.giddh.com";
        }), function(res) {})
    } else {
        localStorageService.remove('_ak');
        localStorageService.remove('_userDetails');
        localStorageService.remove('_roles');
        localStorageService.remove('_currencyList');
        localStorageService.remove('_selectedAccount');
        localStorageService.remove('_ledgerData');
        window.sessionStorage.clear();
        $state.go('login')
    }
  }
  ;

  // for ledger
  $rootScope.makeAccountFlatten = function(data) {};
    // $rootScope.flatAccntListWithParents = data
    // obj = _.map(data, (item) ->
    //   obj = {}
    //   obj.name = item.name
    //   obj.uniqueName = item.uniqueName
    //   obj.mergedAccounts = item.mergedAccounts
    //   obj
    // )
    //$rootScope.fltAccntList = obj

  $rootScope.countryCodesList = locationService.getCountryCode();

  $scope.getRoles = () => {
    if (window.sessionStorage.getItem('_ak')) {
      roleServices.getAll().then($scope.onGetRolesSuccess, $scope.onGetRolesFailure);
    }
  }

  $scope.onGetRolesSuccess = res =>
//    console.log("roles we have",res.body)
    localStorageService.set("_roles", res.body)
  ;

  $scope.onGetRolesFailure = res => toastr.error("Something went wrong while fetching role", "Error");

  $scope.getCdnUrl = () => roleServices.getEnvVars().then($scope.onGetEnvSuccess, $scope.onGetEnvFailure);

  $scope.onGetEnvSuccess = res => $rootScope.prefixThis = res.envUrl;

  $scope.onGetEnvFailure = function(res) {};

  // switch user
  $scope.ucActive = false;

  $scope.switchUser =() => companyServices.switchUser($rootScope.selectedCompany.uniqueName).then($scope.switchUserSuccess, $scope.switchUserFailure);

  $scope.switchUserSuccess = function(res) {
    $scope.ucActive = res.body.active;
    return $state.reload();
  };

  $scope.switchUserFailure = res => toastr.error(res.data.message, res.data.status);

  $scope.checkPermissions = function(entity) {
    $rootScope.canUpdate = permissionService.hasPermissionOn(entity, "UPDT");
    $rootScope.canDelete = permissionService.hasPermissionOn(entity, "DLT");
    $rootScope.canAdd = permissionService.hasPermissionOn(entity, "ADD");
    $rootScope.canShare = permissionService.hasPermissionOn(entity, "SHR");
    $rootScope.canManageCompany = permissionService.hasPermissionOn(entity, "MNG_CMPNY");
    return $rootScope.canVWDLT = permissionService.hasPermissionOn(entity, "VWDLT");
  };



  $rootScope.setScrollToTop = function(val, elem){
    if ((val === '') || _.isUndefined(val)) {
      return false;
    }
    if (val.length > 0) {
      let cntBox = document.getElementById(elem);
      return cntBox.scrollTop = 0;
    }
  };

  $rootScope.validateEmail = function(emailStr){
    let pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(emailStr);
  };

  $scope.getRoles();
  if (!isElectron) $scope.getCdnUrl();

  $timeout((function() {
    let cdt = localStorageService.get("_selectedCompany");
    if (!_.isNull(cdt)) {
      return $rootScope.setActiveFinancialYear(cdt.activeFinancialYear);
    }
  }), 500);


  $scope.beforeDeleteCompany = {};

  //delete company
  $scope.deleteCompany = function(company, index, name, event) {
    event.stopPropagation();
    $scope.beforeDeleteCompany.company = company;
    $scope.beforeDeleteCompany.index = index;
    return modalService.openConfirmModal({
      title: 'Delete Company',
      body: `Are you sure you want to delete ${name} ?`,
      ok: 'Yes',
      cancel: 'No'
    }).then(() => companyServices.delete(company.uniqueName).then($scope.delCompanySuccess, $scope.delCompanyFailure));
  };

  //delete company success
  $scope.delCompanySuccess = function(res) {
//    $rootScope.selectedCompany = {}
//    localStorageService.remove("_selectedCompany")
    if ($rootScope.selectedCompany.uniqueName === $scope.beforeDeleteCompany.company.uniqueName) {
      localStorageService.remove("_selectedCompany");
    } else {
      $scope.companyList = _.without($scope.companyList, $scope.beforeDeleteCompany.company);
    }
    $rootScope.getCompanyList();
    $scope.beforeDeleteCompany = {};
    return toastr.success("Company deleted successfully", "Success");
  };

//    $scope.getCompanyList()

// refresh company list
  $scope.refreshcompanyList = function(e) {
    if (!isElectron) {
        companyServices.getAll().then($scope.refreshcompanyListSuccess, $scope.getCompanyListFailure);
    } else {
        let cdt = localStorageService.get("_userDetails");
        companyServices.getAllElectron(cdt.uniqueName).then($scope.refreshcompanyListSuccess, $scope.getCompanyListFailure);
    }
    return e.stopPropagation();
  };

  $scope.refreshcompanyListSuccess = function(res) {
    $scope.companyList = _.sortBy(res.body, 'shared');
    return $scope.findCompanyInList();
  };

  //delete company failure
  $scope.delCompanyFailure = res => toastr.error(res.data.message, res.data.status);

  //creating company
  $scope.createCompany = cdata => companyServices.create(cdata).then($scope.onCreateCompanySuccess, $scope.onCreateCompanyFailure);

  //create company success
  $scope.onCreateCompanySuccess = function(res) {
    toastr.success("Company created successfully", "Success");
    $rootScope.mngCompDataFound = true;
    return $scope.companyList.push(res.body);
  };

  //create company failure
  $scope.onCreateCompanyFailure = res => toastr.error(res.data.message, "Error");

  //Create ne company
  $scope.createNewCompany = () => $scope.runSetupWizard();
    // Open modal here and ask for company details
    // modalInstance = $uibModal.open(
    //   templateUrl: 'public/webapp/Globals/modals/createCompanyModal.html',
    //   size: "sm",
    //   backdrop: 'static',
    //   scope: $scope
    // )
    // modalInstance.result.then($scope.onCompanyCreateModalCloseSuccess, $scope.onCompanyCreateModalCloseFailure)
   // if $rootScope.hasOwnCompany
   //   modalInstance = $uibModal.open(
   //     templateUrl: 'public/webapp/Globals/modals/createCompanyModal.html',
   //     size: "sm",
   //     backdrop: 'static',
   //     scope: $scope
   //   )
   //   modalInstance.result.then($scope.onCompanyCreateModalCloseSuccess, $scope.onCompanyCreateModalCloseFailure)
   // else

  $scope.onCompanyCreateModalCloseSuccess = function(data) {
    let cData = {};
    cData.name = data.name;
    cData.city = data.city;
    return $scope.createCompany(cData);
  };

  $scope.onCompanyCreateModalCloseFailure = function() {
//    $scope.checkCmpCretedOrNot()
    if ($scope.companyList.length <= 0) {
      return modalService.openConfirmModal({
        title: 'LogOut',
        body: 'In order to be able to use Giddh, you must create a company. Are you sure you want to cancel and logout?',
        ok: 'Yes',
        cancel: 'No'}).then($scope.firstLogout, $scope.logoutCancel);
    }
  };

  $scope.logoutCancel = () => $scope.createNewCompany();

  $scope.firstLogout = () =>
    $http.post('/logout').then((function(res) {
// don't need to clear below
// _userDetails, _currencyList
      localStorageService.clearAll();
      return window.location = "/thanks";
    }), function(res) {})
  ;


//for make sure
  // $scope.checkCmpCretedOrNot = ->
  //   if $scope.companyList.length <= 0
  //     $scope.openFirstTimeUserModal()

  //get only city for create company
  $scope.getOnlyCity = val => locationService.searchOnlyCity(val).then($scope.getOnlyCitySuccess, $scope.getOnlyCityFailure);

  //get only city success
  $scope.getOnlyCitySuccess = function(data) {
    let filterThis = data.results.filter(i => _.contains(i.types, "locality"));
    return filterThis.map(item => item.address_components[0].long_name);
  };

  //get only city failure
  $scope.getOnlyCityFailure = res => toastr.error(res.data.message, res.data.status);

  //Get company list
  if (!isElectron) {
    $rootScope.getCompanyList = ()=> companyServices.getAll().then($scope.getCompanyListSuccess, $scope.getCompanyListFailure);
  } else {
    let cdt = localStorageService.get("_userDetails");
    if (cdt) {
        $rootScope.getCompanyList = ()=> companyServices.getAllElectron(cdt.uniqueName).then($scope.getCompanyListSuccess, $scope.getCompanyListFailure);
    }
  }

  //Get company list success
  $scope.getCompanyListSuccess = function(res) {
    $scope.companyList = _.sortBy(res.body, 'shared');
    $scope.companyList = $scope.companyList.reverse();
    $rootScope.CompanyList = $scope.companyList;
    if (_.isEmpty($scope.companyList)) {
      //When no company is there
      $scope.companyList.count;
      //$scope.runSetupWizard()
      return $scope.createNewCompany();
    } else {
      // When there are companies
      $scope.checkUserCompanyStatus(res.body);
      $rootScope.mngCompDataFound = true;
      return $scope.findCompanyInList();
    }
  };
      // $rootScope.checkWalkoverCompanies()

  $scope.checkUserCompanyStatus = compList =>
    _.each(compList, function(cmp) {
      if (cmp.shared) {
        return $rootScope.hasOwnCompany = true;
      }
    })
  ;

  $scope.findCompanyInList = function() {
    let cdt = localStorageService.get("_selectedCompany");
    if (!_.isNull(cdt) && !_.isEmpty(cdt) && !_.isUndefined(cdt)) {
      cdt = _.findWhere($scope.companyList, {uniqueName: cdt.uniqueName});
      if (_.isUndefined(cdt)) {
        $scope.changeCompany($scope.companyList[0],0,'SELECT');
        $rootScope.setCompany($scope.companyList[0]);
        return $rootScope.companyIndex = 0;
      } else {
        $scope.changeCompany(cdt,cdt.index,'SELECT');
        $rootScope.setCompany(cdt);
        return $rootScope.companyIndex = cdt.index;
      }
    } else {
      $scope.changeCompany($scope.companyList[0],0,'CHANGE');
      $rootScope.setCompany($scope.companyList[0]);
      return $rootScope.companyIndex = 0;
    }
  };

  //get company list failure
  $scope.getCompanyListFailure = function(res){
    $rootScope.CompanyList = [];
    return toastr.error(res.data.message, res.data.status);
  };

  $rootScope.setCompany = function(company) {
    //angular.extend($rootScope.selectedCompany, company)
    $rootScope.selectedCompany = company;
    $rootScope.fltAccntListPaginated = [];
    //$rootScope.selectedCompany = company
    $scope.checkPermissions($rootScope.selectedCompany);
    localStorageService.set("_selectedCompany", $rootScope.selectedCompany);
    $rootScope.getFlatAccountList(company.uniqueName);
    return $scope.getGroupsList();
  };
//    $rootScope.getCroppedAccountList(company.uniqueName, '')


  $rootScope.getParticularAccount = function(searchThis) {
    let accountList = [];
    _.filter($rootScope.fltAccntListPaginated,function(account) {
      if((account.name.toLowerCase().match(searchThis.toLowerCase()) !== null) || (account.uniqueName.match(searchThis) !== null)) {
        return accountList.push(account);
      }
    });
    return accountList;
  };

  $rootScope.removeAccountFromPaginatedList = account => $rootScope.fltAccntListPaginated = _.without($rootScope.fltAccntListPaginated,account);

  $scope.gettingCroppedAccount = false;
  $rootScope.getCroppedAccountList = function(compUname, query) {
    let reqParam = {
      cUname: compUname,
      query
    };
    let data = {};
    if (($scope.gettingCroppedAccount === false) || !_.isEmpty(query)) {
      $scope.gettingCroppedAccount = true;
      return companyServices.getCroppedAcnt(reqParam, data).then($scope.getCroppedAccListSuccess, $scope.getCroppedAccListFailure);
    }
  };

  $scope.getCroppedAccListSuccess = function(res) {
    $scope.gettingCroppedAccount = false;
    return $rootScope.croppedAcntList = res.body.results;
  };

  $scope.getCroppedAccListFailure = function(res) {
    $scope.gettingCroppedAccount = false;
    return toastr.error(res.data.message);
  };

  $rootScope.getFlatAccntsByQuery = function(query) {
    let reqParam = {
      companyUniqueName: $rootScope.selectedCompany.uniqueName,
      q: query,
      page: 1,
      count: 0
    };
    if (!isElectron) {
        return groupService.getFlatAccList(reqParam).then($scope.flatAccntQuerySuccess, $scope.flatAccntQueryFailure);
    } else {
        return groupService.getFlatAccListElectron(reqParam).then($scope.flatAccntQuerySuccess, $scope.flatAccntQueryFailure);
    }
  };

  $rootScope.postFlatAccntsByQuery = function(query,data) {
    let reqParam = {
      companyUniqueName: $rootScope.selectedCompany.uniqueName,
      q: query,
      page: 1,
      count: 0
    };
    let datatosend = {
      groupUniqueNames: data
    };
    return groupService.postFlatAccList(reqParam,datatosend).then($scope.flatAccntQuerySuccess, $scope.flatAccntQueryFailure);
  };

  $scope.flatAccntQuerySuccess = res => $rootScope.queryFltAccnt = res.body.results;

  $scope.flatAccntQueryFailure = res => toastr.error(res.data.message);

  $scope.workInProgress = false;
  $rootScope.getFlatAccountList = function(compUname) {
//    console.log("work in progress", $scope.workInProgress)
    let reqParam = {
      companyUniqueName: compUname,
      q: '',
      page: $scope.flatAccList.page,
      count: $scope.flatAccList.count
    };
    if ($scope.workInProgress === false) {
      $scope.workInProgress = true;
      if (!isElectron) {
        return groupService.getFlatAccList(reqParam).then($scope.getFlatAccountListListSuccess, $scope.getFlatAccountListFailure);
      } else {
          return groupService.getFlatAccListElectron(reqParam).then($scope.getFlatAccountListListSuccess, $scope.getFlatAccountListFailure);
      }
    }
  };

  $scope.getFlatAccountListListSuccess = function(res) {
    $scope.workInProgress = false;
    $rootScope.fltAccntListPaginated = res.body.results;
    $rootScope.$emit('account-list-updated');
//    $rootScope.fltAccountLIstFixed = $rootScope.fltAccntListPaginated
    $rootScope.flatAccList.limit = 5;
    return $scope.$broadcast('account-list-updated');
  };

  $scope.getFlatAccountListFailure = function(res) {
    $scope.workInProgress = false;
    return toastr.error(res.data.message);
  };

  $rootScope.searchAccountInFilter = function(str) {
    let filteredList = [];
    _.each($rootScope.fltAccntListPaginated, function(account) {
      if (account.name.contains(str) || account.uniqueName.contains(str)) {
        return filteredList.push(account);
      }
    });
    return filteredList;
  };

  $rootScope.OpenManegeModal = () => $rootScope.$emit('Open-Manage-Modal');

  $rootScope.NewgoToManageGroups =function() {
    if (!$rootScope.canManageComp) {
      return;
    }
    if (_.isEmpty($rootScope.selectedCompany)) {
      return toastr.error("Select company first.", "Error");
    } else {
      let modalInstance;
      return modalInstance = $uibModal.open({
        templateUrl:'public/webapp/NewManageGroupsAndAccounts/ManageGroupModal.html',
        size: "liq90",
        backdrop: 'static',
        scope: $scope
      });
    }
  };
      // modalInstance.result.then(mc.goToManageGroupsOpen, mc.goToManageGroupsClose)


  // search flat accounts list
  $rootScope.searchAccounts = function(str) {
    let reqParam = {};
    reqParam.companyUniqueName = $rootScope.selectedCompany.uniqueName;
    if (str.length > 2) {
      reqParam.q = str;
      if (!isElectron) {
        return groupService.getFlatAccList(reqParam).then($rootScope.getFlatAccountListListSuccess, $rootScope.getFlatAccountListFailure);
      } else {
        return groupService.getFlatAccListElectron(reqParam).then($rootScope.getFlatAccountListListSuccess, $rootScope.getFlatAccountListFailure);
      }
    } else {
      reqParam.q = '';
      reqParam.count = 5;
      if (!isElectron) {
        return groupService.getFlatAccList(reqParam).then($rootScope.getFlatAccountListListSuccess, $rootScope.getFlatAccountListFailure);
      } else {
        return groupService.getFlatAccListElectron(reqParam).then($rootScope.getFlatAccountListListSuccess, $rootScope.getFlatAccountListFailure);
      }
    }
  };

  // load-more function for accounts list on add and manage popup
  $rootScope.loadMoreAcc = compUname => $rootScope.flatAccList.limit += 5;

    // set financial year
  $rootScope.setActiveFinancialYear = function(FY) {
    if (FY !== undefined) {
      let activeYear = {};
      activeYear.start = moment(FY.financialYearStarts,"DD/MM/YYYY").year();
      activeYear.ends = moment(FY.financialYearEnds,"DD/MM/YYYY").year();
      if (activeYear.start === activeYear.ends) { activeYear.year = activeYear.start; } else { activeYear.year = activeYear.start + '-' + activeYear.ends; }
      $rootScope.fy = FY;
      $rootScope.activeYear = activeYear;
      $rootScope.currentFinancialYear =  activeYear.year;
    }
    return localStorageService.set('activeFY',FY);
  };

  // change selected company



  $scope.changeCompany = function(company, index, method) {
//    console.log("method we get here is : ", method)
    // select and set active financial year
    $scope.getFlattenGrpWithAccList(company.uniqueName);
    $scope.setFYonCompanychange(company);
    //check permissions on selected company
    $rootScope.doWeHavePermission(company);
    $scope.checkPermissions(company);
    $rootScope.canViewSpecificItems = false;
    if (company.role.uniqueName === 'shared') {
      $rootScope.canManageComp = false;
      if (company.sharedEntity === 'groups') {
        $rootScope.canViewSpecificItems = true;
      }
      localStorageService.set("_selectedCompany", company);
      $rootScope.selectedCompany = company;
      $state.go('company.content.ledgerContent');
      $rootScope.$emit('company-changed');
    } else {
      $rootScope.canManageComp = true;
      //$scope.goToCompany(company, index, "CHANGED")
      $rootScope.setCompany(company);
      $rootScope.selectedCompany.index = index;
    }
    $rootScope.$emit('reloadAccounts');
    let changeData = {};
    changeData.data = company;
    changeData.index = index;
    changeData.type = method;
    // $scope.$broadcast('company-changed', changeData)
    $rootScope.$emit('company-changed', changeData);
    let url = $location.url();
    // if url.indexOf('ledger') == -1
    //   $state.go('company.content.ledgerContent')
    return $scope.gwaList = {
      page: 1,
      count: 10,
      totalPages: 0,
      currentPage : 1,
      limit: 10
    };
  };
    //return false
    //$scope.tabs[0].active = true

  $rootScope.allowed = true;
  $rootScope.doWeHavePermission = function(company) {
    let str = company.sharedEntity;
    $rootScope.sharedEntity = str;
    if (str === null) {
      return $rootScope.allowed = true;
    } else {
      if (str === "accounts") {
        return $rootScope.allowed = false;
      } else {
        if (str === "groups") {
          return $rootScope.allowed = true;
        }
      }
    }
  };

  $scope.setFYonCompanychange = function(company) {
    localStorageService.set('activeFY', company.activeFinancialYear);
    $rootScope.setActiveFinancialYear(company.activeFinancialYear);
    let activeYear = {};
    activeYear.start = moment(company.activeFinancialYear.financialYearStarts,"DD/MM/YYYY").year();
    activeYear.ends = moment(company.activeFinancialYear.financialYearEnds,"DD/MM/YYYY").year();
    if (activeYear.start === activeYear.ends) { activeYear.year = activeYear.start; } else { activeYear.year = activeYear.start + '-' + activeYear.ends; }
    return $rootScope.currentFinancialYear = activeYear.year;
  };

  $rootScope.$on('callCheckPermissions', (event, data)=> $scope.checkPermissions(data));

  $scope.$on('$stateChangeSuccess', ()=> $rootScope.currentState = $state.current.name);

  $rootScope.$on('openAddManage', function() {
    $(document).find('#AddManage').trigger('click');
    return false;
  });

  $scope.showAccounts = e => $rootScope.flyAccounts = true;

  // for accounts list
  $scope.gwaList = {
    page: 1,
    count: 5,
    totalPages: 0,
    currentPage : 1,
    limit: 5
  };
  $scope.working = false;
  $scope.getFlattenGrpWithAccList = function(compUname) {
  //   console.log("working  : ",$scope.working)
    $rootScope.companyLoaded = false;
    $scope.showAccountList = false;
    let reqParam = {
      companyUniqueName: compUname,
      q: '',
      page: $scope.gwaList.page,
      count: $scope.gwaList.count
    };
    if ($scope.working === false) {
      $scope.working = true;
      if (!isElectron) {
        return groupService.getFlattenGroupAccList(reqParam).then($scope.getFlattenGrpWithAccListSuccess, $scope.getFlattenGrpWithAccListFailure);
      } else {
          return groupService.getFlattenGroupAccListElectron(reqParam).then($scope.getFlattenGrpWithAccListSuccess, $scope.getFlattenGrpWithAccListFailure);
      }
    }
  };


  $scope.getFlattenGrpWithAccListSuccess = function(res) {
    $scope.gwaList.page = res.body.page;
    $scope.gwaList.totalPages = res.body.totalPages;
    $rootScope.flatAccntWGroupsList = res.body.results;
    //$scope.flatAccntWGroupsList = gc.removeEmptyGroups(res.body.results)
  //   console.log($scope.flatAccntWGroupsList)
    $scope.showAccountList = true;
    $scope.gwaList.limit = 10;
    $rootScope.companyLoaded = true;
    $scope.working = false;
    return $rootScope.toggleAcMenus(true);
  };

  $scope.getFlattenGrpWithAccListFailure = function(res) {
    toastr.error(res.data.message);
    return $scope.working = false;
  };

  $scope.loadMoreGrpWithAcc = function(compUname, str) {
    $scope.gwaList.page += 1;
    let reqParam = {
      companyUniqueName: compUname,
      q: str || $rootScope.search.acnt,
      page: $scope.gwaList.page,
      count: $scope.gwaList.count
    };
    if (!isElectron) {
        groupService.getFlattenGroupAccList(reqParam).then($scope.loadMoreGrpWithAccSuccess, $scope.loadMoreGrpWithAccFailure);
    } else {
        groupService.getFlattenGroupAccListElectron(reqParam).then($scope.loadMoreGrpWithAccSuccess, $scope.loadMoreGrpWithAccFailure);
    }
    return $scope.gwaList.limit += 10;
  };

  $scope.loadMoreGrpWithAccSuccess = function(res) {
    $scope.gwaList.currentPage += 1;
    //list = gc.removeEmptyGroups(res.body.results)
    if ((res.body.results.length > 0) && (res.body.totalPages >= $scope.gwaList.currentPage)) {
      return _.each(res.body.results, function(grp) {
        grp.open = true;
        return $rootScope.flatAccntWGroupsList.push(grp);
      });
      //$scope.flatAccntWGroupsList = _.union($scope.flatAccntWGroupsList, list)
    } else if (res.body.totalPages > $scope.gwaList.currentPage) {
      return $scope.loadMoreGrpWithAcc($rootScope.selectedCompany.uniqueName);
    } else {
      return $scope.hideLoadMore = true;
    }
  };

  $scope.loadMoreGrpWithAccFailure = res => toastr.error(res.data.message);

  $scope.searchGrpWithAccounts = function(str) {
    $rootScope.search.acnt = str;
    $scope.gwaList.page = 1;
    $scope.gwaList.currentPage = 1;
    let reqParam = {};
    reqParam.companyUniqueName = $rootScope.selectedCompany.uniqueName;
    if (str.length > 2) {
      //$scope.hideLoadMore = true
      reqParam.q = str;
      reqParam.page = $scope.gwaList.page;
      reqParam.count = $scope.gwaList.count;
      if (!isElectron) {
        return groupService.getFlattenGroupAccList(reqParam).then($scope.getFlattenGrpWithAccListSuccess, $scope.getFlattenGrpWithAccListFailure);
      } else {
          return groupService.getFlattenGroupAccListElectron(reqParam).then($scope.getFlattenGrpWithAccListSuccess, $scope.getFlattenGrpWithAccListFailure);
      }
    } else {
      //$scope.hideLoadMore = false
      reqParam.q = '';
      if (!isElectron) {
        return groupService.getFlattenGroupAccList(reqParam).then($scope.getFlattenGrpWithAccListSuccess, $scope.getFlattenGrpWithAccListFailure);
      } else {
          return groupService.getFlattenGroupAccListElectron(reqParam).then($scope.getFlattenGrpWithAccListSuccess, $scope.getFlattenGrpWithAccListFailure);
      }
    }
  };
    // if str.length < 1
    //   $scope.flatAccListC5.limit = 5
      //$scope.hideLoadMore = false

  $scope.removeEmptyGroups = function(grpList) {
    let newList = [];
    _.each(grpList, function(grp) {
      if (grp.accountDetails.length > 0) {
        return newList.push(grp);
      }
    });
    return newList;
  };

  $scope.setLedgerData = function(data, acData) {
    $scope.selectedAccountUniqueName = acData.uniqueName;
    $rootScope.selectedAccount = acData;
    DAServices.LedgerSet(data, acData);
    localStorageService.set("_ledgerData", data);
    localStorageService.set("_selectedAccount", acData);
    $rootScope.accClicked = true;
    $rootScope.$emit('account-selected');
    return false;
  };

  $scope.getGroupsList = function() {
    this.success = res => $rootScope.groupWithAccountsList = res.body;
    this.failure = function(res) {};

    return groupService.getGroupsWithoutAccountsCropped($rootScope.selectedCompany.uniqueName).then(this.success, this.failure);
  };

  // $scope.goToLedgerCash = () ->
  //   $state.go('company.content.ledgerContent',{unqName:'cash'})

  $rootScope.toggleAcMenus = function(condition) {
    $scope.showSubMenus = condition;
    return _.each($rootScope.flatAccntWGroupsList, grp => grp.open = condition);
  };

  $scope.runTour = () => $rootScope.$emit('run-tour');

  // $scope.showSwitchUserOption = false
  // $rootScope.checkUserCompany = () ->
  //   user = localStorageService.get('_userDetails')
  //   company = user.uniqueName.split('@')
  //   company = company[company.length - 1]
  //   company

  // $rootScope.checkWalkoverCompanies = () ->
  //   if $rootScope.checkUserCompany().toLowerCase() == 'giddh.com' || $rootScope.checkUserCompany().toLowerCase() == 'walkover.in' || $rootScope.checkUserCompany().toLowerCase() == 'msg91.com'
  //     $scope.showSwitchUserOption = true
  //   else
  //     $scope.showSwitchUserOption = false

  // $rootScope.ledgerMode = 'new'
  // $rootScope.switchLedgerMode = () ->
  //   if $rootScope.checkWalkoverCompanies()
  //     if $rootScope.ledgerMode == 'new'
  //       $rootScope.ledgerMode = 'old'
  //     else
  //       $rootScope.ledgerMode = 'new'

  $rootScope.setState = function(lastState, url, param) {
    $rootScope.selectedCompany = $rootScope.selectedCompany || localStorageService.get('_selectedCompany');
    let data = {
        "lastState": lastState,
        "companyUniqueName": $rootScope.selectedCompany.uniqueName
    };
    if (url.indexOf('ledger') !== -1) {
      data.lastState = data.lastState + '@' + param;
    }
    return $http.post('/state-details', data).then(
        function(res) {},

        function(res) {}

    );
  };

  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if (($rootScope.selectedCompany !== undefined) && ($rootScope.selectedCompany !== null)) {
      return $rootScope.setState(toState.name, toState.url, toParams.unqName);
    }
  });

  $(document).on('click', function(e){
    if (e.target.id !== 'accountSearch') {
      $rootScope.flyAccounts = false;
    }
    return false;
  });

  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ((toState.name === "company.content.ledgerContent") && (toParams.unqName === 'cash')) {
      return $rootScope.ledgerState = true;
    } else {
      return $rootScope.ledgerState = false;
    }
  });

  $scope.$watch(function () {
      return location.hash
  }, function (value) {
      if (value === "#!/login") {
          $scope.hideHeader = true
      } else {
          if (window.sessionStorage.getItem('_ak')) getUserDetail();
          $scope.hideHeader = false
      }
  });
  return $rootScope.$on('different-company', function(event, lastStateData){
    let company = _.findWhere($scope.companyList, {uniqueName:lastStateData.companyUniqueName});
    localStorageService.set('_selectedCompany', company);
    $rootScope.selectedCompany = company;
    $scope.changeCompany(company, 0, 'CHANGE');
    return $state.go(lastStateData.lastState);
  });
};

giddh.webApp.controller('mainController', mainController);
