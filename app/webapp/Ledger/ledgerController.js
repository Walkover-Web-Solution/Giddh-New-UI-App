let ledgerController = function($scope, $rootScope, $window,localStorageService, toastr, modalService, ledgerService,FileSaver , $filter, DAServices, $stateParams, $timeout, $location, $document, permissionService, accountService, groupService, $uibModal, companyServices, $state,idbService, $http, nzTour, $q ) {
  let ledgerCtrl = this;
  ledgerCtrl.LedgerExport = false;
  ledgerCtrl.toggleShare = false;
  ledgerCtrl.getLink = true;

  ledgerCtrl.today = new Date();
  let d = moment(new Date()).subtract(8, 'month');
  ledgerCtrl.fromDate = {date: d._d};
  ledgerCtrl.toDate = {date: new Date()};
  ledgerCtrl.fromDatePickerIsOpen = false;
  ledgerCtrl.toDatePickerIsOpen = false;
  ledgerCtrl.format = "dd-MM-yyyy";
  ledgerCtrl.accountUnq = $stateParams.unqName;
  ledgerCtrl.showExportOption = false;
  ledgerCtrl.showLedgerPopover = false;
  ledgerCtrl.showExportOption = false;
  ledgerCtrl.showLedgers = false;
  ledgerCtrl.showEledger = true;
  ledgerCtrl.popover = {

    templateUrl: 'panel',
    draggable: false,
    position: "bottom"
  };
// mustafa
  
  ledgerCtrl.exportOptions = () => ledgerCtrl.showExportOption = !ledgerCtrl.showExportOption;

  ledgerCtrl.toggleShareFucntion = function() {
    ledgerCtrl.LedgerExport = false;
    ledgerCtrl.toggleShare = false;
    return ledgerCtrl.toggleShare = !ledgerCtrl.toggleShare;
  };

  ledgerCtrl.toggleExportFucntion = function() {
    ledgerCtrl.toggleShare = false;
    ledgerCtrl.LedgerExport = false;
    return ledgerCtrl.LedgerExport = !ledgerCtrl.LedgerExport;
  };

  ledgerCtrl.voucherTypeList = [
    {
      name: "Sales",
      shortCode: "sal"
    },
    {
      name: "Purchases",
      shortCode: "pur"
    },
    {
      name: "Receipt",
      shortCode: "rcpt"
    },
    {
      name: "Payment",
      shortCode: "pay"
    },
    {
      name: "Journal",
      shortCode: "jr"
    },
    {
      name: "Contra",
      shortCode: "cntr"
    },
    {
      name: "Debit Note",
      shortCode: "debit note"
    },
    {
      name: "Credit Note",
      shortCode: "credit note"
    }
  ];

  ledgerCtrl.toggleDropdown = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    return $scope.status.isopen = !$scope.status.isopen;
  };

  ledgerCtrl.shareLedger =() =>
    ledgerCtrl.shareModalInstance = $uibModal.open({
      templateUrl: '/public/webapp/Ledger/shareLedger.html',
      size: "md",
      backdrop: 'true',
      animation: true,
      scope: $scope
    })
  ;

  if (_.isUndefined($rootScope.selectedCompany)) {
    $rootScope.selectedCompany = localStorageService.get('_selectedCompany');
  }

  ledgerCtrl.accountUnq = $stateParams.unqName;

  ledgerCtrl.isCurrentAccount =acnt => acnt.uniqueName === ledgerCtrl.accountUnq;

  ledgerCtrl.loadDefaultAccount = function(acc) {
    
    this.success = function(res) {
      ledgerCtrl.accountUnq = 'cash';
      return ledgerCtrl.getAccountDetail(ledgerCtrl.accountUnq);
    };

    this.failure = function(res) {
      ledgerCtrl.accountUnq = 'sales';
      return ledgerCtrl.getAccountDetail(ledgerCtrl.accountUnq);
    };

    let unqObj = {
      compUname : $rootScope.selectedCompany.uniqueName,
      acntUname : 'cash'
    };
    return accountService.get(unqObj).then(this.success, this.failure);
  };

  ledgerCtrl.sortFlatAccListAlphabetically = function(list, property) {
    let sortedList = [];
    _.each(list, item => sortedList.push(item[property]));
    sortedList = sortedList.sort();
    return sortedList;
  };

  ledgerCtrl.getAccountDetail = function(accountUniqueName) {
    if (!_.isUndefined(accountUniqueName) && !_.isEmpty(accountUniqueName) && !_.isNull(accountUniqueName)) {
      let unqObj = {
        compUname : $rootScope.selectedCompany.uniqueName,
        acntUname : accountUniqueName
      };
      return accountService.get(unqObj)
      .then(
        res=> ledgerCtrl.getAccountDetailSuccess(res)
      ,error=> ledgerCtrl.getAccountDetailFailure(error));
    }
  };

  ledgerCtrl.getAccountDetailFailure = function(res) {
    if (ledgerCtrl.accountUnq !== 'sales') {
      return toastr.error(res.data.message, res.data.status);
    } else {
      let sortedAccList = ledgerCtrl.sortFlatAccListAlphabetically($rootScope.fltAccntListPaginated, 'uniqueName');
      return ledgerCtrl.getAccountDetail(sortedAccList[0]);
    }
  };

  ledgerCtrl.getAccountDetailSuccess = function(res) {
    localStorageService.set('_selectedAccount', res.body);
    $rootScope.selectedAccount = res.body;
    ledgerCtrl.accountToShow = $rootScope.selectedAccount;
    ledgerCtrl.accountUnq = res.body.uniqueName;
    ledgerCtrl.getTransactions(0);
    $state.go($state.current, {unqName: res.body.uniqueName}, {notify: false});
    if (res.body.uniqueName === 'cash') {
      $rootScope.ledgerState = true;
    }
    // ledgerCtrl.getPaginatedLedger(1)
    if ((res.body.yodleeAdded === true) && $rootScope.canUpdate) {
      //get bank transaction here
      return $timeout(( () => ledgerCtrl.getBankTransactions(res.body.uniqueName)), 2000);
    }
  };

  ledgerCtrl.hideEledger = () => ledgerCtrl.showEledger = !ledgerCtrl.showEledger;

  ledgerCtrl.getBankTransactions = function(accountUniqueName) {
    let unqObj = {
      compUname : $rootScope.selectedCompany.uniqueName,
      acntUname : accountUniqueName
    };
    // get other ledger transactions
    return ledgerService.getOtherTransactions(unqObj)
    .then(
      res=> ledgerCtrl.getBankTransactionsSuccess(res)
    ,error=> ledgerCtrl.getBankTransactionsFailure(error));
  };

  ledgerCtrl.getBankTransactionsFailure = res => toastr.error(res.data.message, res.data.status);

  ledgerCtrl.getBankTransactionsSuccess = function(res) {
    ledgerCtrl.eLedgerData = ledgerCtrl.formatBankLedgers(res.body);
    ledgerCtrl.calculateELedger();
    return ledgerCtrl.getReconciledEntries();
  };
    //ledgerCtrl.removeUpdatedBankLedger()

  ledgerCtrl.calculateELedger = function() {
    ledgerCtrl.eLedgType = undefined;
    ledgerCtrl.eCrBalAmnt = 0;
    ledgerCtrl.eDrBalAmnt = 0;
    ledgerCtrl.eDrTotal = 0;
    ledgerCtrl.eCrTotal = 0;
    let crt = 0;
    let drt = 0;
    _.each(ledgerCtrl.eLedgerData, ledger =>
      _.each(ledger.transactions, function(transaction) {
        if (transaction.type === 'DEBIT') {
          return drt += Number(transaction.amount);
        } else if (transaction.type === 'CREDIT') {
          return crt += Number(transaction.amount);
        }
      })
    );
    crt = parseFloat(crt);
    drt = parseFloat(drt);
    ledgerCtrl.eCrTotal = crt;
    return ledgerCtrl.eDrTotal = drt;
  };

  ledgerCtrl.getReconciledEntries = function(cheque, toMap, matchingEntries) {
    this.success = function(res) {
      ledgerCtrl.reconciledEntries = res.body;
      if (toMap) {
        _.each(ledgerCtrl.reconciledEntries, entry =>
          _.each(entry.transactions, function(txn) {
            if (txn.amount === ledgerCtrl.selectedLedger.transactions[0].amount) {
              return matchingEntries.push(entry);
            }
          })
        );
        if (matchingEntries.length === 1) {
          return ledgerCtrl.confirmBankTransactionMap(matchingEntries[0], ledgerCtrl.selectedLedger);
        } else if (matchingEntries.length >1) {
          return ledgerCtrl.showBankEntriesToMap(matchingEntries);
        } else {
          return toastr.error('no entry with matching amount found, please create a new entry with same amount as this transaction.');
        }
      }
    };

    this.failure = res => toastr.error(res.data.message);

    let reqParam = {
      companyUniqueName: $rootScope.selectedCompany.uniqueName,
      accountUniqueName: $rootScope.selectedAccount.uniqueName,
      from: $filter('date')($scope.cDate.startDate, 'dd-MM-yyyy'),
      to: $filter('date')($scope.cDate.endDate, 'dd-MM-yyyy'),
      chequeNumber: cheque

    };

    return ledgerService.getReconcileEntries(reqParam).then(this.success, this.failure);
  };
  
  // $rootScope.$on('account-selected', ()->
  //   ledgerCtrl.getAccountDetail(ledgerCtrl.accountUnq)
  //   #ledgerCtrl.isSelectedAccount()
  //   #$rootScope.$emit('catchBreadcumbs', ledgerCtrl.accountToShow.name)
  // )

  ledgerCtrl.matchBankTransaction = function() {
    let matchingEntries = [];
    return ledgerCtrl.getReconciledEntries('', true, matchingEntries);
  };


  ledgerCtrl.confirmBankTransactionMap = (mappedEntry, bankEntry) =>
    modalService.openConfirmModal({
        title: 'Map Bank Entry',
        body: `Selected bank transaction will be mapped with cheque number ${mappedEntry.chequeNumber}. Click yes to accept.`,
        ok: 'Yes',
        cancel: 'No'
      }).then(
          res => ledgerCtrl.mapBankTransaction(mappedEntry.uniqueName, bankEntry.transactionId),
          function(res) {} 
      )
  ;
  ledgerCtrl.mapBankTransaction = function(entryUnq, transactionId) {
    ledgerCtrl.selectedTxn.isOpen = false;
    this.success = function(res) {
      toastr.success(res.body);
      // ledgerCtrl.getPaginatedLedger(ledgerCtrl.currentPage)
      ledgerCtrl.getBankTransactions($rootScope.selectedAccount.uniqueName);
      return ledgerCtrl.getTransactions(ledgerCtrl.currentPage);
    };

    this.failure = res => toastr.error(res.data.message);

    let reqParam = {
      companyUniqueName: $rootScope.selectedCompany.uniqueName,
      accountUniqueName: $rootScope.selectedAccount.uniqueName,
      transactionId
    };
    let data = {
      uniqueName: entryUnq
    };
    return ledgerService.mapBankEntry(reqParam, data).then(this.success, this.failure);
  };

  ledgerCtrl.showBankEntriesToMap = function(matchingEntries) {
    ledgerCtrl.showMatchingEntries = true;
    return ledgerCtrl.matchingEntries = matchingEntries;
  };

  ledgerCtrl.formatBankLedgers = function(bankArray) {
    let formattedBankLedgers = [];
    if (bankArray.length > 0) {
      _.each(bankArray, function(bank) {
        let ledger = new blankLedgerObjectModel();
        ledger.entryDate = bank.date;
        ledger.isBankTransaction = true;
        ledger.transactionId = bank.transactionId;
        ledger.transactions = ledgerCtrl.formatBankTransactions(bank.transactions, bank, ledger);
        ledger.description = bank.description;
        return formattedBankLedgers.push(ledger);
      });
    }
    return formattedBankLedgers;
  };

  ledgerCtrl.formatBankTransactions = function(transactions, bank, ledger, type) {
    let formattedBanktxns = [];
    if (transactions.length > 0) {
      _.each(transactions, function(txn) {
        bank.description = txn.remarks.description;
        let newTxn = new txnModel();
        newTxn.particular = {};
        newTxn.particular.name = '';
        newTxn.particular.uniqueName = '';
        newTxn.amount = txn.amount;
        newTxn.type = txn.type;
        if (txn.type === 'DEBIT') {
          ledger.voucher.name = "Receipt";
          ledger.voucher.shortCode = "rcpt";
        } else { 
          ledger.voucher.name = "Payment";
          ledger.voucher.shortCode = "pay";
        }
        return formattedBanktxns.push(newTxn);
      });
    }
    return formattedBanktxns;
  };

  ledgerCtrl.mergeBankTransactions = function(toMerge) {
    if (toMerge) {
      ledgerCtrl.mergeTransaction = true;
      _.each(ledgerCtrl.eLedgerData, function(ld) {
        if (ld.uniqueName.length < 1) { ld.uniqueName = ld.transactionId; } else { ld.uniqueName; }
        if (ld.transactions[0].type === 'DEBIT') {
          return ledgerCtrl.dLedgerContainer.addAtTop(ld);
        } else if (ld.transactions[0].type === 'CREDIT') {
          return ledgerCtrl.cLedgerContainer.addAtTop(ld);
        }
      });
      // ledgerCtrl.ledgerData.ledgers.push(ledgerCtrl.eLedgerData)
      // ledgerCtrl.ledgerData.ledgers = ledgerCtrl.sortTransactions(_.flatten(ledgerCtrl.ledgerData.ledgers), 'entryDate')
      return ledgerCtrl.showEledger = false;
    } else {
    //   ledgerCtrl.AddBankTransactions()
    //   ledgerCtrl.showEledger = false
    // else
      ledgerCtrl.mergeTransaction = false;
      return ledgerCtrl.removeBankTransactions();
    }
  };
    //   ledgerCtrl.showEledger = true

  // ledgerCtrl.AddBankTransactions = () ->
  //   bankTxnDuplicate = ledgerCtrl.eLedgerData
  //   bankTxntoMerge = ledgerCtrl.fromBanktoLedgerObject(bankTxnDuplicate)
  //   ledgerCtrl.ledgerData.ledgers.push(bankTxntoMerge)
  //   ledgerCtrl.ledgerData.ledgers = _.flatten(ledgerCtrl.ledgerData.ledgers)

  ledgerCtrl.sortTransactions = function(ledger, sortType) {
    ledger = _.sortBy(ledger, sortType);
    ledger = ledger.reverse();
    return ledger;
  };

  ledgerCtrl.removeBankTransactions = function() {
    let withoutBankTxn = [];
    _.each(ledgerCtrl.cLedgerContainer.ledgerData, function(ledger) {
      if (ledger.isBankTransaction) { 
        return ledgerCtrl.cLedgerContainer.remove(ledger);
      }
    });
    _.each(ledgerCtrl.dLedgerContainer.ledgerData, function(ledger) {
      if (ledger.isBankTransaction) { 
        return ledgerCtrl.dLedgerContainer.remove(ledger);
      }
    });
    return ledgerCtrl.showEledger = true;
  };
  if (ledgerCtrl.accountUnq) {
    ledgerCtrl.getAccountDetail(ledgerCtrl.accountUnq);
  } else {
    ledgerCtrl.loadDefaultAccount(); 
  }

  /*date range picker */
  $scope.cDate = {
    startDate: moment().subtract(30, 'days')._d,
    endDate: moment()._d
  };


  $scope.singleDate = moment();
  $scope.opts = {
      locale: {
        applyClass: 'btn-green',
        applyLabel: 'Go',
        fromLabel: 'From',
        format: 'D-MMM-YY',
        toLabel: 'To',
        cancelLabel: 'Cancel',
        customRangeLabel: 'Custom range'
      },
      ranges: {
        'Last 1 Day': [
          moment().subtract(1, 'days'),
          moment()
        ],
        'Last 7 Days': [
          moment().subtract(6, 'days'),
          moment()
        ],
        'Last 30 Days': [
          moment().subtract(29, 'days'),
          moment()
        ],
        'Last 6 Months': [
          moment().subtract(6, 'months'),
          moment()
        ],
        'Last 1 Year': [
          moment().subtract(12, 'months'),
          moment()
        ]
      },
      eventHandlers : {
        'apply.daterangepicker'(e, picker) {
          $scope.cDate.startDate = e.model.startDate._d || e.model.startDate;
          $scope.cDate.endDate = e.model.endDate._d || e.model.endDate;
          return ledgerCtrl.getTransactions(0);
        }
      }
  };
  $scope.setStartDate = () => $scope.cDate.startDate = moment().subtract(4, 'days').toDate();

  $scope.setRange = () =>
    $scope.cDate = {
        startDate: moment().subtract(5, 'days'),
        endDate: moment()
      }
  ;
  /*date range picker end*/

  ledgerCtrl.selectedLedger = {
    description:null,
    entryDate:$filter('date')(new Date(), "dd-MM-yyyy"),
    invoiceGenerated:false,
    isCompoundEntry:false,
    tag:null,
    transactions:[{
      amount:0,
      rate:0,
      particular:{
        name:"",
        uniqueName:""
      },
      type:""
    }],
    unconfirmedEntry:false,
    isInclusiveTax: false,
    uniqueName:"",
    voucher:{
      name:"Sales",
      shortCode:"sal"
    },
    voucherNo:null,
    panel:{
      amount: 0,
      tax: 0,
      discount: 0,
      quantity:0,
      price:0
    }
  };

  var blankLedgerObjectModel = function() {
    return this.blankLedger = {
      isBlankLedger : true,
      attachedFileName: '',
      attachedFile: '',
      description:'',
      entryDate:$filter('date')(new Date(), "dd-MM-yyyy"),
      invoiceGenerated:false,
      isCompoundEntry:false,
      applyApplicableTaxes: false,
      tag:'',
      transactions:[],
      unconfirmedEntry:false,
      uniqueName:"",
      isInclusiveTax: false,
      voucher:{
        name:"Sales",
        shortCode:"sal"
      },
      tax: [],
      taxList : [],
      taxes: [],
      voucherNo:''
    };
  };


  let blankLedgerModel = function() {
    return this.blankLedger = {
      isBlankLedger : true,
      attachedFileName: '',
      attachedFile: '',
      description:'',
      entryDate:$filter('date')(new Date(), "dd-MM-yyyy"),
      invoiceGenerated:false,
      isCompoundEntry:false,
      applyApplicableTaxes: false,
      tag:'',
      transactions:[],
      unconfirmedEntry:false,
      uniqueName:"",
      isInclusiveTax: true,
      voucher:{
        name:"Sales",
        shortCode:"sal"
      },
      tax: [],
      taxList : [],
      taxes: [],
      voucherNo:''
    };
  };

  ledgerCtrl.dBlankTxn = {
    date: $filter('date')(new Date(), "dd-MM-yyyy"),
    particular: {
      name:'',
      uniqueName:''
    },
    amount : 0,
    type: 'DEBIT'
  };

  ledgerCtrl.cBlankTxn = {
    date: $filter('date')(new Date(), "dd-MM-yyyy"),
    particular: {
      name:'',
      uniqueName:''
    },
    amount : 0,
    type: 'CREDIT'
  };


  ledgerCtrl.blankLedger = new blankLedgerModel();
  ledgerCtrl.blankLedger.transactions.push(ledgerCtrl.dBlankTxn);
  ledgerCtrl.blankLedger.transactions.push(ledgerCtrl.cBlankTxn);

  var txnModel = function(type) {
    return this.ledger = {
      date: $filter('date')(new Date(), "dd-MM-yyyy"),
      particular: {
        name:"",
        uniqueName:""
      },
      amount : 0,
      type
    };
  };



  // ledgerCtrl.resetBlankLedger = () ->
  //   ledgerCtrl.newDebitTxn = {
  //     date: $filter('date')(new Date(), "dd-MM-yyyy")
  //     particular: {
  //       name:''
  //       uniqueName:''
  //     }
  //     amount : 0
  //     type: 'DEBIT'
  //   }
  //   ledgerCtrl.newCreditTxn = {
  //     date: $filter('date')(new Date(), "dd-MM-yyyy")
  //     particular: {
  //       name:''
  //       uniqueName:''
  //     }
  //     amount : 0
  //     type: 'CREDIT'
  //   }
