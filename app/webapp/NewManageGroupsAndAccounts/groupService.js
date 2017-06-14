giddh.serviceModule.service('groupService', function($resource, $q) {
  let Group = $resource('/company/:companyUniqueName/groups',
    {
      'companyUniqueName': this.companyUniqueName,
      'groupUniqueName': this.groupUniqueName,
      'date1': this.date1,
      'date2': this.date2,
      'q':this.q,
      'page':this.page,
      'count':this.count,
      'refressh':this.refresh,
      'showEmptyGroups':this.showEmptyGroups
    },
    {
      add: {
        method: 'POST'
      },
      getAll: {
        method: 'GET'
      },
      getAllWithAccounts: {
        method: 'GET',
        url: '/company/:companyUniqueName/groups/with-accounts'
      },
       getAllWithAccountsElectron: {
        method: 'GET',
        url: '/company/:companyUniqueName/groups-with-accounts'
      },
      getAllInDetail: {
        method: 'GET',
        url: '/company/:companyUniqueName/groups/detailed-groups'
      },
      getAllWithAccountsInDetail: {
        method: 'GET',
        url: '/company/:companyUniqueName/groups/detailed-groups-with-accounts'
      },
      getFlattenGrpWithAcc: {
        method: 'GET',
        url: '/company/:companyUniqueName/groups/flatten-groups-accounts?q=:q&page=:page&count=:count&showEmptyGroups=:showEmptyGroups'
      },
      getFlattenGrpWithAccElectron: {
        method: 'GET',
        url: '/company/:companyUniqueName/flatten-groups-with-accounts',
        params: {
            q: '@q',
            page: '@page',
            count: '@count',
            showEmptyGroups: '@showEmptyGroups'
        }
      },
      getFlatAccList: {
        method: 'GET',
        url: '/company/:companyUniqueName/groups/flatten-accounts'
      },
      getFlatAccListElectron: {
        method: 'GET',
        url: '/company/:companyUniqueName/flatten-accounts',
        params: {
            q: '@q',
            page: '@page',
            count: '@count'
        }
      },
      postFlatAccList:{
        method: 'POST',
        url: '/company/:companyUniqueName/groups/flatten-accounts'
      },
      update: {
        method: 'PUT',
        url: '/company/:companyUniqueName/groups/:groupUniqueName'
      },
      delete: {
        method: 'DELETE',
        url: '/company/:companyUniqueName/groups/:groupUniqueName'
      },
      get: {
        method: 'GET',
        url: '/company/:companyUniqueName/groups/:groupUniqueName'
      },
      move: {
        method: 'PUT',
        url: '/company/:companyUniqueName/groups/:groupUniqueName/move'
      },
      share: {
        method: 'PUT',
        url: '/company/:companyUniqueName/groups/:groupUniqueName/share'
      },
      unshare: {
        method: 'PUT',
        url: '/company/:companyUniqueName/groups/:groupUniqueName/unshare'
      },
      sharedWith: {
        method: 'GET',
        url: '/company/:companyUniqueName/groups/:groupUniqueName/shared-with'
      },
      getUserList: {
        method: 'GET',
        url: '/company/:companyUniqueName/users'
      },
      getClosingBal: {
        method: 'GET',
        url: '/company/:companyUniqueName/groups/:groupUniqueName/closing-balance?fromDate=:date1&toDate=:date2&refresh=:refresh'
      },
      getClosingBalElectron: {
        method: 'GET',
        url: '/company/:companyUniqueName/groups/:groupUniqueName/closing-balance',
        params: {
            from: '@date1',
            to: '@date2',
            refresh: '@refresh'
        }
      },
      deleteLogs: {
        method: 'DELETE',
        url: '/company/:companyUniqueName/logs/:beforeDate'
      },
      getSubgroups: {
        method: 'GET',
        url: '/company/:companyUniqueName/groups/:groupUniqueName/subgroups-with-accounts'
      },
      getMultipleSubGroups:{
        method:'POST',
        url: '/company/:companyUniqueName/subgroups-with-accounts'
      },
      getTaxHierarchy:{
        method:'GET',
        url:'/company/:companyUniqueName/groups/:groupUniqueName/tax-hierarchy'
      }
    });

  var groupService = {
    handlePromise(func) {
      let deferred = $q.defer();
      let onSuccess = data=> deferred.resolve(data);
      let onFailure = data=> deferred.reject(data);
      func(onSuccess, onFailure);
      return deferred.promise;
    },

    create(companyUniqueName, data, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => Group.add({companyUniqueName}, data, onSuccess,
        onFailure) );
    },

//   All groups with full detail, without account
    getGroupsWithoutAccountsInDetail(companyUniqueName, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => Group.getAllInDetail({companyUniqueName}, onSuccess,
        onFailure) );
    },

//   All groups with full detail, with account
    getGroupsWithAccountsInDetail(companyUniqueName, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => Group.getAllWithAccountsInDetail({companyUniqueName},
        onSuccess, onFailure) );
    },

