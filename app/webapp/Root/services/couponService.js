giddh.serviceModule.service('couponServices', function($resource, $q) {
  let Coupon = $resource('/', 
    {
      'code': this.code
    },
    {
      Detail: {
        method: 'GET',
        url: '/coupon/get-coupon'
      }
    }
  );
  let couponServices = {
    handlePromise(func) {
      let deferred = $q.defer();
      let onSuccess = data=> deferred.resolve(data);
      let onFailure = data=> deferred.reject(data);
      func(onSuccess, onFailure);
      return deferred.promise;
    },

    couponDetail(code) {
      return this.handlePromise((onSuccess, onFailure) => Coupon.Detail({
        code
      }, onSuccess, onFailure) );
    }
  };

  return couponServices;
});