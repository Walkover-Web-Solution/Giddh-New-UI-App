import { electronUrl, webUrl } from '../app.constants';
let getUrl = (urlKey) => {
    if (isElectron) {
        return electronUrl.Inventory[urlKey];
    } else {
        return webUrl.Inventory[urlKey]
    }
  }

angular.module('inventoryServices', [])
	.service('stockService', ['$resource', '$q', function($resource, $q){
		var stock = $resource('/company/:companyUniqueName/stock-group', {
			'companyUniqueName': this.companyUniqueName,
			'stockGroupUniqueName' : this.stockGroupUniqueName,
			'stockUniqueName': this.stockUniqueName,
			'q': this.q,
			'page': this.page,
			'count': this.count,
			'from' :this.from,
			'to': this.to,
			'uName': this.uName
		},
		{
			get: {
				method: 'GET',
				url: getUrl('get')
			},
			getHeirarchy: {
				method: 'GET',
				url: getUrl('getHeirarchy')
			},
			addGroup: {
				method: 'POST',
				url: getUrl('addGroup')
			},
			updateGroup: {
				method: 'PUT',
				url: getUrl('updateGroup')
			},
			getStockGroups: {
				method: 'GET',
				url: getUrl('getStockGroups')
			},
			createStock: {
				method: 'POST',
				url: getUrl('createStock')
			},
			deleteStock: {
				method: 'DELETE',
				url: getUrl('deleteStock')
			},
			updateStockItem: {
				method: 'PUT',
				url: getUrl('updateStockItem')
			},
			getAllStocks: {
				method: 'GET',
				url: getUrl('getAllStocks')
			},
			getStockDetail: {
				method: 'GET',
				url: getUrl('getStockDetail')
			},
			getStockType: {
				method: 'GET',
				url: getUrl('getStockType')
			},
			createStockUnit: {
				method: 'POST',
				url: getUrl('createStockUnit')
			},
			updateStockUnit: {
				method: 'PUT',
				url: getUrl('updateStockUnit')
			},
			deleteStockUnit: {
				method: 'DELETE',
				url: getUrl('deleteStockUnit')
			},
			getFilteredStockGroups: {
				method: 'GET',
				url: getUrl('getFilteredStockGroups')
			},
			getStockItemDetails: {
				method: 'GET',
				url: getUrl('getStockItemDetails')
			},
			getStockReport: {
				method: 'GET',
				url: getUrl('getStockReport')
			},
			deleteStockGrp: {
				method: 'DELETE',
				url: getUrl('deleteStockGrp')
			}

		})

		var stockService = {
			handlePromise: function(func) {
	      var deferred, onFailure, onSuccess;
	      deferred = $q.defer();
	      onSuccess = function(data) {
	        return deferred.resolve(data);
	      };
	      onFailure = function(data) {
	        return deferred.reject(data);
	      };
	      func(onSuccess, onFailure);
	      return deferred.promise;
	    },

	    getStockGroupsFlatten: function(reqParam){
	    	return this.handlePromise(function(onSuccess, onFailure){
	    		return stock.get({
	    			companyUniqueName: reqParam.companyUniqueName,
	    			page:reqParam.page,
	    			q:reqParam.q,
	    			count:reqParam.count
	    		}, onSuccess, onFailure)
	    	})
	    },

			getStockGroupsHeirarchy: function(reqParam){
	    	return this.handlePromise(function(onSuccess, onFailure){
	    		return stock.getHeirarchy({
	    			companyUniqueName: reqParam.companyUniqueName
	    		}, onSuccess, onFailure)
	    	})
	    },

	    addGroup: function(reqParam, data){
	    	return this.handlePromise(function(onSuccess, onFailure){
	    		return stock.addGroup({
	    			companyUniqueName: reqParam.companyUniqueName
	    		}, data,  onSuccess, onFailure)
	    	})
	    },

	    updateStockGroup: function(reqParam, data){
	    	return this.handlePromise(function(onSuccess, onFailure){
	    		return stock.updateGroup({
	    			companyUniqueName: reqParam.companyUniqueName,
	    			stockGroupUniqueName: reqParam.stockGroupUniqueName
	    		}, data,  onSuccess, onFailure)
	    	})
	    },

	    getStockGroups: function(reqParam){
	    	return this.handlePromise(function(onSuccess, onFailure){
	    		return stock.getStockGroups({
	    			companyUniqueName: reqParam.companyUniqueName,
	    			stockGroupUniqueName: reqParam.stockGroupUniqueName
	    		}, onSuccess, onFailure)
	    	})
	    },

	    createStock: function(reqParam, data){
	    	return this.handlePromise(function(onSuccess, onFailure){
	    		return stock.createStock({
	    			companyUniqueName: reqParam.companyUniqueName,
	    			stockGroupUniqueName: reqParam.stockGroupUniqueName
	    		}, data,  onSuccess, onFailure)
	    	})
	    },

	    deleteStock: function(reqParam){
	    	return this.handlePromise(function(onSuccess, onFailure){
	    		return stock.deleteStock(reqParam, onSuccess, onFailure)
	    	})
	    },

	    updateStockItem: function(reqParam, data){
	    	return this.handlePromise(function(onSuccess, onFailure){
	    		return stock.updateStockItem({
	    			companyUniqueName: reqParam.companyUniqueName,
	    			stockGroupUniqueName: reqParam.stockGroupUniqueName,
	    			stockUniqueName: reqParam.stockUniqueName
	    		}, data,  onSuccess, onFailure)
	    	})
	    },

	    getAllStocks: function(reqParam){
	    	return this.handlePromise(function(onSuccess, onFailure){
	    		return stock.getAllStocks({
	    			companyUniqueName: reqParam.companyUniqueName,
	    			q: reqParam.q,
	    			page:reqParam.page,
	    			count:reqParam.count
	    		}, onSuccess, onFailure)
	    	})
	    },

	    getStockDetail: function(reqParam){
	    	return this.handlePromise(function(onSuccess, onFailure){
	    		return stock.getStockDetail({
	    			companyUniqueName: reqParam.companyUniqueName,
	    			stockGroupUniqueName: reqParam.stockGroupUniqueName
	    		}, onSuccess, onFailure)
	    	})
	    },


	    getFilteredStockGroups: function(reqParam){
	    	return this.handlePromise(function(onSuccess, onFailure){
	    		return stock.getFilteredStockGroups({
	    			companyUniqueName: reqParam.companyUniqueName,
	    			q: reqParam.q,
	    			page:reqParam.page,
	    			count:reqParam.count
	    		}, onSuccess, onFailure)
	    	})
	    },

	    getStockItemDetails: function(reqParam){
	    	return this.handlePromise(function(onSuccess, onFailure){
	    		return stock.getStockItemDetails({
	    			companyUniqueName: reqParam.companyUniqueName,
	    			stockGroupUniqueName : reqParam.stockGroupUniqueName,
	    			stockUniqueName: reqParam.stockUniqueName
	    		}, onSuccess, onFailure)
	    	})
	    },

	    getStockReport: function(reqParam){
	    	return this.handlePromise(function(onSuccess, onFailure){
	    		return stock.getStockReport(reqParam, onSuccess, onFailure)
	    	})
	    },
	    deleteStockGrp: function(reqParam){
	    	return this.handlePromise(function(onSuccess, onFailure){
	    		return stock.deleteStockGrp({
	    			companyUniqueName: reqParam.companyUniqueName,
	    			stockGroupUniqueName : reqParam.stockGroupUniqueName
	    		}, onSuccess, onFailure)
	    	})
	    },

	    getStockUnits: function(reqParam){
	    	return this.handlePromise(function(onSuccess, onFailure){
	    		return stock.getStockType({
	    			companyUniqueName: reqParam.companyUniqueName
	    		}, onSuccess, onFailure)
	    	})
	    },

	    createStockUnit: function(reqParam, data){
	    	return this.handlePromise(function(onSuccess, onFailure){
	    		return stock.createStockUnit({
	    			companyUniqueName: reqParam.companyUniqueName
	    		}, data, onSuccess, onFailure)
	    	})
	    },

	    updateStockUnit: function(reqParam, data){
	    	return this.handlePromise(function(onSuccess, onFailure){
	    		return stock.updateStockUnit({
	    			companyUniqueName: reqParam.companyUniqueName
	    		}, data, onSuccess, onFailure)
	    	})
	    },

	    deleteStockUnit: function(reqParam){
	    	return this.handlePromise(function(onSuccess, onFailure){
	    		return stock.deleteStockUnit(reqParam, onSuccess, onFailure)
	    	})
	    }

		}
		return stockService
}])

