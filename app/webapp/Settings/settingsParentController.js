let SettingsParentController = function($rootScope, Upload, $timeout, toastr) {

  this.Upload = Upload;
  this.$rootScope = $rootScope;
  this.$timeout = $timeout;
  this.toastr = toastr;
  // assign universal this for ctrl
  let $this = this;

  console.log("in SettingsParentController");
  
  // centralize vars for setting module
  this.tabs = [
    {
      "heading": "Templates",
      "active": true,
      "template":"/public/webapp/Settings1/invoice-temp.html"
    },
    {
      "heading": "Taxes",
      "active": false,
      "template":"/public/webapp/Settings1/tax-temp.html"
    }
  ];
 
  // centralize function for setting module
  this.dummyFunction = () => console.log("in dummyFunction");
  
};

SettingsParentController.$inject = ['$rootScope', 'Upload', '$timeout', 'toastr'];

giddh.webApp.controller('settingsParentController', SettingsParentController);