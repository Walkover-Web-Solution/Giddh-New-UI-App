let manageController = function($scope, $rootScope, localStorageService, groupService, toastr, modalService, $timeout, accountService, locationService, ledgerService, $filter, permissionService, DAServices, $location, $uibModal, companyServices) {
  let mc = this;
  mc.groupList = [];
  mc.flattenGroupList = [];
  mc.moveto = undefined;
  mc.selAcntPrevObj = {};
  mc.datePicker = {accountOpeningBalanceDate: ""};
  mc.selectedGroupUName = "";
  mc.cantUpdate = false;
  mc.showGroupDetails = false;
  mc.showListGroupsNow = false;
  mc.showAccountDetails = false;
  mc.showAccountListDetails = false;
  mc.showDeleteMove = false;
  mc.AccountsList = [];
  mc.groupAccntList = [];
  mc.showEditTaxSection = false;
  mc.shareGroupObj = {role: "view_only"};
  mc.shareAccountObj ={role: "view_only"};
  mc.openingBalType = [
    {"name": "Credit", "val": "CREDIT"},
    {"name": "Debit", "val": "DEBIT"}
  ];
  mc.acntExt = {
    Ccode: undefined,
    onlyMobileNo: undefined
  };
  mc.showAccountList = false;
  mc.isFixedAcc = false;

  mc.taxHierarchy = {};
  mc.taxHierarchy.applicableTaxes = [];
  mc.taxHierarchy.inheritedTaxes = [];
  mc.taxInEditMode = false;
  mc.columns = [];
  mc.searchColumns = [];
  mc.createNew = false;
//  $scope.fltAccntListPaginated = []
//  $scope.flatAccList = {
//    page: 1
//    count: 5
//    totalPages: 0
//    currentPage : 1
//    limit: 5
//  }
  mc.selectedTax = {};
  mc.selectedTax.taxes = '';

  mc.selectedGrp = {};
  mc.selectedType = undefined;
  mc.breadcrumbs = [];
  mc.showOnUpdate = false;
  mc.prePopulate = [];
  mc.getMergeAcc = [];
  mc.breadCrumbList = [];
  mc.updateBreadCrumbs = true;
  mc.updateSearchItem = false;
// get selected account or grp to show/hide
  mc.getSelectedType = function(type) {
    mc.selectedType = type;
    return mc.createNew = false;
  };
// end


  $rootScope.$on('Open-Manage-Modal', ()=> mc.NewgoToManageGroups());

  //show breadcrumbs
  mc.showBreadCrumbs = data => mc.showBreadCrumb = true;

  // mc.NewgoToManageGroups =() ->
  //   if !$rootScope.canManageComp
  //     return
  //   if _.isEmpty($rootScope.selectedCompany)
  //     toastr.error("Select company first.", "Error")
  //   else
  //     modalInstance = $uibModal.open(
  //       templateUrl: $rootScope.prefixThis+'/public/webapp/NewManageGroupsAndAccounts/ManageGroupModal.html'
  //       size: "liq90"
  //       backdrop: 'static'
  //       scope: $scope
  //     )
  //     modalInstance.result.then(mc.goToManageGroupsOpen, mc.goToManageGroupsClose)


  mc.goToManageGroupsOpen = res => console.log("manage opened", res);

  mc.goToManageGroupsClose = function() {
    mc.selectedItem = undefined;
    mc.showGroupDetails = false;
    mc.showAccountDetails = false;
    mc.showAccountListDetails = false;
    mc.cantUpdate = false;
    mc.selectedTax.taxes = {};
    return mc.showEditTaxSection = false;
  };

// add hierarchy level to track open column and asset
  mc.addHLevel = (groups, level) =>
    _.each(groups, function(grp) {
      grp.hLevel = level;
      if (grp.groups.length > 0) {
        return mc.addHLevel(grp.groups, grp.hLevel+1);
      }
    })
  ;

// end

  mc.getGroupListSuccess = function(res) {
    res.body = mc.orderGroups(res.body);
    mc.searchLoad = false;
    mc.columns = [];
    mc.showListGroupsNow = true;
    let col = {};
    col.groups = mc.addHLevel(res.body, 0);
    col.accounts = [];
    mc.columns.push(col);
    if (mc.breadCrumbList.length) {
      mc.updateAll(res.body);
    }
    return mc.flattenGroupList = groupService.makeGroupListFlatwithLessDtl($rootScope.flatGroupsList);
  };

  mc.getGroupListFailure = res => toastr.error(res.data.message, res.data.status);

  mc.getGroupListFailure = res => toastr.error(res.data.message, res.data.status);

  mc.getGroups =function() {
    mc.searchLoad = true;
    return groupService.getGroupsWithAccountsCropped($rootScope.selectedCompany.uniqueName).then(mc.getGroupListSuccess, mc.getGroupListFailure);
  };

  mc.getGroups();

  mc.orderGroups = function(data) {
    let orderedGroups = [];
    let assets = [];
    let liabilities = [];
    let income = [];
    let expenses = [];
    _.each(data, function(grp) {
      switch (grp.category) {
        case 'assets':
          return assets.push(grp);
          // $scope.balSheet.assets.push(grp)
        case 'liabilities':
          return liabilities.push(grp);
          // $scope.balSheet.liabilities.push(grp)
        case 'income':
          return income.push(grp);
        case 'expenses':
          return expenses.push(grp);
        default:
          return assets.push(grp);
      }
    });
    _.each(liabilities, liability => orderedGroups.push(liability));
    _.each(assets, asset => orderedGroups.push(asset));
    _.each(income, inc => orderedGroups.push(inc));
    _.each(expenses, exp => orderedGroups.push(exp));
    return orderedGroups;
  };


  // mc.selectItemAfterUpdate = (item, fromApi) ->

  mc.populateAccountList = function(item) {
    let result = groupService.matchAndReturnGroupObj(item, $rootScope.flatGroupsList);
    return mc.groupAccntList = result.accounts;
  };

  mc.updateAll = groupList =>
    _.each(mc.breadCrumbList, function(item, i) {
      let currentItem = _.findWhere(groupList, {uniqueName:item.uniqueName});
      if (currentItem) {
        mc.selectItem(currentItem, false);
        /*set selcted item class*///
        return _.each(mc.columns[i].groups, function(grp, idx) {
          if (grp.uniqueName === currentItem.uniqueName) {
            return mc.selectActiveItems(mc.columns[i], 'grp', idx);
          }
        });
      } else if (!currentItem) {
        if (item.groups) {
          currentItem = _.findWhere(mc.selectedItem.groups, {uniqueName:item.uniqueName});
          mc.selectItem(currentItem, false);
          /*set selcted item class*///
          return _.each(mc.columns[i].groups, function(grp, index) {
            if (grp.uniqueName === currentItem.uniqueName) {
              return mc.selectActiveItems(mc.columns[i], 'grp', index);
            }
          });
        } else {
          currentItem = _.findWhere(mc.selectedItem.accounts, {uniqueName:item.uniqueName});
          mc.getAccDetail(currentItem, i);
          /*set selcted item class*///
          return _.each(mc.columns[i].accounts, function(grp, index) {
            if (grp.uniqueName === currentItem.uniqueName) {
              return mc.selectActiveItems(mc.columns[i], 'acc', index);
            }
          });
        }
      }
    })
  ;



  mc.getItemIndex = function(list, item, key) {
    let idx = null;
    let matchCount = 0;
    _.each(list, function(crumb, index) {
      if (crumb[key] === item[key]) {
        matchCount += 1;
        if (matchCount === 1) {
          return idx = index;
        }
      }
    });
    return idx;
  };

// create breadcrumbs list
  mc.addToBreadCrumbs = function(item, type, accIndex) {
    let idx;
    item.type = type;
    // if type == 'account'
    //   mc.breadCrumbList[mc.breadCrumbList.length] = item
    //   return 0
    let itemExists = _.findWhere(mc.breadCrumbList, {uniqueName:item.uniqueName,type:item.type});
    if (item.hLevel === 0) {
      mc.breadCrumbList = [];
      mc.breadCrumbList.push(item);
      return 0;
    }
    if (!itemExists) {
      let hLevelMatch = _.findWhere(mc.breadCrumbList, {hLevel:item.hLevel});
      if (!hLevelMatch) {
        return mc.breadCrumbList.push(item);
      } else {
        idx = mc.getItemIndex(mc.breadCrumbList, item, 'hLevel');
        if (idx !== null) {
          mc.breadCrumbList.length = idx;
          return mc.breadCrumbList.push(item);
        }
      }
    } else {
      idx = mc.getItemIndex(mc.breadCrumbList, item, 'uniqueName');
      if (idx !== null) {
        return mc.breadCrumbList.length = idx+1;
      }
    }
  };

// get selected group or account
  mc.selectItem = function(item, updateBreadCrumbs, parentIndex, currentIndex) {
    mc.updateBreadCrumbs = true;
    mc.parentIndex = parentIndex;
    mc.currentIndex = currentIndex;
    if (mc.keyWord !== undefined) {
      if (mc.keyWord.length > 3) {
        mc.updateSearchItem = true;
        mc.updateSearchhierarchy(item);
      }
    }
    if (mc.breadCrumbList.length > 0) {
      if ((item.uniqueName === mc.breadCrumbList[mc.breadCrumbList.length-1].uniqueName) && (mc.parentIndex === item.hLevel)) {
        mc.updateBreadCrumbs = false;
      }
    }
    if (updateBreadCrumbs && mc.updateBreadCrumbs) {
      mc.addToBreadCrumbs(item, 'grp');
    }
    mc.selectedGrp = item;
    mc.grpCategory = item.category;
    mc.showEditTaxSection = false;
    mc.selectedGrp.oldUName = item.uniqueName;
    mc.getGroupSharedList(item);
    // mc.createNew = false
    mc.showOnUpdate = true;
    let existingGrp = _.findWhere(mc.columns, {uniqueName:item.uniqueName});
    mc.selectedItem = mc.selectedGrp;
    groupService.get($rootScope.selectedCompany.uniqueName, item.uniqueName).then(mc.getGrpDtlSuccess, mc.getGrpDtlFailure);
    if (!existingGrp) {
      if ((item.hLevel-1) < mc.columns.length) {
        mc.columns = mc.columns.splice(0,item.hLevel+1);
        return mc.columns.push(item);
      }
    } else {
      return existingGrp = item;
    }
  };

  mc.getGrpDtlSuccess = function(res) {
    mc.selectedItem = res.body;
    mc.populateAccountList(res.body);
    if (mc.parentIndex !== undefined) {
      return mc.columns.length = mc.parentIndex + 2;
    }
  };

  mc.getGrpDtlFailure = res => toastr.error(res.data.message, res.data.status);
// end

// set active item with respect to column
  mc.selectActiveItems = function(col, type, index) {
    col.active = {};
    col.active.type = type;
    col.active.index = index;
    return mc.col = col;
  };

  mc.resetActive = () =>
    _.each(mc.columns, col => delete col.active)
  ;

// add sub groups
  mc.addNewSubGroup = function() {
    // UNameExist = _.contains(mc.groupList, mc.selectedItem.uniqueName)
    let body = {
      "name": mc.selectedItem.name,
      "uniqueName": mc.selectedItem.uniqueName,
      "parentGroupUniqueName": mc.selectedGrp.uniqueName,
      "description": mc.selectedItem.description
    };
    return groupService.create($rootScope.selectedCompany.uniqueName, body).then(mc.onCreateGroupSuccess,mc.onCreateGroupFailure);
  };

  mc.onCreateGroupSuccess = function(res) {
    mc.columns[mc.addToIndex].groups.push(res.body);
    toastr.success("Sub group added successfully", "Success");
    // mc.selectedItem = {}
    // mc.getGroups()
    return mc.selectItem(mc.breadCrumbList[mc.breadCrumbList.length-1], true, mc.parentIndex, mc.currentIndex);
  };

  mc.onCreateGroupFailure = res => toastr.error(res.data.message, res.data.status);
// end



// update subgroup
  mc.updateGroup = function(form) {
    let grp = {};
    grp = _.extend(grp, mc.selectedGrp);
    grp.name = form.grpName.$viewValue;
    grp.uniqueName = form.grpUnq.$viewValue;
    grp.description = form.grpDescription.$viewValue;
    if (!mc.selectedGrp.fixed) {
      if ((mc.selectedGrp.applicableTaxes !== undefined) && (mc.selectedGrp.applicableTaxes.length > 0)) {
        mc.selectedGrp.applicableTaxes = _.pluck(mc.selectedGrp.applicableTaxes, 'uniqueName');
      }
      return groupService.update($rootScope.selectedCompany.uniqueName, grp).then(mc.onUpdateGroupSuccess,
          mc.onUpdateGroupFailure);
    }
  };

  mc.onUpdateGroupSuccess = function(res, i) {
    let updateAtIndex = null;
    mc.selectedGrp.oldUName = mc.selectedGrp.uniqueName;
    mc.selectedGrp.applicableTaxes = res.body.applicableTaxes;
    if (!_.isEmpty(mc.selectedGrp)) {
      mc.selectedItem = mc.selectedGrp;
    }
    _.each(mc.breadCrumbList, function(item,i) {
      if (item.uniqueName === mc.selectedGrp.oldUName) {
        return updateAtIndex = i;
      }
    });
    if (updateAtIndex) {
      mc.breadCrumbList[updateAtIndex] = res.body;
    }
    toastr.success("Group has been updated successfully.", "Success");
    mc.breadCrumbList.pop();
    angular.merge(mc.selectedGrp, res.body);
    mc.selectedItem = mc.breadCrumbList[mc.breadCrumbList.length-1];
    return mc.selectItem(mc.selectedGrp, true, mc.parentIndex, mc.currentIndex);
  };
    // mc.getGroups()
    // mc.selectActiveItems(mc.col.groups[i], 'grp', updateAtIndex)
    // mc.selectActiveItems(mc.selectedItem, false)

  mc.onUpdateGroupFailure = res => toastr.error(res.data.message, res.data.status);
// end


// delete groups
  mc.deleteGroup = function() {
    if (!mc.selectedGrp.isFixed) {
      return modalService.openConfirmModal({
        title: 'Delete group?',
        body: 'Are you sure you want to delete this group? All child groups will also be deleted.',
        ok: 'Yes',
        cancel: 'No'}).then(mc.deleteGroupConfirm);
    }
  };

  mc.deleteGroupConfirm = () => groupService.delete($rootScope.selectedCompany.uniqueName,mc.selectedGrp).then(mc.onDeleteGroupSuccess,mc.onDeleteGroupFailure);

  mc.onDeleteGroupSuccess = function() {
    toastr.success("Group deleted successfully.", "Success");
    mc.selectedItem = {};
    mc.showGroupDetails = false;
    mc.showAccountListDetails = false;
    mc.breadCrumbList.pop();
    // mc.getGroups()
    mc.columns[mc.parentIndex].groups.pop();
    return mc.selectItem(mc.breadCrumbList[mc.breadCrumbList.length-1], true, mc.parentIndex, mc.currentIndex);
  };

  mc.onDeleteGroupFailure = res => toastr.error(res.data.message, res.data.status);
// end


// add grp to same column
  mc.createNewGrpAccount = function(index) {
    mc.addToIndex = index;
    mc.toggleView(true);
    mc.showOnUpdate = false;
    if (mc.breadCrumbList[mc.breadCrumbList.length-1].type === 'account') {
      return mc.breadCrumbList.pop();
    }
  };

// get account details under groups and sub groups
  mc.getAccDetail = function(item, parentIndex, currentIndex) {
    mc.selectedAcc = item;
    mc.showOnUpdate = true;
    mc.showDeleteMove = false;
    mc.getCurrentColIndex = parentIndex;
    mc.currentAccIndex = currentIndex;
    item.hLevel = mc.getCurrentColIndex;
    let reqParam = {
      compUname: $rootScope.selectedCompany.uniqueName,
      acntUname: item.uniqueName
    };
    accountService.get(reqParam).then(mc.getAccDtlSuccess, mc.getAccDtlFailure);
    if (mc.updateBreadCrumbs) {
      return mc.addToBreadCrumbs(item, 'account', parentIndex);
    }
  };

  mc.getAccDtlSuccess = function(res, data) {
    data = res.body;
    mc.selectedAcc = res.body;
    mc.getMergeAcc = mc.selectedAcc.mergedAccounts.replace(RegExp(' ', 'g'), '');
    if (mc.getMergeAcc.indexOf(',') !== -1) {
      mc.getMergeAcc = mc.getMergeAcc.split(",");
    } else if (mc.selectedAcc.mergedAccounts.length > 1) {
      mc.getMergeAcc = [mc.selectedAcc.mergedAccounts];
    }
    mc.AccountCategory = mc.getAccountCategory(data.parentGroups);
    mc.getMergedAccounts(data);
    if (data.uniqueName === $rootScope.selAcntUname) {
      mc.cantUpdate = true;
    }
    _.extend(mc.selAcntPrevObj, data);
    _.extend(mc.selectedAcc, data);
    // mc.breakMobNo(data)
    mc.setOpeningBalanceDate();
    mc.getAccountSharedList();
    mc.isFixedAcc = res.body.isFixed;
    mc.showBreadCrumbs(data.parentGroups);
    mc.selectedAcc = res.body;
    return mc.columns.length = mc.getCurrentColIndex+1;
  };

  mc.getAccDtlFailure = res => toastr.error(res.data.message, res.data.status);
// end

// show create new div
  mc.toggleView = function() {
    mc.createNew = true;
    mc.selectedItem = {};
    return mc.selectedAcc = {};
  };
// end

// get tax list
  mc.getTaxList = () => companyServices.getTax($rootScope.selectedCompany.uniqueName).then(mc.getTaxSuccess, mc.getTaxFailure);

  mc.getTaxSuccess = res => mc.taxList = res.body;

  mc.getTaxFailure = res => toastr.error(res.data.message);
// end

// getTaxHierarchy on edit button
  mc.getTaxHierarchy = function(type) {
    mc.getTaxList();
    if (type === 'group') {
      return groupService.getTaxHierarchy($rootScope.selectedCompany.uniqueName,mc.selectedGrp.uniqueName).then(mc.getTaxHierarchyOnSuccess,mc.getTaxHierarchyOnFailure);
    } else if (type === 'account') {
      return accountService.getTaxHierarchy($rootScope.selectedCompany.uniqueName, mc.selectedAcc.uniqueName).then(mc.getTaxHierarchyOnSuccess,mc.getTaxHierarchyOnFailure);
    }
  };

  mc.getTaxHierarchyOnSuccess = function(res) {
    mc.taxHierarchy = res.body;
    mc.selectedTax.taxes = mc.taxHierarchy.applicableTaxes;
    mc.showEditTaxSection = true;
    mc.allInheritedTaxes = [];
    return mc.createInheritedTaxList(mc.taxHierarchy.inheritedTaxes);
  };

  mc.getTaxHierarchyOnFailure = res => toastr.error(res.data.message);

// end


  mc.createInheritedTaxList = function(inTaxList) {
//get all taxes by uniqueName
    mc.inTaxUnq = [];
    _.each(inTaxList, tax =>
      _.each(tax.applicableTaxes, inTax => mc.inTaxUnq.push(inTax.uniqueName))
    );
    mc.inTaxUnq = _.uniq(mc.inTaxUnq);

    // match groups with tax uniqueNames
    return _.each(mc.inTaxUnq, function(unq) {
      let tax = {};
      tax.uniqueName = unq;
      tax.groups = [];
      _.each(inTaxList, inTax =>
        _.each(mc.inTax.applicableTaxes, function(inAppTax) {
          if (tax.uniqueName === inAppTax.uniqueName) {
            let grp = {};
            grp.name = inTax.name;
            grp.uniqueName = inTax.uniqueName;
            tax.name = inAppTax.name;
            return tax.groups.push(grp);
          }
        })
      );
      return mc.allInheritedTaxes.push(tax);
    });
  };


  mc.isAccount = false;
  mc.assignTax = dataToSend => companyServices.assignTax($rootScope.selectedCompany.uniqueName,dataToSend).then(mc.assignTaxOnSuccess,mc.assignTaxOnFailure);

  mc.assignTaxOnSuccess = function(res) {
    mc.showEditTaxSection = false;
    toastr.success(res.body);
    if (!mc.isAccount) {
      return groupService.get($rootScope.selectedCompany.uniqueName, mc.selectedGrp.uniqueName).then(mc.getGrpDtlSuccess,
          mc.getGrpDtlFailure);
    } else {
      let reqParams = {
        compUname: $rootScope.selectedCompany.uniqueName,
        acntUname: mc.selectedAcc.uniqueName
      };
      return accountService.get(reqParams).then(mc.getAccDtlSuccess, mc.getAccDtlFailure);
    }
  };



  mc.assignTaxOnFailure = function(res) {
    mc.showEditTaxSection = false;
    return toastr.error(res.data.message);
  };

  mc.applyTax = function(type) {
    if (_.isEmpty(type)) {
      return toastr.warning("Please do not mess with html.");
    } else {
      // We have to send all the taxes
      mc.mergeTaxes = [];
      mc.mergeTaxes.push(mc.taxHierarchy.applicableTaxes);
      mc.mergeTaxes.push(_.pluck(mc.taxHierarchy.inheritedTaxes, 'applicableTaxes'));
      mc.sendThisList = _.pluck(_.flatten(mc.mergeTaxes),'uniqueName');
      mc.getSendTax = mc.sendThisList;
      let data = {};
      if (type === 'group') {
        data = [{"uniqueName":mc.selectedGrp.uniqueName, "taxes":mc.sendThisList,"isAccount":false}];
        mc.isAccount = false;
      } else if (type === 'account') {
        data = [{"uniqueName":mc.selectedAcc.uniqueName, "taxes":mc.sendThisList,"isAccount":true}];
        mc.isAccount = true;
      }
      return mc.assignTax(data);
    }
  };

  // fetch taxes
  mc.alreadyAppliedTaxes = function(tax) {
    let condition;
    mc.inheritTax = _.pluck(mc.taxHierarchy.inheritedTaxes,'applicableTaxes');
    mc.applicableTaxes = _.flatten(mc.taxHierarchy);
    mc.applicableTaxes.push(mc.inheritTax);
    let checkInThis = _.pluck(_.flatten(mc.applicableTaxes),'uniqueName');
    return condition = _.contains(checkInThis, tax.uniqueName);
  };
//end

// move group
  mc.moveGroup = function(group) {
    if (_.isUndefined(group.uniqueName)) {
      toastr.error("Select group only from list", "Error");
      return;
    }

    let unqNamesObj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      selGrpUname: mc.selectedItem.uniqueName
    };
    let body = {
      "parentGroupUniqueName": group.uniqueName
    };
    return groupService.move(unqNamesObj, body).then(mc.onMoveGroupSuccess, mc.onMoveGroupFailure);
  };

  mc.onMoveGroupSuccess = function(res) {
    mc.moveto = undefined;
    toastr.success("Group moved successfully.", "Success");
    mc.breadCrumbList.pop();
    mc.getGroups();
    mc.columns[mc.parentIndex].groups.pop();
    mc.selectItem(mc.breadCrumbList[mc.breadCrumbList.length-1], true, mc.parentIndex, mc.currentIndex);
    return mc.selectedItem = mc.breadCrumbList[mc.breadCrumbList.length-1];
  };

  mc.onMoveGroupFailure = res => toastr.error(res.data.message, res.data.status);



