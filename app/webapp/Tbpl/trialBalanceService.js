giddh.serviceModule.service('trialBalService', function($resource, $q) {
  let trialBal = $resource('/company/:companyUniqueName/trial-balance',
    {
      'companyUniqueName': this.companyUniqueName,
      'fromDate': this.date1,
      'toDate': this.date2,
      'refresh': this.refresh,
      'fy': this.fy
    },
    {
      getAll: {
        method: 'GET',
        url: '/company/:companyUniqueName/trial-balance'
      },
      getBalSheet: {
        method: 'GET',
        url: '/company/:companyUniqueName/trial-balance/balance-sheet'
      },
      getPL: {
        method: 'GET',
        url: '/company/:companyUniqueName/trial-balance/profit-loss'
      },
      downloadTBExcel: {
        method: 'GET',
        url: '/company/:companyUniqueName/trial-balance/excel-export'
      }
    });

  let balanceSheet = $resource('/company/:companyUniqueName/balance-sheet', {},
    {
      downloadBSExcel: {
        method: 'GET',
        url: '/company/:companyUniqueName/balance-sheet/balance-sheet-collapsed-download'
      }
    });

  let profitLoss = $resource('/company/:companyUniqueName/profit-loss', {},
    {
      downloadPLExcel: {
        method: 'GET',
        url: '/company/:companyUniqueName/profit-loss/profit-loss-collapsed-download'
      }
    });

  let trialBalService = {
    handlePromise(func) {
      let deferred = $q.defer();
      let onSuccess = data=> deferred.resolve(data);
      let onFailure = data=> deferred.reject(data);
      func(onSuccess, onFailure);
      return deferred.promise;
    },

    getAllFor(reqParam, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => trialBal.getAll({companyUniqueName: reqParam.companyUniqueName, fromDate: reqParam.fromDate, toDate: reqParam.toDate, refresh: reqParam.refresh}, onSuccess,
        onFailure) );
    },

    getBalSheet(reqParam, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => trialBal.getBalSheet({companyUniqueName: reqParam.companyUniqueName, refresh: reqParam.refresh, fy: reqParam.fy}, onSuccess,
        onFailure) );
    },

    downloadBSExcel(reqParam, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => balanceSheet.downloadBSExcel({companyUniqueName: reqParam.companyUniqueName, fy: reqParam.fy}, onSuccess, onFailure));
    },

    getPL(reqParam, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => trialBal.getPL({companyUniqueName: reqParam.companyUniqueName, refresh: reqParam.refresh, fy: reqParam.fy}, onSuccess,
        onFailure) );
    },

    downloadPLExcel(reqParam, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => profitLoss.downloadPLExcel({companyUniqueName: reqParam.companyUniqueName, fy: reqParam.fy}, onSuccess, onFailure));
    },

    downloadTBExcel(reqParam, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => trialBal.downloadTBExcel({companyUniqueName: reqParam.companyUniqueName, fromDate: reqParam.fromDate, toDate: reqParam.toDate, exportType: reqParam.exportType, q: reqParam.query}, onSuccess, onFailure));
    }
  };

  return trialBalService;
});