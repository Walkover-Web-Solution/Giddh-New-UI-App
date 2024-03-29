// "use strict"

// ledgerController = ($scope, $rootScope, localStorageService, toastr, modalService, $state, ledgerService, $filter, DAServices, $stateParams, $timeout, $location, $document, permissionService, accountService, Upload, groupService, $uibModal, companyServices) ->
//   $scope.ledgerData = undefined
//   $scope.accntTitle = undefined
//   $scope.selectedGroupUname = undefined
//   $scope.selectedLedgerAccount = undefined
//   $scope.selectedLedgerGroup = undefined
//   $scope.ledgerOnlyDebitData = []
//   $scope.ledgerOnlyCreditData = []
//   $rootScope.showImportListData = false
//   $scope.unableToShowBrdcrmb  = false
//   $rootScope.importList = []
//   lsKeys = localStorageService.get("_selectedCompany")
//   if not _.isNull(lsKeys) && not _.isEmpty(lsKeys) && not _.isUndefined(lsKeys)
//     $rootScope.selectedCompany = lsKeys
//   else
//     $rootScope.selectedCompany = {}
//   $scope.creditTotal = undefined
//   $scope.debitTotal = undefined
//   $scope.creditBalanceAmount = undefined
//   $scope.debitBalanceAmount = undefined
//   $scope.quantity = 50
//   $rootScope.cmpViewShow = true
//   $rootScope.lItem = []
//   $scope.ledgerEmailData = {}
//   #date time picker code starts here
//   $scope.today = new Date()
//   d = moment(new Date()).subtract(1, 'month')
//   $scope.fromDate = {date: d._d}
//   $scope.toDate = {date: new Date()}
//   $scope.fromDatePickerIsOpen = false
//   $scope.toDatePickerIsOpen = false
//   $scope.selectedTaxes = []

//   $scope.fromDatePickerOpen = ->
//     this.fromDatePickerIsOpen = true

//   $scope.toDatePickerOpen = ->
//     this.toDatePickerIsOpen = true

//   $scope.voucherTypeList = [
//     {
//       name: "Sales"
//       shortCode: "sal"
//     }
//     {
//       name: "Purchases"
//       shortCode: "pur"
//     }
//     {
//       name: "Receipt"
//       shortCode: "rcpt"
//     }
//     {
//       name: "Payment"
//       shortCode: "pay"
//     }
//     {
//       name: "Journal"
//       shortCode: "jr"
//     }
//     {
//       name: "Contra"
//       shortCode: "cntr"
//     }
//     {
//       name: "Debit Note"
//       shortCode: "debit note"
//     }
//     {
//       name: "Credit Note"
//       shortCode: "credit note"
//     }
//   ]

//   $scope.dynamicPopover = {
//     content: 'Hello, World!',
//     templateUrl: 'myPopoverTemplate.html',
//     title: 'Title'
//   }

//   $scope.dateOptions = {
//     'year-format': "'yy'",
//     'starting-day': 1,
//     'showWeeks': false,
//     'show-button-bar': false,
//     'year-range': 1,
//     'todayBtn': false
//   }

//   $scope.format = "dd-MM-yyyy"
//   $scope.ftypeAdd = "add"
//   $scope.ftypeUpdate = "update"

//   dummyValueDebit = new angular.Ledger("DEBIT")
//   dummyValueCredit = new angular.Ledger("CREDIT")

//   $scope.eLedgerDataFound = false
//   $scope.eLedgerDrData = []
//   $scope.eLedgerCrData = []

//   # eLedger
//   $scope.trashEntry = (item) ->
//     unqNamesObj = {
//       compUname: $rootScope.selectedCompany.uniqueName
//       acntUname: $rootScope.selAcntUname
//       trId: item.sharedData.transactionId
//     }
//     ledgerService.trashTransaction(unqNamesObj).then($scope.trashEntrySuccess, $scope.trashEntryFailure)

//   $scope.trashEntrySuccess = (res) ->
//     toastr.success("Entry deleted successfully", "Success")

//     $scope.eLedgerDrData = _.reject($scope.eLedgerDrData, (entry) ->
//       res.body.transactionId is entry.sharedData.transactionId
//     )

//     $scope.eLedgerCrData = _.reject($scope.eLedgerCrData, (entry) ->
//       res.body.transactionId is entry.sharedData.transactionId
//     )

//     $scope.removeClassInAllEle("eLedgEntryForm", "open")
//     $scope.removeClassInAllEle("eLedgEntryForm", "highlightRow")
//     $scope.removeLedgerDialog('.eLedgerPopDiv')
//     $scope.calculateELedger()


//   $scope.trashEntryFailure = (res) ->
//     toastr.error(res.data.message, res.data.status)

