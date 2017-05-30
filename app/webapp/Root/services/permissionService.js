giddh.serviceModule.service('permissionService', function(localStorageService) {
  let permissionService = {
    hasPermissionOn(entity, permissionCode) {
      let roles = localStorageService.get("_roles");
      if(_.isUndefined(roles) || _.isEmpty(roles)) {
        return false;
      }
      let role = _.find(roles, role => role.uniqueName === entity.role.uniqueName);
      if(_.isUndefined(role) || _.isEmpty(role)) {
        return false;
      }
      return _.some(role.permissions, permission => permission.code === permissionCode);
    },

    shareableRoles(selectedCompany) {
      let allowableRoles;
      let roles = localStorageService.get("_roles");
      let roleOnCompany = _.find(roles, role => role.uniqueName === selectedCompany.role.uniqueName);
      return allowableRoles = _.filter(roles, role =>
        _.every(role.permissions, permission => _.contains((_.pluck(roleOnCompany.permissions, 'code')), permission.code))
      );
    }
  };

  return permissionService;
});