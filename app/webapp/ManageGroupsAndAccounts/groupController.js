let groupController = function($scope, $rootScope, localStorageService, groupService, toastr, modalService, $timeout, accountService, locationService, ledgerService, $filter, permissionService, DAServices, $location, $uibModal, companyServices) {
  let gc = this;
  $scope.groupList = {};
  $scope.flattenGroupList = [];
  $scope.moveto = undefined;
  $scope.selectedGroup = {};
  $scope.selectedSubGroup = {};
  $scope.selectedAccount = {};
  $scope.selAcntPrevObj = {};
  $scope.datePicker = {accountOpeningBalanceDate: ""};
  $scope.selectedGroupUName = "";
  $scope.cantUpdate = false;
  $scope.showGroupDetails = false;
  $scope.subGroupVisible = false;
  $scope.showListGroupsNow = false;
  $scope.showAccountDetails = false;
  $scope.showAccountListDetails = false;
  $scope.showMergeDescription = true;
  $scope.mergedAccounts = '';
  $scope.showDeleteMove = false;
  $scope.AccountsList = [];
  $scope.groupAccntList = [];
  $scope.search = {};
  $scope.search.acnt = '';
  $scope.showEditTaxSection = false;
  $scope.shareGroupObj = {role: "view_only"};
  $scope.shareAccountObj ={role: "view_only"};
  $scope.openingBalType = [
    {"name": "Credit", "val": "CREDIT"},
    {"name": "Debit", "val": "DEBIT"}
  ];
  $scope.acntExt = {
    Ccode: undefined,
    onlyMobileNo: undefined
  };
  $scope.today = new Date();
  $scope.valuationDatePickerIsOpen = false;
  $scope.dateOptions = {
    'year-format': "'yy'",
    'starting-day': 1,
    'showWeeks': false,
    'show-button-bar': false,
    'year-range': 1,
    'todayBtn': false
  };
  $scope.format = "dd-MM-yyyy";
  $scope.flatAccntWGroupsList = [];
  $scope.showAccountList = false;
  $scope.selectedAccountUniqueName = undefined;
  $scope.flatAccntWGroupsList_1 = [];
  $scope.noGroups = false;
  $scope.hideLoadMore = false;
  $scope.hideAccLoadMore = false;
  $scope.isFixedAcc = false;
  $scope.gwaList = {
    page: 1,
    count: 5,
    totalPages: 0,
    currentPage : 1,
    limit: 5
  };

  $scope.taxHierarchy = {};
  $scope.taxHierarchy.applicableTaxes = [];
  $scope.taxHierarchy.inheritedTaxes = [];
  $scope.taxInEditMode = false;
  $scope.havePermission = false;
//  $scope.fltAccntListPaginated = []
//  $scope.flatAccList = {
//    page: 1
//    count: 5
//    totalPages: 0
//    currentPage : 1
//    limit: 5
//  }

  $scope.selectedTax = {};
  $scope.selectedTax.taxes = '';

  $scope.valuationDatePickerOpen = function(){
    return this.valuationDatePickerIsOpen = true;
  };

  // dom method function
  gc.highlightAcMenu = function() {
    let url = $location.path().split("/");
    if (url[1] === "ledger") {
      return $timeout(function() {
        let acEle = document.getElementById(`ac_${url[2]}`);
        if (acEle === null) {
          return false;
        }
        let parentSib = acEle.parentElement.previousElementSibling;
        angular.element(parentSib).trigger('click');
        return angular.element(acEle).children().trigger('click');
      }
      , 500);
    }
  };

  // expand and collapse all tree structure
  let getRootNodesScope = () => angular.element(document.getElementById('tree-root')).scope();

  $scope.collapseAll = function() {
    let scope = getRootNodesScope();
    scope.collapseAll();
    return $scope.subGroupVisible = true;
  };

  $scope.expandAll = function() {
    let scope = getRootNodesScope();
    scope.expandAll();
    return $scope.subGroupVisible = false;
  };
  // dom method functions end

  $scope.goToManageGroups =function() {
//    $scope.fltAccntListPaginated = []
//    $scope.getFlatAccountList($rootScope.selectedCompany.uniqueName)
    if (!$rootScope.canManageComp) {
      return;
    }
    $scope.getFlatAccountListCount5($rootScope.selectedCompany.uniqueName);
    if (_.isEmpty($rootScope.selectedCompany)) {
      return toastr.error("Select company first.", "Error");
    } else {
      let modalInstance = $uibModal.open({
        templateUrl: '/public/webapp/ManageGroupsAndAccounts/addManageGroupModal.html',
        size: "liq90",
        backdrop: 'static',
        scope: $scope
      });
      return modalInstance.result.then(gc.goToManageGroupsOpen, gc.goToManageGroupsClose);
    }
  };

  gc.goToManageGroupsOpen = res => console.log("manage opened", res);

  gc.goToManageGroupsClose = function() {
    $scope.selectedGroup = {};
    $scope.selectedAccntMenu = undefined;
    $scope.selectedItem = undefined;
    $scope.showGroupDetails = false;
    $scope.showAccountDetails = false;
    $scope.showAccountListDetails = false;
    $scope.cantUpdate = false;
    $scope.selectedTax.taxes = {};
    $scope.showEditTaxSection = false;
    return groupService.getGroupsWithoutAccountsCropped($rootScope.selectedCompany.uniqueName).then(gc.getGroupListSuccess, gc.getGroupListFailure);
  };

  $scope.setLedgerData = function(data, acData) {
    $scope.selectedAccountUniqueName = acData.uniqueName;
    $rootScope.selectedAccount = acData;
    DAServices.LedgerSet(data, acData);
    localStorageService.set("_ledgerData", data);
    localStorageService.set("_selectedAccount", acData);
    $rootScope.$emit('account-selected');
    return false;
  };


  //Expand or  Collapse all account menus
  // $scope.toggleAcMenus = (state) ->
  //   if !_.isEmpty($scope.flatAccntWGroupsList)
  //     _.each($scope.flatAccntWGroupsList, (e) ->
  //       e.open = state
  //       $scope.showSubMenus = state
  //     )

  // trigger expand or collapse func
  // $scope.checkLength = (val)->
  //   if val is '' || _.isUndefined(val)
  //     $scope.toggleAcMenus(false)
  //   else if val.length >= 4
  //     $scope.toggleAcMenus(true)
  //   else
  //     $scope.toggleAcMenus(false)
  // end acCntrl

  $scope.getGroups =function() {
    $scope.search = {};
    if (_.isEmpty($rootScope.selectedCompany)) {
      return toastr.error("Select company first.", "Error");
    } else {
      // with accounts, group data
      $scope.getFlattenGrpWithAccList($rootScope.selectedCompany.uniqueName);
      $scope.getFlatAccountListCount5($rootScope.selectedCompany.uniqueName);
      //$rootScope.getFlatAccountList($rootScope.selectedCompany.uniqueName)
      groupService.getGroupsWithAccountsCropped($rootScope.selectedCompany.uniqueName).then(gc.makeAccountsList, gc.makeAccountsListFailure);

      // without accounts only groups conditionally
      let cData = localStorageService.get("_selectedCompany");
      if (cData.sharedEntity === 'accounts') {
        //console.info "sharedEntity:"+ cData.sharedEntity
      } else {
        return groupService.getGroupsWithoutAccountsCropped($rootScope.selectedCompany.uniqueName).then(gc.getGroupListSuccess, gc.getGroupListFailure);
      }
    }
  };

  gc.makeAccountsList = function(res) {
    // flatten all groups with accounts and only accounts flatten
    let a = [];
    angular.copy(res.body, a);
    $rootScope.flatGroupsList = groupService.flattenGroup(a, []);
    //$scope.flatAccntWGroupsList = groupService.flattenGroupsWithAccounts($rootScope.flatGroupsList)
    //$scope.showAccountList = true
    $rootScope.canChangeCompany = true;
    let b = groupService.flattenAccount(a);
    //$rootScope.makeAccountFlatten(b)
    return $scope.flattenGroupList = groupService.makeGroupListFlatwithLessDtl($rootScope.flatGroupsList);
  };

  $scope.getParticularGroup = function(searchThis) {
    let groupList = [];
    _.filter($scope.flattenGroupList,function(group) {
      if((group.name.match(searchThis) !== null) || (group.uniqueName.match(searchThis) !== null)) {
        return groupList.push(group);
      }
    });
    return groupList;
  };

  gc.makeAccountsListFailure = res => toastr.error(res.data.message, res.data.status);

  //-------------------Functions for API side search and fetching flat account list-----------------------------------------------#

  $scope.getFlatAccountList = compUname => $rootScope.getFlatAccountList(compUname);


  // get flat account list with count 5

  $scope.flatAccListC5 = {
    page: 1,
    count: 5,
    totalPages: 0,
    currentPage : 1,
    limit : 5
  };

  gc.accountsListShort = [];
  $scope.getFlatAccountListCount5 = function(compUname) {
    let reqParam = {
      companyUniqueName: compUname,
      q: '',
      page: $scope.flatAccListC5.page,
      count: $scope.flatAccListC5.count
    };
    // if $scope.workInProgress == false
    return groupService.getFlatAccList(reqParam).then(gc.getFlatAccountListCount5ListSuccess, gc.getFlatAccountListCount5ListFailure);
  };
      //$scope.workInProgress = true

  gc.getFlatAccountListCount5ListSuccess = function(res) {
//    console.log res.body.res
    //$scope.workInProgress = false
    //$scope.fltAccntListcount5 = res.body.results
    gc.accountsListShort = res.body.results;
    return $scope.flatAccListC5.totalPages = res.body.totalPages;
  };

  gc.getFlatAccountListCount5ListFailure = function(res) {
    $scope.workInProgress = false;
    return toastr.error(res.data.message);
  };

  // search flat accounts list
  $scope.searchAccountsC5 = function(str) {
    let reqParam = {
      companyUniqueName: $rootScope.selectedCompany.uniqueName,
      q: str,
      page: 1,
      count: $scope.flatAccListC5.count
    };
    if (str.length > 2) {
      groupService.getFlatAccList(reqParam).then(gc.getFlatAccountListCount5ListSuccess, gc.getFlatAccountListCount5ListFailure);
    } else {
      reqParam.q = '';
      groupService.getFlatAccList(reqParam).then(gc.getFlatAccountListCount5ListSuccess, gc.getFlatAccountListCount5ListFailure);
    }
    if (str.length < 1) {
      return $scope.flatAccListC5.limit = 5;
    }
  };

  // load-more function for accounts list on add and manage popup
  $rootScope.loadMoreAcc = function(compUname, query) {
    if (query === undefined) { query = ''; } else { query = query; }
    $scope.flatAccListC5.page += 1;
    let reqParam = {
      companyUniqueName: compUname,
      q: query,
      page: $scope.flatAccListC5.page,
      count: $scope.flatAccListC5.count
    };
    return groupService.getFlatAccList(reqParam).then($scope.loadMoreAccSuccess, gc.loadMoreAccFailure);
  };
    //$scope.flatAccList.limit += 5
    //$scope.flatAccListC5.limit += 5
    
  $scope.loadMoreAccSuccess = function(res) {
    let list = res.body.results;
    if (res.body.totalPages > $scope.flatAccListC5.currentPage) {
     //$scope.fltAccntListcount5 = _.union($scope.fltAccntListcount5, list)
      _.each(res.body.results, acc =>
        //$scope.fltAccntListcount5.push(acc)
        gc.accountsListShort.push(acc)
      );
      
    } else {
     $scope.hideAccLoadMore = true;
   }
    $scope.flatAccListC5.limit += 5;
    $scope.flatAccListC5.currentPage = res.body.page;
    return $scope.flatAccListC5.totalPages = res.body.totalPages;
  };

  gc.loadMoreAccFailure = res => toastr.error(res.data.message);

  //----------for merge account refresh----------#
  $scope.mergeAccList = [];
  $scope.refreshFlatAccount = function(str) {
    this.success = res => $scope.mergeAccList = res.body.results;
    this.failure = res => toastr.error(res.data.message);
    let reqParam = {
      companyUniqueName: $rootScope.selectedCompany.uniqueName,
      q: str,
      page: 1,
      count: 0
    };
    if (str.length > 1) {
      return groupService.getFlatAccList(reqParam).then(this.success, this.failure);
    }
  };

  //-------- fetch groups with accounts list-------
//   $scope.working = false
//   $scope.getFlattenGrpWithAccList = (compUname) ->
// #    console.log("working  : ",$scope.working)
//     $rootScope.companyLoaded = false
//     reqParam = {
//       companyUniqueName: compUname
//       q: ''
//       page: $scope.gwaList.page
//       count: $scope.gwaList.count
//     }
//     if $scope.working == false
//       $scope.working = true
//       groupService.getFlattenGroupAccList(reqParam).then(gc.getFlattenGrpWithAccListSuccess, gc.getFlattenGrpWithAccListFailure)


//   gc.getFlattenGrpWithAccListSuccess = (res) ->
//     $scope.gwaList.page = res.body.page
//     $scope.gwaList.totalPages = res.body.totalPages
//     $scope.flatAccntWGroupsList = res.body.results
//     #$scope.flatAccntWGroupsList = gc.removeEmptyGroups(res.body.results)
// #    console.log($scope.flatAccntWGroupsList)
//     $scope.showAccountList = true
//     $scope.gwaList.limit = 5
//     $rootScope.companyLoaded = true
//     $scope.working = false

//   gc.getFlattenGrpWithAccListFailure = (res) ->
//     toastr.error(res.data.message)
//     $scope.working = false

//   $scope.loadMoreGrpWithAcc = (compUname, str) ->
//     $scope.gwaList.page += 1
//     reqParam = {
//       companyUniqueName: compUname
//       q: str
//       page: $scope.gwaList.page
//       count: $scope.gwaList.count
//     }
//     groupService.getFlattenGroupAccList(reqParam).then(gc.loadMoreGrpWithAccSuccess, gc.loadMoreGrpWithAccFailure)
//     $scope.gwaList.limit += 5

//   gc.loadMoreGrpWithAccSuccess = (res) ->
//     $scope.gwaList.currentPage += 1
//     #list = gc.removeEmptyGroups(res.body.results)
//     if res.body.results.length > 0 && res.body.totalPages >= $scope.gwaList.currentPage
//       _.each res.body.results, (grp) ->
//         $scope.flatAccntWGroupsList.push(grp) 
//       #$scope.flatAccntWGroupsList = _.union($scope.flatAccntWGroupsList, list)
//     else if res.body.totalPages >= $scope.gwaList.currentPage
//       $scope.loadMoreGrpWithAcc($rootScope.selectedCompany.uniqueName)
//     else
//       $scope.hideLoadMore = true

//   gc.loadMoreGrpWithAccFailure = (res) ->
//     toastr.error(res.data.message)

//   $scope.searchGrpWithAccounts = (str) ->
//     $scope.gwaList.page = 1
//     $scope.gwaList.currentPage = 1
//     reqParam = {}
//     reqParam.companyUniqueName = $rootScope.selectedCompany.uniqueName
//     if str.length > 2
//       #$scope.hideLoadMore = true
//       reqParam.q = str
//       reqParam.page = $scope.gwaList.page
//       reqParam.count = $scope.gwaList.count
//       groupService.getFlattenGroupAccList(reqParam).then(gc.getFlattenGrpWithAccListSuccess, gc.getFlattenGrpWithAccListFailure)
//     else
//       #$scope.hideLoadMore = false
//       reqParam.q = ''
//       groupService.getFlattenGroupAccList(reqParam).then(gc.getFlattenGrpWithAccListSuccess, gc.getFlattenGrpWithAccListFailure)
//     if str.length < 1
//       $scope.flatAccListC5.limit = 5
//       #$scope.hideLoadMore = false

//   gc.removeEmptyGroups = (grpList) ->
//     newList = []
//     _.each grpList, (grp) ->
//       if grp.accountDetails.length > 0
//         newList.push(grp)
//     newList

  //-------------------Functions for API side search and fetching flat account list end here-----------------------------------------------#

  gc.addFilterKey = function(data, n) {
    n = n || 1;
    _.each(data, function(grp) {
      grp.isVisible = true;
      grp.hLevel = n;

      if (grp.groups.length > 0) {
        n += 1;
        return _.each(grp.groups, function(sub) {
          sub.isVisible = true;
          sub.hLevel = n;
          if (sub.groups.length > 0) {
            n += 1;
            return gc.addFilterKey(sub.groups, n);
          }
        });
      }
    });
    return data;
  };

  gc.getGroupListSuccess = function(res) {
    $scope.groupList = gc.addFilterKey(res.body);
    $scope.showListGroupsNow = true;
    return gc.highlightAcMenu();
  };

  gc.getGroupListFailure = res => toastr.error(res.data.message, res.data.status);

  $scope.getGroupSharedList = function() {
    if ($scope.canShare) {
      let unqNamesObj = {
        compUname: $rootScope.selectedCompany.uniqueName,
        selGrpUname: $scope.selectedGroup.uniqueName
      };
      return groupService.sharedList(unqNamesObj).then(gc.onsharedListSuccess, gc.onsharedListFailure);
    }
  };

  gc.onsharedListSuccess = res => $scope.groupSharedUserList = res.body;

  gc.onsharedListFailure = res => toastr.error(res.data.message, res.data.status);

  //share group with user
  $scope.shareGroup = function() {
    let unqNamesObj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      selGrpUname: $scope.selectedGroup.uniqueName
    };
    return groupService.share(unqNamesObj, $scope.shareGroupObj).then(gc.onShareGroupSuccess, gc.onShareGroupFailure);
  };

  gc.onShareGroupSuccess = function(res) {
    $scope.shareGroupObj = {
      role: "view_only",
      user: ""
    };
    toastr.success(res.body, res.status);
    return $scope.getGroupSharedList($scope.selectedGroup);
  };

  gc.onShareGroupFailure = res => toastr.error(res.data.message, res.data.status);

  //unShare group with user
  $scope.unShareGroup = function(user) {
    let unqNamesObj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      selGrpUname: $scope.selectedGroup.uniqueName
    };
    let data = {
      user
    };
    return groupService.unshare(unqNamesObj, data).then(gc.unShareGroupSuccess, gc.unShareGroupFailure);
  };

  gc.unShareGroupSuccess = function(res){
    toastr.success(res.body, res.status);
    return $scope.getGroupSharedList($scope.selectedGroup);
  };

  gc.unShareGroupFailure = res=> toastr.error(res.data.message, res.data.status);

  $scope.updateGroup = function() {
    $scope.selectedGroup.uniqueName = $scope.selectedGroup.uniqueName.toLowerCase();
    if ($scope.selectedGroup.applicableTaxes.length > 0) {
      $scope.selectedGroup.applicableTaxes = _.pluck($scope.selectedGroup.applicableTaxes, 'uniqueName');
    }
    return groupService.update($scope.selectedCompany.uniqueName, $scope.selectedGroup).then(gc.onUpdateGroupSuccess,
        gc.onUpdateGroupFailure);
  };

  gc.onUpdateGroupSuccess = function(res) {
    $scope.selectedGroup.oldUName = $scope.selectedGroup.uniqueName;
    $scope.selectedGroup.applicableTaxes = res.body.applicableTaxes;
    if (!_.isEmpty($scope.selectedGroup)) {
      $scope.selectedItem = $scope.selectedGroup;
    }
    toastr.success("Group has been updated successfully.", "Success");
    return $scope.getGroups();
  };

  gc.onUpdateGroupFailure = res => toastr.error(res.data.message, res.data.status);

  gc.getUniqueNameFromGroupList = function(list) {
    let listofUN = _.map(list, function(listItem) {
      if (listItem.groups.length > 0) {
        let uniqueList = gc.getUniqueNameFromGroupList(listItem.groups);
        uniqueList.push(listItem.uniqueName);
        return uniqueList;
      } else {
        return listItem.uniqueName;
      }
    });
    return _.flatten(listofUN);
  };

  $scope.addNewSubGroup = function() {
    let uNameList = gc.getUniqueNameFromGroupList($scope.groupList);
    let UNameExist = _.contains(uNameList, $scope.selectedSubGroup.uniqueName);
    if (UNameExist) {
      toastr.error("Unique name is already in use.", "Error");
      return;
    }

    if (_.isEmpty($scope.selectedSubGroup.name)) {
      return;
    }

    let body = {
      "name": $scope.selectedSubGroup.name,
      "uniqueName": $scope.selectedSubGroup.uniqueName.toLowerCase(),
      "parentGroupUniqueName": $scope.selectedGroup.uniqueName,
      "description": $scope.selectedSubGroup.desc
    };
    return groupService.create($rootScope.selectedCompany.uniqueName, body).then(gc.onCreateGroupSuccess,gc.onCreateGroupFailure);
  };

  gc.onCreateGroupSuccess = function(res) {
    toastr.success("Sub group added successfully", "Success");
    $scope.selectedSubGroup = {};
    return $scope.getGroups();
  };

  gc.onCreateGroupFailure = res => toastr.error(res.data.message, res.data.status);

  $scope.deleteGroup = function() {
    if (!$scope.selectedGroup.isFixed) {
      return modalService.openConfirmModal({
        title: 'Delete group?',
        body: 'Are you sure you want to delete this group? All child groups will also be deleted.',
        ok: 'Yes',
        cancel: 'No'}).then(gc.deleteGroupConfirm);
    }
  };

  gc.deleteGroupConfirm = () => groupService.delete($rootScope.selectedCompany.uniqueName,$scope.selectedGroup).then(gc.onDeleteGroupSuccess,gc.onDeleteGroupFailure);

  gc.onDeleteGroupSuccess = function() {
    toastr.success("Group deleted successfully.", "Success");
    $scope.selectedGroup = {};
    $scope.showGroupDetails = false;
    $scope.showAccountListDetails = false;
    return $scope.getGroups();
  };

  gc.onDeleteGroupFailure = res => toastr.error(res.data.message, res.data.status);

  $scope.isChildGroup =group =>
    _.some(group.parentGroups, group => group.uniqueName === $scope.selectedGroup.uniqueName)
  ;

  $scope.moveGroup = function(group) {
    if (_.isUndefined(group.uniqueName)) {
      toastr.error("Select group only from list", "Error");
      return;
    }

    let unqNamesObj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      selGrpUname: $scope.selectedGroup.uniqueName
    };
    let body = {
      "parentGroupUniqueName": group.uniqueName
    };
    return groupService.move(unqNamesObj, body).then(gc.onMoveGroupSuccess, gc.onMoveGroupFailure);
  };

  gc.onMoveGroupSuccess = function(res) {
    $scope.moveto = undefined;
    toastr.success("Group moved successfully.", "Success");
    return $scope.getGroups();
  };

  gc.onMoveGroupFailure = res => toastr.error(res.data.message, res.data.status);

  gc.stopBubble = e => e.stopPropagation();

  $scope.selectItem = function(item) {
    $scope.search.flataccount = "";
    $scope.grpCategory = item.category;
    $scope.showEditTaxSection = false;
    return groupService.get($rootScope.selectedCompany.uniqueName, item.uniqueName).then(gc.getGrpDtlSuccess,
          gc.getGrpDtlFailure);
  };

  gc.getGrpDtlSuccess = function(res) {
    $scope.selectedItem = res.body;
    $scope.selectedAccntMenu = undefined;
    gc.selectGroupToEdit(res.body);
    $scope.accountsSearch = undefined;
    $scope.showGroupDetails = true;
    $scope.showAccountListDetails = true;
    $scope.showAccountDetails = false;
    return gc.populateAccountList(res.body);
  };

  gc.getGrpDtlFailure = res => toastr.error(res.data.message, res.data.status);

  gc.selectGroupToEdit = function(group) {
    _.each($scope.groupList, function(grp) {
      if (grp.uniqueName === group.uniqueName) {
        return group.isTopLevel = true;
      }
    });
    if (group.isTopLevel === undefined) {
      group.isTopLevel = false;
    }
    $scope.selectedGroup = group;
    if (_.isEmpty($scope.selectedGroup.oldUName)) {
      $scope.selectedGroup.oldUName = $scope.selectedGroup.uniqueName;
    }
    $scope.selectedSubGroup = {};
    $rootScope.$emit('callCheckPermissions', group);
    return $scope.getGroupSharedList(group);
  };


  gc.populateAccountList = function(item) {
    let result = groupService.matchAndReturnGroupObj(item, $rootScope.flatGroupsList);
    return $scope.groupAccntList = result.accounts;
  };

  //show breadcrumbs
  gc.showBreadCrumbs = function(data) {
    $scope.showBreadCrumb = true;
    return $scope.breadCrumbList = data;
  };

  //jump to group
  $scope.jumpToGroup = function(grpUniqName, grpList)  {
    let fltGrpList = groupService.flattenGroup(grpList, []);
    let obj = _.find(fltGrpList, item => item.uniqueName === grpUniqName);
//    $scope.selectGroupToEdit(obj)
    return $scope.selectItem(obj);
  };

  //check if object is empty on client side by mechanic
  $scope.isEmptyObject = obj => _.isEmpty(obj);

  gc.mergeNum = function(num) {
    if (_.isUndefined(num.Ccode) || _.isUndefined(num.onlyMobileNo) || _.isEmpty(num.Ccode) || _.isEmpty(num.onlyMobileNo)) {
      return null;
    }

    if (_.isObject(num.Ccode)) {
      return num.Ccode.value + "-" + num.onlyMobileNo;
    } else {
      return num.Ccode + "-" + num.onlyMobileNo;
    }
  };

  gc.breakMobNo = function(data) {
    if (data.mobileNo) {
      let res = data.mobileNo.split("-");
      return $scope.acntExt = {
        Ccode: res[0],
        onlyMobileNo: res[1]
      };
    } else {
      return $scope.acntExt = {
        Ccode: undefined,
        onlyMobileNo: undefined
      };
    }
  };

  //show account
  gc.getAccountCategory = function(parentGroups) {
    let pg = parentGroups[0]['uniqueName'];
    let grp = _.findWhere($rootScope.flatGroupsList, {uniqueName:pg});
    return grp.category;
  };


  $scope.showAccountDtl = function(data) {
    $scope.cantUpdate = false;
    //highlight account menus
    $scope.selectedAccntMenu = data;
    let reqParams = {
      compUname: $rootScope.selectedCompany.uniqueName,
      acntUname: data.uniqueName
    };
    $scope.showEditTaxSection = false;
    return accountService.get(reqParams).then(
      res => gc.getAcDtlSuccess(res, data), 
      res => gc.getAcDtlFailure(res));
  };

  gc.getAcDtlSuccess = function(res, data) {
    //getPgrps = groupService.matchAndReturnGroupObj(res.body, $rootScope.fltAccntListPaginated)
    //getPgrps = groupService.matchAndReturnGroupObj(res.body, $rootScope.fltAccntListPaginated)
    data = res.body;
    $scope.AccountCategory = gc.getAccountCategory(data.parentGroups);
    gc.getMergedAccounts(data);
    // data.parentGroups = []
    //_.extend(data.parentGroups, getPgrps.parentGroups)
    $rootScope.$emit('callCheckPermissions', data);
    let pGroups = [];
    $scope.showGroupDetails = false;
    $scope.showAccountDetails = true;
    if (data.uniqueName === $rootScope.selAcntUname) {
      $scope.cantUpdate = true;
    }
    _.extend($scope.selAcntPrevObj, data);
    _.extend($scope.selectedAccount, data);
    $rootScope.selectedAccount = $scope.selectedAccount;
    gc.breakMobNo(data);
    gc.setOpeningBalanceDate();
    $scope.getAccountSharedList();
    $scope.acntCase = "Update";
    $scope.isFixedAcc = res.body.isFixed;
    gc.showBreadCrumbs(data.parentGroups);
    return $scope.fetchingUnq = false;
  };