//   $scope.moveEntryInGiddh = (item) ->
//     if _.isUndefined($rootScope.selAcntUname)
//       toastr.info("Something went wrong please reload page")
//       $scope.removeClassInAllEle("ledgEntryForm", "open")
//       $scope.removeLedgerDialog('.eLedgerPopDiv')
//       return false
//     unqNamesObj = {
//       compUname: $rootScope.selectedCompany.uniqueName
//       acntUname: $rootScope.selAcntUname
//     }
//     edata = {}
//     edata.transactions = []
//     _.extend(edata, item.sharedData)
//     if item.sharedData.multiEntry
//       _.filter($scope.eLedgerDrData, (obj) ->
//         if edata.transactionId is obj.sharedData.transactionId
//           edata.transactions.push(obj.transactions[0])
//       )
//       _.filter($scope.eLedgerCrData, (obj) ->
//         if edata.transactionId is obj.sharedData.transactionId
//           edata.transactions.push(obj.transactions[0])
//       )
//     else
//       _.extend(edata.transactions, item.transactions)

//     # change entry direction
//     if edata.transactions.length <= 1
//       edata.transactions[0].type = $scope.reverseDirection(edata.transactions[0].type)
//     else
//       _.each(edata.transactions, (ledgObj) ->
//         ledgObj.type = $scope.reverseDirection(ledgObj.type)
//       )

//     ledgerService.createEntry(unqNamesObj, edata).then($scope.moveEntryInGiddhSuccess, $scope.addEntryFailure)

//   $scope.reverseDirection = (type) ->
//     if type is 'debit' || type is 'DEBIT'
//       return 'debit'
//     else if type is 'credit' || type is 'CREDIT'
//       return 'credit'

//   $scope.moveEntryInGiddhSuccess = (res) ->
//     toastr.success("Entry created successfully", "Success")
//     $scope.removeClassInAllEle("eLedgEntryForm", "open")
//     $scope.removeClassInAllEle("eLedgEntryForm", "highlightRow")
//     $scope.removeLedgerDialog('.eLedgerPopDiv')
//     $scope.reloadLedger()

//   $scope.getOtherTransactionsFailure = (res) ->
//     toastr.error(res.data.message, res.data.status)

//   $scope.getOtherTransactionsSuccess = (res, gData, acData) ->
//     angular.copy([], $scope.eLedgerDrData)
//     angular.copy([], $scope.eLedgerCrData)

//     if res.body.length > 0
//       $scope.eLedgerDataFound = true
//       _.each(res.body, (obj) ->
//         if obj.transactions.length > 1
//           obj.multiEntry = true
//         else
//           obj.multiEntry = false

//         sharedData = _.omit(obj, 'transactions')
//         sharedData.total = 0
//         sharedData.entryDate = obj.date
//         _.each(obj.transactions, (transaction, index) ->
//           transaction.amount = parseFloat(transaction.amount).toFixed(2)
//           newEntry = {}
//           newEntry.sharedData= sharedData
//           newEntry.sharedData.description= transaction.remarks.description
//           if transaction.type is "DEBIT"
//             newEntry.transactions = [transaction]
//             sharedData.voucherType = "rcpt"
//             $scope.eLedgerDrData.push(newEntry)

//           if transaction.type is "CREDIT"
//             newEntry.transactions = [transaction]
//             sharedData.voucherType = "pay"
//             $scope.eLedgerCrData.push(newEntry)
//         )
//       )
//       $scope.calculateELedger()

//     else
//       $scope.eLedgerDataFound = false


//   $scope.calculateELedger = () ->
//     $scope.eLedgType = undefined
//     $scope.eCrBalAmnt = 0
//     $scope.eDrBalAmnt = 0
//     $scope.eDrTotal = 0
//     $scope.eCrTotal = 0
//     crt = 0
//     drt = 0
//     _.each($scope.eLedgerDrData, (entry) ->
//       drt += Number(entry.transactions[0].amount)
//     )
//     _.each($scope.eLedgerCrData, (entry) ->
//       crt += Number(entry.transactions[0].amount)
//     )
//     crt = parseFloat(crt)
//     drt = parseFloat(drt)

//     if drt > crt
//       $scope.eLedgType = 'DEBIT'
//       $scope.eCrBalAmnt = drt - crt
//       $scope.eDrTotal = drt
//       $scope.eCrTotal = crt + (drt - crt)
//     else if crt > drt
//       $scope.eLedgType = 'CREDIT'
//       $scope.eDrBalAmnt = crt - drt
//       $scope.eDrTotal = drt + (crt - drt)
//       $scope.eCrTotal = crt
//     else
//       $scope.eCrTotal = crt
//       $scope.eDrTotal = drt

//   # load ledger start
//   $scope.reloadLedger = () ->
//     if not _.isUndefined($scope.selectedLedgerGroup)
//       $scope.loadLedger($scope.selectedLedgerGroup, $scope.selectedLedgerAccount)
//     else
//       if !_.isNull(localStorageService.get("_ledgerData"))
//         lgD = localStorageService.get("_ledgerData")
//         acD = localStorageService.get("_selectedAccount")
//         $scope.loadLedger(lgD, acD)
//       else
//         toastr.warning("Something went wrong, Please reload page", "Warning")

