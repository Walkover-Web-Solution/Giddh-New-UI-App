giddh.serviceModule.service('currencyService', function($resource) {
  let currencyGetResource = $resource('/currency', {}, {
    currencyList: {method: 'GET'}
  });

  let currencyService = {
    getList(onSuccess, onFailure) {
      return currencyGetResource.currencyList(onSuccess, onFailure);
    }
  };

  return currencyService;
});