//    console.log $scope.selectedAccount


  gc.getAcDtlFailure = res => toastr.error(res.data.message, res.data.status);

  // prepare date object
  gc.setOpeningBalanceDate = function() {
    if ($scope.selectedAccount.openingBalanceDate) {
      let newDateObj = $scope.selectedAccount.openingBalanceDate.split("-");
      return $scope.datePicker.accountOpeningBalanceDate = new Date(newDateObj[2], newDateObj[1] - 1, newDateObj[0]);
    } else {
      return $scope.datePicker.accountOpeningBalanceDate = new Date();
    }
  };

  $scope.addNewAccountShow = function(groupData)  {
    $scope.isFixedAcc = false;
    $scope.cantUpdate = false;
    // make blank for new
    $scope.selectedAccount = {};
    $scope.acntExt = {
      Ccode: undefined,
      onlyMobileNo: undefined
    };
    $scope.breadCrumbList = undefined;
    $scope.selectedAccntMenu = undefined;
    $scope.showGroupDetails = false;
    $scope.showAccountDetails = true;
    // for play between update and add
    $scope.acntCase = "Add";
    gc.setOpeningBalanceDate();
    return gc.showBreadCrumbs([_.pick($scope.selectedGroup,'uniqueName','name')]);
  };

  gc.setAdditionalAccountDetails = function(){
    let unqNamesObj;
    $scope.selectedAccount.openingBalanceDate = $filter('date')($scope.datePicker.accountOpeningBalanceDate,"dd-MM-yyyy");
    if(_.isUndefined($scope.selectedAccount.mobileNo) || _.isEmpty($scope.selectedAccount.mobileNo)) {
      $scope.selectedAccount.mobileNo = "";
    }
    if(_.isUndefined($scope.selectedAccount.email) || _.isEmpty($scope.selectedAccount.email)) {
      $scope.selectedAccount.email = "";
    }
    //$scope.selectedAccount.mobileNo = $scope.mergeNum($scope.acntExt)
    return unqNamesObj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      selGrpUname: $scope.selectedGroup.uniqueName,
      acntUname: $scope.selectedAccount.uniqueName
    };
  };

  $scope.addAccount = function() {
    let unqNamesObj = gc.setAdditionalAccountDetails();
    return accountService.createAc(unqNamesObj, $scope.selectedAccount).then(gc.addAccountSuccess, gc.addAccountFailure);
  };

  gc.addAccountSuccess = function(res) {
    toastr.success("Account created successfully", res.status);
    $scope.getGroups();
    $scope.selectedAccount = {};
    let abc = _.pick(res.body, 'name', 'uniqueName', 'mergedAccounts','applicableTaxes','parentGroups');
    $scope.groupAccntList.push(abc);
    return $rootScope.getFlatAccountList($rootScope.selectedCompany.uniqueName);
  };

  gc.addAccountFailure = res => toastr.error(res.data.message, res.data.status);

  $scope.deleteAccount = function() {
    if ($scope.canDelete) {
      return modalService.openConfirmModal({
        title: 'Delete Account?',
        body: 'Are you sure you want to delete this Account?',
        ok: 'Yes',
        cancel: 'No'}).then(gc.deleteAccountConfirm);
    }
  };

  gc.deleteAccountConfirm = function() {
    let unqNamesObj = gc.setAdditionalAccountDetails();
    if ($scope.selectedAccount.uniqueName !== $scope.selAcntPrevObj.uniqueName) {
      unqNamesObj.acntUname = $scope.selAcntPrevObj.uniqueName;
    }
    if (_.isEmpty($scope.selectedGroup)) {
      unqNamesObj.selGrpUname = $scope.selectedAccount.parentGroups[0].uniqueName;
    }

    return accountService.deleteAc(unqNamesObj, $scope.selectedAccount).then(gc.moveAccntSuccess, gc.onDeleteAccountFailure);
  };

  gc.onDeleteAccountFailure = res => toastr.error(res.data.message, res.data.status);

  $scope.updateAccount = function() {
    let unqNamesObj = gc.setAdditionalAccountDetails();
    if (angular.equals($scope.selectedAccount, $scope.selAcntPrevObj)) {
      toastr.info("Nothing to update", "Info");
      return false;
    }

    if ($scope.selectedAccount.openingBalanceType === null) {
      $scope.selectedAccount.openingBalanceType = 'credit';
    }

    if ($scope.selectedAccount.uniqueName !== $scope.selAcntPrevObj.uniqueName) {
      unqNamesObj.acntUname = $scope.selAcntPrevObj.uniqueName;
    }

    if (_.isEmpty($scope.selectedGroup)) {
      let lastVal = _.last($scope.selectedAccount.parentGroups);
      unqNamesObj.selGrpUname = lastVal.uniqueName;
    }

    if ($scope.selectedAccount.applicableTaxes.length > 0) {
      $scope.selectedAccount.applicableTaxes = _.pluck($scope.selectedAccount.applicableTaxes,'uniqueName');
    }

    let accountPayload = angular.copy($scope.selectedAccount, {});
    delete accountPayload.stocks;  
    return accountService.updateAc(unqNamesObj, accountPayload).then(gc.updateAccountSuccess,
        gc.updateAccountFailure);
  };


  gc.updateAccountSuccess = function(res) {
    toastr.success("Account updated successfully", res.status);
    angular.merge($scope.selectedAccount, res.body);
    $scope.getGroups();
    let abc = _.pick($scope.selectedAccount, 'name', 'uniqueName', 'mergedAccounts');
    if (!_.isEmpty($scope.selectedGroup)) {
      _.find($scope.groupAccntList, function(item, index) {
        if (item.uniqueName === $scope.selAcntPrevObj.uniqueName) {
          return angular.merge($scope.groupAccntList[index], abc);
        }
      });
    }
    // end if
    return angular.merge($scope.selAcntPrevObj, res.body);
  };


  gc.updateAccountFailure = res => toastr.error(res.data.message, res.data.status);

  $scope.isCurrentGroup =group => (group.uniqueName === $scope.selectedAccount.parentGroups[0].uniqueName) || (group.uniqueName === $scope.selectedAccount.parentGroups[$scope.selectedAccount.parentGroups.length-1].uniqueName);

  $scope.isCurrentAccount =acnt => acnt.uniqueName === $scope.selectedAccount.uniqueName;

  $scope.moveAccnt = function(group) {
    if (_.isUndefined(group.uniqueName)) {
      toastr.error("Select group only from list", "Error");
      return;
    }
    let unqNamesObj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      selGrpUname: $scope.selectedGroup.uniqueName,
      acntUname: $scope.selectedAccount.uniqueName
    };
    if (_.isUndefined($scope.selectedGroup.uniqueName)) {
      let lastVal = _.last($scope.selectedAccount.parentGroups);
      unqNamesObj.selGrpUname = lastVal.uniqueName;
    }

    let body = {
      "uniqueName": group.uniqueName
    };
    return accountService.move(unqNamesObj, body).then(gc.moveAccntSuccess, $scope.moveAccntFailure);
  };

  gc.moveAccntSuccess = function(res) {
    toastr.success(res.body, res.status);
    $scope.getGroups();
    $rootScope.getFlatAccountList($rootScope.selectedCompany.uniqueName);
    $scope.showAccountDetails = false;
    if (!_.isEmpty($scope.selectedGroup)) {
      $scope.groupAccntList = _.reject($scope.groupAccntList, item => item.uniqueName === $scope.selectedAccount.uniqueName);
    }
    // end if
    $scope.selectedAccount = {};
    return $scope.selAcntPrevObj = {};
  };


  $scope.moveAccntFailure = res => toastr.error(res.data.message, res.data.status);

  $scope.shareAccount = function() {
    let unqNamesObj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      selGrpUname: $scope.selectedGroup.uniqueName,
      acntUname: $scope.selectedAccount.uniqueName
    };
    if (_.isEmpty($scope.selectedGroup)) {
      unqNamesObj.selGrpUname = $scope.selectedAccount.parentGroups[0].uniqueName;
    }

    return accountService.share(unqNamesObj, $scope.shareAccountObj).then($scope.onShareAccountSuccess, $scope.onShareAccountFailure);
  };

  $scope.onShareAccountSuccess = function(res) {
    $scope.shareAccountObj.user = "";
    toastr.success(res.body, res.status);
    return $scope.getAccountSharedList();
  };

  $scope.onShareAccountFailure = res => toastr.error(res.data.message, res.data.status);

  $scope.unShareAccount = function(user) {
    let unqNamesObj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      selGrpUname: $scope.selectedGroup.uniqueName,
      acntUname: $scope.selectedAccount.uniqueName
    };
    if (_.isEmpty($scope.selectedGroup)) {
      unqNamesObj.selGrpUname = $scope.selectedAccount.parentGroups[0].uniqueName;
    }

    let data = { user};
    return accountService.unshare(unqNamesObj, data).then($scope.unShareAccountSuccess, $scope.unShareAccountFailure);
  };

  $scope.unShareAccountSuccess = function(res){
    toastr.success(res.body, res.status);
    return $scope.getAccountSharedList();
  };

  $scope.unShareAccountFailure = res=> toastr.error(res.data.message, res.data.status);

  $scope.getAccountSharedList = function() {
    if ($scope.canShare) {
      let unqNamesObj = {
        compUname: $rootScope.selectedCompany.uniqueName,
        selGrpUname: $scope.selectedAccount.parentGroups[0].uniqueName,
        acntUname: $scope.selectedAccount.uniqueName
      };
      return accountService.sharedWith(unqNamesObj).then($scope.onGetAccountSharedListSuccess, $scope.onGetAccountSharedListSuccess);
    }
  };

  $scope.onGetAccountSharedListSuccess = res => $scope.accountSharedUserList = res.body;

  $scope.onGetAccountSharedListFailure = res => toastr.error(res.data.message, res.data.status);

  $scope.loadAccountsList = function() {
    if (!_.isEmpty($rootScope.selectedCompany)) {
      return $scope.getGroups();
    }
  };

  $scope.assignValues = function() {
    let data = localStorageService.get("_selectedCompany");
    $rootScope.canViewSpecificItems = false;
    if (_.isUndefined(data) || _.isEmpty(data)) {

    } else if (data.role.uniqueName === 'shared') {
      $rootScope.canManageComp = false;
      if (data.sharedEntity === 'groups') {
        return $rootScope.canViewSpecificItems = true;
      }
    } else {
      return $rootScope.canManageComp = true;
    }
  };

  $rootScope.$on('reloadAccounts', function() {
    $rootScope.canChangeCompany = false;
    $scope.showAccountList = false;
    $scope.getGroups();
    return $('#accountSearch').val('');
  });



  $rootScope.$on('callManageGroups', () => $scope.goToManageGroups());

  $timeout(function() {
    // $scope.loadAccountsList()
    if (!_.isEmpty($rootScope.selectedCompany) && ($scope.flatAccntWGroupsList.length < 1)) {
      $scope.getGroups();
    }
    return $scope.assignValues();
  }
  ,2000);

  //########################### for merge/unmerge accounts ############################
  $scope.toMerge = {
    mergeTo:'',
    mergedAcc: [],
    toUnMerge : {
      name: '',
      uniqueNames: [],
      moveTo: ''
    },
    moveToAcc: ''
  };
  gc.getMergedAccounts = function(accData) {
    $scope.showDeleteMove = false;
    $scope.AccountsList = $rootScope.fltAccntListPaginated;
    //remove selected account from AccountsList
    let accToRemove = {
      uniqueName: accData.uniqueName
    };
    $scope.AccountsList = _.without($scope.AccountsList, _.findWhere($scope.AccountsList, accToRemove));

    $scope.prePopulate = [];
    $scope.toMerge.mergeTo = accData.uniqueName;
    let mergedAcc = accData.mergedAccounts;
    let mList = [];
    if (!_.isEmpty(mergedAcc) && !_.isUndefined(mergedAcc)) {
      mList = mergedAcc.split(',');
      _.each(mList, function(mAcc) {
        let mObj = {
          uniqueName: '',
          noRemove : true
        };
        mObj.uniqueName = mAcc;
        return $scope.prePopulate.push(mObj);
      });
      return $scope.toMerge.mergedAcc = $scope.prePopulate;
    } else {
      $scope.prePopulate = [];
      return $scope.toMerge.mergedAcc = [];
    }
  };

  $scope.enableMergeButton = function() {
    if (($scope.prePopulate.length === 0) && ($scope.toMerge.mergedAcc.length === 0)) {
      return true;
    } else if  (($scope.prePopulate.length > 0) && ($scope.toMerge.mergedAcc.length === $scope.prePopulate.length)) {
      return true;
    } else if (($scope.prePopulate.length > 0) && ($scope.toMerge.mergedAcc.length > $scope.prePopulate.length)) {
      return false;
    } else if (($scope.prePopulate.length > 0) && ($scope.toMerge.mergedAcc.length < $scope.prePopulate.length)) {
      return true;
    }
  };


  //merge account
  $scope.mergeAccounts = function() {
    let accToMerge = [];
    let withoutMerged = [];
    if ($scope.prePopulate.length > 0) {
      // _.each $scope.prePopulate,(pre) ->
      //   _.each $scope.toMerge.mergedAcc, (acc) ->
      //     console.log pre.uniqueName, acc.uniqueName
      //     accToSend = {
      //       "uniqueName": ""
      //     }
      //     if pre.uniqueName != acc.uniqueName
      //       accToSend.uniqueName = acc.uniqueName
      //       accToMerge.push(accToSend)
      withoutMerged = _.difference($scope.toMerge.mergedAcc, $scope.prePopulate);
      _.each(withoutMerged, function(acc) {
        let accToSend = {
          "uniqueName": ""
        };
        if (acc.hasOwnProperty('mergedAccounts')) {
          accToSend.uniqueName = acc.uniqueName;
          return accToMerge.push(accToSend);
        }
      });
    } else {
      _.each($scope.toMerge.mergedAcc, function(acc) {
        let accToSend = {
          "uniqueName": ""
        };
        accToSend.uniqueName = acc.uniqueName;
        return accToMerge.push(accToSend);
      });
    }
    let unqNamesObj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      acntUname: $scope.toMerge.mergeTo
    };
    if (accToMerge.length > 0) {
      accountService.merge(unqNamesObj, accToMerge).then( gc.mergeSuccess, gc.mergeFailure);
      return _.each(accToMerge, function(acc) {
        let removeMerged = {
          uniqueName: acc.uniqueName
        };
        return $scope.AccountsList = _.without($scope.AccountsList, _.findWhere($scope.AccountsList, removeMerged));
      });
    } else {
      return toastr.error("Please select at least one account.");
    }
  };


  gc.mergeSuccess = function(res) {
    toastr.success(res.body);
    _.each($scope.toMerge.mergedAcc, function(acc) {
      $rootScope.removeAccountFromPaginatedList(acc);
      return acc.noRemove = true;
    });
    $scope.getGroups();
    $scope.prePopulate = $scope.toMerge.mergedAcc;
    return $rootScope.getFlatAccountList($rootScope.selectedCompany.uniqueName);
  };

  gc.mergeFailure = res => toastr.error(res.data.message);

  //delete account
  $scope.unmerge = function(item) {
    item.uniqueName = item.uniqueName.replace(RegExp(' ', 'g'), '');
    $scope.toMerge.toUnMerge.uniqueNames = '';
    $scope.toMerge.toUnMerge.uniqueNames = item.uniqueName;
    if (item.noRemove === true) { return ($scope.showDeleteMove = true); } else { return ($scope.showDeleteMove = false); }
  };


  $scope.deleteMergedAccount = function() {
    $scope.toMerge.toUnMerge.moveTo = null;
    return modalService.openConfirmModal({
      title: 'Delete Merged Account',
      body: `Are you sure you want to delete ${$scope.toMerge.toUnMerge.uniqueNames} ?`,
      ok: 'Yes',
      cancel: 'No'}).then(gc.deleteMergedAccountConfirm);
  };

  gc.deleteMergedAccountConfirm = function() {
    let unqNamesObj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      acntUname: $scope.toMerge.mergeTo
    };
    let accTosend = {
      "uniqueNames": []
    };
    if ($scope.toMerge.toUnMerge.uniqueNames.length !== 0) {
      accTosend.uniqueNames.push($scope.toMerge.toUnMerge.uniqueNames);
      accountService.unMergeDelete(unqNamesObj, accTosend).then( gc.deleteMergedAccountSuccess, gc.deleteMergedAccountFailure);
      return _.each(accTosend.uniqueNames, function(accUnq) {
        let removeFromPrePopulate = {
          uniqueName: accUnq
        };
        return $scope.prePopulate = _.without($scope.prePopulate, _.findWhere($scope.prePopulate, removeFromPrePopulate));
      });
    } else {
      return toastr.error('Please Select an Account to delete');
    }
  };

  gc.deleteMergedAccountSuccess = function(res) {
    toastr.success(res.body);
    let updatedMergedAccList = [];
    _.each($scope.toMerge.mergedAcc, function(obj) {
      let toRemove = {};
      if (obj.uniqueName !== $scope.toMerge.toUnMerge.uniqueNames) {
        toRemove = obj;
        toRemove.noRemove = false;
        if (!obj.hasOwnProperty('mergedAccounts')) {
          toRemove.noRemove = true;
        }
        return updatedMergedAccList.push(toRemove);
      }
    });
    $scope.toMerge.mergedAcc = updatedMergedAccList;
    $scope.toMerge.toUnMerge.uniqueNames = '';
    return $scope.toMerge.moveToAcc = '';
  };


  gc.deleteMergedAccountFailure = res => toastr.error(res.data.message);

  // move to account
  $scope.moveToAccount = () =>
    modalService.openConfirmModal({
      title: 'Move Merged Account',
      body: `Are you sure you want to move ${$scope.toMerge.toUnMerge.uniqueNames} to ${$scope.toMerge.moveToAcc.uniqueName}`,
      ok: 'Yes',
      cancel: 'No'}).then(gc.moveToAccountConfirm)
  ;

  gc.moveToAccountConfirm = function() {
    let unqNamesObj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      acntUname: $scope.toMerge.moveToAcc.uniqueName
    };
    let accTosend = {
      uniqueName: $scope.toMerge.toUnMerge.uniqueNames
    };
    let accToSendArray = [];
    if ($scope.toMerge.toUnMerge.uniqueNames.length !== 0) {
      accToSendArray.push(accTosend);
      accountService.merge(unqNamesObj, accToSendArray).then( gc.moveToAccountConfirmSuccess, gc.moveToAccountConfirmFailure);
      return _.each(accToSendArray, function(accUnq) {
        let removeFromPrePopulate = {
          uniqueName: accUnq
        };
        return $scope.prePopulate = _.without($scope.prePopulate, _.findWhere($scope.prePopulate, removeFromPrePopulate));
      });
    } else {
      return toastr.error('Please Select an account to move.');
    }
  };

  gc.moveToAccountConfirmSuccess = function(res) {
    toastr.success(res.body);
    let updatedMergedAccList = [];
    _.each($scope.toMerge.mergedAcc, function(obj) {
      let toRemove = {};
      if (obj.uniqueName !== $scope.toMerge.toUnMerge.uniqueNames) {
        toRemove = obj;
        toRemove.noRemove = false;
        if (!obj.hasOwnProperty('mergedAccounts')) {
          toRemove.noRemove = true;
        }
        return updatedMergedAccList.push(toRemove);
      }
    });
    $scope.toMerge.mergedAcc = updatedMergedAccList;
    $scope.toMerge.toUnMerge.uniqueNames = '';
    return $scope.toMerge.moveToAcc = '';
  };

  gc.moveToAccountConfirmFailure = res => toastr.error(res.data.message);

  // $scope.isGrpMatch = (g, q) ->
  //   p = RegExp(q,"i")
  //   if (g.groupName.match(p) || g.groupUniqueName.match(p))
  //     return true
  //   return false

  $scope.getTaxList = () => companyServices.getTax($rootScope.selectedCompany.uniqueName).then(gc.getTaxSuccess, gc.getTaxFailure);

  gc.getTaxSuccess = res => $scope.taxList = res.body;

  gc.getTaxFailure = res => toastr.error(res.data.message);

  $scope.getTaxHierarchy = function(type) {
    $scope.getTaxList();
    if (type === 'group') {
      return groupService.getTaxHierarchy($rootScope.selectedCompany.uniqueName,$scope.selectedGroup.uniqueName).then(gc.getTaxHierarchyOnSuccess,gc.getTaxHierarchyOnFailure);
    } else if (type === 'account') {
      return accountService.getTaxHierarchy($rootScope.selectedCompany.uniqueName, $scope.selectedAccount.uniqueName).then(gc.getTaxHierarchyOnSuccess,gc.getTaxHierarchyOnFailure);
    }
  };

  gc.getTaxHierarchyOnSuccess = function(res) {
    $scope.taxHierarchy = res.body;
    $scope.selectedTax.taxes = $scope.taxHierarchy.applicableTaxes;
    $scope.showEditTaxSection = true;
    $scope.allInheritedTaxes = [];
    return gc.createInheritedTaxList($scope.taxHierarchy.inheritedTaxes);
  };

  gc.getTaxHierarchyOnFailure = res => toastr.error(res.data.message);

  gc.createInheritedTaxList = function(inTaxList) {
//get all taxes by uniqueName
    let inTaxUnq = [];
    _.each(inTaxList, tax =>
      _.each(tax.applicableTaxes, inTax => inTaxUnq.push(inTax.uniqueName))
    );
    inTaxUnq = _.uniq(inTaxUnq);

    // match groups with tax uniqueNames
    return _.each(inTaxUnq, function(unq) {
      let tax = {};
      tax.uniqueName = unq;
      tax.groups = [];
      _.each(inTaxList, inTax =>
        _.each(inTax.applicableTaxes, function(inAppTax) {
          if (tax.uniqueName === inAppTax.uniqueName) {
            let grp = {};
            grp.name = inTax.name;
            grp.uniqueName = inTax.uniqueName;
            tax.name = inAppTax.name;
            return tax.groups.push(grp);
          }
        })
      );
      return $scope.allInheritedTaxes.push(tax);
    });
  };

  $scope.isAccount = false;
  $scope.assignTax = dataToSend => companyServices.assignTax($rootScope.selectedCompany.uniqueName,dataToSend).then(gc.assignTaxOnSuccess,gc.assignTaxOnFailure);

  gc.assignTaxOnSuccess = function(res) {
    $scope.showEditTaxSection = false;
    toastr.success(res.body);
    if (!$scope.isAccount) {
      return groupService.get($rootScope.selectedCompany.uniqueName, $scope.selectedGroup.uniqueName).then($scope.getGrpDtlSuccess,
          $scope.getGrpDtlFailure);
    } else {
      let reqParams = {
        compUname: $rootScope.selectedCompany.uniqueName,
        acntUname: $scope.selectedAccount.uniqueName
      };
      return accountService.get(reqParams).then(gc.getAcDtlSuccess, $scope.getAcDtlFailure);
    }
  };

  // $scope.getAccountDetailsSuccess = (res) ->
  //   $scope.selectedAccount.applicableTaxes = res.body.applicableTaxes

  gc.assignTaxOnFailure = function(res) {
    $scope.showEditTaxSection = false;
    return toastr.error(res.data.message);
  };

  $scope.applyTax = function(type) {
    if (_.isEmpty(type)) {
      return toastr.warning("Please do not mess with html.");
    } else {
      // We have to send all the taxes
      let mergeTaxes = [];
      mergeTaxes.push($scope.taxHierarchy.applicableTaxes);
      mergeTaxes.push(_.pluck($scope.taxHierarchy.inheritedTaxes, 'applicableTaxes'));
      let sendThisList = _.pluck(_.flatten(mergeTaxes),'uniqueName');
      let data = {};
      if (type === 'group') {
        data = [{"uniqueName":$scope.selectedGroup.uniqueName, "taxes":sendThisList,"isAccount":false}];
        $scope.isAccount = false;
      } else if (type === 'account') {
        data = [{"uniqueName":$scope.selectedAccount.uniqueName, "taxes":sendThisList,"isAccount":true}];
        $scope.isAccount = true;
      }
      return $scope.assignTax(data);
    }
  };

  $scope.alreadyAppliedTaxes = function(tax) {
    let inheritTax = _.pluck($scope.taxHierarchy.inheritedTaxes,'applicableTaxes');
    let applicableTaxes = _.flatten($scope.taxHierarchy);
    applicableTaxes.push(inheritTax);
    let checkInThis = _.pluck(_.flatten(applicableTaxes),'uniqueName');
//    checkInThis = _.pluck($scope.selectedAccount.applicableTaxes, 'uniqueName')
    let condition = _.contains(checkInThis, tax.uniqueName);
    return condition;
  };

  $scope.fetchingUnq = false;
  let num = 1;
  $scope.autoFillUnq = function(unq) {
    unq = unq.replace(/ |,|\//g,'');
    unq = unq.toLowerCase();
    let $this = this;
    $scope.fetchingUnq = true;
    $this.success = function(res) {
      $scope.autoFillUnq(unq+num);
      return num += 1;
    };
    $this.failure = function(res) {
      $scope.selectedAccount.uniqueName = unq;
      num = 1;
      return $scope.fetchingUnq = false;
    };
    if (($scope.acntCase === 'Add') && (unq !== undefined) && (unq.length > 2)) {
      return $timeout(( function() {
        let reqParams = {
          compUname: $rootScope.selectedCompany.uniqueName,
          acntUname: unq
        };
        return accountService.get(reqParams).then($this.success, $this.failure);
      }), 1000);
    } else if (unq === undefined) {
      return $scope.selectedAccount.uniqueName === null;
    }
  };

  $scope.$watch('toMerge.mergedAcc', function(newVal,oldVal) {
    if ((newVal !== oldVal) && (newVal < 1)) {
      return $scope.showDeleteMove = false;
    }
  });

  $scope.$watch('toMerge.toUnMerge.uniqueNames', function(newVal, oldVal){
    if ((newVal !== oldVal) && (newVal.length < 1)) {
      return $scope.showDeleteMove = false;
    }
  });

  $rootScope.$on('companyLoaded', function(){
    $scope.flatAccntWGroupsList = [];
    return $scope.getFlattenGrpWithAccList($rootScope.selectedCompany.uniqueName);
  });

  $rootScope.$on('catchBreadcumbs', (e, breadcrumbs) => $scope.accountToShow = breadcrumbs);

};

//init angular app
giddh.webApp.controller('groupController', groupController);