//   #show breadcrumbs on ledger
//   $scope.showLedgerBreadCrumbs = (data) ->
//     $scope.ledgerBreadCrumbList = data

//   $scope.loadLedger = (gData, acData) ->
//     if _.isNull($scope.toDate.date) || _.isNull($scope.fromDate.date)
//       toastr.error("Date should be in proper format", "Error")
//       return false
//     unqObj = {
//       compUname : $rootScope.selectedCompany.uniqueName
//       acntUname : acData.uniqueName
//     }
//     accountService.get(unqObj)
//       .then(
//         (res)->
//           $scope.getAcDtlDataSuccess(res, gData, acData)
//         ,(error)->
//           $scope.getAcDtlDataFailure(error)
//       )
//     if _.isEmpty($rootScope.flatGroupsList) || _.isNull($rootScope.flatGroupsList) || _.isUndefined($rootScope.flatGroupsList)
//       $scope.unableToShowBrdcrmb  = true
//     else
//       $scope.unableToShowBrdcrmb  = false
//       resObj = groupService.matchAndReturnObj(gData, $rootScope.flatGroupsList)
//       $scope.showLedgerBreadCrumbs(resObj.parentGroups)

//   $scope.getAcDtlDataFailure = (res) ->
//     toastr.error(res.data.message, res.data.status)

//   $scope.getAcDtlDataSuccess = (res, gData, acData) ->
//     _.extend(acData, res.body)
//     $scope.canAddAndEdit = $scope.hasAddAndUpdatePermission(acData)
//     $rootScope.showLedgerBox = false
//     $rootScope.showLedgerLoader = true
//     $scope.selectedLedgerAccount = acData
//     $scope.selectedLedgerGroup = gData
//     $scope.accntTitle = acData.name
//     $rootScope.selAcntUname = acData.uniqueName
//     $scope.selectedGroupUname = gData.groupUniqueName
//     unqNamesObj = {
//       compUname: $rootScope.selectedCompany.uniqueName
//       acntUname: $rootScope.selAcntUname
//       fromDate: $filter('date')($scope.fromDate.date, "dd-MM-yyyy")
//       toDate: $filter('date')($scope.toDate.date, "dd-MM-yyyy")
//     }
//     ledgerService.getLedger(unqNamesObj).then($scope.loadLedgerSuccess, $scope.loadLedgerFailure)
//     if $location.path() isnt "/"+$rootScope.selAcntUname
//       $location.path("/"+$rootScope.selAcntUname)

//     if res.body.yodleeAdded
//       unqObj = {
//         compUname : $rootScope.selectedCompany.uniqueName
//         acntUname : acData.uniqueName
//       }
//       # get other ledger transactions
//       ledgerService.getOtherTransactions(unqObj)
//         .then(
//           (res)->
//             $scope.getOtherTransactionsSuccess(res, gData, acData)
//           ,(error)->
//             $scope.getOtherTransactionsFailure(error)
//         )

//   $scope.loadLedgerSuccess = (res) ->
//     $scope.ledgerDataArray = {}
//     data = {}
//     angular.copy(res.body, $scope.ledgerDataArray)
//     angular.copy(res.body, data)
//     $scope.ledgerOnlyCreditData = []
//     $scope.ledgerOnlyDebitData = []
//     _.each(data.ledgers, (ledger) ->
//       if ledger.transactions.length > 1
//         ledger.multiEntry = true
//       else
//         ledger.multiEntry = false

//       sharedData = _.omit(ledger, 'transactions')
//       sharedData.total = 0
//       _.each(ledger.transactions, (transaction, index) ->
//         transaction.amount = parseFloat(transaction.amount).toFixed(2)
//         newEntry = {sharedData: sharedData}
//         newEntry.id = sharedData.uniqueName + "_" + index
//         if transaction.type is "DEBIT"
//           newEntry.transactions = [transaction]
//           sharedData.total = sharedData.total - parseFloat(transaction.amount)
//           $scope.ledgerOnlyDebitData.push(newEntry)

//         if transaction.type is "CREDIT"
//           newEntry.transactions = [transaction]
//           sharedData.total = sharedData.total + parseFloat(transaction.amount)
//           $scope.ledgerOnlyCreditData.push(newEntry)
//       )
//     )
//     $scope.ledgerOnlyDebitData.push(angular.copy(dummyValueDebit))
//     $scope.ledgerOnlyCreditData.push(angular.copy(dummyValueCredit))
//     $rootScope.showLedgerBox = true
//     $rootScope.showLedgerLoader = false
//     $scope.ledgerData = angular.copy(_.omit(res.body, 'ledgers'))
//     $scope.calculateLedger($scope.ledgerData, "server")

//   $scope.loadLedgerFailure = (res) ->
//     toastr.error(res.data.message, res.data.status)

//   $scope.addNewAccount = () ->
//     $rootScope.$emit('callManageGroups')

//   $scope.excludeTaxTxn = (txn) ->
//     _.each $scope.taxList, (tax)->
//       if tax.account.uniqueName == txn.particular.uniqueName
//         txn.isTax = true