//     ledgerCtrl.blankLedger = {
//       isBlankLedger : true
//       description:null
//       entryDate:$filter('date')(new Date(), "dd-MM-yyyy")
// #      hasCredit:false
// #      hasDebit:false
//       invoiceGenerated:false
//       isCompoundEntry:false
//       applyApplicableTaxes:false
//       tag:null
//       transactions:[
//         ledgerCtrl.newDebitTxn
//         ledgerCtrl.newCreditTxn
//       ]
//       unconfirmedEntry:false
//       isInclusiveTax: false
//       uniqueName:""
//       voucher:{
//         name:"Sales"
//         shortCode:"sal"
//       }
//       tax:[]
//       taxList: []
//       voucherNo:null
//     }


  // ledgerCtrl.ledgerPerPageCount = 10
  // ledgerCtrl.pages = []
  // ledgerCtrl.getPaginatedLedger = (page) ->
  //   @success = (res) ->
  //     ledgerCtrl.ledgerData = res.body
  //     ledgerCtrl.pages = []
  //     ledgerCtrl.paginatedLedgers = res.body.ledgers
  //     ledgerCtrl.totalLedgerPages = res.body.totalPages
  //     ledgerCtrl.currentPage = res.body.page
  //     ledgerCtrl.totalCreditTxn = res.body.totalCreditTransactions
  //     ledgerCtrl.totalDebitTxn = res.body.totalDebitTransactions
  //     ledgerCtrl.addLedgerPages()
  //     ledgerCtrl.calculateClosingBal(res.body.ledgers)

  //   @failure = (res) ->
  //     toastr.error(res.data.message)

  //   if _.isUndefined($rootScope.selectedCompany.uniqueName)
  //     $rootScope.selectedCompany = localStorageService.get("_selectedCompany")
  //   unqNamesObj = {
  //     compUname: $rootScope.selectedCompany.uniqueName
  //     acntUname: ledgerCtrl.accountUnq
  //     fromDate: $filter('date')($scope.cDate.startDate, "dd-MM-yyyy")
  //     toDate: $filter('date')($scope.cDate.endDate, "dd-MM-yyyy")
  //     count: ledgerCtrl.ledgerPerPageCount
  //     page: page || 1
  //     sort: 'desc'
  //   }
    // if not _.isEmpty(ledgerCtrl.accountUnq)
    //   ledgerService.getLedger(unqNamesObj).then(@success, @failure)

  //ledgerCtrl.getPaginatedLedger(1)

  ledgerCtrl.calculateClosingBal = function(ledgers) {
    let totalDebit = 0;
    let totalCredit = 0;
    _.each(ledgers, ledger =>
      _.each(ledger.transactions, function(txn) {
        if (txn.type === 'DEBIT') {
          return totalDebit += ledgerCtrl.cutToTwoDecimal(txn.amount);
        } else if (txn.type === 'CREDIT') {
          return totalCredit += ledgerCtrl.cutToTwoDecimal(txn.amount);
        }
      })
    );
    ledgerCtrl.totalCredit = totalCredit;
    return ledgerCtrl.totalDebit = totalDebit;
  };


  ledgerCtrl.addLedgerPages = function() {
    ledgerCtrl.pages = [];
    let i = 0;
    return (() => {
      let result = [];
      while (i <= ledgerCtrl.totalLedgerPages) {
        if (i > 0) {
          ledgerCtrl.pages.push(i);
        }
        result.push(i++);
      }
      return result;
    })();
  };

  //#--shared list--##
  ledgerCtrl.getSharedUserList = uniqueName => companyServices.shredList(uniqueName).then($scope.getSharedUserListSuccess, $scope.getSharedUserListFailure);

  ledgerCtrl.getSharedUserListSuccess = res => $scope.sharedUsersList = res.body;

  ledgerCtrl.getSharedUserListFailure = res => toastr.error(res.data.message, res.data.status);

  ledgerCtrl.getSharedList = function() {
    $scope.setShareableRoles($rootScope.selectedCompany);
    return $scope.getSharedUserList($rootScope.selectedCompany.uniqueName);
  };
  ledgerCtrl.getSharedList();
  // generate magic link
  ledgerCtrl.getMagicLink = function() {
    let accUname = ledgerCtrl.accountUnq;
    let reqParam = {
      companyUniqueName: $rootScope.selectedCompany.uniqueName,
      accountUniqueName: accUname,
      from: $filter('date')($scope.cDate.startDate, 'dd-MM-yyyy'),
      to: $filter('date')($scope.cDate.endDate, 'dd-MM-yyyy')
    };
    return companyServices.getMagicLink(reqParam).then(ledgerCtrl.getMagicLinkSuccess, ledgerCtrl.getMagicLinkFailure);
  };

  ledgerCtrl.getMagicLinkSuccess = res => ledgerCtrl.magicLink = res.body.magicLink;
    // modalInstance = $uibModal.open(
    //   template: '<div>
    //       <div class="modal-header">
    //         <button type="button" class="close" data-dismiss="modal" ng-click="$dismiss()" aria-label="Close"><span
    //     aria-hidden="true">&times;</span></button>
    //       <h3 class="modal-title">Magic Link</h3>
    //       </div>
    //       <div class="modal-body">
    //         <input id="magicLink" class="form-control" type="text" ng-model="ledgerCtrl.magicLink">
    //       </div>
    //       <div class="modal-footer">
    //         <button class="btn btn-default" ngclipboard data-clipboard-target="#magicLink">Copy</button>
    //       </div>
    //   </div>'
    //   size: "md"
    //   backdrop: 'static'
    //   scope: $scope
    // )
    // ledgerCtrl.getLink = false

  ledgerCtrl.getMagicLinkFailure = res => toastr.error(res.data.message);