// share group
  mc.shareGrpModal = () =>
    $uibModal.open({
      templateUrl: '/public/webapp/NewManageGroupsAndAccounts/shareGroup.html',
      size: "md",
      backdrop: 'true',
      animation: true,
      scope: $scope
    })
  ;

  mc.shareGroup = function() {
    let unqNamesObj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      selGrpUname: mc.selectedGrp.uniqueName
    };
    return groupService.share(unqNamesObj, mc.shareGroupObj).then(mc.onShareGroupSuccess, mc.onShareGroupFailure);
  };

  mc.onShareGroupSuccess = function(res) {
    mc.shareGroupObj = {
      role: "view_only",
      user: ""
    };
    toastr.success(res.body, res.status);
    mc.getGroupSharedList(mc.selectedGrp);
    return mc.shareGroupObj.user = '';
  };

  mc.onShareGroupFailure = res => toastr.error(res.data.message, res.data.status);


// get Shared Group List
  mc.getGroupSharedList = function() {
    // if $scope.canShare
    let unqNamesObj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      selGrpUname: mc.selectedGrp.uniqueName
    };
    return groupService.sharedList(unqNamesObj).then(mc.onsharedListSuccess, mc.onsharedListFailure);
  };

  mc.onsharedListSuccess = res => mc.groupSharedUserList = res.body;

  mc.onsharedListFailure = res => toastr.error(res.data.message, res.data.status);


  //unShare group with user
  mc.unShareGroup = function(user) {
    let unqNamesObj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      selGrpUname: mc.selectedGrp.uniqueName
    };
    let data = {
      user
    };
    return groupService.unshare(unqNamesObj, data).then(mc.unShareGroupSuccess, mc.unShareGroupFailure);
  };

  mc.unShareGroupSuccess = function(res){
    toastr.success(res.body, res.status);
    mc.getGroupSharedList(mc.selectedGrp);
    return mc.shareGroupObj.user = "";
  };

  mc.unShareGroupFailure = res=> toastr.error(res.data.message, res.data.status);



