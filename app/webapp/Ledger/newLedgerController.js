
let newLedgerController = function($scope, $rootScope, $window,localStorageService, toastr, modalService, ledgerService,FileSaver , $filter, DAServices, $stateParams, $timeout, $location, $document, permissionService, accountService, groupService, $uibModal, companyServices, $state,idbService, $http, nzTour, $q ) {
  let lc = this;
  if (_.isUndefined($rootScope.selectedCompany)) {
    $rootScope.selectedCompany = localStorageService.get('_selectedCompany');
  }
  lc.pageLoader = false;
  //date time picker code starts here
  lc.today = new Date();
  let d = moment(new Date()).subtract(8, 'month');
  lc.fromDate = {date: d._d};
  lc.toDate = {date: new Date()};
  lc.fromDatePickerIsOpen = false;
  lc.toDatePickerIsOpen = false;
  lc.format = "dd-MM-yyyy";
  lc.showPanel = false;
  lc.accountUnq = $stateParams.unqName;
  lc.accountToShow = {};
  lc.mergeTransaction = false;
  lc.showEledger = true;
  lc.pageAccount = {};
  lc.showLoader = true;
  lc.showExportOption = false;
  lc.showLedgerPopover = false;
  lc.adjustHeight = 0;
  lc.dLedgerLimit = 10;
  lc.cLedgerLimit = 10;
  lc.entrySettings = {};
  lc.firstLoad = true;
  lc.showTaxList = true;
  lc.hasTaxTransactions = false;
  $rootScope.flyAccounts = true;
  $scope.creditTotal = 0;
  $scope.debitTotal = 0;

  //# code for nzTour ##
  lc.lastTourStep = 0;

  lc.onBlankAccountSelect = function($item, $model, $label, $event) {
    lc.onAccountSelect($item);
    if ((($item.uniqueName === 'purchases') || ($item.uniqueName === 'sales')) && lc.pausedBeforeAccountSelection) {
      tour.config.showNext = true;
      nzTour.next();
      return lc.pausedBeforeAccountSelection = false;
    }
  };

  var tour = {
    config: {
      mask:{
        clickThrough: false,
        visibleOnNoTarget: true
      },
      placementPriority: ['top', 'right','left', 'bottom'],
      onClose() {
        return tour.config.showNext = true;
      },
      onComplete() {
        return console.log('completed');
      }
    },
    steps: [
      {
        target: '',
        content: 'Welcome To the Giddh Ledger. This is the page where you can add, modify or delete all your ledger Entries. Let us help you with getting started, please click next.',
        before(direction, step) {
          lc.lastTourStep = step;
          tour.config.showNext = true;
          d = $q.defer();
          d.resolve();
          return d.promise;
        }
      },
      {
        target: '.left-col',
        content: 'This is the DEBIT side of ledger, All the transactions where you RECIEVE something go here.',
        before(direction, step) {
          lc.lastTourStep = step;
          tour.config.showNext = true;
          d = $q.defer();
          d.resolve();
          return d.promise;
        }
      },
      {
        target: '.right-col',
        content: 'This is the CREDIT side of ledger, All the transactions where you GIVE something go here.',
        before(direction, step) {
          lc.lastTourStep = step;
          tour.config.showNext = true;
          d = $q.defer();
          d.resolve();
          return d.promise;
        }
      },
      {
        target: '.debit-blank-row',
        content: 'This is where you can start creating entries, there will always be a blank row on both sides of the ledger for you to add new entries.',
        before(direction, step) {
          lc.lastTourStep = step;
          tour.config.showNext = true;
          d = $q.defer();
          d.resolve();
          return d.promise;
        }
      },
      {
        target: '#addDebitEntry',
        content: "This is the input box for the account from which you are recieving something. Type <span class='ui-select-highlight'>sales</span> and select the account from the dropdown list by pressing <span class='ui-select-highlight'>enter key</span>.",
        before(direction, step) {
          lc.lastTourStep = step;
          tour.config.showNext = false;
          if (!_.isEmpty(lc.selectedLedger.transactions[0].particular) && (lc.selectedLedger.transactions[0].particular.uniqueName === 'sales')) {
            tour.config.showNext = true;
          }
          lc.pausedBeforeAccountSelection = true;
          d = $q.defer();
          d.resolve();
          return d.promise;
        }
      },
      {
        target: '#addDebitDate',
        content: "This is the date for which you want to create the entry, it will always show the current date, however, you can change it to a previous date if you want to create a back-date entry.",
        before(direction, step) {
          lc.lastTourStep = step;
          tour.config.showNext = true;
          d = $q.defer();
          d.resolve();
          return d.promise;
        }
      },
      {
        target: '#addDebitAmount',
        content: "This is the input box for the Amount for your entry.Enter an amount for which you want to make the entry.",
        before(direction, step) {
          lc.lastTourStep = step;
          tour.config.showNext = true;
          d = $q.defer();
          d.resolve();
          return d.promise;
        }
      },
      // {
      //   target: '.left-col'
      //   content: "Let us create an entry for SALES account. In the input box for account, select the 'sales' account."
      //   before: (direction, step) ->
      //     lc.lastTourStep = step
      //     tour.config.showNext = false
      //     if !_.isEmpty(lc.selectedLedger.transactions[0].particular) && lc.selectedLedger.transactions[0].particular.uniqueName == 'sales'
      //       tour.config.showNext = true
      //     else
      //       tour.config.showNext = false
      //     lc.pausedBeforeAccountSelection = true
      //     # lc.disableInputsWhileTour = false
      //     d = $q.defer();
      //     d.resolve()
      //     return d.promise
      // },
      // {
      //   target: '#addDebitAmount'
      //   content: "Great! Now enter the transaction amount for your entry."
      //   before: (direction, step) ->
      //     lc.lastTourStep = step
      //     tour.config.showNext = true
      //     d = $q.defer();
      //     d.resolve()
      //     return d.promise
      // },
      {
        target: '#saveUpdate',
        content: "Now that we have the date, account and transaction amount for the debit entry, click on this button to save it!",
        before(direction, step) {
          lc.lastTourStep = step;
          tour.config.showNext = false;
          lc.pausedBeforeAccountSelection = true;
          d = $q.defer();
          d.resolve();
          return d.promise;
        }
      },
      {
        target: '',
        content: 'Congratulations, You just created your first debit entry! Now lets go ahead and create a credit entry, click next to continue.',
        before(direction, step) {
          lc.lastTourStep = step;
          tour.config.showNext = true;
          d = $q.defer();
          d.resolve();
          return d.promise;
        }
      },
      {
        target: '#addCreditEntry',
        content: "Let us create an entry for purchase account. In the input box for account, select the <span class='ui-select-highlight'>purchases</span> account and press the <span class='ui-select-highlight'>enter key</span>",
        before(direction, step) {
          lc.lastTourStep = step;
          tour.config.showNext = false;
          if (!_.isEmpty(lc.selectedLedger.transactions[0].particular) && (lc.selectedLedger.transactions[0].particular.uniqueName === 'purchases')) {
            tour.config.showNext = true;
          }
          lc.pausedBeforeAccountSelection = true;
          d = $q.defer();
          d.resolve();
          return d.promise;
        }
      },
      {
        target: '#addCreditAmount',
        content: "Great! Now enter the transaction amount for your entry.",
        before(direction, step) {
          lc.lastTourStep = step;
          d = $q.defer();
          d.resolve();
          return d.promise;
        }
      },
      {
        target: '#saveUpdate',
        content: "Now that we have the date, account and transaction amount for the credit entry, click on this button to save it!",
        before(direction, step) {
          lc.lastTourStep = step;
          tour.config.showNext = false;
          d = $q.defer();
          d.resolve();
          return d.promise;
        }
      },
      {
        target: '',
        content: "Now wasn't that easy! This is how you can use ledger to create and update entries. Please click on finish to exit the tour.",
        before(direction, step) {
          tour.config.showNext = true;
          lc.lastTourStep = step;
          d = $q.defer();
          d.resolve();
          return d.promise;
        }
      }

    ]
  };



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
          $scope.cDate.startDate = e.model.startDate._d;
          $scope.cDate.endDate = e.model.endDate._d;
          return lc.getLedgerData(false, true);
        },
        'show.daterangepicker'(e, picker) {}
      }
  };
  $scope.setStartDate = () => $scope.cDate.startDate = moment().subtract(4, 'days').toDate();

  $scope.setRange = () =>
    $scope.cDate = {
        startDate: moment().subtract(29, 'days'),
        endDate: moment()
      }
  ;
  /*date range picker end*/

  lc.sortDirection = Object.freeze({'asc' : 0, 'desc' : 1});
  lc.sortDirectionInvert = function(dir) {
    if (lc.sortDirection.asc === dir) {
      return lc.sortDirection.desc;
    } else if (lc.sortDirection.desc === dir) {
      return lc.sortDirection.asc;
    }
  };

  lc.sortOrderChange = function(type) {
    if (type === 'dr') {
      lc.dLedgerContainer = new lc.ledgerContainer();
    } else if (type === 'cr') {
      lc.cLedgerContainer = new lc.ledgerContainer();
    } else {
      return 0;
    }
    if (!lc.query) {
      return lc.readLedgers($rootScope.selectedAccount.uniqueName, lc.page, 'next', type);
    } else if (lc.query) {
      return lc.readLedgersFiltered($rootScope.selectedAccount.uniqueName, lc.page, 'next', type);
    }
  };


  lc.scrollDirection = Object.freeze({'next' : 0, 'prev' : 1});

  lc.sortOrder = {
    debit : lc.sortDirection.desc,
    credit: lc.sortDirection.desc
  };

  // $scope.cDatePicker.date = {startDate: d._d, endDate: new Date()};


  // $scope.options = {
  //   applyClass: 'btn-green',
  //   locale: {
  //     applyLabel: "Apply",
  //     fromLabel: "From",
  //     format: "YYYY-MM-DD",
  // # //format: "D-MMM-YY", //will give you 6-Jan-17
  // # //format: "D-MMMM-YY", //will give you 6-January-17
  //     toLabel: "To",
  //     cancelLabel: 'Cancel',
  //     customRangeLabel: 'Custom range'
  //   },
  //   ranges: {
  //     'Today': [moment(), moment()],
  //     'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
  //     'Last 7 Days': [moment().subtract(6, 'days'), moment()],
  //     'Last 30 Days': [moment().subtract(29, 'days'), moment()],
  //     'This Month': [moment().startOf('month'), moment().endOf('month')],
  //     'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  //   }
  // }

  lc.popover = {

    templateUrl: 'public/webapp/Ledger/panel.html',
    draggable: false,
    position: "bottom"
  };
  lc.newAccountModel = {
    group : '',
    account: '',
    accUnqName: ''
  };
  lc.ledgerEmailData = {};

  lc.hideEledger = () => lc.showEledger = !lc.showEledger;

  lc.closePanel = () => lc.showPanel = false;

  lc.progressBar = {
    max : 6000,
    value: 0,
    type: 'success'
  };
  //################################## indexedDB functions ############################

  lc.showLogs = false;
  lc.readLedgersFinished = false;
  lc.filteredLedgers = [];
  lc.totalLedgers = 0;
  lc.savedLedgers = 0;
  lc.isLedgerSeeded = false;
  lc.cNonemptyTxn = 0;
  lc.dNonemptyTxn = 0;
  lc.pageCount = 50;
  lc.page = 1;
  lc.dbConfig = {
    name: 'giddh_db',
    storeName: 'ledgers',
    version: 25,
    success(e) {},
    failure(e) {},
    upgrade(e) {}
  };

  lc.parseLedgerDate = function(date) {
    date = date.split('-');
    date = new Date(date[2], date[1], date[0]).getTime();
    return date;
  };

  lc.addToIdb = function(ledgers, accountUniqueName) {
    let dbInstance;
    let cNonemptyTxn = 0;
    let dNonemptyTxn = 0;
    lc.savedLedgers = 0;
    lc.isLedgerSeeded = false;
    let drTransSeeded = false;
    let crTransSeeded = false;
    lc.dbConfig.success = function(e) {
      let db = e.target.result;
      let search = db.transaction([ 'ledgers' ], 'readwrite').objectStore('ledgers');

      let keyRange = IDBKeyRange.bound(
        $rootScope.selectedCompany.uniqueName + " " + accountUniqueName + ' ',
        $rootScope.selectedCompany.uniqueName + " " + accountUniqueName + ' ' + '\xFF'
      );

      let delReq = search.delete(keyRange);

      delReq.onsuccess = function(e) {

        let drObjs = [];
        let crObjs = [];
        let crSavedLedgersCount = 0;
        let drSavedLedgersCount = 0;
        let seedLedgerInDB = function(ledger, index) {
          ledger.uniqueId = $rootScope.selectedCompany.uniqueName + " " + accountUniqueName + " " + ledger.uniqueName;
          ledger.accountUniqueName = accountUniqueName;
          ledger.index = index;
          let date = lc.parseLedgerDate(ledger.entryDate);
          ledger.timestamp = Math.floor(date / 1000);

          let addReq = search.put(ledger);

          addReq.onsuccess = function(e) {
            lc.progressBar.value += 1;
            return lc.savedLedgers += 1;
          };
        };

        ledgers.forEach(function(ledger, index) {
          seedLedgerInDB(ledger, index);
          let drTrans = [];
          let crTrans = [];
          ledger.transactions.forEach(function(tr, index) {
            if ( tr.type === 'CREDIT') {
              crTrans.push(tr);
              return cNonemptyTxn++;
            } else {
              drTrans.push(tr);
              return dNonemptyTxn++;
            }
          });
          if (crTrans.length !== 0) {
            let crObj = {};
            crObj = _.extend(crObj, ledger);
            crObj.accountUniqueName = accountUniqueName;
            crObj.company = $rootScope.selectedCompany.uniqueName;
            crObj.transactions = crTrans;
            crObjs.push(crObj);
          }
          if (drTrans.length !== 0) {
            let drObj = {};
            drObj = _.extend(drObj, ledger);
            drObj.accountUniqueName = accountUniqueName;
            drObj.company = $rootScope.selectedCompany.uniqueName;
            drObj.transactions = drTrans;
            return drObjs.push(drObj);
          }
        });
        lc.cNonemptyTxn = cNonemptyTxn;
        lc.dNonemptyTxn = dNonemptyTxn;

        let drTrans = db.transaction([ 'drTransactions' ], 'readwrite');
        drTrans.oncomplete = function(e) {
          drTransSeeded = true;
          if (crTransSeeded) {
            return lc.onLedgerSeeded();
          }
        };
        let drOS = drTrans.objectStore('drTransactions');
        drOS.delete(keyRange);
        drObjs.forEach(function(drOb) {
          let addDrReq = drOS.put(drOb);
          addDrReq.onsuccess = e => drSavedLedgersCount += 1;
            // lc.progressBar.value += 1
            // console.log 'dr', e.target.result, drSavedLedgersCount, lc.savedLedgers, crSavedLedgersCount

          return addDrReq.onerror = function(e) {
            //console.log e.target.error
          };
        });
        let crTrans = db.transaction([ 'crTransactions' ], 'readwrite');
        crTrans.oncomplete = function(e) {
          crTransSeeded = true;
          if (drTransSeeded) {
            return lc.onLedgerSeeded();
          }
        };

        let crOS = crTrans.objectStore('crTransactions');
        crOS.delete(keyRange);
        return crObjs.forEach(function(crOb) {
          let addCrReq = crOS.put(crOb);
          addCrReq.onsuccess = e => crSavedLedgersCount += 1;
            // lc.progressBar.value += 1
            // console.log 'cr', e.target.result, drSavedLedgersCount, lc.savedLedgers, crSavedLedgersCount

          return addCrReq.onerror = function(e) {
            //console.log e.target.error
          };
        });
      };
      return delReq.onerror = function(e) {};
    };
        //console.log('failed', e.target.error)

      //search.clear()


    lc.dbConfig.failure = function(e) {
      toastr.error(e.target.error.message);
    };

    lc.dbConfig.upgrade = function(e) {
      let db = e.target.result;
      lc.commonOnUpgrade(db);
    };

    lc.dbConfig.onblocked = e => toastr.error(e.target.error);

    return dbInstance = idbService.openDb(lc.dbConfig);
  };

  lc.runTour = true;
  lc.onLedgerSeeded = function() {
    lc.cLedgerContainer = new lc.ledgerContainer();
    lc.dLedgerContainer = new lc.ledgerContainer();
    lc.readLedgers($rootScope.selectedAccount.uniqueName, 1, 'next');
    lc.isLedgerSeeded = false;
    lc.showLoader = false;
    if (!lc.runTour) {
      return nzTour.next();
    }
  };

  lc.onLedgerReadComplete = function() {
    let newUser = localStorageService.get('_newUser');
    if (newUser && lc.runTour && $rootScope.ledgerState) {
      // lc.disableInputsWhileTour = true
      nzTour.start(tour).then(
        function() {
          lc.runTour = false;
          // lc.disableInputsWhileTour = false
          return console.log('finished');
      });
    }
  };

  /*read ledgers */
  lc.readLedgers = function(accountname, page, scrollDir, type) {
    let crLoadCompleted, drLoadCompleted;
    lc.readLedgersFinished = false;
    type = type || null;
    if (type === null) {
      drLoadCompleted = false;
      crLoadCompleted = false;
    } else if (type === 'dr') {
      crLoadCompleted = true;
    } else if (type === 'cr') {
      drLoadCompleted = true;
    }
    lc.dbConfig.success = function(e) {
      let keyAndDir;
      let db = e.target.result;
      //console.log "Inside readledgers."

      //DEBIT READ STARTS
      if ((type === 'dr') || (type === null)) {
        keyAndDir = lc.generateKeyRange(accountname, lc.dLedgerContainer, lc.sortOrder.debit, scrollDir);

        let drTrCount = 0;
        let drTrans = db.transaction([ 'drTransactions' ], 'readonly');
        drTrans.oncomplete = function(e) {
          drLoadCompleted = true;
          lc.dLedgerContainer.scrollDisable = false;
          if (crLoadCompleted) {
            $timeout(()=> lc.readLedgersFinished = true);
            lc.onLedgerReadComplete();
          }
        };
        let drOS = drTrans.objectStore('drTransactions');
        let drSearch = drOS.index('company+accountUniqueName+index', true).openCursor(keyAndDir.keyRange, keyAndDir.scrollDir);

        drSearch.onsuccess = function(e) {
          let cursor = e.target.result;
          if (cursor) {
            if (!lc.hasTaxTransactions) {
              lc.checkForTaxTransactions(cursor.value);
            }
            if (keyAndDir.scrollDir === 'next') {
              lc.dLedgerContainer.add(cursor.value, lc.pageCount);
            } else if (keyAndDir.scrollDir = 'prev') {
              lc.dLedgerContainer.addAtTop(cursor.value, lc.pageCount);
            }

            drTrCount += cursor.value.transactions.length;

            if (drTrCount >= lc.pageCount) {
              return;
            }
            return cursor.continue();
          } else {
            if (
              ((scrollDir === 'next') && (lc.sortOrder.debit === lc.sortDirection.asc)) ||
              ((scrollDir === 'prev') && (lc.sortOrder.debit === lc.sortDirection.desc))
            ) {
              lc.dLedgerContainer.upperBoundReached = true;
            }
            if (
              ((scrollDir === 'prev') && (lc.sortOrder.debit === lc.sortDirection.asc)) ||
              ((scrollDir === 'next') && (lc.sortOrder.debit === lc.sortDirection.desc))
            ) {
              return lc.dLedgerContainer.lowerBoundReached = true;
            }
          }
        };

        drSearch.onerror = function(e) {};
      }
          //console.log 'error', e

      //CREDIT READ STARTS
      if ((type === 'cr') || (type === null)) {
        keyAndDir = lc.generateKeyRange(accountname, lc.cLedgerContainer, lc.sortOrder.credit, scrollDir);

        let crTrCount = 0;
        let crTrans = db.transaction([ 'crTransactions' ], 'readonly');
        crTrans.oncomplete = function(e) {
          crLoadCompleted = true;
          lc.cLedgerContainer.scrollDisable = false;
          if (drLoadCompleted) {
            $timeout(()=> lc.readLedgersFinished = true);
            lc.onLedgerReadComplete();
          }
        };
        let crOS = crTrans.objectStore('crTransactions');
        let crSearch = crOS.index('company+accountUniqueName+index', true).openCursor(keyAndDir.keyRange, keyAndDir.scrollDir);

        crSearch.onsuccess = function(e) {
          let cursor = e.target.result;
          if (cursor) {
            if (!lc.hasTaxTransactions) {
              lc.checkForTaxTransactions(cursor.value);
            }
            if (keyAndDir.scrollDir === 'next') {
              lc.cLedgerContainer.add(cursor.value, lc.pageCount);
            } else if (keyAndDir.scrollDir = 'prev') {
              lc.cLedgerContainer.addAtTop(cursor.value, lc.pageCount);
            }

            crTrCount += cursor.value.transactions.length;
            if (crTrCount >= lc.pageCount) {
              return;
            }
            return cursor.continue();
          } else {
            if (
              ((scrollDir === 'next') && (lc.sortOrder.credit === lc.sortDirection.asc)) ||
              ((scrollDir === 'prev') && (lc.sortOrder.credit === lc.sortDirection.desc))
            ) {
              lc.cLedgerContainer.upperBoundReached = true;
            }
            if (
              ((scrollDir === 'prev') && (lc.sortOrder.credit === lc.sortDirection.asc)) ||
              ((scrollDir === 'next') && (lc.sortOrder.credit === lc.sortDirection.desc))
            ) {
              return lc.cLedgerContainer.lowerBoundReached = true;
            }
          }
        };

        crSearch.onerror = function(e) {};
      }
          //console.log 'error', e
      db.close();
    };

    lc.dbConfig.failure = function(e) {
      //console.log e.target.error
    };

    lc.dbConfig.upgrade = function(e) {
      let db = e.target.result;
      lc.commonOnUpgrade(db);
    };

    idbService.openDb(lc.dbConfig);
  };

  lc.readLedgersFiltered = function(accountUniqueName, page, scrollDir, type) {
    let crLoadCompleted, drLoadCompleted;
    lc.readLedgersFinished = false;
    type = type || null;
    if (type === null) {
      drLoadCompleted = false;
      crLoadCompleted = false;
    } else if (type === 'dr') {
      crLoadCompleted = true;
    } else if (type === 'cr') {
      drLoadCompleted = true;
    }
    lc.dbConfig.success = function(e) {
      let keyAndDir;
      let db = e.target.result;
      //DEBIT READ STARTS
      if ((type === 'dr') || (type === null)) {
        keyAndDir = lc.generateKeyRange(accountUniqueName, lc.dLedgerContainer, lc.sortOrder.debit, scrollDir);

        let drTrCount = 0;
        let drTrans = db.transaction([ 'drTransactions' ], 'readonly');
        drTrans.oncomplete = function() {
          drLoadCompleted = true;
          lc.dLedgerContainer.scrollDisable = false;
          if (crLoadCompleted) {
            $timeout(()=> lc.readLedgersFinished = true);
          }
        };
        let drOS = drTrans.objectStore('drTransactions');
        let drSearch = drOS.index('company+accountUniqueName+index', true).openCursor(keyAndDir.keyRange, keyAndDir.scrollDir);

        drSearch.onsuccess = function(e) {
          let cursor = e.target.result;
          if (cursor) {
            // lc.dLedgerData[cursor.value.uniqueName] = cursor.value
            if (lc.filteredLedgers.indexOf(cursor.value.index) > -1) {
              drTrCount += cursor.value.transactions.length;
              if (keyAndDir.scrollDir === 'next') {
                lc.dLedgerContainer.add(cursor.value, lc.pageCount);
              } else if (keyAndDir.scrollDir = 'prev') {
                lc.dLedgerContainer.addAtTop(cursor.value, lc.pageCount);
              }
            }

            if (drTrCount >= lc.pageCount) {
              return;
            }
            return cursor.continue();
          } else {
            if (
              ((scrollDir === 'next') && (lc.sortOrder.debit === lc.sortDirection.asc)) ||
              ((scrollDir === 'prev') && (lc.sortOrder.debit === lc.sortDirection.desc))
            ) {
              lc.dLedgerContainer.upperBoundReached = true;
            }
            if (
              ((scrollDir === 'prev') && (lc.sortOrder.debit === lc.sortDirection.asc)) ||
              ((scrollDir === 'next') && (lc.sortOrder.debit === lc.sortDirection.desc))
            ) {
              return lc.dLedgerContainer.lowerBoundReached = true;
            }
          }
        };

        drSearch.onerror = function(e) {};
      }
          //console.log 'error', e

      //CREDIT READ STARTS
      if ((type === 'cr') || (type === null)) {
        keyAndDir = lc.generateKeyRange(accountUniqueName, lc.cLedgerContainer, lc.sortOrder.credit, scrollDir);

        let crTrCount = 0;
        let crTrans = db.transaction([ 'crTransactions' ], 'readonly');
        crTrans.oncomplete = function(e) {
          crLoadCompleted = true;
          lc.cLedgerContainer.scrollDisable = false;
          if (drLoadCompleted) {
            $timeout(()=> lc.readLedgersFinished = true);
          }
        };
        let crOS = crTrans.objectStore('crTransactions');
        let crSearch = crOS.index('company+accountUniqueName+index', true).openCursor(keyAndDir.keyRange, keyAndDir.scrollDir);
        crSearch.onsuccess = function(e) {
          let cursor = e.target.result;
          if (cursor) {
            // lc.cLedgerData[cursor.value.uniqueName] = cursor.value
            if (lc.filteredLedgers.indexOf(cursor.value.index) > -1) {
              if (keyAndDir.scrollDir === 'next') {
                lc.cLedgerContainer.add(cursor.value, lc.pageCount);
              } else if (keyAndDir.scrollDir = 'prev') {
                lc.cLedgerContainer.addAtTop(cursor.value, lc.pageCount);
              }

              crTrCount += cursor.value.transactions.length;
            }

            if (crTrCount >= lc.pageCount) {
              return;
            }
            return cursor.continue();
          } else {
            if (
              ((scrollDir === 'next') && (lc.sortOrder.credit === lc.sortDirection.asc)) ||
              ((scrollDir === 'prev') && (lc.sortOrder.credit === lc.sortDirection.desc))
            ) {
              lc.cLedgerContainer.upperBoundReached = true;
            }
            if (
              ((scrollDir === 'prev') && (lc.sortOrder.credit === lc.sortDirection.asc)) ||
              ((scrollDir === 'next') && (lc.sortOrder.credit === lc.sortDirection.desc))
            ) {
              return lc.cLedgerContainer.lowerBoundReached = true;
            }
          }
        };

        crSearch.onerror = function(e) {};
      }
          //console.log 'error', e
      return db.close();
    };

    lc.dbConfig.failure = function(e) {
      //console.log e.target.error
    };

    lc.dbConfig.upgrade = function(e) {
      let db = e.target.result;
      lc.commonOnUpgrade(db);
    };

    idbService.openDb(lc.dbConfig);
  };

  lc.readLedgersWithQuery = function(accountUniqueName, query, page, scrollDir, type) {
    type = type || null;
    lc.dbConfig.success = function(e) {
      let db = e.target.result;
      lc.filteredLedgers = [];

      let ledgerTrans = db.transaction([ 'ledgers' ], 'readwrite');
      ledgerTrans.onerror = function(e) {
        lc.log('transaction error');
        return db.close();
      };
      ledgerTrans.onabort = function(e) {
        lc.log('transaction abort');
        return db.close();
      };
      ledgerTrans.oncomplete = e => lc.readLedgersFiltered(accountUniqueName, page, scrollDir, type);

      let ledger = ledgerTrans.objectStore('ledgers');
      let keyRange = IDBKeyRange.lowerBound([
          accountUniqueName,
          Number.MIN_SAFE_INTEGER
        ], true);
      let ledgerSearch = ledger.index('accountUniqueName+index').openCursor(keyRange);
      ledgerSearch.onsuccess = function(e) {
        // console.log('succ', e)
        let cursor = e.target.result;
        if (cursor) {
          if (lc.filterByQueryNew(cursor.value, query)) {
            lc.filteredLedgers.push(cursor.value.index);
          }
          cursor.continue();
        }
      };
      ledgerSearch.onerror = function(e) {
      };

      // db.close()
    };

    lc.dbConfig.failure = function(e) {
      //console.log e.target.error
    };

    lc.dbConfig.upgrade = function(e) {
      let db = e.target.result;
      lc.commonOnUpgrade(db);
    };

    idbService.openDb(lc.dbConfig);
  };

  // $scope.$watch('lc.isLedgerSeeded', (newVal, oldVal)->
  //   if( !oldVal && newVal)
  //     lc.cLedgerContainer = new lc.ledgerContainer()
  //     lc.dLedgerContainer = new lc.ledgerContainer()
  //     lc.readLedgers($rootScope.selectedAccount.uniqueName, 1, 'next')
  //   lc.isLedgerSeeded = false
  //   lc.showLoader = false
  // )

  // $scope.$watch('lc.readLedgersFinished', (newVal, oldVal) ->
  //   if ( newVal && !oldVal )
  //     lc.log "Read Ledgers Finished."
  //     # $scope.$apply()
  //     lc.readLedgersFinished = false
  //   else if !newVal && !oldVal
  //     lc.readLedgersFinished = false
  // )

  // $scope.$watch('lc.savedLedgers', (newVal, oldVal)->
  //   if(newVal > 0 && newVal == lc.totalLedgers)
  //     lc.readLedgers($rootScope.selectedAccount.uniqueName, 1, 'next')
  //     lc.showLoader = false
  // )

  lc.onScrollDebit = function(sTop, sHeight, pos) {
    if (!lc.query) {
      lc.readLedgers($rootScope.selectedAccount.uniqueName, lc.page, pos, 'dr');
      // $scope.$apply()
    } else if (lc.query) {
      lc.readLedgersFiltered($rootScope.selectedAccount.uniqueName, lc.page, pos, 'dr');
    }
      // $scope.$apply()
  };

  lc.onScrollCredit = function(sTop, sHeight, pos) {
    if (!lc.query) {
      lc.readLedgers($rootScope.selectedAccount.uniqueName, lc.page, pos, 'cr');
      // $scope.$apply()
    } else if (lc.query) {
      lc.readLedgersFiltered($rootScope.selectedAccount.uniqueName, lc.page, pos, 'cr');
    }
      // $scope.$apply()
  };

  lc.filterLedgers = function(accountname, query, page) {
    lc.log(query);
    if (query) {
      lc.dLedgerContainer = new lc.ledgerContainer();
      lc.cLedgerContainer = new lc.ledgerContainer();
      lc.readLedgersWithQuery(accountname, query, lc.page, 'next');
    } else {
      lc.dLedgerContainer = new lc.ledgerContainer();
      lc.cLedgerContainer = new lc.ledgerContainer();
      lc.readLedgers(accountname, lc.page, 'next');
    }
    return;

    lc.dbConfig.failure = function(e) {
      //console.log e.target.error, 'update failed'
    };

    lc.dbConfig.upgrade = function(e) {
      let db = e.target.result;
      lc.commonOnUpgrade(db);
    };

    idbService.openDb(lc.dbConfig);
  };
