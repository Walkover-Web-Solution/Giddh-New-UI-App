let invoiceController = function($scope, $rootScope, $filter, $uibModal, $timeout, toastr, localStorageService, groupService, DAServices, $state,  Upload, ledgerService, companyServices, accountService, modalService, $location, $http) {

  $rootScope.selectedCompany = {};
  $rootScope.selectedCompany = localStorageService.get("_selectedCompany");
  // invoice setting
  $scope.withSampleData = true;
  $scope.logoUpldComplt = false;
  $scope.showAccountList = false;
  $scope.invoiceLoadDone = false;
  $scope.entryListUpdated = false;
  $scope.noDataDR = false;
  $scope.radioChecked = false;
  $scope.genPrevMode = false;
  $scope.genMode = false;
  $scope.prevInProg = false;
  $scope.InvEmailData = {};
  $scope.nameForAction = [];
  $scope.onlyDrData = [];
  $scope.entriesForInvoice = [];
  $scope.flatAccntWGroupsList = [];
  $scope.subgroupsList = [];
  $scope.search = {};
  $scope.search.acnt = '';
  $scope.selectedAccountCategory = '';
  $scope.editGenInvoice = false;
  $scope.invoiceSettings = {};
  $scope.invoiceSettings.emailAddress = "";
  $scope.gwaList = {
    page: 1,
    count: 5000,
    totalPages: 0,
    currentPage : 1,
    limit: 5
  };
  // default Template data
  $scope.tempDataDef= {
    logo: {
      path: 'public/website/images/logo.png'
    },
    invoiceDetails: {
      invoiceNumber: '##########',
      invoiceDate: '11-12-2016',
      dueDate: ''
    },
    company: {
      name: 'Walkover Web Solutions Pvt. ltd.',
      data: ['405-406 Capt. C.S. Naidu Arcade','10/2 Old Palasiya','Indore Madhya Pradesh','CIN: 02830948209eeri','Email: account@giddh.com']
    },
    companyIdentities: {
      data: 'tin:67890,cin:12345'
    },
    entries: [
      {
        "transactions": [
          {
            "amount": 54500,
            "accountName": "John",
            "accountUniqueName": "john",
            "description": "Purchase of Macbook"
          }
        ],
        "uniqueName": "d7t1462171597019"
      },
      {
        "transactions": [
          {
            "amount": 23700,
            "accountName": "John",
            "accountUniqueName": "john",
            "description": "Purchase of Ipad"
          }
        ],
        "uniqueName": "d7t1462171597030"
      },
      {
        "transactions": [
          {
            "amount": 25300,
            "accountName": "John",
            "accountUniqueName": "john",
            "description": "Purchase of Iphone"
          }
        ],
        "uniqueName": "d7t1462171597023"
      }
    ],
    terms: [
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit"
    ],
    grandTotal: 118507.50,
    subTotal: 103500,
    taxTotal: 0,
    taxes:[
      {
        "hasError": false,
        "amount": 15007.50,
        "accountName": "vat@14.5",
        "taxRate": 14,
        "visibleTaxRate": 14,
        "errorMessage": "",
        "accountUniqueName": "vat14.5"
      }
    ],
    signature: {
      name: 'Walkover Web Solutions Pvt. ltd.',
      data: 'Authorised Signatory'
    },
    account: {
      name: 'Career Point Ltd.',
      data: 'CP Tower Road No. 1,Indraprashta Industrial Kota,PAN: 1862842,Email: info@career.com',
      attentionTo:'Mr. Agrawal'
    }
  };
  // invoice setting end

  // datepicker setting end
  $scope.dateData = {
    fromDate: new Date(moment().subtract(1, 'month').utc()),
    toDate: new Date()
  };
  $scope.dateOptions = {
    'year-format': "'yy'",
    'starting-day': 1,
    'showWeeks': false,
    'show-button-bar': false,
    'year-range': 1,
    'todayBtn': false
  };
  $scope.format = "dd-MM-yyyy";
  $scope.today = new Date();
  $scope.fromDatePickerIsOpen = false;
  $scope.toDatePickerIsOpen = false;

  $scope.fromDatePickerOpen = function() {
    return this.fromDatePickerIsOpen = true;
  };

  $scope.toDatePickerOpen = function() {
    return this.toDatePickerIsOpen = true;
  };
  // end of date picker


  // end of page load varialbles

  // close popup
  $scope.closePop=function(){
    $scope.withSampleData = true;
    $scope.genMode = false;
    $scope.genPrevMode = false;
    return $scope.prevInProg= true;
  };

  $scope.getAllGroupsWithAcnt=function(){
    if (_.isEmpty($rootScope.selectedCompany)) {
      return toastr.error("Select company first.", "Error");
    } else {
      // with accounts, group data
      $scope.getFlattenGrpWithAccList($rootScope.selectedCompany.uniqueName);
//      $scope.getSubgroupsWithAccounts($rootScope.selectedCompany.uniqueName,'sundry_debtors')
      $scope.getMultipleSubgroupsWithAccounts($rootScope.selectedCompany.uniqueName,[$rootScope.groupName.sundryDebtors,$rootScope.groupName.revenueFromOperations,$rootScope.groupName.otherIncome]);
      return groupService.getGroupsWithAccountsCropped($rootScope.selectedCompany.uniqueName).then($scope.makeAccountsList, $scope.makeAccountsListFailure);
    }
  };

  $scope.makeAccountsList = function(res) {
    // flatten all groups with accounts and only accounts flatten
    let item = {
      name: "Current Assets",
      uniqueName:"current_assets"
    };
    let result = groupService.matchAndReturnGroupObj(item, res.body);
    //$rootScope.flatGroupsList = groupService.flattenGroup([result], [])
    //$scope.flatAccntWGroupsList = groupService.flattenGroupsWithAccounts($rootScope.flatGroupsList)
    $rootScope.canChangeCompany = true;
    //$scope.showAccountList = true
    if (!(_.isEmpty($rootScope.$stateParams.invId))) {
      return $scope.toggleAcMenus(true);
    }
  };

  $scope.makeAccountsListFailure = res => toastr.error(res.data.message, res.data.status);


  // search flat accounts list
  $scope.searchAccounts = str => console.log("inside search accounts");
//    reqParam = {}
//    reqParam.companyUniqueName = $rootScope.selectedCompany.uniqueName
//    if str.length > 2
//      $scope.hideAccLoadMore = true
//      reqParam.q = str
//      reqParam.count = 5000
//    else
//      $scope.hideAccLoadMore = false
//      reqParam.q = ''
//      reqParam.count = 5000
//    groupService.getFlatAccList(reqParam).then($scope.getFlatAccountListListSuccess, $scope.getFlatAccountListFailure)

  //----------- Get multiple subgroups with accounts -----------#
  $scope.getMultipleSubgroupsWithAccounts = function(compUname, groupUnames) {
    let reqParam = {
      companyUniqueName: compUname
    };
    let data = {uniqueNames:groupUnames};
    return groupService.getMultipleSubGroups(reqParam,data).then($scope.getMSubgroupsSuccess,$scope.getMSubgroupsFailure);
  };

  $scope.getMSubgroupsSuccess = function(res) {
    $scope.flatAccntWGroupsList = [];
//    $scope.flatAccntWGroupsList.push(res.body)
    $scope.filterSundryDebtors(res.body);
    _.extend($scope.subgroupsList,$scope.flatAccntWGroupsList);
    return $scope.gwaList.limit = 5;
  };

  $scope.getMSubgroupsFailure = res => toastr.error(res.data.message);

  //----------- Get subgroups with accounts -----------#
  $scope.getSubgroupsWithAccounts = function(compUname, groupUname) {
    let reqParam = {
      companyUniqueName: compUname,
      groupUniqueName: groupUname
    };
    return groupService.getSubgroupsWithAccounts(reqParam).then($scope.getSubgroupsSuccess,$scope.getSubgroupsFailure);
  };

  $scope.getSubgroupsSuccess = function(res) {
//    console.log(res)
    $scope.flatAccntWGroupsList = [];
    $scope.flatAccntWGroupsList.push(res.body);
    $scope.filterSundryDebtors(res.body.groups);
    _.extend($scope.subgroupsList,$scope.flatAccntWGroupsList);
    return $scope.gwaList.limit = 5;
  };

  $scope.getSubgroupsFailure = res => console.log(res);

  //-------- fetch groups with accounts list-------
  $scope.getFlattenGrpWithAccList = function(compUname) {
    let reqParam = {
      companyUniqueName: compUname,
      q: '',
      page: $scope.gwaList.page,
      count: $scope.gwaList.count
    };
    if (!isElectron) {
        return groupService.getFlattenGroupAccList(reqParam).then($scope.getFlattenGrpWithAccListSuccess, $scope.getFlattenGrpWithAccListFailure);
    } else {
        return groupService.getFlattenGroupAccListElectron(reqParam).then($scope.getFlattenGrpWithAccListSuccess, $scope.getFlattenGrpWithAccListFailure);
    }
  };

  $scope.getFlattenGrpWithAccListSuccess = function(res) {
    $scope.gwaList.totalPages = res.body.totalPages;
//    $scope.flatAccntWGroupsList = []
//    $scope.filterSundryDebtors(res.body.results)
//    $scope.showAccountList = true
    return $scope.gwaList.limit = 5;
  };

  $scope.getFlattenGrpWithAccListFailure = res => toastr.error(res.data.message);

  $scope.loadMoreGrpWithAcc = compUname => $scope.gwaList.limit += 5;

  $scope.loadMoreGrpWithAccSuccess = function(res) {
    $scope.gwaList.currentPage += 1;
    let list = res.body.results;
    if (res.body.totalPages >= $scope.gwaList.currentPage) {
      return $scope.flatAccntWGroupsList = _.union($scope.flatAccntWGroupsList, list);
    } else {
      return $scope.hideLoadMore = true;
    }
  };

  $scope.loadMoreGrpWithAccFailure = res => toastr.error(res.data.message);

  $scope.searchGrpWithAccounts = function(str) {
//    $scope.flatAccntWGroupsList = []
//    if _.isEmpty(str)
//      _.extend($scope.flatAccntWGroupsList,$scope.subgroupsList)
//    else
//      _.each($scope.subgroupsList,(group) ->
//        if group.name.toLowerCase().match(str) || group.uniqueName.match(str)
//          $scope.flatAccntWGroupsList.push(group)
//        else
//          if group.accounts.length > 0
//            _.each(group.accounts, (account) ->
//              if account.name.toLowerCase().match(str) || account.uniqueName.match(str)
//                $scope.flatAccntWGroupsList.push(group)
//            )
//      )
    if (str.length < 1) {
      return $scope.gwaList.limit = 5;
    }
  };

  $scope.isGrpMatch = function(g, q) {
    let p = RegExp(q,"i");
    if (g.name.match(p) || g.uniqueName.match(p)) {
      return true;
    }
    return false;
  };

  $scope.loadMoreGrpWithAcc = () => $scope.gwaList.limit += 5;

  $scope.filterSundryDebtors = function(grpList) {
//    $scope.flatAccntWGroupsList = _.flatten(grpList)
    _.each(grpList, function(grp) {
//      if grp.groupUniqueName == 'sundry_debtors'
        grp.open = false;

        if (grp.accounts.length > 0) {
          _.each(grp.accounts, function(acc) {
            if (acc.uniqueName === $rootScope.$stateParams.invId) {
              return $scope.selectedAccountCategory = grp.category;
            }
          });
        }

        $scope.flatAccntWGroupsList.push(grp);
        if (grp.groups.length > 0) {
          return $scope.filterSundryDebtors(grp.groups);
        }
    });
    return $scope.showAccountList = true;
  };
//    console.log($scope.flatAccntWGroupsList)



  $scope.loadMoreGrpWithAccFailure = res => toastr.error(res.data.message);


  //Expand or  Collapse all account menus
  $scope.toggleAcMenus = function(state) {
    if (!_.isEmpty($scope.flatAccntWGroupsList)) {
      return _.each($scope.flatAccntWGroupsList, function(e) {
        e.open = state;
        return $scope.showSubMenus = state;
      });
    }
  };

  // trigger expand or collapse func
  $scope.checkLength = function(val){
    if ((val === '') || _.isUndefined(val)) {
      return $scope.toggleAcMenus(false);
    } else if (val.length >= 4) {
      return $scope.toggleAcMenus(true);
    } else {
      return $scope.toggleAcMenus(false);
    }
  };
  // end acCntrl

  $scope.loadInvoice = function(data, acData) {
    DAServices.LedgerSet(data, acData);
    $scope.selectedAccountCategory = data.category;
    localStorageService.set("_ledgerData", data);
    localStorageService.set("_selectedAccount", acData);
    $rootScope.$stateParams.invId = acData.uniqueName;
    $scope.entriesForInvoice = [];
    // call invoice load func
    $scope.getTemplates();
    return $scope.invoiceLoadDone = true;
  };


  $scope.getTemplates = ()=> companyServices.getInvTemplates($rootScope.selectedCompany.uniqueName).then($scope.getTemplatesSuccess, $scope.getTemplatesFailure);

  $scope.getTemplatesSuccess=function(res){
    $scope.templateList = res.body.templates;
    $scope.templateData = res.body.templateData;
    $scope.invoiceSettings.emailAddress = $scope.templateData.email;
    return $scope.invoiceSettings.isEmailVerified = $scope.templateData.emailVerified;
  };

  $scope.getTemplatesFailure = res =>
//    $scope.invoiceLoadDone = true
    toastr.error(res.data.message, res.data.status)
  ;

  // set as default
  $scope.setDefTemp = function(data) {
    if (data.isDefault) {
      let obj = {
        uniqueName: $rootScope.selectedCompany.uniqueName,
        tempUname: data.uniqueName
      };
      return companyServices.setDefltInvTemplt(obj).then(
        function(res){
          $scope.templateList = res.body.templates;
          $scope.templateData = res.body.templateData;
          return toastr.success("Template changed successfully", "Success");
        }
        , function(res){
          data.isDefault = false;
          return toastr.error(res.data.message, res.data.status);
      });
    } else {
      toastr.warning("You have to select atleast one template", "Warning");
      return data.isDefault = true;
    }
  };

  // switch sample data with original data
  $scope.switchTempData=function(){
    if ($scope.withSampleData) {
      $scope.withSampleData = false;
      _.extend($scope.defTempData , $scope.templateData);
    } else {
      $scope.withSampleData = true;
      _.extend($scope.defTempData , $scope.tempDataDef);
    }
    return $scope.convertIntoOur();
  };

  // view template with sample data
  $scope.viewInvTemplate =function(template, mode, data) {
    let showPopUp = true;
    $scope.templateClass = template.uniqueName;
    data.signatureType = template.sections.signatureType;
    if (mode !== 'genprev') {
      $scope.genPrevMode = false;
    }
    $scope.logoWrapShow = false;
    $scope.logoUpldComplt = false;
    $scope.signatureWrapShow = false;
    $scope.signatureUpldComplt = false;
    $scope.tempSet = {};
    $scope.defTempData = {};
    // set mode
    $scope.editMode = mode === 'edit' ? true : false;
    $scope.tempSet = template.sections;

    _.extend($scope.defTempData , data);
    $scope.defTempData.signatureType = $scope.tempSet.signatureType;
    showPopUp = $scope.convertIntoOur();

    // open dialog
    if(showPopUp) {
      $scope.modalInstance = $uibModal.open({
        templateUrl: 'public/webapp/Invoice/prevInvoiceTemp.html',
        size: "a4",
        backdrop: 'static',
        scope: $scope
      });
      return $scope.modalInstance.result.then($scope.showInvoiceSuccess,$scope.showInvoiceFailure);
    }
  };

  $scope.showInvoiceSuccess = () => console.log("invoice opened");

  $scope.showInvoiceFailure = () => $scope.editGenInvoice = false;

  // upload logo
//   $scope.uploadLogo=(files,type)->
//     $scope.logoUpldComplt = true
//     $scope.signatureUpldComplt = true
//     angular.forEach files, (file) ->
//       file.fType = type
// #      console.log file
//       file.upload = Upload.upload(
//         url: '/upload/' + $rootScope.selectedCompany.uniqueName + '/logo'
//         # file: file
//         # fType: type
//         data : {
//           file: file
//           fType: type
//         }
//       )
//       file.upload.then ((res) ->
//         $timeout ->
//           # $scope.logoWrapShow = false
//           if type == 'logo'
//             $scope.defTempData.logo.path = res.data.body.path
//           else
//             $scope.defTempData.signature.path = res.data.body.path
//           toastr.success("Logo Uploaded Successfully", res.data.status)
//       ), ((res) ->
// #        console.log res, "error"
//         $scope.logoUpldComplt = false
//         $scope.signatureUpldComplt = false
//         toastr.warning("Something went wrong", "warning")
//       ), (evt) ->
//         console.log "file upload progress" ,Math.min(100, parseInt(100.0 * evt.loaded / evt.total))

  $scope.uploadLogo = function(type) {
    let file;
    if (type === 'logo') {
      file = document.getElementById('invoiceLogo').files[0];
    } else {
      file = document.getElementById('invoiceSign').files[0];
    }
    let formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    //formData.append('company', $rootScope.selectedCompany.uniqueName)

    this.success = res =>
      $timeout(function() {
        // $scope.logoWrapShow = false
        if (type === 'logo') {
          $scope.defTempData.logo.path = res.data.body.path;
        } else {
          $scope.defTempData.signature.path = res.data.body.path;
        }
        return $scope.logoUpldComplt = true;
      })
    ;

    this.failure = function(res) {
      $scope.logoUpldComplt = false;
      $scope.signatureUpldComplt = false;
      return toastr.warning("Something went wrong", "warning");
    };

    let url = `/upload/${$rootScope.selectedCompany.uniqueName}/logo`;
    return $http.post(url, formData, {
      transformRequest: angular.identity,
      headers: {'Content-Type': undefined}
    }).then(this.success, this.failure);
  };



  // reset Logo
  $scope.resetLogo=function(){
    $scope.logoUpldComplt = false;
    return $scope.logoWrapShow = true;
  };

  $scope.showUploadWrap=()=> $scope.logoWrapShow = true;

  // reset Signature
  $scope.resetSignature=function(){
    $scope.signatureUpldComplt = false;
    return $scope.signatureWrapShow = true;
  };

  $scope.showUploadSignatureWrap=()=> $scope.signatureWrapShow = true;

  // convert data for UI usage
  $scope.convertIntoOur=function(){
    let showPopUp = true;
    // company setting
    if(_.isNull($scope.defTempData.company)) {
      toastr.error("Selected company is not available, please contact to support.","Error");
      showPopUp = false;
    } else if ((typeof($scope.defTempData.company.data) === 'object') && !(_.isEmpty($scope.defTempData.company.data))) {
      $scope.defTempData.company.data = $scope.defTempData.company.data.join("\n");
    }

    if(_.isNull($scope.defTempData.account)) {
//      toastr.error("Selected company is not available, please contact to support.","Error")
      showPopUp = true;
    } else if ((typeof($scope.defTempData.account.data) === 'object') && !(_.isEmpty($scope.defTempData.account.data))) {
      $scope.defTempData.account.data = $scope.defTempData.account.data.join("\n");
    }

    // companyIdentities setting
    if(_.isNull($scope.defTempData.companyIdentities)) {
      toastr.error("Selected company is not available, please contact to support.","Error");
      showPopUp = false;
    } else if (!(_.isEmpty($scope.defTempData.companyIdentities.data))) {
      $scope.defTempData.companyIdentities.data = $scope.defTempData.companyIdentities.data.replace(RegExp(',', 'g'), '\n');
    }

    // terms setting
    if ($scope.defTempData.terms.length > 0) {
      let str = $scope.defTempData.terms.toString();
      $scope.defTempData.termsStr = str.replace(RegExp(',', 'g'), '\n');
    }
    return showPopUp;
  };


  // save template data
  $scope.saveTemp=function(stype, force){
    $scope.genMode = false;
    $scope.updatingTempData = true;
    let dData = {};
    let data = {};
    angular.copy($scope.defTempData, data);

    // company setting
    if (!(_.isEmpty(data.company.data))) {
      data.company.data = data.company.data.split('\n');
    }
      //data.company.data.replace(RegExp('\n', 'g'), ',')
    if (!(_.isEmpty(data.account.data))) {
      data.account.data = data.account.data.split('\n');
    }

    // companyIdentities setting
    if (!(_.isEmpty(data.companyIdentities.data))) {
      data.companyIdentities.data = data.companyIdentities.data.replace(RegExp('\n', 'g'), ',');
    }
      // data.companyIdentities.data = data.companyIdentities.data.replace(RegExp(' ', 'g'), '')

    // terms setting
    if (!(_.isEmpty(data.termsStr))) {
      data.terms = data.termsStr.split('\n');
    } else {
      data.terms = [];
    }

    if (data.invoiceDetails.dueDate !== "") {
      data.invoiceDetails.dueDate = moment(data.invoiceDetails.dueDate).format('DD-MM-YYYY');
    } else {
      data.invoiceDetails.dueDate = null;
    }

    if (stype === 'save') {
      return companyServices.updtInvTempData($rootScope.selectedCompany.uniqueName, data).then($scope.saveTempSuccess, $scope.saveTempFailure);

    } else if (stype === 'generate') {
      _.omit(data, 'termsStr');
      let obj= {
        compUname: $rootScope.selectedCompany.uniqueName,
        acntUname: $rootScope.$stateParams.invId
      };
      dData= {
        uniqueNames: data.ledgerUniqueNames,
        validateTax: true,
        invoice: _.omit(data, 'ledgerUniqueNames')
      };
      if (force) {
        dData.validateTax = false;
      }

      if (moment(data.invoiceDetails.invoiceDate, "DD-MM-YYYY", true).isValid()) {
        if ($scope.defTempData.account.data.length > 0) {
          return accountService.genInvoice(obj, dData).then($scope.genInvoiceSuccess, $scope.genInvoiceFailure);
        } else {
          toastr.error("Buyer's address can not be left blank.");
          $scope.updatingTempData = false;
          return $scope.genMode = true;
        }
      } else {
        toastr.warning("Enter proper date", "Warning");
        $scope.genMode = true;
        $scope.updatingTempData = false;
        return false;
      }

    } else {
      return console.log("do nothing");
    }
  };


  $scope.saveTempSuccess=function(res){
    $scope.updatingTempData = false;
    let abc = _.omit(res.body, "logo");
    _.extend($scope.templateData , abc);
    toastr.success("Template updated successfully", "Success");
    return $scope.modalInstance.close();
  };

  $scope.saveTempFailure = function(res) {
    $scope.updatingTempData = false;
    return toastr.error(res.data.message, res.data.status);
  };


  $scope.genInvoiceSuccess=function(res){
    $scope.updatingTempData = false;
    toastr.success(res.body, "Success");
    $scope.modalInstance.close();
    _.each($scope.entriesForInvoice, entry=>
      $scope.onlyDrData = _.reject($scope.onlyDrData, item => item.id === entry.id)
    );
    return $scope.entriesForInvoice = [];
  };


    // $scope.getLedgerEntries()

  $scope.genInvoiceFailure = function(res) {
    if (res.data.code === "INVALID_TAX") {
      $scope.updatingTempData = false;
      return modalService.openConfirmModal({
        title: 'Something wrong with your invoice data',
        body: res.data.message+'\\n Do you still want to generate invoice with incorrect data.',
        ok: 'Generate Anyway',
        cancel: 'Cancel'
      }).then(() => $scope.saveTemp('generate', true));
    } else {
      $scope.updatingTempData = false;
      toastr.error(res.data.message, res.data.status);
      // if invoice date have any problem
      // if res.data.code is 'ENTRIES_AFTER_INOICEDATE'
      //   $scope.genMode = true
      // else if res.data.code is 'INVALID_INVOICE_DATE'
      //   $scope.genMode = true
      return $scope.genMode = true;
    }
  };

  // get inv templates
  if (!(_.isEmpty($rootScope.$stateParams.invId))) {
    let ledgerObj = DAServices.LedgerGet();
    if (!_.isEmpty(ledgerObj.ledgerData)) {
      $scope.loadInvoice(ledgerObj.ledgerData, ledgerObj.selectedAccount);
    } else {
      if (!_.isNull(localStorageService.get("_ledgerData"))) {
        let lgD = localStorageService.get("_ledgerData");
        let acD = localStorageService.get("_selectedAccount");
        $scope.loadInvoice(lgD, acD);
      }
    }
  }



  // invoice setting end

  // get ledger entries to generate invoice
  $scope.getLedgerEntries=function(){
    $scope.entriesForInvoice = [];
    $scope.prevInProg = false;
    let obj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      acntUname: $rootScope.$stateParams.invId,
      fromDate: $filter('date')($scope.dateData.fromDate, "dd-MM-yyyy"),
      toDate: $filter('date')($scope.dateData.toDate, "dd-MM-yyyy")
    };
    ledgerService.getLedger(obj).then($scope.getLedgerEntriesSuccess, $scope.getLedgerEntriesFailure);
    return $scope.entryListUpdated = false;
  };

  $scope.getLedgerEntriesSuccess = function(res){
    $scope.onlyDrData = [];
    _.each(res.body.ledgers, function(ledger) {
      if (ledger.transactions.length > 1) {
        ledger.multiEntry = true;
      } else {
        ledger.multiEntry = false;
      }
      let sharedData = _.omit(ledger, 'transactions');
      sharedData.itemCheck = false;
      return _.each(ledger.transactions, function(transaction, index) {
        transaction.amount = parseFloat(transaction.amount).toFixed(2);
        let newEntry = {sharedData};
        newEntry.id = sharedData.uniqueName + "_" + index;
        if (($scope.selectedAccountCategory.toLowerCase() !== 'income') && (transaction.type === "DEBIT")) {
          newEntry.transactions = [transaction];
          $scope.onlyDrData.push(newEntry);
        }
        if (($scope.selectedAccountCategory.toLowerCase() === 'income') && (transaction.type === "CREDIT")) {
          newEntry.transactions = [transaction];
          return $scope.onlyDrData.push(newEntry);
        }
      });
    });
    $scope.onlyDrData = _.reject($scope.onlyDrData, item => item.sharedData.invoiceGenerated === true);
    if ($scope.onlyDrData.length === 0) {
      $scope.noDataDR = true;
    } else {
      $scope.noDataDR = false;
    }
    return $scope.entryListUpdated = true;
  };

  $scope.getLedgerEntriesFailure=function(res){
    toastr.error(res.data.message, res.data.status);
    return $scope.entryListUpdated = true;
  };

  $scope.summationForInvoice=function(ths, entry, index){
    if (entry.sharedData.multiEntry) {
      if (ths) {
        // create logic to select all multi Entries
        _.each($scope.onlyDrData, function(item){
          if (item.sharedData.uniqueName === entry.sharedData.uniqueName) {
            item.sharedData.itemCheck = true;
            return $scope.entriesForInvoice.push(item);
          }
        });
      } else {
        $scope.entriesForInvoice = _.filter($scope.entriesForInvoice, item => !(entry.sharedData.uniqueName === item.sharedData.uniqueName));
      }
    } else {
      if (ths) {
        $scope.entriesForInvoice.push(entry);
      } else {
        $scope.entriesForInvoice = _.reject($scope.entriesForInvoice, item => entry.id === item.id);
      }
    }

    if ($scope.entriesForInvoice.length > 0) {
      $scope.prevInProg= true;
    } else {
      $scope.prevInProg= false;
    }

    return entry.sharedData.itemCheck = ths;
  };

  $scope.prevAndGenInv=function(){
    $scope.genMode = true;
    $scope.prevInProg = true;
    let arr = [];
    _.each($scope.entriesForInvoice, entry=> arr.push(entry.sharedData.uniqueName));
    let data =
      {uniqueNames: _.uniq(arr)};

    let obj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      acntUname: $rootScope.$stateParams.invId
    };

    return accountService.prevInvoice(obj, data).then($scope.prevAndGenInvSuccess, $scope.prevAndGenInvFailure);
  };

  $scope.prevAndGenInvSuccess=function(res){
    $scope.prevInProg = false;
    return $scope.viewInvTemplate(res.body.template, 'edit', res.body);
  };


  $scope.prevAndGenInvFailure=function(res){
    $scope.prevInProg = false;
    $scope.entriesForInvoice = [];
    toastr.error(res.data.message, res.data.status);
    return $scope.resetAllCheckBoxes();
  };

  $scope.resetAllCheckBoxes = () =>
    _.each($scope.onlyDrData, dr => dr.sharedData.itemCheck = false)
  ;


  // get generated invoices list
  $scope.getInvList=function(){
    let obj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      acntUname: $rootScope.$stateParams.invId,
      fromDate: $filter('date')($scope.dateData.fromDate, "dd-MM-yyyy"),
      toDate: $filter('date')($scope.dateData.toDate, "dd-MM-yyyy")
    };
    return accountService.getInvList(obj).then($scope.getInvListSuccess, $scope.getInvListFailure);
  };

  $scope.getInvListSuccess=function(res){
    $scope.genInvList = [];
    _.extend($scope.genInvList , res.body);
    if ($scope.genInvList.length === 0) {
      return $scope.noDataGenInv = true;
    } else {
      return $scope.noDataGenInv = false;
    }
  };


  $scope.getInvListFailure=res=> toastr.error(res.data.message, res.data.status);

  $scope.summationForDownload=function(entry){
    $scope.radioChecked = true;
    $scope.nameForAction = [];
    return $scope.nameForAction.push(entry.invoiceNumber);
  };

  // mail Invoice
  $scope.sendInvEmail=function(emailData){
    let obj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      acntUname: $rootScope.$stateParams.invId
    };
    let sendData= {
      emailId: [],
      invoiceNumber: $scope.nameForAction
    };
    let data = angular.copy(emailData);
    data = data.replace(RegExp(' ', 'g'), '');
    let cdata = data.split(',');
    _.each(cdata, function(str) {
      if ($rootScope.validateEmail(str)) {
        return sendData.emailId.push(str);
      } else {
        toastr.warning("Enter valid Email ID", "Warning");
        data = '';
        sendData.emailId = [];
        return false;
      }
    });
    return accountService.mailInvoice(obj, sendData).then($scope.sendInvEmailSuccess, $scope.multiActionWithInvFailure);
  };

  $scope.sendInvEmailSuccess=function(res){
    toastr.success("Email sent successfully", "Success");
    return $scope.InvEmailData = {};
  };

  // delete invoice
  $scope.multiActionWithInv=function(type){
    if ($scope.nameForAction.length === 0) {
      toastr.warning("Something went wrong", "Warning");
      return false;
    }

    let obj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      acntUname: $rootScope.$stateParams.invId
    };

    if (type === 'delete') {
      obj.invoiceUniqueID= $scope.nameForAction[0];
      companyServices.delInv(obj).then($scope.delInvSuccess, $scope.multiActionWithInvFailure);
    }

    if (type === 'download') {
      let data= {
        invoiceNumber: $scope.nameForAction,
        template: ""
      };
      return accountService.downloadInvoice(obj, data).then($scope.downInvSuccess, $scope.multiActionWithInvFailure);
    }
  };

  // common failure message
  $scope.multiActionWithInvFailure=res=> toastr.error(res.data.message, res.data.status);

  $scope.delInvSuccess=function(res){
    toastr.success("Invoice deleted successfully", "Success");
    $scope.radioChecked = false;
    $scope.nameForAction = [];
    return $scope.getInvList();
  };

  $scope.downInvSuccess=function(res){
    let dataUri = `data:application/pdf;base64,${res.body}`;
    let a = document.createElement('a');
    a.download = $scope.nameForAction[0]+".pdf";
    a.href = dataUri;
    return a.click();
  };
    //close dialog box
    // if $scope.genPrevMode
    //   $scope.modalInstance.close()
    // $scope.genPrevMode = false

    // $scope.isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0
    // if $scope.msieBrowser()
    //   #$scope.openWindow("data:application/pdf;base64, " + res.body)
    //   window.navigator.msSaveBlob(file, 'abc.pdf')
    // else if $scope.isSafari
    //   modalInstance = $uibModal.open(
    //     template: '<div>
    //         <div class="modal-header">
    //           <h3 class="modal-title">Download File</h3>
    //         </div>
    //         <div class="modal-body">
    //           <p class="mrB">To download your file Click on button</p>
    //           <button onClick="window.open(\'data:application/pdf;base64, '+res.body+'\')" class="btn btn-primary">Download</button>
    //         </div>
    //         <div class="modal-footer">
    //           <button class="btn btn-default" ng-click="$dismiss()">Cancel</button>
    //         </div>
    //     </div>'
    //     size: "sm"
    //     backdrop: 'static'
    //     scope: $scope
    //   )
    // else
      // passthis = "data:application/pdf;base64, " + res.body
      // window.open(passthis)
    // a = document.createElement("a")
    // document.body.appendChild(a)
    // a.style = "display:none"
    // a.href = fileURL
    // a.download = $scope.nameForAction[0]+".pdf"
    // a.click()


  // preview of generated invoice
  $scope.prevGenerateInv=function(item){
    $scope.nameForAction = [];
    $scope.nameForAction.push(item.invoiceNumber);
    let obj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      acntUname: $rootScope.$stateParams.invId,
      invoiceUniqueID: item.invoiceNumber
    };
    return accountService.prevOfGenInvoice(obj).then($scope.prevGenerateInvSuccess, $scope.prevGenerateInvFailure);
  };

  $scope.prevGenerateInvSuccess=function(res){
    $scope.genPrevMode = true;
    $scope.viewInvTemplate( res.body.template, 'genprev', res.body);
    return $scope.tempType=
      {uniqueName: res.body.template.uniqueName};
  };

  $scope.prevGenerateInvFailure=res=> toastr.error(res.data.message, res.data.status);

  $scope.setDiffView=function(){
    let even = _.find($scope.templateList, item=> item.uniqueName === $scope.tempType.uniqueName);
    $scope.tempSet = even.sections;
    return $scope.defTempData.signatureType = $scope.tempSet.signatureType;
  };

  $scope.downInv=function(){
    let obj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      acntUname: $rootScope.$stateParams.invId
    };
    let data= {
      invoiceNumber: $scope.nameForAction,
      template: $scope.tempType.uniqueName
    };
    return accountService.downloadInvoice(obj, data).then($scope.downInvSuccess, $scope.multiActionWithInvFailure);
  };

  $scope.updateGeneratedInvoice = function() {
    if ($scope.editGenInvoice) {
      let data_ = {};
      angular.copy($scope.defTempData, data_);
      data_.account.data = data_.account.data.split('\n');
      let data = {};
      data.account = data_.account;
      data.entries = data_.entries;
      data.invoiceDetails = data_.invoiceDetails;
      let obj = {
        compUname : $rootScope.selectedCompany.uniqueName
      };
      accountService.updateInvoice(obj, data).then($scope.updateGeneratedInvoiceSuccess, $scope.updateGeneratedInvoiceFailure);
    }
    return $scope.editGenInvoice = true;
  };

  $scope.updateGeneratedInvoiceSuccess = function(res) {
    toastr.success(res.body);
    return $scope.editGenInvoice = false;
  };

  $scope.updateGeneratedInvoiceFailure = res => toastr.error(res.data.message);

  $scope.saveInvoiceSettings = function(action) {
    if (action === 'delete') {
      $scope.invoiceSettings.emailAddress = "";
    }
    if (_.isEmpty($scope.invoiceSettings.emailAddress)) {
      $scope.invoiceSettings.emailAddress = null;
    }
    let obj = {
      companyUniqueName : $rootScope.selectedCompany.uniqueName
    };
    return companyServices.saveInvoiceSetting(obj.companyUniqueName,$scope.invoiceSettings).then(res => $scope.saveInvoiceSettingsSuccess(res, action)
      , $scope.saveInvoiceSettingsFailure);
  };

  $scope.saveInvoiceSettingsSuccess = function(res,action) {
    if (action === 'delete') {
      toastr.error("Email deleted successfully.");
      return $scope.invoiceSettings.isEmailVerified = false;
    } else {
      return toastr.success(res.body);
    }
  };

  $scope.saveInvoiceSettingsFailure = res => toastr.error(res.data.message);

  // state change
  $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    // close accounts dropdown and false var if going upwords
    if (toState.name === "invoice.accounts") {
      $scope.toggleAcMenus(false);
      return $scope.invoiceLoadDone = false;
    }
  });

  $timeout(function() {
    $rootScope.basicInfo = localStorageService.get("_userDetails");
    if (!_.isEmpty($rootScope.selectedCompany)) {
      return $rootScope.cmpViewShow = true;
    }
  }
  ,1000);

  // init func on dom ready
  $timeout(function() {
    $scope.getTemplates();
    // get accounts
    $scope.getAllGroupsWithAcnt();

    // group list through api
    return $rootScope.getFlatAccountList($rootScope.selectedCompany.uniqueName);
  }

  ,10);

  $scope.redirectToState = state => $state.go(state);

  return $scope.$on('company-changed', function(event,changeData) {
    $rootScope.selectedCompany = localStorageService.get("_selectedCompany");
//    $scope.getMultipleSubgroupsWithAccounts($rootScope.selectedCompany.uniqueName,['sundry_debtors','revenue_from_operations'])
    // when company is changed, redirect to manage company page
    if (changeData.type === 'CHANGE') {
      return $scope.redirectToState('company.content.manage');
    }
  });
};

giddh.webApp.controller('invoiceController', invoiceController);