// add Account

  mc.getAccountCategory = function(parentGroups) {
    let pg = parentGroups[0]['uniqueName'];
    let grp = _.findWhere($rootScope.flatGroupsList, {uniqueName:pg});
    return grp.category;
  };



  // prepare date object
  mc.setOpeningBalanceDate = function() {
    if (mc.selectedAcc.openingBalanceDate) {
      let newDateObj = mc.selectedAcc.openingBalanceDate.split("-");
      return mc.datePicker.accountOpeningBalanceDate = new Date(newDateObj[2], newDateObj[1] - 1, newDateObj[0]);
    } else {
      return mc.datePicker.accountOpeningBalanceDate = new Date();
    }
  };



  mc.setAdditionalAccountDetails = function(){
    let unqNamesObj;
    mc.selectedAcc.openingBalanceDate = $filter('date')(mc.datePicker.accountOpeningBalanceDate,"dd-MM-yyyy");
    if(_.isUndefined(mc.selectedAcc.mobileNo) || _.isEmpty(mc.selectedAcc.mobileNo)) {
      mc.selectedAcc.mobileNo = "";
    }
    if(_.isUndefined(mc.selectedAcc.email) || _.isEmpty(mc.selectedAcc.email)) {
      mc.selectedAcc.email = "";
    }
    return unqNamesObj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      selGrpUname: mc.selectedGrp.uniqueName,
      acntUname: mc.selectedAcc.uniqueName
    };
  };




  mc.addAccount = function() {
    let unqNamesObj = mc.setAdditionalAccountDetails();
    return accountService.createAc(unqNamesObj, mc.selectedAcc).then(mc.addAccountSuccess, mc.addAccountFailure);
  };
    // mc.breadCrumbList = undefined

  mc.addAccountSuccess = function(res) {
    toastr.success("Account created successfully", res.status);
    mc.selectedAcc = {};
    let abc = _.pick(res.body, 'name', 'uniqueName', 'mergedAccounts','applicableTaxes','parentGroups');
    mc.groupAccntList.push(abc);
    mc.columns[mc.addToIndex].accounts.push(res.body);
    return $rootScope.getFlatAccountList($rootScope.selectedCompany.uniqueName);
  };
    // mc.columns = []
    // mc.getGroups()

  mc.addAccountFailure = res => toastr.error(res.data.message, res.data.status);


  mc.updateAccount = function() {
    let unqNamesObj = mc.setAdditionalAccountDetails();
    if (angular.equals(mc.selectedAcc, mc.selAcntPrevObj)) {
      toastr.info("Nothing to update", "Info");
      return false;
    }

    if (mc.selectedAcc.openingBalanceType === null) {
      mc.selectedAcc.openingBalanceType = 'credit';
    }

    if (mc.selectedAcc.uniqueName !== mc.selAcntPrevObj.uniqueName) {
      unqNamesObj.acntUname = mc.selAcntPrevObj.uniqueName;
    }

    if (_.isEmpty(mc.selectedGrp)) {
      let lastVal = _.last(mc.selectedAcc.parentGroups);
      unqNamesObj.selGrpUname = lastVal.uniqueName;
    }

    if (mc.selectedAcc.applicableTaxes.length > 0) {
      mc.selectedAcc.applicableTaxes = _.pluck(mc.selectedAcc.applicableTaxes,'uniqueName');
    }

    return accountService.updateAc(unqNamesObj, mc.selectedAcc).then(mc.updateAccountSuccess,
        mc.updateAccountFailure);
  };


  mc.updateAccountSuccess = function(res) {
    let updateAtIndex = null;
    toastr.success("Account updated successfully", res.status);
    angular.merge(mc.selectedAcc, res.body);
    let abc = _.pick(mc.selectedAcc, 'name', 'uniqueName', 'mergedAccounts');
    if (!_.isEmpty(mc.selectedGrp)) {
      _.find(mc.groupAccntList, function(item, index) {
        if (item.uniqueName === mc.selAcntPrevObj.uniqueName) {
          return angular.merge(mc.groupAccntList[index], abc);
        }
      });
    }
    _.each(mc.breadCrumbList, function(item,i) {
      if (item.uniqueName === mc.selectedAcc.uniqueName) {
        return updateAtIndex = i;
      }
    });
    if (updateAtIndex) {
      mc.breadCrumbList[updateAtIndex] = res.body;
    }
    // end if
    mc.breadCrumbList.pop();
    angular.merge(mc.selAcntPrevObj, res.body);
    mc.columns[mc.columns.length-1].accounts.splice(mc.currentAccIndex, 1, res.body);
    return mc.getAccDetail(mc.selectedAcc, mc.getCurrentColIndex, mc.currentAccIndex);
  };

  mc.updateAccountFailure = res => toastr.error(res.data.message, res.data.status);


  mc.deleteAccount = function() {
    if ($scope.canDelete) {
      return modalService.openConfirmModal({
        title: 'Delete Account?',
        body: 'Are you sure you want to delete this Account?',
        ok: 'Yes',
        cancel: 'No'}).then(mc.deleteAccountConfirm);
    }
  };

  mc.deleteAccountConfirm = function() {
    let unqNamesObj = mc.setAdditionalAccountDetails();
    if (mc.selectedAcc.uniqueName !== mc.selAcntPrevObj.uniqueName) {
      unqNamesObj.acntUname = mc.selAcntPrevObj.uniqueName;
    }
    if (_.isEmpty(mc.selectedGrp)) {
      unqNamesObj.selGrpUname = mc.selectedAcc.parentGroups[0].uniqueName;
    }
    return accountService.deleteAc(unqNamesObj, mc.selectedAcc).then(mc.moveAccntSuccess, mc.onDeleteAccountFailure);
  };

  mc.onDeleteAccountFailure = res => toastr.error(res.data.message, res.data.status);

  mc.isCurrentGroup =group => (group.uniqueName === mc.selectedAcc.parentGroups[0].uniqueName) || (group.uniqueName === mc.selectedAcc.parentGroups[mc.selectedAcc.parentGroups.length-1].uniqueName);

  mc.isCurrentAccount =acnt => acnt.uniqueName === mc.selectedAcc.uniqueName;


  mc.moveAccnt = function(group) {
    if (_.isUndefined(group.uniqueName)) {
      toastr.error("Select group only from list", "Error");
      return;
    }
    let unqNamesObj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      selGrpUname: mc.selectedGrp.uniqueName,
      acntUname: mc.selectedAcc.uniqueName
    };
    if (_.isUndefined(mc.selectedGrp.uniqueName)) {
      let lastVal = _.last(mc.selectedAcc.parentGroups);
      unqNamesObj.selGrpUname = lastVal.uniqueName;
    }

    let body = {
      "uniqueName": group.uniqueName
    };
    return accountService.move(unqNamesObj, body).then(mc.moveAccntSuccess, mc.moveAccntFailure);
  };


  mc.moveAccntSuccess = function(res) {
    mc.showOnUpdate = false;
    toastr.success(res.body, res.status);
    $rootScope.getFlatAccountList($rootScope.selectedCompany.uniqueName);
    mc.showAccountDetails = false;
    if (!_.isEmpty(mc.selectedGrp)) {
      mc.groupAccntList = _.reject(mc.groupAccntList, item => item.uniqueName === mc.selectedAcc.uniqueName);
    }
    mc.selAcntPrevObj = {};
    mc.moveacto = '';
    mc.getSelectedType('grp');
    mc.breadCrumbList.pop();
    mc.getGroups();
    return mc.selectItem(mc.breadCrumbList[mc.breadCrumbList.length-1], true, mc.parentIndex, mc.currentIndex);
  };


  mc.moveAccntFailure = res => toastr.error(res.data.message, res.data.status);



 //########################### for merge/unmerge accounts ############################


  //----------for merge account refresh----------#
  mc.mergeAccList = [];
  mc.refreshFlatAccount = function(str) {
    this.success = function(res) {
      mc.mergeAccList = res.body.results;
      return mc.mergeAccList = _.reject(mc.mergeAccList, item => item.isFixed === true);
    };
    this.failure = res => toastr.error(res.data.message);
    let reqParam = {
      companyUniqueName: $rootScope.selectedCompany.uniqueName,
      q: str,
      page: 1,
      count: 0
    };
    if (str.length > 1) {
      if (!isElectron) {
        return groupService.getFlatAccList(reqParam).then(this.success, this.failure);
      } else {
          return groupService.getFlatAccListElectron(reqParam).then(this.success, this.failure);
      }
    }
  };

  mc.toMerge = {
    mergeTo:'',
    mergedAcc: [],
    toUnMerge : {
      name: '',
      uniqueNames: [],
      moveTo: ''
    },
    moveToAcc: ''
  };

  mc.getMergedAccounts = function(accData) {
    $rootScope.fltAccntListPaginated;
    let accToRemove = {
      uniqueName: accData.uniqueName
    };
    mc.AccountsList = _.without(mc.AccountsList, _.findWhere(mc.AccountsList, accToRemove));
    mc.toMerge.mergeTo = accData.uniqueName;
    mc.mergedAcc = accData.mergedAccounts;
    mc.mList = [];
    if (!_.isEmpty(mc.mergedAcc) && !_.isUndefined(mc.mergedAcc)) {
      mc.mList = mc.mergedAcc.split(',');
      return _.each(mc.mList, function(mAcc) {
        let mObj = {
          uniqueName: '',
          noRemove : true
        };
        mObj.uniqueName = mAcc;
        return mc.prePopulate.push(mObj);
      });
      // mc.toMerge.mergedAcc = mc.prePopulate
    } else {
      mc.prePopulate = [];
      return mc.toMerge.mergedAcc = [];
    }
  };


 //merge account
  mc.mergeAccounts = function() {
    mc.accToMerge = [];
    let withoutMerged = [];
    let unqNamesObj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      acntUname: mc.toMerge.mergeTo
    };
    mc.accToMerge = mc.toMerge.mergedAcc;
    if (mc.accToMerge.length > 0) {
      accountService.merge(unqNamesObj, mc.accToMerge).then( mc.mergeSuccess, mc.mergeFailure);
      return _.each(mc.accToMerge, function(acc) {
        mc.removeMerged = {
          uniqueName: acc.uniqueName
        };
        return mc.AccountsList = _.without(mc.AccountsList, _.findWhere(mc.AccountsList, mc.removeMerged));
      });
    } else {
      return toastr.error("Please select at least one account.");
    }
  };


  mc.mergeSuccess = function(res) {
    mc.toMerge.mergedAcc = [];
    toastr.success(res.body);
    _.each(mc.toMerge.mergedAcc, function(acc) {
      $rootScope.removeAccountFromPaginatedList(acc);
      return acc.noRemove = true;
    });
    // mc.getGroups()
    mc.prePopulate = mc.toMerge.mergedAcc;
    $rootScope.getFlatAccountList($rootScope.selectedCompany.uniqueName);
    return mc.getAccDetail(mc.selectedAcc, mc.getCurrentColIndex);
  };

  mc.mergeFailure = res => toastr.error(res.data.message);