//   All groups with less detail, without account
    getGroupsWithoutAccountsCropped(companyUniqueName, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => Group.getAll({companyUniqueName}, onSuccess,
        onFailure) );
    },

//   All groups with less detail, with account
    getGroupsWithAccountsCropped(companyUniqueName, onSuccess, onFailure) {
      if (!isElectron) {
        return this.handlePromise((onSuccess, onFailure) => Group.getAllWithAccounts({companyUniqueName},
            onSuccess, onFailure) );
      } else {
          return this.handlePromise((onSuccess, onFailure) => Group.getAllWithAccountsElectron({companyUniqueName},
            onSuccess, onFailure) );
      }
    },

//   search groups with accounts
    searchGroupsWithAccountsCropped(reqParam, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => Group.getAllWithAccounts({companyUniqueName: reqParam.companyUniqueName, q:reqParam.query},
        onSuccess, onFailure) );
    },

//   Get flatten groups with accounts list
    getFlattenGroupAccList(reqParam, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => Group.getFlattenGrpWithAcc({companyUniqueName: reqParam.companyUniqueName, q:reqParam.q, page:reqParam.page, count:reqParam.count, showEmptyGroups:reqParam.showEmptyGroups},
        onSuccess, onFailure) );
    },

    //   Get flatten groups with accounts list with electron
    getFlattenGroupAccListElectron(reqParam, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => Group.getFlattenGrpWithAccElectron({companyUniqueName: reqParam.companyUniqueName, q:reqParam.q, page:reqParam.page, count:reqParam.count, showEmptyGroups:reqParam.showEmptyGroups},
        onSuccess, onFailure) );
    },

//   Get sub goups with accounts
    getSubgroupsWithAccounts(reqParam, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => Group.getSubgroups({
            companyUniqueName: reqParam.companyUniqueName,
            groupUniqueName:reqParam.groupUniqueName
          },onSuccess, onFailure) );
    },

    getMultipleSubGroups(reqParam,data, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => Group.getMultipleSubGroups({
        companyUniqueName: reqParam.companyUniqueName
      },data,onSuccess, onFailure) );
    },

