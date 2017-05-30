giddh.serviceModule.service('reportService', function($resource, $q) {
  let Report = $resource('/company/:companyUniqueName/history',
    {
      'companyUniqueName': this.companyUniqueName,
      'date1': this.date1,
      'date2': this.date2,
      'interval': this.interval,
      'refresh': this.refresh
    },
    {
      historicData: {
        method: 'POST',
        url: '/company/:companyUniqueName/history?fromDate=:date1&toDate=:date2&interval=:interval'
      },
      newHistoricData: {
        method: 'POST',
        url: '/company/:companyUniqueName/group-history?fromDate=:date1&toDate=:date2&interval=:interval&refresh=:refresh'
      },
      plHistoricData: {
        method: 'GET',
        url: '/company/:companyUniqueName/profit-loss-history?fromDate=:date1&toDate=:date2&interval=:interval'
      },
      profitLossData: {
        method: 'GET',
        url: '/company/:companyUniqueName/profit-loss?fromDate=:date1&toDate=:date2&interval=:interval'
      },
      nwHistoricData: {
        method: 'GET',
        url: '/company/:companyUniqueName/networth-history?fromDate=:date1&toDate=:date2&interval=:interval'
      },
      networthData: {
        method: 'GET',
        url: '/company/:companyUniqueName/networth?fromDate=:date1&toDate=:date2&interval=:interval'
      },
      combinedData:{
        method: 'GET',
        url: '/company/:companyUniqueName/dashboard?fromDate=:date1&toDate=:date2&interval=:interval'
      }
      // historicData: {
      //   method: 'PUT'
      //   url: '/company/:companyUniqueName/'
      // }
    });
  let reportService = {
    handlePromise(func) {
      let deferred = $q.defer();
      let onSuccess = data=> deferred.resolve(data);
      let onFailure = data=> deferred.reject(data);
      func(onSuccess, onFailure);
      return deferred.promise;
    },

    historicData(argData, data, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => Report.historicData({
        companyUniqueName: argData.cUname,
        date1: argData.fromDate,
        date2: argData.toDate,
        interval: argData.interval
      }, data, onSuccess,  onFailure) );
    },

    newHistoricData(argData, data, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => Report.newHistoricData({
        companyUniqueName: argData.cUname,
        date1: argData.fromDate,
        date2: argData.toDate,
        interval: argData.interval,
        refresh: argData.refresh
      }, data, onSuccess,  onFailure) );
    },

    plGraphData(argData, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => Report.plHistoricData({
        companyUniqueName: argData.cUname,
        date1: argData.fromDate,
        date2: argData.toDate,
        interval: argData.interval
      }, onSuccess,  onFailure) );
    },

    profitLossData(argData, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => Report.profitLossData({
        companyUniqueName: argData.cUname,
        date1: argData.fromDate,
        date2: argData.toDate,
        interval: argData.interval
      }, onSuccess,  onFailure) );
    },

    nwGraphData(argData, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => Report.nwHistoricData({
        companyUniqueName: argData.cUname,
        date1: argData.fromDate,
        date2: argData.toDate,
        interval: argData.interval
      }, onSuccess,  onFailure) );
    },

    networthData(argData, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => Report.networthData({
        companyUniqueName: argData.cUname,
        date1: argData.fromDate,
        date2: argData.toDate,
        interval: argData.interval
      }, onSuccess,  onFailure) );
    },

    networthNprofitloss(argData, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => Report.combinedData({
        companyUniqueName: argData.cUname,
        date1: argData.fromDate,
        date2: argData.toDate,
        interval: argData.interval,
        refresh: argData.refresh
      }, onSuccess,  onFailure) );
    }
  };

  return reportService;
});