//   $scope.calculateEntryAmount = (eData, taxData) ->
//     type = eData.transactions[0].type
//     _.each eData.transactions, (txn) ->
//       # exclude tax transactions
//       $scope.excludeTaxTxn(txn)
//       if !txn.isTax
//         if type == txn.type
//           taxData.entryAmount += parseInt(txn.amount)
//         else
//           taxData.entryAmount -= parseInt(txn.amount)
//       taxData.entryAmount = Math.abs(taxData.entryAmount)

//   $scope.addTaxTransactions = (edata, taxes) ->
//     # calculate total entry amount
//     newTaxTransactions = []
//     pTxns = edata.transactions
//     _.each taxes, (tax) ->
//       taxData = {}
//       taxData.entryAmount = 0
//       $scope.calculateEntryAmount(edata, taxData)
//       newTax = {
//         amount: 0
//         particular: {
//           name: ''
//           mergedAccounts: ''
//           uniqueName: ''
//         }
//         type: ''
//       }

//       if tax.account.uniqueName == 0
//         toastr.error('The tax you are trying to add does not have an account linked with it, please link an account.')
//         return false
//       if tax.account.uniqueName == $stateParams.unqName
//         toastr.error('Tax can not be applied to same account to which it is linked.')
//         return false
//       else
//         newTax.particular.name = tax.account.name
//         newTax.particular.uniqueName = tax.account.uniqueName
//         prevDate = 0
//         # calculate total tax amount for entry
//         _.each tax.taxDetail, (det) ->
//           taxDate = edata.eDate
//           entryDate = edata.eDate

//           if entryDate >= taxDate && taxDate >= prevDate
//             newTax.amount = det.taxValue/100 * taxData.entryAmount
//             prevDate = taxDate
//           else if entryDate < taxDate
//             _.each edata.transactions, (txn) ->
//               if txn.particular.uniqueName == tax.account.uniqueName
//                 newTax.amount = txn.amount


//           if det.taxValue < 0
//             newTax.amount = Math.abs(newTax.amount)
//             if edata.transactions[0].type.toLowerCase() == 'credit'
//               newTax.type = 'DEBIT'
//             else
//               newTax.type = 'CREDIT'
//           else
//             newTax.type = edata.transactions[0].type

//         # copy newTax
//         tax_1 = newTax
//         newTax.isLinked = false
//         toRemove = []
//         #check if newTax exists in edata.transactions
//         _.each edata.transactions, (txn, idx) ->
//           inTaxes = true
//           if txn.particular.uniqueName == newTax.particular.uniqueName && newTax.isLinked != true
//             newTax.isLinked = true
//           if txn.particular.uniqueName == newTax.particular.uniqueName && newTax.isLinked && newTax.amount != txn.amount
//             txn.amount = newTax.amount

//         if newTax.isLinked == false && newTax.amount != 0
//           edata.transactions.push(tax_1)

//     _.each edata.transactions, (txn) ->
//       $scope.excludeTaxTxn(txn)
//       if txn.isTax
//         txn.toRemove = true
//         _.each taxes, (tax) ->
//           if tax.account.uniqueName == txn.particular.uniqueName
//             txn.toRemove = false

//     edata.transactions = _.without(edata.transactions, _.findWhere(edata.transactions, {toRemove: true}))

//   $scope.addNewEntry = (data) ->
//     if _.isUndefined($rootScope.selAcntUname)
//       toastr.info("Something went wrong please reload page")
//       $scope.removeClassInAllEle("ledgEntryForm", "newMultiEntryRow")
//       $scope.removeClassInAllEle("ledgEntryForm", "open")
//       $scope.removeLedgerDialog('.ledgerPopDiv')
//       return false
//     edata = {}
//     edata.transactions = []
//     _.extend(edata, data.sharedData)
//     if data.sharedData.addType
//       _.filter($scope.ledgerOnlyDebitData, (entry) ->
//         if entry.sharedData.addType and entry.transactions[0].amount isnt ""
//           edata.transactions.push(entry.transactions[0])
//       )
//       _.filter($scope.ledgerOnlyCreditData, (entry) ->
//         if entry.sharedData.addType and entry.transactions[0].amount isnt ""
//           edata.transactions.push(entry.transactions[0])
//       )
//     else
//       _.extend(edata.transactions, data.transactions)
//     edata.voucherType = data.sharedData.voucher.shortCode
//     unqNamesObj = {
//       compUname: $rootScope.selectedCompany.uniqueName
//       acntUname: $rootScope.selAcntUname
//     }

//     # create transaction for added taxes
//     $scope.addTaxTransactions(edata, data.sharedData.taxes)

//     ledgerService.createEntry(unqNamesObj, edata).then($scope.addEntrySuccess, $scope.addEntryFailure)

//   $scope.addEntrySuccess = (res) ->
//     $rootScope.lItem = []
//     toastr.success("Entry created successfully", "Success")
//     $scope.removeClassInAllEle("ledgEntryForm", "newMultiEntryRow")
//     $scope.removeClassInAllEle("ledgEntryForm", "open")
//     $scope.reloadLedger()
//     $scope.removeLedgerDialog('.ledgerPopDiv')

