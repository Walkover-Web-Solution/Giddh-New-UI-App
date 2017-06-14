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
      url: '/company/all'
    },

    getCompanyListElectron: {
      method: 'GET',
      url: '/users/:uniqueName/companies'
    },

    deleteCompany: {
      method: 'DELETE',
      url: '/company/:uniqueName'
    },

    updateCompany: {
      method: 'PUT',
      url: '/company/:uniqueName'
    },

    shareCompany: {
      method: 'PUT',
      url: '/company/:uniqueName/share'
    },

    getSharedList: {
      method: 'GET',
      url: '/company/:uniqueName/shared-with'
    },

    getCmpRolesList: {
      method: 'GET',
      url: '/company/:uniqueName/shareable-roles'
    },

    unSharedUser: {
      method: 'PUT',
      url: '/company/:uniqueName/unshare'
    },

    getUploadListDetails: {
      method: 'GET',
      url: '/company/:uniqueName/imports'
    },

    getProfitLoss: {
      method:'GET',
      url: '/company/:uniqueName/profit-loss'
    },

    switchUser: {
      method: 'GET',
      url: '/company/:uniqueName/switchUser'
    },

    getCompTrans: {
      method:'GET',
      url: '/company/:uniqueName/transactions?page=:page'
    },

    updtCompSubs: {
      method: 'PUT',
      url: '/company/:uniqueName/subscription-update'
    },

    payBillViaWallet: {
      method: 'POST',
      url: '/company/:uniqueName/pay-via-wallet'
    },

    retryXmlUpload: {
      method: 'PUT',
      url: '/company/:uniqueName/retry'
    },

    getInvTemplates: {
      method: 'GET',
      url: '/company/:uniqueName/templates'
    },

    setDefltInvTemplt: {
      method: 'PUT',
      url: '/company/:uniqueName/templates/:tempUname'
    },

    updtInvTempData: {
      method: 'PUT',
      url: '/company/:uniqueName/templates'
    },

    delInv: {
      method: 'DELETE',
      url: '/company/:uniqueName/invoices/:invoiceUniqueID'
    },

    getTax: {
      method:'GET',
      url: '/company/:uniqueName/tax'
    },

    addTax: {
      method: 'POST',
      url: '/company/:uniqueName/tax'
    },

    deleteTax: {
      method: 'DELETE',
      url: '/company/:uniqueName/tax/:taxUniqueName'
    },

    editTax: {
      method: 'PUT',
      url: '/company/:uniqueName/tax/:taxUniqueName/:updateEntries'
    },

    saveSmsKey: {
      method: 'POST',
      url: '/company/:companyUniqueName/sms-key'
    },

    saveEmailKey: {
      method: 'POST',
      url: '/company/:companyUniqueName/email-key'
    },

    getSmsKey: {
      method: 'GET',
      url: '/company/:companyUniqueName/sms-key'
    },

    getEmailKey: {
      method: 'GET',
      url: '/company/:companyUniqueName/email-key'
    },

    sendEmail: {
      method: 'POST',
      url: '/company/:companyUniqueName/accounts/bulk-email?from=:from&to=:to'
    },

    sendSms: {
      method: 'POST',
      url: '/company/:companyUniqueName/accounts/bulk-sms?from=:from&to=:to'
    },

    getFY: {
      method: 'GET',
      url: '/company/:companyUniqueName/financial-year'
    },

    updateFY: {
      method: 'PUT',
      url: '/company/:companyUniqueName/financial-year'
    },

    switchFY: {
      method: 'PATCH',
      url: '/company/:companyUniqueName/active-financial-year'
    },

    lockFY: {
      method: 'PATCH',
      url: '/company/:companyUniqueName/financial-year-lock'
    },

    unlockFY: {
      method: 'PATCH',
      url: '/company/:companyUniqueName/financial-year-unlock'
    },

    addFY: {
      method: 'POST',
      url: '/company/:companyUniqueName/financial-year'
    },

    getMagicLink: {
      method: 'POST',
      url: '/company/:companyUniqueName/accounts/:accountUniqueName/magic-link?from=:from&to=:to'
    },

    assignTax: {
      method: 'POST',
      url: '/company/:companyUniqueName/tax/assign'
    },

    saveInvoiceSetting: {
      method: 'PUT',
      url: '/company/:companyUniqueName/invoice-setting'
    },

    getCroppedAcnt: {
      method: 'GET',
      url: '/company/:companyUniqueName/cropped-flatten-account'
    },

    postCroppedAcnt: {
      method: 'POST',
      url: '/company/:companyUniqueName/cropped-flatten-account'
    },


    getAllSettings: {
      method: 'GET',
      url: '/company/:companyUniqueName/settings'
    },

    updateAllSettings: {
      method: 'PUT',
      url: '/company/:companyUniqueName/settings'
    },

    createWebhook: {
      method: 'POST',
      url: '/company/:companyUniqueName/settings/webhooks'
    },

    deleteWebhook: {
      method: 'DELETE',
      url: '/company/:companyUniqueName/settings/webhooks/:webhookUniqueName'
    },

    getRazorPayDetail: {
      method: 'GET',
      url: '/company/:companyUniqueName/razorpay'
    },

    addRazorPayDetail: {
      method: 'POST',
      url: '/company/:companyUniqueName/razorpay'
    },

    updateRazorPayDetail: {
      method: 'PUT',
      url: '/company/:companyUniqueName/razorpay'
    },

    deleteRazorPayDetail: {
      method: 'DELETE',
      url: '/company/:companyUniqueName/razorpay'
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

  return companyServices;
});

