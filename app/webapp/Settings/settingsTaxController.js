let SettingsTaxController = function($rootScope, Upload, $timeout, toastr) {

  this.Upload = Upload;
  this.$rootScope = $rootScope;
  this.$timeout = $timeout;
  this.toastr = toastr;
  // assign universal this for ctrl
  let $this = this;

  console.log("in SettingsTaxController");
  
  // local vars for tax module
  this.taxTypes = [
    "MONTHLY",
    "YEARLY",
    "QUARTERLY",
    "HALFYEARLY"
  ];
 
  // functions for tax module
  this.getTax = () => console.log("in getTax");
  
};

SettingsTaxController.$inject = ['$rootScope', 'Upload', '$timeout', 'toastr'];

giddh.webApp.controller('settingsTaxController', SettingsTaxController);