//   $scope.addEntryFailure = (res) ->
//     toastr.error(res.data.message, res.data.status)

//   $scope.updateEntry = (data) ->
//     edata = {}
//     _.extend(edata, data.sharedData)

//     if not _.isUndefined(data.sharedData.voucher)
//       edata.voucherType = data.sharedData.voucher.shortCode

//     edata.transactions = []
//     _.filter($scope.ledgerOnlyDebitData, (entry) ->
//       if edata.uniqueName is entry.sharedData.uniqueName
//         edata.transactions.push(entry.transactions[0])
//     )
//     _.filter($scope.ledgerOnlyCreditData, (entry) ->
//       if edata.uniqueName is entry.sharedData.uniqueName
//         edata.transactions.push(entry.transactions[0])
//     )

//     $scope.addTaxTransactions(edata, data.sharedData.taxes)
//     unqNamesObj = {
//       compUname: $rootScope.selectedCompany.uniqueName
//       acntUname: $rootScope.selAcntUname
//       entUname: edata.uniqueName
//     }
//     ledgerService.updateEntry(unqNamesObj, edata).then($scope.updateEntrySuccess, $scope.updateEntryFailure)

//   $scope.updateEntrySuccess = (res) ->
//     $document.off 'click'
//     $rootScope.lItem = []
//     $scope.removeClassInAllEle("ledgEntryForm", "newMultiEntryRow")
//     $scope.removeClassInAllEle("ledgEntryForm", "highlightRow")
//     $scope.removeClassInAllEle("ledgEntryForm", "open")
//     toastr.success("Entry updated successfully", "Success")
//     $scope.removeLedgerDialog('.ledgerPopDiv')
//     uLedger = {}
//     _.extend(uLedger, res.body)

//     if uLedger.transactions.length > 1
//       uLedger.multiEntry = true
//     else
//       uLedger.multiEntry = false

//     sharedData = _.omit(uLedger, 'transactions')
//     sharedData.total = 0
//     _.each(uLedger.transactions, (transaction) ->
//       if transaction.type is "DEBIT"
//         sharedData.total = sharedData.total - parseFloat(transaction.amount)
//         _.filter($scope.ledgerOnlyDebitData, (ledger) ->
//           if ledger.sharedData.uniqueName is uLedger.uniqueName
//             ledger.sharedData = sharedData
//             if _.isEqual(ledger.transactions[0], transaction)
//               ledger.transactions[0] = transaction
//         )
//       if transaction.type is "CREDIT"
//         sharedData.total = sharedData.total + parseFloat(transaction.amount)
//         _.filter($scope.ledgerOnlyCreditData, (ledger) ->
//           if ledger.sharedData.uniqueName is uLedger.uniqueName
//             ledger.sharedData = sharedData
//             if _.isEqual(ledger.transactions[0], transaction)
//               ledger.transactions[0] = transaction
//         )
//     )
//     # after update check if updated row is last row
//     ddR = _.last($scope.ledgerOnlyDebitData)
//     cdR = _.last($scope.ledgerOnlyCreditData)
//     if !_.isUndefined(ddR.sharedData.uniqueName)
//       $scope.ledgerOnlyDebitData.push(angular.copy(dummyValueDebit))
//     if !_.isUndefined(cdR.sharedData.uniqueName)
//       $scope.ledgerOnlyCreditData.push(angular.copy(dummyValueCredit))
//     $scope.calculateLedger($scope.ledgerData, "update")
//     $scope.reloadLedger()

//   $scope.updateEntryFailure = (res) ->
//     toastr.error(res.data.message, res.data.status)

//   $scope.deleteEntry = (item) ->
//     unqNamesObj = {
//       compUname: $rootScope.selectedCompany.uniqueName
//       acntUname: $rootScope.selAcntUname
//       entUname: item.sharedData.uniqueName
//     }
//     ledgerService.deleteEntry(unqNamesObj).then((res) ->
//       $scope.deleteEntrySuccess(item, res)
//     , $scope.deleteEntryFailure)

//   $scope.deleteEntrySuccess = (item, res) ->
//     $scope.removeClassInAllEle("ledgEntryForm", "highlightRow")
//     $scope.removeClassInAllEle("ledgEntryForm", "open")
//     $scope.removeLedgerDialog('.ledgerPopDiv')
//     toastr.success(res.body, res.status)
//     $scope.ledgerOnlyDebitData = _.reject($scope.ledgerOnlyDebitData, (entry) ->
//       item.sharedData.uniqueName is entry.sharedData.uniqueName
//     )
//     $scope.ledgerOnlyCreditData = _.reject($scope.ledgerOnlyCreditData, (entry) ->
//       item.sharedData.uniqueName is entry.sharedData.uniqueName
//     )

//     $scope.calculateLedger($scope.ledgerData, "deleted")

//   $scope.deleteEntryFailure = (res) ->
//     toastr.error(res.data.message, res.data.status)

