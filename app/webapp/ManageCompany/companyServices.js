import { electronUrl, webUrl } from '../app.constants';
giddh.serviceModule.service('companyServices', function($resource, $q) {
  let Company = $resource('/company',
  {
    'uniqueName': this.uniqueName,
    'page': this.page,
    'tempUname': this.tempUname,
    'invoiceUniqueID': this.invoiceUniqueID,
    'taxUniqueName': this.taxUniqueName,
    'to':this.to,
    'from':this.from
  },
  {
    addCompany: {
      method: 'POST'
    },

    getCompanyDetails: {
      method: 'GET',
      url: '/company/:uniqueName'
    },

    getCompanyList: {
      method: 'GET',
      url: webUrl.Company.getCompanyList
    },

    getCompanyListElectron: {
      method: 'GET',
      url: webUrl.Company.getCompanyList
    },

    deleteCompany: {
      method: 'DELETE',
      url: getUrl('deleteCompany')
    },

    updateCompany: {
      method: 'PUT',
      url: getUrl('updateCompany')
    },

    shareCompany: {
      method: 'PUT',
      url: getUrl('shareCompany')
    },

    getSharedList: {
      method: 'GET',
      url: getUrl('getSharedList')
    },

    getCmpRolesList: {
      method: 'GET',
      url: getUrl('getCmpRolesList')
    },

    unSharedUser: {
      method: 'PUT',
      url: getUrl('unSharedUser')
    },

    getUploadListDetails: {
      method: 'GET',
      url: getUrl('getUploadListDetails')
    },

    getProfitLoss: {
      method:'GET',
      url: getUrl('getProfitLoss')
    },

    switchUser: {
      method: 'GET',
      url: getUrl('switchUser')
    },

    getCompTrans: {
      method:'GET',
      url: getUrl('getCompTrans')
    },

    updtCompSubs: {
      method: 'PUT',
      url: getUrl('updtCompSubs')
    },

    payBillViaWallet: {
      method: 'POST',
      url: getUrl('payBillViaWallet')
    },

    retryXmlUpload: {
      method: 'PUT',
      url: getUrl('retryXmlUpload')
    },

    getInvTemplates: {
      method: 'GET',
      url: getUrl('getInvTemplates')
    },

    setDefltInvTemplt: {
      method: 'PUT',
      url: getUrl('setDefltInvTemplt')
    },

    updtInvTempData: {
      method: 'PUT',
      url: getUrl('updtInvTempData')
    },

    delInv: {
      method: 'DELETE',
      url: getUrl('delInv')
    },

    getTax: {
      method:'GET',
      url: getUrl('getTax')
    },

    addTax: {
      method: 'POST',
      url: getUrl('addTax')
    },

    deleteTax: {
      method: 'DELETE',
      url: getUrl('deleteTax')
    },

    editTax: {
      method: 'PUT',
      url: getUrl('editTax')
    },

    saveSmsKey: {
      method: 'POST',
      url: getUrl('saveSmsKey')
    },

    saveEmailKey: {
      method: 'POST',
      url: getUrl('saveEmailKey')
    },

    getSmsKey: {
      method: 'GET',
      url: getUrl('getSmsKey')
    },

    getEmailKey: {
      method: 'GET',
      url: getUrl('getEmailKey')
    },

    sendEmail: {
      method: 'POST',
      url: getUrl('sendEmail')
    },

    sendSms: {
      method: 'POST',
      url: getUrl('sendSms')
    },

    getFY: {
      method: 'GET',
      url: getUrl('getFY')
    },

    updateFY: {
      method: 'PUT',
      url: getUrl('updateFY')
    },

    switchFY: {
      method: 'PATCH',
      url: getUrl('switchFY')
    },

    lockFY: {
      method: 'PATCH',
      url: getUrl('lockFY')
    },

    unlockFY: {
      method: 'PATCH',
      url: getUrl('unlockFY')
    },

    addFY: {
      method: 'POST',
      url: getUrl('addFY')
    },

    getMagicLink: {
      method: 'POST',
      url: getUrl('getMagicLink')
    },

    assignTax: {
      method: 'POST',
      url: getUrl('assignTax')
    },

    saveInvoiceSetting: {
      method: 'PUT',
      url: getUrl('saveInvoiceSetting')
    },

    getCroppedAcnt: {
      method: 'GET',
      url: getUrl('getCroppedAcnt')
    },

    postCroppedAcnt: {
      method: 'POST',
      url: getUrl('postCroppedAcnt')
    },


    getAllSettings: {
      method: 'GET',
      url: getUrl('getAllSettings')
    },

    updateAllSettings: {
      method: 'PUT',
      url: getUrl('updateAllSettings')
    },

    createWebhook: {
      method: 'POST',
      url: getUrl('createWebhook')
    },

    deleteWebhook: {
      method: 'DELETE',
      url: getUrl('deleteWebhook')
    },

    getRazorPayDetail: {
      method: 'GET',
      url: getUrl('getRazorPayDetail')
    },

    addRazorPayDetail: {
      method: 'POST',
      url: getUrl('addRazorPayDetail')
    },

    updateRazorPayDetail: {
      method: 'PUT',
      url: getUrl('updateRazorPayDetail')
    },

    deleteRazorPayDetail: {
      method: 'DELETE',
      url: getUrl('deleteRazorPayDetail')
    }
  });

  let companyServices = {
    handlePromise(func) {
      let deferred = $q.defer();
      let onSuccess = data=> deferred.resolve(data);
      let onFailure = data=> deferred.reject(data);
      func(onSuccess, onFailure);
      return deferred.promise;
    },

    create(cdata) {
      return this.handlePromise((onSuccess, onFailure) => Company.addCompany(cdata, onSuccess, onFailure));
    },

    getAll() {
      return this.handlePromise((onSuccess, onFailure) => Company.getCompanyList(onSuccess, onFailure));
    },

    getAllElectron(uniqueName) {
        return this.handlePromise((onSuccess, onFailure) => Company.getCompanyListElectron({uniqueName}, onSuccess, onFailure));
    },

    get(uniqueName) {
      return this.handlePromise((onSuccess, onFailure) => Company.getCompanyDetails({uniqueName}, onSuccess,
          onFailure) );
    },

    delete(uniqueName, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => Company.deleteCompany({
        uniqueName
      }, onSuccess, onFailure) );
    },

    update(updtData, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => Company.updateCompany({
        uniqueName: updtData.uniqueName
      }, updtData, onSuccess, onFailure) );
    },

    share(uniqueName, shareRequest, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => Company.shareCompany({
        uniqueName
      }, shareRequest, onSuccess, onFailure) );
    },

    shredList(uniqueName, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => Company.getSharedList({uniqueName}, onSuccess, onFailure));
    },

    unSharedComp(uniqueName, data, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => Company.unSharedUser({uniqueName}, data, onSuccess, onFailure));
    },

    getRoles(cUname, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => Company.getCmpRolesList({uniqueName: cUname}, onSuccess, onFailure));
    },

    getUploadsList(uniqueName) {
      return this.handlePromise((onSuccess, onFailure) => Company.getUploadListDetails({uniqueName}, onSuccess, onFailure));
    },

    getPL(obj) {
      return this.handlePromise((onSuccess, onFailure) => Company.getProfitLoss({uniqueName: obj.uniqueName, from: obj.fromDate, to:obj.toDate}, onSuccess, onFailure));
    },

    getCompTrans(obj) {
      return this.handlePromise((onSuccess, onFailure) => Company.getCompTrans({uniqueName: obj.name, page: obj.num}, onSuccess, onFailure));
    },

    updtCompSubs(data, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => Company.updtCompSubs({
        uniqueName: data.uniqueName
      }, data, onSuccess, onFailure) );
    },

    payBillViaWallet(data, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => Company.payBillViaWallet({
        uniqueName: data.uniqueName
      }, data, onSuccess, onFailure) );
    },

    retryXml(uniqueName, data, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => Company.retryXmlUpload({uniqueName},data, onSuccess, onFailure));
    },

    switchUser(uniqueName) {
      return this.handlePromise((onSuccess, onFailure) => Company.switchUser({uniqueName},onSuccess,
          onFailure) );
    },

    getInvTemplates(uniqueName, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => Company.getInvTemplates({uniqueName}, onSuccess, onFailure));
    },

    setDefltInvTemplt(obj, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => Company.setDefltInvTemplt({uniqueName: obj.uniqueName, tempUname: obj.tempUname}, {}, onSuccess, onFailure));
    },

    updtInvTempData(uniqueName, data, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => Company.updtInvTempData({uniqueName}, data, onSuccess, onFailure));
    },

    delInv(obj, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => Company.delInv({
          uniqueName: obj.compUname,
          invoiceUniqueID: obj.invoiceUniqueID
        }, onSuccess, onFailure) );
    },

    getTax(uniqueName) {
      return this.handlePromise((onSuccess, onFailure) => Company.getTax({uniqueName}, onSuccess, onFailure));
    },

    addTax(uniqueName, data) {
      return this.handlePromise((onSuccess, onFailure) => Company.addTax({uniqueName}, data, onSuccess, onFailure));
    },

    deleteTax(reqParam, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => Company.deleteTax({
        uniqueName: reqParam.uniqueName,
        taxUniqueName: reqParam.taxUniqueName
      }, onSuccess, onFailure) );
    },

    editTax(reqParam, taxData, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => Company.editTax({
        uniqueName: reqParam.uniqueName,
        taxUniqueName: reqParam.taxUniqueName,
        updateEntries: reqParam.updateEntries
      }, taxData, onSuccess, onFailure) );
    },

    saveSmsKey(companyUniqueName, data) {
      return this.handlePromise((onSuccess, onFailure) => Company.saveSmsKey({companyUniqueName}, data, onSuccess, onFailure));
    },

    saveEmailKey(companyUniqueName, data) {
      return this.handlePromise((onSuccess, onFailure) => Company.saveEmailKey({companyUniqueName}, data, onSuccess, onFailure));
    },

    getSmsKey(companyUniqueName) {
      return this.handlePromise((onSuccess, onFailure) => Company.getSmsKey({companyUniqueName}, onSuccess,
          onFailure) );
    },

    getEmailKey(companyUniqueName) {
      return this.handlePromise((onSuccess, onFailure) => Company.getEmailKey({companyUniqueName}, onSuccess,
          onFailure) );
    },

    sendEmail(reqParam, data) {
      return this.handlePromise((onSuccess, onFailure) => Company.sendEmail({companyUniqueName: reqParam.compUname, to:reqParam.to, from:reqParam.from}, data, onSuccess, onFailure));
    },

    sendSms(reqParam, data) {
      return this.handlePromise((onSuccess, onFailure) => Company.sendSms({companyUniqueName: reqParam.compUname, to:reqParam.to, from:reqParam.from}, data, onSuccess, onFailure));
    },

    getFY(companyUniqueName) {
      return this.handlePromise((onSuccess, onFailure) => Company.getFY({companyUniqueName}, onSuccess,
          onFailure) );
    },

    updateFY(reqParam, data) {
      return this.handlePromise((onSuccess, onFailure) => Company.updateFY({companyUniqueName: reqParam.companyUniqueName}, data, onSuccess, onFailure));
    },

    switchFY(reqParam, data) {
      return this.handlePromise((onSuccess, onFailure) => Company.switchFY({companyUniqueName: reqParam.companyUniqueName}, data, onSuccess, onFailure));
    },

    lockFY(reqParam, data) {
      return this.handlePromise((onSuccess, onFailure) => Company.lockFY({companyUniqueName: reqParam.companyUniqueName}, data, onSuccess, onFailure));
    },

    unlockFY(reqParam, data) {
      return this.handlePromise((onSuccess, onFailure) => Company.unlockFY({companyUniqueName: reqParam.companyUniqueName}, data, onSuccess, onFailure));
    },

    addFY(reqParam, data) {
      return this.handlePromise((onSuccess, onFailure) => Company.addFY({companyUniqueName: reqParam.companyUniqueName}, data, onSuccess, onFailure));
    },

    getMagicLink(reqParam, data) {
      return this.handlePromise((onSuccess, onFailure) => Company.getMagicLink({companyUniqueName: reqParam.companyUniqueName, accountUniqueName: reqParam.accountUniqueName, from:reqParam.from, to:reqParam.to}, data, onSuccess, onFailure));
    },

    assignTax(companyUniqueName,data) {
      return this.handlePromise((onSuccess, onFailure) => Company.assignTax({
        companyUniqueName
      },data, onSuccess, onFailure) );
    },

    saveInvoiceSetting(companyUniqueName,data) {
      return this.handlePromise((onSuccess, onFailure) => Company.saveInvoiceSetting({
        companyUniqueName
      },data, onSuccess, onFailure) );
    },

    getCroppedAcnt(reqParam, data) {
      return this.handlePromise((onSuccess, onFailure) => Company.getCroppedAcnt({
        companyUniqueName: reqParam.cUname,
        query: reqParam.query
      },data, onSuccess, onFailure) );
    },

    postCroppedAcnt(reqParam, data) {
      return this.handlePromise((onSuccess, onFailure) => Company.postCroppedAcnt({
        companyUniqueName: reqParam.cUname,
        query: reqParam.query
      },data, onSuccess, onFailure) );
    },


    getAllSettings(companyUniqueName) {
      return this.handlePromise((onSuccess, onFailure) => Company.getAllSettings({
        companyUniqueName
      }, onSuccess, onFailure) );
    },

    updateAllSettings(companyUniqueName,data) {
      return this.handlePromise((onSuccess, onFailure) => Company.updateAllSettings({
        companyUniqueName
      },data, onSuccess, onFailure) );
    },

    createWebhook(companyUniqueName, data) {
      return this.handlePromise((onSuccess, onFailure) => Company.createWebhook({
        companyUniqueName
      }, data, onSuccess, onFailure) );
    },

    deleteWebhook(companyUniqueName, webhookUniqueName) {
      return this.handlePromise((onSuccess, onFailure) => Company.deleteWebhook({
        companyUniqueName,
        webhookUniqueName
      }, onSuccess, onFailure) );
    },

    getRazorPay(companyUniqueName) {
      return this.handlePromise((onSuccess, onFailure) => Company.getRazorPayDetail({
        companyUniqueName
      }, onSuccess, onFailure) );
    },

    addRazorPay(companyUniqueName, data) {
      return this.handlePromise((onSuccess, onFailure) => Company.addRazorPayDetail({
        companyUniqueName
      }, data, onSuccess, onFailure) );
    },

    updateRazorPay(companyUniqueName, data) {
      return this.handlePromise((onSuccess, onFailure) => Company.updateRazorPayDetail({
        companyUniqueName
      }, data, onSuccess, onFailure) );
    },

    deleteRazorPay(companyUniqueName) {
      return this.handlePromise((onSuccess, onFailure) => Company.deleteRazorPayDetail({
        companyUniqueName
      }, onSuccess, onFailure) );
    }
  };

  let getUrl = (urlKey) => {
    if (isElectron) {
        return electronUrl.Company[urlKey];
    } else {
        return webUrl.Company[urlKey];
    }
  }

  return companyServices;
});