// ############################################### DELETE MERGE ACCOUNT PENDING ################################################
  mc.deleteMergedAccount = function(item) {
    mc.toMerge.toUnMerge.uniqueNames = item;
    mc.toMerge.toUnMerge.moveTo = null;
    modalService.openConfirmModal({
      title: 'Delete Merged Account',
      body: `Are you sure you want to delete ${mc.toMerge.toUnMerge.uniqueNames} ?`,
      ok: 'Yes',
      cancel: 'No'}).then(
        () => mc.deleteMergedAccountConfirm(mc.toMerge.toUnMerge.uniqueNames));
    return 0;
  };

  mc.deleteMergedAccountConfirm = function(unqname) {
    let unqNamesObj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      acntUname: mc.toMerge.mergeTo
    };
    let accTosend = {
      "uniqueNames": []
    };
    if (mc.toMerge.toUnMerge.uniqueNames.length !== 0) {
      accTosend.uniqueNames.push(unqname);
      accountService.unMergeDelete(unqNamesObj, accTosend).then(mc.deleteMergedAccountSuccess, mc.deleteMergedAccountFailure);
      return _.each(accTosend.uniqueNames, function(accUnq) {
        let removeFromPrePopulate = {
          uniqueName: accUnq
        };
        return mc.prePopulate = _.without(mc.prePopulate, _.findWhere(mc.prePopulate, removeFromPrePopulate));
      });
    } else {
      return toastr.error('Please Select an Account to delete');
    }
  };

  mc.deleteMergedAccountSuccess = function(res) {
    toastr.success(res.body);
    let updatedMergedAccList = [];
    _.each(mc.toMerge.mergedAcc, function(obj) {
      let toRemove = {};
      if (obj.uniqueName !== mc.toMerge.toUnMerge.uniqueNames) {
        toRemove = obj;
        toRemove.noRemove = false;
        if (!obj.hasOwnProperty('mergedAccounts')) {
          toRemove.noRemove = true;
        }
        return updatedMergedAccList.push(toRemove);
      }
    });
    mc.toMerge.mergedAcc = updatedMergedAccList;
    mc.toMerge.toUnMerge.uniqueNames = '';
    mc.toMerge.moveToAcc = '';
    return mc.getAccDetail(mc.selectedAcc, mc.getCurrentColIndex);
  };



  mc.deleteMergedAccountFailure = res => toastr.error(res.data.message);