//   $scope.removeClassInAllEle = (target, clName)->
//     el = document.getElementsByClassName(target)
//     angular.element(el).removeClass(clName)

//   $scope.forwardtoCntrlScope = (ele, data) ->
//     if data.sharedData.multiEntry
//       el = document.getElementsByClassName(ele[0].classList[3])
//       angular.element(el).addClass('newMultiEntryRow')
//     else
//       angular.element(ele).addClass('newMultiEntryRow')

//   $scope.addEntryInCredit =(data)->
//     arLen = $scope.ledgerOnlyCreditData.length-1
//     lastRow  = _.last($scope.ledgerOnlyCreditData)
//     if !_.isEmpty(lastRow.sharedData.entryDate) and  not _.isEmpty(lastRow.transactions[0].amount) and not _.isEmpty(lastRow.transactions[0].particular.uniqueName)
//       $scope.ledgerOnlyCreditData.push(angular.copy(dummyValueCredit))
//       $timeout ->
//         $scope.sameMethodForDrCr(arLen+1, ".crLedgerEntryForm")
//       , 200
//     else
//       $scope.sameMethodForDrCr(arLen, ".crLedgerEntryForm")

//     if _.isUndefined(data.sharedData.uniqueName)
//       data.sharedData.addType = true

//     wt = _.omit(data, 'transactions')
//     wt.id = wt.id + arLen
//     _.extend(_.last($scope.ledgerOnlyCreditData), wt)


//   $scope.addEntryInDebit =(data)->
//     arLen = $scope.ledgerOnlyDebitData.length-1
//     lastRow  = _.last($scope.ledgerOnlyDebitData)
//     if !_.isEmpty(lastRow.sharedData.entryDate) and  !_.isEmpty(lastRow.transactions[0].amount) and !_.isEmpty(lastRow.transactions[0].particular.uniqueName)
//       $scope.ledgerOnlyDebitData.push(angular.copy(dummyValueDebit))
//       $timeout ->
//         $scope.sameMethodForDrCr(arLen+1, ".drLedgerEntryForm")
//       , 200
//     else
//       $scope.sameMethodForDrCr(arLen, ".drLedgerEntryForm")

//     if _.isUndefined(data.sharedData.uniqueName)
//       data.sharedData.addType = true

//     wt = _.omit(data, 'transactions')
//     wt.id = wt.id + arLen
//     _.extend(_.last($scope.ledgerOnlyDebitData), wt)

//   $scope.sameMethodForDrCr =(arLen, name)->
//     formEle =  document.querySelectorAll(name)
//     tdEle = angular.element(formEle[arLen]).find('td')[1]
//     inpEle = angular.element(tdEle).find('input')
//     $scope.removeLedgerDialog('.ledgerPopDiv')
//     $scope.removeClassInAllEle("ledgEntryForm", "highlightRow")
//     $scope.removeClassInAllEle("ledgEntryForm", "open")
//     $timeout ->
//       angular.element(inpEle).focus()
//     , 700
//     return false

//   $scope.removeLedgerDialog = (cls) ->
//     allPopElem = angular.element(document.querySelector(cls))
//     allPopElem.remove()
//     return true

//   $scope.calculateLedger = (data, loadtype) ->
//     crt = 0
//     drt = 0
//     $scope.creditBalanceAmount = 0
//     $scope.debitBalanceAmount = 0
//     $scope.ledgBalType = undefined

//     if data.forwardedBalance.type is 'CREDIT'
//       crt += data.forwardedBalance.amount

//     if data.forwardedBalance.type is 'DEBIT'
//       drt += data.forwardedBalance.amount

//     _.each($scope.ledgerOnlyDebitData, (entry) ->
//       drt += Number(entry.transactions[0].amount)
//     )
//     _.each($scope.ledgerOnlyCreditData, (entry) ->
//       crt += Number(entry.transactions[0].amount)
//     )
//     crt = parseFloat(crt)
//     drt = parseFloat(drt)

//     if drt > crt
//       $scope.ledgBalType = 'DEBIT'
//       $scope.creditBalanceAmount = drt - crt
//       $scope.debitTotal = drt
//       $scope.creditTotal = crt + (drt - crt)
//     else if crt > drt
//       $scope.ledgBalType = 'CREDIT'
//       $scope.debitBalanceAmount = crt - drt
//       $scope.debitTotal = drt + (crt - drt)
//       $scope.creditTotal = crt
//     else
//       $scope.creditTotal = crt
//       $scope.debitTotal = drt

//     # if calculation is wrong than make entry in newrelic
//     if loadtype is 'server'
//       if data.debitTotal isnt parseFloat($scope.debitTotal)
//         console.info "something is wrong in calculateLedger debitTotal"
//         console.info data.debitTotal, parseFloat($scope.debitTotal)
//       if data.creditTotal isnt parseFloat($scope.creditTotal)
//         console.info "something is wrong in calculateLedger creditTotal"
//         console.info data.creditTotal, parseFloat($scope.creditTotal)

