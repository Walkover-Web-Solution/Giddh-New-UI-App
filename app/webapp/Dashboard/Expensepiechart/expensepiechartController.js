let pie = angular.module('piechartModule', [
  "googlechart"
]);

let piechartController = function($scope, $rootScope, localStorageService, toastr, groupService, $filter, $timeout, $http) {
  $scope.unq = 1;
  $scope.series = ['Expense'];
  $scope.chartData = [];
  $scope.labels = ["Salary", "Vendor", "Welfare", "Other"];
  $scope.chartOptions = {
    legend:{position:'none'},
    title:""
  };
  $scope.myChartObject = {};
  $scope.myChartObject.data = {"cols":[{
    "id": "account-name",
    "label": "Account name",
    "type": "string",
    "p": {}
  },
    {
      "id": "closing-balance",
      "label": "Closing Balance",
      "type": "number",
      "p": {}
    }],"rows":[
    {c:[
      {v: "Salary"},
      {v: 110}
    ]},
    {c:[
      {v: "Vendor"},
      {v: 90}
    ]},
    {c:[
      {v: "Welfare"},
      {v: 45}
    ]},
    {c:[
      {v: "Other"},
      {v: 30}
    ]},
  ]};
  $scope.myChartObject.type = "PieChart";
  $scope.myChartObject.options = {
    legend:{position:'none'},
    chartArea:{
      height:'80%'
    },
    animation:{
      duration: 1000,
      easing: 'out',
    },
  };
  $scope.chartDataAvailable = false;
  $scope.errorMessage = "";
  $scope.accountList = [];
  $scope.fromDate = "";
  $scope.toDate = "";
  $scope.hardRefresh = false;

  $scope.setDateByFinancialYear = function() {
    let presentYear = $scope.getPresentFinancialYear();
    let setDate = "";
    if ($rootScope.currentFinancialYear === undefined) {
      $rootScope.currentFinancialYear = moment($rootScope.selectedCompany.activeFinancialYear.financialYearStarts,"DD-MM-YYYY").get("years") + "-"+ moment($rootScope.selectedCompany.activeFinancialYear.financialYearEnds,"DD-MM-YYYY").get("years");
    }
    if ($rootScope.currentFinancialYear === presentYear) {
      $scope.toDate = moment().format('DD-MM-YYYY');
      if (moment().get('months') > 4) {
        $scope.fromDate = moment().set({'date':1, 'month': 3}).format('DD-MM-YYYY');
      } else {
        $scope.fromDate = moment().subtract(1,'years').set({'date':1, 'month': 3}).format('DD-MM-YYYY');
      }
    } else {
      $scope.toDate = $rootScope.selectedCompany.activeFinancialYear.financialYearEnds;
      $scope.fromDate = $rootScope.selectedCompany.activeFinancialYear.financialYearStarts;
    }
    return setDate;
  };

  $scope.getPresentFinancialYear = function() {
    let setDate = "";
    let toDate = "";
    if (moment().get('months') > 4) {
      setDate = moment().get('YEARS');
      toDate = moment().add(1,'years').get('YEARS');
    } else {
      setDate = moment().subtract(1, 'years').get('YEARS');
      toDate = moment().get('YEARS');
    }
    return setDate+"-"+toDate;
  };

  $scope.getExpenseData = function() {
    $scope.chartDataAvailable = false;
    $scope.errorMessage = "";
    if (_.isUndefined($rootScope.selectedCompany)) {
      $rootScope.selectedCompany = localStorageService.get("_selectedCompany");
    }
    if ($rootScope.currentFinancialYear === undefined) {
      return $timeout(( () => $scope.getExpenseData()),2000);
    } else {
      $scope.chartOptions.title = moment($rootScope.selectedCompany.activeFinancialYear.financialYearStarts,"DD-MM-YYYY").get("years") + "-"+ moment($rootScope.selectedCompany.activeFinancialYear.financialYearEnds,"DD-MM-YYYY").get("years");
      $scope.myChartObject.options.title = $scope.chartOptions.title;
      let duration = {};
      $scope.setDateByFinancialYear();
      duration.to = $scope.toDate;
      duration.from = $scope.fromDate;
      $scope.accountList = [];
      $scope.getClosingBalance($rootScope.groupName.operatingCost,duration);
      return $scope.getClosingBalance($rootScope.groupName.indirectExpenses,duration);
    }
  };

  $scope.getClosingBalance = function(groupUniqueName, duration) {
    let objToSend = {};
    objToSend.compUname = $rootScope.selectedCompany.uniqueName;
    objToSend.selGrpUname = groupUniqueName;
    objToSend.fromDate = duration.from;
    objToSend.toDate = duration.to;
    objToSend.refresh = $scope.hardRefresh;
//    url = 'https://apitest.giddh.com/company/'+objToSend.compUname+'/groups/'+objToSend.selGrpUname+'/closing-balance?from='+objToSend.fromDate+'&to='+objToSend.toDate
//    $http.get(url).then($scope.getClosingBalSuccess, $scope.getClosingBalFailure)
    return groupService.getClosingBal(objToSend).then($scope.getClosingBalSuccess,$scope.getClosingBalFailure);
  };

  $scope.getClosingBalSuccess = function(res) {
    $scope.hardRefresh = false;
    $scope.extractGroups(res.body[0]);
    return $scope.generateChartData($scope.accountList);
  };

  $scope.getClosingBalFailure = function(res) {
    $scope.hardRefresh = false;
    $scope.chartDataAvailable = false;
    return $scope.errorMessage = res.data.message;
  };

  $scope.extractAccounts = function(data) {
    if (data.accounts.length > 0) {
      _.each(data.accounts, account => $scope.accountList.push(account));
    }
    if (data.childGroups.length > 0) {
      return _.each(data.childGroups, group => $scope.extractAccounts(group));
    }
  };


  $scope.extractGroups = function(data) {
    if (data.childGroups.length > 0) {
      return _.each(data.childGroups, function(grp) {
        if (grp.closingBalance.amount > 0) {
          return $scope.accountList.push(grp);
        }
      });
    }
  };

  $scope.generateChartData = function(accounts) {
    let chartCreate = false;
    let accountRows = [];
    $scope.labels = [];
    $scope.chartData = [];
    $scope.series = [];
    accounts = _.sortBy(accounts,'closingBalance.amount');
    _.each(accounts, function(account) {
      let row = {};
      row.c = [];
      row.c.push({v:account.groupName});
      row.c.push({v:account.closingBalance.amount});
      $scope.labels.push(account.name);
      $scope.chartData.push(account.closingBalance.amount);
      $scope.series.push(account.name);
      if (account.closingBalance.amount > 0) {
        chartCreate = true;
      }
      return accountRows.push(row);
    });
    if (chartCreate === false) {
      $scope.errorMessage = "No data to show.";
      $scope.chartDataAvailable = false;
    } else {
      $scope.chartDataAvailable = true;
      $scope.errorMessage = "";
    }
    return $scope.myChartObject.data.rows = accountRows;
  };


  $scope.$on('company-changed', function(event,changeData) {
    if ((changeData.type === 'CHANGE') || (changeData.type === 'SELECT')) {
      return $scope.getExpenseData();
    }
  });


  return $scope.$on('reloadAll', function(event) {
    $scope.hardRefresh = true;
    return $scope.getExpenseData();
  });
};




pie.controller('piechartController', piechartController)

.directive('pieChart',[($locationProvider,$rootScope) => ({
  restrict: 'E',
  templateUrl: '/public/webapp/Dashboard/Expensepiechart/expensepiechart.html',
//  controller: 'piechartController'
  link(scope,elem,attr) {}
  //    console.log "pie chart scope : ",scope
}) ]);