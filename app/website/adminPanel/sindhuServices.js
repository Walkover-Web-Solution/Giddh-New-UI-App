adminPanel.service('sindhuServices', function($resource, $q) {
  let sindhu = $resource('/sindhu',
      {
        'uniqueName': this.uniqueName,
        'companyUniqueName' : this.companyUniqueName
      },{
        getCompanyList:{
          method: 'GET',
          url: '/admin/:uniqueName'
        }
      }
  );
  let sindhuServices = {
    handlePromise(func) {
      let deferred = $q.defer();
      let onSuccess = data=> deferred.resolve(data);
      let onFailure = data=> deferred.reject(data);
      func(onSuccess, onFailure);
      return deferred.promise;
    }
  };

  return sindhuServices;
});