// confirm modal settings
giddh.serviceModule.value('$confirmModalDefaults', {
  templateUrl: 'public/webapp/Globals/modals/confirmModal.html',
  controller: 'ConfirmModalController',
  defaultLabels: {
    title: 'Confirm',
    ok: 'OK',
    cancel: 'Cancel'
  }
});
giddh.serviceModule.service('modalService',
  function($uibModal, $confirmModalDefaults, $rootScope) {
    let $scope = $rootScope.$new();
    let modalService = {
      openConfirmModal(data, settings) {
        settings = angular.extend($confirmModalDefaults, settings || {});
        data = angular.extend({}, settings.defaultLabels, data || {});
        if ('templateUrl' in settings && 'template' in settings) {
          delete settings.template;
        }
        settings.resolve = {
          data() {
            return data;
          }
        };
        return $uibModal.open(settings).result;
      },

      openManageGroupsModal() {
        return $uibModal.open({
          templateUrl: 'public/webapp/Globals/ManageGroupsAndAccounts/addManageGroupModal.html',
          size: "liq90",
          backdrop: 'static',
          scope: $scope
        });
      },
      openImportListModal(data, showImportListData) {
        return $uibModal.open({
          templateUrl: 'public/webapp/Globals/modals/openImportListModal.html',
          size: "md",
          backdrop: 'static'
        });
      }
    };
    return modalService;
});