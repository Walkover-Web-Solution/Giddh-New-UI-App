let proformaController = function($scope, $rootScope, localStorageService,invoiceService,settingsService ,$timeout, toastr, $filter, $uibModal,accountService, groupService, $state, companyServices,FileSaver,modalService) {
  if (_.isUndefined($rootScope.selectedCompany)) {
    $rootScope.selectedCompany = localStorageService.get('_selectedCompany');
  }
  $rootScope.cmpViewShow = true;
  $scope.showSubMenus = false;
  $scope.format = "dd-MM-yyyy";
  $scope.today = new Date();
  let d = moment(new Date()).subtract(1, 'month');
  $scope.fromDatePickerIsOpen = false;
  $scope.toDatePickerIsOpen = false;
  $scope.dueDatePickerIsOpen = false;
  $scope.fromDatePickerOpen = function() {
    return this.fromDatePickerIsOpen = true;
  };
  $scope.toDatePickerOpen = function() {
    return this.toDatePickerIsOpen = true;
  };
  $scope.dueDatePickerOpen = function() {
    return this.dueDatePickerIsOpen = true;
  };
  // end of date picker
  $scope.showFilters = false;
  $scope.proformaList = [];
  $scope.pTemplateList = [];
  $scope.sundryDebtors = [];
  let pc = this;
  $scope.count = {};
  $scope.count.set = [10,15,30,35,40,45,50];
  $scope.count.val = $scope.count.set[0];
  $scope.editStatus = false;
  $scope.subtotal = 0;
  $scope.selectedTemplate = null;
  $scope.editMode = false;
  $scope.addressList = '';
  $scope.disableCreate = true;
  $scope.enableCreate = true;
  $scope.discount = {};
  $scope.discount.amount = 0;
  $scope.discount.accounts = [];
  $scope.discountTotal = 0;
  $scope.grandTotal = 0;
  //# Get all Proforma ##
  $scope.gettingProformaInProgress = false;
  $scope.popOver = {
    content: 'Hello, World!',
    templateUrl: 'proformaDropdown.html',
    title: 'Title'
  };
  $scope.getAllProforma = function() {
    this.success = function(res) {
      $scope.gettingProformaInProgress = false;
      $scope.proformaList = res.body;
      if (res.body.results.length < 1) {
        return $scope.showFilters = true;
      }
    };

    this.failure = function(res) {
      $scope.gettingProformaInProgress = false;
      return toastr.error(res.data.message);
    };

    if ($scope.gettingProformaInProgress) {
      return;
    } else {
      $scope.gettingProformaInProgress = true;
      let reqParam = {};
      reqParam.companyUniqueName = $rootScope.selectedCompany.uniqueName;
      reqParam.date1 = $filter('date')($scope.filters.fromDate, 'dd-MM-yyyy');
      reqParam.date2 = $filter('date')($scope.filters.toDate, 'dd-MM-yyyy');
      reqParam.count = $scope.count.val;
      reqParam.page = $scope.count.page;
      return invoiceService.getAllProforma(reqParam).then(this.success, this.failure);
    }
  };

  //# proforma filters ##
  $scope.balanceStatuses = ['All', 'paid','unpaid', 'partial-paid', 'hold', 'partial'];
  $scope.balanceStatusOptions = ['paid','unpaid', 'hold', 'cancel'];
  $scope.filters = {
      "balanceStatus":$scope.balanceStatuses[0],
      "accountUniqueName": '',
      "balanceDue":null,
      "proformaNumber":"",
      "balanceEqual": false,
      "balanceMoreThan": false,
      "balanceLessThan": false,
      "dueDate": null,
      "fromDate":$filter('date')(d._d, 'dd-MM-yyyy'),
      "toDate":$filter('date')($scope.today, 'dd-MM-yyyy'),
      "dueDateEqual": true,
      "dueDateAfter": false,
      "dueDateBefore": true,
      "attentionTo":"",
      "groupUniqueName":"",
      "total" : null,
      "totalMoreThan":false,
      "totalLessThan":false,
      "totalEqual": true
    };

  pc.filterModel = function() {
    return this.model = {
      "balanceStatus":$scope.balanceStatuses[0],
      "accountUniqueName": '',
      "balanceDue":null,
      "proformaNumber":"",
      "balanceEqual": false,
      "balanceMoreThan": false,
      "balanceLessThan": false,
      "dueDate": null,
      "fromDate":$filter('date')(d._d, 'dd-MM-yyyy'),
      "toDate":$filter('date')($scope.today, 'dd-MM-yyyy'),
      "dueDateEqual": true,
      "dueDateAfter": false,
      "dueDateBefore": true,
      "attentionTo":"",
      "groupUniqueName":"",
      "total" : null,
      "totalMoreThan":false,
      "totalLessThan":false,
      "totalEqual": true
    };
  };

  pc.getAllProformaByFilter = function(data) {
    this.success = function(res) {
        $scope.proformaList = res.body;
        return $scope.filters.balanceStatus = pc.prevBalanceStatus;
      };
    this.failure = function(res) {
        $scope.filters.balanceStatus = pc.prevBalanceStatus;
        return toastr.error(res.data.message);
      };
    return invoiceService.getAllProformaByFilter($rootScope.selectedCompany.uniqueName, data).then(this.success, this.failure);
  };

  $scope.resetFilters = () => $scope.filters = new pc.filterModel();

  $scope.applyFilters = function() {
    $scope.filters.page = $scope.proformaList.page || 1;
    $scope.filters.count = $scope.count.val;
    pc.prevBalanceStatus = $scope.filters.balanceStatus;
    if (($scope.filters.accountUniqueName !== undefined) && ($scope.filters.accountUniqueName !== '')) {
      $scope.filters.accountUniqueName = $scope.filters.accountUniqueName.name;
    }
    if (($scope.filters.groupUniqueName !== undefined) && ($scope.filters.groupUniqueName !== '')) {
      $scope.filters.groupUniqueName = $scope.filters.groupUniqueName.name;
    }
    if ($scope.filters.balanceStatus.length > 0) {
        if ($scope.filters.balanceStatus === 'All') {
          $scope.filters.balanceStatus = [];
        } else {
          $scope.filters.balanceStatus = [$scope.filters.balanceStatus];
        }
      }

    if ($scope.filters.balanceText !== undefined) {
      if ($scope.filters.balanceText === "Equal To") {
        $scope.filters.balanceEqual = true;
        $scope.filters.balanceMoreThan = false;
        $scope.filters.balanceLessThan = false;
      } else if ($scope.filters.balanceText === "Less Than") {
        $scope.filters.balanceEqual = false;
        $scope.filters.balanceMoreThan = false;
        $scope.filters.balanceLessThan = true;
      } else if ($scope.filters.balanceText === "Greater Than") {
        $scope.filters.balanceEqual = false;
        $scope.filters.balanceMoreThan = true;
        $scope.filters.balanceLessThan = false;
      } else if ($scope.filters.balanceText === "Greater Than and Equal To") {
        $scope.filters.balanceEqual = true;
        $scope.filters.balanceMoreThan = true;
        $scope.filters.balanceLessThan = false;
      } else if ($scope.filters.balanceText === "Less Than and Equal To") {
        $scope.filters.balanceEqual = true;
        $scope.filters.balanceMoreThan = false;
        $scope.filters.balanceLessThan = true;
      }
    }
    $scope.filters.fromDate = $filter('date')($scope.filters.fromDate, 'dd-MM-yyyy');
    $scope.filters.toDate = $filter('date')($scope.filters.toDate, 'dd-MM-yyyy');
    $scope.filters.dueDate = $filter('date')($scope.filters.dueDate, 'dd-MM-yyyy');
    return pc.getAllProformaByFilter($scope.filters);
  };

  $scope.loadProforma = function(proforma) {
    $scope.editMode = false;
    $scope.currentProforma = proforma;
    this.success = function(res) {
      // res.body.template.htmlData = JSON.parse(res.body.template.htmlData)
      // $scope.htmlData = res.body.template.htmlData
      pc.templateVariables = res.body.template.templateVariables;
      pc.selectedAccountDetails = res.body.account;
      // selectedAccount = _.findWhere(pc.templateVariables, {key:"$accountUniqueName"})
      // if selectedAccount
      //   account = {}
      //   account.uniqueName = selectedAccount.value
      //   $scope.setSelectedAccount(account)
      pc.htmlData = JSON.parse(res.body.template.htmlData);
      pc.sectionData = res.body.template.sections;
      pc.checkEditableFields(pc.htmlData.sections);
      $scope.htmlData = pc.htmlData;
      $scope.transactions = res.body.entries;
      $scope.subtotal = res.body.subTotal;
      $scope.taxTotal = res.body.taxTotal;
      $scope.taxes = res.body.taxes;
      $scope.grandTotal = res.body.grandTotal;
      $scope.discountTotal = res.body.discountTotal || 0;
      if (res.body.commonDiscount === null) { res.body.commonDiscount = {}; } else { res.body.commonDiscount = res.body.commonDiscount; }
      $scope.discount.amount = Math.abs(res.body.commonDiscount.amount) || null;
      $scope.discount.account = res.body.commonDiscount.accountUniqueName || null;
      //$scope.calcSubtotal()
      return $timeout(( () =>
        $scope.modalInstance = $uibModal.open({
          templateUrl:'public/webapp/invoice2/proforma/prevProforma.html',
          size: "a4",
          backdrop: 'static',
          scope: $scope
        })
      ),500);
    };
      // console.log $scope.taxes, $scope.taxTotal
    this.failure = res => toastr.error(res.data.message);
    let reqParam = {};
    reqParam.companyUniqueName = $rootScope.selectedCompany.uniqueName;
    let data = {};
    data.proforma = proforma.uniqueName;
    return invoiceService.getProforma(reqParam,data).then(this.success, this.failure);
  };

  $scope.switchMode = function() {
    let $$this = this;
    $$this.getValues = elements =>
      _.each(elements, function(elem) {
        if ((elem.type === 'Text') && elem.hasVar && elem.variable.isEditable) {
          if (typeof(elem.variable.value) === "object") {
            return elem.variable.value = elem.variable.value;
          }
        } else if ((elem.type === 'Element') && elem.children && (elem.children.length > 0)) {
          return $$this.getValues(elem.children);
        }
      })
    ;
    if ($scope.editMode) {
      _.each($scope.htmlData.sections, function(sec) {
        if (sec.elements.length) {
          return $$this.getValues(sec.elements);
        }
      });
      $scope.createProforma('update');
    }
    return $scope.editMode = true;
  };


  $scope.deleteProforma = function(num, index) {
    this.success = function(res) {
      $scope.proformaList.results.splice(index, 1);
      return toastr.success(res.body);
    };
    this.failure = res => toastr.error(res.data.message);
    let reqParam = {};
    reqParam.companyUniqueName = $rootScope.selectedCompany.uniqueName;
    reqParam.proforma = num;
    return invoiceService.deleteProforma(reqParam).then(this.success, this.failure);
  };

  $scope.changeBalanceStatus = function(proforma,index) {
    $scope.selectedProforma = {};
    _.extend($scope.selectedProforma, proforma);
    $scope.selectedProformaIndex = index;
    this.success = function(res) {
      toastr.success("successfully updated");
      proforma.editStatus = !proforma.editStatus;
      return proforma = res.body;
    };
    this.failure = res => toastr.error(res.data.message);
    let data = {};
    data.action = proforma.balanceStatus;
    data.proformaUniqueName = proforma.uniqueName;
    let reqParam = {};
    reqParam.companyUniqueName = $rootScope.selectedCompany.uniqueName;
    if (proforma.balanceStatus === "paid") {
      return $scope.modalInstance = $uibModal.open({
        template: `<div> \
<div class="modal-header"> \
<button type="button" class="close" data-dismiss="modal" ng-click="$dismiss()" aria-label="Close"><span \
aria-hidden="true">&times;</span></button> \
<h3 class="modal-title">Update Grand Total</h3> \
</div> \
<div class="modal-body"> \
<input class="form-control" type="text" ng-model="selectedProforma.balance"> \
</div> \
<div class="modal-footer"> \
<button class="btn btn-default" ng-click="updateBalanceAmount(selectedProforma, selectedProformaIndex)">Paid</button> \
</div> \
</div>`,
        size: "sm",
        backdrop: 'static',
        scope: $scope
      });
    } else {
      return invoiceService.updateBalanceStatus(reqParam, data).then(this.success, this.failure);
    }
  };

  $scope.updateBalanceAmount = function(proforma,index) {
    this.success = function(res) {
      toastr.success("successfully updated");
      proforma.editStatus = !proforma.editStatus;
      $scope.proformaList.results[index] = res.body;
      return $scope.modalInstance.close();
    };
    this.failure = res => toastr.error(res.data.message);
    let data = {};
    data.action = proforma.balanceStatus;
    data.proformaUniqueName = proforma.uniqueName;
    data.amount = proforma.balance;
    let reqParam = {};
    reqParam.companyUniqueName = $rootScope.selectedCompany.uniqueName;
    return invoiceService.updateBalanceStatus(reqParam, data).then(this.success, this.failure);
  };

  $scope.gwaList = {
    page: 1,
    count: 5000,
    totalPages: 0,
    currentPage : 1,
    limit: 5
  };

  pc.getFlattenGrpWithAccList = function(compUname) {
    let reqParam = {
      companyUniqueName: compUname,
      q: '',
      page: $scope.gwaList.page,
      count: $scope.gwaList.count,
      showEmptyGroups: true
    };
    if (!isElectron) {
        return groupService.getFlattenGroupAccList(reqParam).then(pc.getFlattenGrpWithAccListSuccess, pc.getFlattenGrpWithAccListFailure);
    } else {
        return groupService.getFlattenGroupAccListElectron(reqParam).then(pc.getFlattenGrpWithAccListSuccess, pc.getFlattenGrpWithAccListFailure);
    }
  };

  pc.getFlattenGrpWithAccListSuccess = function(res) {
    $scope.flatGrpList = res.body.results;
    let index = 0;
    _.each($scope.flatGrpList, function(grp, idx) {
      if (grp.groupUniqueName === $rootScope.groupName.sundryDebtors) {
        return index = idx;
      }
    });
    return $scope.newAccountModel.group = $scope.flatGrpList[index];
  };

  pc.getFlattenGrpWithAccListFailure = res => toastr.error(res.data.message);


  $scope.$on("proformaSelect", function() {
    if (!$scope.gettingProformaInProgress) {
      $scope.getAllProforma();
      return $scope.gettingProformaInProgress;
    }
  });

  $scope.newAccountModel = {};
  $scope.addNewAccount = function(proforma, index) {
    pc.selectedProforma = proforma;
    pc.selectedProformaIndex = index;
    $scope.newAccountModel.group = '';
    $scope.newAccountModel.account = proforma.accountName;
    $scope.newAccountModel.accUnqName = '';
    pc.getFlattenGrpWithAccList($rootScope.selectedCompany.uniqueName);
    return pc.AccmodalInstance = $uibModal.open({
      templateUrl: 'public/webapp/Ledger/createAccountQuick.html',
      size: "sm",
      backdrop: 'static',
      scope: $scope
    });
  };
    //modalInstance.result.then($scope.addNewAccountCloseSuccess, $scope.addNewAccountCloseFailure)

  $scope.addNewAccountConfirm = function() {
    this.success = function(res) {
      toastr.success('Account created successfully');
      $scope.proformaList.results[pc.selectedProformaIndex] = res.body;
      return pc.AccmodalInstance.close();
    };
    this.failure = res => toastr.error(res.data.message);

    $scope.newAccountModel.accUnqName = $scope.newAccountModel.accUnqName.replace(/ |,|\//g, '');
    $scope.newAccountModel.accUnqName = $scope.newAccountModel.accUnqName.toLowerCase();
    let reqParam = {
      companyUniqueName: $rootScope.selectedCompany.uniqueName
    };
    let data = {
      accountName: $scope.newAccountModel.account,
      groupUniqueName: $scope.newAccountModel.group.groupUniqueName,
      accountUniqueName: $scope.newAccountModel.accUnqName,
      proformaUniqueName: pc.selectedProforma.uniqueName
    };
    if (($scope.newAccountModel.group.groupUniqueName === '') || ($scope.newAccountModel.group.groupUniqueName === undefined)) {
      return toastr.error('Please select a group.');
    } else {
      //accountService.createAc(unqNamesObj, newAccount).then(pc.addNewAccountConfirmSuccess, pc.addNewAccountConfirmFailure)
      return invoiceService.linkProformaAccount(reqParam, data).then(this.success, this.failure);
    }
  };

  pc.addNewAccountConfirmSuccess = function(res) {
    toastr.success('Account created successfully');
    //$rootScope.getFlatAccountList($rootScope.selectedCompany.uniqueName)
    return pc.AccmodalInstance.close();
  };

  pc.addNewAccountConfirmFailure = res => toastr.error(res.data.message);

  $scope.genearateUniqueName = function(unqName) {
    unqName = unqName.replace(/ /g,'');
    unqName = unqName.toLowerCase();
    if (unqName.length >= 1) {
      let unq = '';
      let text = '';
      let chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
      let i = 0;
      while (i < 3) {
        text += chars.charAt(Math.floor(Math.random() * chars.length));
        i++;
      }
      unq = unqName + text;
      return $scope.newAccountModel.accUnqName = unq;
    } else {
      return $scope.newAccountModel.accUnqName = '';
    }
  };

  $scope.genUnq = unqName =>
    $timeout(( () => $scope.genearateUniqueName(unqName)), 800)
  ;

  $scope.create = {
    proformaTemplate : {}
  };

  $scope.getTemplates = function() {
    this.success = function(res) {
      $scope.pTemplateList = [];
      let index = 0;
      _.each(res.body, function(temp) {
        if (temp.type === "proforma") {
          return $scope.pTemplateList.push(temp);
        }
      });
      _.each($scope.pTemplateList, function(temp, idx) {
        if (temp.isDefault) {
          return index = idx;
        }
      });
      $scope.create.proformaTemplate = $scope.pTemplateList[index];
      $scope.fetchTemplateData($scope.pTemplateList[index], 'create');
      $scope.transactions = [];
      $scope.transactions.push(new pc.entryModel());
      $scope.taxes = [];
      $scope.subtotal = 0;
      return pc.selectedAccountDetails = undefined;
    };
    this.failure = res => toastr.error(res.data.message);

    let reqParam = {};
    reqParam.companyUniqueName = $rootScope.selectedCompany.uniqueName;
    return invoiceService.getTemplates(reqParam).then(this.success, this.failure);
  };

  // $timeout ( ->
  //   $scope.getTemplates()
  // ),1000

  // pc.parseData = (source, dest) ->
  //   _.each source.sections, (sec, sIdx) ->
  //     _.each dest.sections, (dec,dIdx) ->
  //       if sIdx == dIdx
  //         dec.styles.left = sec.leftOfBlock + '%'
  //         dec.styles.top = sec.topOfBlockt + '%'

  pc.checkEditableFields = function(sections) {
    let $$this = this;
    $$this.replaceEditables = elements =>
      _.each(elements, function(elem) {
        if ((elem.type === 'Text') && elem.hasVar) {
          return _.each(pc.templateVariables, function(temp) {
            if (elem.model === temp.key) {
              elem.variable = {};
              return angular.copy(temp, elem.variable);
            }
          });
        } else if ((elem.type === 'Element') && elem.children && (elem.children.length > 0)) {
          return $$this.replaceEditables(elem.children);
        }
      })
    ;

    let templateVariables = [];
    return _.each(sections, function(sec,i) {
      if (sec.elements.length) {
        $$this.replaceEditables(sec.elements);
      }
      return _.each(pc.sectionData, function(data, j) {
        if (i===j) {
          sec.styles.left = data.leftOfBlock + '%';
          return sec.styles.top = data.topOfBlock + '%';
        }
      });
    });
  };

  $scope.getDiscountAccounts = function() {
    $scope.discount.accounts = [];
    _.each($rootScope.fltAccntListPaginated, function(acc) {
      let isDiscount = false;
      if (acc.parentGroups.length > 0) {
        _.each(acc.parentGroups, function(pg) {
          if (pg.uniqueName === 'discount') {
            return isDiscount = true;
          }
        });
      }
      if (isDiscount) {
        return $scope.discount.accounts.push(acc);
      }
    });
    return $scope.discount.accounts;
  };

  // $scope.getRevenueAccounts = () ->
  //   accounts = []
  //   _.each $rootScope.fltAccntListPaginated, (acc) ->
  //     isDiscount = false
  //     if acc.parentGroups.length > 0
  //       _.each acc.parentGroups, (pg) ->
  //         if pg.uniqueName == $rootScope.groupName.revenueFromOperations
  //           isDiscount = true
  //     if isDiscount
  //       accounts.push(acc)
  //   accounts

  $scope.revenueAccounts = [];
  $scope.getRevenueAccounts = function(query) {
    let reqParam = {
      companyUniqueName: $rootScope.selectedCompany.uniqueName,
      q: query,
      page: 1,
      count: 0
    };
    let datatosend = {
      groupUniqueNames: [$rootScope.groupName.revenueFromOperations, 'discount']
    };
    return groupService.postFlatAccList(reqParam,datatosend).then(
      res => $scope.revenueAccounts = res.body.results,
      res => []);
  };

  $scope.fetchTemplateData = function(template, operation) {
    this.success = function(res) {
      pc.templateVariables = res.body.templateVariables;
      pc.htmlData = JSON.parse(res.body.htmlData);
      pc.sectionData = res.body.sections;
      pc.checkEditableFields(pc.htmlData.sections);
      $scope.htmlData = pc.htmlData;
      $scope.selectedTemplate = res.body.uniqueName;
      $scope.discount = {};
      return pc.selectedAccountDetails = undefined;
    };
      //pc.getDiscountAccounts()
      //pc.parseData(res.body, $scope.htmlData)
    this.failure = res => toastr.error(res.data.message);
    let reqParam = {};
    reqParam.companyUniqueName = $rootScope.selectedCompany.uniqueName;
    reqParam.templateUniqueName = template.uniqueName;
    reqParam.operation = operation;
    return settingsService.getTemplate(reqParam).then(this.success, this.failure);
  };

  pc.buildFields = function(sections) {
    let fields = [];
    let $$this = this;
    $$this.getEditables = elements =>
      _.each(elements, function(elem) {
        //if elem.type == 'Text' && elem.hasVar && elem.variable.isEditable
        if ((elem.type === 'Text') && elem.hasVar) {
          let field = {};
          field.key = elem.variable.key;
          field.value = elem.variable.value;
          return fields.push(field);
        } else if ((elem.type === 'Element') && elem.children && (elem.children.length > 0)) {
          return $$this.getEditables(elem.children);
        }
      })
    ;

    _.each(sections, function(sec) {
      if (sec.elements.length) {
        return $$this.getEditables(sec.elements);
      }
    });
    return fields;
  };

  // pc.processAccountDetails = () ->
  //   _.each $scope.transactions, (txn) ->
  //     if typeof(txn.accountUniqueName) == 'object'
  //       account = txn.accountUniqueName
  //       txn.accountName = account.name
  //       txn.accountUniqueName = account.uniqueName

  pc.removeBlankTrnsactions = function(transactions) {
    let txns = [];
    _.each(transactions, function(txn) {
      if (txn.accountUniqueName !== '') {
        return txns.push(txn);
      }
    });
    _.each(txns, function(txn) {
      if (typeof(txn.accountUniqueName) === 'object') {
        let account = txn.accountUniqueName;
        txn.accountName = account.name;
        return txn.accountUniqueName = account.uniqueName;
      }
    });
    return txns;
  };

  $scope.createProforma = function(action) {
    let $this = this;
    $this.success = function(res) {
      if (action === 'create') {
        toastr.success("Proforma created successfully");
        $scope.fetchTemplateData($scope.create.proformaTemplate, 'create');
        $scope.transactions = [];
        $scope.transactions.push(new pc.entryModel());
        $scope.subtotal = 0;
        $scope.taxes = [];
        $scope.discountTotal = 0;
        $scope.taxTotal = 0;
      } else if (action === 'update') {
        toastr.success("Proforma updated successfully");
        $scope.transactions = res.body.entries;
        $scope.getAllProforma();
        $scope.subtotal = res.body.subTotal;
        $scope.taxTotal = res.body.taxTotal;
        $scope.taxes = res.body.taxes;
        $scope.grandTotal = res.body.grandTotal;
        let account = {};
        account.uniqueName = res.body.account.uniqueName;
        pc.selectedAccountDetails = res.body.account;
        pc.setSelectedAccountDetails(pc.selectedAccountDetails, account);
        //$scope.setSelectedAccount(account)
        $scope.editMode = !$scope.editMode;
      }
      $rootScope.getFlatAccountList($rootScope.selectedCompany.uniqueName);
      return $scope.enableCreate = true;
    };
    $this.failure = res => toastr.error(res.data.message);
    let reqBody = {};
    reqBody.templateUniqueName = $scope.selectedTemplate;
    reqBody.fields = pc.buildFields($scope.htmlData.sections);
    //pc.processAccountDetails()
    let txns = angular.copy($scope.transactions);
    reqBody.entries = pc.removeBlankTrnsactions(txns);
    _.each(reqBody.entries,entry => delete entry.appliedTaxes);
    _.each(reqBody.fields, function(field) {
      let acUnq;
      if ((field.key === "$accountName") && (typeof(field.value) === "object")) {
        if (field.value !== null) {
          acUnq = {};
          acUnq.key = "$accountUniqueName";
          acUnq.value = field.value.uniqueName;
          reqBody.fields.push(acUnq);
          return field.value = field.value.name;
        } else {
          return toastr.error('Account Name cannot be blank');
        }
      } else if ((field.key === "$accountName") && (typeof(field.value) === "string") && (field.value !== null) && (typeof(pc.selectedAccountDetails) === 'object')) {
        acUnq = {};
        acUnq.key = "$accountUniqueName";
        acUnq.value = pc.selectedAccountDetails.uniqueName;
        return reqBody.fields.push(acUnq);
      }
    });
    if ($scope.discount.amount && $scope.discount.account) {
      reqBody.commonDiscount = {};
      reqBody.commonDiscount.amount = $scope.discount.amount;
      if (typeof $scope.discount.account === 'object') { reqBody.commonDiscount.accountUniqueName = $scope.discount.account.uniqueName; } else { reqBody.commonDiscount.accountUniqueName = $scope.discount.account; }
    }
    reqBody.updateAccountDetails = false;
    let reqParam = {};
    reqParam.companyUniqueName = $rootScope.selectedCompany.uniqueName;
    if (pc.selectedAccountDetails !== undefined) {
      pc.checkAccountDetailsChange(reqBody);
    }
    if (!$scope.enableCreate) {
      return modalService.openConfirmModal({
        title: 'Update Account Details',
        body: `You have changed details for ${pc.selectedAccountDetails.name}. Do you want to update permanently?`,
        ok: 'Yes',
        cancel: 'No'}).then(
          function(){
            reqBody.updateAccountDetails = true;
            if (action === 'create') {
              reqBody.fields = _.uniq(reqBody.fields, p=> p.key);
              return invoiceService.createProforma(reqParam,reqBody).then($this.success,$this.failure);
            } else if (action === 'update') {
              reqBody.proforma = $scope.currentProforma.uniqueName;
              //reqBody.fields = null
              reqBody.fields = angular.extend(pc.templateVariables,reqBody.fields);
              reqBody.fields = _.uniq(reqBody.fields, p=> p.key);
              return invoiceService.updateProforma(reqParam,reqBody).then($this.success, $this.failure);
            }
          },

          function() {
            reqBody.updateAccountDetails = false;
            if (action === 'create') {
              reqBody.fields = _.uniq(reqBody.fields, p=> p.key);
              return invoiceService.createProforma(reqParam,reqBody).then($this.success,$this.failure);
            } else if (action === 'update') {
              reqBody.proforma = $scope.currentProforma.uniqueName;
              //reqBody.fields = null
              reqBody.fields = angular.extend(pc.templateVariables,reqBody.fields);
              reqBody.fields = _.uniq(reqBody.fields, p=> p.key);
              return invoiceService.updateProforma(reqParam,reqBody).then($this.success, $this.failure);
            }
        });
    } else if ((action === 'create') && $scope.enableCreate) {
      reqBody.fields = angular.extend(pc.templateVariables,reqBody.fields);
      reqBody.fields = _.uniq(reqBody.fields, p=> p.key);
      return invoiceService.createProforma(reqParam,reqBody).then($this.success,$this.failure);
    } else if ((action === 'update') && $scope.enableCreate) {
      reqBody.proforma = $scope.currentProforma.uniqueName;
      //reqBody.fields = null
      reqBody.fields = angular.extend(pc.templateVariables,reqBody.fields);
      reqBody.fields = _.uniq(reqBody.fields, p=> p.key);
      return invoiceService.updateProforma(reqParam,reqBody).then($this.success, $this.failure);
    }
  };

  pc.entryModel = function() {
    return this.model =
      {
        "description": "",
        "amount": 0,
        "accountUniqueName": "",
        "accountName":''
      };
  };

  pc.getTaxList = function() {
    this.success = res => pc.taxList = res.body;
    this.failure = res => toastr.error(res.data.message);

    return companyServices.getTax($rootScope.selectedCompany.uniqueName).then(this.success, this.failure);
  };

  pc.getTaxList();

  $scope.addParticular = function(transactions) {
    let particular = new pc.entryModel();
    return transactions.push(particular);
  };

  $scope.removeParticular = function(transactions, index, txn) {
    transactions = transactions.splice(index, 1);
    $scope.calcSubtotal();
    return 0;
  };

  $scope.calcSubtotal = function() {
    $scope.subtotal = 0;
    $scope.discountTotal = 0;
    $scope.taxes = [];
    let prevTxn = null;
    return _.each($scope.transactions, function(txn,idx) {
      let isDiscount = false;
      if (typeof(txn.accountUniqueName) === 'object') {
        _.each(txn.accountUniqueName.parentGroups, function(pg) {
          if (pg.uniqueName === 'discount') {
            return isDiscount = true;
          }
        });
      } else if (typeof(txn.accountUniqueName) === 'string') {
        txn.appliedTaxes = pc.getTaxesFromAccountUniqueName(txn);
        isDiscount = pc.checkDiscountAccountFromParents(txn.accountUniqueName);
      }
      if (isDiscount) {
        $scope.discountTotal += Number(txn.amount);
        if ($scope.subtotal > 0) {
          $scope.subtotal -= Math.abs(Number(txn.amount));
        }
        if (prevTxn) {
          //prevTxn.amount -= Number(txn.amount)
          pc.calcTax(prevTxn, prevTxn.amount, 'discount');
          prevTxn.amount -= Math.abs(Number(txn.amount));
          return pc.calcTax(prevTxn, prevTxn.amount, 'txn');
        }
      } else {
        $scope.subtotal += Number(txn.amount);
        prevTxn = angular.copy(txn);
        return pc.calcTax(txn, prevTxn.amount, 'txn');
      }
    });
  };

  pc.calcTax = function(txn, amount, condition) {
    if (txn && txn.appliedTaxes && (txn.appliedTaxes.length > 0)) {
      return _.each(txn.appliedTaxes, function(aTax) {
        let tax = _.findWhere(pc.taxList, {uniqueName:aTax});
        let ctax = pc.calcTaxAmount(tax, txn,amount);
        if (ctax) {
          let existingTax = _.findWhere($scope.taxes, {name:ctax.name});
          if (existingTax && (condition === 'txn')) {
            return existingTax.amount += Number(ctax.amount);
          } else if (existingTax && (condition === 'discount')) {
            return existingTax.amount -= Number(ctax.amount);
          } else {
            return $scope.taxes.push(ctax);
          }
        }
      });
    }
  };

  $scope.taxes = [];
  pc.returnDateAsString = function(date) {
    date = date.split('-');
    date = date[1]+'-'+date[0]+'-'+date[2];
    return date;
  };

  pc.calcTaxAmount = function(tax, txn, amount) {
    let proformaDate = _.findWhere(pc.templateVariables, {key:"$proformaDate"});
    proformaDate = pc.returnDateAsString(proformaDate.value);
    let ctax = null;
    _.each(tax.taxDetail, function(det) {
      let date = pc.returnDateAsString(det.date);
      let pDate = Math.round(new Date(proformaDate).getTime()/1000);
      if (pDate >= Math.round(new Date(date).getTime()/1000)) {
        ctax = {};
        ctax.amount = (det.taxValue/100) * amount;
        return ctax.name = tax.name;
      }
    });
    return ctax;
  };

  pc.getTaxesFromAccountUniqueName = function(txn) {
    let account = _.findWhere($rootScope.fltAccntListPaginated, {uniqueName:txn.accountUniqueName});
    return account.applicableTaxes;
  };

  pc.checkDiscountAccountFromParents = function(accountUnq) {
    let isDiscout = false;
    let account = _.findWhere($rootScope.fltAccntListPaginated, {uniqueName:accountUnq});
    _.each(account.parentGroups, function(pg) {
      if (pg.uniqueName === 'discount') {
        return isDiscout = true;
      } else {
        return isDiscout = false;
      }
    });
    return isDiscout;
  };

  pc.isDiscountAccount = function(account) {
    let isDiscount = false;
    if (account.parentGroups.length > 0) {
      _.each(account.parentGroups, function(pg) {
        if (pg.uniqueName === 'discount') {
          return isDiscount = true;
        }
      });
    }
    return isDiscount;
  };

  $scope.getTaxes = function(account, txn, idx) {
    if (pc.isDiscountAccount(account) && (idx === 0)) {
      $scope.transactions = [];
      $scope.transactions.push(new pc.entryModel());
      return toastr.error('First account can not be discount account');
    } else {
      txn.appliedTaxes = account.applicableTaxes;
      if ((txn.amount !== null) && (txn.amount > 0)) {
        return $scope.calcSubtotal();
      }
    }
  };

  $scope.addquickAccount = function() {
    $scope.newAccountModel.group = '';
    $scope.newAccountModel.account = '';
    $scope.newAccountModel.accUnqName = '';
    pc.getFlattenGrpWithAccList($rootScope.selectedCompany.uniqueName);
    return pc.AccModalInstance = $uibModal.open({
      templateUrl:'public/webapp/invoice2/addNewAccount.html',
      size: "sm",
      backdrop: 'static',
      scope: $scope
    });
  };
    //modalInstance.result.then($scope.addNewAccountCloseSuccess, $scope.addNewAccountCloseFailure)

  $scope.addQuickAccountConfirm = function() {
    let newAccount = {
      email:"",
      mobileNo:"",
      name:$scope.newAccountModel.account,
      openingBalanceDate: $filter('date')($scope.today, "dd-MM-yyyy"),
      uniqueName:$scope.newAccountModel.accUnqName
    };
    let unqNamesObj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      selGrpUname: $scope.newAccountModel.group.groupUniqueName,
      acntUname: $scope.newAccountModel.accUnqName
    };
    if (($scope.newAccountModel.group.groupUniqueName === '') || ($scope.newAccountModel.group.groupUniqueName === undefined)) {
      return toastr.error('Please select a group.');
    } else {
      return accountService.createAc(unqNamesObj, newAccount).then($scope.addQuickAccountConfirmSuccess, $scope.addQuickAccountConfirmFailure);
    }
  };

  $scope.addQuickAccountConfirmSuccess = function(res) {
    toastr.success('Account created successfully');
    $rootScope.getFlatAccountList($rootScope.selectedCompany.uniqueName);
    return pc.AccModalInstance.close();
  };

  $scope.addQuickAccountConfirmFailure = res => toastr.error(res.data.message);

  $scope.sendMail = function(addressList) {
    this.success = function(res) {
      toastr.success(res.body);
      return $scope.showEmailBox = false;
    };

    this.failure = res => toastr.error(res.data.message);

    let addresses = addressList.split(',');
    let reqParam = {};
    reqParam.companyUniqueName = $rootScope.selectedCompany.uniqueName;
    let reqBody = {};
    reqBody.emailAddresses = addresses;
    reqBody.proformaNumber = $scope.currentProforma.proformaNumber;
    return invoiceService.sendMail(reqParam,reqBody).then(this.success, this.failure);
  };

  pc.b64toBlob = function(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    let offset = 0;
    while (offset < byteCharacters.length) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);
      let byteNumbers = new Array(slice.length);
      let i = 0;
      while (i < slice.length) {
        byteNumbers[i] = slice.charCodeAt(i);
        i++;
      }
      let byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
      offset += sliceSize;
    }
    let blob = new Blob(byteArrays, {type: contentType});
    return blob;
  };

  $scope.downloadProforma = function(proforma) {
    this.success = function(res) {
      let data = pc.b64toBlob(res.body, "application/pdf", 512);
      let blobUrl = URL.createObjectURL(data);
      return FileSaver.saveAs(data, proforma.proformaNumber+".pdf");
    };
    this.failure = res => toastr.error(res.data.message);

    let reqParam = {};
    reqParam.companyUniqueName = $rootScope.selectedCompany.uniqueName;
    let reqBody = {};
    reqBody.proformaNumber = proforma.proformaNumber;
    return invoiceService.downloadProforma(reqParam, reqBody).then(this.success, this.failure);
  };

  $scope.setSelectedAccount = function(account) {
    this.success = function(res) {
      pc.selectedAccountDetails = res.body;
      return pc.setSelectedAccountDetails(pc.selectedAccountDetails, account);
    };
    this.failure = function(res) {};
      //console.log res
    let reqParams = {
      compUname: $rootScope.selectedCompany.uniqueName,
      acntUname: account.uniqueName
    };
    return accountService.get(reqParams).then(this.success, this.failure);
  };

  pc.setSelectedAccountDetails = function(details, account) {
    let $$this = this;
    $$this.getEditables = elements =>
      _.each(elements, function(elem) {
        if (((elem.type === 'Text') && elem.hasVar && elem.variable.isEditable) || ((elem.type === 'Text') && elem.hasVar && (elem.variable.key === "$accountUniqueName"))) {
          switch (elem.variable.key) {
            case "$accountAddress":
              return elem.variable.value = details.address;
            case "$accountCity":
              return elem.variable.value = details.city;
            case "$accountEmail":
              return elem.variable.value = details.email;
            case "$accountMobileNo":
              return elem.variable.value = details.mobileNo;
            case "$accountState":
              return elem.variable.value = details.state;
            case "$accountCountry":
              return elem.variable.value = details.country;
            case "$accountPinCode":
              return elem.variable.value = details.pincode;
            case "$accountAttentionTo":
              return elem.variable.value = details.attentionTo;
            case "$accountUniqueName":
              return elem.variable.value = details.uniqueName;
          }

        } else if ((elem.type === 'Element') && elem.children && (elem.children.length > 0)) {
          return $$this.getEditables(elem.children);
        }
      })
    ;

    return _.each($scope.htmlData.sections, function(sec) {
      if (sec.elements.length) {
        return $$this.getEditables(sec.elements);
      }
    });
  };

  pc.checkAccountDetailsChange = req =>
    _.each(req.fields, function(field) {
      switch (field.key) {
        case "$accountName":
          if (field.value !== pc.selectedAccountDetails.name) {
            return $scope.enableCreate = false;
          }
          break;
        case "$accountAddress":
          if (field.value !== pc.selectedAccountDetails.address) {
            return $scope.enableCreate = false;
          }
          break;
        case "$accountCity":
          if (field.value !== pc.selectedAccountDetails.city) {
            return $scope.enableCreate = false;
          }
          break;
        case "$accountEmail":
          if (field.value !== pc.selectedAccountDetails.email) {
            return $scope.enableCreate = false;
          }
          break;
        case "$accountMobileNo":
          if (field.value !== pc.selectedAccountDetails.mobileNo) {
            return $scope.enableCreate = false;
          }
          break;
        case "$accountState":
          if (field.value !== pc.selectedAccountDetails.state) {
            return $scope.enableCreate = false;
          }
          break;
        case "$accountCountry":
          if (field.value !== pc.selectedAccountDetails.country) {
            return $scope.enableCreate = false;
          }
          break;
        case "$accountPinCode":
          if (field.value !== pc.selectedAccountDetails.pincode) {
            return $scope.enableCreate = false;
          }
          break;
        case "$accountAttentionTo":
          if (field.value !== pc.selectedAccountDetails.attentionTo) {
            return $scope.enableCreate = false;
          }
          break;
      }
    })
  ;

  pc.createSundryDebtorsList = function() {
    $scope.sundryDebtors = [];
    return _.each($rootScope.fltAccntListPaginated, function(acc) {
      let isSd = false;
      if (acc.parentGroups.length > 0) {
        _.each(acc.parentGroups, function(pg) {
          if (pg.uniqueName === $rootScope.groupName.sundryDebtors) {
            return isSd = true;
          }
        });
      }
      if (isSd) {
        return $scope.sundryDebtors.push(acc);
      }
    });
  };

  $scope.updateProformaDate = function(date) {
    if (date.length === 10) {
      _.each(pc.templateVariables, function(tp) {
        if (tp.key === "$proformaDate") {
          return tp.value = date;
        }
      });
      return $scope.calcSubtotal();
    }
  };

  $scope.setTab = function(value) {
    $scope.selectedTab = value;
    $timeout(( () => $scope.commonGoButtonClick()),2000);
    if (value === 2) {
      return $scope.hideFilters = true;
    } else {
      return $scope.hideFilters = false;
    }
  };

  $scope.taxTotal = 0;
  $scope.$watch('taxes', function(newVal, oldVal) {
    if (newVal !== oldVal) {
      $scope.taxTotal = 0;
      return _.each(newVal, tax => $scope.taxTotal += tax.amount);
    }
  });
  $scope.$watch('subtotal', function(newVal, oldVal) {
    if (newVal < 0) {
      return toastr.warning("Subtotal cannot be negative, please adjust your discount amount.");
    }
  });

  return $rootScope.$on('account-list-updated', ()=> pc.createSundryDebtorsList());
};
giddh.webApp.controller('proformaController', proformaController);