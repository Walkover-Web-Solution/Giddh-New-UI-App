let settingsController = function($scope, $rootScope, $timeout, $uibModal, $log, companyServices, currencyService, locationService, modalService, localStorageService, toastr, userServices, Upload, DAServices, $state, permissionService, $stateParams, couponServices, groupService, accountService, $filter, $http, $location) {
  $rootScope.cmpViewShow = true;
  $scope.showSubMenus = false;
  $scope.webhooks = [];
  $scope.autoPayOption = ["Never", "Runtime", "Midnight"];
  $scope.settings = {};
  $scope.tabs = [
    {title:'Invoice/Proforma', active: true},
    {title:'Taxes', active: false},
    {title:'Email/SMS settings', active: false},
    {title: 'Linked Accounts', active:false},
    {title: 'Razorpay', active:false},
    {title:'Basic information', active: true},
    {title:'Permission', active: false},
    {title:'Payment details', active: false},
    {title:'Financial Year', active: false}
  ];
  $scope.addRazorAccount = false;
  $scope.linkRazor = false;

  $scope.razorPayDetail = {
    userName:"",
    password:""
  };
  $scope.updateRazor = false;

  // manage tax variables
  $scope.taxTypes = [
    "MONTHLY",
    "YEARLY",
    "QUARTERLY",
    "HALFYEARLY"
  ];
  $scope.monthDays = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
  $scope.createTaxData = {
    duration: "MONTHLY",
    taxFileDate: 1
  };

  $scope.today = new Date();
  $scope.fromTaxDate = {date: new Date()};
  $scope.format = "dd-MM-yyyy";
  $scope.dateOptions = {
    'year-format': "'yy'",
    'starting-day': 1,
    'showWeeks': false,
    'show-button-bar': false,
    'year-range': 1,
    'todayBtn': false
  };
  //################### linked banks integration ####################
  $scope.banks = {
    list : undefined,
    banksList: [],
    components : [],
    siteID: '',
    type: '',
    itemId: '',
    linked: [],
    toLink:'',
    toLinkObj: {},
    mfaForm: {},
    fieldType: '',
    mfaResponse: {
      imgOrToken: '',
      questions:{}
    },
    requestSent: false,
    captcha: '',
    showToken: false,
    modalInstance: undefined,
    toDelete : '',
    toRemove : {}
  };
  $scope.linkedAccountsExist = false;
  $scope.bankDetails = {};
  $scope.transDate = {date: new Date()};
  $scope.transactionDate = $filter('date')($scope.transDate.date, "dd-MM-yyyy");
  $scope.format = "dd-MM-yyyy";
  $scope.newTransDate = {date: new Date()};
  $scope.dateOptions = {
    'year-format': "'yy'",
    'starting-day': 1,
    'showWeeks': false,
    'show-button-bar': false,
    'year-range': 1,
    'todayBtn': false
  };
  $scope.dateOptionsBanks = {
    'year-format': "'yy'",
    'starting-day': 1,
    'showWeeks': false,
    'show-button-bar': false,
    'year-range': 1,
    'todayBtn': true
  };


  $scope.fromDatePickerOpen = function() {
    return this.fromDatePickerIsOpen = true;
  };

  $scope.checkForCompany = function() {
    if ($rootScope.selectedCompany === undefined) {
      return $rootScope.selectedCompany = localStorageService.get('_selectedCompany');
    }
  };

  $scope.showWebhook = () => $scope.addWebhook = {url:"", triggerAt:"", entity:""};
  //get settings
  $scope.getAllSetting = () => companyServices.getAllSettings($rootScope.selectedCompany.uniqueName).then($scope.getAllSettingSuccess, $scope.getAllSettingFailure);

  $scope.getAllSettingSuccess = function(res) {
    $scope.settings = res.body;
    return $scope.webhooks = $scope.settings.webhooks;
  };

  $scope.getAllSettingFailure = res => toastr.error(res.data.message);

  $scope.saveSettings = () => companyServices.updateAllSettings($rootScope.selectedCompany.uniqueName, $scope.settings).then($scope.saveSettingsSuccess, $scope.saveSettingsFailure);

  $scope.saveSettingsSuccess = function(res) {
    toastr.success(res.body);
    return $scope.getAllSetting();
  };

  $scope.saveSettingsFailure = res => toastr.error(res.data.message);

  $scope.deleteWebhook = webhook => companyServices.deleteWebhook($rootScope.selectedCompany.uniqueName, webhook.uniqueName).then($scope.deleteWebhookSuccess,$scope.deleteWebhookFailure);

  $scope.deleteWebhookSuccess = res => $scope.getAllSetting();

  $scope.deleteWebhookFailure = res => toastr.error(res.data.message);

  $scope.saveWebhook = function() {
    if (($scope.addWebhook.url === "") || ($scope.addWebhook.entity === "") || ($scope.addWebhook.triggerAt === "")) {
      return;
    }
    return companyServices.createWebhook($rootScope.selectedCompany.uniqueName, $scope.addWebhook).then($scope.saveWebhookSuccess, $scope.saveWebhookFailure);
  };

  $scope.saveWebhookSuccess = function(res) {
    toastr.success("Webhook added successfully.");
    $scope.addWebhook = {};
    return $scope.getAllSetting();
  };

  $scope.saveWebhookFailure = res => toastr.error(res.data.message);

  // get taxes
  $scope.getTax=function(){
    $scope.taxList = [];
    if ($rootScope.canUpdate && $rootScope.canDelete) {
      return companyServices.getTax($rootScope.selectedCompany.uniqueName).then($scope.getTaxSuccess, $scope.getTaxFailure);
    }
  };

  $scope.getTaxSuccess = function(res) {
    if (res.body.length === 0) {
      return $scope.taxList = [];
    } else {
      return _.each(res.body, function(obj) {
        obj.isEditable = false;
        if (obj.account === null) {
          obj.account = {};
          obj.account.uniqueName = '';
        }
        obj.hasLinkedAcc = _.find($scope.fltAccntListPaginated, acc=> acc.uniqueName === obj.account.uniqueName);
        return $scope.taxList.push(obj);
      });
    }
  };

  $scope.getTaxFailure = res => $scope.noTaxes = true;


  $scope.clearTaxFields = () =>
    $scope.createTaxData = {
      duration: "MONTHLY",
      taxFileDate: 1
    }
  ;


  $scope.addNewTax = function(newTax) {
    newTax = {
      updateEntries: false,
      taxNumber:newTax.taxNumber,
      name: newTax.name,
      account: {
        uniqueName: newTax.account.uniqueName
      },
      duration:newTax.duration,
      taxFileDate:1,
      taxDetail:[
        {
          date : $filter('date')($scope.fromTaxDate.date, 'dd-MM-yyyy'),
          value: newTax.value
        }
      ]
    };
    return companyServices.addTax($rootScope.selectedCompany.uniqueName, newTax).then($scope.addNewTaxSuccess, $scope.addNewTaxFailure);
  };

  $scope.addNewTaxSuccess = function(res) {
// reset tax data
    $scope.createTaxData = {
      duration: "MONTHLY",
      taxFileDate: 1
    };
    $scope.fromTaxDate = {date: new Date()};
    $scope.getTax();
    return toastr.success("Tax added successfully.", "Success");
  };


  $scope.addNewTaxFailure = res => toastr.error(res.data.message);

  //delete tax
  $scope.deleteTaxconfirmation = data =>
    modalService.openConfirmModal({
      title: 'Delete Tax',
      body: `Are you sure you want to delete? ${data.name} ?`,
      ok: 'Yes',
      cancel: 'No'}).then(function() {
      let reqParam = {
        uniqueName: $rootScope.selectedCompany.uniqueName,
        taxUniqueName: data.uniqueName
      };
      return companyServices.deleteTax(reqParam).then($scope.deleteTaxSuccess, $scope.deleteTaxFailure);
    })
  ;

  $scope.deleteTaxSuccess = function(res) {
    $scope.getTax();
    return toastr.success(res.status, res.body);
  };

  $scope.deleteTaxFailure = res => toastr.error(res.status, res.data.message);

  //edit tax
  $scope.editTax = function(item) {
    item.isEditable = true;
    $scope.taxEditData = item;
    $scope.taxDetail_1 = angular.copy(item.taxDetail);
    return _.each($scope.taxList, function(tax) {
      if (tax.uniqueName !== item.uniqueName) {
        return tax.isEditable = false;
      }
    });
  };

  $scope.updateTax = function(item) {
    let newTax = {
      'taxNumber': item.taxNumber,
      'name': item.name,
      'account':{
        'uniqueName': item.account.uniqueName
      },
      'duration':item.duration,
      'taxFileDate': item.taxFileDate,
      'taxDetail': item.taxDetail
    };
    item.hasLinkedAcc = true;
    $scope.taxValueUpdated = false;

    _.each($scope.taxDetail_1, (tax_1, idx) =>
      _.each(item.taxDetail, function(tax, index) {
        if ((tax.taxValue.toString() !== tax_1.taxValue.toString()) && (idx === index)) {
          return $scope.taxValueUpdated = true;
        }
      })
    );

    _.each(newTax.taxDetail, detail => detail.value = detail.taxValue.toString());

    let reqParam = {
      uniqueName: $rootScope.selectedCompany.uniqueName,
      taxUniqueName: $scope.taxEditData.uniqueName,
      updateEntries: false
    };

    if ($scope.taxValueUpdated) {
// modalService.openConfirmModal(
//   title: 'Update Tax Value',
//   body: 'One or more tax values have changed, would you like to update tax amount in all entries as per new value(s) ?',
//   showConfirmBox: true,
//   ok: 'Yes',
//   cancel: 'No'
// ).then(->
//   console.log this
//   reqParam.updateEntries = true
//   companyServices.editTax(reqParam, newTax).then($scope.updateTaxSuccess, $scope.updateTaxFailure)
// )
      $scope.updateEntriesWithChangedTaxValue = false;
      $scope.taxObj = {
        reqParam,
        newTax
      };
      return $scope.updateTax.modalInstance = $uibModal.open({
        templateUrl:  '/public/webapp/Globals/modals/update-tax.html',
        size: "md",
        backdrop: 'static',
        scope: $scope
      });
    } else {
      companyServices.editTax(reqParam, newTax).then($scope.updateTaxSuccess, $scope.updateTaxFailure);
      return item.isEditable = false;
    }
  };

  $scope.updateTaxAndEntries = function(val) {
    let { reqParam } = $scope.taxObj;
    let { newTax } = $scope.taxObj;
    reqParam.updateEntries = val;
    return companyServices.editTax(reqParam, newTax).then($scope.updateTaxSuccess, $scope.updateTaxFailure);
  };


  $scope.updateTaxSuccess = function(res) {
    $scope.taxEditData.isEditable = false;
    $scope.getTax();
    toastr.success(res.status, "Tax updated successfully.");
    return $scope.updateTax.modalInstance.close();
  };

  $scope.updateTaxFailure = function(res) {
    $scope.getTax();
    return toastr.error(res.data.message);
  };

  // edit tax slab
  $scope.addNewSlabBefore = function(tax, index){
    tax.taxValue = parseInt(tax.taxValue);
    let newTax = {
      taxValue: tax.taxValue,
      date: $filter('date')($scope.today, 'dd-MM-yyyy')
    };
    return $scope.taxEditData.taxDetail.splice(index, 0, newTax);
  };

  $scope.addNewSlabAfter = function(tax, index) {
    tax.taxValue = parseInt(tax.taxValue);
    let newTax = {
      taxValue: tax.taxValue,
      date: $filter('date')($scope.today, 'dd-MM-yyyy')
    };
    return $scope.taxEditData.taxDetail.splice(index+1, 0, newTax);
  };

  // remove slab
  $scope.removeSlab = (tax, index) =>
    modalService.openConfirmModal({
      title: 'Remove Tax',
      body: 'Are you sure you want to delete?',
      ok: 'Yes',
      cancel: 'No'
    }).then(() => $scope.taxEditData.taxDetail.splice(index, 1))
  ;

  $scope.cancelUpdateTax = function() {
    $scope.taxEditData.taxDetail = $scope.preSpliceTaxDetail;
    return $scope.modalInstance.close();
  };

  //------------bulk sms and email---------#
  $scope.msg91 = {
    authKey: '',
    senderId: ''
  };
  $scope.sGrid = {
    authKey: '',
    subject: ''
  };

  $scope.getKeys = function() {
    companyServices.getSmsKey($rootScope.selectedCompany.uniqueName).then($scope.getSmsKeySuccess, $scope.getSmsKeyFailure);
    return companyServices.getEmailKey($rootScope.selectedCompany.uniqueName).then($scope.getEmailKeySuccess, $scope.getEmailKeyFailure);
  };

  $scope.getSmsKeySuccess = function(res) {
    $scope.msg91.authKey = res.body.authKey;
    return $scope.msg91.senderId = res.body.senderId;
  };

  $scope.getSmsKeyFailure = function(res) {
    $scope.msg91.authKey = '';
    return $scope.msg91.senderId = '';
  };

  $scope.getEmailKeySuccess = function(res) {
    $scope.sGrid.authKey = res.body.authKey;
    return $scope.sGrid.subject = res.body.subject;
  };

  $scope.getEmailKeyFailure = function(res) {
    $scope.sGrid.authKey = '';
    return $scope.sGrid.subject = '';
  };

  $scope.saveMsg91 = function() {
    let data = {
      "authKey":$scope.msg91.authKey,
      "senderId": $scope.msg91.senderId
    };
    let companyUniqueName = $rootScope.selectedCompany.uniqueName;
    if (($scope.msg91.authKey.length > 0) && ($scope.msg91.senderId.length > 0)) {
      return companyServices.saveSmsKey(companyUniqueName, data).then($scope.saveMsg91Success, $scope.saveMsg91Failure);
    }
  };

  $scope.saveMsg91Success = res => toastr.success(res.body);

  $scope.saveMsg91Failure = res => toastr.error(res.data.message);

  $scope.saveSendGrid = function() {
    let data = {
      "authKey":$scope.sGrid.authKey,
      "subject": $scope.sGrid.subject
    };
    let companyUniqueName = $rootScope.selectedCompany.uniqueName;
    if (($scope.sGrid.authKey.length > 0) && ($scope.sGrid.subject.length > 0)) {
      return companyServices.saveEmailKey(companyUniqueName, data).then($scope.saveSendGridSuccess, $scope.saveSendGridFailure);
    }
  };

  $scope.saveSendGridSuccess = res => toastr.success(res.body);

  $scope.saveSendGridFailure = res => toastr.error(res.data.message);

  //  Linked bank methods
  $scope.loadYodlee = () =>
//userServices.loginRegister($scope.loginSuccess, $scope.loginFailure)
    $scope.getYodleeAccounts()
  ;

  $scope.getYodleeAccounts = function() {
    let companyUniqueName =  {
      cUnq: $rootScope.selectedCompany.uniqueName
    };
    return userServices.getAccounts(companyUniqueName).then($scope.getAccountsSuccess, $scope.getAccountsFailure);
  };

  $scope.getAccountsSuccess = function(res) {
    $scope.banks.linked = res.body;
    if ($scope.banks.linked.length < 1) {
      return $scope.linkedAccountsExist = false;
    } else {
      $scope.linkedAccountsExist = true;
      //add transaction date to cards and assign utc format
      return _.each($scope.banks.linked, bank =>
        _.each(bank.accounts, function(card) {
          if (_.isNull(card.transactionDate) || _.isUndefined(card.transactionDate)) {
            return card.transactionDate =  new Date();
          } else {
            return card.transactionDate = new Date(card.transactionDate);
          }
        })
      );
    }
  };

  $scope.getAccountsFailure = res => toastr.error(res.data.code, res.data.message);
  // userServices.getAccounts(companyUniqueName).then($scope.getAccountsSuccess, $scope.getAccountsFailure)

  $scope.fetchSiteList = function(str) {
    let data = {
      name: str
    };
    let reqParam = {
      pName: str
    };
    if (data.name.length > 1) {
      return userServices.searchSite(data, reqParam).then($scope.searchSiteSuccess, $scope.searchSiteFailure);
    }
  };

  $scope.searchSiteSuccess = res => $scope.banks.banksList = res.body;

  $scope.searchSiteFailure = res => toastr.error(res.message);

  $scope.selectBank = function(bank) {
    $scope.banks.siteID = bank.siteId;
    $scope.banks.type = bank.type;
    if (bank.yodleeSiteLoginFormDetailList.length > 1) {
      return toastr.error('Something went wrong');
    } else {
      $scope.banks.components = bank.yodleeSiteLoginFormDetailList[0].componentList;
      return _.each($scope.banks.components, function(bank) {

        if (bank.fieldType.typeName === 'OPTIONS') {
          bank.fieldOptions = [];
          let mergedOptions = _.zip(bank.displayValidValues, bank.validValues);
          _.each(mergedOptions, function(opt) {
            let option = {};
            option.name = opt[0];
            option.value = opt[1];
            return bank.fieldOptions.push(option);
          });
        }

        if (bank.name.toLowerCase().indexOf('password') !== -1) {
          return bank.name = "PASSWORD";
        }
      });
    }
  };

  $scope.submitForm = function(bankDetails) {
    let det = bankDetails;
    let reqBody = {
      siteId : $scope.banks.siteID.toString(),
      loginFormDetail : [],
      type : $scope.banks.type
    };
    let companyUniqueName =  {
      cUnq: $rootScope.selectedCompany.uniqueName
    };
    let { components } = $scope.banks;
    _.each(components, function(cmp) {
      let toSend = {};
      let dn = cmp.displayName;
      for (let property in det) {
        if (dn === property) {
          toSend.value = det[property];
        }
      }

      // for property of cmp
      //   toSend[property] = cmp[property]
      toSend.name = cmp.name;
      toSend.displayName = cmp.displayName;
      toSend.isEditable = cmp.isEditable;
      toSend.enclosedType = cmp.fieldInfoType;
      toSend.valueMask = cmp.valueMask;
      toSend.valueIdentifier = cmp.valueIdentifier;
      toSend.size = cmp.size;
      toSend.maxlength = cmp.maxlength;
      toSend.helpText = cmp.helpText;
      toSend.fieldType = cmp.fieldType.typeName;
      return reqBody.loginFormDetail.push(toSend);
    });
    userServices.addSiteAccount(reqBody, companyUniqueName).then($scope.addSiteAccountSuccess, $scope.addSiteAccountFailure);
    return $scope.banks.requestSent = true;
  };


  $scope.addSiteAccountSuccess = function(res) {
    let companyUniqueName =  {
      cUnq: $rootScope.selectedCompany.uniqueName
    };
    $scope.banks.itemId = res.body.itemId;
    if (res.body.mfa) {
      $scope.banks.fieldType = res.body.yodleeMfaResponse.fieldType;
      switch (res.body.yodleeMfaResponse.fieldType) {
        case "TOKEN":
          $scope.banks.mfaForm = res.body.yodleeMfaResponse.fieldInfo.token;
          $scope.banks.showToken = true;
          break;
        case "IMAGE":
          $scope.banks.mfaForm = res.body.yodleeMfaResponse.fieldInfo.image;
          $scope.banks.showToken = true;
          break;
        case "QUESTIONS":
          $scope.banks.mfaForm = res.body.yodleeMfaResponse.fieldInfo.questionAns;
          $scope.banks.showToken = false;
          break;
      }
      $scope.banks.modalInstance = $uibModal.open({
        templateUrl:  '/public/webapp/Globals/modals/yodleeMfaModal.html',
        size: "sm",
        backdrop: 'static',
        scope: $scope
      });
    } else {
      $scope.banks.list = undefined;
      toastr.success('Account added successfully!');
    }

    // $scope.getYodleeAccounts()
    userServices.getAccounts(companyUniqueName).then($scope.getAccountsSuccess, $scope.getAccountsFailure);

    $scope.banks.requestSent = false;
    return $scope.bankDetails = {};
  };

  $scope.addSiteAccountFailure = function(res) {
    toastr.error(res.data.message, res.data.code);
    $scope.banks.requestSent = false;
    return $scope.bankDetails = {};
  };

  $scope.addMfaAccount = function(bankData) {
    let mfa = bankData.mfaResponse;
    let unqObj =  {
      cUnq: $rootScope.selectedCompany.uniqueName,
      itemId: $scope.banks.itemId
    };
    let newMfa = {};
    newMfa.itemId = $scope.banks.itemId;
    newMfa.type = $scope.banks.fieldType;
    if ((newMfa.type === 'IMAGE') || (newMfa.type === 'TOKEN')) {
      newMfa.token = mfa.imgOrToken;
      newMfa.questionAnswerses = [];
    } else if (newMfa.type === 'QUESTIONS') {
      let { mfaForm } = $scope.banks;
      newMfa.token = mfa.imgOrToken;
      newMfa.questionAnswerses = [];
      _.each(mfaForm.questionsAndAns, function(pQ) {
        let question = {};
        return (() => {
          let result = [];
          for (let property in mfa.questions) {
            let item;
            if (pQ.metaData === property) {
              question.answer = mfa.questions[property];
              question.answerFieldType = pQ.responseFieldType;
              question.metaData = pQ.metaData;
              question.question = pQ.question;
              question.questionFieldType = pQ.questionFieldType;
              item = newMfa.questionAnswerses.push(question);
            }
            result.push(item);
          }
          return result;
        })();
      });
    }

    return userServices.verifyMfa(unqObj, newMfa).then($scope.verifyMfaSuccess, $scope.verifyMfaFailure);
  };

  $scope.verifyMfaSuccess = function(res) {
    let companyUniqueName =  {
      cUnq: $rootScope.selectedCompany.uniqueName
    };
    toastr.success('Account added successfully!');
    userServices.getAccounts(companyUniqueName).then($scope.getAccountsSuccess, $scope.getAccountsFailure);
    $scope.banks.modalInstance.close();
    return $scope.banks.list = undefined;
  };

  $scope.verifyMfaFailure = function(res) {
    $scope.banks.modalInstance.close();
    return toastr.error(res.data.code, res.data.message, 'Please try again.');
  };


  $scope.showAccountsList = function(card) {
    card.showAccList = true;
    $scope.AccountsListToLink = $rootScope.fltAccntListPaginated;
    let linkedAccounts = [];
    return _.each($scope.banks.linked, function(bank) {
      if (bank.accounts.length > 0) {
        _.each(bank.accounts, acc => linkedAccounts.push(acc));
      }
      return _.each(linkedAccounts, function(lAcc) {
        if (lAcc.linkedAccount !== null) {
          let linked = {};
          linked.uniqueName = lAcc.linkedAccount.uniqueName;
          return $scope.AccountsListToLink = _.without($scope.AccountsListToLink, _.findWhere($scope.AccountsListToLink, linked));
        }
      });
    });
  };

  $scope.linkGiddhAccount = function(card) {
    card.showAccList = false;
    $scope.showAccountsList(card);
    return $scope.banks.toLinkObj = {
      itemAccountId: card.accountId,
      uniqueName: ''
    };
  };

  $scope.LinkGiddhAccountConfirm = function(acc) {
    $scope.banks.toLinkObj.uniqueName = acc.uniqueName;
    return modalService.openConfirmModal({
      title: 'Link Account',
      body: `Are you sure you want to link ${acc.name} ?`,
      ok: 'Yes',
      cancel: 'No'}).then($scope.LinkGiddhAccountConfirmed);
  };

  $scope.LinkGiddhAccountConfirmed = function(res) {
    let companyUniqueName =  {
      cUnq: $rootScope.selectedCompany.uniqueName,
      itemAccountId: $scope.banks.toLinkObj.itemAccountId
    };
    return userServices.addGiddhAccount(companyUniqueName, $scope.banks.toLinkObj).then($scope.LinkGiddhAccountConfirmSuccess, $scope.LinkGiddhAccountConfirmFailure);
  };

  $scope.LinkGiddhAccountConfirmSuccess = function(res) {
    let linkAccData = res.body;
    toastr.success(`Account linked successfully with ${linkAccData.linkedAccount.name}`);
    let companyUniqueName =  {
      cUnq: $rootScope.selectedCompany.uniqueName
    };
    userServices.getAccounts(companyUniqueName).then($scope.getAccountsSuccess, $scope.getAccountsFailure);
    return $timeout(( () => $scope.banks.toLink = '') ,500);
  };


  $scope.LinkGiddhAccountConfirmFailure = res => toastr.error(res.data.message);

  $scope.removeGiddhAccount = function(card) {
    $scope.banks.toRemove.linkedAccount = card.linkedAccount.uniqueName;
    $scope.banks.toRemove.ItemAccountId = card.accountId.toString();
    return modalService.openConfirmModal({
      title: 'Delete Account',
      body: `Are you sure you want to unlink ${card.linkedAccount.uniqueName} ?`,
      ok: 'Yes',
      cancel: 'No'}).then($scope.removeGiddhAccountConfirmed);
  };

  $scope.removeGiddhAccountConfirmed = function() {
    let reqParam =  {
      cUnq: $rootScope.selectedCompany.uniqueName,
      ItemAccountId: $scope.banks.toRemove.ItemAccountId
    };
    return userServices.removeAccount(reqParam).then($scope.removeGiddhAccountConfirmedSuccess, $scope.removeGiddhAccountConfirmedFailure);
  };

  $scope.removeGiddhAccountConfirmedSuccess = function(res) {
    toastr.success('Account successFully unlinked' );
    let companyUniqueName =  {
      cUnq: $rootScope.selectedCompany.uniqueName
    };
    return userServices.getAccounts(companyUniqueName).then($scope.getAccountsSuccess, $scope.getAccountsFailure);
  };

  $scope.removeGiddhAccountConfirmedFailure = res => toastr.error(res.body);

  $scope.deleteAddedBank = function(card) {
    $scope.banks.toDelete = card.loginId;
    return modalService.openConfirmModal({
      title: 'Delete Account',
      body: `Are you sure you want to delete ${card.name} ?\nAll accounts linked with the same bank will be deleted.`,
      ok: 'Yes',
      cancel: 'No'}).then($scope.deleteAddedBankAccountConfirmed);
  };


  $scope.deleteAddedBankAccountConfirmed = function() {
    let reqParam = {
      cUnq : $rootScope.selectedCompany.uniqueName,
      loginId: $scope.banks.toDelete
    };
    return userServices.deleteBankAccount(reqParam).then($scope.deleteAddedBankAccountConfirmedSuccess, $scope.deleteAddedBankAccountConfirmedFailure);
  };

  $scope.deleteAddedBankAccountConfirmedSuccess = function(res) {
    toastr.success(res.body);
    let companyUniqueName =  {
      cUnq: $rootScope.selectedCompany.uniqueName
    };
    return userServices.getAccounts(companyUniqueName).then($scope.getAccountsSuccess, $scope.getAccountsFailure);
  };

  $scope.deleteAddedBankAccountConfirmedFailure = res => toastr.error(res.data.message);

  $scope.refreshAccounts = function() {
    let companyUniqueName =  {
      cUnq: $rootScope.selectedCompany.uniqueName,
      refresh: true
    };
    return userServices.refreshAll(companyUniqueName).then($scope.refreshAllSuccess, $scope.refreshAllFailure);
  };

  $scope.refreshAllSuccess = function(res) {
    let refreshedAccounts = res.body;
    $scope.banks.linked = refreshedAccounts;
    //    companyUniqueName =  {
    //      cUnq: $rootScope.selectedCompany.uniqueName
    //    }
    //    userServices.getAccounts(companyUniqueName).then($scope.getAccountsSuccess, $scope.getAccountsFailure)
    return toastr.success('SuccessFully refreshed!');
  };

  $scope.refreshAllFailure = res => toastr.error(res.data.message, res.data.code);

  $scope.setItemAccountId = card => $scope.banks.toLinkObj.itemAccountId = card.accountId;


  $scope.updateTransactionDate = function(date) {
    let obj =  {
      cUnq: $rootScope.selectedCompany.uniqueName,
      itemAccountId: $scope.banks.toLinkObj.itemAccountId,
      date
    };
    let data = {};
    return userServices.setTransactionDate(obj, data).then($scope.updateTransactionDateSuccess, $scope.updateTransactionDateFailure);
  };

  $scope.updateTransactionDateSuccess = res => toastr.success(res.body);

  $scope.updateTransactionDateFailure = res => toastr.error(res.data.code, res.data.message);

  // watch date changed
  $scope.changedate =function(date){
    let abc = $filter("date")(date);
    date = $filter('date')(date, "dd-MM-yyyy");
    return modalService.openConfirmModal({
      title: 'Update Date',
      body: `Do you want to get ledger entries for this account from ${abc} ?`,
      ok: 'Yes',
      cancel: 'No'}).then(()=> $scope.updateTransactionDate(date));
  };

  // connect bank
  $scope.connectBank = ()=> userServices.connectBankAc($rootScope.selectedCompany.uniqueName).then($scope.connectBankSuccess, $scope.connectBankFailure);


  $scope.connectBankSuccess = function(res) {
    let modalInstance;
    $scope.cntBnkData = res.body;
    let url = res.body.token_URL + '?token=' + res.body.token;
    $scope.connectUrl = encodeURI(url);
    console.log($scope.connectUrl);
    return modalInstance = $uibModal.open({
      templateUrl:  '/public/webapp/Globals/modals/connectBankModal.html',
      size: "md",
      backdrop: 'static',
      scope: $scope,
      controller:'companyController'
    });
  };

  $scope.connectBankFailure = res => toastr.error(res.data.message, "Error");

  $scope.reconnectAccount = function(account) {
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
      templateUrl:  '/public/webapp/Globals/modals/refreshBankAccountsModal.html',
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

  $scope.refreshToken = function(account) {
    if (account.reconnect) {
      return;
    }
    let reqParam = {
      companyUniqueName: $rootScope.selectedCompany.uniqueName,
      loginId: account.loginId
    };
    return userServices.refreshAccount(reqParam).then($scope.refreshTokenSuccess, $scope.refreshTokenFailure );
  };

  $scope.refreshTokenSuccess = function(res) {
    let url = res.body.connectUrl;
    $scope.connectUrl = url;
    return $uibModal.open({
      templateUrl:  '/public/webapp/Globals/modals/refreshBankAccountsModal.html',
      size: "md",
      backdrop: 'static',
      scope: $scope
    });
  };

  $scope.refreshTokenFailure = res => toastr.error(res.data.message, "Error");

  $scope.setTab = function(tabNumber) {
    let count = 0;
    return _.each($scope.tabs, function(tab) {
      if (count === tabNumber) {
        tab.active = true;
      } else {
        tab.active = false;
      }
      return count = count + 1;
    });
  };

  $scope.getRazorPayDetails = () => companyServices.getRazorPay($rootScope.selectedCompany.uniqueName).then($scope.getRazorPaySuccess, $scope.getRazorPayFailure);

  $scope.getRazorPaySuccess = function(res) {
    $scope.razorPayDetail = res.body;
    if (($scope.razorPayDetail.userName !== "") || ($scope.razorPayDetail.userName !== null)) {
      $scope.updateRazor = true;
      $scope.razorPayDetail.password = "YOU_ARE_NOT_ALLOWED";
    } else {
      $scope.updateRazor = false;
    }

    if ($scope.razorPayDetail.account === null) {
      return $scope.linkRazor = true;
    }
  };

  $scope.getRazorPayFailure = function(res) {
    if (res.data.code !== "RAZORPAY_ACCOUNT_NOT_FOUND") {
      return toastr.error(res.data.message);
    }
  };

  $scope.saveRazorPayDetails = function(details) {
    if ((details.userName === "") || (details.password === "")) {
      return;
    } else {
      let sendThisDetail = {};
      sendThisDetail.companyName = details.companyName;
      sendThisDetail.userName = details.userName;
      sendThisDetail.password = details.password;
      if ((details.account !== null) && (details.account !== undefined)) {
        sendThisDetail.account = {};
        sendThisDetail.account.name = details.account.name;
        sendThisDetail.account.uniqueName = details.account.uniqueName;
      }
      sendThisDetail.autoCapturePayment = details.autoCapturePayment;
      return companyServices.addRazorPay($rootScope.selectedCompany.uniqueName, details).then($scope.saveRazorPaySuccess, $scope.saveRazorPayFailure);
    }
  };

  $scope.saveRazorPaySuccess = function(res) {
    if (res.body.message !== undefined) {
      toastr.success(res.body.message);
    } else {
      toastr.success("Razorpay detail added successfully.");
    }
    return $scope.getRazorPayDetails();
  };

  $scope.saveRazorPayFailure = res => toastr.error(res.data.message);

  $scope.unlinkAccount = function(detail) {
    detail.account.uniqueName = null;
    detail.account.name = null;
    return companyServices.updateRazorPay($rootScope.selectedCompany.uniqueName, detail).then($scope.saveRazorPaySuccess, $scope.saveRazorPayFailure);
  };

  $scope.updateRazorPayDetails = function(detail) {
    let sendThisDetail = {};
    sendThisDetail.companyName = detail.companyName;
    sendThisDetail.userName = detail.userName;
    if (detail.password !== "YOU_ARE_NOT_ALLOWED") {
      sendThisDetail.password = detail.password;
    }
    if ((detail.account !== null) && (detail.account !== undefined)) {
      sendThisDetail.account = {};
      sendThisDetail.account.name = detail.account.name;
      sendThisDetail.account.uniqueName = detail.account.uniqueName;
    }
    sendThisDetail.autoCapturePayment = detail.autoCapturePayment;
    return companyServices.updateRazorPay($rootScope.selectedCompany.uniqueName, sendThisDetail).then($scope.saveRazorPaySuccess, $scope.saveRazorPayFailure);
  };

  $scope.deleteRazorPayDetail = () => companyServices.deleteRazorPay($rootScope.selectedCompany.uniqueName).then($scope.deleteRazorPaySuccess, $scope.deleteRazorPayFailure);

  $scope.deleteRazorPaySuccess = function(res) {
    toastr.success(res.body);
    $scope.razorPayDetail = {};
    $scope.updateRazor = false;
    return $scope.linkRazor = true;
  };

  $scope.deleteRazorPayFailure = res => toastr.error(res.data.message);

  $scope.$on('company-changed', function(event,changeData) {
    if ((changeData.type === 'CHANGE') || (changeData.type === 'SELECT')) {
      return _.each($scope.tabs, function(tab) {
        if (tab.active === true) {
          if (tab.title === "Invoice/Proforma") {
            return $scope.getAllSetting();
          } else if (tab.title === "Taxes") {
            return $scope.getTax();
          } else if (tab.title === "Email/SMS settings") {
            return $scope.getKeys();
          } else if (tab.title === "Linked Accounts") {
            return $scope.loadYodlee();
          }
        }
      });
    }
  });

  $scope.checkForCompany();
  //#--payment details functions--###
   // payment details related func
  $scope.primPayeeChange = (a, b) => $scope.compSetBtn = false;

  $scope.$watch('selectedCompany.companySubscription.autoDeduct', function(newVal,oldVal) {
    if (!_.isUndefined(oldVal)) {
      if (newVal !== oldVal) {
        return $scope.compSetBtn = false;
      }
    }
  });
  $scope.pageChangedComp = function(data) {
    if (data.startPage > data.totalPages) {
      $scope.nothingToLoadComp = true;
      toastr.info("Nothing to load, all transactions are loaded", "Info");
      return;
    }
    if (data.startPage === 1) {
      data.startPage = 2;
    }
    let obj = {
      name: $rootScope.selectedCompany.uniqueName,
      num: data.startPage
    };
    return companyServices.getCompTrans(obj).then($scope.pageChangedCompSuccess, $scope.pageChangedCompFailure);
  };

  $scope.pageChangedCompSuccess =function(res){
    $scope.compTransData.paymentDetail = $scope.compTransData.paymentDetail.concat(res.body.paymentDetail);
    return $scope.compTransData.startPage += 1; 
  };

  $scope.pageChangedCompFailure =res=> toastr.error(res.data.message, res.data.status);

  $scope.getCompanyTransactions = function(){
    let obj = {
      name: $rootScope.selectedCompany.uniqueName,
      num: 1
    };
    return companyServices.getCompTrans(obj).then($scope.getCompanyTransactionsSuccess, $scope.getCompanyTransactionsFailure);
  };

  $scope.getCompanyTransactionsSuccess = function(res) {
    angular.copy(res.body, $scope.compTransData);
    $scope.compTransData.startPage = 1;
    $scope.nothingToLoadComp = false;
    if (res.body.paymentDetail.length > 0) {
      return $scope.compDataFound = true;
    } else {
      $scope.compDataFound = false;
      return toastr.info("Don\'t have any transactions yet.", "Info");
    }
  };

  $scope.getCompanyTransactionsFailure = res => toastr.error(res.data.message, res.data.status);

  $scope.updateCompSubs = function(resObj) {
    let data = {
      uniqueName: $rootScope.selectedCompany.uniqueName,
      autoDeduct: resObj.autoDeduct,
      primaryBiller: resObj.primaryBiller
    };
    return companyServices.updtCompSubs(data).then($scope.updateCompSubsSuccess, $scope.updateCompSubsFailure);
  };

  $scope.updateCompSubsSuccess = function(res) {
    $scope.selectedCompany.companySubscription = res.body;
    return toastr.success("Updates successfully", res.status);
  };

  $scope.updateCompSubsFailure = res => toastr.error(res.data.message, res.data.status);

  $scope.getWltBal=()=> userServices.getWltBal($rootScope.basicInfo.uniqueName).then($scope.getWltBalSuccess, $scope.getWltBalFailure);

  $scope.getWltBalSuccess = function(res) {
    $scope.disableRazorPay = false;
    let avlB = Number(res.body.availableCredit);
    let invB = Number($rootScope.selectedCompany.companySubscription.billAmount);
    if (avlB >= invB) {
      $scope.showPayOptns = false;
      return $scope.deductSubsViaWallet(invB);
    } else if ((avlB > 0) && (avlB < invB)) {
      $scope.wlt.Amnt = Math.abs(invB - avlB);
      return $scope.showPayOptns = true;
    } else {
      $scope.showPayOptns = true;
      return $scope.wlt.Amnt = invB;
    }
  };

  $scope.getWltBalFailure = res => toastr.error(res.data.message, res.data.status);

  $scope.deductSubsViaWallet = function(num) {
    let obj = {
      uniqueName: $rootScope.selectedCompany.uniqueName,
      billAmount: num
    };
    return companyServices.payBillViaWallet(obj).then($scope.subsViaWltSuccess, $scope.subsWltFailure);
  };

  $scope.subsViaWltSuccess = function(res) {
    $rootScope.basicInfo.availableCredit -= res.body.amountPayed;
    $rootScope.selectedCompany.companySubscription.paymentDue = false;
    $rootScope.selectedCompany.companySubscription.billAmount = 0;
    $scope.showPayOptns = false;
    toastr.success("Payment completed", "Success");
    return $scope.resetSteps();
  };

  $scope.subsWltFailure = res => toastr.error(res.data.message, res.data.status);

  $scope.addBalViaDirectCoupon = function() {
    let obj = {
      uUname: $rootScope.basicInfo.uniqueName,
      paymentId: null,
      amount: Number($scope.wlt.Amnt),
      discount: Number($scope.discount),
      couponCode: $scope.coupRes.couponCode
    };
    return userServices.addBalInWallet(obj).then($scope.addBalRzrSuccess, $scope.addBalRzrFailure);
  };

  $scope.addBalViaRazor = function(razorObj) {
    let obj = {
      uUname: $rootScope.basicInfo.uniqueName,
      paymentId: razorObj.razorpay_payment_id,
      amount: Number($scope.wlt.Amnt),
      discount: Number($scope.discount)
    };
    if (_.isEmpty($scope.coupRes)) {
      obj.couponCode = null;
    } else {
      if ($scope.coupRes.type === 'balance_add') {
        obj.couponCode = null;
        obj.amount= Number($scope.amount);
        $scope.coupRes.extra = true;
      } else {  
        obj.couponCode = $scope.coupRes.couponCode;
      }
    }

    return userServices.addBalInWallet(obj).then($scope.addBalRzrSuccess, $scope.addBalRzrFailure);
  };

  $scope.addBalRzrSuccess = function(res) {
    if ($scope.isHaveCoupon && !_.isEmpty($scope.coupRes)) {
      if (($scope.coupRes.type === 'balance_add') && $scope.coupRes.extra) {
        $rootScope.basicInfo.availableCredit += Number($scope.amount);
      } else if ($scope.coupRes.type === 'balance_add') {
        $rootScope.basicInfo.availableCredit += Number($scope.coupRes.maxAmount);
      } else {
        $rootScope.basicInfo.availableCredit += Number($scope.amount);
      }
    } else {
      $rootScope.basicInfo.availableCredit += Number($scope.wlt.Amnt);
    }
    // end
    if ($scope.wlt.status) {
      $scope.directPay = false;
      $scope.disableRazorPay = false;
      $scope.showPayOptns = false;
      $scope.resetSteps();
      return toastr.success(res.body, res.status);
    } else {
      if ($rootScope.basicInfo.availableCredit >= $rootScope.selectedCompany.companySubscription.billAmount) {
        return $scope.deductSubsViaWallet(Number($rootScope.selectedCompany.companySubscription.billAmount));
      } else {
        $scope.amount -= Number($scope.coupRes.maxAmount);
        $scope.directPay = false;
        $scope.disableRazorPay = false;
        return $scope.payAlert.push({msg: `Coupon is redeemed. But for complete subscription, you have to add Rs. ${$scope.amount} more in your wallet.`});
      }
    }
  };
    
  $scope.addBalRzrFailure = function(res) {
    toastr.error(res.data.message, res.data.status);
    $scope.directPay = true;
    $scope.showPayOptns = false;
    return $scope.resetSteps();
  };

  // child functions here for userController
  // add money in wallet
  $scope.addMoneyInWallet = function() {
    if (Number($scope.wlt.Amnt) < 100) {
      $scope.wlt = angular.copy({});
      return toastr.warning("You cannot make payment", "Warning");
    } else {
      $scope.payStep2 = true;
      return $scope.wlt.status = true;
    }
  };

  // redeem coupon
  $scope.redeemCoupon = code => couponServices.couponDetail(code).then($scope.redeemCouponSuccess, $scope.redeemCouponFailure);

  $scope.removeDotFromString = str => Math.floor(Number(str));
// test cases done insomuch
  $scope.redeemCouponSuccess = function(res) {
    $scope.payAlert = [];
    $scope.discount = 0;
    $scope.coupRes = res.body;
    toastr.success("Hurray your coupon code is redeemed", res.status);
    $scope.payAlert.push({type: 'success', msg: `Coupon code is redeemed. You can get a max discount of Rs. ${$scope.coupRes.maxAmount}`});
    $scope.amount = $scope.removeDotFromString($scope.wlt.Amnt);
    switch (res.body.type) {
      case 'balance_add':
        $scope.directPay = true;
        $scope.disableRazorPay = true;
        return $scope.addBalViaDirectCoupon();
      case 'cashback':
        return $scope.checkDiffAndAlert('cashback');
      case 'cashback_discount':
        $scope.discount = 0;
        $scope.cbDiscount = $scope.calCulateDiscount();
        return $scope.checkDiffAndAlert('cashback_discount');
      case 'discount':
        $scope.discount = $scope.calCulateDiscount();
        return $scope.checkDiffAndAlert('discount');
      case 'discount_amount':
        $scope.discount =  $scope.coupRes.maxAmount;
        return $scope.checkDiffAndAlert('discount_amount');
      default:
        return toastr.warning("Something went wrong", "Warning");
    }
  };
    
  
  $scope.calCulateDiscount = function() {
    let val = Math.floor(($scope.coupRes.value * $scope.amount)/100);
    if (val > $scope.coupRes.maxAmount) {
      return Number(Math.floor($scope.coupRes.maxAmount));
    } else {
      return Number(val);
    }
  };

      
  $scope.checkDiffAndAlert = function(type){
    $scope.directPay = false;
    switch (type) {
      case 'cashback_discount':
        $scope.disableRazorPay = false;
        return $scope.payAlert.push({msg: `Your cashback amount will be credited in your account withing 48 hours after payment has been done. Your will get a refund of Rs. ${$scope.cbDiscount}`});
      case 'cashback':
        if ($scope.amount < $scope.coupRes.value) {
          $scope.disableRazorPay = true;
          return $scope.payAlert.push({msg: `Your coupon is redeemed but to avail coupon, You need to make a payment of Rs. ${$scope.coupRes.value}`});
        } else {
          $scope.disableRazorPay = false;
          return $scope.payAlert.push({type: 'success', msg: `Your cashback amount will be credited in your account withing 48 hours after payment has been done. Your will get a refund of Rs. ${$scope.coupRes.value}`});
        }
      
      case 'discount':
        let diff = $scope.amount-$scope.discount;
        if (diff < 100) {
          $scope.disableRazorPay = true;
          return $scope.payAlert.push({msg: `After discount amount cannot be less than 100 Rs. To avail coupon you have to add more money. Currently payable amount is Rs. ${diff}`});
        } else {
          $scope.disableRazorPay = false;
          return $scope.payAlert.push({type: 'success', msg: `Hurray you have availed a discount of Rs. ${$scope.discount}. Now payable amount is Rs. ${diff}`});
        }
      case 'discount_amount':
        diff = $scope.amount-$scope.discount;
        if (diff < 100) {
          $scope.disableRazorPay = true;
          return $scope.payAlert.push({msg: `After discount amount cannot be less than 100 Rs. To avail coupon you have to add more money. Currently payable amount is Rs. ${diff}`});
        } else if ($scope.amount < $scope.coupRes.value) {
          $scope.disableRazorPay = true;
          return $scope.payAlert.push({msg: `Your coupon is redeemed but to avail coupon, You need to make a payment of Rs. ${$scope.coupRes.value}`});
        } else {
          $scope.disableRazorPay = false;
          return $scope.payAlert.push({type: 'success', msg: `Hurray you have availed a discount of Rs. ${$scope.discount}. Now payable amount is Rs. ${diff}`});
        }
    }
  };
      
      

  $scope.redeemCouponFailure = function(res) {
    $scope.disableRazorPay = false;
    $scope.payAlert = [];
    $scope.discount = 0;
    $scope.amount = $scope.removeDotFromString($scope.wlt.Amnt);
    $scope.coupRes = {};
    toastr.error(res.data.message, res.data.status);
    return $scope.payAlert.push({msg: res.data.message});
  };

  // remove alert
  $scope.closeAlert = index => $scope.payAlert.splice(index, 1);

  // reset steps
  $scope.resetSteps = function() {
    $scope.showPayOptns = false;
    $scope.isHaveCoupon = false;
    $scope.payAlert = [];
    $scope.wlt = angular.copy({});
    $scope.coupon = angular.copy({});
    $scope.wlt.status = false;
    $scope.coupRes = {};
    $scope.payStep2 = false;
    $scope.payStep3 = false;
    return $scope.disableRazorPay = false;
  };

  $scope.resetDiscount = function(status) {
    $scope.isHaveCoupon = status;
    if (!$scope.isHaveCoupon) {
      $scope.payAlert = [];
      $scope.coupon = angular.copy({});
      return $scope.disableRazorPay = false;
    }
  };
  //#--shared list--##
  $scope.getSharedUserList = uniqueName => companyServices.shredList(uniqueName).then($scope.getSharedUserListSuccess, $scope.getSharedUserListFailure);

  $scope.getSharedUserListSuccess = res => $scope.sharedUsersList = res.body;

  $scope.getSharedUserListFailure = res => toastr.error(res.data.message, res.data.status);

  $scope.getSharedList = function() {
    $scope.setShareableRoles($rootScope.selectedCompany);
    return $scope.getSharedUserList($rootScope.selectedCompany.uniqueName);
  };

  //Mayank
  $scope.setShareableRoles = selectedCompany => $scope.shareableRoles = permissionService.shareableRoles(selectedCompany);

  // # ---------------- Financial Year----------------#
  $scope.fy = {
    company: '',
    companyUniqueName: '',
    years: [],
    selectedYear: '',
    periods: ['Jan-Dec', 'Apr-Mar'],
    selectedPeriod: '',
    newFY: '',
    addedFYears: [],
    currentFY: {}
  };
  $scope.months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  $scope.fyYears = [];
  $scope.sFY = {};

  $scope.addfyYears = function() {
    $scope.fyYears = [];
    let startYear = moment().get('year') - 1;
    let endYear = moment().get('year') - 8;
    while (startYear > endYear) {
      $scope.fyYears.push(startYear);
      startYear -= 1;
    }
    return $scope.fyYears = _.difference($scope.fyYears, $scope.fy.addedFYears);
  };

  $scope.setFYname = years =>
    _.each(years, function(yr) {
      let name = yr.uniqueName.split("-");
      return yr.name = name[1] + '-' + name[2];
  })
  ;

  $scope.getFY = () => companyServices.getFY($rootScope.selectedCompany.uniqueName).then($scope.getFYSuccess, $scope.getFYFailure);

  $scope.getFYSuccess = function(res) {
    $scope.fy.company = res.body.companyName;
    $scope.fy.companyUniqueName = res.body.companyUniqueName;
    $scope.fy.years = res.body.financialYears;
    _.each($scope.fy.years, function(yr) {
      let addedYear = yr.financialYearStarts;
      let addedYearSplit = addedYear.split('-');
      let cYear = addedYearSplit[2];
      return $scope.fy.addedFYears.push(Number(cYear));
    });
    $scope.setFYname($scope.fy.years);
    return $scope.addfyYears();
  };

  $scope.getFYFailure = res => toastr.error(res.data.message);

  $scope.changeFyPeriod = function(period) {
    let reqParam = {
      companyUniqueName:  $rootScope.selectedCompany.uniqueName
    };
    let data = {
      "financialYearPeriod": period.toString()
    };
    return companyServices.updateFY(reqParam, data).then($scope.changeFyPeriodSuccess, $scope.changeFyPeriodFailure);
  };

  $scope.changeFyPeriodSuccess = function(res) {
    toastr.success('Period Updated Successfully');
    $scope.fy.years = res.body.financialYears;
    $scope.setFYname($scope.fy.years);
    return $scope.getcurrentFYfromResponse($rootScope.currentFinancialYear, $scope.fy.years);
  };

  $scope.changeFyPeriodFailure = res => toastr.error(res.data.message);

  $scope.getCurrentPeriod = function() {
    let cmp = localStorageService.get('_selectedCompany');
    if (!_.isNull(cmp)) {
      let fromMonth = moment(cmp.activeFinancialYear.financialYearStarts,"DD/MM/YYYY").month();
      let toMonth = moment(cmp.activeFinancialYear.financialYearEnds,"DD/MM/YYYY").month();
      let selectedPeriod = $scope.months[fromMonth] + '-' + $scope.months[toMonth];
      if (selectedPeriod === 'Apr-Mar') {
        return $scope.fy.selectedPeriod = $scope.fy.periods[1];
      } else if (selectedPeriod === 'Jan-Dec') {
        return $scope.fy.selectedPeriod = $scope.fy.periods[0];
      }
    }
  };

  $scope.switchFY = function(year) {
    let data = {
      "uniqueName":year.uniqueName
    };
    let reqParam = {
      companyUniqueName:  $rootScope.selectedCompany.uniqueName
    };
    return companyServices.switchFY(reqParam, data).then($scope.switchFYSuccess, $scope.switchFYFailure);
  };

  $scope.switchFYSuccess = function(res) {
    toastr.success(res.status, 'Financial Year switched successfully.');
    $rootScope.setActiveFinancialYear(res.body);
    return localStorageService.set('activeFY', res.body);
  };

  $scope.switchFYFailure = res => toastr.error(res.data.message);

  $scope.lockFY = function(year) {
    $scope.sFY = year;
    let data = {
      "uniqueName":year.uniqueName,
      "lockAll":"true"
    };
    let reqParam = {
      companyUniqueName:  $rootScope.selectedCompany.uniqueName
    };
    if (year.isLocked) {
      return companyServices.lockFY(reqParam, data).then($scope.lockFYSuccess, $scope.lockFYFailure);
    } else {
      return companyServices.unlockFY(reqParam, data).then($scope.unlockFYSuccess, $scope.unlockFYFailure);
    }
  };

  $scope.lockFYSuccess = function(res) {
    toastr.success('Financial Year Locked Successfully.');
    $scope.fy.years = res.body.financialYears;
    return $scope.setFYname($scope.fy.years);
  };

  $scope.lockFYFailure = function(res) {
    $scope.sFY.isLocked = false;
    return toastr.error(res.data.message);
  };

  $scope.unlockFYSuccess = function(res) {
    toastr.success('Financial Year Unlocked Successfully.');
    $scope.fy.years = res.body.financialYears;
    return $scope.setFYname($scope.fy.years);
  };

  $scope.unlockFYFailure = function(res) {
    $scope.sFY.isLocked = true;
    return toastr.error(res.data.message);
  };

  $scope.addFY = function(newFy) {
    let data = {
      "fromYear": newFy
    };
    let reqParam = {
      companyUniqueName:  $rootScope.selectedCompany.uniqueName
    };
    return companyServices.addFY(reqParam, data).then($scope.addFYSuccess, $scope.addFYFailure);
  };

  $scope.addFYSuccess = function(res) {
    toastr.success('Financial Year created successfully.');
    $scope.getFY();
    return $scope.fy.newFY = '';
  };

  $scope.addFYFailure = res => toastr.error(res.data.message);

  return $scope.getcurrentFYfromResponse = function(currentFinancialYear, response) {
    let cYear = {};
    let cFY = '';
    if (currentFinancialYear.length > 4) {
      let f = currentFinancialYear.split('-');
      cFY = f[0];
    } else {
      cFY = currentFinancialYear;
    }
      
    _.each(response,function(yr) {
      if (yr.financialYearStarts.indexOf(cFY) !== -1) {
        return cYear = yr;
      }
    });
    $rootScope.setActiveFinancialYear(cYear);
    return localStorageService.set('activeFY', cYear);
  };
};

giddh.webApp.controller('settingsController', settingsController);