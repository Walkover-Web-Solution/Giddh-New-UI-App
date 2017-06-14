let ledgerController = function($scope, $rootScope, $window,localStorageService, toastr, modalService, ledgerService,FileSaver , $filter, DAServices, $stateParams, $timeout, $location, $document, permissionService, accountService, groupService, $uibModal, companyServices, $state,idbService, $http, nzTour, $q, invoiceService ) {
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
  ledgerCtrl.toggleShow = false;
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


  ledgerCtrl.createUnderstandingText = function(account, data, mode) {
    if (mode !== 'edit') {
      ledgerCtrl.understanding = _.findWhere(data, {accountType:account.accountType});
      if (ledgerCtrl.understanding) {
        ledgerCtrl.understanding.text.cr = ledgerCtrl.understanding.text.cr.replace("<accountName>", account.name);
        return ledgerCtrl.understanding.text.dr = ledgerCtrl.understanding.text.dr.replace("<accountName>", account.name);
      }
    } else {
      ledgerCtrl.understandingEditMode = _.findWhere(data, {accountType:account.accountType});
      if (ledgerCtrl.understandingEditMode) {
        ledgerCtrl.understandingEditMode.text.cr = ledgerCtrl.understandingEditMode.text.cr.replace("<accountName>", account.name);
        return ledgerCtrl.understandingEditMode.text.dr = ledgerCtrl.understandingEditMode.text.dr.replace("<accountName>", account.name);
      }
    }
  };


  ledgerCtrl.getUnderstanding = function(account) {
    this.success = function(res) {
      ledgerCtrl.understandingJson = res.data;
      return ledgerCtrl.createUnderstandingText(account, ledgerCtrl.understandingJson);
    };

    return $http.get('/understanding').then(this.success, this.failure);
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

  ledgerCtrl.ToggleClassTax = () => ledgerCtrl.toggleShowTax = !ledgerCtrl.toggleShowTax;

  ledgerCtrl.ToggleClassDiscount = () => ledgerCtrl.toggleShowDiscount = !ledgerCtrl.toggleShowDiscount;

  ledgerCtrl.shareLedger =() =>
    ledgerCtrl.shareModalInstance = $uibModal.open({
      templateUrl: 'public/webapp/Ledger/shareLedger.html',
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
    ledgerCtrl.getBankTransactions($rootScope.selectedAccount.uniqueName);
    $rootScope.getFlatAccountList($rootScope.selectedCompany.uniqueName);
    $state.go($state.current, {unqName: res.body.uniqueName}, {notify: false});
    if (res.body.uniqueName === 'cash') {
      $rootScope.ledgerState = true;
    }
    // ledgerCtrl.getPaginatedLedger(1)
    ledgerCtrl.getUnderstanding(res.body);
    if ((res.body.yodleeAdded === true) && $rootScope.canUpdate) {
      //get bank transaction here
      return $timeout(( () => ledgerCtrl.getBankTransactions($rootScope.selectedAccount.uniqueName)), 2000);
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


  /*date range picker */
  ledgerCtrl.resetDates = () =>
    $scope.cDate = {
      startDate: moment().subtract(30, 'days')._d,
      endDate: moment()._d
    }
  ;

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
    isInclusiveTax: true,
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
    amount : '',
    type: 'DEBIT'
  };

  ledgerCtrl.cBlankTxn = {
    date: $filter('date')(new Date(), "dd-MM-yyyy"),
    particular: {
      name:'',
      uniqueName:''
    },
    amount : '',
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
    if ($rootScope.canUpdate) {
      return $scope.getSharedUserList($rootScope.selectedCompany.uniqueName);
    }
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

  ledgerCtrl.hideSideMenu=()=> $rootScope.flyAccounts=false;

  ledgerCtrl.getMagicLinkFailure = res => toastr.error(res.data.message);

  ledgerCtrl.prevTxn = null;
  ledgerCtrl.selectBlankTxn = function(ledger, txn, index ,e) {

    // hide side menu
    ledgerCtrl.hideSideMenu();

    ledgerCtrl.selectedTxn = txn;
    if (ledgerCtrl.prevTxn !== null) {
      ledgerCtrl.prevTxn.isOpen = false;
    }
    ledgerCtrl.selectedTxn.isOpen = true;
    ledgerCtrl.selectedLedger = ledger;
    // ledgerCtrl.clearTaxSelection(txn, ledger)
    // ledgerCtrl.clearDiscounts(ledger)
    ledgerCtrl.isTransactionContainsTax(ledgerCtrl.selectedLedger);
    ledgerCtrl.createNewPanel(ledgerCtrl.selectedTxn, ledgerCtrl.selectedLedger);
    // ledgerCtrl.matchInventory(ledgerCtrl.selectedLedger)
    ledgerCtrl.prevTxn = txn;
    return e.stopPropagation();
  };


  ledgerCtrl.getNewPanelDiscount = function(ledger) {
    let discount = 0;
    if (ledgerCtrl.discountAccount !== undefined) {
      _.each(ledgerCtrl.discountAccount.accountDetails, function(account) {
        _.each(ledger.transactions, function(txn) {
          if (txn.particular.uniqueName === account.uniqueName) {
            return account.amount = txn.amount;
          }
        });
        if (account.amount) {
          return discount += Number(account.amount);
        }
      });
    }
    return discount;
  };

  ledgerCtrl.getNewPanelTax = function(txn, ledger) {
    let totalTax = 0;
    if (ledgerCtrl.taxList.length > 0) {
      _.each(ledgerCtrl.taxList, function(tax) {
        if (ledgerCtrl.isTaxApplicable(tax) && tax.isChecked) {
          let taxAmount = (txn.panel.amount * ledgerCtrl.getApplicableTaxRate(tax)) /100;
          return totalTax += taxAmount;
        }
      });
    }
    let taxPercentage = ledgerCtrl.cutToTwoDecimal((totalTax/txn.panel.amount)*100);
    txn.panel.total = ledgerCtrl.cutToTwoDecimal((txn.panel.amount - txn.panel.discount) + ((taxPercentage*(txn.panel.amount-txn.panel.discount))/100));
    return ledgerCtrl.cutToTwoDecimal(taxPercentage) || 0;
  };

  ledgerCtrl.createNewPanel = function(txn, ledger) {
    let panel = {};
    if ((typeof(txn.particular) === 'object') && (txn.particular.uniqueName.length < 1) && _.isEmpty(txn.amount)) {
      txn.panel = {
        tax : 0,
        total: 0,
        discount: 0,
        amount: 0,
        price: 0,
        unit: null,
        quantity: 0,
        units: []
      };
    }

    panel.getQuantity = function() {
      if (txn.panel.quantity !== undefined) {
        return ledgerCtrl.cutToTwoDecimal(panel.getAmount()/panel.getPrice());
      }
    };

    panel.getPrice = function() {
      if (txn.particular.stock) {
        let units = panel.getUnits();
        if (txn.panel.unit) {
          return txn.panel.unit.rate;
        } else if (units.length > 0) {
          return units[0].rate;
        }
      } else {
        return 0;
      }
    };

    panel.getUnits = function() {
      if (txn.particular.stock && (txn.particular.stock.accountStockDetails.unitRates.length > 0)) {
        return txn.particular.stock.accountStockDetails.unitRates;
      } else if ((txn.particular.uniqueName.length > 0) && txn.particular.stock) {
        txn.particular.stock.stockUnit.rate = 0;
        txn.particular.stock.stockUnit.stockUnitCode = txn.particular.stock.stockUnit.code;
        return [txn.particular.stock.stockUnit];
      } else {
        return txn.panel.units;
      }
    };

    panel.getAmount = function() {
      if (txn.panel.quantity > 0) {
        return txn.panel.quantity * txn.panel.price;
      } else {
        return Number(txn.amount);
      }
    };

    panel.getDiscount = function() {
      let discount;
      return discount = ledgerCtrl.getNewPanelDiscount(ledger);
    };

    panel.getTax = function() {
      let tax = ledgerCtrl.getNewPanelTax(txn, ledger);
      return tax;
    };

    panel.getTotal = function() {
      let amount = txn.panel.amount - txn.panel.discount;
      return txn.panel.total = ledgerCtrl.cutToTwoDecimal(amount + ((amount*txn.panel.tax)/100));
    };

    txn.panel.quantity = panel.getQuantity();
    txn.panel.price = panel.getPrice();
    txn.panel.units = panel.getUnits();
    txn.panel.unit = txn.panel.units[0];
    txn.panel.amount = panel.getAmount();
    txn.panel.disocunt = panel.getDiscount();
    txn.panel.tax = panel.getTax();
    return txn.panel.total = panel.getTotal();
  };


  ledgerCtrl.onNewPanelChange = function() {
    let change = this;

    change.quantity = function(txn, ledger) {
      txn.panel.amount = ledgerCtrl.cutToTwoDecimal(txn.panel.quantity * txn.panel.price);
      return change.getTotal(txn, ledger);
    };

    change.unit = function(txn, ledger) {
      txn.panel.price = ledgerCtrl.cutToFourDecimal(txn.panel.unit.rate);
      return txn.panel.quantity = ledgerCtrl.cutToTwoDecimal(txn.panel.amount / txn.panel.price);
    };
      //change.price(txn, ledger)

    change.price = function(txn, ledger) {
      txn.panel.amount = ledgerCtrl.cutToTwoDecimal(txn.panel.quantity * txn.panel.price);
      change.getTotal(txn, ledger);
      return change.tax(txn, ledger);
    };

    change.amount = function(txn, ledger) {
      txn.panel.price = ledgerCtrl.cutToFourDecimal(txn.panel.amount / txn.panel.quantity);
      txn.amount = txn.panel.amount;
      return change.getTotal(txn, ledger);
    };

    change.discount = function(txn, ledger) {
      txn.panel.discount = ledgerCtrl.getNewPanelDiscount(ledger);
      return change.getTotal(txn, ledger);
    };

    change.tax = function(txn, ledger) {
      txn.panel.tax = ledgerCtrl.getNewPanelTax(txn, ledger);
      return change.getTotal(txn, ledger);
    };

    change.txnAmount = function(txn, ledger) {
      txn.panel.amount = Number(txn.amount);
      change.tax(txn, ledger);
      // if txn.panel.quantity == undefined || txn.panel.quantity == 0
      return txn.panel.quantity = ledgerCtrl.cutToTwoDecimal(txn.panel.amount/txn.panel.price);
    };

    change.getTotal = function(txn, ledger) {
      let amount = txn.panel.amount - txn.panel.discount;
      txn.panel.total = amount + ((amount*txn.panel.tax)/100);
      return txn.amount = txn.panel.amount;
    };

    change.total = function(txn, ledger) {
      let amount;
      if (!txn.panel.discount) {
        amount = (100*txn.panel.total)/(100+(txn.panel.tax||0));
      } else {
        amount = ((100*txn.panel.total)/(100+(txn.panel.tax||0))) + txn.panel.discount;
      }
      return txn.panel.amount = Number(amount.toFixed(2));
    };
    return change;
  };


  ledgerCtrl.addApplicableTaxes = function(account) {
    if (account.applicableTaxes.length > 0) {
      _.each(ledgerCtrl.taxList, function(tax) {
        //taxInAccount = _.findWhere(account.applicableTaxes, tax.uniqueName)
        if (account.applicableTaxes.indexOf(tax.uniqueName) !== -1) {
          tax.isChecked = true;
          return ledgerCtrl.selectedLedger.taxList.push(tax);
        }
      });
      ledgerCtrl.selectedLedger.applyApplicableTaxes = true;
    } else {
      ledgerCtrl.selectedLedger.taxList = [];
      ledgerCtrl.selectedLedger.applyApplicableTaxes = false;
    }
    return ledgerCtrl.onNewPanelChange().tax(ledgerCtrl.selectedTxn, ledgerCtrl.blankLedger);
  };


  ledgerCtrl.selectTxn = function(ledger, txn, index ,e) {
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
    // ledgerCtrl.matchInventory(ledgerCtrl.selectedLedger)
    // ledgerCtrl.ledgerBeforeEdit = {}
    // angular.copy(ledger,ledgerCtrl.ledgerBeforeEdit)
    // # ledgerCtrl.isTransactionContainsTax(ledger)
    ledgerCtrl.selectedLedger = ledger;
    // ledgerCtrl.selectedLedger.index = index
    //ledgerCtrl.createPanel(ledgerCtrl.selectedLedger)

    //ledgerCtrl.selectedLedger.panel.total = ledgerCtrl.getEntryTotal(ledgerCtrl.selectedLedger)
    //if ledger.uniqueName != '' || ledger.uniqueName != undefined || ledger.uniqueName != null
    // ledgerCtrl.checkCompEntry(txn)
    //ledgerCtrl.blankCheckCompEntry(ledger)
    // ledgerCtrl.prevLedger = ledger
    return e.stopPropagation();
  };

  ledgerCtrl.createPanel = function(ledger) {
    ledgerCtrl.selectedLedger.panel = {
      tax : 0,
      total: 0,
      discount: 0,
      amount: 0,
      price: 0,
      unit: '',
      units: []
    };
    if (ledgerCtrl.accountToShow.stocks !== null) {
      ledgerCtrl.selectedLedger.panel.price = ledgerCtrl.accountToShow.stocks[0].rate;
    }
    ledgerCtrl.selectedLedger.panel.amount = ledgerCtrl.getPanelAmount(ledgerCtrl.selectedLedger);
    ledgerCtrl.selectedLedger.panel.total = ledgerCtrl.selectedLedger.panel.amount;
    ledgerCtrl.selectedLedger.panel.discount = ledgerCtrl.getTotalDiscount(ledgerCtrl.selectedLedger);
    ledgerCtrl.selectedLedger.panel.tax = ledgerCtrl.getTotalTax(ledgerCtrl.selectedLedger);
    let stockTxn = ledgerCtrl.getStockTxn(ledger);
    if (!_.isEmpty(stockTxn) && !stockTxn.particular.stock) {
      let stockAccount = ledgerCtrl.getStockAccountfromFlattenAccountList(stockTxn);
      if (stockAccount) {
        let linkedStock = _.findWhere(stockAccount.stocks, {uniqueName:stockTxn.inventory.stock.uniqueName});
        if (linkedStock) {
          ledgerCtrl.selectedLedger.panel.units = linkedStock.accountStockDetails.unitRates;
          return ledgerCtrl.selectedLedger.panel.unit = _.findWhere(ledgerCtrl.selectedLedger.panel.units, {stockUnitCode:stockTxn.inventory.unit.code});
        }
      }
    }
  };
    // else
    //   console.log stockTxn

  ledgerCtrl.getStockAccountfromFlattenAccountList = function(txn) {
    let account = _.findWhere($rootScope.fltAccntListPaginated, {uniqueName:txn.particular.uniqueName});
    return account;
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
      ledgerCtrl.createNewPanel(txn, ledger);
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
    return _.each(ledger.transactions, function(trn) {
      if ((trn.particular.uniqueName === "") && (trn.type === type)) {
        ledgerCtrl.createNewPanel(trn, ledger);
        trn.isOpen = true;
        return ledgerCtrl.prevTxn = trn;
      }
    });
  };

  ledgerCtrl.clearDiscounts = function(ledger) {
    if (ledgerCtrl.discountAccount) {
      return _.each(ledgerCtrl.discountAccount.accountDetails, account => account.amount = 0);
    }
  };

  ledgerCtrl.matchInventory = function(ledger) {
    let stockTxn = ledgerCtrl.getStockTxn(ledger);
    if (stockTxn && stockTxn.inventory) {
      ledger.panel.quantity = stockTxn.inventory.quantity;
      ledger.panel.price = ledgerCtrl.cutToFourDecimal(ledger.panel.amount / ledger.panel.quantity);
      // add stock name to transaction.particular to show on view when particular is not changed
      if ((Object.keys(stockTxn.particular).length === 2) && !stockTxn.particular.stock) {
        stockTxn.particular.name += ` (${stockTxn.inventory.stock.name})`;
      }
      ledger.showStock = true;
    }
    if (stockTxn.particular && stockTxn.particular.stock) {
      if (stockTxn.particular.stock.accountStockDetails.unitRates.length > 0) {
        ledger.panel.units = stockTxn.particular.stock.accountStockDetails.unitRates;
        ledger.panel.unit =  ledger.panel.units[0];
      } else {
        stockTxn.particular.stock.stockUnit.rate = ledgerCtrl.cutToFourDecimal(ledger.panel.amount / ledger.panel.quantity);
        stockTxn.particular.stock.stockUnit.stockUnitCode = stockTxn.particular.stock.stockUnit.code;
        ledger.panel.units = [stockTxn.particular.stock.stockUnit];
        ledger.panel.unit =  ledger.panel.units[0];
      }
      if (ledger.panel.unit) {
        ledger.panel.price = ledger.panel.unit.rate;
      } else {
        ledger.panel.price = 0;
      }
      // add stock name to transaction.particular to show on view when particular is changed
      stockTxn.particular.name += ` (${stockTxn.particular.stock.name})`;
      return ledger.showStock = true;
    }
  };

    // match = _.findWhere($rootScope.fltAccntListPaginated, {uniqueName:txn.particular.uniqueName})
    // if match && match.stocks != null
    //   txn.inventory = angular.copy(match.stock, txn.inventory)

  ledgerCtrl.isDiscountTxn = function(txn) {
    let isDiscount = false;
    let dTxn = _.findWhere(ledgerCtrl.discountAccount.accountDetails, {uniqueName: txn.particular.uniqueName});
    if (dTxn) {
      isDiscount = true;
    }
    return isDiscount;
  };


  // ledgerCtrl.isTransactionContainsTax = (ledger) ->
  //   if ledger.taxes and ledger.taxes.length > 0
  //     _.each ledgerCtrl.taxList, (tax) ->
  //       if ledger.taxes.indexOf(tax.uniqueName) != -1
  //         tax.isChecked = true

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
        if (account.amount) {
          discount += Number(account.amount);
        }
        return _.each(ledger.transactions, function(txn) {
          if (txn.particular.uniqueName === account.uniqueName) {
            return txn.amount = account.amount;
          }
        });
      });
            // amounts.push(txn.amount)
        // if account.amount
      //       discount += Number(account.amount)
      // # _.each amounts, (amount) ->
      // #   discount += amount
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
    date = date[2] + '-' + date[1] + '-' + date[0];
    date = new Date(date).getTime();
    return date;
  };

  ledgerCtrl.onAmountChange = function(ledger) {
    ledgerCtrl.getTotalTax(ledger);
    ledgerCtrl.getTotalDiscount(ledger);
    if (ledgerCtrl.selectedLedger.panel.quantity > 0) {
      return ledgerCtrl.selectedLedger.panel.price = ledgerCtrl.cutToFourDecimal(ledgerCtrl.selectedLedger.panel.amount / ledgerCtrl.selectedLedger.panel.quantity);
    }
  };


  ledgerCtrl.onQuantityChange = function(ledger) {
    ledgerCtrl.selectedLedger.panel.amount = ledgerCtrl.cutToTwoDecimal(ledgerCtrl.selectedLedger.panel.quantity * ledgerCtrl.selectedLedger.panel.price);
    ledgerCtrl.getTotalTax(ledger);
    ledgerCtrl.getTotalDiscount(ledger);
    return ledgerCtrl.updateTxnAmount();
  };

  ledgerCtrl.onPriceChange = function(ledger) {
    ledgerCtrl.selectedLedger.panel.amount = ledgerCtrl.cutToTwoDecimal(ledgerCtrl.selectedLedger.panel.quantity * ledgerCtrl.selectedLedger.panel.price);
    ledgerCtrl.getTotalTax(ledger);
    ledgerCtrl.getTotalDiscount(ledger);
    return ledgerCtrl.updateTxnAmount();
  };

  // ledgerCtrl.onstockUnitChange = (ledger) ->
  //   ledger.panel.unit.code = ledger.panel.unit.stockUnitCode
  //   ledger.panel.price = ledgerCtrl.selectedLedger.panel.unit.rate
  //   ledger.panel.amount = ledgerCtrl.selectedLedger.panel.unit.rate * ledgerCtrl.selectedLedger.panel.quantity
  //   ledgerCtrl.getTotalTax(ledger)
  //   ledgerCtrl.getTotalDiscount(ledger)
  //   ledgerCtrl.updateTxnAmount()

  ledgerCtrl.getTxnCategory = function(txn) {
    let category = '';
    let account = _.findWhere($rootScope.fltAccntListPaginated, {uniqueName:txn.particular.uniqueName});
    if (account) {
      let parent = account.parentGroups[0].uniqueName;
      let parentGroup = _.findWhere($rootScope.groupWithAccountsList, {uniqueName:parent});
      ({ category } = parentGroup);
    }
    return category;
  };

  ledgerCtrl.onTxnAmountChange = function(txn){
    if (!ledgerCtrl.isDiscountTxn(txn) && ((ledgerCtrl.getTxnCategory(txn) === 'income') || (ledgerCtrl.getTxnCategory(txn) === 'expenses'))) {
      ledgerCtrl.selectedLedger.panel.amount = Number(txn.amount);
      ledgerCtrl.getTotalTax(ledgerCtrl.selectedLedger);
      return ledgerCtrl.getTotalDiscount(ledgerCtrl.selectedLedger);
    }
  };
      // ledgerCtrl.updateTxnAmount()

  ledgerCtrl.onTxnTotalChange = function(txn){
    ledgerCtrl.selectedLedger.panel.amount = ledgerCtrl.calculateAmountAfterInclusiveTax();
    let stockTxn = ledgerCtrl.getStockTxn(ledgerCtrl.selectedLedger);
    stockTxn.amount = ledgerCtrl.selectedLedger.panel.amount;
    if (ledgerCtrl.selectedLedger.panel.quantity > 0) {
      ledgerCtrl.selectedLedger.panel.price = ledgerCtrl.cutToFourDecimal(ledgerCtrl.selectedLedger.panel.amount / ledgerCtrl.selectedLedger.panel.quantity);
    }
    return ledgerCtrl.updateTxnAmount();
  };

  ledgerCtrl.onstockUnitChange = function(ledger) {
    ledger.panel.price = ledger.panel.unit.rate;
    return ledger.panel.quantity = ledgerCtrl.cutToTwoDecimal(ledger.panel.amount / ledger.panel.price);
  };
    // ledgerCtrl.onPriceChange(ledgerCtrl.selectedLedger)

  ledgerCtrl.updateTxnAmount = () =>
    _.each(ledgerCtrl.selectedLedger.transactions, function(txn) {
      if ((ledgerCtrl.getTxnCategory(txn) === 'income') || ((ledgerCtrl.getTxnCategory(txn) === 'expenses') && !txn.isTax && (txn.particular.uniqueName !== 'roundoff') && !ledgerCtrl.isDiscountTxn(txn))) {
        return txn.amount = ledgerCtrl.selectedLedger.panel.amount;
      }
    })
  ;

    // ledgerCtrl.selectedLedger.isInclusiveTax = true
    // ledgerCtrl.getTotalTax(ledgerCtrl.selectedLedger)
    // ledgerCtrl.getTotalDiscount(ledgerCtrl.selectedLedger)


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
    num = Number(num);
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

  ledgerCtrl.cutToFourDecimal = function(num) {
    num = Number(num);
    num = Number(num.toFixed(4));
    return num;
  };


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
    if (!isElectron) {
        return groupService.getFlattenGroupAccList(reqParam).then(this.success, this.failure);
    } else {
        return groupService.getFlattenGroupAccListElectron(reqParam).then(this.success, this.failure);
    }
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


  ledgerCtrl.addDiscountTxns = function(ledger) {
    if (ledgerCtrl.discountAccount !== undefined) {
      return _.each(ledgerCtrl.discountAccount.accountDetails, function(account) {
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
      });
    }
  };

  ledgerCtrl.removeBlankTransactions = function(ledger) {
    let transactions = [];
    _.each(ledger.transactions, function(txn, i) {
      if (txn && !txn.blankRow && (txn.particular.uniqueName !== '')) {
        return transactions.push(txn);
      }
    });
    return transactions;
  };

  ledgerCtrl.getStockTxn = function(ledger) {
    let stockTxn = {};
    _.each(ledger.transactions, function(txn) {
      if ((txn.particular.uniqueName.length > 0) && txn.particular.stocks) {
        stockTxn = txn;
      }
      if (txn.inventory) {
        return stockTxn = txn;
      }
    });
    return stockTxn;
  };

  ledgerCtrl.addStockDetails = function(ledger) {
    let stockTxn;
    if (ledger.transactions[0].particular.stocks) {
      stockTxn = ledger.transactions[0];
    } else {
      stockTxn = ledgerCtrl.getStockTxn(ledger);
    }
    if (!_.isEmpty(stockTxn) && !stockTxn.inventory) {
      stockTxn.inventory = {};
      stockTxn.inventory.stock = stockTxn.particular.stocks[0];
      stockTxn.inventory.quantity = ledger.panel.quantity;
      stockTxn.inventory.unit = stockTxn.particular.stocks[0].stockUnit;
      return stockTxn.amount = ledger.panel.total;
    } else if (!_.isEmpty(stockTxn)) {
      if (!stockTxn.particular.stock) {
        stockTxn.inventory.quantity = ledger.panel.quantity;
        if (ledger.panel.unit) {
          stockTxn.inventory.unit = ledger.panel.unit;
          stockTxn.inventory.unit.code = ledger.panel.unit.stockUnitCode;
        }
      } else {
        stockTxn.inventory.stock = stockTxn.particular.stock;
        stockTxn.inventory.quantity = ledger.panel.quantity;
        stockTxn.inventory.unit = ledger.panel.unit;
        stockTxn.inventory.unit.code = ledger.panel.unit.stockUnitCode;
      }

      if (stockTxn.amount !== ledger.panel.amount) {
        return ledgerCtrl.updateTxnAmount();
      }
    }
  };
      // if stockTxn.amount != ledger.panel.total
      //   stockTxn.amount = ledger.panel.total

  ledgerCtrl.addStockDetailsForNewEntry = ledger =>
    _.each(ledger.transactions, function(txn) {
      if (txn.particular.stock) {
        let inventory = {};
        inventory.stock = txn.particular.stock;
        inventory.quantity = txn.panel.quantity;
        inventory.unit = txn.panel.unit;
        inventory.unit.code = txn.panel.unit.stockUnitCode;
        txn.inventory = inventory;
        return txn.amount = txn.panel.total;
      }
    })
  ;

  ledgerCtrl.isNotDiscountTxn = function(txn) {
    let particularAccount = _.findWhere($rootScope.fltAccntListPaginated, {uniqueName:txn.particular.uniqueName});
    let hasDiscountasParent = _.findWhere(particularAccount.parentGroups, {uniqueName:'discount'});
    if (hasDiscountasParent) {
      return true;
    } else {
      return false;
    }
  };

  ledgerCtrl.setAmount = ledger =>
    _.each(ledger.transactions, function(txn) {
      if (!txn.isTax && !ledgerCtrl.isNotDiscountTxn(txn)) {
        return txn.amount = txn.panel.total;
      }
    })
  ;

  ledgerCtrl.buildLedger = function(ledger) {
    ledgerCtrl.ledgerBeforeEdit = angular.copy(ledger,{});
    ledger.transactions = ledgerCtrl.removeBlankTransactions(ledger);
    if (!ledger.isBlankLedger) {
      ledgerCtrl.addStockDetails(ledger);
    } else {
      ledgerCtrl.addStockDetailsForNewEntry(ledger);
      ledgerCtrl.setAmount(ledger);
    }
    ledgerCtrl.addDiscountTxns(ledger);
    delete ledger.panel;
    return ledger;
  };

  ledgerCtrl.removeTaxTransactions = function(ledger) {
    let transactions = [];
    _.each(ledger.transactions, function(txn) {
      if (!txn.isTax) {
        return transactions.push(txn);
      }
    });
    return transactions;
  };

  ledgerCtrl.lastSelectedLedger = {};
  ledgerCtrl.saveUpdateLedger = function(ledger) {
    if (!ledger.isBankTransaction) {
      ledger = ledgerCtrl.buildLedger(ledger);
    }
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
        ledgerCtrl.generateInvoice = ledger.generateInvoice;
        ledger.transactions = ledgerCtrl.removeTaxTransactions(ledger);
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
        if (ledgerCtrl.currentTxn.isCompoundEntry && ledgerCtrl.currentTxn.isBaseAccount) {
          unqNamesObj.acntUname = ledgerCtrl.currentTxn.particular.uniqueName;
        }

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
            // ledgerCtrl.selectedTxn.isOpen = false
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

  ledgerCtrl.resetTaxes = function() {};
    // _.each(ledgerCtrl.taxList, (tax) ->
    //   tax.isChecked = false
    // )

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
      isInclusiveTax: true,
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
    if (ledgerCtrl.currentPage === ledgerCtrl.totalLedgerPages) {
      return ledgerCtrl.getTransactions(0);
    } else {
      return ledgerCtrl.getTransactions(ledgerCtrl.currentPage);
    }
  };
    // $timeout ( ->
    //   ledgerCtrl.pageLoader = false
    //   ledgerCtrl.showLoader = false
    // ), 1000

  ledgerCtrl.addEntryFailure = function(res, rejectedTransactions, ledger) {
    ledgerCtrl.doingEntry = false;
    ledger.failed = true;
    toastr.error(res.data.message, res.data.status);
    ledgerCtrl.selectedLedger = angular.copy(ledgerCtrl.ledgerBeforeEdit, {});
    return false;
  };
    // if rejectedTransactions.length > 0
    //   _.each(rejectedTransactions, (rTransaction) ->
    //     ledgerCtrl.selectedLedger.transactions.push(rTransaction)
    //   )
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

  ledgerCtrl.autoGenerateInvoice = function(ledger) {

    this.success = res => ledgerCtrl.fetchEntryDetails(ledgerCtrl.currentTxn, false);

    this.failure = res => toastr.error(res.data.message);

    let reqParam = {
      companyUniqueName: $rootScope.selectedCompany.uniqueName,
      combined:false
    };
    let data = [
      {
        accountUniqueName: ledgerCtrl.baseAccount.uniqueName,
        entries: [ledger.uniqueName]
      }
    ];
    return invoiceService.generateBulkInvoice(reqParam, data).then(this.success, this.failure);
  };


  ledgerCtrl.updateEntrySuccess = function(res, ledger) {
    ledgerCtrl.doingEntry = false;
    ledger.failed = false;
    ledgerCtrl.paginatedLedgers = [res.body];
    ledgerCtrl.selectedLedger = res.body;
    // ledgerCtrl.clearTaxSelection(ledgerCtrl.selectedLedger)
    // ledgerCtrl.clearDiscounts(ledgerCtrl.selectedLedger)
    ledgerCtrl.createPanel(ledgerCtrl.selectedLedger);
    ledgerCtrl.entryTotal = ledgerCtrl.getEntryTotal(ledgerCtrl.selectedLedger);
    ledgerCtrl.matchInventory(ledgerCtrl.selectedLedger);
    if (ledgerCtrl.generateInvoice) {
      ledgerCtrl.autoGenerateInvoice(res.body);
    }
    toastr.success("Entry updated successfully.", "Success");
    // ledgerCtrl.paginatedLedgers = [res.body]
    // ledgerCtrl.selectedLedger = res.body
    // ledgerCtrl.clearTaxSelection(ledgerCtrl.selectedLedger)
    // ledgerCtrl.clearDiscounts(ledgerCtrl.selectedLedger)
    // ledgerCtrl.isTransactionContainsTax(ledgerCtrl.selectedLedger)
    // ledgerCtrl.createPanel(ledgerCtrl.selectedLedger)
    // ledgerCtrl.entryTotal = ledgerCtrl.getEntryTotal(ledgerCtrl.selectedLedger)
    // ledgerCtrl.matchInventory(ledgerCtrl.selectedLedger)
    ledgerCtrl.addBlankTransactionIfOneSideEmpty(ledgerCtrl.selectedLedger);
    ledgerCtrl.ledgerBeforeEdit = {};
    ledgerCtrl.ledgerBeforeEdit = angular.copy(res.body,ledgerCtrl.ledgerBeforeEdit);
    _.each(res.body.transactions, function(txn) {
      if (txn.particular.uniqueName === ledgerCtrl.clickedTxn.particular.uniqueName) {
        return ledgerCtrl.selectedTxn = txn;
      }
    });
    if (ledgerCtrl.mergeTransaction) {
      ledgerCtrl.mergeBankTransactions(ledgerCtrl.mergeTransaction);
    }
    ledgerCtrl.setVoucherCode(ledgerCtrl.selectedLedger);
    ledgerCtrl.getTransactions(ledgerCtrl.currentPage);
    return ledgerCtrl.isTransactionContainsTax(ledgerCtrl.selectedLedger);
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
  }), 2000);

  if (ledgerCtrl.accountUnq) {
    ledgerCtrl.getAccountDetail(ledgerCtrl.accountUnq);
  } else {
    ledgerCtrl.loadDefaultAccount();
  }

  $rootScope.$on('company-changed', function(event,changeData) {
    if (changeData.type === 'CHANGE') {
      ledgerCtrl.resetDates();
      ledgerCtrl.loadDefaultAccount();
      ledgerCtrl.getTaxList();
      return ledgerCtrl.getDiscountGroupDetail();
    }
  });
      //ledgerCtrl.getBankTransactions($rootScope.selectedAccount.uniqueName)

  ledgerCtrl.hasParent = function(target, parent) {
    target = $(target);
    let hasParent = false;
    if (target.parents(parent).length) {
      hasParent = true;
    }
    return hasParent;
  };

  $(document).on('click', function(e) {
    if ((!$(e.target).is('.account-list-item') && !$(e.target).is('.account-list-item strong') && !ledgerCtrl.hasParent(e.target, '.ledger-panel') && !$(e.target).is('.ledger-panel')) && ledgerCtrl.prevTxn) {
      ledgerCtrl.prevTxn.isOpen = false;
    }
    if (!$(e.target).is('.ledger-row')) {
      ledgerCtrl.selectedTxnUniqueName = null;
    }
    return 0;
  });