// mustafa end


  ledgerCtrl.ledgerEmailData = {
    viewDetailed: "view-detailed",
    viewCondensed:"view-condensed",
    adminDetailed:"admin-detailed",
    adminCondensed:"admin-condensed"
  };
  ledgerCtrl.ledgerEmailData.emailType = ledgerCtrl.ledgerEmailData.viewDetailed;
  
// ledger send email
  ledgerCtrl.sendLedgEmail = function(emailData, emailType) {
    let data = emailData;
    if (_.isNull(ledgerCtrl.toDate.date) || _.isNull($scope.cDate.startDate)) {
      toastr.error("Date should be in proper format", "Error");
      return false;
    }
    let unqNamesObj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      acntUname: ledgerCtrl.accountUnq,
      toDate: $filter('date')($scope.cDate.endDate, "dd-MM-yyyy"),
      fromDate: $filter('date')($scope.cDate.startDate, "dd-MM-yyyy"),
      format: emailType
    };
    let sendData = {
      recipients: []
    };
    data = data.replace(RegExp(' ', 'g'), '');
    let cdata = data.split(',');
    _.each(cdata, function(str) {
      if ($rootScope.validateEmail(str)) {
        return sendData.recipients.push(str);
      } else {
        toastr.warning("Enter valid Email ID", "Warning");
        data = '';
        sendData.recipients = [];
        return false;
      }
    });
    if (sendData.recipients < 1) {
      if ($rootScope.validateEmail(data)) {
        sendData.recipients.push(data);
      } else {
        toastr.warning("Enter valid Email ID", "Warning");
        return false;
      }
    }

    return accountService.emailLedger(unqNamesObj, sendData).then(ledgerCtrl.emailLedgerSuccess, ledgerCtrl.emailLedgerFailure);
  };

  ledgerCtrl.emailLedgerSuccess = function(res) {
    toastr.success(res.body, res.status);
    //ledgerCtrl.ledgerEmailData.email = ''
    return ledgerCtrl.ledgerEmailData = {};
  };

  ledgerCtrl.emailLedgerFailure = res => toastr.error(res.data.message, res.data.status);

  // #export ledger
  // ledgerCtrl.exportLedger = (type)->
  //   ledgerCtrl.showExportOption = false
  //   unqNamesObj = {
  //     compUname: $rootScope.selectedCompany.uniqueName
  //     acntUname: ledgerCtrl.accountUnq
  //     fromDate: $filter('date')($scope.cDate.startDate, "dd-MM-yyyy")
  //     toDate: $filter('date')($scope.cDate.endDate, "dd-MM-yyyy")
  //     lType:type
  //   }
  //   accountService.exportLedger(unqNamesObj).then(ledgerCtrl.exportLedgerSuccess, ledgerCtrl.exportLedgerFailure)

  // ledgerCtrl.exportLedgerSuccess = (res)->
  //   # blob = new Blob([res.body.filePath], {type:'file'})
  //   # fileName = res.body.filePath.split('/')
  //   # fileName = fileName[fileName.length-1]
  //   # FileSaver.saveAs(blob, fileName)
  //   ledgerCtrl.isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0
  //   if $rootScope.msieBrowser()
  //     $rootScope.openWindow(res.body.filePath)
  //   else if ledgerCtrl.isSafari       
  //     modalInstance = $uibModal.open(
  //       template: '<div>
  //           <div class="modal-header">
  //             <h3 class="modal-title">Download File</h3>
  //           </div>
  //           <div class="modal-body">
  //             <p class="mrB">To download your file Click on button</p>
  //             <button onClick="window.open(\''+res.body.filePath+'\')" class="btn btn-primary">Download</button>
  //           </div>
  //           <div class="modal-footer">
  //             <button class="btn btn-default" ng-click="$dismiss()">Cancel</button>
  //           </div>
  //       </div>'
  //       size: "sm"
  //       backdrop: 'static'
  //       scope: $scope
  //     )
  //   else
  //     window.open(res.body.filePath)

  // ledgerCtrl.exportLedgerFailure = (res)->
  //   toastr.error(res.data.message, res.data.status)
  //   modalInstance = $uibModal.open(
  //     template: '<div>
  //         <div class="modal-header">
  //           <button type="button" class="close" data-dismiss="modal" ng-click="$dismiss()" aria-label="Close"><span
  //       aria-hidden="true">&times;</span></button>
  //         <h3 class="modal-title">Magic Link</h3>
  //         </div>
  //         <div class="modal-body">
  //           <input id="magicLink" class="form-control" type="text" ng-model="ledgerCtrl.magicLink">
  //         </div>
  //         <div class="modal-footer">
  //           <button class="btn btn-default" ngclipboard data-clipboard-target="#magicLink">Copy</button>
  //         </div>
  //     </div>'
  //     size: "md"
  //     backdrop: 'static'
  //     scope: $scope
  //   )

  ledgerCtrl.getMagicLinkFailure = res => toastr.error(res.data.message);

  ledgerCtrl.prevTxn = null;
  ledgerCtrl.selectBlankTxn = function(ledger, txn, index ,e) {
    if (txn.inventory && txn.inventory.quantity) {
      txn.rate = txn.amount/txn.inventory.quantity;
    }
    if (txn.particular.stock) {
      txn.rate = txn.particular.stock.rate;
    }
    ledgerCtrl.selectedTxn = txn;
    if (ledgerCtrl.prevTxn !== null) {
      ledgerCtrl.prevTxn.isOpen = false;
    }
    ledgerCtrl.selectedTxn.isOpen = true;
    ledgerCtrl.prevTxn = txn;
    ledgerCtrl.clearTaxSelection(txn, ledger);
    ledgerCtrl.clearDiscounts(ledger);
    // ledgerCtrl.addBlankRow(ledger, txn)
    // ledgerCtrl.removeBlankRowFromPrevLedger(ledgerCtrl.prevLedger, ledger)
    ledger.isCompoundEntry = true;
    if (ledgerCtrl.prevLedger && (ledgerCtrl.prevLedger.uniqueName !== ledger.uniqueName)) {
      ledgerCtrl.prevLedger.isCompoundEntry = false;
    }
    ledgerCtrl.prevLedger = ledger;
    // ledgerCtrl.calculateEntryTotal(ledger)
    ledgerCtrl.showLedgerPopover = true;
    ledgerCtrl.matchInventory(ledgerCtrl.selectedLedger);
    ledgerCtrl.ledgerBeforeEdit = {};
    angular.copy(ledger,ledgerCtrl.ledgerBeforeEdit);
    ledgerCtrl.isTransactionContainsTax(ledger);
    ledgerCtrl.selectedLedger = ledger;
    ledgerCtrl.selectedLedger.index = index;
    ledgerCtrl.selectedLedger.panel = ledgerCtrl.selectedLedger.panel || {};
    if (ledgerCtrl.accountToShow.stocks !== null) {
      //ledgerCtrl.selectedLedger.panel.quantity = ledgerCtrl.accountToShow.stock.stockUnit.quantityPerUnit
      ledgerCtrl.selectedLedger.panel.price = ledgerCtrl.accountToShow.stocks[0].rate;
    }
    ledgerCtrl.selectedLedger.panel.amount = ledgerCtrl.getPanelAmount(ledgerCtrl.selectedLedger);
    ledgerCtrl.selectedLedger.panel.total = ledgerCtrl.selectedLedger.panel.amount;
    ledgerCtrl.selectedLedger.panel.discount = ledgerCtrl.getTotalDiscount(ledgerCtrl.selectedLedger);
    ledgerCtrl.selectedLedger.panel.tax = ledgerCtrl.getTotalTax(ledgerCtrl.selectedLedger);
    // ledgerCtrl.selectedLedger.panel.total = ledgerCtrl.getEntryTotal(ledgerCtrl.selectedLedger)
    // if ledger.uniqueName != '' || ledger.uniqueName != undefined || ledger.uniqueName != null
    // ledgerCtrl.checkCompEntry(txn)
    // ledgerCtrl.blankCheckCompEntry(ledger)
    ledgerCtrl.prevLedger = ledger;
    return e.stopPropagation();
  };


  ledgerCtrl.selectTxn = function(ledger, txn, index ,e) {
    // if txn.inventory && txn.inventory.quantity
    //   txn.rate = txn.amount/txn.inventory.quantity
    // if txn.particular.stock
    //   txn.rate = txn.particular.stock.rate
    ledgerCtrl.selectedTxn = txn;
    if (ledgerCtrl.prevTxn !== null) {
      ledgerCtrl.prevTxn.isOpen = false;
    }
    ledgerCtrl.selectedTxn.isOpen = true;
    ledgerCtrl.prevTxn = txn;
    // ledgerCtrl.clearTaxSelection(ledger)
    // ledgerCtrl.clearDiscounts(ledger)
    if (!ledger.isBlankLedger) {
      ledgerCtrl.addBlankRow(ledger, txn);
    }
    // ledgerCtrl.removeBlankRowFromPrevLedger(ledgerCtrl.prevLedger, ledger)
    // ledger.isCompoundEntry = true
    // if ledgerCtrl.prevLedger && ledgerCtrl.prevLedger.uniqueName != ledger.uniqueName
    //   ledgerCtrl.prevLedger.isCompoundEntry = false
    // # ledgerCtrl.calculateEntryTotal(ledger)
    // ledgerCtrl.showLedgerPopover = true
    ledgerCtrl.matchInventory(ledgerCtrl.selectedLedger);
    ledgerCtrl.ledgerBeforeEdit = {};
    angular.copy(ledger,ledgerCtrl.ledgerBeforeEdit);
    // ledgerCtrl.isTransactionContainsTax(ledger)
    ledgerCtrl.selectedLedger = ledger;
    ledgerCtrl.selectedLedger.index = index;
    ledgerCtrl.createPanel(ledgerCtrl.selectedLedger);

    //ledgerCtrl.selectedLedger.panel.total = ledgerCtrl.getEntryTotal(ledgerCtrl.selectedLedger)
    //if ledger.uniqueName != '' || ledger.uniqueName != undefined || ledger.uniqueName != null
    // ledgerCtrl.checkCompEntry(txn)
    //ledgerCtrl.blankCheckCompEntry(ledger)
    ledgerCtrl.prevLedger = ledger;
    return e.stopPropagation();
  };

  ledgerCtrl.createPanel = function(ledger) {
    ledgerCtrl.selectedLedger.panel = {
      tax : 0,
      total: 0,
      discount: 0,
      amount: 0,
      price: 0
    };
    if (ledgerCtrl.accountToShow.stocks !== null) {
      ledgerCtrl.selectedLedger.panel.price = ledgerCtrl.accountToShow.stocks[0].rate;
    }
    ledgerCtrl.selectedLedger.panel.amount = ledgerCtrl.getPanelAmount(ledgerCtrl.selectedLedger);
    ledgerCtrl.selectedLedger.panel.total = ledgerCtrl.selectedLedger.panel.amount;
    ledgerCtrl.selectedLedger.panel.discount = ledgerCtrl.getTotalDiscount(ledgerCtrl.selectedLedger);
    return ledgerCtrl.selectedLedger.panel.tax = ledgerCtrl.getTotalTax(ledgerCtrl.selectedLedger);
  };

  ledgerCtrl.addBlankRow = function(ledger, txn) {
    let dBlankRow = _.findWhere(ledger.transactions, {blankRow:'DEBIT'});
    let cBlankRow = _.findWhere(ledger.transactions, {blankRow:'CREDIT'});
    if (!dBlankRow && (txn.type === 'DEBIT')) {
      txn = new txnModel('DEBIT');
      txn.blankRow = 'DEBIT';
      ledger.transactions.push(txn);
    } else if (dBlankRow && (dBlankRow.particular !== "") && dBlankRow.particular.uniqueName.length) {
      txn = new txnModel('DEBIT');
      txn.blankRow = 'DEBIT';
      ledger.transactions.push(txn);
      delete dBlankRow.blankRow;
    }

    if (!cBlankRow && (txn.type === 'CREDIT')) {
      txn = new txnModel('CREDIT');
      txn.blankRow = 'CREDIT';
      return ledger.transactions.push(txn);
    } else if (cBlankRow && (cBlankRow.particular !== "") && cBlankRow.particular.uniqueName.length) {
      txn = new txnModel('CREDIT');
      txn.blankRow = 'CREDIT';
      ledger.transactions.push(txn);
      return delete cBlankRow.blankRow;
    }
  };


  ledgerCtrl.removeBlankRowFromPrevLedger = function(prevLedger, ledger) {
    if (prevLedger && (prevLedger.uniqueName !== ledger.uniqueName)) {
      return _.each(prevLedger.transactions, function(txn, i) {
        if (txn.blankRow && (txn.particular.uniqueName === '')) {
          return prevLedger.transactions.splice(i, 1);
        }
      });
    }
  };

  ledgerCtrl.addBlankTxn = function(type, ledger) {
    let txn = new txnModel(type);
    let hasBlank = ledgerCtrl.checkForExistingblankTransaction(ledger, type);
    if (!hasBlank) {
      ledger.transactions.push(txn);
    }
    return ledgerCtrl.setFocusToBlankTxn(ledger, txn, type);
  };

  ledgerCtrl.checkForExistingblankTransaction = function(ledger, type) {
    let hasBlank = false;
    _.each(ledger.transactions, function(txn) {
      if ((txn.particular.uniqueName === "") && (type === txn.type)) {
        return hasBlank = true;
      }
    });
    return hasBlank;
  };

  ledgerCtrl.setFocusToBlankTxn = function(ledger, txn, type) {
    ledgerCtrl.prevTxn.isOpen = false;
    return _.each(ledger.transactions, function(txn) {
      if ((txn.particular.uniqueName === "") && (txn.type === type)) {
        txn.isOpen = true;
        return ledgerCtrl.prevTxn = txn;
      }
    });
  };

  ledgerCtrl.clearDiscounts = function(ledger) {
    if (ledgerCtrl.discountAccount) {
      return _.each(ledgerCtrl.discountAccount.accountDetails, account => account.amount = 0);
    }
  };

  ledgerCtrl.matchInventory = function(ledger) {
    if (ledger.transactions[0].inventory) {
      ledger.panel.quantity = ledger.transactions[0].inventory.quantity;
      ledger.panel.price = ledger.panel.amount / ledger.panel.quantity;
      // add stock name to transaction.particular to show on view
      ledger.transactions[0].particular.name += ` (${ledger.transactions[0].inventory.stock.name})`;
      ledger.showStock = true;
    }
    if (ledger.transactions[0].particular.stock) {
      ledger.panel.units = ledger.transactions[0].particular.stock.accountStockDetails.unitRates;
      ledger.panel.unit =  ledger.panel.units[0];
      if (ledger.panel.unit) {
        ledger.panel.price = ledger.panel.unit.rate;
      } else {
        ledger.panel.price = 0;
      }
      return ledger.showStock = true;
    }
  };
    
    // match = _.findWhere($rootScope.fltAccntListPaginated, {uniqueName:txn.particular.uniqueName})
    // if match && match.stocks != null
    //   txn.inventory = angular.copy(match.stock, txn.inventory)


  ledgerCtrl.isTransactionContainsTax = function(ledger) {
    if (ledger.taxes && (ledger.taxes.length > 0)) {
      ledger.taxList = [];
      return _.each(ledgerCtrl.taxList, function(tax) {
        if (ledger.taxes.indexOf(tax.uniqueName) !== -1) { 
          tax.isChecked = true;
          return ledger.taxList.push(tax);
        }
      });
    }
  };

  ledgerCtrl.getPanelAmount = function(ledger) {
    let amount = 0;
    if ((ledger.transactions.length > 1) && !ledger.isBlankLedger) {
      _.each(ledger.transactions, function(txn) {
        let acc = _.findWhere($rootScope.fltAccntListPaginated, {uniqueName:txn.particular.uniqueName});
        if (acc) {
          let parent = acc.parentGroups[0].uniqueName;
          let discount = _.findWhere(acc.parentGroups, {uniqueName:"discount"});
          let parentGroup = _.findWhere($rootScope.groupWithAccountsList, {uniqueName:parent}); 
          if ((parentGroup.category === "income") || ((parentGroup.category === "expenses") && !txn.isTax && (txn.particular.uniqueName !== 'roundoff') && !discount)) {
            amount += Number(txn.amount);
            return ledger.panel.show = true;
          }
        }
      });
    } else if (!ledger.isBlankLedger) {
      amount = Number(ledger.transactions[0].amount);
      ledger.panel.show = true;
    } else if (ledger.isBlankLedger) {
      _.each(ledger.transactions, txn => amount += Number(txn.amount));
    }
    return amount;
  };

  ledgerCtrl.getTotalDiscount = function(ledger) {
    let discount = 0;
    let amounts = [];
    if (ledgerCtrl.discountAccount !== undefined) {
      _.each(ledgerCtrl.discountAccount.accountDetails, function(account) {
        _.each(ledger.transactions, function(txn) {
          if (txn.particular.uniqueName === account.uniqueName) {
            return amounts.push(txn.amount);
          }
        });
        if (account.amount) {
          return discount += Number(account.amount);
        }
      });
      _.each(amounts, amount => discount += amount);
      ledger.panel.total = ledgerCtrl.cutToTwoDecimal((ledger.panel.amount - discount) + ((ledger.panel.tax*(ledger.panel.amount-discount))/100));
      ledger.panel.discount = ledgerCtrl.cutToTwoDecimal(discount);
    }
    return discount;
  };

  ledgerCtrl.getTotalTax = function(ledger) {
    let totalTax = 0;
    if (ledgerCtrl.taxList.length > 0) {
      _.each(ledgerCtrl.taxList, function(tax) {
        if (ledgerCtrl.isTaxApplicable(tax) && tax.isChecked) {
          let taxAmount = (ledger.panel.amount * ledgerCtrl.getApplicableTaxRate(tax)) /100;
          return totalTax += taxAmount;
        }
      });
    }
    let taxPercentage = ledgerCtrl.cutToTwoDecimal((totalTax/ledger.panel.amount)*100);
    ledger.panel.total = ledgerCtrl.cutToTwoDecimal((ledger.panel.amount - ledger.panel.discount) + ((taxPercentage*(ledger.panel.amount-ledger.panel.discount))/100));
    ledger.panel.tax = ledgerCtrl.cutToTwoDecimal(taxPercentage);
    return taxPercentage || 0;
  };

  ledgerCtrl.isTaxApplicable = function(tax) {
    let today = new Date();
    today = today.getTime();
    let isApplicable = false;
    _.each(tax.taxDetail, function(det) {
      if (today > ledgerCtrl.parseLedgerDate(det.date)) { 
        return isApplicable = true;
      }
    });
    return isApplicable;
  };

  ledgerCtrl.getApplicableTaxRate = function(tax) {
    let rate = 0;
    let today = new Date();
    today = today.getTime();
    _.each(tax.taxDetail, function(det) {
      if (today > ledgerCtrl.parseLedgerDate(det.date)) { 
        return rate = det.taxValue;
      }
    });
    return rate;
  };

  ledgerCtrl.parseLedgerDate = function(date) {
    date = date.split('-');
    date = new Date(date[2], date[1], date[0]).getTime();
    return date;
  };

  ledgerCtrl.onAmountChange = function(ledger) {
    ledgerCtrl.getTotalTax(ledger);
    ledgerCtrl.getTotalDiscount(ledger);
    if (ledgerCtrl.selectedLedger.panel.quantity > 0) {
      return ledgerCtrl.selectedLedger.panel.price = ledgerCtrl.cutToTwoDecimal(ledgerCtrl.selectedLedger.panel.amount / ledgerCtrl.selectedLedger.panel.quantity);
    }
  };

  ledgerCtrl.onQuantityChange = function(ledger) {
    ledgerCtrl.selectedLedger.panel.amount = ledgerCtrl.cutToTwoDecimal(ledgerCtrl.selectedLedger.panel.quantity * ledgerCtrl.selectedLedger.panel.price);
    ledgerCtrl.getTotalTax(ledger);
    return ledgerCtrl.getTotalDiscount(ledger);
  };

  ledgerCtrl.onPriceChange = function(ledger) {
    ledgerCtrl.selectedLedger.panel.amount = ledgerCtrl.cutToTwoDecimal(ledgerCtrl.selectedLedger.panel.quantity * ledgerCtrl.selectedLedger.panel.price);
    ledgerCtrl.getTotalTax(ledger);
    return ledgerCtrl.getTotalDiscount(ledger);
  };

  ledgerCtrl.onTxnAmountChange = function(txn){
    ledgerCtrl.selectedLedger.panel.amount = Number(txn.amount);
    ledgerCtrl.getTotalTax(ledgerCtrl.selectedLedger);
    return ledgerCtrl.getTotalDiscount(ledgerCtrl.selectedLedger);
  };

  ledgerCtrl.onTxnTotalChange = function(txn){
    ledgerCtrl.selectedLedger.panel.amount = ledgerCtrl.calculateAmountAfterInclusiveTax();
    if (ledgerCtrl.selectedLedger.panel.quantity > 0) {
      ledgerCtrl.selectedLedger.panel.price = ledgerCtrl.cutToTwoDecimal(ledgerCtrl.selectedLedger.panel.amount / ledgerCtrl.selectedLedger.panel.quantity);
    }
    return _.each(ledgerCtrl.selectedLedger.transactions, function(txn) {
      let acc = _.findWhere($rootScope.fltAccntListPaginated, {uniqueName:txn.particular.uniqueName});
      if (acc) {
        let parent = acc.parentGroups[0].uniqueName;
        let parentGroup = _.findWhere($rootScope.groupWithAccountsList, {uniqueName:parent}); 
        if ((parentGroup.category === "income") || ((parentGroup.category === "expenses") && !txn.isTax && (txn.particular.uniqueName !== 'roundoff'))) {
          return txn.amount = ledgerCtrl.selectedLedger.panel.amount;
        }
      }
    });
  };

    // ledgerCtrl.selectedLedger.isInclusiveTax = true
    // ledgerCtrl.getTotalTax(ledgerCtrl.selectedLedger)
    // ledgerCtrl.getTotalDiscount(ledgerCtrl.selectedLedger)

  ledgerCtrl.onStockUnitChange = () => ledgerCtrl.selectedLedger.panel.price = ledgerCtrl.selectedLedger.panel.unit.rate;

  ledgerCtrl.calculateAmountAfterInclusiveTax = function(tax) {
    let amount;
    if (!ledgerCtrl.selectedLedger.panel.discount) { 
      amount = (100*ledgerCtrl.selectedLedger.panel.total)/(100+(ledgerCtrl.selectedLedger.panel.tax||0));
    } else {
      amount = ((100*ledgerCtrl.selectedLedger.panel.total)/(100+(ledgerCtrl.selectedLedger.panel.tax||0))) + ledgerCtrl.selectedLedger.panel.discount;
    }
    amount = Number(amount.toFixed(2));
    return amount;    
  };

  ledgerCtrl.cutToTwoDecimal = function(num) {
    num = Number(num.toFixed(2));
    return num;
  };
    // num = num%1
    // if(num)
    //   num = num.toString()
    //   num = num.split('.')
    //   if num[1].length > 1
    //     num = num[0] + '.' + num[1][0] + num[1][1] + num[1][2]
    //   else
    //     num = num[0] + '.' + num[1][0]
    // num = Number(num)
    // return Math.ceil(num)


  ledgerCtrl.createEntry = function() {};

  ledgerCtrl.showExportOption = false;
  ledgerCtrl.exportOptions = () => ledgerCtrl.showExportOption = !ledgerCtrl.showExportOption;

  ledgerCtrl.exportLedger = function(type){
    ledgerCtrl.showExportOption = false;
    let unqNamesObj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      acntUname: ledgerCtrl.accountUnq,
      fromDate: $filter('date')($scope.cDate.startDate, "dd-MM-yyyy"),
      toDate: $filter('date')($scope.cDate.endDate, "dd-MM-yyyy"),
      lType:type
    };
    return accountService.exportLedger(unqNamesObj).then(ledgerCtrl.exportLedgerSuccess, ledgerCtrl.exportLedgerFailure);
  };

  ledgerCtrl.exportLedgerSuccess = function(res){
    let data = ledgerCtrl.b64toBlob(res.body, "application/vnd.ms-excel", 512);
    return FileSaver.saveAs(data, $rootScope.selectedAccount.name + '.xls');
  };
    // ledgerCtrl.isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0
    // if $rootScope.msieBrowser()
    //   $rootScope.openWindow(res.body.filePath)
    // else if ledgerCtrl.isSafari       
    //   modalInstance = $uibModal.open(
    //     template: '<div>
    //         <div class="modal-header">
    //           <h3 class="modal-title">Download File</h3>
    //         </div>
    //         <div class="modal-body">
    //           <p class="mrB">To download your file Click on button</p>
    //           <button onClick="window.open(\''+res.body.filePath+'\')" class="btn btn-primary">Download</button>
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
    //   window.open(res.body.filePath)

  ledgerCtrl.exportLedgerFailure = res=> toastr.error(res.data.message, res.data.status);

  ledgerCtrl.onValueChange = function(value, txn) {
    if (((txn.particular.stock !== null) &&  (txn.particular.stock !== undefined)) || (ledgerCtrl.accountToShow.stocks !== null) || (txn.inventory && txn.inventory.stock)) {
      switch (value) {
        case 'qty':
          if ((ledgerCtrl.selectedTxn.rate > 0) && ledgerCtrl.selectedTxn.inventory && ledgerCtrl.selectedTxn.inventory.quantity) {
            return ledgerCtrl.selectedTxn.amount = ledgerCtrl.selectedTxn.rate * ledgerCtrl.selectedTxn.inventory.quantity;
          }
          break;
        case 'amount':
          if (ledgerCtrl.selectedTxn.inventory && ledgerCtrl.selectedTxn.inventory.quantity) {
            return ledgerCtrl.selectedTxn.rate = ledgerCtrl.selectedTxn.amount/ledgerCtrl.selectedTxn.inventory.quantity;
          }
          break;
        case 'rate':
          if (ledgerCtrl.selectedTxn.inventory && ledgerCtrl.selectedTxn.inventory.quantity) {
              return ledgerCtrl.selectedTxn.amount = ledgerCtrl.selectedTxn.rate * ledgerCtrl.selectedTxn.inventory.quantity;
            }
          break;
      }
    }
  };

  ledgerCtrl.getTaxList = function() {
    ledgerCtrl.taxList = [];
    if ($rootScope.canUpdate && $rootScope.canDelete) {
      return companyServices.getTax($rootScope.selectedCompany.uniqueName).then(ledgerCtrl.getTaxListSuccess, ledgerCtrl.getTaxListFailure);
    }
  };

  ledgerCtrl.getTaxList();

  ledgerCtrl.getTaxListSuccess = res =>
    _.each(res.body, function(tax) {
      tax.isSelected = false;
      if (tax.account === null) {
        tax.account = {};
        tax.account.uniqueName = 0;
      }
      //check if selected account is a tax account
      if (tax.account.uniqueName === ledgerCtrl.accountToShow.uniqueName) {
        ledgerCtrl.accountToShow.isTax = true;
      }
      return ledgerCtrl.taxList.push(tax);
    })
  ;

    //ledgerCtrl.matchTaxAccounts(ledgerCtrl.taxList)

  ledgerCtrl.getTaxListFailure = res => toastr.error(res.data.message, res.status);

  ledgerCtrl.getDiscountGroupDetail = function() {
    this.success = res => ledgerCtrl.discountAccount = _.findWhere(res.body.results, {groupUniqueName:'discount'});
    this.failure = function(res) {};
    
    let reqParam = {};
    reqParam.companyUniqueName = $rootScope.selectedCompany.uniqueName;
    reqParam.q = 'discount';
    reqParam.page = 1;
    reqParam.count = 0;
    return groupService.getFlattenGroupAccList(reqParam).then(this.success, this.failure); 
  };

  // ledgerCtrl.getGroupsList = () ->
  //   @success = (res) ->
  //     ledgerCtrl.groupList = res.body
  //   @failure = (res) ->

  //   groupService.getGroupsWithoutAccountsCropped($rootScope.selectedCompany.uniqueName).then(@success, @failure)
  // ledgerCtrl.getGroupsList()

  ledgerCtrl.checkTransactionByUniqueName = function(transactions, uniqueName) {
    let hasTransaction = false;
    _.each(transactions, function(txn) {
      if (txn.particular.uniqueName === uniqueName) {
        return hasTransaction = true;
      }
    });
    return hasTransaction;
  };


  ledgerCtrl.addDiscountTxns = ledger =>
    _.each(ledgerCtrl.discountAccount.accountDetails, function(account) {
      if (account.amount > 0) {
        let txn = {};
        txn.amount = account.amount;
        txn.particular = {};
        txn.particular.uniqueName = account.uniqueName;
        txn.particular.name = account.name;
        txn.type = ledgerCtrl.selectedTxn.type;
        let hasDiscount = ledgerCtrl.checkTransactionByUniqueName(ledger.transactions,account.uniqueName);
        if (!hasDiscount) {
          return ledger.transactions.push(txn);
        }
      }
    })
  ;

  ledgerCtrl.removeBlankTransactions = ledger =>
    _.each(ledger.transactions, function(txn, i) {
      if (txn && txn.blankRow && (txn.particular.uniqueName === '')) {
        return ledger.transactions.splice(i, 1);
      }
    })
  ;

  ledgerCtrl.addStockDetails = function(ledger) {
    if (!ledger.transactions[0].inventory) {
      ledger.transactions[0].inventory = {};
      ledger.transactions[0].inventory.stock = ledger.transactions[0].particular.stocks[0];
      ledger.transactions[0].inventory.quantity = ledger.panel.quantity;
      ledger.transactions[0].inventory.unit = ledger.transactions[0].particular.stocks[0].stockUnit;
      return ledger.transactions[0].amount = ledger.panel.total;
    } else {
      ledger.transactions[0].inventory.quantity = ledger.panel.quantity;
      ledger.transactions[0].inventory.unit = ledger.panel.unit;
      if (ledger.transactions[0].amount !== ledger.panel.total) {
        return ledger.transactions[0].amount = ledger.panel.total;
      }
    }
  };

  ledgerCtrl.buildLedger = function(ledger) {
    ledgerCtrl.addDiscountTxns(ledger);
    ledgerCtrl.removeBlankTransactions(ledger);
    ledgerCtrl.addStockDetails(ledger);
    return ledger;
  };

  ledgerCtrl.lastSelectedLedger = {};
  ledgerCtrl.saveUpdateLedger = function(ledger) {
    ledger = ledgerCtrl.buildLedger(ledger);
    ledgerCtrl.lastSelectedLedger = ledger;
    //ledgerCtrl.formatInventoryTxns(ledger)
    if (ledgerCtrl.doingEntry === true) {
      return;
    }

    ledgerCtrl.doingEntry = true;
    ledgerCtrl.ledgerTxnChanged = false;
    if (ledger.isBankTransaction) {
      ledgerCtrl.btIndex = ledger.index;
    }
    delete ledger.isCompoundEntry;
    if (!_.isEmpty(ledger.voucher.shortCode)) { 
      let response, unqNamesObj;
      if (_.isEmpty(ledger.uniqueName)) {
        //add new entry
        unqNamesObj = {
          compUname: $rootScope.selectedCompany.uniqueName,
          acntUname: ledgerCtrl.accountUnq
        };
        delete ledger.uniqueName;
        delete ledger.voucherNo;
        let transactionsArray = [];
        let rejectedTransactions = [];
        transactionsArray = _.reject(ledger.transactions, function(led) {
         if ((led.particular === "") || (led.particular.uniqueName === "")) {
           rejectedTransactions.push(led);
           return led;
         }
        });
        ledger.transactions = transactionsArray;
        ledger.voucherType = ledger.voucher.shortCode;
        ledgerCtrl.addTaxesToLedger(ledger);
        if (ledger.transactions.length > 0) {
          if (ledger.transactions.length > 1) {
            ledgerCtrl.matchTaxTransactions(ledger.transactions, ledgerCtrl.taxList);
            ledgerCtrl.checkManualTaxTransaction(ledger.transactions, ledgerCtrl.ledgerBeforeEdit.transactions);
            ledgerCtrl.checkTaxCondition(ledger);
          }
          return ledgerService.createEntry(unqNamesObj, ledger).then(
            res => ledgerCtrl.addEntrySuccess(res, ledger),
            res => ledgerCtrl.addEntryFailure(res,rejectedTransactions, ledger));
        } else {
          ledgerCtrl.doingEntry = false;
          ledger.transactions = rejectedTransactions;
          response = {};
          response.data = {};
          response.data.message = "There must be at least a transaction to make an entry.";
          response.data.status = "Error";
          return ledgerCtrl.addEntryFailure(response,[]);
        }
//          toastr.error("There must be at least a transaction to make an entry.")
      } else {
        //update entry
        //ledgerCtrl.removeEmptyTransactions(ledger.transactions)
        _.each(ledger.transactions, function(txn) {
          if (!_.isEmpty(txn.particular.uniqueName)) {
            let particular = {};
            particular.name = txn.particular.name;
            particular.uniqueName = txn.particular.uniqueName;
            txn.particular = particular;
          }
          if (txn.inventory && ((txn.inventory.quantity === "") || (txn.inventory.quantity === undefined) || (txn.inventory.quantity === null))) {
            return delete txn.inventory;
          }
        });
  //      ledger.isInclusiveTax = false
        unqNamesObj = {
          compUname: $rootScope.selectedCompany.uniqueName,
          acntUname: ledgerCtrl.accountUnq,
          entUname: ledger.uniqueName
        };
        // transactionsArray = []
        // _.every(ledgerCtrl.blankLedger.transactions,(led) ->
        //   delete led.date
        //   delete led.parentGroups
        // )
        // _.each(ledger.)
        // transactionsArray = _.reject(ledgerCtrl.blankLedger.transactions, (led) ->
        //   led.particular.uniqueName == ""
        // )
        ledgerCtrl.addTaxesToLedger(ledger);
//        console.log ledger
        //ledger.transactions.push(transactionsArray)
        ledger.voucher = _.findWhere(ledgerCtrl.voucherTypeList,{'shortCode':ledger.voucher.shortCode});
        ledger.voucherType = ledger.voucher.shortCode;
        if (ledger.transactions.length > 0) {
          ledgerCtrl.matchTaxTransactions(ledger.transactions, ledgerCtrl.taxList);
          ledgerCtrl.matchTaxTransactions(ledgerCtrl.ledgerBeforeEdit.transactions, ledgerCtrl.taxList);
          ledgerCtrl.checkManualTaxTransaction(ledger.transactions, ledgerCtrl.ledgerBeforeEdit.transactions);
          let updatedTxns = ledgerCtrl.updateEntryTaxes(ledger.transactions);
          ledger.transactions = updatedTxns;
          ledgerCtrl.checkTaxCondition(ledger);
          let isModified = false;
          if (ledger.taxes.length > 0) {
            isModified = ledgerCtrl.checkPrincipleModifications(ledger, ledgerCtrl.ledgerBeforeEdit.transactions);
          }
          if (isModified) {
            ledgerCtrl.selectedTxn.isOpen = false;
            return modalService.openConfirmModal({
              title: 'Update',
              body: 'Principle transaction updated, Would you also like to update tax transactions?',
              ok: 'Yes',
              cancel: 'No'
            }).then(
                res => ledgerCtrl.UpdateEntry(ledger, unqNamesObj, true),
                res => ledgerCtrl.UpdateEntry(ledger, unqNamesObj, false));
          } else {
           return ledgerService.updateEntry(unqNamesObj, ledger).then(
             res => ledgerCtrl.updateEntrySuccess(res, ledger),
             res => ledgerCtrl.updateEntryFailure(res, ledger));
         }
        } else {
          ledgerCtrl.doingEntry = false;
          response = {};
          response.data = {};
          response.data.message = "There must be at least a transaction to make an entry.";
          response.data.status = "Error";
          return ledgerCtrl.addEntryFailure(response,[]);
        }
      }
    } else {
      return toastr.error("Select voucher type.");
    }
  };


  ledgerCtrl.checkTaxCondition = function(ledger) {
    let transactions = [];
    _.each(ledger.transactions, function(txn) {
      if (ledger.isInclusiveTax && !txn.isTax) {
        return transactions.push(txn);
      }
    });
    if (ledger.isInclusiveTax) {
      return ledger.transactions = transactions;
    }
  };

  ledgerCtrl.checkPrincipleModifications = function(ledger, uTxnList) {
    let withoutTaxesLedgerTxn = ledgerCtrl.getPrincipleTxnOnly(ledger.transactions);
    let withoutTaxesUtxnList = ledgerCtrl.getPrincipleTxnOnly(uTxnList);
    let isModified = false;
    if (withoutTaxesLedgerTxn.length === withoutTaxesUtxnList.length) {
      _.each(withoutTaxesLedgerTxn, (txn, idx) =>
        _.each(withoutTaxesUtxnList, function(uTxn, dx) {
          if (idx === dx) { 
            if ((txn.particular.uniqueName !== uTxn.particular.uniqueName) || (txn.amount !== uTxn.amount)) {
              return isModified = true;
            }
          }
        })
      );
    } else {
      isModified = true;
    }
    return isModified;
  };

  ledgerCtrl.checkManualTaxTransaction = function(txnList, uTxnList) {
    //console.log txnList.length, uTxnList.length
    _.each(txnList, function(txn) {
      txn.isManualTax = true;
      return _.each(uTxnList, function(uTxn) {
        if ((txn.particular.uniqueName === uTxn.particular.uniqueName) && txn.isTax) {
          return txn.isManualTax = false;
        }
      });
    }); 
  };

  ledgerCtrl.getPrincipleTxnOnly = function(txnList) {
    let transactions = [];
    _.each(txnList, function(txn) {
      if ((txn.isTax === undefined) || !txn.isTax) {
        return transactions.push(txn);
      }
    });
    return transactions;
  };

  ledgerCtrl.addTaxesToLedger = function(ledger) {
    ledger.taxes = [];
    return _.each(ledgerCtrl.taxList, function(tax) {
      if (tax.isChecked === true) {
        return ledger.taxes.push(tax.uniqueName);
      }
    });
  };

  ledgerCtrl.updateEntryTaxes = function(txnList) {
    let transactions = [];
    if (txnList.length > 1) {
      _.each(txnList, (txn, idx) =>
        _.each(ledgerCtrl.taxList, function(tax) {
          if ((txn.particular.uniqueName === tax.account.uniqueName) && !tax.isChecked) {
            if (!txn.isManualTax) {
              return txn.toRemove = true;
            }
          }
        })
      ); 
    }
              //transactions.push(txn)
              //txnList.splice(idx, 1)
    txnList = _.filter(txnList, txn=> (txn.toRemove === undefined) || (txn.toRemove === false));
    return txnList;
  };

  ledgerCtrl.isTransactionContainsTax = function(ledger) {
    if (ledger.taxes && (ledger.taxes.length > 0)) {
      ledger.taxList = [];
      return _.each(ledgerCtrl.taxList, function(tax) {
        if (ledger.taxes.indexOf(tax.uniqueName) !== -1) { 
          tax.isChecked = true;
          return ledger.taxList.push(tax);
        }
      });
    }
  };

    // if ledger.taxes != undefined && ledger.taxes.length > 0
    //   _.each(ledgerCtrl.taxList, (tax) ->
    //     tax.isChecked = false
    //     _.each(ledger.taxes, (taxe) ->
    //       if taxe == tax.uniqueName
    //         tax.isChecked = true
    //     )
    //   )
    // else
    //   _.each(ledgerCtrl.taxList, (tax) ->
    //     #tax.isChecked = false
    //     _.each(ledger.transactions, (txn) ->
    //       if txn.particular.uniqueName == tax.account.uniqueName
    //         tax.isChecked = true
    //     )
    //   )

  ledgerCtrl.UpdateEntry = function(ledger, unqNamesObj,removeTax) {
    if (removeTax === true) {
      ledgerCtrl.txnAfterRmovingTax = [];
      ledgerCtrl.removeTaxTxnOnPrincipleTxnModified(ledger.transactions);
      ledger.transactions = ledgerCtrl.txnAfterRmovingTax;
    }
    if (ledger.transactions.length > 0) {
      return ledgerService.updateEntry(unqNamesObj, ledger).then(
        res => ledgerCtrl.updateEntrySuccess(res, ledger),
        res => ledgerCtrl.updateEntryFailure(res, ledger));
    }
  };

  ledgerCtrl.matchTaxTransactions = (txnList, taxList) =>
    _.each(txnList, txn =>
      _.each(taxList, function(tax) {
        if (txn.particular.uniqueName === tax.account.uniqueName) {
          return txn.isTax = true;
        }
      })
    )
  ;

  ledgerCtrl.removeTaxTxnOnPrincipleTxnModified = txnList =>
    _.each(txnList, function(txn) {
      if (!txn.isTax) {
        return ledgerCtrl.txnAfterRmovingTax.push(txn);
      }
    })
  ;

  ledgerCtrl.resetBlankLedger = function() {
    ledgerCtrl.newDebitTxn = {
      date: $filter('date')(new Date(), "dd-MM-yyyy"),
      particular: {
        name:'',
        uniqueName:''
      },
      amount : 0,
      type: 'DEBIT'
    };
    ledgerCtrl.newCreditTxn = {
      date: $filter('date')(new Date(), "dd-MM-yyyy"),
      particular: {
        name:'',
        uniqueName:''
      },
      amount : 0,
      type: 'CREDIT'
    };
    return ledgerCtrl.blankLedger = {
      isBlankLedger : true,
      description:null,
      entryDate:$filter('date')(new Date(), "dd-MM-yyyy"),
//      hasCredit:false
//      hasDebit:false
      invoiceGenerated:false,
      isCompoundEntry:false,
      applyApplicableTaxes:false,
      tag:null,
      transactions:[
        ledgerCtrl.newDebitTxn,
        ledgerCtrl.newCreditTxn
      ],
      unconfirmedEntry:false,
      isInclusiveTax: false,
      uniqueName:"",
      voucher:{
        name:"Sales",
        shortCode:"sal"
      },
      tax:[],
      taxList: [],
      voucherNo:null
    };
  };

  ledgerCtrl.addEntrySuccess = function(res, ledger) {
    ledgerCtrl.doingEntry = false;
    ledger.failed = false;
    toastr.success("Entry created successfully", "Success");
    //addThisLedger = {}
    //_.extend(addThisLedger,ledgerCtrl.selectedLedger)
    //ledgerCtrl.ledgerData.ledgers.push(res.body)
    //ledgerCtrl.getLedgerData(false)
    // ledgerCtrl.getPaginatedLedger(ledgerCtrl.currentPage)
    ledgerCtrl.resetBlankLedger();
    ledgerCtrl.selectedLedger = ledgerCtrl.blankLedger;
    _.each(ledgerCtrl.taxList, tax => tax.isChecked = false);
    ledgerCtrl.selectedTxn.isOpen = false;
    if (ledgerCtrl.mergeTransaction) {
      $timeout(( () => ledgerCtrl.mergeBankTransactions(ledgerCtrl.mergeTransaction)), 2000);
    }
    //ledgerCtrl.updateLedgerData('new',res.body[0])
    //ledgerCtrl.addToIdb([res.body], ledgerCtrl.accountUnq)
    //ledgerCtrl.pushNewEntryToLedger(res.body)
    if (ledger.isBankTransaction) {
      ledgerCtrl.updateBankLedger(ledger);
    }
    //ledgerCtrl.getPaginatedLedger(ledgerCtrl.currentPage)
    return ledgerCtrl.getTransactions(ledgerCtrl.currentPage);
  };
    // $timeout ( ->
    //   ledgerCtrl.pageLoader = false
    //   ledgerCtrl.showLoader = false
    // ), 1000

  ledgerCtrl.addEntryFailure = function(res, rejectedTransactions, ledger) {
    ledgerCtrl.doingEntry = false;
    ledger.failed = true;
    toastr.error(res.data.message, res.data.status);
    if (rejectedTransactions.length > 0) {
      return _.each(rejectedTransactions, rTransaction => ledgerCtrl.selectedLedger.transactions.push(rTransaction));
    }
  };
    // $timeout ( ->
    //   ledgerCtrl.pageLoader = false
    //   ledgerCtrl.showLoader = false
    // ), 1000

  ledgerCtrl.updateBankLedger = function(ledger) {
    _.each(ledgerCtrl.eLedgerData, function(eledger, idx) {
      if (ledger.transactionId === eledger.transactionId) {
        return ledgerCtrl.eLedgerData.splice(idx, 1);
      }
    });
    //ledgerCtrl.getLedgerData()
    // ledgerCtrl.getPaginatedLedger(ledgerCtrl.currentPage)
    return ledgerCtrl.getTransactions(ledgerCtrl.currentPage);
  };

  // ledgerCtrl.pushNewEntryToLedger = (newLedgers) ->
  //   console.log newLedgers

    // _.each newLedgers, (ledger) ->
    //   ledgerCtrl.calculateEntryTotal(ledger)
    //   ledgerCtrl.ledgerData.ledgers.push(ledger)

  ledgerCtrl.resetLedger = function() {
    ledgerCtrl.resetBlankLedger();
    ledgerCtrl.selectedLedger = ledgerCtrl.blankLedger;
    return _.each(ledgerCtrl.taxList, tx => tx.isChecked = false);
  };

  ledgerCtrl.updateEntrySuccess = function(res, ledger) {
    ledgerCtrl.doingEntry = false;
    ledger.failed = false;
    toastr.success("Entry updated successfully.", "Success");
    //addThisLedger = {}
    //_.extend(addThisLedger,ledgerCtrl.blankLedger)
//    ledgerCtrl.ledgerData.ledgers.push(addThisLedger)
    //ledgerCtrl.getLedgerData(false)
    // ledgerCtrl.getPaginatedLedger(ledgerCtrl.currentPage)
    //_.extend(ledger, res.body)
    //ledgerCtrl.updateEntryOnUI(res.body)
    ledgerCtrl.resetBlankLedger();
    // ledgerCtrl.selectedLedger = ledgerCtrl.blankLedger
    ledgerCtrl.selectedLedger = res.body;
    ledgerCtrl.selectedTxn.isOpen = false;
    if (ledgerCtrl.mergeTransaction) {
      ledgerCtrl.mergeBankTransactions(ledgerCtrl.mergeTransaction);
    }
    //ledgerCtrl.dLedgerLimit = ledgerCtrl.dLedgerLimitBeforeUpdate
    //ledgerCtrl.openClosePopOver(res.body.transactions[0], res.body)
    //ledgerCtrl.updateLedgerData('update',res.body)
    $timeout(( () => ledger.total = ledgerCtrl.updatedLedgerTotal), 2000);
    // ledgerCtrl.getPaginatedLedger(ledgerCtrl.currentPage)
    return ledgerCtrl.getTransactions(ledgerCtrl.currentPage);
  };
    
  ledgerCtrl.updateEntryFailure = function(res, ledger) {
    ledgerCtrl.doingEntry = false;
    ledger = ledgerCtrl.ledgerBeforeEdit;
    return toastr.error(res.data.message, res.data.status);
  };
    // $timeout ( ->
    //   ledgerCtrl.pageLoader = false
    //   ledgerCtrl.showLoader = false
    // ), 1000
    
  ledgerCtrl.createLedger = function(ledger, type) {
    let txns = [];
    let tLdr = {};
    tLdr = angular.copy(ledger, tLdr);
    if (tLdr.transactions.length) {
      _.each(tLdr.transactions, function(txn) {
        if (txn.type === type) {
          return txns.push(txn);
        }
      });
      tLdr.transactions = txns;
    }
    return tLdr;
  };

  ledgerCtrl.closePopOverSingleLedger = ledger =>
    _.each(ledger.transactions, txn => txn.isOpen = false)
  ;

  ledgerCtrl.deleteEntryConfirm = ledger =>
    modalService.openConfirmModal({
      title: 'Delete',
      body: 'Are you sure you want to delete this entry?',
      ok: 'Yes',
      cancel: 'No'
    }).then(
      res => ledgerCtrl.deleteEntry(ledger),
      res => $dismiss())
  ;

  ledgerCtrl.deleteEntry = function(ledger) {
    // ledgerCtrl.pageLoader = true
    // ledgerCtrl.showLoader = true
    ledgerCtrl.lastSelectedLedger = ledger;
    if (((ledger.uniqueName === undefined) || _.isEmpty(ledger.uniqueName)) && (ledger.isBankTransaction)) {
      return;
    }
    let unqNamesObj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      acntUname: ledgerCtrl.accountUnq,
      entUname: ledger.uniqueName
    };
    if ((unqNamesObj.acntUname !== '') || (unqNamesObj.acntUname !== undefined)) {
      return ledgerService.deleteEntry(unqNamesObj).then(res => ledgerCtrl.deleteEntrySuccess(ledger, res)
      , ledgerCtrl.deleteEntryFailure);
    }
  };

  ledgerCtrl.deleteEntrySuccess = function(item, res) {
    toastr.success("Entry deleted successfully","Success");
    ledgerCtrl.removeDeletedLedger(item);
    ledgerCtrl.resetBlankLedger();
    ledgerCtrl.selectedLedger = ledgerCtrl.blankLedger;
    //ledgerCtrl.getLedgerData(false)
    // ledgerCtrl.getPaginatedLedger(ledgerCtrl.currentPage)
    ledgerCtrl.getTransactions(ledgerCtrl.currentPage);
    if (ledgerCtrl.mergeTransaction) {
      return $timeout(( () => ledgerCtrl.mergeBankTransactions(ledgerCtrl.mergeTransaction)), 2000);
    }
  };
