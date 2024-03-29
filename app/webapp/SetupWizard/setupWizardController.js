let setWizardController = function($scope, $state, $rootScope, $timeout, $http, $uibModal, localStorageService, userServices ,toastr, locationService, modalService, roleServices, permissionService, companyServices, $window,groupService, $location, WizardHandler) {

// add and verify mobile number
  $scope.numberVerified = false;
  $scope.isNotVerified = true;
  $scope.phoneNumber = '';
  $scope.userNumber = '';
  $scope.showSuccessMsg = false;
  $scope.mobNum = {
    countryCode: 91,
    number: '',
    showVerificationBox : false,
    verificationCode: ''
  };
  $scope.userDetails = localStorageService.get('_userDetails');
  if ($scope.userDetails.contactNo !== null) {
    $scope.isNotVerified = false;
  }

  $scope.addNumber = function(number) {
    let mobileRegex = /^[0-9]{1,10}$/;
    if (mobileRegex.test(number) && (number.length === 10)) {
      $scope.mobNum.number = number;
      let data = {
        "countryCode":$scope.mobNum.countryCode,
        "mobileNumber":$scope.mobNum.number
      };
      return userServices.addNumber(data).then($scope.addNumberSuccess, $scope.addNumberFailure);
    } else {
      return toastr.error("Please enter number in format: 91-9998899988");
    }
  };

  $scope.addNumberSuccess = function(res) {
    toastr.success("You will receive a verification code on your mobile shortly.");
    return $scope.mobNum.showVerificationBox = true;
  };

  $scope.addNumberFailure = res => toastr.error(res.data.message);

  $scope.verifyNumber = function(code) {
    let data = {
      "countryCode":$scope.mobNum.countryCode,
      "mobileNumber":$scope.mobNum.number,
      "oneTimePassword":$scope.mobNum.verificationCode
    };
    return userServices.verifyNumber(data).then($scope.verifyNumberSuccess, $scope.verifyNumberFailure);
  };

  $scope.verifyNumberSuccess = function(res) {
    toastr.success(res.body);
    $scope.mobNum.showVerificationBox = false;
    $scope.numberVerified = true;
    userServices.get($rootScope.basicInfo.uniqueName).then($scope.getUserDetailSuccess, $scope.getUserDetailFailure);
    return WizardHandler.wizard().next();
  };

  $scope.verifyNumberFailure = res => toastr.error(res.data.message);

  $scope.getUserDetailSuccess = function(res) {
    localStorageService.set("_userDetails", res.body);
    return $rootScope.basicInfo = res.body;
  };

  //get company list failure
  $scope.getUserDetailFailure = res=> toastr.error(res.data.message, res.data.status);

  //create company
  $scope.createCompany = cdata => companyServices.create(cdata).then($scope.onCreateCompanySuccess, $scope.onCreateCompanyFailure);

  //create company success
  $scope.onCreateCompanySuccess = function(res) {
    toastr.success("Company created successfully", "Success");
    $rootScope.mngCompDataFound = true;
    $scope.companyList.push(res.body);
    $rootScope.setCompany(res.body);
    $rootScope.getCompanyList();
    let changeData = {};
    changeData.data = res.body;
    changeData.type = 'CHANGE';
    $scope.$broadcast('company-changed', changeData);
    $rootScope.$emit('company-changed', changeData);
    $scope.showSuccessMsg = true;
    WizardHandler.wizard().next();
    $state.go('company.content.ledgerContent');
    return $rootScope.setupModalInstance.close();
  };

  //create company failure
  $scope.onCreateCompanyFailure = res => toastr.error(res.data.message, "Error");

  $scope.promptBeforeClose = function() {
    if ($scope.companyList.length < 1) {
      return modalService.openConfirmModal({
       title: 'Log Out',
       body: 'In order to be able to use Giddh, you must create a company. Are you sure you want to cancel and logout?',
       ok: 'Yes',
       cancel: 'No'}).then($scope.firstLogout);
    } else {
      return $rootScope.setupModalInstance.close();
    }
  };

  $scope.firstLogout = () =>
    $http.post('/logout').then((function(res) {
     // don't need to clear below
     // _userDetails, _currencyList
     localStorageService.clearAll();
     return window.location = "/thanks";
    }), function(res) {})
  ;

  $scope.triggerAddManage = () =>
    $timeout(( () => $rootScope.$emit('openAddManage')), 100)
  ;

  return $scope.setupComplete = () => $scope.showSuccessMsg = true;
};


giddh.webApp.controller('setWizardController', setWizardController);