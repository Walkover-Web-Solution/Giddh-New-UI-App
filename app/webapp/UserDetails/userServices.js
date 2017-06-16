import { electronUrl, webUrl } from "../app.constants";

let getUrl = urlKey => {
  if (isElectron) {
    return electronUrl.UserSET[urlKey];
  } else {
    return webUrl.UserSET[urlKey];
  }
};


giddh.serviceModule.service('userServices', function($resource, $q) {
  let UserSET = $resource('/users',
      {
        'uniqueName': this.uniqueName,
        'companyUniqueName' : this.companyUniqueName,
        'page': this.page,
        'memSiteAccId': this.memSiteAccId,
        'linkedAccount': this.linkedAccount,
        'accountId': this.accountId
      },
      {
        getUserDetails: {
          method: 'GET',
          url: getUrl('getUserDetails')
        },
        getSetAuthKey: {
          method: 'GET',
          url: getUrl('getSetAuthKey')
        },
        generateAuthKey: {
          method: 'PUT',
          url: getUrl('generateAuthKey')
        },
        getSubList: {
          method: 'GET',
          url: getUrl('getSubList')
        },
        getUserSubList: {
          method: 'GET',
          url: getUrl('getUserSubList')
        },
        getWltBal: {
          method: 'GET',
          url: getUrl('getWltBal')
        },
        cancelAutoPay: {
          method: 'PUT',
          url: getUrl('cancelAutoPay')
        },
        addBalInWallet: {
          method: 'POST',
          url: getUrl('addBalInWallet')
        },
        searchSite: {
          method: 'POST',
          url: getUrl('searchSite')
        },
        addSiteAccount: {
          method: 'POST',
          url: getUrl('addSiteAccount')
        },
        getAccounts: {
          method: 'GET',
          url: getUrl('getAccounts')
        },
        addGiddhAccount: {
          method: 'PUT',
          url: getUrl('addGiddhAccount')
        },
        setTransactionDate: {
          method: 'PUT',
          url: getUrl('setTransactionDate')
        },
        verifyMfa: {
          method: 'POST',
          url: getUrl('verifyMfa')
        },
        refreshAll: {
          method: 'GET',
          url: getUrl('refreshAll')
        },
        deleteBAccount: {
          method: 'DELETE',
          url: getUrl('deleteBAccount')
        },
        removeGiddhAccount: {
          method: 'DELETE',
          url: getUrl('removeGiddhAccount')
        },
        createSubUser: {
          method: 'POST',
          url: getUrl('createSubUser')
        },
        deleteSubUser: {
          method: 'DELETE',
          url: getUrl('deleteSubUser')
        },
        getSubUserAuthKey: {
          method: 'GET',
          url: getUrl('getSubUserAuthKey')
        },
        addMobileNumber : {
          method: 'POST',
          url: getUrl('addMobileNumber')
        },
        verifyNumber : {
          method: 'PUT',
          url: getUrl('verifyNumber')
        },
        connectBankAc: {
          method: 'GET',
          url: getUrl('connectBankAc')
        },
        refreshAccount: {
          method: 'GET',
          url: getUrl('refreshAccount')
        },
        reconnectAccount:{
          method: 'GET',
          url: getUrl('reconnectAccount')
        },
        changeTwoWayAuth: {
          method: 'PUT',
          url: getUrl('/changeTwoWayAuth')
        }
      }
  );

  let userServices = {
    handlePromise(func) {
      let deferred = $q.defer();
      let onSuccess = data=> deferred.resolve(data);
      let onFailure = data=> deferred.reject(data);
      func(onSuccess, onFailure);
      return deferred.promise;
    },

    get(name) {
      return this.handlePromise((onSuccess, onFailure) => UserSET.getUserDetails({uniqueName: name}, onSuccess, onFailure));
    },

    getKey(name) {
      return this.handlePromise((onSuccess, onFailure) => UserSET.getSetAuthKey({uniqueName: name}, onSuccess, onFailure));
    },

    generateKey(name) {
      return this.handlePromise((onSuccess, onFailure) => UserSET.generateAuthKey({uniqueName: name}, {}, onSuccess, onFailure));
    },

    getsublist(name) {
      return this.handlePromise((onSuccess, onFailure) => UserSET.getSubList({uniqueName: name}, onSuccess, onFailure));
    },

    getUserSublist(obj) {
      return this.handlePromise((onSuccess, onFailure) => UserSET.getUserSubList({uniqueName: obj.name, page: obj.num}, onSuccess, onFailure));
    },

    getWltBal(name) {
      return this.handlePromise((onSuccess, onFailure) => UserSET.getWltBal({uniqueName: name}, onSuccess, onFailure));
    },

    cancelAutoPay(data) {
      return this.handlePromise((onSuccess, onFailure) => UserSET.cancelAutoPay({uniqueName: data.uUname}, data, onSuccess, onFailure));
    },

    addBalInWallet(data) {
      return this.handlePromise((onSuccess, onFailure) => UserSET.addBalInWallet({uniqueName: data.uUname}, data, onSuccess, onFailure));
    },
    searchSite(data, reqParam) {
      return this.handlePromise((onSuccess, onFailure) => UserSET.searchSite({name: reqParam.pName}, data , onSuccess, onFailure));
    },
    // loginRegister: () ->
    //   @handlePromise((onSuccess, onFailure) ->
    //     UserSET.loginRegister(onSuccess, onFailure)
    // )
    addSiteAccount(data, companyUniqueName) {
      return this.handlePromise((onSuccess, onFailure) => UserSET.addSiteAccount({companyUniqueName: companyUniqueName.cUnq}, data, onSuccess, onFailure));
    },
    getAccounts(companyUniqueName) {
      return this.handlePromise((onSuccess, onFailure) => UserSET.getAccounts({companyUniqueName: companyUniqueName.cUnq}, onSuccess, onFailure));
    },
    addGiddhAccount(companyUniqueName, data) {
      return this.handlePromise((onSuccess, onFailure) => UserSET.addGiddhAccount({companyUniqueName: companyUniqueName.cUnq, itemAccountId:companyUniqueName.itemAccountId}, data, onSuccess, onFailure));
    },
    setTransactionDate(obj, data) {
      return this.handlePromise((onSuccess, onFailure) => UserSET.setTransactionDate({companyUniqueName: obj.cUnq, itemAccountId:obj.itemAccountId, date: obj.date}, data, onSuccess, onFailure));
    },
    verifyMfa(unqObj, data) {
      return this.handlePromise((onSuccess, onFailure) => UserSET.verifyMfa({companyUniqueName: unqObj.cUnq,  itemAccountId: unqObj.itemId}, data, onSuccess, onFailure));
    },
    refreshAll(companyUniqueName) {
      return this.handlePromise((onSuccess, onFailure) => UserSET.refreshAll({companyUniqueName: companyUniqueName.cUnq},onSuccess, onFailure));
    },
    removeAccount(reqParam) {
      return this.handlePromise((onSuccess, onFailure) => UserSET.removeGiddhAccount({companyUniqueName: reqParam.cUnq, ItemAccountId: reqParam.ItemAccountId},onSuccess, onFailure));
    },
    deleteBankAccount(reqParam) {
      return this.handlePromise((onSuccess, onFailure) => UserSET.deleteBAccount({companyUniqueName: reqParam.cUnq, loginId: reqParam.loginId},onSuccess, onFailure));
    },
    createSubUser(uUname, data) {
      return this.handlePromise((onSuccess, onFailure) => UserSET.createSubUser({uniqueName: uUname}, data, onSuccess,onFailure));
    },
    deleteSubUser(uUname) {
      return this.handlePromise((onSuccess, onFailure) => UserSET.deleteSubUser({uniqueName: uUname}, onSuccess,onFailure));
    },
    getSubUserAuthKey(uUname) {
      return this.handlePromise((onSuccess, onFailure) => UserSET.getSubUserAuthKey({uniqueName: uUname}, onSuccess, onFailure));
    },
    addNumber(data) {
      return this.handlePromise((onSuccess, onFailure) => UserSET.addMobileNumber(data, onSuccess, onFailure));
    },
    verifyNumber(data) {
      return this.handlePromise((onSuccess, onFailure) => UserSET.verifyNumber(data, onSuccess, onFailure));
    },
    connectBankAc(uUname) {
      return this.handlePromise((onSuccess, onFailure) => UserSET.connectBankAc({companyUniqueName: uUname}, onSuccess, onFailure));
    },
    refreshAccount(reqParam) {
      return this.handlePromise((onSuccess, onFailure) => UserSET.refreshAccount({companyUniqueName: reqParam.companyUniqueName, loginId: reqParam.loginId}, onSuccess, onFailure));
    },
    reconnectAccount(reqParam) {
      return this.handlePromise((onSuccess, onFailure) => UserSET.reconnectAccount({companyUniqueName: reqParam.companyUniqueName, loginId: reqParam.loginId}, onSuccess, onFailure));
    },
    changeTwoWayAuth(reqParam, data) {
      return this.handlePromise((onSuccess, onFailure) => UserSET.changeTwoWayAuth({uniqueName:reqParam.uniqueName}, data, onSuccess, onFailure));
    }
  };

  return userServices;
});

