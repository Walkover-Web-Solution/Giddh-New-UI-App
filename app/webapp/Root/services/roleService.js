giddh.serviceModule.service('roleServices', function($resource, $q) {
  let Role = $resource('/roles', {},
    {
      all: {
        method: 'GET'
      },
      getEnvVar:{
        method: 'GET',
        url: '/roles/getEnvVars'
      }
    }
  );
  let roleServices = {
    handlePromise(func) {
      let deferred = $q.defer();
      let onSuccess = data=> deferred.resolve(data);
      let onFailure = data=> deferred.reject(data);
      func(onSuccess, onFailure);
      return deferred.promise;
    },

    getAll() {
      return this.handlePromise((onSuccess,  onFailure) => Role.all(onSuccess, onFailure));
    },

    getEnvVars() {
      return this.handlePromise((onSuccess, onFailure) => Role.getEnvVar(onSuccess, onFailure));
    }
  };

  return roleServices;
});