//   $scope.onScroll = (sp, tsS, event) ->
//     if  !_.isUndefined($scope.ledgerData)
//       ledgerDebLength = $scope.ledgerOnlyDebitData.length
//       ledgerCrdLength = $scope.ledgerOnlyCreditData.length
//       if ledgerDebLength > 50 || ledgerCrdLength > 50
//         if sp + 200 >= tsS
//           event.preventDefault()
//           event.stopPropagation()
//           $scope.quantity += 20

//   $scope.hasAddAndUpdatePermission = (account) ->
//     permissionService.hasPermissionOn(account, "UPDT") and permissionService.hasPermissionOn(account, "ADD")


//   #export ledger
//   $scope.exportLedger = ()->
//     unqNamesObj = {
//       compUname: $rootScope.selectedCompany.uniqueName
//       selGrpUname: $scope.selectedGroupUname
//       acntUname: $rootScope.selAcntUname
//       fromDate: $filter('date')($scope.fromDate.date, "dd-MM-yyyy")
//       toDate: $filter('date')($scope.toDate.date, "dd-MM-yyyy")
//     }
//     accountService.exportLedger(unqNamesObj).then($scope.exportLedgerSuccess, $scope.exportLedgerFailure)

//   $scope.exportLedgerSuccess = (res)->
//     $scope.isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0
//     if $scope.msieBrowser()
//       $scope.openWindow(res.body.filePath)
//     else if $scope.isSafari
//       modalInstance = $uibModal.open(
//         template: '<div>
//             <div class="modal-header">
//               <h3 class="modal-title">Download File</h3>
//             </div>
//             <div class="modal-body">
//               <p class="mrB">To download your file Click on button</p>
//               <button onClick="window.open(\''+res.body.filePath+'\')" class="btn btn-primary">Download</button>
//             </div>
//             <div class="modal-footer">
//               <button class="btn btn-default" ng-click="$close()">Cancel</button>
//             </div>
//         </div>'
//         size: "sm"
//         backdrop: 'static'
//         scope: $scope
//       )
//     else
//       window.open(res.body.filePath)

//   $scope.exportLedgerFailure = (res)->
//     toastr.error(res.data.message, res.data.status)

//   # upload by progressbar
//   $scope.importLedger = (files, errFiles) ->
//     unqNamesObj = {
//       compUname: $rootScope.selectedCompany.uniqueName
//       selGrpUname: $scope.selectedGroupUname
//       acntUname: $rootScope.selAcntUname
//     }
//     $scope.impLedgBar = false
//     $scope.impLedgFiles = files
//     $scope.impLedgErrFiles = errFiles
//     angular.forEach files, (file) ->
//       file.upload = Upload.upload(
//         url: '/upload/' + $rootScope.selectedCompany.uniqueName + '/import-ledger'
//         file: file
//         data:{
//           'urlObj': unqNamesObj
//         }
//       )
//       file.upload.then ((res) ->
//         $timeout ->
//           $scope.impLedgBar = true
//           file.result = res.data
//           toastr.success(res.data.body.message, res.data.status)
//       ), ((res) ->
//         console.log res, "error"
//       ), (evt) ->
//         file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total))

//   #watch for date changes
//   $scope.$watch('fromDate.date', (newVal,oldVal) ->
//     oldDate = new Date(oldVal).getTime()
//     newDate = new Date(newVal).getTime()

//     toDate = new Date($scope.toDate.date).getTime()

//     if newDate > toDate
//       $scope.toDate.date =  newDate
//   )

//   $scope.showImportList =() ->
//     modalService.openImportListModal()
//     unqNamesObj = {
//       compUname: $rootScope.selectedCompany.uniqueName
//       selGrpUname: $scope.selectedGroupUname
//       acntUname: $rootScope.selAcntUname
//     }
//     accountService.ledgerImportList(unqNamesObj).then($scope.ledgerImportListSuccess, $scope.ledgerImportListFailure)

//   $scope.ledgerImportListSuccess = (res) ->
//     $rootScope.showImportListData = true
//     $rootScope.importList = res.body

//   $scope.ledgerImportListFailure = (res) ->
//     toastr.error(res.data.message, res.data.status)

//   # ledger send email
//   $scope.sendLedgEmail = (emailData) ->
//     data = angular.copy(emailData)
//     if _.isNull($scope.toDate.date) || _.isNull($scope.fromDate.date)
//       toastr.error("Date should be in proper format", "Error")
//       return false
//     unqNamesObj = {
//       compUname: $rootScope.selectedCompany.uniqueName
//       acntUname: $rootScope.selAcntUname
//       toDate: $filter('date')($scope.toDate.date, "dd-MM-yyyy")
//       fromDate: $filter('date')($scope.fromDate.date, "dd-MM-yyyy")
//     }
//     sendData = {
//       recipients: []
//     }
//     data = data.replace(RegExp(' ', 'g'), '')
//     cdata = data.split(',')
//     _.each(cdata, (str) ->
//       if $rootScope.validateEmail(str)
//         sendData.recipients.push(str)
//       else
//         toastr.warning("Enter valid Email ID", "Warning")
//         data = ''
//         sendData.recipients = []
//         return false
//     )
//     if sendData.recipients < 1
//       if $rootScope.validateEmail(data)
//         sendData.recipients.push(data)
//       else
//         toastr.warning("Enter valid Email ID", "Warning")
//         return false

