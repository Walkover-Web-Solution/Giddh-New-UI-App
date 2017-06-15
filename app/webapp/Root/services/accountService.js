import { electronUrl, webUrl } from '../../app.constants';
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
        url: getUrl('update')
      },
      share: {
        method: 'PUT',
        url: getUrl('share')
      },

      unshare: {
        method: 'PUT',
        url: getUrl('unshare')
      },

      merge: {
        method: 'PUT',
        url: getUrl('merge')
      },

      // unMerge : {method: 'PUT', url: '/company/:companyUniqueName/accounts/:accountsUniqueName/merge'}

      unMergeDelete : {
        method: 'POST',
        url: getUrl('unMergeDelete')
      },

      sharedWith: {
        method: 'GET',
        url: getUrl('sharedWith')
      },

      delete: {
        method: 'DELETE',
        url: getUrl('delete')
      },
      get: {
        method: 'GET',
        url: getUrl('get')
      },
      move: {
        method: 'PUT',
        url: getUrl('move')
      },

      export: {
        method: 'GET',
        url: getUrl('export')
      },

      getlist: {
        method: 'GET',
        url: getUrl('getlist')
      },

      emailLedger: {
        method: 'POST',
        url: getUrl('emailLedger')
      },

      getInvList: {
        method: 'GET',
        url: getUrl('getInvList')
      },

      prevInvoice: {
        method: 'POST',
        url: getUrl('prevInvoice')
      },

      genInvoice: {
        method: 'POST',
        url: getUrl('genInvoice')
      },

      downloadInvoice: {
        method: 'POST',
        url: getUrl('downloadInvoice')
      },

      prevOfGenInvoice: {
        method: 'GET',
        url: getUrl('prevOfGenInvoice')
      },

      mailInvoice: {
        method: 'POST',
        url: getUrl('mailInvoice')
      },

      updateInvoice: {
        method: 'PUT',
        url: getUrl('updateInvoice')
      },

      generateMagicLink: {
        method: 'POST',
        url: getUrl('generateMagicLink')
      },

      getTaxHierarchy: {
        method: 'GET',
        url: getUrl('getTaxHierarchy')
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

   let getUrl = (urlKey) => {
        if (isElectron) {
            return electronUrl.Report[urlKey];
        } else {
            return webUrl.Report[urlKey];
        }
    }

  return accountService;
});