//   Get flat accounts list
    getFlatAccList(reqParam, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => Group.getFlatAccList({companyUniqueName: reqParam.companyUniqueName, q:reqParam.q, page:reqParam.page, count:reqParam.count},
        onSuccess, onFailure) );
    },

    //   Get flat accounts list Electron
    getFlatAccListElectron(reqParam, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => Group.getFlatAccListElectron({companyUniqueName: reqParam.companyUniqueName, q:reqParam.q, page:reqParam.page, count:reqParam.count},
        onSuccess, onFailure) );
    },

    postFlatAccList(reqParam, data, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => Group.postFlatAccList({
            companyUniqueName: reqParam.companyUniqueName,
            q:reqParam.q,
            page:reqParam.page,
            count:reqParam.count
          },data, onSuccess, onFailure) );
    },

    update(companyUniqueName, group) {
      return this.handlePromise((onSuccess, onFailure) => Group.update({
        companyUniqueName,
        groupUniqueName: group.oldUName
      }, group, onSuccess, onFailure) );
    },

    get(companyUniqueName, groupUniqueName, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => Group.get({
        companyUniqueName,
        groupUniqueName
      }, onSuccess, onFailure) );
    },

    delete(companyUniqueName, group, onSuccess, onFailure) {
      return this.handlePromise((onSuccess, onFailure) => Group.delete({
        companyUniqueName,
        groupUniqueName: group.uniqueName
      }, onSuccess, onFailure) );
    },

    move(unqNamesObj, data) {
      return this.handlePromise((onSuccess, onFailure) => Group.move({
        companyUniqueName: unqNamesObj.compUname,
        groupUniqueName: unqNamesObj.selGrpUname
      }, data, onSuccess, onFailure) );
    },

    share(unqNamesObj, data) {
      return this.handlePromise((onSuccess, onFailure) => Group.share({
        companyUniqueName: unqNamesObj.compUname,
        groupUniqueName: unqNamesObj.selGrpUname
      }, data, onSuccess, onFailure) );
    },

    unshare(unqNamesObj, data) {
      return this.handlePromise((onSuccess, onFailure) => Group.unshare({
        companyUniqueName: unqNamesObj.compUname,
        groupUniqueName: unqNamesObj.selGrpUname
      }, data, onSuccess, onFailure) );
    },

    sharedList(unqNamesObj, data) {
      return this.handlePromise((onSuccess, onFailure) => Group.sharedWith({
        companyUniqueName: unqNamesObj.compUname,
        groupUniqueName: unqNamesObj.selGrpUname
      }, onSuccess, onFailure) );
    },

    getClosingBal(obj) {
      if (!isElectron) {
        return this.handlePromise((onSuccess, onFailure) => Group.getClosingBal({
            companyUniqueName: obj.compUname,
            groupUniqueName: obj.selGrpUname,
            date1: obj.fromDate,
            date2: obj.toDate,
            refresh: obj.refresh
        }, onSuccess, onFailure) );
      } else {
          return this.handlePromise((onSuccess, onFailure) => Group.getClosingBalElectron({
            companyUniqueName: obj.compUname,
            groupUniqueName: obj.selGrpUname,
            from: obj.fromDate,
            to: obj.toDate,
            refresh: obj.refresh
        }, onSuccess, onFailure) );
      }
    },

    matchAndReturnObj(src, dest){
      return _.find(dest, key=> key.uniqueName === src.groupUniqueName);
    },

    matchAndReturnGroupObj(src, dest){
      return _.find(dest, key=> key.uniqueName === src.uniqueName);
    },

    makeGroupListFlatwithLessDtl(rawList) {
      var obj = _.map(rawList, function(item) {
        obj = {};
        obj.name = item.name;
        obj.uniqueName = item.uniqueName;
        obj.synonyms = item.synonyms;
        obj.parentGroups = item.parentGroups;
        return obj;
      });
      return obj;
    },

    makeAcListWithLessDtl(rawList) {
      var obj = _.map(rawList, function(item) {
        obj = {};
        obj.name = item.name;
        obj.uniqueName = item.uniqueName;
        obj.mergedAccounts = item.mergedAccounts;
        obj.parentGroups = item.parentGroups;
        return obj;
      });
      return obj;
    },

    flattenGroup(rawList, parents) {
      let listofUN = _.map(rawList, function(listItem) {
        let result;
        let newParents = _.union([], parents);
        newParents.push({name: listItem.name, uniqueName: listItem.uniqueName});
        listItem.parentGroups = newParents;
        if (listItem.groups.length > 0) {
          result = groupService.flattenGroup(listItem.groups, newParents);
          result.push(_.omit(listItem, "groups"));
        } else {
          result = _.omit(listItem, "groups");
        }
        return result;
      });
      return _.flatten(listofUN);
    },

    flattenGroupsWithAccounts(groupList) {
      let listGA = _.map(groupList, function(groupItem) {
        if (groupItem.accounts.length > 0) {
          let addThisGroup = {};
          addThisGroup.open = false;
          addThisGroup.groupName = groupItem.name;
          addThisGroup.groupUniqueName = groupItem.uniqueName;
          addThisGroup.accountDetails = groupItem.accounts;
          addThisGroup.beforeFilter = groupItem.accounts;
          addThisGroup.groupSynonyms = groupItem.synonyms;
          return addThisGroup;
        }
      });
      return _.without(_.flatten(listGA), undefined);
    },

    flattenGroupsAndAccounts(groupList) {
      let listGA = _.map(groupList, function(groupItem) {
        let addThisGroup = {};
        addThisGroup.open = false;
        addThisGroup.groupName = groupItem.name;
        addThisGroup.groupUniqueName = groupItem.uniqueName;
        addThisGroup.accountDetails = groupItem.accounts;
        addThisGroup.beforeFilter = groupItem.accounts;
        addThisGroup.groupSynonyms = groupItem.synonyms;
        return addThisGroup;
      });
      return _.without(_.flatten(listGA), undefined);
    },

    flattenAccount(list) {
      let listofUN = _.map(list, function(listItem) {
        if (listItem.groups.length > 0) {
          let uniqueList = groupService.flattenAccount(listItem.groups);
          _.each(listItem.accounts, function(accntItem) {
            if (_.isUndefined(accntItem.parentGroups)) {
              return accntItem.parentGroups = [{name: listItem.name, uniqueName: listItem.uniqueName}];
            } else {
              return accntItem.parentGroups.push({name: listItem.name, uniqueName: listItem.uniqueName});
            }
          });
          uniqueList.push(listItem.accounts);
          _.each(uniqueList, function(accntItem) {
            if (_.isUndefined(accntItem.parentGroups)) {
              return accntItem.parentGroups = [{name: listItem.name, uniqueName: listItem.uniqueName}];
            } else {
              return accntItem.parentGroups.push({name: listItem.name, uniqueName: listItem.uniqueName});
            }
          });
          return uniqueList;
        } else {
          _.each(listItem.accounts, function(accntItem) {
            if (_.isUndefined(accntItem.parentGroups)) {
              return accntItem.parentGroups = [{name: listItem.name, uniqueName: listItem.uniqueName}];
            } else {
              return accntItem.parentGroups.push({name: listItem.name, uniqueName: listItem.uniqueName});
            }
          });
          return listItem.accounts;
        }
      });
      return _.flatten(listofUN);
    },


    flattenSearchGroupsAndAccounts(rawList) {
      let listofUN = _.map(rawList, function(obj) {
        if (!(_.isNull(obj.childGroups)) && (obj.childGroups.length > 0)) {
          let uniqueList = groupService.flattenSearchGroupsAndAccounts(obj.childGroups);
          _.each(obj.accounts, function(account){
            account.parent = obj.groupName;
            account.closeBalType = account.closingBalance.type;
            account.closingBalance = account.closingBalance.amount;
            account.openBalType = account.openingBalance.type;
            return account.openingBalance = account.openingBalance.amount;
          });
          uniqueList.push(obj.accounts);
          return uniqueList;
        } else {
          _.each(obj.accounts, function(account){
            account.parent = obj.groupName;
            account.closeBalType = account.closingBalance.type;
            account.closingBalance = account.closingBalance.amount;
            account.openBalType = account.openingBalance.type;
            return account.openingBalance = account.openingBalance.amount;
          });
          return obj.accounts;
        }
      });
      return _.flatten(listofUN);
    },

    getUserList(unqNamesObj) {
      return this.handlePromise((onSuccess, onFailure) => Group.getUserList({
        companyUniqueName: unqNamesObj.compUname
      }, onSuccess, onFailure) );
    },

    deleteLogs(reqParam, onSuccess, onFailure) {
      console.log(reqParam);
      return this.handlePromise((onSuccess, onFailure) => Group.deleteLogs({
        companyUniqueName: reqParam.companyUniqueName,
        beforeDate: reqParam.beforeDate
      }, onSuccess, onFailure) );
    },

    getTaxHierarchy(companyUniqueName, groupUniqueName) {
      return this.handlePromise((onSuccess, onFailure) => Group.getTaxHierarchy({
        companyUniqueName,
        groupUniqueName
      }, onSuccess, onFailure) );
    }
  };

  return groupService;
});