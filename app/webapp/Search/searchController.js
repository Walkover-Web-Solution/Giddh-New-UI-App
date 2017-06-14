let searchController = function($scope, $rootScope, localStorageService, toastr, groupService, $filter, reportService, $uibModal, companyServices, $location, FileSaver) {

  $scope.today = new Date();
  $scope.dateOptions = {
    'year-format': "'yy'",
    'starting-day': 1,
    'showWeeks': false,
    'show-button-bar': false,
    'year-range': 1,
    'todayBtn': false,
    'container': "body",
    'minViewMode': 0
  };
  $scope.format = "dd-MM-yyyy";
  $rootScope.selectedCompany = localStorageService.get("_selectedCompany");
  $scope.noData = false;
  $scope.searchLoader = false;
  $scope.searchFormData = {
    fromDate: new Date(moment().subtract(1, 'month').utc()),
    toDate: new Date()
  };
  $scope.searchResData = {};
  $scope.searchResDataOrig = {};
  // search query parameters
  $scope.queryType = [
    {name:"Closing", uniqueName: "closingBalance"},
    {name:"Opening", uniqueName: "openingBalance"},
    {name:"Cr. total", uniqueName: "creditTotal"},
    {name:"Dr. total", uniqueName: "debitTotal"}
  ];
  $scope.queryDiffer = [
    "Less",
    "Greater",
    "Equals"
  ];
  $scope.balType = [
    {name:"CR", uniqueName: "CREDIT"},
    {name:"DR", uniqueName: "DEBIT"}
  ];
  $scope.srchDataSet=[new angular.srchDataSet()];

  $scope.sortType = 'name';
  $scope.sortReverse  = false;  

  $scope.fromDatePickerOpen = function() {
    return this.fromDatePickerIsOpen = true;
  };

  $scope.toDatePickerOpen = function() {
    return this.toDatePickerIsOpen = true;
  };


  // get groups list
  $scope.getGrpsforSearch = function(){
    $rootScope.selectedCompany = localStorageService.get("_selectedCompany");
    if (_.isEmpty($rootScope.selectedCompany)) {
      return toastr.error("Select company first.", "Error");
    } else {
      return groupService.getGroupsWithAccountsInDetail($rootScope.selectedCompany.uniqueName).then($scope.getGrpsforSearchSuccess, $scope.getGrpsforSearchFailure);
    }
  };

  $scope.getGrpsforSearchSuccess = function(res) {
    $scope.groupList = res.body;
    $scope.flattenGroupList = groupService.flattenGroup($scope.groupList, []);
    return $scope.searchLoader = true;
  };


  $scope.getGrpsforSearchFailure = res => toastr.error(res.data.message, res.data.status);

  // get selected group closing balance
  $scope.getClosingBalance = function(data, refresh) {
    $scope.resetQuery();
    $scope.searchDtCntLdr = true;
    let obj = {
      compUname: $rootScope.selectedCompany.uniqueName,
      selGrpUname: data.group.uniqueName,
      fromDate: $filter('date')(data.fromDate, "dd-MM-yyyy"),
      toDate: $filter('date')(data.toDate, "dd-MM-yyyy"),
      refresh
    };
    return groupService.getClosingBal(obj)
      .then(
        function(res){
          $scope.searchResData = groupService.flattenSearchGroupsAndAccounts(res.body);
          _.extend($scope.searchResDataOrig, $scope.searchResData);
          $scope.srchDataFound = true;
          return $scope.searchDtCntLdr = false;
        }
        ,function(error){
          $scope.srchDataFound = false;
          $scope.searchDtCntLdr = false;
          return toastr.error(error.data.message);
      });
  };

  // push new value
  $scope.addSearchRow =function(){
    if ($scope.srchDataSet.length < 4) { 
      return $scope.srchDataSet.push(new angular.srchDataSet());
    } else {
      return toastr.warning("Cannot add more parameters", "Warning");
    }
  };

  $scope.removeSearchRow = () => $scope.srchDataSet.splice(-1,1);

  $scope.searchQuery = function(srchQData){
    _.extend($scope.searchResData, $scope.searchResDataOrig);
    // show reset data button
    $scope.inSrchmode = true;
    // for each object filter data
    return _.each(srchQData, query=>
      $scope.searchResData = _.filter($scope.searchResData, function(account){
          let amount = Number(query.amount);
          switch (query.queryDiffer) {
            case 'Greater':
              if (amount === 0) {
                return account[query.queryType] > amount;
              } else {
                if (query.queryType === 'openingBalance') {
                  return (account.openingBalance > amount) && (account.openBalType === query.balType);
                }
                if (query.queryType === 'closingBalance') {
                  return (account.closingBalance > amount) && (account.closeBalType === query.balType);
                } else {
                  return account[query.queryType] > amount;
                }
              }
            case 'Less':
              if (amount === 0) {
                return account[query.queryType] < amount;
              } else {
                if (query.queryType === 'openingBalance') {
                  return (account.openingBalance < amount) && (account.openBalType === query.balType);
                }
                if (query.queryType === 'closingBalance') {
                  return (account.closingBalance < amount) && (account.closeBalType === query.balType);
                } else {
                  return account[query.queryType] < amount;
                }
              }
            case 'Equals':
              if (amount === 0) {
                return account[query.queryType] === amount;
              } else {
                if (query.queryType === 'openingBalance') {
                  return (account.openingBalance === amount) && (account.openBalType === query.balType);
                }
                if (query.queryType === 'closingBalance') {
                  return (account.closingBalance === amount) && (account.closeBalType === query.balType);
                } else {
                  return account[query.queryType] === amount;
                }
              }
            default:
              return toastr.warning("something went wrong reload page", "Warning");
          }
        })
        // end reject
      );
  };
      // end each

      

  $scope.resetQuery =function(){
    $scope.srchDataSet = [];
    $scope.srchDataSet = [new angular.srchDataSet()];
    $scope.inSrchmode = false;
    return _.extend($scope.searchResData, $scope.searchResDataOrig);
  };


  // download CSV
  $scope.getCSVHeader=()=>
    [
      "Name",
      "UniqueName",
      "Opening Bal.",
      "O/B Type",
      "DR Total",
      "CR Total",
      "Closing Bal.",
      "C/B Type",
      "Parent"
    ]
  ;

  $scope.order = [
    "name",
    "uniqueName",
    "openingBalance",
    "openBalType",
    "debitTotal",
    "creditTotal",
    "closingBalance",
    "closeBalType",
    "parentName"
  ];


  let roundNum = function(data, places) {
    data = Number(data);
    data = data.toFixed(places);
    return data;
  };

  $scope.createCSV = function() {
    let header = $scope.getCSVHeader();
    let title = '';
    _.each(header, head => title += head + ',');
    title = title.replace(/.$/,'');
    console.log(title);  
    title += '\r\n';

    let row = '';
    _.each($scope.searchResData, function(data) {
      if (data.name.indexOf(',')) {
        data.name.replace(',', '');
      }
      row += data.name + ',' + data.uniqueName + ',' + roundNum(data.openingBalance, 2) + ',' + data.openBalType + ',' + roundNum(data.debitTotal, 2) + ',' + roundNum(data.creditTotal, 2) + ',' + roundNum(data.closingBalance, 2) + ',' + data.closeBalType + ',' + data.parent; 
      return row += '\r\n';
    });

    let csv = title + row;
    let blob = new Blob([csv], {type: "application/octet-binary"});
    return FileSaver.saveAs(blob, $scope.searchFormData.group.name+".csv");
  };



  // init some func when page load
  $scope.getGrpsforSearch();

  //send as email/sms
  $scope.accountName = '%s_AccountName';
  $scope.msgBody = {
    header: {
      email: 'Send Email',
      sms: 'Send Sms',
      set: ''
    },
    btn : {
      email: 'Send Email',
      sms: 'Send Sms',
      set: ''
    },
    type: '',
    msg: '',
    subject: ''
  };

  $scope.dataVariables = [
    {
      name: 'Opening Balance',
      value: '%s_OB'
    },
    {
      name: 'Closing Balance',
      value: '%s_CB'
    },
    {
      name: 'Credit Total',
      value: '%s_CT'
    },
    {
      name: 'Debit Total',
      value: '%s_DT'
    },
    {
      name: 'From Date',
      value: '%s_FD'
    },
    {
      name: 'To Date',
      value: '%s_TD'
    },
    {
      name: 'Magic Link',
      value: '%s_ML'
    },
    {
      name: 'Account Name',
      value: '%s_AN'
    }
  ];

  $scope.openEmailDialog = function() {
    let modalInstance;
    $scope.msgBody.subject = '';
    $scope.msgBody.msg = '';
    $scope.msgBody.type = 'Email';
    $scope.msgBody.btn.set = $scope.msgBody.btn.email;
    $scope.msgBody.header.set = $scope.msgBody.header.email;
    return modalInstance = $uibModal.open({
        templateUrl: 'public/webapp/views/bulkMail.html',
        size: "md",
        backdrop: 'static',
        scope: $scope
      });
  };

  $scope.openSmsDialog = function() {
    let modalInstance;
    $scope.msgBody.msg = '';
    $scope.msgBody.type = 'sms';
    $scope.msgBody.btn.set = $scope.msgBody.btn.sms;
    $scope.msgBody.header.set = $scope.msgBody.header.sms;
    return modalInstance = $uibModal.open({
        templateUrl: 'public/webapp/views/bulkMail.html',
        size: "md",
        backdrop: 'static',
        scope: $scope
      });
  };

  $scope.addValueToMsg = val => $scope.msgBody.msg += ` ${val.value.toString()} `;

  $scope.send = function() {
    let accountsUnqList = [];
    _.each($scope.searchResData, acc => accountsUnqList.push(acc.uniqueName));

    let data = {
      "message": $scope.msgBody.msg,
      "accounts": accountsUnqList
    };
    let reqParam = {
      compUname : $rootScope.selectedCompany.uniqueName,
      from : $filter('date')($scope.searchFormData.fromDate, 'dd-MM-yyyy'),
      to : $filter('date')($scope.searchFormData.toDate, 'dd-MM-yyyy')
    };
    if ($scope.msgBody.btn.set === 'Send Email') {
      return companyServices.sendEmail(reqParam, data).then($scope.sendEmailSuccess, $scope.sendEmailFailure);
    } else if ($scope.msgBody.btn.set === 'Send Sms') {
      return companyServices.sendSms(reqParam, data).then($scope.sendSmsSuccess, $scope.sendSmsFailure);
    }
  };
    
    
  $scope.sendSmsSuccess = res => toastr.success(res.body);

  $scope.sendSmsFailure = res => toastr.error(res.data.message);
    
  $scope.sendEmailSuccess = res => toastr.success(res.body);

  $scope.sendEmailFailure = res => toastr.error(res.data.message);

  return $scope.$on('company-changed' , () => $scope.getGrpsforSearch());
};

//init angular app
giddh.webApp.controller('searchController', searchController);

// class method
angular.srchDataSet = class srchDataSet {
  constructor(){
    this.queryType= "";
    this.balType= "CREDIT";
    this.queryDiffer= "";
    this.amount = "";
  }
};
