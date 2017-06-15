import { electronUrl, webUrl } from '../app.constants';
giddh.serviceModule.service('invoiceService', function($resource, $q) {
  let Invoice = $resource('/company/:companyUniqueName/invoices',
    {
      'companyUniqueName': this.companyUniqueName,
      'date1': this.date1,
      'date2': this.date2,
      'combined': this.combined,
      'proforma': this.proforma,
      'count':this.count,
      'page':this.page
    },
    {
      getAll: {
        method: 'POST',
        url: getUrl('getAll')
      },
      getAllLedgers: {
        method: 'POST',
        url: getUrl('getAllLedgers')
      },
      generateBulkInvoice: {
        method: 'POST',
        url: getUrl('generateBulkInvoice')
      },
      actionOnInvoice: {
        method: 'POST',
        url: getUrl('actionOnInvoice')
      },
      getAllProforma: {
        method: 'GET',
        url: getUrl('getAllProforma')
      },
      getAllProformaByFilter: {
        method: 'POST',
        url: getUrl('getAllProformaByFilter')
      },
      deleteProforma: {
        method: 'DELETE',
        url: getUrl('deleteProforma')
      },
      updateBalanceStatus: {
        method: 'POST',
        url: getUrl('updateBalanceStatus')
      },
      linkProformaAccount: {
        method: 'POST',
        url: getUrl('linkProformaAccount')
      },
      getTemplates: {
        method: 'GET',
        url: getUrl('getTemplates')
      },
      createProforma: {
        method: 'POST',
        url: getUrl('createProforma')
      },
      updateProforma: {
        method: 'PUT',
        url: getUrl('updateProforma')
      },
      getProforma: {
        method: 'POST',
        url: getUrl('getProforma')
      },
      sendMail: {
        method: 'POST',
        url: getUrl('sendMail')
      },
      downloadProforma: {
        method: 'POST',
        url: getUrl('downloadProforma')
      },
      setDefaultProformaTemplate: {
        method: 'PUT',
        url: getUrl('setDefaultProformaTemplate')
      }
    });

  let invoiceService = {
    handlePromise(func) {
      let deferred = $q.defer();
      let onSuccess = data=> deferred.resolve(data);
      let onFailure = data=> deferred.reject(data);
      func(onSuccess, onFailure);
      return deferred.promise;
    },

    getInvoices(info, data) {
      return this.handlePromise((onSuccess, onFailure) => Invoice.getAll({
        companyUniqueName: info.companyUniqueName,
        date1: info.fromDate,
        date2: info.toDate,
        count: info.count,
        page: info.page
      }, data, onSuccess, onFailure) );
    },

    getAllLedgers(info, data) {
      return this.handlePromise((onSuccess, onFailure) => Invoice.getAllLedgers({
        companyUniqueName: info.companyUniqueName,
        date1: info.fromDate,
        date2: info.toDate,
        count: info.count,
        page: info.page
      },data, onSuccess, onFailure) );
    },

    generateBulkInvoice(info, data) {
      return this.handlePromise((onSuccess, onFailure) => Invoice.generateBulkInvoice({
        companyUniqueName: info.companyUniqueName,
        combined: info.combined
      }, data, onSuccess, onFailure) );
    },

    performAction(info, data) {
      return this.handlePromise((onSuccess, onFailure) => Invoice.actionOnInvoice({
        companyUniqueName: info.companyUniqueName,
        invoiceUniqueName: info.invoiceUniqueName
      }, data, onSuccess, onFailure) );
    },

    getAllProforma(reqParam) {
      return this.handlePromise((onSuccess, onFailure) => Invoice.getAllProforma({
        companyUniqueName: reqParam.companyUniqueName,
        date1: reqParam.date1,
        date2: reqParam.date2,
        count: reqParam.count,
        page : reqParam.page
      }, onSuccess, onFailure) );
    },

    getAllProformaByFilter(company, data) {
      return this.handlePromise((onSuccess, onFailure) => Invoice.getAllProformaByFilter({
        companyUniqueName: company
      }, data, onSuccess, onFailure) );
    },

    deleteProforma(reqParam) {
      return this.handlePromise((onSuccess, onFailure) => Invoice.deleteProforma({
        companyUniqueName: reqParam.companyUniqueName,
        proforma: reqParam.proforma
      }, onSuccess, onFailure) );
    },

    updateBalanceStatus(reqParam, data) {
      return this.handlePromise((onSuccess, onFailure) => Invoice.updateBalanceStatus({
        companyUniqueName: reqParam.companyUniqueName
      }, data, onSuccess, onFailure) );
    },

    linkProformaAccount(reqParam, data) {
      return this.handlePromise((onSuccess, onFailure) => Invoice.linkProformaAccount({
        companyUniqueName: reqParam.companyUniqueName
      }, data, onSuccess, onFailure) );
    },

    getTemplates(reqParam) {
      return this.handlePromise((onSuccess, onFailure) => Invoice.getTemplates({
        companyUniqueName: reqParam.companyUniqueName
      }, onSuccess, onFailure) );
    },

    createProforma(reqParam, data) {
      return this.handlePromise((onSuccess, onFailure) => Invoice.createProforma({
        companyUniqueName: reqParam.companyUniqueName
      }, data, onSuccess, onFailure) );
    },

    updateProforma(reqParam, data) {
      return this.handlePromise((onSuccess, onFailure) => Invoice.updateProforma({
        companyUniqueName: reqParam.companyUniqueName
      }, data, onSuccess, onFailure) );
    },

    getProforma(reqParam,data) {
      return this.handlePromise((onSuccess, onFailure) => Invoice.getProforma({
        companyUniqueName: reqParam.companyUniqueName
      },data ,onSuccess, onFailure) );
    },

    sendMail(reqParam,data) {
      return this.handlePromise((onSuccess, onFailure) => Invoice.sendMail({
        companyUniqueName: reqParam.companyUniqueName
      },data ,onSuccess, onFailure) );
    },

    downloadProforma(reqParam,data) {
      return this.handlePromise((onSuccess, onFailure) => Invoice.downloadProforma({
        companyUniqueName: reqParam.companyUniqueName
      },data ,onSuccess, onFailure) );
    },

    setDefaultProformaTemplate(reqParam,data) {
      return this.handlePromise((onSuccess, onFailure) => Invoice.setDefaultProformaTemplate({
        companyUniqueName: reqParam.companyUniqueName
      },data ,onSuccess, onFailure) );
    }
  };

  let getUrl = (urlKey) => {
    if (isElectron) {
        return electronUrl.Invoice[urlKey];
    } else {
        return webUrl.Invoice[urlKey]
    }
  }

  return invoiceService;
});