//########################################################
  ledgerCtrl.ledgerPerPageCount = 15;
  ledgerCtrl.getTransactions = function(page, query) {
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
      // ledgerCtrl.resetTaxes()

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
      reversePage: false,
      q: query || ''
    };
    if (!_.isEmpty(ledgerCtrl.accountUnq)) {
      return ledgerService.getAllTransactions(unqNamesObj).then(this.success, this.failure);
    }
  };

  ledgerCtrl.searchLedger = query => ledgerCtrl.getTransactions(0, query);

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

  ledgerCtrl.selectCompoundEntry = function(txn, e) {
    ledgerCtrl.currentTxn = txn;
    ledgerCtrl.selectedTxnUniqueName = txn.entryUniqueName;
    return e.stopPropagation();
  };

  ledgerCtrl.setVoucherCode = ledger =>
    _.each(ledgerCtrl.voucherTypeList, function(vc, i) {
      if (vc.shortCode === ledger.voucher.shortCode) {
        return ledgerCtrl.paginatedLedgers[0].voucher = ledgerCtrl.voucherTypeList[i];
      }
  })
  ;

  ledgerCtrl.matchDiscountTxn = ledger =>
    _.each(ledger.transactions, function(txn) {
      let discount = _.findWhere(ledgerCtrl.discountAccount.accountDetails, {uniqueName:txn.particular.uniqueName});
      if (discount) {
        return discount.amount = txn.amount;
      }
    })
  ;

  ledgerCtrl.fetchEntryDetails = function(entry, openModal) {
    ledgerCtrl.clickedTxn = entry;

    this.success = function(res) {
      //do not change order of functions
      ledgerCtrl.paginatedLedgers = [res.body];
      ledgerCtrl.selectedLedger = res.body;
      ledgerCtrl.clearTaxSelection(ledgerCtrl.selectedLedger);
      ledgerCtrl.clearDiscounts(ledgerCtrl.selectedLedger);
      ledgerCtrl.matchDiscountTxn(ledgerCtrl.selectedLedger);
      ledgerCtrl.isTransactionContainsTax(ledgerCtrl.selectedLedger);
      ledgerCtrl.createPanel(ledgerCtrl.selectedLedger);
      ledgerCtrl.entryTotal = ledgerCtrl.getEntryTotal(ledgerCtrl.selectedLedger);
      ledgerCtrl.matchInventory(ledgerCtrl.selectedLedger);
      ledgerCtrl.addBlankTransactionIfOneSideEmpty(ledgerCtrl.selectedLedger);
      ledgerCtrl.ledgerBeforeEdit = {};
      ledgerCtrl.ledgerBeforeEdit = angular.copy(res.body,ledgerCtrl.ledgerBeforeEdit);
      _.each(res.body.transactions, function(txn) {
        if (txn.particular.uniqueName === ledgerCtrl.clickedTxn.particular.uniqueName) {
          return ledgerCtrl.selectedTxn = txn;
        }
      });
      ledgerCtrl.setVoucherCode(ledgerCtrl.selectedLedger);
      if (!ledgerCtrl.selectedLedger.invoiceGenerated) {
        ledgerCtrl.generateInvoice = false;
      }
      if (openModal) {
        return ledgerCtrl.displayEntryModal();
      }
    };

    this.failure = res => toastr.error(res.data.message);

    this.getBaseAccountDetailsuccess = res => ledgerCtrl.createUnderstandingText(res.body, ledgerCtrl.understandingJson, 'edit');
    this.getBaseAccountDetailFailure = function(res) {};


    let reqParam = {
      compUname: $rootScope.selectedCompany.uniqueName,
      acntUname: $rootScope.selectedAccount.uniqueName,
      entUname: entry.entryUniqueName
    };

    ledgerCtrl.baseAccount = ledgerCtrl.accountToShow;

    if (entry.isCompoundEntry && entry.isBaseAccount) {
      reqParam.acntUname = entry.particular.uniqueName;
      ledgerCtrl.editModeBaseAccount = entry.particular.name;
      ledgerCtrl.baseAccount = _.findWhere($rootScope.fltAccntListPaginated, {uniqueName:entry.particular.uniqueName});
      let unqObj = {
        compUname : $rootScope.selectedCompany.uniqueName,
        acntUname : ledgerCtrl.baseAccount.uniqueName
      };
      accountService.get(unqObj).then(this.getBaseAccountDetailsuccess, this.getBaseAccountDetailFailure);
    } else {
      ledgerCtrl.editModeBaseAccount = ledgerCtrl.accountToShow.name;
      ledgerCtrl.createUnderstandingText(ledgerCtrl.baseAccount, ledgerCtrl.understandingJson, 'edit');
    }

    ledgerService.getEntry(reqParam).then(this.success, this.failure);
  };

  ledgerCtrl.addBlankTransactionIfOneSideEmpty = function(ledger) {
    let txn;
    let cTxn = _.findWhere(ledger.transactions, {type:'CREDIT'});
    let dTxn = _.findWhere(ledger.transactions, {type:'DEBIT'});
    if (!cTxn) {
      txn = new txnModel('CREDIT');
      txn.blankRow = 'CREDIT';
      ledger.transactions.push(txn);
    }
    if (!dTxn) {
      txn = new txnModel('DEBIT');
      txn.blankRow = 'DEBIT';
      return ledger.transactions.push(txn);
    }
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

  ledgerCtrl.newAccountModel = {
    group : '',
    account: '',
    accUnqName: ''
  };

  ledgerCtrl.addNewAccount = function() {
    ledgerCtrl.newAccountModel.group = '';
    ledgerCtrl.newAccountModel.account = '';
    ledgerCtrl.newAccountModel.accUnqName = '';
    ledgerCtrl.selectedTxn.isOpen = false;
    ledgerCtrl.getFlattenGrpWithAccList($rootScope.selectedCompany.uniqueName, true);
    return ledgerCtrl.AccmodalInstance = $uibModal.open({
      templateUrl:'/public/webapp/Ledger/createAccountQuick.html',
      size: "sm",
      backdrop: 'static',
      scope: $scope
    });
  };

  ledgerCtrl.addNewAccountConfirm = function() {

    this.success = function(res) {
      toastr.success('Account created successfully');
      $rootScope.getFlatAccountList($rootScope.selectedCompany.uniqueName);
      ledgerCtrl.AccmodalInstance.close();
      return $scope.noResults = false;
    };

    this.failure = res => toastr.error(res.data.message);
    let newAccount = {
      email:"",
      mobileNo:"",
      name:ledgerCtrl.newAccountModel.account,
      openingBalanceDate: $filter('date')(ledgerCtrl.today, "dd-MM-yyyy"),
      uniqueName:ledgerCtrl.newAccountModel.accUnqName
    };
    let unqNamesObj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      selGrpUname: ledgerCtrl.newAccountModel.group.groupUniqueName,
      acntUname: ledgerCtrl.newAccountModel.accUnqName
    };
    if ((ledgerCtrl.newAccountModel.group.groupUniqueName === '') || (ledgerCtrl.newAccountModel.group.groupUniqueName === undefined)) {
      return toastr.error('Please select a group.');
    } else {
      return accountService.createAc(unqNamesObj, newAccount).then(this.success, this.failure);
    }
  };

  ledgerCtrl.genearateUniqueName = function(unqName) {
    unqName = unqName.replace(/ |,|\//g,'');
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
      return ledgerCtrl.newAccountModel.accUnqName = unq;
    } else {
      return ledgerCtrl.newAccountModel.accUnqName = '';
    }
  };

  ledgerCtrl.genUnq = unqName =>
    $timeout(( () => ledgerCtrl.genearateUniqueName(unqName))
    )
  ;

  ledgerCtrl.gwaList = {
    page: 1,
    count: 5000,
    totalPages: 0,
    currentPage : 1,
    limit: 5
  };

  ledgerCtrl.getFlattenGrpWithAccList = function(compUname, showEmpty) {
    this.success = function(res) {
      ledgerCtrl.gwaList.totalPages = res.body.totalPages;
      ledgerCtrl.flatGrpList = ledgerCtrl.markFixedGrps(res.body.results);
      return ledgerCtrl.gwaList.limit = 5;
    };
    this.failure = res => toastr.error(res.data.message);

    let reqParam = {
      companyUniqueName: compUname,
      q: '',
      page: ledgerCtrl.gwaList.page,
      count: ledgerCtrl.gwaList.count
    };
    if(showEmpty) {
      reqParam.showEmptyGroups = true;
    }
    if (!isElectron) {
        return groupService.getFlattenGroupAccList(reqParam).then(this.success, this.failure);
    } else {
        return groupService.getFlattenGroupAccListElectron(reqParam).then(this.success, this.failure);
    }
  };

  ledgerCtrl.markFixedGrps = function(flatGrpList) {
    let temp = [];
    _.each(ledgerCtrl.detGrpList, detGrp =>
      _.each(flatGrpList, function(fGrp) {
        if ((detGrp.uniqueName === fGrp.groupUniqueName) && detGrp.isFixed) {
          return fGrp.isFixed = true;
        }
      })
    );
    _.each(flatGrpList, function(grp) {
      if (!grp.isFixed) {
        return temp.push(grp);
      }
    });
    return temp;
  };

  ledgerCtrl.getGroupsWithDetail = function() {
    if ($rootScope.allowed === true) {
      return groupService.getGroupsWithoutAccountsInDetail($rootScope.selectedCompany.uniqueName).then(
        success=> ledgerCtrl.detGrpList = success.body,
        failure => toastr.error('Failed to get Detailed Groups List'));
    }
  };

  if ($rootScope.canUpdate) {
    ledgerCtrl.getGroupsWithDetail();
  }

  ledgerCtrl.downloadInvoice = function(invoiceNumber, e) {
    e.stopPropagation();

    this.success = function(res) {
      let data = ledgerCtrl.b64toBlob(res.body, "application/pdf", 512);
      let blobUrl = URL.createObjectURL(data);
      ledgerCtrl.dlinv = blobUrl;
      return FileSaver.saveAs(data, ledgerCtrl.accountToShow.name+ '-' + invoiceNumber+".pdf");
    };

    this.failure = res => toastr.error(res.data.message, res.data.status);

    let obj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      acntUname: ledgerCtrl.accountUnq
    };
    let data= {
      invoiceNumber: [invoiceNumber],
      template: ''
    };
    return accountService.downloadInvoice(obj, data).then(this.success, this.failure);
  };



  ledgerCtrl.shareAccount = function() {
    this.success = function(res) {
      ledgerCtrl.getSharedWithList();
      return toastr.success(res.body);
    };
    this.failure = res => toastr.error(res.data.message);

    let reqParam = {};
    reqParam.compUname = $rootScope.selectedCompany.uniqueName;
    reqParam.acntUname = ledgerCtrl.accountToShow.uniqueName;
    let permission = {};
    permission.user = ledgerCtrl.shareRequest.user;
    permission.role = ledgerCtrl.shareRequest.role;
    return accountService.share(reqParam, permission).then(this.success,this.failure);
  };

  ledgerCtrl.getSharedWithList = function() {
    this.success = res => ledgerCtrl.sharedUsersList = res.body;

    this.failure = res => toastr.error(res.data.message);

    let reqParam = {};
    reqParam.compUname = $rootScope.selectedCompany.uniqueName;
    reqParam.acntUname = ledgerCtrl.accountToShow.uniqueName;
    return accountService.sharedWith(reqParam).then(this.success,this.failure);
  };

  ledgerCtrl.unshare = function(user, index) {
    this.success = function(res) {
      ledgerCtrl.sharedUsersList.splice(index,1);
      return toastr.success(res.body);
    };

    this.failure = res => toastr.error(res.data.message);

    let reqParam = {};
    reqParam.compUname = $rootScope.selectedCompany.uniqueName;
    reqParam.acntUname = ledgerCtrl.accountToShow.uniqueName;

    let userObj = {};
    userObj.user = user;
    return accountService.unshare(reqParam, userObj).then(this.success,this.failure);
  };

  ledgerCtrl.updateSharePermission = function(user, role) {

    this.success = res => ledgerCtrl.getSharedWithList();

    this.failure = res => toastr.error(res.data.message);

    let reqParam = {};
    reqParam.compUname = $rootScope.selectedCompany.uniqueName;
    reqParam.acntUname = ledgerCtrl.accountToShow.uniqueName;
    let permission = {};
    permission.user = user;
    permission.role = role;
    return accountService.share(reqParam, permission).then(this.success,this.failure);
  };


  return ledgerCtrl;
};
giddh.webApp.controller('ledgerController', ledgerController);