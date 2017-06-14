let history = angular.module('historicalModule',[]);

let historicalgraphController = function($scope, $rootScope, localStorageService, toastr, groupService, $filter, $timeout, reportService) {
  $scope.dataAvailable = false;
  $scope.errorMessage = "";
  $scope.groupArray = [$rootScope.groupName.revenueFromOperations,$rootScope.groupName.indirectExpenses,$rootScope.groupName.operatingCost];
  $scope.monthArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  $scope.chartData = {
  "type": "ComboChart",
  "data": {
    "cols": [
      {
        "id": "month",
        "label": "Month",
        "type": "string",
        "p": {}
      },
      {
        "id": "expenseBalance",
        "label": "Expense",
        "type": "number",
        "p": {}
      },{
        "id": "incomeBalance",
        "label": "Revenue",
        "type": "number",
        "p": {}
      }]
  },
  "options": {
    seriesType: 'bars',
    series: {1: {type: 'line'}},
    colors: ['#d35f29','#337ab7'],
    legend:{position:'none'},
    chartArea:{
      width:'85%',
      right: 10
    },
    curveType: 'function',
    pointSize: 5,
    animation:{
      duration: 1000,
      easing: 'out',
    },
    hAxis:{
      slantedText:true
    },
    vAxis:{
      format: 'long'
    }
  }
  };
  $scope.secondTime = 0;
  $scope.hardRefresh = false;

  $scope.setDateByFinancialYear = function() {
    let presentYear = $scope.getPresentFinancialYear();
    if ($rootScope.currentFinancialYear === presentYear) {
      if ($rootScope.selectedCompany.financialYears.length > 1) {
        $scope.fromDate = moment().subtract(1, 'years').add(1,'months').set('date',1).format('DD-MM-YYYY');
        return $scope.toDate = moment().format('DD-MM-YYYY');
      } else {
        $scope.fromDate = $rootScope.selectedCompany.activeFinancialYear.financialYearStarts;
        return $scope.toDate = moment().format('DD-MM-YYYY');
      }
    } else {
      $scope.fromDate = $rootScope.selectedCompany.activeFinancialYear.financialYearStarts;
      return $scope.toDate = $rootScope.selectedCompany.activeFinancialYear.financialYearEnds;
    }
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

  $scope.getHistory = function(fromDate, toDate) {
//    write code to get history data
    $scope.errorMessage = "";
    $scope.dataAvailable = false;
    if (_.isUndefined($rootScope.selectedCompany)) {
      $rootScope.selectedCompany = localStorageService.get("_selectedCompany");
    }
    if ($rootScope.currentFinancialYear === undefined) {
      return $timeout(( function() {
        $scope.setDateByFinancialYear();
        return $scope.getHistory($scope.fromDate,$scope.toDate);
      }),2000);
    } else {
      $scope.graphData = [];
      $scope.chartData.data.rows = [];
      let reqParam = {
        'cUname': $rootScope.selectedCompany.uniqueName,
        'fromDate': fromDate,
        'toDate': toDate,
        'interval': "monthly",
        'refresh': $scope.hardRefresh
      };
      let graphParam = {
        'groups': [$rootScope.groupName.indirectExpenses,$rootScope.groupName.operatingCost]
      };
      $scope.getHistoryData(reqParam, {"groups":[$rootScope.groupName.revenueFromOperations]});
      return $scope.getHistoryData(reqParam, graphParam);
    }
  };

  $scope.getGraphParam = function(groupUName) {
    let graphParam = {
      'groups': [groupUName]
    };
    return graphParam;
  };

  $scope.getHistoryData = (reqParam,graphParam) => reportService.newHistoricData(reqParam, graphParam).then($scope.getHistoryDataSuccess, $scope.getHistoryDataFailure);

  $scope.getHistoryDataSuccess = function(res) {
    $scope.hardRefresh = false;
    $scope.graphData.push(res.body.groups);
    return $scope.combineCategoryWise(_.flatten($scope.graphData));
  };

  $scope.getHistoryDataFailure = function(res) {
    $scope.hardRefresh = false;
    if (res.data.code === "INVALID_DATE") {
      if ($scope.secondTime <= 0) {
        $scope.secondTime = $scope.secondTime + 1;
        let setDate = "";
        if (moment().get('months') > 4) {
          setDate = `01-04-${moment().get('YEARS')}`;
        } else {
          setDate = `01-04-${moment().subtract(1, 'years').get('YEARS')}`;
        }
        return $scope.getHistory(setDate, moment().format('DD-MM-YYYY'));
      } else {
        return $scope.secondTime = 0;
      }
    } else {
      $scope.dataAvailable = false;
      return $scope.errorMessage = res.data.message;
    }
  };

  $scope.combineCategoryWise = function(result) {
    let categoryWise = _.groupBy(result,'category');
    let addInThis = [];
    _.each(categoryWise, function(groups) {
      let { category } = groups[0];
      let duration = "";
      let interval = [];
      interval = _.toArray(_.groupBy(_.flatten(_.pluck(groups, 'intervalBalances')), 'from'));
      return _.each(interval, function(group) {
        let closingBalance = {};
        closingBalance.amount = 0;
        closingBalance.type = "DEBIT";
        duration = "";
        _.each(group, function(grp) {
          duration = $scope.monthArray[moment(grp.to, "YYYY-MM-DD").get('months')] + moment(grp.to, "YYYY-MM-DD").get('years');
          if (category === "income") {
            closingBalance.amount = closingBalance.amount + (grp.creditTotal - grp.debitTotal);
          } else {
            let sum = grp.debitTotal - grp.creditTotal;
            closingBalance.amount = closingBalance.amount + sum;
          }
          if (closingBalance.amount < 0) {
            return closingBalance.type = "CREDIT";
          } else {
            return closingBalance.type = "DEBIT";
          }
        });
        let intB = {};
        intB.closingBalance = closingBalance;
        intB.duration = duration;
        intB.month = duration;
        intB.category = category;
        return addInThis.push(intB);
      });
    });
    let monthWise = _.groupBy(addInThis,'duration');
    return $scope.generateChartData(monthWise);
  };

  $scope.generateChartData = function(data) {
    $scope.chartData.data.rows = [];
    let rowsToAdd = [];
    _.each(data, function(monthly) {
      let row = {};
      row.c = [];
      row.c.push({v:monthly[0].month});
      let sortedMonth = _.sortBy(monthly, 'category');
      _.each(sortedMonth, account => row.c.push({v:account.closingBalance.amount}));
      return rowsToAdd.push(row);
    });
    $scope.chartData.data.rows = rowsToAdd;
    return $scope.dataAvailable = true;
  };

  $scope.setDateByFinancialYear();

  $scope.$on('company-changed', function(event,changeData) {
    if ((changeData.type === 'CHANGE') || (changeData.type === 'SELECT')) {
      $scope.setDateByFinancialYear();
      return $scope.getHistory($scope.fromDate,$scope.toDate);
    }
  });


  return $scope.$on('reloadAll', function(event) {
    $scope.hardRefresh = true;
    $scope.setDateByFinancialYear();
    return $scope.getHistory($scope.fromDate,$scope.toDate);
  });
};


history.controller('historicalgraphController',historicalgraphController)

.directive('history',[($locationProvider,$rootScope) => ({
  restrict: 'E',
  templateUrl: 'public/webapp/Dashboard/historicalGraph/historicalGraph.html'
//  controller: 'historicalgraphController'
}) ]);