//     accountService.emailLedger(unqNamesObj, sendData).then($scope.emailLedgerSuccess, $scope.emailLedgerFailure)



//   $scope.emailLedgerSuccess = (res) ->
//     toastr.success(res.body, res.status)
//     $scope.ledgerEmailData = {}

//   $scope.emailLedgerFailure = (res) ->
//     toastr.error(res.data.message, res.data.status)

//   # get tax list

//   $scope.getTaxList = () ->
//     $scope.taxList = []
//     if $rootScope.canUpdate and $rootScope.canDelete
//       companyServices.getTax($rootScope.selectedCompany.uniqueName).then($scope.getTaxListSuccess, $scope.getTaxListFailure)

//   $scope.getTaxListSuccess = (res) ->
//     _.each res.body, (tax) ->
//       tax.isSelected = false
//       if tax.account == null
//         tax.account = {}
//         tax.account.uniqueName = 0
//       $scope.taxList.push(tax)


//   $scope.getTaxListFailure = (res) ->
//     toastr.error(res.data.message, res.status)

//   $scope.addTaxEntry = (tax, item) ->
//     if tax.isSelected
//       $scope.selectedTaxes.push(tax)
//     else
//       $scope.selectedTaxes = _.without($scope.selectedTaxes, tax)
//     item.sharedData.taxes = $scope.selectedTaxes

//   someEventHandle = $scope.$on('reloadFromAuto', ->
//     $scope.reloadLedger()
//   )

//   # generate magic link
//   $scope.getMagicLink = () ->
//     accUname = $location.path()
//     accUname = accUname.split('/')
//     reqParam = {
//       companyUniqueName: $rootScope.selectedCompany.uniqueName
//       accountUniqueName: accUname[1]
//       from: $filter('date')($scope.fromDate.date, 'dd-MM-yyyy')
//       to: $filter('date')($scope.toDate.date, 'dd-MM-yyyy')
//     }
//     companyServices.getMagicLink(reqParam).then($scope.getMagicLinkSuccess, $scope.getMagicLinkFailure)

//   $scope.getMagicLinkSuccess = (res) ->
//     $scope.magicLink = res.body.magicLink
//     modalInstance = $uibModal.open(
//       template: '<div>
//           <div class="modal-header">
//             <button type="button" class="close" data-dismiss="modal" ng-click="$close()" aria-label="Close"><span
//         aria-hidden="true">&times;</span></button>
//           <h3 class="modal-title">Magic Link</h3>
//           </div>
//           <div class="modal-body">
//             <input id="magicLink" class="form-control" type="text" ng-model="magicLink">
//           </div>
//           <div class="modal-footer">
//             <button class="btn btn-default" ngclipboard data-clipboard-target="#magicLink">Copy</button>
//           </div>
//       </div>'
//       size: "md"
//       backdrop: 'static'
//       scope: $scope
//     )

//   $scope.getMagicLinkFailure = (res) ->
//     toastr.error(res.data.message)

//   $scope.$on('$destroy', someEventHandle)

//   $scope.$on '$viewContentLoaded',  ->
//     ledgerObj = DAServices.LedgerGet()
//     if !_.isEmpty(ledgerObj.ledgerData)
//       $scope.loadLedger(ledgerObj.ledgerData, ledgerObj.selectedAccount)
//     else
//       if !_.isNull(localStorageService.get("_ledgerData"))
//         lgD = localStorageService.get("_ledgerData")
//         acD = localStorageService.get("_selectedAccount")
//         $scope.loadLedger(lgD, acD)

//   $scope.$on('$stateChangeSuccess', () ->
//     $scope.getTaxList()
//   )

//   $scope.redirectToState = (state) ->
//     $state.go(state)

//  $scope.$on 'company-changed', (event,changeData) ->
//    # when company is changed, redirect to manage company page
//    if changeData.type == 'CHANGE'
//      $scope.redirectToState('company.content.manage')

// giddh.webApp.controller 'ledgerController', ledgerController

// class angular.Ledger
//   constructor: (type)->
//     @transactions = [new angular.Transaction(type)]
//     @sharedData = new angular.SharedData

// class angular.SharedData
//   constructor: () ->
//     @description = ""
//     @tag = ""
//     @uniqueName = undefined
//     @entryDate = ""
//     @voucher = new angular.Voucher()

// class angular.Transaction
//   constructor: (type)->
//     @amount = ""
//     @type = type
//     @particular = new angular.Particular

// class angular.Voucher
//   constructor: ()->
//     @name = "sales"
//     @shortCode = "sal"

// class angular.Particular
//   constructor: ()->
//     @name = ""
//     @uniqueName = ""