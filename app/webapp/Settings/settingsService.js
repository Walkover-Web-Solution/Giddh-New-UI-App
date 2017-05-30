giddh.serviceModule.service('settingsService', function($resource, $q) {
  let setService = $resource('/company/:companyUniqueName/templates',
    {
      'companyUniqueName': this.companyUniqueName,
      'templateUniqueName': this.templateUniqueName,
      'operation': this.operation
    },
    {
      save: {
        method: 'POST',
        url: '/company/:companyUniqueName/templates'
      },
      update: {
        method: 'PUT',
        url: '/company/:companyUniqueName/templates/update/:templateUniqueName'
      },
      getAllTemplates: {
        method: 'GET',
        url: '/company/:companyUniqueName/templates/all'
      },
      getTemplate: {
        method: 'GET',
        url: '/company/:companyUniqueName/templates/:templateUniqueName?operation=:operation'
      },
      deleteTemplate: {
        method: 'DELETE',
        url: '/company/:companyUniqueName/templates/:templateUniqueName'
      }
    });

  let settingsService = {
    handlePromise(func) {
      let deferred = $q.defer();
      let onSuccess = data=> deferred.resolve(data);
      let onFailure = data=> deferred.reject(data);
      func(onSuccess, onFailure);
      return deferred.promise;
    },

    save(reqParam,data) {
      return this.handlePromise((onSuccess, onFailure) => setService.save({companyUniqueName: reqParam.companyUniqueName},data, onSuccess,
        onFailure) );
    },

    update(reqParam, data) {
      return this.handlePromise((onSuccess, onFailure) => setService.update({
            companyUniqueName: reqParam.companyUniqueName,
            templateUniqueName: reqParam.templateUniqueName,
            operation: reqParam.operation}
        ,data,onSuccess,onFailure) );
    },

    getAllTemplates(reqParam) {
      return this.handlePromise((onSuccess, onFailure) => setService.getAllTemplates({companyUniqueName: reqParam.companyUniqueName},onSuccess,
        onFailure) );
    },

    getTemplate(reqParam) {
      return this.handlePromise((onSuccess, onFailure) => setService.getTemplate({
            companyUniqueName: reqParam.companyUniqueName,
            templateUniqueName: reqParam.templateUniqueName,
            operation: reqParam.operation}
      ,onSuccess,onFailure) );
    },

    deleteTemplate(reqParam) {
      return this.handlePromise((onSuccess, onFailure) => setService.deleteTemplate({
            companyUniqueName: reqParam.companyUniqueName,
            templateUniqueName: reqParam.templateUniqueName}
      ,onSuccess,onFailure) );
    }
  };

  return settingsService;
});