// ############################################### DELETE MERGE ACCOUNT PENDING ################################################

  //delete account
  mc.unmerge = function(item) {
    item = item.replace(RegExp(' ', 'g'), '');
    mc.toMerge.toUnMerge.uniqueNames = item;
    return mc.showDeleteMove = true;
  };

  mc.moveToAccount = () =>
    modalService.openConfirmModal({
      title: 'Delete Merged Account',
      body: `Are you sure you want to move ${mc.toMerge.toUnMerge.uniqueNames} to ${mc.toMerge.moveToAcc.uniqueName}`,
      ok: 'Yes',
      cancel: 'No'}).then(mc.moveToAccountConfirm)
  ;

  mc.moveToAccountConfirm = function() {
    let unqNamesObj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      acntUname: mc.toMerge.moveToAcc.uniqueName
    };
    let accTosend = {
      uniqueName: mc.toMerge.toUnMerge.uniqueNames
    };
    if (mc.toMerge.toUnMerge.uniqueNames.length !== 0) {
      accountService.merge(unqNamesObj, [accTosend]).then(mc.moveToAccountConfirmSuccess, mc.moveToAccountConfirmFailure);
      return _.each(mc.accToSendArray, function(accUnq) {
        let removeFromPrePopulate = {
          uniqueName: accUnq
        };
        return mc.prePopulate = _.without(mc.prePopulate, _.findWhere(mc.prePopulate, removeFromPrePopulate.uniqueName));
      });
    } else {
      return toastr.error('Please Select an account to move.');
    }
  };

  mc.moveToAccountConfirmSuccess = function(res) {
    toastr.success(res.body);
    mc.updatedMergedAccList = [];
    _.each(mc.toMerge.mergedAcc, function(obj) {
      let toRemove = {};
      if (obj.uniqueName !== mc.toMerge.toUnMerge.uniqueNames) {
        toRemove = obj;
        toRemove.noRemove = false;
        if (!obj.hasOwnProperty('mergedAccounts')) {
          toRemove.noRemove = true;
        }
        return mc.updatedMergedAccList.push(toRemove);
      }
    });
    mc.toMerge.mergedAcc = mc.updatedMergedAccList;
    mc.toMerge.toUnMerge.uniqueNames = '';
    mc.toMerge.moveToAcc = '';
    return mc.getAccDetail(mc.selectedAcc, mc.getCurrentColIndex);
  };

  mc.moveToAccountConfirmFailure = res => toastr.error(res.data.message);


  mc.shareAccModal = () =>
    $uibModal.open({
      templateUrl: '/public/webapp/NewManageGroupsAndAccounts/shareacc.html',
      size: "md",
      backdrop: 'true',
      animation: true,
      scope: $scope
    })
  ;


  mc.shareAccount = function() {
    let unqNamesObj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      selGrpUname: mc.selectedGrp.uniqueName,
      acntUname: mc.selectedAcc.uniqueName
    };
    if (_.isEmpty(mc.selectedGroup)) {
      unqNamesObj.selGrpUname = mc.selectedAcc.parentGroups[0].uniqueName;
    }

    return accountService.share(unqNamesObj, mc.shareAccountObj).then(mc.onShareAccountSuccess, mc.onShareAccountFailure);
  };

  mc.onShareAccountSuccess = function(res) {
    mc.shareAccountObj.user = "";
    toastr.success(res.body, res.status);
    return mc.getAccountSharedList();
  };

  mc.onShareAccountFailure = res => toastr.error(res.data.message, res.data.status);


  mc.unShareAccount = function(user) {
    let unqNamesObj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      selGrpUname: mc.selectedGrp.uniqueName,
      acntUname: mc.selectedAcc.uniqueName
    };
    if (_.isEmpty(mc.selectedGrp)) {
      unqNamesObj.selGrpUname = mc.selectedAcc.parentGroups[0].uniqueName;
    }

    let data = { user};
    return accountService.unshare(unqNamesObj, data).then(mc.unShareAccountSuccess, mc.unShareAccountFailure);
  };

  mc.unShareAccountSuccess = function(res){
    toastr.success(res.body, res.status);
    return mc.getAccountSharedList();
  };

  mc.unShareAccountFailure = res=> toastr.error(res.data.message, res.data.status);

  mc.getAccountSharedList = function() {
    if ($scope.canShare) {
      let unqNamesObj = {
        compUname: $rootScope.selectedCompany.uniqueName,
        selGrpUname: mc.selectedAcc.parentGroups[0].uniqueName,
        acntUname: mc.selectedAcc.uniqueName
      };
      return accountService.sharedWith(unqNamesObj).then(mc.onGetAccountSharedListSuccess, mc.onGetAccountSharedListSuccess);
    }
  };

  mc.onGetAccountSharedListSuccess = res => mc.accountSharedUserList = res.body;

  mc.onGetAccountSharedListFailure = res => toastr.error(res.data.message, res.data.status);


