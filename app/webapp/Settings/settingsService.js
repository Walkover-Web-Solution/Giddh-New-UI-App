import { electronUrl, webUrl } from '../app.constants';
   let getUrl = (urlKey) => {
        if (isElectron) {
            return electronUrl.setService[urlKey];
        } else {
            return webUrl.setService[urlKey];
        }
    }

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
        url: getUrl('save')
      },
      update: {
        method: 'PUT',
        url: getUrl('update')
      },
      getAllTemplates: {
        method: 'GET',
        url: getUrl('getAllTemplates')
      },
      getTemplate: {
        method: 'GET',
        url: getUrl('getUrl')
      },
      deleteTemplate: {
        method: 'DELETE',
        url: getUrl('deleteTemplate')
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