// {
//             "transactions": [{
//                 "particular": {
//                     "name": "Sales",
//                     "uniqueName": "sales"
//                 },
//                 "amount": 200,
//                 "inventory": null
//             }],
//             "total": {
//                 "amount": 200,
//                 },
//             "invoiceNumber": "",
//             "entryDate": "25-03-2017",
//             "voucher": {
//                 "name": "sales",
//             },
//             "voucherNo": 1,
//             "attachedFile": "",
//             "description": "",
//             "tag": ""
//         }

  lc.filterByQueryNew = function(ledger, query) {
    for (let txn of Array.from(ledger.transactions)) {
      if ( lc.filterItemByQuery(txn.particular, query) ||
        lc.filterItemByQuery(txn.amount, query) ||
        lc.filterItemByQuery(txn.inventory, query)
      ) {
        return true;
      }
    }
    if (
      lc.filterItemByQuery(ledger.total.amount, query) ||
      lc.filterItemByQuery(ledger.invoiceNumber, query) ||
      lc.filterItemByQuery(ledger.entryDate, query) ||
      lc.filterItemByQuery(ledger.voucher, query) ||
      lc.filterItemByQuery(ledger.voucherNo, query) ||
      //lc.filterItemByQuery(ledger.attachedFile, query) ||
      lc.filterItemByQuery(ledger.description, query) ||
      lc.filterItemByQuery(ledger.tag, query)
    ) {
      return true;
    }
    return false;
  };

  lc.filterItemByQuery = function(item, query) {
    switch (typeof item) {
      case 'object':
        for (let key in item) {
          if (lc.filterItemByQuery(item[key], query)) {
            return true;
          }
        }
        break;
      case 'string':
        if (item.toLowerCase().indexOf(query.toLowerCase()) !== -1) {
          return true;
        }
        break;
      case 'number':
        if (item.toString().toLowerCase().indexOf(query.toLowerCase()) !== -1) {
          return true;
        }
        break;
    }
    return false;
  };

  lc.filterByQuery = function(ledger, query) {
    let hasQuery = false;
    for (let key in ledger) {
      if (!hasQuery) {
        switch (typeof ledger[key]) {
          case 'object':
            hasQuery = lc.filterByQuery(ledger[key], query);
            break;
          case 'string':
            if (ledger[key].toLowerCase().indexOf(query.toLowerCase()) !== -1) {
              return hasQuery = true;
              break;
            }
            break;
          case 'number':
            if (ledger[key].toString().toLowerCase().indexOf(query.toLowerCase()) !== -1) {
              return hasQuery = true;
              break;
            }
            break;
        }
      }
    }
    return hasQuery;
  };

  //################################## indexedDB functions end ############################

  lc.ledgerData = {
    ledgers: []
  };

  lc.newDebitTxn = {
    date: $filter('date')(new Date(), "dd-MM-yyyy"),
    particular: {
      name:'',
      uniqueName:''
    },
    amount : 0,
    type: 'DEBIT'
  };

  lc.newCreditTxn = {
    date: $filter('date')(new Date(), "dd-MM-yyyy"),
    particular: {
      name:'',
      uniqueName:''
    },
    amount : 0,
    type: 'CREDIT'
  };

  lc.blankLedger = {
      isBlankLedger : true,
      description:null,
      attachedFileName: '',
      attachedFile: '',
      entryDate:$filter('date')(new Date(), "dd-MM-yyyy"),
//      hasCredit:false
//      hasDebit:false
      invoiceGenerated:false,
      isCompoundEntry:false,
      applyApplicableTaxes:false,
      tag:null,
      transactions:[
        lc.newDebitTxn,
        lc.newCreditTxn
      ],
      unconfirmedEntry:false,
      isInclusiveTax: false,
      uniqueName:"",
      voucher:{
        name:"Sales",
        shortCode:"sal"
      },
      tax:[],
      voucherNo:null
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

  let txnModel = function(str) {
    return this.ledger = {
      date: $filter('date')(new Date(), "dd-MM-yyyy"),
      particular: {
        name:"",
        uniqueName:""
      },
      amount : 0,
      type: str
    };
  };

  lc.checkForTaxTransactions = function(ledger) {
    if (ledger.transactions.length > 1) {
      let tax = _.findWhere(ledger.transactions, {isTax: true});
      if (tax) {
        return lc.hasTaxTransactions = true;
      }
    }
  };

  lc.addBlankTxn= function(str, ledger) {
    let txn = new txnModel(str);
    txn.isBlank = true;
//    if ledger.uniqueName != ""
    lc.hasBlankTxn = false;
    lc.checkForExistingblankTransaction(ledger, str);
    if (!lc.hasBlankTxn) {
      let crObj;
      if (str === 'DEBIT') {
        if (ledger.uniqueName) {
          if (!lc.dLedgerContainer.ledgerData[ledger.uniqueName]) {
            crObj = {};
            crObj = _.extend(crObj, ledger);
            crObj.accountUniqueName = $rootScope.selectedAccount.uniqueName;
            crObj.company = $rootScope.selectedCompany.uniqueName;
            crObj.transactions = [];
            lc.dLedgerContainer.add(crObj);
          }
          lc.dLedgerContainer.ledgerData[ledger.uniqueName].transactions.push(txn);
          lc.drMatch = lc.scrollMatchObject(lc.dLedgerContainer.ledgerData[ledger.uniqueName], 'dr');
        } else {
          lc.blankLedger.transactions.push(txn);
        }

      } else if (str === 'CREDIT') {
        if (ledger.uniqueName) {
          if (!lc.dLedgerContainer.ledgerData[ledger.uniqueName]) {
          } else {
            crObj = {};
            crObj = _.extend(crObj, ledger);
            crObj.accountUniqueName = $rootScope.selectedAccount.uniqueName;
            crObj.company = $rootScope.selectedCompany.uniqueName;
            crObj.transactions = [];
            lc.cLedgerContainer.add(crObj);
          }
          lc.cLedgerContainer.ledgerData[ledger.uniqueName].transactions.push(txn);
          lc.crMatch = lc.scrollMatchObject(lc.cLedgerContainer.ledgerData[ledger.uniqueName], 'cr');
        } else {
          lc.blankLedger.transactions.push(txn);
        }
      }
    }
    //lc.prevTxn = txn
    // if str.toLowerCase() == "debit" && lc.sortOrder.debit
    //   lc.popover.position = "top"
    // else if str.toLowerCase() == "credit" && lc.sortOrder.credit
    //   lc.popover.position = "top"

    lc.setFocusToBlankTxn(ledger, txn, str);
    return lc.blankCheckCompEntry(ledger);
  };

  lc.setFocusToBlankTxn = function(ledger, transaction, str) {
    lc.prevTxn.isOpen = false;
    lc.prevTxn.isblankOpen = false;
    if (str === 'DEBIT') {
      if (ledger.uniqueName) {
        return _.each(lc.dLedgerContainer.ledgerData[ledger.uniqueName].transactions, function(txn) {
          if ((txn.amount === 0) && (txn.particular.name === "") && (txn.particular.uniqueName === "") && (txn.type === str)) {
            txn.isOpen = true;
            return lc.prevTxn = txn;
          }
        });
      } else {
        return _.each(lc.blankLedger.transactions, function(txn) {
          if ((txn.amount === 0) && (txn.particular.name === "") && (txn.particular.uniqueName === "") && (txn.type === str)) {
            txn.isOpen = true;
            return lc.prevTxn = txn;
          }
        });
      }
    } else if (str === 'CREDIT') {
      if (ledger.uniqueName) {
        return _.each(lc.cLedgerContainer.ledgerData[ledger.uniqueName].transactions, function(txn) {
            if ((txn.amount === 0) && (txn.particular.name === "") && (txn.particular.uniqueName === "") && (txn.type === str)) {
              txn.isOpen = true;
              return lc.prevTxn = txn;
            }
        });
      } else {
        return _.each(lc.blankLedger.transactions, function(txn) {
          if ((txn.amount === 0) && (txn.particular.name === "") && (txn.particular.uniqueName === "") && (txn.type === str)) {
            txn.isOpen = true;
            return lc.prevTxn = txn;
          }
        });
      }
    }
  };
        //lc.openClosePopOver(txn, ledger)

  lc.getFocus = function(txn, ledger) {
    if ((txn.particular.name === "") && (txn.particular.uniqueName === "") && (txn.amount === 0)) {
      return txn.isOpen = true;
    }
  };
      //lc.openClosePopOver(txn,ledger)

  lc.checkForExistingblankTransaction = function(ledger, str) {
    if (str === 'DEBIT') {
      if (ledger.uniqueName) {
        if (lc.dLedgerContainer.ledgerData[ledger.uniqueName]) {
          return _.each(lc.dLedgerContainer.ledgerData[ledger.uniqueName].transactions, function(txn) {
            if ((txn.particular.uniqueName === '') && (txn.amount === 0) && (txn.type === str)) {
              return lc.hasBlankTxn = true;
            }
          });
        }
      } else {
        return _.each(lc.blankLedger.transactions, function(txn) {
          if ((txn.particular.uniqueName === '') && (txn.amount === 0) && (txn.type === str)) {
            return lc.hasBlankTxn = true;
          }
        });
      }
    } else if (str === 'CREDIT') {
      if (ledger.uniqueName) {
        if (lc.cLedgerContainer.ledgerData[ledger.uniqueName]) {
          return _.each(lc.cLedgerContainer.ledgerData[ledger.uniqueName].transactions, function(txn) {
            if ((txn.particular.uniqueName === '') && (txn.amount === 0) && (txn.type === str)) {
              return lc.hasBlankTxn = true;
            }
          });
        }
      } else {
        return _.each(lc.blankLedger.transactions, function(txn) {
          if ((txn.particular.uniqueName === '') && (txn.amount === 0) && (txn.type === str)) {
            return lc.hasBlankTxn = true;
          }
        });
      }
    }
  };

  lc.taxList = [];
  lc.voucherTypeList = [
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

  lc.selectedLedger = {
    description:null,
    entryDate:$filter('date')(new Date(), "dd-MM-yyyy"),
//    hasCredit:false
//    hasDebit:false
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
    voucherNo:null
  };

  // lc.isSelectedAccount = () ->
  //   #$rootScope.selectedAccount = localStorageService.get('_selectedAccount')
  //   if _.isEmpty($rootScope.selectedAccount)
  //     lc.accountToShow = $rootScope.selectedAccount
  //   else
  //     cash = _.findWhere($rootScope.fltAccntListPaginated, {uniqueName:'cash'})
  //     if cash
  //       #$state.go('company.content.ledgerContent', {uniqueName:'cash'}, {notify: false})
  //       lc.getAccountDetail('cash')
  //     else
  //       #$state.go('company.content.ledgerContent', {uniqueName:'sales'}, {notify: false})
  //       lc.getAccountDetail('sales')

    // if _.isUndefined($rootScope.selectedAccount) || _.isNull($rootScope.selectedAccount)
    //   $rootScope.selectedAccount = lc.accountUnq
    //   lc.accountToShow = lc.accountUnq
    // else
    // if !_.isNull($rootScope.selectedAccount)
    //   if $rootScope.selectedAccount.uniqueName != $stateParams.unqName
    //     unq = _.findWhere($rootScope.fltAccntListPaginated, {uniqueName:$stateParams.unqName})
    //     localStorageService.set('_selectedAccount', unq)
    //     lc.accountToShow = unq
    //   else
    //     lc.accountToShow = $rootScope.selectedAccount
    // else
    //   unq = _.findWhere($rootScope.fltAccntListPaginated, {uniqueName:$stateParams.unqName})
    //   localStorageService.set('_selectedAccount', unq)
    //   lc.accountToShow = unq

  lc.isCurrentAccount =acnt => acnt.uniqueName === lc.accountUnq;

  lc.fromDatePickerOpen = function() {
    return this.fromDatePickerIsOpen = true;
  };

  lc.toDatePickerOpen = function() {
    return this.toDatePickerIsOpen = true;
  };

  // upper icon functions starts here
  // generate magic link
  lc.getMagicLink = function() {
    let accUname = lc.accountUnq;
    let reqParam = {
      companyUniqueName: $rootScope.selectedCompany.uniqueName,
      accountUniqueName: accUname,
      from: $filter('date')($scope.cDate.startDate, 'dd-MM-yyyy'),
      to: $filter('date')($scope.cDate.endDate, 'dd-MM-yyyy')
    };
    return companyServices.getMagicLink(reqParam).then(lc.getMagicLinkSuccess, lc.getMagicLinkFailure);
  };

  lc.getMagicLinkSuccess = function(res) {
    let modalInstance;
    lc.magicLink = res.body.magicLink;
    return modalInstance = $uibModal.open({
      template: `<div> \
<div class="modal-header"> \
<button type="button" class="close" data-dismiss="modal" ng-click="$close()" aria-label="Close"><span \
aria-hidden="true">&times;</span></button> \
<h3 class="modal-title">Magic Link</h3> \
</div> \
<div class="modal-body"> \
<input id="magicLink" class="form-control" type="text" ng-model="lc.magicLink"> \
</div> \
<div class="modal-footer"> \
<button class="btn btn-default" ngclipboard data-clipboard-target="#magicLink">Copy</button> \
</div> \
</div>`,
      size: "md",
      backdrop: 'static',
      scope: $scope
    });
  };

  lc.getMagicLinkFailure = res => toastr.error(res.data.message);

  // ledger send email
  lc.sendLedgEmail = function(emailData, emailType) {
    let data = emailData;
    if (_.isNull(lc.toDate.date) || _.isNull($scope.cDate.startDate)) {
      toastr.error("Date should be in proper format", "Error");
      return false;
    }
    let unqNamesObj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      acntUname: lc.accountUnq,
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

    return accountService.emailLedger(unqNamesObj, sendData).then(lc.emailLedgerSuccess, lc.emailLedgerFailure);
  };

  lc.emailLedgerSuccess = function(res) {
    toastr.success(res.body, res.status);
    //lc.ledgerEmailData.email = ''
    return lc.ledgerEmailData = {};
  };

  lc.emailLedgerFailure = res => toastr.error(res.data.message, res.data.status);

  //export ledger
  lc.exportLedger = function(type){
    lc.showExportOption = false;
    let unqNamesObj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      acntUname: lc.accountUnq,
      fromDate: $filter('date')($scope.cDate.startDate, "dd-MM-yyyy"),
      toDate: $filter('date')($scope.cDate.endDate, "dd-MM-yyyy"),
      lType:type
    };
    return accountService.exportLedger(unqNamesObj).then(lc.exportLedgerSuccess, lc.exportLedgerFailure);
  };

  lc.exportLedgerSuccess = function(res){
    // blob = new Blob([res.body.filePath], {type:'file'})
    // fileName = res.body.filePath.split('/')
    // fileName = fileName[fileName.length-1]
    // FileSaver.saveAs(blob, fileName)
    lc.isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
    if ($rootScope.msieBrowser()) {
      return $rootScope.openWindow(res.body.filePath);
    } else if (lc.isSafari) {
      let modalInstance;
      return modalInstance = $uibModal.open({
        template: `<div> \
<div class="modal-header"> \
<h3 class="modal-title">Download File</h3> \
</div> \
<div class="modal-body"> \
<p class="mrB">To download your file Click on button</p> \
<button onClick="window.open(\'`+res.body.filePath+`\')" class="btn btn-primary">Download</button> \
</div> \
<div class="modal-footer"> \
<button class="btn btn-default" ng-click="$close()">Cancel</button> \
</div> \
</div>`,
        size: "sm",
        backdrop: 'static',
        scope: $scope
      });
    } else {
      return window.open(res.body.filePath);
    }
  };

  lc.exportLedgerFailure = res=> toastr.error(res.data.message, res.data.status);


  // upper icon functions ends here
  lc.sortFlatAccListAlphabetically = function(list, property) {
    let sortedList = [];
    _.each(list, item => sortedList.push(item[property]));
    sortedList = sortedList.sort();
    return sortedList;
  };

  lc.getAccountDetail = function(accountUniqueName) {
    if (!_.isUndefined(accountUniqueName) && !_.isEmpty(accountUniqueName) && !_.isNull(accountUniqueName)) {
      let unqObj = {
        compUname : $rootScope.selectedCompany.uniqueName,
        acntUname : accountUniqueName
      };
      return accountService.get(unqObj)
      .then(
        res=> lc.getAccountDetailSuccess(res)
      ,error=> lc.getAccountDetailFailure(error));
    }
  };

  lc.getAccountDetailFailure = function(res) {
    if (lc.accountUnq !== 'sales') {
      return toastr.error(res.data.message, res.data.status);
    } else {
      let sortedAccList = lc.sortFlatAccListAlphabetically($rootScope.fltAccntListPaginated, 'uniqueName');
      return lc.getAccountDetail(sortedAccList[0]);
    }
  };

  lc.getAccountDetailSuccess = function(res) {
    localStorageService.set('_selectedAccount', res.body);
    $rootScope.selectedAccount = res.body;
    lc.accountToShow = $rootScope.selectedAccount;
    lc.accountUnq = res.body.uniqueName;
    $state.go($state.current, {unqName: res.body.uniqueName}, {notify: false});
    if (res.body.uniqueName === 'cash') {
      $rootScope.ledgerState = true;
    }
    lc.getLedgerData(true);
    if ((res.body.yodleeAdded === true) && $rootScope.canUpdate) {
      //get bank transaction here
      return $timeout(( () => lc.getBankTransactions(res.body.uniqueName)), 2000);
    }
  };

  lc.loadDefaultAccount = function(acc) {

    this.success = function(res) {
      lc.accountUnq = 'cash';
      return lc.getAccountDetail(lc.accountUnq);
    };

    this.failure = function(res) {
      lc.accountUnq = 'sales';
      return lc.getAccountDetail(lc.accountUnq);
    };

    let unqObj = {
      compUname : $rootScope.selectedCompany.uniqueName,
      acntUname : 'cash'
    };
    return accountService.get(unqObj).then(this.success, this.failure);
  };


  lc.getBankTransactions = function(accountUniqueName) {
    let unqObj = {
      compUname : $rootScope.selectedCompany.uniqueName,
      acntUname : accountUniqueName
    };
    // get other ledger transactions
    return ledgerService.getOtherTransactions(unqObj)
    .then(
      res=> lc.getBankTransactionsSuccess(res)
    ,error=> lc.getBankTransactionsFailure(error));
  };

  lc.getBankTransactionsFailure = res => toastr.error(res.data.message, res.data.status);

  lc.getBankTransactionsSuccess = function(res) {
    lc.eLedgerData = lc.formatBankLedgers(res.body);
    lc.calculateELedger();
    return lc.getReconciledEntries();
  };
    //lc.removeUpdatedBankLedger()

  lc.calculateELedger = function() {
    lc.eLedgType = undefined;
    lc.eCrBalAmnt = 0;
    lc.eDrBalAmnt = 0;
    lc.eDrTotal = 0;
    lc.eCrTotal = 0;
    let crt = 0;
    let drt = 0;
    _.each(lc.eLedgerData, ledger =>
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
    lc.eCrTotal = crt;
    return lc.eDrTotal = drt;
  };


  lc.formatBankLedgers = function(bankArray) {
    let formattedBankLedgers = [];
    if (bankArray.length > 0) {
      _.each(bankArray, function(bank) {
        let ledger = new blankLedgerModel();
        ledger.entryDate = bank.date;
        ledger.isBankTransaction = true;
        ledger.transactionId = bank.transactionId;
        ledger.transactions = lc.formatBankTransactions(bank.transactions, bank, ledger);
        ledger.description = bank.description;
        return formattedBankLedgers.push(ledger);
      });
    }
    return formattedBankLedgers;
  };

  lc.formatBankTransactions = function(transactions, bank, ledger, type) {
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

  lc.mergeBankTransactions = function(toMerge) {
    if (toMerge) {
      lc.mergeTransaction = true;
      _.each(lc.eLedgerData, function(ld) {
        if (ld.uniqueName.length < 1) { ld.uniqueName = ld.transactionId; } else { ld.uniqueName; }
        if (ld.transactions[0].type === 'DEBIT') {
          return lc.dLedgerContainer.addAtTop(ld);
        } else if (ld.transactions[0].type === 'CREDIT') {
          return lc.cLedgerContainer.addAtTop(ld);
        }
      });
      // lc.ledgerData.ledgers.push(lc.eLedgerData)
      // lc.ledgerData.ledgers = lc.sortTransactions(_.flatten(lc.ledgerData.ledgers), 'entryDate')
      return lc.showEledger = false;
    } else {
    //   lc.AddBankTransactions()
    //   lc.showEledger = false
    // else
      lc.mergeTransaction = false;
      return lc.removeBankTransactions();
    }
  };
    //   lc.showEledger = true

  // lc.AddBankTransactions = () ->
  //   bankTxnDuplicate = lc.eLedgerData
  //   bankTxntoMerge = lc.fromBanktoLedgerObject(bankTxnDuplicate)
  //   lc.ledgerData.ledgers.push(bankTxntoMerge)
  //   lc.ledgerData.ledgers = _.flatten(lc.ledgerData.ledgers)

  lc.sortTransactions = function(ledger, sortType) {
    ledger = _.sortBy(ledger, sortType);
    ledger = ledger.reverse();
    return ledger;
  };

  lc.removeBankTransactions = function() {
    let withoutBankTxn = [];
    _.each(lc.cLedgerContainer.ledgerData, function(ledger) {
      if (ledger.isBankTransaction) {
        return lc.cLedgerContainer.remove(ledger);
      }
    });
    _.each(lc.dLedgerContainer.ledgerData, function(ledger) {
      if (ledger.isBankTransaction) {
        return lc.dLedgerContainer.remove(ledger);
      }
    });
    return lc.showEledger = true;
  };

  // lc.fromBanktoLedgerObject = (bankArray) ->
  //   bank2LedgerArray = []
  //   _.each bankArray, (txn) ->
  //     led = {}
  //     led.entryDate = txn.date
  //     led.transactions = txn.transactions
  //     led.isBankTransaction = true
  //     lc.renameBankTxnKeys(led.transactions)
  //     bank2LedgerArray.push(led)
  //   bank2LedgerArray

  // lc.renameBankTxnKeys = (txnArray) ->
  //   _.each txnArray, (txn) ->
  //     txn.particular = txn.remarks
  lc.getLedgerData = function(showLoaderCondition, firstLoad) {
    lc.progressBar.value = 0;
    $rootScope.superLoader = true;
    lc.showLoader = showLoaderCondition || true;
    if (_.isUndefined($rootScope.selectedCompany.uniqueName)) {
      $rootScope.selectedCompany = localStorageService.get("_selectedCompany");
    }
    if ($scope.cDate.startDate === undefined) {
      $scope.cDate.startDate = moment().subtract(29, 'days');
      $scope.cDate.startDate = $scope.cDate.startDate._d;
    }
    if ($scope.cDate.endDate === undefined) {
      $scope.cDate.endDate = moment();
      $scope.cDate.endDate = $scope.cDate.endDate._d;
    }
    let unqNamesObj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      acntUname: lc.accountUnq,
      fromDate: $filter('date')($scope.cDate.startDate, "dd-MM-yyyy"),
      toDate: $filter('date')($scope.cDate.endDate, "dd-MM-yyyy")
    };
    if (!_.isEmpty(lc.accountUnq)) {
      return ledgerService.getLedger(unqNamesObj).then(lc.getLedgerDataSuccess, lc.getLedgerDataFailure);
    }
  };

  lc.getLedgerDataSuccess = function(res) {
    lc.ledgerData = {};
    lc.fetchLedgerDataSuccess(res);
    lc.totalLedgers= res.body.ledgers.length;
    $rootScope.flyAccounts = false;
    //lc.countTotalTransactions()
    // lc.paginateledgerData(res.body.ledgers)
    if (res.body.ledgers.length < 1) {
      lc.showLoader = false;
    }
    //lc.showLoader = false
    //if lc.firstLoad || $rootScope.accClicked
      //lc.blankLedger.transactions[0].isOpen = true
    return $rootScope.superLoader = false;
  };

  lc.getLedgerDataFailure = function(res) {
    toastr.error(res.data.message);
    lc.showLoader = false;
    return $rootScope.superLoader = false;
  };

  lc.filterTxnType = function(ledgers, type) {
    if (ledgers.length) {
      return _.each(ledgers, function(ledger) {
        if (ledger.transactions.length) {
          let dTxn = [];
          let cTxn = [];
          _.each(ledger.transactions, function(txn) {
            if (txn.type === 'CREDIT') {
              return cTxn.push(txn);
            } else {
              return dTxn.push(txn);
            }
          });
          let ledgerObj = {};
          ledgerObj = _.extend(ledgerObj, ledger);
          ledgerObj.transactions = dTxn;
          lc.dLedgerData[ledger.uniqueName] = {};
          //if(ledgerObj.transactions.length > 0)
          lc.dLedgerData[ledger.uniqueName] = _.extend(lc.dLedgerData[ledger.uniqueName], ledgerObj);
          ledgerObj.transactions = cTxn;
          lc.cLedgerData[ledger.uniqueName] = {};
          //if(ledgerObj.transactions.length > 0)
          return lc.cLedgerData[ledger.uniqueName] = _.extend(lc.cLedgerData[ledger.uniqueName], ledgerObj);
        }
      });
    }
  };
    //console.log lc.dLedgerData, lc.cLedgerData

  lc.updateLedgerData = function(condition, ledger) {
    let unqNamesObj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      acntUname: lc.accountUnq,
      fromDate: $filter('date')($scope.cDate.startDate, "dd-MM-yyyy"),
      toDate: $filter('date')($scope.cDate.endDate, "dd-MM-yyyy")
    };
    if (!_.isEmpty(lc.accountUnq)) {
      return ledgerService.getLedger(unqNamesObj).then(
        res => lc.updateLedgerDataSuccess(res, condition, ledger),
        res => lc.updateLedgerDataFailure);
    }
  };

  lc.fetchLedgerDataSuccess = function(res) {
    lc.ledgerData.balance = res.body.balance;
    lc.ledgerData.forwardedBalance = res.body.forwardedBalance;
    lc.ledgerData.creditTotal = res.body.creditTotal;
    lc.ledgerData.debitTotal = res.body.debitTotal;
    if (lc.ledgerData.forwardedBalance.amount === 0) {
      let recTotal = 0;
      if (lc.ledgerData.creditTotal > lc.ledgerData.debitTotal) { recTotal = lc.ledgerData.creditTotal; } else { recTotal = lc.ledgerData.debitTotal; }
      lc.ledgerData.reckoningCreditTotal = recTotal;
      lc.ledgerData.reckoningDebitTotal = recTotal;
    } else {
      if (lc.ledgerData.forwardedBalance.type === 'DEBIT') {
        if ((lc.ledgerData.forwardedBalance.amount + lc.ledgerData.debitTotal) <= lc.ledgerData.creditTotal) {
          lc.ledgerData.reckoningCreditTotal = lc.ledgerData.creditTotal;
          lc.ledgerData.reckoningDebitTotal = lc.ledgerData.creditTotal;
        } else {
          lc.ledgerData.reckoningCreditTotal = lc.ledgerData.forwardedBalance.amount + lc.ledgerData.debitTotal;
          lc.ledgerData.reckoningDebitTotal = lc.ledgerData.forwardedBalance.amount + lc.ledgerData.debitTotal;
        }
      } else {
        if ((lc.ledgerData.forwardedBalance.amount + lc.ledgerData.creditTotal) <= lc.ledgerData.debitTotal) {
          lc.ledgerData.reckoningCreditTotal = lc.ledgerData.debitTotal;
          lc.ledgerData.reckoningDebitTotal = lc.ledgerData.debitTotal;
        } else {
          lc.ledgerData.reckoningCreditTotal = lc.ledgerData.forwardedBalance.amount + lc.ledgerData.creditTotal;
          lc.ledgerData.reckoningDebitTotal = lc.ledgerData.forwardedBalance.amount + lc.ledgerData.creditTotal;
        }
      }
    }
    // lc.ledgerData.reckoningCreditTotal = res.body.creditTotal
    // lc.ledgerData.reckoningDebitTotal = res.body.debitTotal
    // if lc.ledgerData.balance.type == 'CREDIT'
    //   lc.ledgerData.reckoningDebitTotal += lc.ledgerData.balance.amount
    //   lc.ledgerData.reckoningCreditTotal += lc.ledgerData.forwardedBalance.amount
    // else if lc.ledgerData.balance.type == 'DEBIT'
    //   lc.ledgerData.reckoningCreditTotal += lc.ledgerData.balance.amount
    //   lc.ledgerData.reckoningDebitTotal += lc.ledgerData.forwardedBalance.amount
    return lc.addToIdb(res.body.ledgers, $rootScope.selectedAccount.uniqueName);
  };

  lc.updateLedgerDataSuccess = (res,condition, ledger) =>
    // lc.setEntryTotal(ledger, res.body, condition)
    lc.fetchLedgerDataSuccess(res)
  ;
    // lc.countTotalTransactions(res.body.ledgers)
    //lc.updateTotalTransactions()
    //lc.paginateledgerData(res.body.ledgers)

  lc.updateLedgerDataFailure = res => toastr.error(res.data.message);

  lc.paginateledgerData = function(ledgers) {
    lc.ledgerCount = 50;
    lc.dLedgerLimit = lc.setCounter(ledgers, 'DEBIT');
    return lc.cLedgerLimit = lc.setCounter(ledgers, 'CREDIT');
  };

  lc.setCounter = function(ledgers, type) {
    let txns = 0;
    let ledgerCount = 0;
    _.each(ledgers, function(led) {
      let l = 0;
      //count transactions in ledger
      _.each(led.transactions, function(txn) {
        if (txn.type === type) {
          return l += 1;
        }
      });
      if (txns <= lc.ledgerCount) {
        txns += l;
        return ledgerCount += 1;
      }
    });
    // if ledgerCount < txns
    //   ledgerCount = txns
    if (ledgerCount < 50) {
      ({ ledgerCount } = lc);
    }
    return ledgerCount;
  };

//   lc.countTotalTransactionsAfterSomeTime = (ledgers) ->
//     $timeout ( ->
//       lc.countTotalTransactions(ledgers)
// #      lc.showLoader = true
//     ), 1000

  lc.onAccountSelect = function(account) {
    if (account.applicableTaxes.length > 0) {
      _.each(lc.taxList, function(tax) {
        //taxInAccount = _.findWhere(account.applicableTaxes, tax.uniqueName)
        if (account.applicableTaxes.indexOf(tax.uniqueName) !== -1) {
          tax.isChecked = true;
          return lc.selectedLedger.taxList.push(tax);
        }
      });
      return lc.selectedLedger.applyApplicableTaxes = true;
    } else {
      lc.selectedLedger.taxList = [];
      return lc.selectedLedger.applyApplicableTaxes = false;
    }
  };

  lc.showAllTaxes = () =>
    _.each(lc.taxList, function(tax) {
      let taxInAccount = _.findWhere(lc.selectedLedger.taxList, {uniqueName: tax.uniqueName});
      if (!taxInAccount) {
        return lc.selectedLedger.taxList.push(tax);
      }
    })
  ;

  lc.showOnlyApplicableTaxes = txn =>
    _.each(lc.taxList, function(tax, i) {
      //taxInAccount = _.findWhere(txn.particular.applicableTaxes, {uniqueName: tax.uniqueName})
      if (txn.particular.applicableTaxes.indexOf(tax.uniqueName) === -1) {
        return lc.selectedLedger.taxList.splice(i, 1);
      }
    })
  ;

  lc.checkTaxForApplicableTaxes = function() {
    let applicableCheckedCount = 0;
    if (lc.selectedTxn.particular.applicableTaxes) {
      _.each(lc.selectedTxn.particular.applicableTaxes, function(unq) {
        let tax = _.findWhere(lc.selectedLedger.taxList, {uniqueName: unq});
        if (tax.isChecked) {
          return applicableCheckedCount += 1;
        }
      });
    }
    if (lc.selectedTxn.particular.applicableTaxes && (applicableCheckedCount === lc.selectedTxn.particular.applicableTaxes.length)) {
      lc.selectedLedger.applyApplicableTaxes = true;
      return _.each(lc.selectedLedger.taxList, function(tax) {
        if ((typeof(lc.selectedTxn.particular) === 'object') && (lc.selectedTxn.particular.applicableTaxes.indexOf(tax.uniqueName) === -1) && tax.isChecked) {
          return lc.selectedLedger.applyApplicableTaxes = false;
        }
      });
    } else {
      return lc.selectedLedger.applyApplicableTaxes = false;
    }
  };

  lc.countTotalTransactions = function(ledgers) {
    // lc.cNonemptyTxn = 0
    // lc.dNonemptyTxn = 0

    // lc.dbConfig.success = (e) ->
    //   db = e.target.result
    //   drOS = db.transaction([ 'drTransactions' ], 'readwrite').objectStore('drTransactions')
    //   dCountReq = drOS.count()
    //   dCountReq.onsuccess = (e) ->
    //     lc.dNonemptyTxn = e.target.result
    //   crOS = db.transaction([ 'crTransactions' ], 'readwrite').objectStore('crTransactions')
    //   cCountReq = crOS.count()
    //   cCountReq.onsuccess = (e) ->
    //     lc.cNonemptyTxn = e.target.result

    // dbInstance = idbService.openDb(lc.dbConfig)
    // $scope.creditTotal = 0
    // $scope.debitTotal = 0
    // $scope.dTxnCount = 0
    // $scope.cTxnCount = 0
    // if ledgers.length > 0
    //   _.each ledgers, (ledger) ->
    //     if ledger.transactions.length > 0
    //       _.each ledger.transactions, (txn) ->
    //         txn.isOpen = false
    //         if txn.type == 'DEBIT'
    //           $scope.dTxnCount += 1
    //           $scope.debitTotal += Number(txn.amount)
    //         else
    //           $scope.cTxnCount += 1
    //           $scope.creditTotal += Number(txn.amount)
  };

  // lc.updateTotalTransactions = () ->
  //   $timeout ( ->
  //     lc.countTotalTransactions()
  //   ), 500

  // lc.filterLedgers = (ledgers) ->
  //   _.each ledgers, (lgr) ->
  //     lgr.hasDebit = false
  //     lgr.hasCredit = false
  //     if lgr.transactions.length > 0
  //       _.each lgr.transactions, (txn) ->
  //         if txn.type == 'DEBIT'
  //           lgr.hasDebit = true
  //         else if txn.type == 'CREDIT'
  //           lgr.hasCredit = true

  // get tax list

  lc.getTaxList = function() {
    lc.taxList = [];
    if ($rootScope.canUpdate && $rootScope.canDelete) {
      return companyServices.getTax($rootScope.selectedCompany.uniqueName).then(lc.getTaxListSuccess, lc.getTaxListFailure);
    }
  };

  lc.getTaxListSuccess = res =>
    _.each(res.body, function(tax) {
      tax.isSelected = false;
      if (tax.account === null) {
        tax.account = {};
        tax.account.uniqueName = 0;
      }
      //check if selected account is a tax account
      if (tax.account.uniqueName === lc.accountToShow.uniqueName) {
        lc.accountToShow.isTax = true;
      }
      return lc.taxList.push(tax);
    })
  ;

    //lc.matchTaxAccounts(lc.taxList)

  lc.getTaxListFailure = res => toastr.error(res.data.message, res.status);

  // lc.matchTaxAccounts = (taxlist) ->
  //   _.each taxlist, (tax) ->


  // lc.addTaxEntry = (tax, item) ->
  //   if tax.isSelected
  //     lc.selectedTaxes.push(tax)
  //   else
  //     lc.selectedTaxes = _.without(lc.selectedTaxes, tax)
//    item.sharedData.taxes = lc.selectedTaxes

  //lc.isSelectedAccount()

  $timeout(( () => lc.getTaxList()), 2000);

  if (lc.accountUnq) {
    lc.getAccountDetail(lc.accountUnq);
  } else {
    lc.loadDefaultAccount();
  }
  // $scope.$on('account-list-updated', ()->
  //   lc.loadDefaultAccount()
  // )
  // lc.flatAccListC5 = {
  //     page: 1
  //     count: 5
  //     totalPages: 0
  //     currentPage : 1
  //   }

  lc.exportOptions = () => lc.showExportOption = !lc.showExportOption;

  lc.calculateEntryTotal = function(ledger) {
    if (ledger !== undefined) {
      ledger.entryTotal = {};
      ledger.entryTotal.amount = 0;
      if (ledger.transactions.length > 1) {
        _.each(ledger.transactions, function(txn) {
          if (txn.type === 'DEBIT') {
            return ledger.entryTotal.amount += Number(txn.amount);
          } else {
            return ledger.entryTotal.amount -= Number(txn.amount);
          }
        });
      } else {
        ledger.entryTotal.amount = Number(ledger.transactions[0]['amount']);
      }
      if (ledger.entryTotal.amount > 0) {
        return ledger.entryTotal.type = 'Dr';
      } else {
        ledger.entryTotal.amount = Number(ledger.entryTotal.amount) * -1;
        return ledger.entryTotal.type = 'Cr';
      }
    }
  };

  // lc.setPopoverPlacement = (offset) ->
  //   fromTop = $(window).height() / 3 * 2
  //   if(offset > fromTop)
  //     lc.popover.position = "top"
  //   else
  //     lc.popover.position = "bottom"
  //   return false

  lc.prevTxn = null;
  lc.selectTxn = function(ledger, txn, index ,e) {
    //setPopoverPlacement(e.clientY)
    if ((lc.accountToShow.stock !== null) && (txn.inventory === undefined)) {
      txn.inventory = {};
      txn.rate = lc.accountToShow.stock.rate;
    }
    if (txn.inventory && txn.inventory.quantity) {
      txn.rate = txn.amount/txn.inventory.quantity;
    }
    if (txn.particular.stock) {
      txn.rate = txn.particular.stock.rate;
    }
    //txn.rate = $filter('number')(Number(txn.rate), 4)
    lc.selectedTxn = txn;
    if (lc.prevTxn !== null) {
      lc.prevTxn.isOpen = false;
    }
    lc.selectedTxn.isOpen = true;
    lc.prevTxn = txn;
    lc.calculateEntryTotal(ledger);
    lc.showLedgerPopover = true;
    lc.matchInventory(txn);
    lc.ledgerBeforeEdit = {};
    angular.copy(ledger,lc.ledgerBeforeEdit);
    if (lc.popover.draggable) {
      lc.showPanel = true;
    }
    //else
      //lc.openClosePopOver(txn, ledger)
    if (ledger.isBankTransaction !== undefined) {
      _.each(ledger.transactions,function(transaction) {
        if (transaction.type === 'DEBIT') {
          return ledger.voucher.shortCode = "rcpt";
        } else if (transaction.type === 'CREDIT') {
          return ledger.voucher.shortCode = "pay";
        }
      });
    }
    lc.selectedLedger = ledger;
    lc.selectedLedger.index = index;
    //if ledger.uniqueName != '' || ledger.uniqueName != undefined || ledger.uniqueName != null
    lc.checkCompEntry(ledger);
    //lc.blankCheckCompEntry(ledger)
    lc.isTransactionContainsTax(ledger);
    return e.stopPropagation();
  };

  $scope.$watch('selectedTxn.amount', function(newVal, oldVal) {
    if (newVal !== oldVal) {
      return lc.calculateEntryTotal(lc.selectedLedger);
    }
  });

  lc.matchInventory = function(txn) {
    let match = _.findWhere($rootScope.fltAccntListPaginated, {uniqueName:txn.particular.uniqueName});
    if (match && (match.stock !== null) && (txn.inventory === null)) {
      return txn.inventory = angular.copy(match.stock, txn.inventory);
    }
  };

  lc.setEntryTotal = function(pre, post, condition) {
    if (condition !== 'delete') {
      return _.each(post.ledgers, function(l) {
        if (pre.uniqueName === l.uniqueName) {
          pre.total = l.total;
          if (condition === 'update') {
            return lc.updatedLedgerTotal = l.total;
          }
        }
      });
    }
  };

  lc.openClosePopOver = function(txn, ledger, e) {
    if (lc.prevTxn !== null) {
      lc.prevTxn.isOpen = false;
    }
    txn.isOpen = true;
    txn.isblankOpen = true;
    lc.prevTxn = txn;
    lc.selectedTxn = txn;
    lc.selectedLedger = ledger;

    if ($(e.currentTarget).offset().top > (($(window).height() / 3) * 2)) {
      return lc.popover.position = "top";
    } else {
      return lc.popover.position = "bottom";
    }
  };

    // lc.openClosePopoverForLedger(txn, ledger)
    // lc.openClosePopoverForBlankLedger(txn, ledger)
    // lc.openClosePopoverForeLedger(txn, ledger)

  lc.checkCompEntry = function(ledger) {
    if (!ledger.uniqueName) {
      lc.blankLedger.isCompoundEntry = true;
      if (lc.prevLedger.uniqueName) {
        if (lc.cLedgerContainer.ledgerData[lc.prevLedger.uniqueName]) {
          lc.cLedgerContainer.ledgerData[lc.prevLedger.uniqueName].isCompoundEntry = false;
        }
        if (lc.dLedgerContainer.ledgerData[lc.prevLedger.uniqueName]) {
          return lc.dLedgerContainer.ledgerData[lc.prevLedger.uniqueName].isCompoundEntry = false;
        }
      }
    } else {
      if (lc.cLedgerContainer.ledgerData[ledger.uniqueName]) {
        lc.cLedgerContainer.ledgerData[ledger.uniqueName].isCompoundEntry = true;
      }
      if (lc.dLedgerContainer.ledgerData[ledger.uniqueName]) {
        lc.dLedgerContainer.ledgerData[ledger.uniqueName].isCompoundEntry = true;
      }
      if (lc.prevLedger && lc.prevLedger.uniqueName && (ledger.uniqueName !== lc.prevLedger.uniqueName)) {
        if (lc.cLedgerContainer.ledgerData[lc.prevLedger.uniqueName]) {
          lc.cLedgerContainer.ledgerData[lc.prevLedger.uniqueName].isCompoundEntry = false;
        }
        if (lc.dLedgerContainer.ledgerData[lc.prevLedger.uniqueName]) {
          return lc.dLedgerContainer.ledgerData[lc.prevLedger.uniqueName].isCompoundEntry = false;
        }
      } else if (lc.prevLedger && !lc.prevLedger.uniqueName) {
        return lc.blankLedger.isCompoundEntry = false;
      }
    }
  };

  lc.blankCheckCompEntry = function(ledger) {
    if (ledger.isBlankLedger) {
      return _.each(ledger.transactions, function(txn) {
        if ((txn.particular.uniqueName !== undefined) && (txn.particular.uniqueName.length > 0)) {
          return ledger.isBlankCompEntry = true;
        }
      });
    } else {
      ledger.isBlankCompEntry = false;
      return lc.blankLedger.isBlankCompEntry = false;
    }
  };

  // lc.formatInventoryTxns = (ledger) ->
  //   if ledger.transactions.length > 0
  //     _.each ledger.transactions, (txn) ->
  //       if txn.inventory != undefined && txn.inventory.quantity != null && Number(txn.inventory.quantity) > 0
  //         txn.inventory.stock = {}
  //         if txn.particular.stock != null
  //           txn.inventory.stock.uniqueName = txn.particular.uniqueName
  //         else
  //           txn.inventory.stock.uniqueName = lc.accountToShow.uniqueName

  lc.buildLedger = function(ledger) {
    if (!ledger.uniqueName) {
      ledger = lc.blankLedger;
    } else {
      let transactions = [];
      if (lc.cLedgerContainer.ledgerData[ledger.uniqueName]) {
        let ctxn = lc.cLedgerContainer.ledgerData[ledger.uniqueName].transactions;
        transactions.push(ctxn);
      }
      if (lc.dLedgerContainer.ledgerData[ledger.uniqueName]) {
        let dtxn = lc.dLedgerContainer.ledgerData[ledger.uniqueName].transactions;
        transactions.push(dtxn);
      }
      transactions = _.flatten(transactions);
      ledger.transactions = transactions;
    }
    return ledger;
  };


  $scope.invoiceFile = {};
  $scope.getInvoiceFile = function(files) {
    let file = files[0];
    let formData = new FormData();
    formData.append('file', file);
    formData.append('company', $rootScope.selectedCompany.uniqueName);

    this.success = function(res) {
      lc.selectedLedger.attachedFile = res.data.body.uniqueName;
      lc.selectedLedger.attachedFileName = res.data.body.name;
      return toastr.success('file uploaded successfully');
    };

    this.failure = function(res) {
      if (typeof res === 'object') {
        return toastr.error(res.data.message);
      } else {
        return toastr.error('Upload failed, please check that file size is less than 1 mb');
      }
    };

    let url = '/upload-invoice'
    if (isElectron) {
      url = `/company/${$rootScope.selectedCompany.uniqueName}/ledger/upload`;
    }
    return $http.post(url, formData, {
      transformRequest: angular.identity,
      headers: {'Content-Type': undefined}
    }).then(this.success, this.failure);
  };

  lc.downloadAttachedFile = function(file, e) {
    e.stopPropagation();
    this.success = function(res) {
      let data = lc.b64toBlob(res.body.uploadedFile, `image/${res.body.fileType}`);
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

  lc.deleteAttachedFile = function() {
    lc.selectedLedger.attachedFile = '';
    return lc.selectedLedger.attachedFileName = '';
  };

  lc.doingEntry = false;
  lc.lastSelectedLedger = {};
  lc.saveUpdateLedger = function(ledger) {
    if (!ledger.isBankTransaction) {
      ledger = lc.buildLedger(ledger);
    }
    // lc.pageLoader = true
    // lc.showLoader = true
    lc.lastSelectedLedger = ledger;
    lc.dLedgerLimitBeforeUpdate = lc.dLedgerLimit;
    lc.cLedgerLimitBeforeUpdate = lc.cLedgerLimit;
    //lc.formatInventoryTxns(ledger)
    if (lc.doingEntry === true) {
      return;
    }

    lc.doingEntry = true;
    lc.ledgerTxnChanged = false;
    if (ledger.isBankTransaction) {
      lc.btIndex = ledger.index;
    }
    delete ledger.isCompoundEntry;
    if (!_.isEmpty(ledger.voucher.shortCode)) {
      let response, unqNamesObj;
      if (_.isEmpty(ledger.uniqueName)) {
        //add new entry
        unqNamesObj = {
          compUname: $rootScope.selectedCompany.uniqueName,
          acntUname: lc.accountUnq
        };
        delete ledger.uniqueName;
        delete ledger.voucherNo;
        let transactionsArray = [];
        // _.every(ledgerToSend.transactions,(led) ->
        //   delete led.date
        //   delete led.parentGroups
        //   delete led.particular.parentGroups
        //   delete led.particular.mergedAccounts
        //   delete led.particular.applicableTaxes
        // )
        let rejectedTransactions = [];
        transactionsArray = _.reject(ledger.transactions, function(led) {
         if ((led.particular === "") || (led.particular.uniqueName === "")) {
           rejectedTransactions.push(led);
           return led;
         }
        });
        ledger.transactions = transactionsArray;
        ledger.voucherType = ledger.voucher.shortCode;
        lc.addTaxesToLedger(ledger);
        if (ledger.transactions.length > 0) {
          if (ledger.transactions.length > 1) {
            lc.matchTaxTransactions(ledger.transactions, lc.taxList);
            lc.checkManualTaxTransaction(ledger.transactions, lc.ledgerBeforeEdit.transactions);
            lc.checkTaxCondition(ledger);
          }
          return ledgerService.createEntry(unqNamesObj, ledger).then(
            res => lc.addEntrySuccess(res, ledger),
            res => lc.addEntryFailure(res,rejectedTransactions, ledger));
        } else {
          lc.doingEntry = false;
          ledger.transactions = rejectedTransactions;
          response = {};
          response.data = {};
          response.data.message = "There must be at least a transaction to make an entry.";
          response.data.status = "Error";
          return lc.addEntryFailure(response,[]);
        }
//          toastr.error("There must be at least a transaction to make an entry.")
      } else {
        //update entry
        //lc.removeEmptyTransactions(ledger.transactions)
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
          acntUname: lc.accountUnq,
          entUname: ledger.uniqueName
        };
        // transactionsArray = []
        // _.every(lc.blankLedger.transactions,(led) ->
        //   delete led.date
        //   delete led.parentGroups
        // )
        // _.each(ledger.)
        // transactionsArray = _.reject(lc.blankLedger.transactions, (led) ->
        //   led.particular.uniqueName == ""
        // )
        lc.addTaxesToLedger(ledger);
//        console.log ledger
        //ledger.transactions.push(transactionsArray)
        ledger.voucher = _.findWhere(lc.voucherTypeList,{'shortCode':ledger.voucher.shortCode});
        ledger.voucherType = ledger.voucher.shortCode;
        if (ledger.transactions.length > 0) {
          lc.matchTaxTransactions(ledger.transactions, lc.taxList);
          lc.matchTaxTransactions(lc.ledgerBeforeEdit.transactions, lc.taxList);
          lc.checkManualTaxTransaction(ledger.transactions, lc.ledgerBeforeEdit.transactions);
          let updatedTxns = lc.updateEntryTaxes(ledger.transactions);
          ledger.transactions = updatedTxns;
          lc.checkTaxCondition(ledger);
          let isModified = false;
          if (ledger.taxes.length > 0) {
            isModified = lc.checkPrincipleModifications(ledger, lc.ledgerBeforeEdit.transactions);
          }
          if (isModified) {
            lc.selectedTxn.isOpen = false;
            return modalService.openConfirmModal({
              title: 'Update',
              body: 'Principle transaction updated, Would you also like to update tax transactions?',
              ok: 'Yes',
              cancel: 'No'
            }).then(
                res => lc.UpdateEntry(ledger, unqNamesObj, true),
                res => lc.UpdateEntry(ledger, unqNamesObj, false));
          } else {
           return ledgerService.updateEntry(unqNamesObj, ledger).then(
             res => lc.updateEntrySuccess(res, ledger),
             res => lc.updateEntryFailure(res, ledger));
         }
        } else {
          lc.doingEntry = false;
          response = {};
          response.data = {};
          response.data.message = "There must be at least a transaction to make an entry.";
          response.data.status = "Error";
          return lc.addEntryFailure(response,[]);
        }
      }
    } else {
      return toastr.error("Select voucher type.");
    }
  };


  lc.checkTaxCondition = function(ledger) {
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

  lc.checkPrincipleModifications = function(ledger, uTxnList) {
    let withoutTaxesLedgerTxn = lc.getPrincipleTxnOnly(ledger.transactions);
    let withoutTaxesUtxnList = lc.getPrincipleTxnOnly(uTxnList);
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

  lc.checkManualTaxTransaction = function(txnList, uTxnList) {
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

  lc.getPrincipleTxnOnly = function(txnList) {
    let transactions = [];
    _.each(txnList, function(txn) {
      if ((txn.isTax === undefined) || !txn.isTax) {
        return transactions.push(txn);
      }
    });
    return transactions;
  };

  lc.addTaxesToLedger = function(ledger) {
    ledger.taxes = [];
    return _.each(lc.taxList, function(tax) {
      if (tax.isChecked === true) {
        return ledger.taxes.push(tax.uniqueName);
      }
    });
  };

  lc.updateEntryTaxes = function(txnList) {
    let transactions = [];
    if (txnList.length > 1) {
      _.each(txnList, (txn, idx) =>
        _.each(lc.taxList, function(tax) {
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

  lc.isTransactionContainsTax = function(ledger) {
    if (ledger.taxes && (ledger.taxes.length > 0)) {
      ledger.taxList = [];
      return _.each(lc.taxList, function(tax) {
        if (ledger.taxes.indexOf(tax.uniqueName) !== -1) {
          tax.isChecked = true;
          return ledger.taxList.push(tax);
        }
      });
    }
  };

    // if ledger.taxes != undefined && ledger.taxes.length > 0
    //   _.each(lc.taxList, (tax) ->
    //     tax.isChecked = false
    //     _.each(ledger.taxes, (taxe) ->
    //       if taxe == tax.uniqueName
    //         tax.isChecked = true
    //     )
    //   )
    // else
    //   _.each(lc.taxList, (tax) ->
    //     #tax.isChecked = false
    //     _.each(ledger.transactions, (txn) ->
    //       if txn.particular.uniqueName == tax.account.uniqueName
    //         tax.isChecked = true
    //     )
    //   )

  lc.UpdateEntry = function(ledger, unqNamesObj,removeTax) {
    if (removeTax === true) {
      lc.txnAfterRmovingTax = [];
      lc.removeTaxTxnOnPrincipleTxnModified(ledger.transactions);
      ledger.transactions = lc.txnAfterRmovingTax;
    }
    if (ledger.transactions.length > 0) {
      return ledgerService.updateEntry(unqNamesObj, ledger).then(
        res => lc.updateEntrySuccess(res, ledger),
        res => lc.updateEntryFailure(res, ledger));
    }
  };

  lc.matchTaxTransactions = (txnList, taxList) =>
    _.each(txnList, txn =>
      _.each(taxList, function(tax) {
        if (txn.particular.uniqueName === tax.account.uniqueName) {
          return txn.isTax = true;
        }
      })
    )
  ;

  lc.removeTaxTxnOnPrincipleTxnModified = txnList =>
    _.each(txnList, function(txn) {
      if (!txn.isTax) {
        return lc.txnAfterRmovingTax.push(txn);
      }
    })
  ;

  lc.resetBlankLedger = function() {
    lc.newDebitTxn = {
      date: $filter('date')(new Date(), "dd-MM-yyyy"),
      particular: {
        name:'',
        uniqueName:''
      },
      amount : 0,
      type: 'DEBIT'
    };
    lc.newCreditTxn = {
      date: $filter('date')(new Date(), "dd-MM-yyyy"),
      particular: {
        name:'',
        uniqueName:''
      },
      amount : 0,
      type: 'CREDIT'
    };
    return lc.blankLedger = {
      isBlankLedger : true,
      description:null,
      entryDate:$filter('date')(new Date(), "dd-MM-yyyy"),
      attachedFileName: '',
      attachedFile: '',
//      hasCredit:false
//      hasDebit:false
      invoiceGenerated:false,
      isCompoundEntry:false,
      applyApplicableTaxes:false,
      tag:null,
      transactions:[
        lc.newDebitTxn,
        lc.newCreditTxn
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

  lc.addEntrySuccess = function(res, ledger) {
    lc.doingEntry = false;
    ledger.failed = false;
    toastr.success("Entry created successfully", "Success");
    //addThisLedger = {}
    //_.extend(addThisLedger,lc.selectedLedger)
    //lc.ledgerData.ledgers.push(res.body)
    //lc.getLedgerData(false)
    lc.resetBlankLedger();
    lc.selectedLedger = lc.blankLedger;
    _.each(lc.taxList, tax => tax.isChecked = false);
    lc.selectedTxn.isOpen = false;
    if (lc.mergeTransaction) {
      $timeout(( () => lc.mergeBankTransactions(lc.mergeTransaction)), 2000);
    }
    lc.updateLedgerData('new',res.body[0]);
    //lc.addToIdb([res.body], lc.accountUnq)
    //lc.pushNewEntryToLedger(res.body)
    if (ledger.isBankTransaction) {
      lc.updateBankLedger(ledger);
    }
    return lc.getPaginatedLedger(lc.currentPage);
  };
    // $timeout ( ->
    //   lc.pageLoader = false
    //   lc.showLoader = false
    // ), 1000

  lc.addEntryFailure = function(res, rejectedTransactions, ledger) {
    lc.doingEntry = false;
    ledger.failed = true;
    toastr.error(res.data.message, res.data.status);
    if (rejectedTransactions.length > 0) {
      return _.each(rejectedTransactions, rTransaction => lc.selectedLedger.transactions.push(rTransaction));
    }
  };
    // $timeout ( ->
    //   lc.pageLoader = false
    //   lc.showLoader = false
    // ), 1000

  lc.updateBankLedger = function(ledger) {
    _.each(lc.eLedgerData, function(eledger, idx) {
      if (ledger.transactionId === eledger.transactionId) {
        return lc.eLedgerData.splice(idx, 1);
      }
    });
    return lc.getLedgerData();
  };

  // lc.pushNewEntryToLedger = (newLedgers) ->
  //   console.log newLedgers

    // _.each newLedgers, (ledger) ->
    //   lc.calculateEntryTotal(ledger)
    //   lc.ledgerData.ledgers.push(ledger)

  lc.resetLedger = function() {
    lc.resetBlankLedger();
    lc.selectedLedger = lc.blankLedger;
    return _.each(lc.taxList, tx => tx.isChecked = false);
  };

  lc.updateEntrySuccess = function(res, ledger) {
    lc.doingEntry = false;
    ledger.failed = false;
    toastr.success("Entry updated successfully.", "Success");
    //addThisLedger = {}
    //_.extend(addThisLedger,lc.blankLedger)
//    lc.ledgerData.ledgers.push(addThisLedger)
    //lc.getLedgerData(false)
    //_.extend(ledger, res.body)
    lc.updateEntryOnUI(res.body);
    lc.resetBlankLedger();
    lc.selectedLedger = lc.blankLedger;
    lc.selectedTxn.isOpen = false;
    if (lc.mergeTransaction) {
      lc.mergeBankTransactions(lc.mergeTransaction);
    }
    //lc.dLedgerLimit = lc.dLedgerLimitBeforeUpdate
    //lc.openClosePopOver(res.body.transactions[0], res.body)
    lc.updateLedgerData('update',res.body);
    $timeout(( () => ledger.total = lc.updatedLedgerTotal), 2000);
    return lc.getPaginatedLedger(lc.currentPage);
  };

  lc.updateEntryFailure = function(res, ledger) {
    lc.doingEntry = false;
    ledger = angular.copy(lc.ledgerBeforeEdit, ledger);
    return toastr.error(res.data.message, res.data.status);
  };
    // $timeout ( ->
    //   lc.pageLoader = false
    //   lc.showLoader = false
    // ), 1000

  lc.createLedger = function(ledger, type) {
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

  lc.updateEntryOnUI = function(ledger) {
    if (ledger.transactions.length) {
      let dLedger = lc.createLedger(ledger, 'DEBIT');
      let cLedger = lc.createLedger(ledger, 'CREDIT');
      lc.cLedgerContainer.ledgerData[ledger.uniqueName] = _.extend(lc.cLedgerContainer.ledgerData[ledger.uniqueName], cLedger);
      return lc.dLedgerContainer.ledgerData[ledger.uniqueName] = _.extend(lc.dLedgerContainer.ledgerData[ledger.uniqueName], dLedger);
    }
  };

  lc.closePopOverSingleLedger = ledger =>
    _.each(ledger.transactions, txn => txn.isOpen = false)
  ;

  lc.deleteEntryConfirm = ledger =>
    modalService.openConfirmModal({
      title: 'Delete',
      body: 'Are you sure you want to delete this entry?',
      ok: 'Yes',
      cancel: 'No'
    }).then(
      res => lc.deleteEntry(ledger),
      res => $close())
  ;

  lc.deleteEntry = function(ledger) {
    // lc.pageLoader = true
    // lc.showLoader = true
    lc.lastSelectedLedger = ledger;
    if (((ledger.uniqueName === undefined) || _.isEmpty(ledger.uniqueName)) && (ledger.isBankTransaction)) {
      return;
    }
    let unqNamesObj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      acntUname: lc.accountUnq,
      entUname: ledger.uniqueName
    };
    if ((unqNamesObj.acntUname !== '') || (unqNamesObj.acntUname !== undefined)) {
      return ledgerService.deleteEntry(unqNamesObj).then(res => lc.deleteEntrySuccess(ledger, res)
      , lc.deleteEntryFailure);
    }
  };

  lc.deleteEntrySuccess = function(item, res) {
    toastr.success("Entry deleted successfully","Success");
    lc.removeDeletedLedger(item);
    lc.resetBlankLedger();
    lc.selectedLedger = lc.blankLedger;
    //lc.getLedgerData(false)
    if (lc.mergeTransaction) {
      $timeout(( () => lc.mergeBankTransactions(lc.mergeTransaction)), 2000);
    }
//    lc.calculateLedger(lc.ledgerData, "deleted")
    return lc.updateLedgerData('delete');
  };


  lc.deleteEntryFailure = res => toastr.error(res.data.message, res.data.status);

  lc.removeDeletedLedger = function(item) {
    if (lc.dLedgerContainer.ledgerData[item.uniqueName]) {
      lc.dLedgerContainer.remove(item);
    }
    if (lc.cLedgerContainer.ledgerData[item.uniqueName]) {
      return lc.cLedgerContainer.remove(item);
    }
  };
    // index = 0
    // _.each lc.ledgerData.ledgers, (led, idx ) ->
    //   if led.uniqueName == item.uniqueName
    //     index = idx
    // lc.ledgerData.ledgers.splice(index, 1)

  // select multiple transactions, from same or different entries
  lc.allSelected = [];
  lc.selectMultiple = function(ledger, txn, index) {
    let cTxn = {};
    if (txn.isSelected === true) {
      cTxn.unq = ledger.uniqueName;
      cTxn.index = index;
      cTxn.txn = txn;
      return lc.allSelected.push(cTxn);
    }
  };

  lc.deleteMultipleTransactions = function() {
    if (lc.allSelected.length > 0) {
      _.each(lc.ledgerData.ledgers, ledger =>
        _.each(lc.allSelected, function(t) {
          if (ledger.uniqueName = t.unq) {
            return ledger.transactions.splice(t.index, 1);
          }
        })
      );
    }
    return lc.allSelected = [];
  };

  lc.redirectToState = state => $state.go(state);


  lc.b64toBlob = function(b64Data, contentType, sliceSize) {
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


  lc.downloadInvoice = function(invoiceNumber, e) {
    e.stopPropagation();
    let obj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      acntUname: lc.accountUnq
    };
    let data= {
      invoiceNumber: [invoiceNumber],
      template: ''
    };
    return accountService.downloadInvoice(obj, data).then(res => lc.downloadInvSuccess(res, invoiceNumber)
    , lc.multiActionWithInvFailure);
  };

  lc.downloadInvSuccess = function(res, invoiceNumber){
    let data = lc.b64toBlob(res.body, "application/pdf", 512);
    let blobUrl = URL.createObjectURL(data);
    lc.dlinv = blobUrl;
    return FileSaver.saveAs(data, lc.accountToShow.name+ '-' + invoiceNumber+".pdf");
  };

  // common failure message
  lc.multiActionWithInvFailure=res=> toastr.error(res.data.message, res.data.status);

  lc.triggerPanelFocus = function(e) {
    if (e.keyCode === 13) {
      $('#saveUpdate').focus();
      e.stopPropagation();
      return false;
    }
  };

  lc.gwaList = {
    page: 1,
    count: 5000,
    totalPages: 0,
    currentPage : 1,
    limit: 5
  };

  lc.getFlattenGrpWithAccList = function(compUname, showEmpty) {
//    console.log("working  : ",lc.working)
    let reqParam = {
      companyUniqueName: compUname,
      q: '',
      page: lc.gwaList.page,
      count: lc.gwaList.count
    };
    if(showEmpty) {
      reqParam.showEmptyGroups = true;
    }
    if (!isElectron) {
        return groupService.getFlattenGroupAccList(reqParam).then(lc.getFlattenGrpWithAccListSuccess, lc.getFlattenGrpWithAccListFailure);
    } else {
        return groupService.getFlattenGroupAccListElectron(reqParam).then(lc.getFlattenGrpWithAccListSuccess, lc.getFlattenGrpWithAccListFailure);
    }
  };

  lc.getGroupsWithDetail = function() {
    if (($rootScope.allowed === true) && $rootScope.canUpdate) {
      return groupService.getGroupsWithoutAccountsInDetail($rootScope.selectedCompany.uniqueName).then(
        success=> lc.detGrpList = success.body,
        failure => toastr.error('Failed to get Detailed Groups List'));
    }
  };
  if ($rootScope.canUpdate) {
    lc.getGroupsWithDetail();
  }

  lc.markFixedGrps = function(flatGrpList) {
    let temp = [];
    _.each(lc.detGrpList, detGrp =>
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

  lc.getFlattenGrpWithAccListSuccess = function(res) {
    lc.gwaList.totalPages = res.body.totalPages;
    lc.flatGrpList = lc.markFixedGrps(res.body.results);
    //lc.removeEmptyGroups(res.body.results)
    //lc.flatAccntWGroupsList = lc.grpWithoutEmptyAccounts
    //console.log(lc.flatAccntWGroupsList)
    //lc.showAccountList = true
    return lc.gwaList.limit = 5;
  };
    //$rootScope.companyLoaded = true
    //lc.working = false

  lc.getFlattenGrpWithAccListFailure = res => toastr.error(res.data.message);
    //lc.working = false

  lc.addNewAccount = function() {
    lc.newAccountModel.group = '';
    lc.newAccountModel.account = '';
    lc.newAccountModel.accUnqName = '';
    lc.selectedTxn.isOpen = false;
    lc.getFlattenGrpWithAccList($rootScope.selectedCompany.uniqueName, true);
    return lc.AccmodalInstance = $uibModal.open({
      templateUrl:'public/webapp/Ledger/createAccountQuick.html',
      size: "sm",
      backdrop: 'static',
      scope: $scope
    });
  };
    //modalInstance.result.then(lc.addNewAccountCloseSuccess, lc.addNewAccountCloseFailure)

  lc.addNewAccountConfirm = function() {
    let newAccount = {
      email:"",
      mobileNo:"",
      name:lc.newAccountModel.account,
      openingBalanceDate: $filter('date')(lc.today, "dd-MM-yyyy"),
      uniqueName:lc.newAccountModel.accUnqName
    };
    let unqNamesObj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      selGrpUname: lc.newAccountModel.group.groupUniqueName,
      acntUname: lc.newAccountModel.accUnqName
    };
    if ((lc.newAccountModel.group.groupUniqueName === '') || (lc.newAccountModel.group.groupUniqueName === undefined)) {
      return toastr.error('Please select a group.');
    } else {
      return accountService.createAc(unqNamesObj, newAccount).then(lc.addNewAccountConfirmSuccess, lc.addNewAccountConfirmFailure);
    }
  };

  lc.addNewAccountConfirmSuccess = function(res) {
    toastr.success('Account created successfully');
    $rootScope.getFlatAccountList($rootScope.selectedCompany.uniqueName);
    return lc.AccmodalInstance.close();
  };

  lc.addNewAccountConfirmFailure = res => toastr.error(res.data.message);

  lc.genearateUniqueName = function(unqName) {
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
      return lc.newAccountModel.accUnqName = unq;
    } else {
      return lc.newAccountModel.accUnqName = '';
    }
  };

  lc.genUnq = unqName =>
    $timeout(( () => lc.genearateUniqueName(unqName))
    )
  ;

  lc.validateUniqueName = unq => unq = unq.replace(/ |,|\//g,'');

  lc.onValueChange = function(value, txn) {
    if (((txn.particular.stock !== null) &&  (txn.particular.stock !== undefined)) || (lc.accountToShow.stock !== null) || (txn.inventory && txn.inventory.stock)) {
      switch (value) {
        case 'qty':
          if ((lc.selectedTxn.rate > 0) && lc.selectedTxn.inventory && lc.selectedTxn.inventory.quantity) {
            return lc.selectedTxn.amount = lc.selectedTxn.rate * lc.selectedTxn.inventory.quantity;
          }
          break;
        case 'amount':
          if (lc.selectedTxn.inventory && lc.selectedTxn.inventory.quantity) {
            return lc.selectedTxn.rate = lc.selectedTxn.amount/lc.selectedTxn.inventory.quantity;
          }
          break;
        case 'rate':
          if (lc.selectedTxn.inventory && lc.selectedTxn.inventory.quantity) {
            return lc.selectedTxn.amount = lc.selectedTxn.rate * lc.selectedTxn.inventory.quantity;
          }
          break;
      }
    }
  };

  lc.checkStockAccount = function(item, txn) {
    if((item.stock === null) && (lc.accountToShow.stock === null)) {
      return txn.inventory = null;
    } else if ((lc.accountToShow.stock === null) && (item.stock !== null)) {
      return txn.rate = item.stock.rate;
    } else if ((item.stock !== null) && (lc.accountToShow.stock === null)) {
      return txn.rate = lc.accountToShow.stock.rate;
    }
  };

  lc.getEntrySettings = function() {
    this.success = res => lc.entrySettings = res.body;
    this.failure = res => toastr.error(res.data.message);

    let reqParam = {
      compUname: $rootScope.selectedCompany.uniqueName
    };

    return ledgerService.getSettings(reqParam).then(this.success, this.failure);
  };

  lc.getEntrySettings();

  lc.updateEntrySettings = function(status) {
    this.success = function(res) {
      lc.entrySettings = res.body;
      if (res.body.status) {
        return toastr.success('Default Date Set for Ledgers');
      } else {
        return toastr.success('Default Date unset for Ledgers');
      }
    };
    this.failure = res => toastr.error(res.data.message);

    let data = lc.entrySettings;
    let reqParam = {};
    reqParam.compUname = $rootScope.selectedCompany.uniqueName;
    return ledgerService.updateEntrySettings(reqParam, data).then(this.success, this.failure);
  };

  lc.clearTaxSelection = function(txn, ledger) {
    if (ledger.uniqueName !== lc.prevLedger.uniqueName) {
      return _.each(lc.taxList, tax => tax.isChecked = false);
    }
  };


  lc.prevTxn = null;
  lc.prevLedger = {};
  lc.slctxn = function(ledger, txn, e) {
    if (!txn.isOpen) {
      txn.isOpen = true;
    }
    if (lc.prevTxn && (lc.prevTxn !== txn)) {
      lc.prevTxn.isOpen = false;
    }
    if ((lc.accountToShow.stock !== null) && (lc.accountToShow.stock !== undefined) && (txn.inventory === undefined)) {
      txn.inventory = {};
      txn.rate = lc.accountToShow.stock.rate;
    }
    if (txn.inventory && txn.inventory.quantity) {
      txn.rate = txn.amount/txn.inventory.quantity;
    }
    if (txn.particular.stock) {
      txn.rate = txn.particular.stock.rate;
    }
    lc.clearTaxSelection(txn, ledger);
    if (!txn.isTax && (ledger.uniqueName !== lc.prevLedger.uniqueName)) {
      lc.showTaxTxns(ledger);
    } else if (!txn.isTax && (ledger.uniqueName === lc.prevLedger.uniqueName)) {
      _.each(ledger.transactions, function(txn) {
        if (txn.isTax) {
          return txn.hide = true;
        }
      });
    }
    lc.prevTxn = txn;
    lc.selectedLedger = ledger;
    lc.selectedTxn = txn;
    lc.matchInventory(txn);
    lc.ledgerBeforeEdit = {};
    lc.checkCompEntry(ledger);
    angular.copy(ledger,lc.ledgerBeforeEdit);
    lc.isTransactionContainsTax(ledger);
    lc.log(lc.prevLedger.uniqueName, ledger.uniqueName);
    if (lc.prevLedger.uniqueName !== ledger.uniqueName) {
      if (lc.cLedgerContainer.ledgerData[lc.prevLedger.uniqueName] && lc.cLedgerContainer.ledgerData[lc.prevLedger.uniqueName].isExtra) {
        lc.cLedgerContainer.remove(lc.prevLedger);
        lc.log("RemovedCR: ", lc.prevLedger.uniqueName);
      }
      if (lc.dLedgerContainer.ledgerData[lc.prevLedger.uniqueName] && lc.dLedgerContainer.ledgerData[lc.prevLedger.uniqueName].isExtra) {
        lc.dLedgerContainer.remove(lc.prevLedger);
        lc.log("RemovedDR: ", lc.prevLedger.uniqueName);
      }
      lc.prevLedger = ledger;
    }
    lc.showMatchingEntries = false;
    if (e) {
      return e.stopPropagation();
    }
  };

  lc.dBlankTxn = {
    date: $filter('date')(new Date(), "dd-MM-yyyy"),
    particular: {
      name:'',
      uniqueName:''
    },
    amount : 0,
    type: 'DEBIT'
  };

  lc.cBlankTxn = {
    date: $filter('date')(new Date(), "dd-MM-yyyy"),
    particular: {
      name:'',
      uniqueName:''
    },
    amount : 0,
    type: 'CREDIT'
  };


  lc.blankLedger = new blankLedgerModel();
  lc.blankLedger.entryDate = $filter('date')(lc.today, 'dd-MM-yyyy');
  lc.blankLedger.transactions.push(lc.dBlankTxn);
  lc.blankLedger.transactions.push(lc.cBlankTxn);

  $rootScope.$on('company-changed', function(event,changeData) {
    if (changeData.type === 'CHANGE') {
      lc.loadDefaultAccount();
      return lc.getTaxList();
    }
  });
    // else if changeData.type == 'SELECT'
    //   console.log 'load same account'
    //$state.reload()
  //   # when company is changed, redirect to manage company page
  //   if changeData.type == 'CHANGE'
  //     # lc.redirectToState('company.content.manage')
  //     $state.go('company.content.ledgerContent', {unqName: ""})
  //     lc.showLoader = true

  $rootScope.$on('run-tour', function() {
    // lc.disableInputsWhileTour = true
    if (lc.lastTourStep > 0) {
      nzTour.start(tour).then(
        function() {
          lc.runTour = false;
          // lc.disableInputsWhileTour = false
          return console.log('finished');
      });
      return nzTour.gotoStep(lc.lastTourStep+1);
    } else {
      return nzTour.start(tour).then(
        () => lc.runTour = false);
    }
  });

  $scope.$watch('popover.draggable', function(newVal, oldVal) {
    if (newVal !== oldVal) {
      return $('.popover').remove();
    }
  });


  $(document).on('click', function(e) {
    if (lc.prevTxn) {
      lc.prevTxn.isOpen = false;
    }
    return 0;
  });

  lc.getReconciledEntries = function(cheque, toMap, matchingEntries) {
    this.success = function(res) {
      lc.reconciledEntries = res.body;
      if (toMap) {
        _.each(lc.reconciledEntries, entry =>
          _.each(entry.transactions, function(txn) {
            if (txn.amount === lc.selectedLedger.transactions[0].amount) {
              return matchingEntries.push(entry);
            }
          })
        );
        if (matchingEntries.length === 1) {
          return lc.confirmBankTransactionMap(matchingEntries[0], lc.selectedLedger);
        } else if (matchingEntries.length >1) {
          return lc.showBankEntriesToMap(matchingEntries);
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
  //   lc.getAccountDetail(lc.accountUnq)
  //   #lc.isSelectedAccount()
  //   #$rootScope.$emit('catchBreadcumbs', lc.accountToShow.name)
  // )

  lc.matchBankTransaction = function() {
    let matchingEntries = [];
    return lc.getReconciledEntries('', true, matchingEntries);
  };


  lc.confirmBankTransactionMap = (mappedEntry, bankEntry) =>
    modalService.openConfirmModal({
        title: 'Map Bank Entry',
        body: `Selected bank transaction will be mapped with cheque number ${mappedEntry.chequeNumber}. Click yes to accept.`,
        ok: 'Yes',
        cancel: 'No'
      }).then(
          res => lc.mapBankTransaction(mappedEntry.uniqueName, bankEntry.transactionId),
          function(res) {}
      )
  ;
  lc.mapBankTransaction = function(entryUnq, transactionId) {
    lc.selectedTxn.isOpen = false;
    this.success = function(res) {
      toastr.success(res.body);
      lc.getLedgerData();
      return lc.getBankTransactions($rootScope.selectedAccount.uniqueName);
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

  lc.showBankEntriesToMap = function(matchingEntries) {
    lc.showMatchingEntries = true;
    return lc.matchingEntries = matchingEntries;
  };

  lc.commonOnUpgrade = function(db) {
    if (db.objectStoreNames.contains('ledgers')) {
      db.deleteObjectStore("ledgers");
    }
    if (!db.objectStoreNames.contains('ledgers')) {
      let search = db.createObjectStore('ledgers', {keyPath: 'uniqueId'});
      search.createIndex('accountUniqueName+index', [
        'accountUniqueName',
        'index'
      ], {unique: true});
      search.createIndex('accountUniqueName+timestamp', [
        'accountUniqueName',
        'timestamp'
      ], {unique: false});
      search.createIndex('accountUniqueName', [
        'accountUniqueName'
      ], {unique: false});
    }
    if (db.objectStoreNames.contains('drTransactions')) {
      db.deleteObjectStore("drTransactions");
    }
    if (!db.objectStoreNames.contains('drTransactions')) {
      let abc = db.createObjectStore('drTransactions', {keyPath: 'uniqueId'});
      abc.createIndex('uniqueId+timestamp', [
        'uniqueId',
        'timestamp'
      ], {unique: false});
      abc.createIndex('company+accountUniqueName+index', [
        'company',
        'accountUniqueName',
        'index'
      ], {unique: false});
    }
    if (db.objectStoreNames.contains('crTransactions')) {
      db.deleteObjectStore("crTransactions");
    }
    if (!db.objectStoreNames.contains('crTransactions')) {
      let abd = db.createObjectStore('crTransactions', {keyPath: 'uniqueId'});
      abd.createIndex('uniqueId+timestamp', [
        'uniqueId',
        'timestamp'
      ], {unique: false});
      abd.createIndex('company+accountUniqueName+index', [
        'company',
        'accountUniqueName',
        'index'
      ], {unique: false});
    }
  };

  lc.ledgerContainer = function() {
    this.ledgerData = {};
    this.trCount = 0;
    this.firstLedger = null;
    this.lastLedger = null;
    this.lowerBoundReached = false;
    this.upperBoundReached = false;
    this.scrollDisable = false;
    return this;
  };

  lc.ledgerContainer.prototype.add = function(o) {
    if (!this.ledgerData.hasOwnProperty(o.uniqueName)) {
      this.trCount += o.transactions.length;
      this.ledgerData[o.uniqueName] = o;
    }
  };

  lc.ledgerContainer.prototype.add = function(o, count) {
    if (!this.ledgerData.hasOwnProperty(o.uniqueName)) {
      this.trCount += o.transactions.length;
      this.ledgerData[o.uniqueName] = o;
      while (this.trCount > this.maxTransactions(count)) {
        this.removeTop();
        this.lowerBoundReached = false;
      }
      let tempTop = this.top();
      this.firstLedger = tempTop;
      // this.lastLedger = this.ledgerData[o.uniqueName]
      let tempBottom = this.bottom();
      this.lastLedger = tempBottom;
    }
  };

  lc.ledgerContainer.prototype.addAtTop = function(o, count) {
    if (!this.ledgerData.hasOwnProperty(o.uniqueName)) {
      this.trCount += o.transactions.length;
      this.ledgerData[o.uniqueName] = o;
      while (this.trCount > this.maxTransactions(count)) {
        this.removeBottom();
        this.upperBoundReached = false;
      }
      let tempBottom = this.bottom();
      this.lastLedger = tempBottom;
      // this.firstLedger = this.ledgerData[o.uniqueName]
      let tempTop = this.top();
      this.firstLedger = tempTop;
    }
  };

  lc.ledgerContainer.prototype.top = function() {
    let least = Number.MAX_SAFE_INTEGER;
    let topKey = null;
    let ref = Object.keys(this.ledgerData);
    for (let key of Array.from(ref)) {
      if (!this.ledgerData[key].isExtra && (this.ledgerData[key].index < least)) {
        least = this.ledgerData[key].index;
        topKey = key;
      }
    }
    return this.ledgerData[topKey];
  };

  lc.ledgerContainer.prototype.bottom = function() {
    let last = Number.MIN_SAFE_INTEGER;
    let bottomKey = null;
    let ref = Object.keys(this.ledgerData);
    for (let key of Array.from(ref)) {
      if (!this.ledgerData[key].isExtra && (this.ledgerData[key].index > last)) {
        last = this.ledgerData[key].index;
        bottomKey = key;
      }
    }
    return this.ledgerData[bottomKey];
  };

  lc.ledgerContainer.prototype.remove = function(o) {
    if (typeof(o) === 'object') {
      this.trCount -= o.transactions.length;
      delete this.ledgerData[o.uniqueName];
    }

    if (typeof(o) === 'string') {
      this.trCount -= this.ledgerData[o].transactions.length;
      delete this.ledgerData[o];
    }

  };

  lc.ledgerContainer.prototype.removeTop = function() {
    this.remove(this.top());
  };

  lc.ledgerContainer.prototype.removeBottom = function() {
    this.remove(this.bottom());
  };

  lc.ledgerContainer.prototype.getFirstIndex = function() {
    return this.firstLedger !== null ? this.firstLedger.index : Number.MAX_SAFE_INTEGER;
  };
  lc.ledgerContainer.prototype.getLastIndex = function() {
    return this.lastLedger !== null ? this.lastLedger.index : Number.MIN_SAFE_INTEGER;
  };
  lc.ledgerContainer.prototype.maxTransactions = count => (count * 3) + 30;

  lc.generateKeyRange = function(accUniqueName, ledgerContainer, sortDir, scrollDir) {
    let fetchDirection, keyRange;
    sortDir = sortDir === null ? lc.sortDirection.asc : sortDir;
    if (sortDir === lc.sortDirection.asc) {
      if ( scrollDir === 'prev' ) {
        keyRange = IDBKeyRange.bound(
          [
            $rootScope.selectedCompany.uniqueName,
            accUniqueName,
            Number.MIN_SAFE_INTEGER
          ],
          [
            $rootScope.selectedCompany.uniqueName,
            accUniqueName,
            ledgerContainer.getFirstIndex()
          ]);
        fetchDirection = 'prev';
      }
      if ( (scrollDir === 'next') || (scrollDir === null)) {
        keyRange = IDBKeyRange.bound(
          [
            $rootScope.selectedCompany.uniqueName,
            accUniqueName,
            ledgerContainer.getLastIndex()
          ],
          [
            $rootScope.selectedCompany.uniqueName,
            accUniqueName,
            Number.MAX_SAFE_INTEGER
          ]);
        fetchDirection = 'next';
      }

    } else if (sortDir === lc.sortDirection.desc) {
      if ( scrollDir === 'prev' ) {
        keyRange = IDBKeyRange.bound(
          [
            $rootScope.selectedCompany.uniqueName,
            accUniqueName,
            ledgerContainer.getLastIndex()
          ],
          [
            $rootScope.selectedCompany.uniqueName,
            accUniqueName,
            Number.MAX_SAFE_INTEGER
          ]);
        fetchDirection = 'next';
      }
      if ( (scrollDir === 'next') || (scrollDir === null) ) {
        keyRange = IDBKeyRange.bound(
          [
            $rootScope.selectedCompany.uniqueName,
            accUniqueName,
            Number.MIN_SAFE_INTEGER
          ],
          [
            $rootScope.selectedCompany.uniqueName,
            accUniqueName,
            ledgerContainer.getFirstIndex()
          ]);
        fetchDirection = 'prev';
      }
    }
    return { 'keyRange' : keyRange, 'scrollDir' : fetchDirection };
  };

  lc.crMatch = null;
  lc.drMatch = null;
  lc.getMatchingTxnFromIdb = function(ledger, type) {
    let dbInstance;
    lc.dbConfig.success = function(e) {
      let OS;
      let db = e.target.result;
      if (type === 'CR') {
        OS = db.transaction([ 'crTransactions' ], 'readonly').objectStore('crTransactions');
      } else if (type === 'DR') {
        OS = db.transaction([ 'drTransactions' ], 'readonly').objectStore('drTransactions');
      }
      // Search = OS.index('company+accountUniqueName+index', true)
      // key = $rootScope.selectedCompany.uniqueName+ ' ' +lc.accountUnq + ' ' + ledger.index
      let searchReq = OS.get(ledger.uniqueId);

      return searchReq.onsuccess = function(e) {
        if (e.target.result) {
          if (type === 'CR') {
            let crObj = e.target.result;
            crObj.isExtra = true;
            lc.cLedgerContainer.add(crObj);
            return lc.crMatch = lc.scrollMatchObject(crObj, 'cr');
          } else if (type === 'DR') {
            let drObj = e.target.result;
            drObj.isExtra = true;
            lc.dLedgerContainer.add(drObj);
            return lc.drMatch = lc.scrollMatchObject(drObj, 'dr');
          }
        }
      };
    };

    lc.dbConfig.onerror = e => e;

    return dbInstance = idbService.openDb(lc.dbConfig);
  };


  lc.getMatchingTxn = function(ledger, type) {
    if (type === 'CR') {
      if (lc.cLedgerContainer.ledgerData[ledger.uniqueName]) {
        return lc.crMatch = lc.scrollMatchObject(lc.cLedgerContainer.ledgerData[ledger.uniqueName], 'cr');
      } else {
        return lc.getMatchingTxnFromIdb(ledger, type);
      }
      // if !lc.crMatch
      //   lc.getMatchingTxnFromIdb(ledger, type)
    } else if (type === 'DR') {
      if (lc.dLedgerContainer.ledgerData[ledger.uniqueName]) {
        return lc.drMatch = lc.scrollMatchObject(lc.dLedgerContainer.ledgerData[ledger.uniqueName], 'dr');
      } else {
        return lc.getMatchingTxnFromIdb(ledger, type);
      }
    }
  };
      // if !lc.drMatch
      //   lc.getMatchingTxnFromIdb(ledger, type)

  lc.scrollMatchObject = function(to, type) {
    let first = null;
    if (type === 'dr') {
      if (lc.sortOrder.debit === lc.sortDirection.desc) {
        first = lc.dLedgerContainer.bottom();
      } else {
        first = lc.dLedgerContainer.top();
      }
    } else {
      if (lc.sortOrder.credit === lc.sortDirection.desc) {
        first = lc.cLedgerContainer.bottom();
      } else {
        first = lc.cLedgerContainer.top();
      }
    }
    return {"first": first, "to": to};
  };


  lc.log = function() {
    if (lc.showLogs) {
      return console.log(arguments);
    }
  };

  lc.onBankTxnSelect = ($item, $model, $label, $event, txn) =>
    $timeout(( () => txn.isOpen = true), 200)
  ;

  lc.showTaxTxns = function(ledger) {
    if (ledger.transactions.length > 1) {
      _.each(ledger.transactions, function(txn) {
        if (txn.isTax) {
          return txn.hide = !txn.hide;
        }
      });
    }
    if (lc.prevLedger.transactions && (lc.prevLedger.uniqueName !== ledger.uniqueName)) {
      return lc.showTaxTxns(lc.prevLedger);
    }
  };

  lc.taxTransactionsVisibility = "Show all Tax Transactions";
  lc.showAllTaxTransaction = function() {
    lc.showAllTaxTransactions = !lc.showAllTaxTransactions;
    if (lc.showAllTaxTransactions) {
      return lc.taxTransactionsVisibility = "Hide all Tax Transactions";
    } else {
      return lc.taxTransactionsVisibility = "Show all Tax Transactions";
    }
  };

  //###################### functions for ledger design with pagination ###################################
  lc.ledgerPerPageCount = 10;
  lc.pages = [];
  lc.getPaginatedLedger = function(page) {
    let unqNamesObj;
    this.success = function(res) {
      lc.pages = [];
      lc.paginatedLedgers = res.body.ledgers;
      lc.totalLedgerPages = res.body.totalPages;
      lc.currentPage = res.body.page;
      lc.totalCreditTxn = res.body.totalCreditTransactions;
      lc.totalDebitTxn = res.body.totalDebitTransactions;
      return lc.addLedgerPages();
    };

    this.failure = res => toastr.error(res.data.message);

    if (_.isUndefined($rootScope.selectedCompany.uniqueName)) {
      $rootScope.selectedCompany = localStorageService.get("_selectedCompany");
    }
    return unqNamesObj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      acntUname: lc.accountUnq,
      fromDate: $filter('date')($scope.cDate.startDate, "dd-MM-yyyy"),
      toDate: $filter('date')($scope.cDate.endDate, "dd-MM-yyyy"),
      count: lc.ledgerPerPageCount,
      page: page || 1
    };
  };
    // if not _.isEmpty(lc.accountUnq)
      // ledgerService.getLedger(unqNamesObj).then(@success, @failure)

  lc.getPaginatedLedger(1);

  lc.addLedgerPages = function() {
    let i = 0;
    return (() => {
      let result = [];
      while (i <= lc.totalLedgerPages) {
        if (i > 0) {
          lc.pages.push(i);
        }
        result.push(i++);
      }
      return result;
    })();
  };


  return lc;
};



giddh.webApp.controller('newLedgerController', newLedgerController);