// search accounts & groups
  mc.searchQuery = function(str) {
    let reqParam = {};
    reqParam.companyUniqueName = $rootScope.selectedCompany.uniqueName;
    reqParam.query = str;
    if (str.length < 3) {
      mc.breadCrumbList = [];
      return mc.getGroups();
    } else if (str.length > 2) {
      mc.searchLoad = true;
      mc.columns = [];
      return groupService.searchGroupsWithAccountsCropped(reqParam).then(mc.getSearchResultSuccess, mc.getSearchResultFailure);
    }
  };

  mc.getSearchResultSuccess = function(res) {
    mc.searchLoad = false;
    // mc.updateBreadCrumbs = false
    // toastr.success(res.status)
    return mc.pushSearchResultLevel1(res.body);
  };

  mc.getSearchResultFailure = () => toastr.error(res.data.message, res.data.status);


  mc.pushSearchResultLevel1 = function(data) {
    data = mc.addHLevel(data, 0);
    let col = {};
    col.groups = [];
    col.accounts = [];
    _.each(data, function(grp) {
      col.groups.push(grp);
      if (grp.groups.length > 0) {
        return mc.pushSearchResultChildLevel(grp.groups);
      }
    });
    return mc.columns.unshift(col);
  };

  mc.pushSearchResultChildLevel = function(groups) {
    let childCol = {};
    childCol.groups = [];
    childCol.accounts = [];
    _.each(groups, function(grp) {
      if (grp.accounts.length > 0) {
        _.each(grp.accounts, acc => childCol.accounts.push(acc));
      }
      if (grp.groups.length > 0) {
        return _.each(grp.groups, function(grp) {
          childCol.groups.push(grp);
          if (grp.accounts.length > 0) {
            return _.each(grp.accounts, acc => childCol.accounts.push(acc));
          }
        });
      }
    });
    return mc.columns.push(childCol);
  };

  mc.resetSearch = function() {
    mc.searchQuery('');
    mc.keyWord = '';
    mc.breadCrumbList = [];
    return mc.getGroups();
  };

  mc.updateSearchhierarchy = function(data) {
    let currentItem = _.findWhere($rootScope.flatGroupsList, {uniqueName:data.uniqueName});
    mc.breadCrumbList = currentItem.parentGroups;
    mc.updateBreadCrumbs = false;
    return mc.columns = mc.columns.splice(0,mc.parentIndex+1);
  };

// end

  return mc;
};

//init angular app
giddh.webApp.controller('manageController', manageController);