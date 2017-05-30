let logsController = function($scope, $rootScope, localStorageService, groupService, toastr, modalService, $timeout, accountService, locationService, ledgerService, $filter, permissionService, DAServices, $location, $uibModal) {

  $rootScope.selectedCompany = localStorageService.get("_selectedCompany");
  window.app.logs = {
    selectedCompany: $rootScope.selectedCompany
  };
  $scope.date = {};
  $scope.fromDate = {date: new Date()};
  $scope.toDate = {date: new Date()};
  $scope.beforeDate = {date: new Date()};
  $scope.date.logDate = new Date();
  $scope.date.entryDate = new Date();
  $scope.fromDatePickerIsOpen = false;
  $scope.toDatePickerIsOpen = false;
  $scope.logDatePickerIsOpen = false;
  $scope.beforeDatePickerIsOpen = false;
  $scope.today = new Date();
  $scope.date.name = 'entryDate';
  $scope.logDate = {
    show : true
  };
  $scope.groups = [];
  $scope.accounts = [];
  $scope.dateOptions = {
      'year-format': "'yy'",
      'starting-day': 1,
      'showWeeks': false,
      'show-button-bar': false,
      'year-range': 1,
      'todayBtn': false
    };
  $scope.format = "dd-MM-yyyy";

  $scope.fromDatePickerOpen = function() {
    return this.fromDatePickerIsOpen = true;
  };

  $scope.toDatePickerOpen = function() {
    return this.toDatePickerIsOpen = true;
  };

  $scope.logDatePickerOpen = function() {
    return this.logDatePickerIsOpen = true;
  };

  $scope.beforeDatePickerOpen = function() {
    return this.beforeDatePickerIsOpen = true;
  };

  $scope.getAccountsGroupsList = function(){
    $rootScope.selectedCompany = localStorageService.get("_selectedCompany");
    $scope.showAccountList = false;
    if (_.isEmpty($rootScope.selectedCompany)) {
      return toastr.error("Select company first.", "Error");
    } else {
      return groupService.getGroupsWithAccountsInDetail($rootScope.selectedCompany.uniqueName).then($scope.getGroupsSuccess,
        $scope.getGroupsFailure);
    }
  };

  $scope.getGroupsSuccess = function(res) {
    $scope.groupList = res.body;
    $scope.flattenGroupList = groupService.flattenGroup($scope.groupList, []);
    $scope.flatAccntWGroupsList = groupService.flattenGroupsAndAccounts($scope.flattenGroupList);
    return $scope.sortGroupsAndAccounts($scope.flatAccntWGroupsList);
  };

  $scope.getGroupsFailure = res => toastr.error(res.data.message, res.data.status);

  //sort groups and accounts lists

  $scope.sortGroupsAndAccounts =  function(dataArray) {
    $scope.groups = [];
    $scope.accounts = [];
    _.each(dataArray,function(obj) {
      let group = {};
      group.name = obj.groupName;
      group.uniqueName = obj.groupUniqueName;
      $scope.groups.push(group);
      if (obj.accountDetails.length > 0) {
        return _.each(obj.accountDetails, function(acc) {
          let account = {};
          account.name = acc.name;
          account.uniqueName = acc.uniqueName;
          return $scope.accounts.push(account);
        });
      }
    });
    $scope.options.accountUniqueNames = $scope.accounts;
    return $scope.options.groupUniqueNames = $scope.groups;
  };

  $scope.getAccountsGroupsList();

  $scope.$watch('options', function(newVal, oldVal){
    if (newVal !== oldVal) {
      return window.app.logs.options = newVal;
    }
  });

  $scope.options = {
    filters : ["All", "create", "delete", "share", "unshare", "move", "merge", "unmerge", "update", "master-import", "daybook-import", "ledger-excel-import"],
    entities: ["All", "company", "group", "account", "ledger", "voucher", "logs"],
    userUniqueNames: [],
    accountUniqueNames: $rootScope.fltAccntListPaginated || $scope.accounts,
    groupUniqueNames: $scope.groups,
    selectedOption: '',
    selectedEntity: '',
    selectedUserUnq: '',
    selectedAccountUnq: '',
    selectedGroupUnq: '',
    selectedFromDate: $filter('date')($scope.fromDate.date,"dd-MM-yyyy"),
    selectedToDate : $filter('date')($scope.toDate.date,"dd-MM-yyyy"),
    selectedLogDate: $filter('date')($scope.date.logDate,"dd-MM-yyyy"),
    selectedEntryDate: $filter('date')($scope.date.entryDate,"dd-MM-yyyy"),
    logOrEntry: $scope.date.name,
    dateOptions: [{'name':'Date Range', 'value':1}, {"name":"Entry/Log Date", 'value':0}],
    selectedDateOption: '',
    toastr
  };

  $scope.initialOptions = $scope.options;

  $scope.dateModel = function(){
    if ($scope.logDate.show) {
      return $scope.date.name = 'logDate';
    } else {
      return $scope.date.name = 'entryDate';
    }
  };

  $scope.assignLogData = function(){
    $scope.options.selectedFromDate = $filter('date')($scope.fromDate.date,"dd-MM-yyyy");
    $scope.options.selectedToDate = $filter('date')($scope.toDate.date,"dd-MM-yyyy");
    $scope.options.selectedLogDate = $filter('date')($scope.date.logDate,"dd-MM-yyyy");
    $scope.options.selectedEntryDate = $filter('date')($scope.date.entryDate,"dd-MM-yyyy");
    $scope.options.logOrEntry = $scope.date.name;
    //console.log $scope.options
    return window.giddh.webApp.logs.filterOptions = $scope.options;
  };


  $scope.getUsers = function() {
    let unqNamesObj = {
      compUname: $rootScope.selectedCompany.uniqueName
    };
    return groupService.getUserList(unqNamesObj).then($scope.getUsersSuccess, $scope.getUsersFailure);
  };

  $scope.getUsersSuccess = res => $scope.users = res.body;

  $scope.getUsersFailure = res => console.error('Unable to fetch user list');

  $scope.getUsers();

  $scope.resetFilters = () =>
    $scope.options = {
      filters : ["All", "create", "delete", "share", "unshare", "move", "merge", "unmerge", "delete-all", "update", "master-import", "daybook-import", "ledger-excel-import"],
      entities: ["All", "company", "group", "account", "ledger", "voucher", "logs"],
      userUniqueNames: [],
      accountUniqueNames: $rootScope.fltAccntListPaginated,
      groupUniqueNames: $scope.groups,
      selectedOption: '',
      selectedEntity: '',
      selectedUserUnq: '',
      selectedAccountUnq: '',
      selectedGroupUnq: '',
      selectedFromDate: $filter('date')($scope.fromDate.date,"dd-MM-yyyy"),
      selectedToDate : $filter('date')($scope.toDate.date,"dd-MM-yyyy"),
      selectedLogDate: $filter('date')($scope.date.logDate,"dd-MM-yyyy"),
      selectedEntryDate: $filter('date')($scope.date.entryDate,"dd-MM-yyyy"),
      logOrEntry: $scope.date.name,
      dateOptions: [{'name':'Date Range', 'value':1}, {"name":"Entry/Log Date", 'value':0}],
      selectedDateOption: '',
      toastr
    }
  ;

  $scope.deleteLogs = () =>
    modalService.openConfirmModal({
        title: 'Delete Logs',
        body: `Are you sure you want to delete all logs before ${$filter('date')($scope.beforeDate.date,"dd-MM-yyyy")}?`,
        ok: 'Yes',
        cancel: 'No'}).then($scope.deleteLogsConfirm)
  ;

  $scope.deleteLogsConfirm = function() {
    let reqParam = {
      companyUniqueName: $rootScope.selectedCompany.uniqueName,
      beforeDate: $filter('date')($scope.beforeDate.date,"dd-MM-yyyy")
    };
    return groupService.deleteLogs(reqParam).then($scope.deleteLogsConfirmSuccess, $scope.deleteLogsConfirmFailure);
  };


  $scope.deleteLogsConfirmSuccess = res => toastr.success(res.body);

  $scope.deleteLogsConfirmFailure = res => toastr.error(res.data.message);

  $scope.checkPermissions = function(entity) {
    $rootScope.canUpdate = permissionService.hasPermissionOn(entity, "UPDT");
    $rootScope.canDelete = permissionService.hasPermissionOn(entity, "DLT");
    $rootScope.canAdd = permissionService.hasPermissionOn(entity, "ADD");
    $rootScope.canShare = permissionService.hasPermissionOn(entity, "SHR");
    $rootScope.canManageCompany = permissionService.hasPermissionOn(entity, "MNG_CMPNY");
    return $rootScope.canVWDLT = permissionService.hasPermissionOn(entity, "VWDLT");
  };

  $scope.checkPermissions($rootScope.selectedCompany);

  //---------get flat accounts list------#
//  $rootScope.getFlatAccountList($rootScope.selectedCompany.uniqueName)
//  $scope.flatAccList = {
//    page: 1
//    count: 5
//    totalPages: 0
//    currentPage : 1
//  }

  $scope.getFlatAccountList = compUname => $rootScope.getFlatAccountList(compUname);
//    reqParam = {
//      companyUniqueName: compUname
//      q: ''
//      page: $scope.flatAccList.page
//      count: $scope.flatAccList.count
//    }
//    groupService.getFlatAccList(reqParam).then($scope.getFlatAccountListListSuccess, $scope.getFlatAccountListFailure)

  $scope.getFlatAccountListListSuccess = res => $rootScope.fltAccntListPaginated = res.body.results;

  $scope.getFlatAccountListFailure = res => toastr.error(res.data.message);

//  $scope.getFlatAccountList($rootScope.selectedCompany.uniqueName)

  // search flat accounts list
  $rootScope.searchAccounts = function(str) {
    console.log("inside rootscope search accounts");
    let reqParam = {};
    reqParam.companyUniqueName = $rootScope.selectedCompany.uniqueName;
    if (str.length > 2) {
      reqParam.q = str;
      return groupService.getFlatAccList(reqParam).then($scope.getFlatAccountListListSuccess, $scope.getFlatAccountListFailure);
    } else {
      reqParam.q = '';
      reqParam.count = 5;
      return groupService.getFlatAccList(reqParam).then($scope.getFlatAccountListListSuccess, $scope.getFlatAccountListFailure);
    }
  };

  window.giddh.webApp.toastr = toastr;

  return $scope.$on('company-changed' , function() {
    $scope.getAccountsGroupsList();
    return $scope.getUsers();
  });
};


giddh.webApp.controller('logsController', logsController);