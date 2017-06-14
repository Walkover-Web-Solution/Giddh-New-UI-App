let invoice2controller = function($scope, $rootScope, invoiceService, toastr, accountService, $uibModal, companyServices, $timeout, DAServices, modalService, $filter, FileSaver) {
  let ic = this;
  $rootScope.cmpViewShow = true;
  $scope.checked = false;
  $scope.size = '105px';
  $scope.invoices = [];
  $scope.ledgers = [];
  $scope.selectedTab = 0;
  let sendForGenerate = [];
  $scope.filtersInvoice = {
    count: 12
  };
  $scope.filtersLedger = {
    count: 12
  };

  $scope.currentPage = function() {
    let currentPage = this.value;
    return console.log(currentPage);
  };

  $scope.counts = {
    12: 12,
    25: 25,
    50: 50,
    100: 100
  };
  $scope.flyDiv = false;
  $scope.invoiceCurrentPage = 1;
  $scope.ledgerCurrentPage = 1;
  $scope.sortVar = 'entryDate';
  $scope.reverse = false;
  $scope.sortVarInv = '';
  $scope.reverseInv = false;
  $scope.hideFilters = false;
  $scope.checkall = false;

  $scope.inCaseOfFailedInvoice = [];

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
  $scope.showPreview = false;
  $scope.canGenerateInvoice = false;
  $scope.mainCheckbox = false;

  $scope.range = function(size, start, end) {
    let ret = [];
    if (size < end) {
      end = size;
      if (size < $scope.gap) {
        start = 0;
      } else {
        start = size - ($scope.gap);
      }
    }
    let i = start;
    while (i < end) {
      ret.push(i);
      i++;
    }
    return ret;
  };

  $scope.sortInvoices = function(varName, reverseCond) {
    $scope.invoices.results = _.sortBy($scope.invoices.results, varName);
    if (varName === "invoiceNumberM") {
      let letsC = _.groupBy($scope.invoices.results, varName);
      let createA = [];
      _.each(letsC, function(item) {
        let pushThis = _.sortBy(item, "invoiceNumberP");
        return createA.push(pushThis);
      });
      $scope.invoices.results = _.flatten(createA);
    }
    if (reverseCond) {
      return $scope.invoices.results = $scope.invoices.results.reverse();
    }
  };


  $scope.prevPageInv = () => $scope.invoiceCurrentPage = $scope.invoiceCurrentPage - 1;

  $scope.nextPageInv = () => $scope.invoiceCurrentPage = $scope.invoiceCurrentPage + 1;

  $scope.prevPageLed = () => $scope.ledgerCurrentPage = $scope.ledgerCurrentPage - 1;

  $scope.nextPageLed = () => $scope.ledgerCurrentPage = $scope.ledgerCurrentPage + 1;

  $scope.setPage = function() {
    $scope.currentPage = this.n;
  };

  $scope.fromDatePickerOpen = function() {
    return this.fromDatePickerIsOpen = true;
  };

  $scope.toDatePickerOpen = function() {
    return this.toDatePickerIsOpen = true;
  };
  // end of date picker


  $scope.performAction = function(invoice) {
    this.success = res => $scope.getAllInvoices();
    this.failure = res => toastr.error(res.data.message);
    if ((invoice.account.name === undefined) || (invoice.account.name === null)) {
      return;
    } else {
      if (invoice.condition === "paid") {
        return $scope.modalInstance = $uibModal.open({
          templateUrl: 'public/webapp/invoice2/action/actionTransactions.html',
          size: "md",
          backdrop: 'static',
          scope: $scope,
          controller: 'actionTransactionController',
          resolve:{
            invoicePassed: invoice
          }
        });
      } else if (invoice.condition !== "") {
        let infoToSend = {
          companyUniqueName: $rootScope.selectedCompany.uniqueName,
          invoiceUniqueName: invoice.uniqueName
        };
        let dataToSend = {
          action: invoice.condition
        };
        return invoiceService.performAction(infoToSend, dataToSend).then(this.success, this.failure);
      }
    }
  };


  $scope.selectAll = function(checkOrNot) {};


  $scope.toggle = () => $scope.checked = !$scope.checked;

  $scope.setTab = function(value) {
    $scope.selectedTab = value;
    $timeout(( () => $scope.commonGoButtonClick()),2000);
    if (value === 2) {
      return $scope.hideFilters = true;
    } else {
      return $scope.hideFilters = false;
    }
  };

  $scope.commonGoButtonClick = function() {
    if ($scope.selectedTab === 0) {
      return $scope.getAllInvoices();
    } else if ($scope.selectedTab === 1) {
      $scope.ledgerCurrentPage = 1;
      $scope.inCaseOfFailedInvoice = [];
      sendForGenerate = [];
      return $scope.getAllTransaction();
    }
  };

  $scope.checkAccounts = function() {
    let tempList = [];
    _.each(sendForGenerate, entry => tempList.push(entry.account.uniqueName));
    let uniqueList = _.uniq(tempList);
    if ((uniqueList.length > 1) || (sendForGenerate.length === 0)) {
      return $scope.showPreview = false;
    } else {
      return $scope.showPreview = true;
    }
  };

  $scope.prevAndGenInv=function(){
    $scope.genMode = true;
    $scope.prevInProg = true;
    let arr = [];
    _.each(sendForGenerate, entry=> arr.push(entry.uniqueName));
    let data =
      {uniqueNames: _.uniq(arr)};

    let obj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      acntUname: sendForGenerate[0].account.uniqueName
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
    return toastr.error(res.data.message, res.data.status);
  };
//    $scope.resetAllCheckBoxes()

  $scope.getAllInvoices = function() {
    let infoToSend = {
      "companyUniqueName": $rootScope.selectedCompany.uniqueName,
      "fromDate": moment($scope.dateData.fromDate).format('DD-MM-YYYY'),
      "toDate": moment($scope.dateData.toDate).format('DD-MM-YYYY'),
      "count": $scope.filtersInvoice.count,
      "page": $scope.invoiceCurrentPage
    };
    let obj = {};
    if ($scope.filtersInvoice.account !== undefined) {
      obj.accountUniqueName = $scope.filtersInvoice.account.uniqueName;
    }
    obj.invoiceNumber = $scope.filtersInvoice.invoiceNumber;
    if ($scope.filtersInvoice.balanceDue !== undefined) {
      obj.balanceDue = $scope.filtersInvoice.balanceDue;
    }
    if ($scope.filtersInvoice.option !== undefined) {
      if ($scope.filtersInvoice.option === 'Greater than') {
        obj.balanceMoreThan = true;
      } else if ($scope.filtersInvoice.option === 'Less than') {
        obj.balanceLessThan = true;
      } else if ($scope.filtersInvoice.option === 'Equals') {
        obj.balanceEqual = true;
      } else if ($scope.filtersLedger.option === 'Greater than Equals') {
        obj.balanceMoreThan = true;
        obj.balanceEqual = true;
      } else if ($scope.filtersLedger.option === 'Less than Equals') {
        obj.balanceLessThan = true;
        obj.balanceEqual = true;
      }
    }
    return invoiceService.getInvoices(infoToSend, obj).then($scope.getInvoicesSuccess, $scope.getInvoicesFailure);
  };

  $scope.getInvoicesSuccess = function(res) {
    $scope.invoices = {};
    _.each(res.body.results, function(invoice) {
      let dateDivi = invoice.invoiceDate.split('-');
//      console.log(invoice.invoiceDate, moment(new Date(dateDivi[2], dateDivi[1], dateDivi[0])).format('DD-MM-YYYY'))
      invoice.invoiceDateObj = new Date(dateDivi[2], dateDivi[1], dateDivi[0]);
      let temp = invoice.invoiceNumber.split("-");
      if (temp[0] !== "x") {
        invoice.invoiceNumberM = Number(temp[0]);
        return invoice.invoiceNumberP = Number(temp[1]);
      } else {
        invoice.invoiceNumberM = Number(temp[1]);
        return invoice.invoiceNumberP = Number(temp[2]);
      }
    });
    $scope.invoices = res.body;
    if ($scope.invoices.length === 0) {
      return toastr.error("No invoices found.");
    }
  };

  $scope.getInvoicesFailure = function(res) {
    $scope.invoices = {};
    return toastr.error(res.data.message);
  };

  $scope.getAllTransaction = function() {
    $scope.searchInLedger = "";
    sendForGenerate = [];
    let infoToSend = {
      "companyUniqueName": $rootScope.selectedCompany.uniqueName,
      "fromDate": moment($scope.dateData.fromDate).format('DD-MM-YYYY'),
      "toDate": moment($scope.dateData.toDate).format('DD-MM-YYYY'),
      "count": $scope.filtersLedger.count,
      "page": $scope.ledgerCurrentPage
    };
    let obj = {};
    if ($scope.filtersLedger.account !== undefined) {
      obj.accountUniqueName = $scope.filtersLedger.account.uniqueName;
    }
    if ($scope.filtersLedger.entryTotal !== undefined) {
      obj.entryTotal = $scope.filtersLedger.entryTotal;
    }
    if ($scope.filtersLedger.option !== undefined) {
      if ($scope.filtersLedger.option === 'Greater than') {
        obj.totalIsMore = true;
      } else if ($scope.filtersLedger.option === 'Less than') {
        obj.totalIsLess = true;
      } else if ($scope.filtersLedger.option === 'Equals') {
        obj.totalIsEqual = true;
      } else if ($scope.filtersLedger.option === 'Greater than Equals') {
        obj.totalIsMore = true;
        obj.totalIsEqual = true;
      } else if ($scope.filtersLedger.option === 'Less than Equals') {
        obj.totalIsLess = true;
        obj.totalIsEqual = true;
      }
    }
    obj.description = $scope.filtersLedger.description;

    return invoiceService.getAllLedgers(infoToSend, obj).then($scope.getAllTransactionSuccess, $scope.getAllTransactionFailure);
  };

  $scope.getAllTransactionSuccess = function(res) {
    $scope.ledgers = {};
    return $scope.ledgers = res.body;
  };

  $scope.getAllTransactionFailure = function(res) {
    if (res.data.code === 'NO_ENTRIES_FOUND') {
      $scope.ledgers = {
        results: [],
        totalPages: 1
      };
      return $scope.buttonStatus();
    } else {
      return toastr.error(res.data.message);
    }
  };

  $scope.addThis = function(ledger, value) {
    if (value === true) {
      sendForGenerate.push(ledger);
    } else if (value === false) {
      let index = sendForGenerate.indexOf(ledger);
      sendForGenerate.splice(index, 1);
    }
    return $scope.buttonStatus();
  };


  $scope.buttonStatus = function() {
    if (sendForGenerate.length > 0) {
      $scope.canGenerateInvoice = true;
    } else {
      $scope.canGenerateInvoice = false;
    }
    return $scope.checkAccounts();
  };

  $scope.generateBulkInvoice = function(condition) {
    let selected = [];
    if (sendForGenerate.length <= 0) {
      return;
    }
    _.each(sendForGenerate, function(item) {
      let obj = {};
      obj.accUniqueName = item.account.uniqueName;
      obj.uniqueName = item.uniqueName;
      return selected.push(obj);
    });
    let generateInvoice = _.groupBy(selected, 'accUniqueName');
    let final = [];
    _.each(generateInvoice, function(inv) {
      let pushthis = {
        accountUniqueName: "",
        entries: []
      };
      let unqNameArr = [];
      _.each(inv, function(invoice) {
        pushthis.accountUniqueName = invoice.accUniqueName;
        return unqNameArr.push(invoice.uniqueName);
      });
      pushthis.entries = unqNameArr;
      return final.push(pushthis);
    });
    let infoToSend = {
      companyUniqueName: $rootScope.selectedCompany.uniqueName,
      combined: condition
    };
    return invoiceService.generateBulkInvoice(infoToSend, final).then($scope.generateBulkInvoiceSuccess, $scope.generateBulkInvoiceFailure);
  };

  $scope.generateBulkInvoiceSuccess = function(res) {
    $scope.checkall = false;
    // checkboxA = document.getElementsByName('checkall')
    // checkboxA[0].checked = false
    if (angular.isArray(res.body)) {
      $scope.inCaseOfFailedInvoice = res.body;
      
      if ($scope.inCaseOfFailedInvoice.length !== sendForGenerate.length) {
        toastr.success("Invoice generated successfully.");
      }

      if ($scope.inCaseOfFailedInvoice.length > 0) {
        let str = "";
        _.each($scope.inCaseOfFailedInvoice, failedInv => str = str + failedInv.failedEntries[0] + " " + failedInv.reason + ",");
        toastr.error(str);
      }
      _.each(sendForGenerate, function(removeThis) {
        let dontremove = false;
        if ($scope.inCaseOfFailedInvoice.length > 0) {
          _.each($scope.inCaseOfFailedInvoice, function(check) {
            if (check.failedEntries[0] === removeThis.uniqueName) {
              return dontremove = true;
            }
          });
        }
        if (dontremove === false) {
          let index = $scope.ledgers.results.indexOf(removeThis);
          return $scope.ledgers.results.splice(index, 1);
        }
      });
      sendForGenerate = [];
//      $scope.getAllTransaction()
    } else {
      toastr.success("Invoice generated successfully.");
      $scope.canGenerateInvoice = false;
      _.each(sendForGenerate, function(removeThis) {
        let index = $scope.ledgers.results.indexOf(removeThis);
        return $scope.ledgers.results.splice(index, 1);
      });
      sendForGenerate = [];
      $scope.getAllTransaction();
    }

    return $scope.buttonStatus();
  };

  $scope.generateBulkInvoiceFailure = res => toastr.error(res.data.message);

  $scope.checkTransaction = function(trns) {
    let sendThis = false;
    _.each($scope.inCaseOfFailedInvoice, inv =>
      _.each(inv.failedEntries, function(ent) {
        if (trns === ent) {
          return sendThis = true;
        }
      })
    );
    return sendThis;
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

  // preview of generated invoice
  $scope.prevGenerateInv=function(item){
    $scope.selectedInvoice = item;
    let obj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      acntUname: item.account.uniqueName,
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
    $scope.selectedInvoiceDetails = {};
    // set mode
    $scope.editMode = mode === 'edit' ? true : false;
    $scope.tempSet = template.sections;

    //_.extend($scope.defTempData , data)
    angular.copy(data, $scope.defTempData);
    $scope.defTempData.signatureType = $scope.tempSet.signatureType;
    angular.copy($scope.defTempData, $scope.selectedInvoiceDetails);
    //console.log $scope.selectedInvoice
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

  $scope.deleteInvoice = function(invoice) {
    let obj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      acntUname: invoice.account.uniqueName,
      invoiceUniqueID : invoice.invoiceNumber
    };
    return companyServices.delInv(obj).then($scope.delInvSuccess, $scope.multiActionWithInvFailure);
  };

  $scope.delInvSuccess=function(res){
    toastr.success("Invoice deleted successfully", "Success");
    $scope.radioChecked = false;
    $scope.selectedInvoice = {};
    return $scope.getAllInvoices();
  };

  $scope.downloadInv=function(){
    let obj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      acntUname: $scope.selectedInvoice.account.uniqueName
    };
    let data= {
      invoiceNumber: [$scope.selectedInvoice.invoiceNumber],
      template: $scope.tempType.uniqueName
    };
    return accountService.downloadInvoice(obj, data).then($scope.downloadInvSuccess, $scope.multiActionWithInvFailure);
  };

  $scope.b64toBlob = function(b64Data, contentType, sliceSize) {
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

  $scope.downloadInvSuccess=function(res){
    let data = $scope.b64toBlob(res.body, "application/pdf", 512);
    let blobUrl = URL.createObjectURL(data);
    ic.dlinv = blobUrl;
    return FileSaver.saveAs(data, $scope.selectedInvoice.invoiceNumber+".pdf");
  };


  // mail Invoice
  $scope.sendInvEmail=function(emailData){
    let obj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      acntUname: $scope.selectedInvoice.account.uniqueName
    };
    let sendData= {
      emailId: [],
      invoiceNumber: [$scope.selectedInvoice.invoiceNumber]
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
    if (data !== '') {
      return accountService.mailInvoice(obj, sendData).then($scope.sendInvEmailSuccess, $scope.multiActionWithInvFailure);
    }
  };

  $scope.sendInvEmailSuccess=function(res){
    toastr.success("Email sent successfully", "Success");
    $scope.InvEmailData = {};
    $(document).trigger('click');
    return false;
  };

  $scope.updateGeneratedInvoice = function() {
    if ($scope.editGenInvoice) {
      let data_ = {};
      angular.copy($scope.defTempData, data_);

      let matchThis = {};

      if (!(_.isEmpty(data_.account.data))) {
        data_.account.data = data_.account.data.split('\n');
      } else {
        data_.account.data = [];
      }

      angular.copy(data_, matchThis);

      let data = {};
      if (data_.termsStr === undefined) {
        data_.termsStr = "";
      }
      if (!angular.isArray(data_.termsStr)) {
        data.terms = data_.termsStr.split('\n');
      } else {
        data.terms = data_.termsStr;
      }
      data.account = data_.account;
      data.entries = data_.entries;
      data.invoiceDetails = data_.invoiceDetails;
      if ((data.invoiceDetails.dueDate !== "") && (data.invoiceDetails.dueDate !== undefined)) {
        data.invoiceDetails.dueDate = moment(data.invoiceDetails.dueDate).format('DD-MM-YYYY');
        if (moment(data.invoiceDetails.dueDate, "DD-MM-YYYY", true).isValid()) {
          data.invoiceDetails.dueDate = data.invoiceDetails.dueDate;
        } else {
          data.invoiceDetails.dueDate = null;
        }
      } else {
        data.invoiceDetails.dueDate = null;
      }
      let obj = {
        compUname : $rootScope.selectedCompany.uniqueName
      };
      let sendThis = {
        invoice: data,
        updateAccountDetails: false
      };

      if (($scope.selectedInvoiceDetails.account.name !== matchThis.account.name) || ($scope.selectedInvoiceDetails.account.attentionTo !== matchThis.account.attentionTo) || ($scope.selectedInvoiceDetails.account.data[0] !== matchThis.account.data[0]) || ($scope.selectedInvoiceDetails.account.mobileNumber !== matchThis.account.mobileNumber) || ($scope.selectedInvoiceDetails.account.email !== matchThis.account.email)) {
        modalService.openConfirmModal({
          title: 'Update',
          body: 'Would you also like to update account information in main account?',
          ok: 'Yes',
          cancel: 'No'
        }).then(
          function(res) {
            sendThis.updateAccountDetails = true;
            return accountService.updateInvoice(obj, sendThis).then($scope.updateGeneratedInvoiceSuccess, $scope.updateGeneratedInvoiceFailure);
          }
          ,function(res) {
            sendThis.updateAccountDetails = false;
            return accountService.updateInvoice(obj, sendThis).then($scope.updateGeneratedInvoiceSuccess, $scope.updateGeneratedInvoiceFailure);
        });
      } else {
        accountService.updateInvoice(obj, sendThis).then($scope.updateGeneratedInvoiceSuccess, $scope.updateGeneratedInvoiceFailure);
      }
    }
    return $scope.editGenInvoice = true;
  };

  $scope.updateGeneratedInvoiceSuccess = function(res) {
    toastr.success(res.body);
    return $scope.editGenInvoice = false;
  };

  $scope.updateGeneratedInvoiceFailure = res => toastr.error(res.data.message);


  // save template data
  $scope.saveTemp=function(stype, force){
    $scope.genMode = false;
    $scope.updatingTempData = true;
    let dData = {};
    let data = {};
    let matchThis = {};
    angular.copy($scope.defTempData, data);
    // company setting
    if (!(_.isEmpty(data.company.data))) {
      data.company.data = data.company.data.split('\n');
    }
    //data.company.data.replace(RegExp('\n', 'g'), ',')
    if (!(_.isEmpty(data.account.data))) {
      data.account.data = data.account.data.split('\n');
    }

    angular.copy(data, matchThis);
    if ((matchThis.account.data === "") || (matchThis.account.data === undefined)) {
      matchThis.account.data = [""];
    }
//    $scope.selectedInvoiceDetails.account.data = $scope.selectedInvoiceDetails.account.data.join("\n")

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

    if ((data.invoiceDetails.dueDate !== "") && (data.invoiceDetails.dueDate !== undefined)) {
      data.invoiceDetails.dueDate = moment(data.invoiceDetails.dueDate).format('DD-MM-YYYY');
      if (moment(data.invoiceDetails.dueDate, "DD-MM-YYYY", true).isValid()) {
        data.invoiceDetails.dueDate = data.invoiceDetails.dueDate;
      } else {
        data.invoiceDetails.dueDate = null;
      }
    } else {
      data.invoiceDetails.dueDate = null;
    }

    if (stype === 'save') {
      return companyServices.updtInvTempData($rootScope.selectedCompany.uniqueName, data).then($scope.saveTempSuccess, $scope.saveTempFailure);

    } else if (stype === 'generate') {
      _.omit(data, 'termsStr');
      let obj= {
        compUname: $rootScope.selectedCompany.uniqueName,
        acntUname: sendForGenerate[0].account.uniqueName
      };
      dData= {
        uniqueNames: data.ledgerUniqueNames,
        validateTax: true,
        invoice: _.omit(data, 'ledgerUniqueNames'),
        updateAccountDetails: false
      };
      if (force) {
        dData.validateTax = false;
      }

      if (moment(data.invoiceDetails.invoiceDate, "DD-MM-YYYY", true).isValid()) {
//        if $scope.defTempData.account.data.length == 0
//          $scope.defTempData.account.data = []
        if (dData.invoice.account.data.length === 0) {
          dData.invoice.account.data = [];
        }
        if (!_.isEqual($scope.selectedInvoiceDetails, matchThis)) {
          return modalService.openConfirmModal({
            title: 'Update',
            body: 'Would you also like to update account information in main account?',
            ok: 'Yes',
            cancel: 'No'
          }).then(
            function(res) {
              dData.updateAccountDetails = true;
              return accountService.genInvoice(obj, dData).then($scope.genInvoiceSuccess, $scope.genInvoiceFailure);
            }
            ,function(res) {
              dData.updateAccountDetails = false;
              return accountService.genInvoice(obj, dData).then($scope.genInvoiceSuccess, $scope.genInvoiceFailure);
          });
        } else {
          return accountService.genInvoice(obj, dData).then($scope.genInvoiceSuccess, $scope.genInvoiceFailure);
        }
//        else
//          toastr.error("Buyer's address can not be left blank.")
//          $scope.updatingTempData = false
//          $scope.genMode = true
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
    _.each(sendForGenerate, function(removeThis) {
      let index = $scope.ledgers.results.indexOf(removeThis);
      return $scope.ledgers.results.splice(index, 1);
    });
    sendForGenerate = [];
    $scope.buttonStatus();
    $scope.getAllTransaction();
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

//  # get inv templates
//  if not(_.isEmpty(sendForGenerate[0].account.uniqueName))
//    ledgerObj = DAServices.LedgerGet()
//    if !_.isEmpty(ledgerObj.ledgerData)
//      $scope.loadInvoice(ledgerObj.ledgerData, ledgerObj.selectedAccount)
//    else
//      if !_.isNull(localStorageService.get("_ledgerData"))
//        lgD = localStorageService.get("_ledgerData")
//        acD = localStorageService.get("_selectedAccount")
//        $scope.loadInvoice(lgD, acD)

  // Helper methods

  $scope.getTemplates = ()=> companyServices.getInvTemplates($rootScope.selectedCompany.uniqueName).then($scope.getTemplatesSuccess, $scope.getTemplatesFailure);

  $scope.getTemplatesSuccess=function(res){
    $scope.templateList = res.body.templates;
    return $scope.templateData = res.body.templateData;
  };

  $scope.getTemplatesFailure = res =>
//    $scope.invoiceLoadDone = true
    toastr.error(res.data.message, res.data.status)
  ;

  $scope.setDiffView=function(){
    let even = _.find($scope.templateList, item=> item.uniqueName === $scope.tempType.uniqueName);
    $scope.tempSet = even.sections;
    return $scope.defTempData.signatureType = $scope.tempSet.signatureType;
  };

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
    if ((typeof($scope.defTempData.terms) === 'object') && !(_.isEmpty($scope.defTempData.terms))) {
      $scope.defTempData.termsStr = $scope.defTempData.terms.join("\n");
    }
    return showPopUp;
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


  $scope.multiActionWithInvFailure=res=> toastr.error(res.data.message, res.data.status);
  // Helper methods ends here

  $scope.selectAllLedger = function(condition) {
    $scope.checkall = Boolean(condition);
    return _.each($scope.ledgers.results, function(ledger) {
      ledger.checked = condition;
      return $scope.addThis(ledger, condition);
    });
  };

  $scope.unCheckSelectedEntries = function(srchString) {
    if (srchString.length > 1) {
      return $scope.selectAllLedger(false);
    }
  };

  $timeout(( () => $scope.getTemplates()),2000);

  return $scope.broadcastToProforma = () => $scope.$broadcast("proformaSelect","");
};


giddh.webApp.controller('invoice2Controller', invoice2controller);