//    ledgerCtrl.calculateLedger(ledgerCtrl.ledgerData, "deleted")
    //ledgerCtrl.updateLedgerData('delete')

  
  ledgerCtrl.deleteEntryFailure = res => toastr.error(res.data.message, res.data.status);

  ledgerCtrl.removeDeletedLedger = function(item) {
    if (ledgerCtrl.dLedgerContainer.ledgerData[item.uniqueName]) {
      ledgerCtrl.dLedgerContainer.remove(item);
    }
    if (ledgerCtrl.cLedgerContainer.ledgerData[item.uniqueName]) {
      return ledgerCtrl.cLedgerContainer.remove(item);
    }
  };

  ledgerCtrl.clearTaxSelection = ledger =>
    _.each(ledgerCtrl.taxList, function(tax) {
      if (ledger.taxes.indexOf(tax.uniqueName) === -1) {
        return tax.isChecked = false;
      }
    })
  ;

  ledgerCtrl.b64toBlob = function(b64Data, contentType, sliceSize) {
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


  $scope.invoiceFile = {};
  $scope.getInvoiceFile = function(files) {
    let file = files[0];
    let formData = new FormData();
    formData.append('file', file);
    formData.append('company', $rootScope.selectedCompany.uniqueName);

    this.success = function(res) {
      ledgerCtrl.selectedLedger.attachedFile = res.data.body.uniqueName;
      ledgerCtrl.selectedLedger.attachedFileName = res.data.body.name;
      return toastr.success('file uploaded successfully');
    };

    this.failure = function(res) {
      if (typeof res === 'object') {
        return toastr.error(res.data.message);
      } else {
        return toastr.error('Upload failed, please check that file size is less than 1 mb');
      }
    };

    let url = '/upload-invoice';
    return $http.post(url, formData, {
      transformRequest: angular.identity,
      headers: {'Content-Type': undefined}
    }).then(this.success, this.failure);
  };

  ledgerCtrl.downloadAttachedFile = function(file, e) {
    e.stopPropagation();
    this.success = function(res) {
      let data = ledgerCtrl.b64toBlob(res.body.uploadedFile, `image/${res.body.fileType}`);
      let blobUrl = URL.createObjectURL(data);
      return FileSaver.saveAs(data, res.body.name);
    };

    this.failure = res => toastr.error(res.data.message);
    let reqParam = {
      companyUniqueName: $rootScope.selectedCompany.uniqueName,
      accountsUniqueName: $rootScope.selectedAccount.uniqueName,
      file
    };
    return ledgerService.downloadInvoiceFile(reqParam).then(this.success, this.failure);
  };

  ledgerCtrl.deleteAttachedFile = () =>
    modalService.openConfirmModal({
      title: 'Delete',
      body: 'Are you sure you want to delete the attached file?',
      ok: 'Yes',
      cancel: 'No'
    }).then(
      function(res) { 
          ledgerCtrl.selectedLedger.attachedFile = '';
          return ledgerCtrl.selectedLedger.attachedFileName = '';
        },
      res => $dismiss())
  ;


  $timeout(( function() {
    ledgerCtrl.getDiscountGroupDetail();
    return ledgerCtrl.getTaxList();
  }), 3000);

  if (ledgerCtrl.accountUnq) {
    ledgerCtrl.getAccountDetail(ledgerCtrl.accountUnq);
  } else {
    ledgerCtrl.loadDefaultAccount(); 
  }

  $rootScope.$on('company-changed', function(event,changeData) {
    if (changeData.type === 'CHANGE') { 
      ledgerCtrl.loadDefaultAccount();
      return ledgerCtrl.getTaxList();
    }
  });

  $(document).on('click', function(e) {
    if (ledgerCtrl.prevTxn) {
      ledgerCtrl.prevTxn.isOpen = false;
    }
    return 0;
  });

//########################################################
  ledgerCtrl.ledgerPerPageCount = 15;
  ledgerCtrl.getTransactions = function(page) {
    this.success = function(res) {
      ledgerCtrl.txnData = res.body;
      ledgerCtrl.totalLedgerPages = res.body.totalPages;
      ledgerCtrl.currentPage = res.body.page;
      ledgerCtrl.totalCreditTxn = res.body.creditTransactionsCount;
      ledgerCtrl.totalDebitTxn = res.body.debitTransactionsCount;
      ledgerCtrl.totalCredit = ledgerCtrl.getTotalBalance(ledgerCtrl.txnData.creditTransactions);
      ledgerCtrl.totalDebit = ledgerCtrl.getTotalBalance(ledgerCtrl.txnData.debitTransactions);
      ledgerCtrl.addLedgerPages();
      ledgerCtrl.showLedgers = true;
      return ledgerCtrl.calculateReckonging(ledgerCtrl.txnData);
    };

    this.failure = res => toastr.error(res.data.message);

    if (_.isUndefined($rootScope.selectedCompany.uniqueName)) {
      $rootScope.selectedCompany = localStorageService.get("_selectedCompany");
    }
    let unqNamesObj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      acntUname: ledgerCtrl.accountUnq,
      fromDate: $filter('date')($scope.cDate.startDate, "dd-MM-yyyy"),
      toDate: $filter('date')($scope.cDate.endDate, "dd-MM-yyyy"),
      count: ledgerCtrl.ledgerPerPageCount,
      page,
      sort: 'asc',
      reversePage: false
    };
    if (!_.isEmpty(ledgerCtrl.accountUnq)) {
      return ledgerService.getAllTransactions(unqNamesObj).then(this.success, this.failure);
    }
  };

  ledgerCtrl.calculateReckonging = function() {
    if (ledgerCtrl.txnData.forwardedBalance.amount === 0) {
        let recTotal = 0;
        if (ledgerCtrl.txnData.creditTotal > ledgerCtrl.txnData.debitTotal) { recTotal = ledgerCtrl.txnData.creditTotal; } else { recTotal = ledgerCtrl.txnData.debitTotal; }
        ledgerCtrl.txnData.reckoningCreditTotal = recTotal;
        return ledgerCtrl.txnData.reckoningDebitTotal = recTotal;
    } else {
      if (ledgerCtrl.txnData.forwardedBalance.type === 'DEBIT') {
        if ((ledgerCtrl.txnData.forwardedBalance.amount + ledgerCtrl.txnData.debitTotal) <= ledgerCtrl.txnData.creditTotal) {
          ledgerCtrl.txnData.reckoningCreditTotal = ledgerCtrl.txnData.creditTotal;
          return ledgerCtrl.txnData.reckoningDebitTotal = ledgerCtrl.txnData.creditTotal;
        } else {
          ledgerCtrl.txnData.reckoningCreditTotal = ledgerCtrl.txnData.forwardedBalance.amount + ledgerCtrl.txnData.debitTotal;
          return ledgerCtrl.txnData.reckoningDebitTotal = ledgerCtrl.txnData.forwardedBalance.amount + ledgerCtrl.txnData.debitTotal;
        }
      } else {
        if ((ledgerCtrl.txnData.forwardedBalance.amount + ledgerCtrl.txnData.creditTotal) <= ledgerCtrl.txnData.debitTotal) {
          ledgerCtrl.txnData.reckoningCreditTotal = ledgerCtrl.txnData.debitTotal;
          return ledgerCtrl.txnData.reckoningDebitTotal = ledgerCtrl.txnData.debitTotal;
        } else {
          ledgerCtrl.txnData.reckoningCreditTotal = ledgerCtrl.txnData.forwardedBalance.amount + ledgerCtrl.txnData.creditTotal;
          return ledgerCtrl.txnData.reckoningDebitTotal = ledgerCtrl.txnData.forwardedBalance.amount + ledgerCtrl.txnData.creditTotal;
        }
      }
    }
  };

  ledgerCtrl.getEntryTotal = function(ledger) {
    let entryTotal = {};
    entryTotal.crTotal = 0;
    entryTotal.drTotal = 0;
    _.each(ledger.transactions, function(txn) {
      if (txn.type === 'DEBIT') {
        return entryTotal.drTotal += Number(txn.amount);
      } else {
        return entryTotal.crTotal += Number(txn.amount);
      }
    });
    if (entryTotal.drTotal > entryTotal.crTotal) { entryTotal.reckoning = entryTotal.drTotal; } else { entryTotal.reckoning = entryTotal.crTotal; }
    return entryTotal;
  };

  ledgerCtrl.selectCompoundEntry = txn => ledgerCtrl.currentTxn = txn;

  ledgerCtrl.fetchEntryDetails = function(entry) {
    ledgerCtrl.clickedTxn = entry;
    this.success = function(res) {
      ledgerCtrl.paginatedLedgers = [res.body];
      ledgerCtrl.selectedLedger = res.body;
      ledgerCtrl.clearTaxSelection(ledgerCtrl.selectedLedger);
      ledgerCtrl.clearDiscounts(ledgerCtrl.selectedLedger);
      ledgerCtrl.isTransactionContainsTax(ledgerCtrl.selectedLedger);
      ledgerCtrl.createPanel(ledgerCtrl.selectedLedger);
      ledgerCtrl.entryTotal = ledgerCtrl.getEntryTotal(ledgerCtrl.selectedLedger);
      ledgerCtrl.matchInventory(ledgerCtrl.selectedLedger);
      ledgerCtrl.ledgerBeforeEdit = {};
      angular.copy(res.body,ledgerCtrl.ledgerBeforeEdit);
      _.each(res.body.transactions, function(txn) {
        if (txn.particular.uniqueName === ledgerCtrl.clickedTxn.particular.uniqueName) {
          return ledgerCtrl.selectedTxn = txn;
        }
      });
      return ledgerCtrl.displayEntryModal();
    };

    this.failure = res => console.log(res);

    let reqParam = {
      compUname: $rootScope.selectedCompany.uniqueName,
      acntUname: $rootScope.selectedAccount.uniqueName,
      entUname: entry.entryUniqueName
    };

    return ledgerService.getEntry(reqParam).then(this.success,this.failure);
  };

  ledgerCtrl.displayEntryModal = function() {
    $scope.ledgerCtrl = ledgerCtrl;
    return ledgerCtrl.entryModalInstance = $uibModal.open({
      templateUrl: '/public/webapp/Ledger/entryPopup.html',
      size: "liq90",
      animation: true,
      backdrop: 'static',
      scope: $scope
    });
  };

  ledgerCtrl.getTotalBalance = function(transactions) {
    let total = 0;
    _.each(transactions, txn => total += ledgerCtrl.cutToTwoDecimal(txn.amount));
    return total;
  };


  ledgerCtrl.deleteEntryConfirm = () =>
    modalService.openConfirmModal({
      title: 'Delete',
      body: 'Are you sure you want to delete this entry?',
      ok: 'Yes',
      cancel: 'No'
    }).then(
      res => ledgerCtrl.deleteEntry(),
      res => $dismiss())
  ;

  ledgerCtrl.deleteEntry = function() {
    this.success = function(res) {
      toastr.success("Entry deleted successfully","Success");
      ledgerCtrl.getTransactions(ledgerCtrl.currentPage);
      return ledgerCtrl.entryModalInstance.close();
    };
    this.failure = res => toastr.error(res.data.message);
    let unqNamesObj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      acntUname: ledgerCtrl.accountUnq,
      entUname: ledgerCtrl.selectedLedger.uniqueName
    };
    if ((unqNamesObj.acntUname !== '') || (unqNamesObj.acntUname !== undefined)) {
      return ledgerService.deleteEntry(unqNamesObj).then(this.success, this.failure);
    }
  };

  ledgerCtrl.onEnterPress = function(e, index, ledger) {
    if (e.keyCode === 13) {
      $('#saveLedger').focus();
      e.stopPropagation();
    }
    if (e.keyCode === 9) {
      e.preventDefault();
      let pItems = $('.pItem');
      $(pItems[0]).find('input').focus();
    }
    return false;
  };

  ledgerCtrl.closeShareModal = function() {
    ledgerCtrl.magicLink = '';
    return ledgerCtrl.shareModalInstance.close();
  };


  return ledgerCtrl;
};
giddh.webApp.controller('ledgerController', ledgerController);