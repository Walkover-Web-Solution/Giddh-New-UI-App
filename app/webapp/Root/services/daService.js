giddh.serviceModule.service('DAServices', function($resource, $q) {
  let ledgerData = {};
  let ledgerAccount = {};

  let DAServices = {
    LedgerGet() {
      return {"ledgerData": ledgerData, "selectedAccount": ledgerAccount};
    },

    LedgerSet(data, account) {
      ledgerData = data;
      return ledgerAccount = account;
    },

    ClearData() {
    	ledgerData = {};
    	return ledgerAccount = {};
  }
  };
  return DAServices;
});