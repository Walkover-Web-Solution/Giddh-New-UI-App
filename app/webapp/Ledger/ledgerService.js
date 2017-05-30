giddh.serviceModule.service('ledgerService', function($resource, $q) {
  let Ledger = $resource('/company/:companyUniqueName/accounts',
    {
      'companyUniqueName': this.companyUniqueName,
      'accountsUniqueName': this.accountsUniqueName,
      'fromDate': this.fromDate,
      'toDate': this.toDate,
      'entryUniqueName': this.entryUniqueName,
      'chequeNumber':this.chequeNumber,
      'count':this.count,
      'page':this.page,
      'sort':this.sort
    },
    {
      get: {
        method: 'GET',
        url: '/company/:companyUniqueName/accounts/:accountsUniqueName/ledgers'
      },
      create: {
        method: 'POST',
        url: '/company/:companyUniqueName/accounts/:accountsUniqueName/ledgers/'
      },
      update: {
        method: 'PUT',
        url: '/company/:companyUniqueName/accounts/:accountsUniqueName/ledgers/:entryUniqueName'
      },
      getEntry: {
        method: 'GET',
        url: '/company/:companyUniqueName/accounts/:accountsUniqueName/ledgers/:entryUniqueName'
      },
      delete: {
        method: 'DELETE',
        url: '/company/:companyUniqueName/accounts/:accountsUniqueName/ledgers/:entryUniqueName'
      },
      getEntrySettings: {
        method: 'GET',
        url: '/company/:companyUniqueName/entry-settings'
      },
      updateEntrySettings: {
        method: 'PUT',
        url: '/company/:companyUniqueName/update-entry-settings'
      },
      getInvoiceFile: {
        method: 'GET',
        url: '/company/:companyUniqueName/accounts/:accountsUniqueName/ledgers/invoice-file'
      },
      getReconcileEntries: {
        method: 'GET',
        url: '/company/:companyUniqueName/accounts/:accountsUniqueName/ledgers/reconcile'
      },
      getAllTransactions: {
        method: 'GET',
        url: '/company/:companyUniqueName/accounts/:accountsUniqueName/ledgers/transactions'
      }
      
    }
  );

  let otherLedger = $resource('/company/:companyUniqueName/accounts/:accountsUniqueName/',
    {
      'companyUniqueName': this.companyUniqueName,
      'accountsUniqueName': this.accountsUniqueName,
      'transactionId': this.transactionId
      // 'refresh': @refresh
    },
    { 
      getTransactions: {
        method: 'GET',
        url: '/company/:companyUniqueName/accounts/:accountsUniqueName/eledgers'
      },
      getFreshTransactions: {
        method: 'GET',
        url: '/company/:companyUniqueName/accounts/:accountsUniqueName/eledgers?refresh=true'
      },
      trashTransaction: {
        method: 'DELETE',
        url: '/company/:companyUniqueName/accounts/:accountsUniqueName/eledgers/:transactionId'
      },
      mapEntry: {
        method: 'PUT',
        url: '/company/:companyUniqueName/accounts/:accountsUniqueName/eledgers/map/:transactionId'
      }
    }
  );

  let ledgerService = {
    handlePromise(func) {
      let deferred = $q.defer();
      let onSuccess = data=> deferred.resolve(data);
      let onFailure = data=> deferred.reject(data);
      func(onSuccess, onFailure);
      return deferred.promise;
    },

    getLedger(unqNamesObj) {
      return this.handlePromise((onSuccess, onFailure) => Ledger.get({
        companyUniqueName: unqNamesObj.compUname,
        accountsUniqueName: unqNamesObj.acntUname,
        fromDate: unqNamesObj.fromDate,
        toDate: unqNamesObj.toDate,
        page:unqNamesObj.page,
        count:unqNamesObj.count,
        sort:unqNamesObj.sort
      }, onSuccess, onFailure) );
    },

    getAllTransactions(unqNamesObj) {
      return this.handlePromise((onSuccess, onFailure) => Ledger.getAllTransactions({
        companyUniqueName: unqNamesObj.compUname,
        accountsUniqueName: unqNamesObj.acntUname,
        fromDate: unqNamesObj.fromDate,
        toDate: unqNamesObj.toDate,
        page:unqNamesObj.page,
        count:unqNamesObj.count,
        sort:unqNamesObj.sort,
        reversePage: unqNamesObj.reversePage
      }, onSuccess, onFailure) );
    },

    createEntry(unqNamesObj, data) {
      return this.handlePromise((onSuccess, onFailure) => Ledger.create({
        companyUniqueName: unqNamesObj.compUname,
        accountsUniqueName: unqNamesObj.acntUname
      }, data, onSuccess, onFailure) );
    },

    updateEntry(unqNamesObj, data) {
      return this.handlePromise((onSuccess, onFailure) => Ledger.update({
        companyUniqueName: unqNamesObj.compUname,
        accountsUniqueName: unqNamesObj.acntUname,
        entryUniqueName: unqNamesObj.entUname
      }, data, onSuccess, onFailure) );
    },

    getEntry(unqNamesObj, data) {
      return this.handlePromise((onSuccess, onFailure) => Ledger.getEntry({
        companyUniqueName: unqNamesObj.compUname,
        accountsUniqueName: unqNamesObj.acntUname,
        entryUniqueName: unqNamesObj.entUname
      }, onSuccess, onFailure) );
    },

    deleteEntry(unqNamesObj) {
      return this.handlePromise((onSuccess, onFailure) => Ledger.delete({
        companyUniqueName: unqNamesObj.compUname,
        accountsUniqueName: unqNamesObj.acntUname,
        entryUniqueName: unqNamesObj.entUname
      }, onSuccess, onFailure) );
    },

    getOtherTransactions(unqNamesObj) {
      return this.handlePromise((onSuccess, onFailure) => otherLedger.getTransactions({
        companyUniqueName: unqNamesObj.compUname,
        accountsUniqueName: unqNamesObj.acntUname
      }, onSuccess, onFailure) );
    },

    trashTransaction(unqNamesObj) {
      return this.handlePromise((onSuccess, onFailure) => otherLedger.trashTransaction({
        companyUniqueName: unqNamesObj.compUname,
        accountsUniqueName: unqNamesObj.acntUname,
        transactionId: unqNamesObj.trId
      }, onSuccess, onFailure) );
    },

    getSettings(unqNamesObj) {
      return this.handlePromise((onSuccess, onFailure) => Ledger.getEntrySettings({
        companyUniqueName: unqNamesObj.compUname
      }, onSuccess, onFailure) );
    },

    updateEntrySettings(unqNamesObj, data) {
      return this.handlePromise((onSuccess, onFailure) => Ledger.updateEntrySettings({
        companyUniqueName: unqNamesObj.compUname
      }, data, onSuccess, onFailure) );
    },

    downloadInvoiceFile(unqNamesObj) {
      return this.handlePromise((onSuccess, onFailure) => Ledger.getInvoiceFile({
        companyUniqueName: unqNamesObj.companyUniqueName,
        accountsUniqueName: unqNamesObj.accountsUniqueName,
        fileName:unqNamesObj.file
      }, onSuccess, onFailure) );
    },

    getReconcileEntries(unqNamesObj) {
      return this.handlePromise((onSuccess, onFailure) => Ledger.getReconcileEntries({
        companyUniqueName: unqNamesObj.companyUniqueName,
        accountsUniqueName: unqNamesObj.accountUniqueName,
        chequeNumber:unqNamesObj.chequeNumber,
        from:unqNamesObj.from,
        to:unqNamesObj.to
      }, onSuccess, onFailure) );
    },

    mapBankEntry(unqNamesObj, data) {
      return this.handlePromise((onSuccess, onFailure) => otherLedger.mapEntry({
        companyUniqueName: unqNamesObj.companyUniqueName,
        accountsUniqueName: unqNamesObj.accountUniqueName,
        transactionId: unqNamesObj.transactionId
      },data, onSuccess, onFailure) );
    }
  };

  return ledgerService;
});