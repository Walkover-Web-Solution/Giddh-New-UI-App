import { electronUrl, webUrl } from '../app.constants';
let getUrl = (urlKey) => {
        if (isElectron) {
            return electronUrl.recEntry[urlKey];
        } else {
            return webUrl.recEntry[urlKey];
        }
    }
angular.module('recurringEntryService', [])

.service('recurringEntryService',function($resource, $q){
	var recEntry = $resource('/company/:companyUniqueName/recurring-entry', {
		'companyUniqueName': this.companyUniqueName,
		'accountUniqueName': this.accountUniqueName,
		'q': this.q,
		'page': this.page,
		'count': this.count,
		'from' :this.from,
		'to': this.to,
		'recurringentryUniqueName': this.recurringentryUniqueName
	},
	{
		create: {
			method: 'POST',
			url: getUrl('create')
		},
		get:{
			method: 'GET',
			url: getUrl('get')
		},
		getDuration:{
			method: 'GET',
			url: getUrl('getDuration')
		},
		update: {
			method: 'PUT',
			url: getUrl('update')
		},
		delete:{
			method: 'DELETE',
			url: getUrl('delete')
		}
	})
	var recurringEntryService = {
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

	    createReccuringEntry: function(reqParam, data){
	    	return this.handlePromise(function(onSuccess, onFailure){
	    		return recEntry.create({
	    			companyUniqueName: reqParam.companyUniqueName,
	    			accountUniqueName: reqParam.accountUniqueName
	    		}, data, onSuccess, onFailure)

	    	})
	    },
	    getEntries: function(reqParam, data){
	    	return this.handlePromise(function(onSuccess, onFailure){
	    		return recEntry.get({
	    			companyUniqueName: reqParam.companyUniqueName
	    		}, onSuccess, onFailure)
	    	})
	    },
	    getDuration: function(reqParam, data){
	    	return this.handlePromise(function(onSuccess, onFailure){
	    		return recEntry.getDuration({
	    			companyUniqueName: reqParam.companyUniqueName
	    		}, onSuccess, onFailure)
	    	})
	    },
	    update: function(reqParam, data){
	    	return this.handlePromise(function(onSuccess, onFailure){
	    		return recEntry.update({
	    			companyUniqueName: reqParam.companyUniqueName,
	    			accountUniqueName: reqParam.accountUniqueName,
	    			recurringentryUniqueName: reqParam.recurringentryUniqueName
	    		}, data, onSuccess, onFailure)

	    	})
	    },
	    delete: function(reqParam, data){
	    	return this.handlePromise(function(onSuccess, onFailure){
	    		return recEntry.delete({
	    			companyUniqueName: reqParam.companyUniqueName,
	    			accountUniqueName: reqParam.accountUniqueName,
	    			recurringentryUniqueName: reqParam.recurringentryUniqueName
	    		}, data, onSuccess, onFailure)

	    	})
	    }
	}



	return recurringEntryService;

})