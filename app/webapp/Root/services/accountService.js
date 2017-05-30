giddh.serviceModule.service('accountService', function($resource, $q) {
  let createAccount = $resource('/company/:companyUniqueName/groups/:groupUniqueName/accounts',
    {
      'companyUniqueName': this.companyUniqueName,
      'groupUniqueName': this.groupUniqueName,
      'accountsUniqueName': this.accountsUniqueName,
      'toDate': this.toDate,
      'fromDate': this.fromDate
    },
    { 
      create: {
        method: 'POST'
      } 
    }
  );

  let Account = $resource('/company/:companyUniqueName/accounts',
    {
      'companyUniqueName': this.companyUniqueName,
      'accountsUniqueName': this.accountsUniqueName,
      'toDate': this.toDate,
      'fromDate': this.fromDate,
      'invoiceUniqueID': this.invoiceUniqueID
    },
    {
      update: {
        method: 'PUT',
        url: '/company/:companyUniqueName/accounts/:accountsUniqueName'
      },
      share: {
        method: 'PUT',
        url: '/company/:companyUniqueName/accounts/:accountsUniqueName/share'
      },

      unshare: {
        method: 'PUT',
        url: '/company/:companyUniqueName/accounts/:accountsUniqueName/unshare'
      },

      merge: {
        method: 'PUT',
        url: '/company/:companyUniqueName/accounts/:accountsUniqueName/merge'
      },

      // unMerge : {method: 'PUT', url: '/company/:companyUniqueName/accounts/:accountsUniqueName/merge'}

      unMergeDelete : {
        method: 'POST',
        url: '/company/:companyUniqueName/accounts/:accountsUniqueName/un-merge'
      },

      sharedWith: {
        method: 'GET',
        url: '/company/:companyUniqueName/accounts/:accountsUniqueName/shared-with'
      },
      
      delete: {
        method: 'DELETE',
        url: '/company/:companyUniqueName/accounts/:accountsUniqueName'
      },
      get: {
        method: 'GET',
        url: '/company/:companyUniqueName/accounts/:accountsUniqueName'
      },
      move: {
        method: 'PUT',
        url: '/company/:companyUniqueName/accounts/:accountsUniqueName/move'
      },

      export: {
        method: 'GET',
        url: '/company/:companyUniqueName/accounts/:accountsUniqueName/export-ledger'
      },
      
      getlist: {
        method: 'GET',
        url: '/company/:companyUniqueName/accounts/:accountsUniqueName/xls-imports'
      },
      
      emailLedger: {
        method: 'POST',
        url: '/company/:companyUniqueName/accounts/:accountsUniqueName/mail-ledger'
      },

      getInvList: {
        method: 'GET',
        url: '/company/:companyUniqueName/accounts/:accountsUniqueName/invoices?fromDate=:fromDate&toDate=:toDate'
      },

      prevInvoice: {
        method: 'POST',
        url: '/company/:companyUniqueName/accounts/:accountsUniqueName/invoices/preview'
      },

      genInvoice: {
        method: 'POST',
        url: '/company/:companyUniqueName/accounts/:accountsUniqueName/invoices/generate'
      },

      downloadInvoice: {
        method: 'POST',
        url: '/company/:companyUniqueName/accounts/:accountsUniqueName/invoices/download'
      },

      prevOfGenInvoice: {
        method: 'GET',
        url: '/company/:companyUniqueName/accounts/:accountsUniqueName/invoices/:invoiceUniqueID/preview'
      },

      mailInvoice: {
        method: 'POST',
        url: '/company/:companyUniqueName/accounts/:accountsUniqueName/invoices/mail'
      },

      updateInvoice: {
        method: 'PUT',
        url: '/company/:companyUniqueName/invoices'
      },

      generateMagicLink: {
        method: 'POST',
        url: '/company/:companyUniqueName/accounts/:accountsUniqueName/magic-link?fromDate=:fromDate&toDate=:toDate'
      },

      getTaxHierarchy: {
        method: 'GET',
        url: '/company/:companyUniqueName/accounts/:accountUniqueName/tax-hierarchy'
      }
      
    });

  let accountService = {
    handlePromise(func) {
      let deferred = $q.defer();
      let onSuccess = data=> deferred.resolve(data);
      let onFailure = data=> deferred.reject(data);
      func(onSuccess, onFailure);
      return deferred.promise;
    },

    createAc(unqNamesObj, data) {
      return this.handlePromise((onSuccess, onFailure) => createAccount.create({
        companyUniqueName: unqNamesObj.compUname,
        groupUniqueName: unqNamesObj.selGrpUname
      }, data, onSuccess, onFailure) );
    },

    updateAc(unqNamesObj, data) {
      return this.handlePromise((onSuccess, onFailure) => Account.update({
        companyUniqueName: unqNamesObj.compUname,
        accountsUniqueName: unqNamesObj.acntUname
      }, data, onSuccess, onFailure) );
    },

    deleteAc(unqNamesObj, data) {
      return this.handlePromise((onSuccess, onFailure) => Account.delete({
        companyUniqueName: unqNamesObj.compUname,
        accountsUniqueName: unqNamesObj.acntUname
      }, data, onSuccess, onFailure) );
    },

    get(unqNamesObj) {
      return this.handlePromise((onSuccess, onFailure) => Account.get({
        companyUniqueName: unqNamesObj.compUname,
        accountsUniqueName: unqNamesObj.acntUname
      }, onSuccess, onFailure) );
    },

    share(unqNamesObj, data) {
      return this.handlePromise((onSuccess, onFailure) => Account.share({
        companyUniqueName: unqNamesObj.compUname,
        accountsUniqueName: unqNamesObj.acntUname
      }, data, onSuccess, onFailure) );
    },

    unshare(unqNamesObj, data) {
      return this.handlePromise((onSuccess, onFailure) => Account.unshare({
        companyUniqueName: unqNamesObj.compUname,
        accountsUniqueName: unqNamesObj.acntUname
      }, data, onSuccess, onFailure) );
    },

    sharedWith(unqNamesObj) {
      return this.handlePromise((onSuccess, onFailure) => Account.sharedWith({
        companyUniqueName: unqNamesObj.compUname,
        accountsUniqueName: unqNamesObj.acntUname
      }, onSuccess, onFailure) );
    },

    move(unqNamesObj, data) {
      return this.handlePromise((onSuccess, onFailure) => Account.move({
        companyUniqueName: unqNamesObj.compUname,
        accountsUniqueName: unqNamesObj.acntUname
      }, data, onSuccess, onFailure) );
    },

    exportLedger(unqNamesObj) {
      return this.handlePromise((onSuccess, onFailure) => Account.export({
        companyUniqueName: unqNamesObj.compUname,
        accountsUniqueName: unqNamesObj.acntUname,
        toDate: unqNamesObj.toDate,
        fromDate: unqNamesObj.fromDate,
        ltype:unqNamesObj.lType
      }, onSuccess, onFailure) );
    },

    ledgerImportList(unqNamesObj) {
      return this.handlePromise((onSuccess, onFailure) => Account.getlist({
        companyUniqueName: unqNamesObj.compUname,
        accountsUniqueName: unqNamesObj.acntUname
      }, onSuccess, onFailure) );
    },

    merge(unqNamesObj, data) {
      return this.handlePromise((onSuccess, onFailure) => Account.merge({
        companyUniqueName: unqNamesObj.compUname,
        accountsUniqueName: unqNamesObj.acntUname
      }, data, onSuccess, onFailure) );
    },

    unMergeDelete(unqNamesObj, data) {
      return this.handlePromise((onSuccess, onFailure) => Account.unMergeDelete({
        companyUniqueName: unqNamesObj.compUname,
        accountsUniqueName: unqNamesObj.acntUname
      }, data, onSuccess, onFailure) );
    },

    // unMerge: (unqNamesObj, data) ->
    //   @handlePromise((onSuccess, onFailure) -> Account.merge({
    //     companyUniqueName: unqNamesObj.compUname
    //     accountsUniqueName: unqNamesObj.acntUname
    //   }, data, onSuccess, onFailure))

    emailLedger(obj, data) {
      return this.handlePromise((onSuccess, onFailure) => Account.emailLedger({
        companyUniqueName: obj.compUname,
        accountsUniqueName: obj.acntUname,
        toDate: obj.toDate,
        fromDate: obj.fromDate,
        format: obj.format
      }, data, onSuccess, onFailure) );
    },

    getInvList(obj, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => Account.getInvList({
          companyUniqueName: obj.compUname,
          accountsUniqueName: obj.acntUname,
          fromDate: obj.fromDate,
          toDate: obj.toDate
        }, onSuccess, onFailure) );
    },

    prevInvoice(obj, data, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => Account.prevInvoice({
          companyUniqueName: obj.compUname,
          accountsUniqueName: obj.acntUname
        },data, onSuccess, onFailure) );
    },

    genInvoice(obj, data, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => Account.genInvoice({
          companyUniqueName: obj.compUname,
          accountsUniqueName: obj.acntUname
        },data, onSuccess, onFailure) );
    },

    downloadInvoice(obj, data, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => Account.downloadInvoice({
          companyUniqueName: obj.compUname,
          accountsUniqueName: obj.acntUname
        },data, onSuccess, onFailure) );
    },

    prevOfGenInvoice(obj, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => Account.prevOfGenInvoice({
          companyUniqueName: obj.compUname,
          accountsUniqueName: obj.acntUname,
          invoiceUniqueID: obj.invoiceUniqueID
        }, onSuccess, onFailure) );
    },

    mailInvoice(obj, data, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => Account.mailInvoice({
          companyUniqueName: obj.compUname,
          accountsUniqueName: obj.acntUname
        },data, onSuccess, onFailure) );
    },

    generateMagicLink(obj) {
      return this.handlePromise((onSuccess, onFailure) => Account.generateMagicLink({
        companyUniqueName: obj.compUname,
        accountsUniqueName: obj.acntUname,
        fromDate: obj.fromDate,
        toDate: obj.toDate
      }, {}, onSuccess, onFailure) );
    },

    updateInvoice(obj, data) {
      return this.handlePromise((onSuccess, onFailure) => Account.updateInvoice({
        companyUniqueName: obj.compUname
      }, data, onSuccess, onFailure) );
    },

    getTaxHierarchy(companyUniqueName, accountUniqueName) {
      return this.handlePromise((onSuccess, onFailure) => Account.getTaxHierarchy({
        companyUniqueName,
        accountUniqueName
      }, onSuccess, onFailure) );
    }
  };

  return accountService;
});
