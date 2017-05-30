let loginController = function($scope, $rootScope, $http, $timeout, $auth, localStorageService, toastr, $window, $uibModal, $location) {
  let verifyEmailFailure;
  $scope.showLoginBox = false;
  $scope.toggleLoginBox = function(e) {
    $scope.showLoginBox = !$scope.showLoginBox;
    return e.stopPropagation();
  };
  $scope.loginIsProcessing = false;
  $scope.captchaKey = '6LcgBiATAAAAAMhNd_HyerpTvCHXtHG6BG-rtcmi';
  $scope.phoneLoginPopup = false;
  $scope.showOtp = false;
  $scope.contact = {};
  $scope.countryCode = 91;
  $rootScope.homePage = false;
  $scope.loginBtnTxt = "Get OTP";
  $scope.loggingIn = false;
  $scope.twoWayVfyCode = null;
  // check string has whitespace
  $scope.hasWhiteSpace = s => /\s/g.test(s);

  $scope.validateEmail = function(emailStr){
    let pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(emailStr);
  };

  $scope.submitForm =function(data){

    $scope.formProcess = true;
    //check and split full name in first and last name
    if($scope.hasWhiteSpace(data.name)) {
      let unameArr = data.name.split(" ");
      data.uFname = unameArr[0];
      data.uLname = unameArr[1];
    } else {
      data.uFname = data.name;
      data.uLname = "  ";
    }

    if (!($scope.validateEmail(data.email))) {
      toastr.warning("Enter valid Email ID", "Warning");
      return false;
    }

    data.company = '';

    if (_.isEmpty(data.message)) {
      data.message = 'test';
    }

    return $http.post('/contact/submitDetails', data).then(function(response) {
      $scope.formSubmitted = true;
      if((response.status === 200) && _.isUndefined(response.data.status)) {
        return $scope.responseMsg = "Thanks! we will get in touch with you soon";
      } else {
        return $scope.responseMsg = response.data.message;
      }
    });
  };

  $scope.TwoWayLogin = function(code) {
    this.success = function(res) {
      localStorageService.set("_userDetails", res.data.body.user);
      $window.sessionStorage.setItem("_ak", res.data.body.authKey);
      return window.location = "/app/#/home/";
    };

    this.failure = res => toastr.error(res.data.message, "Error");
      // $timeout (->
      //   window.location = "/index"
      // ),3000

    $scope.twoWayUserData.oneTimePassword = code;
    let url = '/app/api/verify-number';
    return $http.post(url,  $scope.twoWayUserData).then(this.success, this.failure);
  };

  let loginWithTwoWayAuthentication = function(res) {
    let modalInstance;
    $scope.twoWayUserData = {};
    $scope.twoWayUserData.countryCode = res.countryCode;
    $scope.twoWayUserData.mobileNumber = res.contactNumber;
    return modalInstance = $uibModal.open({
      templateUrl: '/public/website/views/twoWayAuthSignIn.html',
      size: "md",
      backdrop: 'static',
      scope: $scope
    });
  };

  $scope.authenticate = function(provider) {
    $scope.loginIsProcessing = true;
    return $auth.authenticate(provider).then(function(response) {
      if (response.data.result.status === "error") {
        //user is not registerd with us
        toastr.error(response.data.result.message, "Error");
        return $timeout((() => window.location = "/index"),3000);
      } else {
        //user is registered and redirect it to app
        if (response.data.result.body.authKey) {
          localStorageService.set('_newUser', response.data.result.body.isNewUser);
          localStorageService.set("_userDetails", response.data.userDetails);
          $window.sessionStorage.setItem("_ak", response.data.result.body.authKey);
          return window.location = "/app/#/home/";
        } else {
          return loginWithTwoWayAuthentication(response.data.result.body);
        }
      }
    }).catch(function(response) {
      $scope.loginIsProcessing = false;
      //user is not registerd with us
      if (response.data.result.status === "error") {
        toastr.error(response.data.result.message, "Error");
        return $timeout((() => window.location = "/index"), 3000);
      } else if (response.status === 502) {
        return toastr.error("Something went wrong please reload page", "Error");
      } else {
        return toastr.error("Something went wrong please reload page", "Error");
      }
    });
  };

  $scope.loginWithMobile = function(e) {
    $scope.phoneLoginPopup = true;
    return e.stopPropagation();
  };
    
  $scope.signUpWithEmailModal = function(e) {
    let modalInstance = $uibModal.open({
      templateUrl: '/public/website/views/signUpEmail.html',
      size: "md",
      backdrop: 'static',
      scope: $scope
    });
    return e.stopPropagation();
  };

  $scope.verifyMail = false;
  $scope.emailToVerify = "";
  $scope.verifyMailMakeFalse = () => $scope.verifyMail = false;

  let getOtpSuccess = res => $scope.showOtp = true;

  let getOtpFailure = res => toastr.error(res.data.response.code);

  $scope.getOtp = function() {
    $scope.contact.countryCode = $scope.countryCode;
    if ($scope.contact.mobileNumber !== undefined) {
      $http.post('/app/api/get-login-otp', $scope.contact).then(
        getOtpSuccess,
        getOtpFailure
      );
    } else {
      toastr.error("mobile number cannot be blank");
    }
    return $scope.loginBtnTxt = "Resend";
  };
    

  let loginUserSuccess = function(res) {
    localStorageService.set("_userDetails", res.data.body.user);
    $window.sessionStorage.setItem("_ak", res.data.body.authKey);
    return window.location = "/app/#/home/";
  };

  let loginUserFailure = function(res) {
    toastr.error(res.data.message);
    return $scope.loggingIn = false;
  };

  let loginUser = function(token) {
    let data = {
      countryCode : $scope.contact.countryCode,
      mobileNumber : $scope.contact.mobileNumber,
      token
    };
    return $http.post('/app/api/login-with-number', data).then(
      loginUserSuccess,
      loginUserFailure
    );
  };

  let verifyOtpSuccess = function(res) {
    let { refreshToken } = res.data.response;
    return loginUser(refreshToken);
  };

  let verifyOtpFailure = function(res) {
    toastr.error(res.data.response.code);
    return $scope.loggingIn = false;
  };

  $scope.verifyOtp = function(otp) {
    let { contact } = $scope;
    contact.oneTimePassword = otp;
    $http.post('/app/api/verify-login-otp', contact).then(
      verifyOtpSuccess,
      verifyOtpFailure
    );
    return $scope.loggingIn = true;
  };

  $scope.signUpWithEmail = function(emailId, resend) {
    let dataToSend = {
      email: emailId
    };
    return $http.post('/app/api/signup-with-email', dataToSend).then(
      function(res) {
        $scope.verifyMail = true;
        $scope.emailToVerify = emailId;
        if (resend) {
          return toastr.success(res.data.body);
        }
      },
      function(res) {
        $scope.verifyMail = false;
        return toastr.error(res.data.message);
    });
  };

  $scope.verifyEmail = function(emailId, code) {
    let dataToSend = {
      email: $scope.emailToVerify,
      verificationCode: code
    };
    return $http.post('/app/api/verify-email-now', dataToSend).then(
      verifyEmailSuccess,
      verifyEmailFailure
    );
  };

  var verifyEmailSuccess = function(res) {
    $scope.verifyEmail = false;
    localStorageService.set("_userDetails", res.data.body.user);
    $window.sessionStorage.setItem("_ak", res.data.body.authKey);
    return window.location = '/app/#/home';
  };

  return verifyEmailFailure = function(res) {
    toastr.error(res.data.message);
    return $scope.verifyMail = true;
  };
};

  // $scope.notifyUser = (user) ->
  //   this.success = (res) ->
      
  //   this.failure = (res) ->
      
  //   data = {user: user}

  //   $http.post('/global-user', data).then(this.success, this.failure)

angular.module('giddhApp').controller('loginController', loginController);