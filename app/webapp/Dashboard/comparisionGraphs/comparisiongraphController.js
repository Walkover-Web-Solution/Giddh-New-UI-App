let compare = angular.module('compareModule', []);

let comparisiongraphController = function($scope, $rootScope, localStorageService, toastr, groupService, $filter, $timeout, reportService) {
  $scope.dataAvailable = true;
  $scope.errorMessage = "";
  $scope.chartType = "ComboChart";
  $scope.monthArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  $scope.chartOptions = {
    seriesType: 'line',
    series: {1:{type: 'bars'},2: {type: 'line',pointShape: 'star'},3:{type:'bars'}},
    colors: ['#d35f29','#d35f29','#337ab7','#337ab7'],
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
      scaleType: 'mirrorLog',
      format: 'long'
    }
  };
  $scope.chartOptionsWODiff = {
    seriesType: 'line',
    series: {1: {type: 'line',pointShape: 'star'}},
    colors: ['#d35f29', '#337ab7'],
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
      scaleType: 'mirrorLog',
      format: 'long'
    }
  };
  $scope.chartColumnFormation = [
      {
        "id": "sMonth",
        "label": "Month",
        "type": "string",
        "p": {}
      },
      {
        "id": "previousSBalance",
        "label": "Previous",
        "type": "number",
        "p": {}
      },{
        "id": "toolP",
        "type": "string",
        "role": "tooltip"
      },{
        "id": "previousTBalance",
        "label": "Total",
        "type": "number",
        "p": {}
      },{
        "id": "toolPT",
        "type": "string",
        "role": "tooltip"
      },{
        "id": "currentSBalance",
        "label": "Current",
        "type": "number",
        "p": {}
      },{
        "id": "tool",
        "type": "string",
        "role": "tooltip"
      },
      {
        "id": "currentTBalance",
        "label": "Total",
        "type": "number",
        "p": {}
      },{
        "id": "toolST",
        "type": "string",
        "role": "tooltip"
      }
  ];
  $scope.chartData = {
    "type": $scope.chartType,
    "data": {
      "cols" : $scope.chartColumnFormation
    },
    "options": $scope.chartOptions
  };
  $scope.chartColumnFormationWODiff = [
    {
      "id": "sMonth",
      "label": "Month",
      "type": "string",
      "p": {}
    },
    {
      "id": "previousSBalance",
      "label": "Previous",
      "type": "number",
      "p": {}
    },{
      "id": "toolP",
      "type": "string",
      "role": "tooltip"
    },{
      "id": "currentSBalance",
      "label": "Current",
      "type": "number",
      "p": {}
    },{
      "id": "tool",
      "type": "string",
      "role": "tooltip"
    }
  ];
  $scope.chartDataWODiff = {
    "type": $scope.chartType,
    "data": {
      "cols": $scope.chartColumnFormationWODiff
    },
    "options": $scope.chartOptionsWODiff
  };
  $scope.groupArray = {
    sales: [$rootScope.groupName.revenueFromOperations],
    expense: [$rootScope.groupName.indirectExpenses,$rootScope.groupName.operatingCost]
  };

  $scope.salesData = [];
  $scope.expenseData = [];
  $scope.unformatData = [];
  $scope.selectedChart = "sales";
  $scope.hardRefresh = false;

  $scope.getData = function(type) {
    $scope.selectedChart = type;
    $scope.errorMessage = "";
    $scope.dataAvailable = false;
    if (_.isUndefined($rootScope.selectedCompany)) {
      $rootScope.selectedCompany = localStorageService.get("_selectedCompany");
    }
    if ($rootScope.currentFinancialYear === undefined) {
      return $timeout(( () => $scope.getData(type)),2000);
    } else {
      $scope.setDateByFinancialYear();
      $scope.salesData = [];
      $scope.expenseData = [];
      $scope.generateData(type, $scope.fromDate, moment().format('DD-MM-YYYY'));
      if ($rootScope.selectedCompany.financialYears.length > 1) {
        return $scope.generateData(type, moment($scope.fromDate, 'DD-MM-YYYY').subtract(1,'years').format('DD-MM-YYYY'),moment($scope.toDate, 'DD-MM-YYYY').subtract(1,'years').format('DD-MM-YYYY'));
      }
    }
  };

  $scope.generateData = function(type, fromDate, toDate) {
    let reqParam = {
      'cUname': $rootScope.selectedCompany.uniqueName,
      'fromDate': fromDate,
      'toDate': toDate,
      'interval': "monthly",
      'refresh': $scope.hardRefresh
    };
    let graphParam = {
      'groups' : $scope.groupArray[type]
    };
    return $scope.getYearlyData(reqParam, graphParam);
  };

  $scope.getYearlyData = (reqParam,graphParam) => reportService.newHistoricData(reqParam, graphParam).then($scope.getYearlyDataSuccess, $scope.getYearlyDataFailure);

  $scope.getYearlyDataSuccess = function(res) {
    $scope.hardRefresh = false;
    $scope.graphData = res.body;
//    console.log($scope.selectedChart + " we get : ",res.body)
    return $scope.combineCategoryWise($scope.graphData.groups);
  };

  $scope.getYearlyDataFailure = function(res) {
    $scope.hardRefresh = false;
    if (res.data.code === "INVALID_DATE") {
      let setDate = "";
      if (moment().get('months') > 4) {
        return setDate = `01-04-${moment().get('YEARS')}`;
      } else {
        return setDate = `01-04-${moment().subtract(1, 'years').get('YEARS')}`;
      }
//      $scope.generateData($scope.selectedChart, setDate, moment().format('DD-MM-YYYY'))
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
      interval = _.toArray(_.groupBy(_.flatten(_.pluck(groups, 'intervalBalances')), 'to'));
      return _.each(interval, function(group) {
        let closingBalance = {};
        closingBalance.amount = 0;
        closingBalance.type = "DEBIT";
        let total = {};
        total.amount = 0;
        total.type = 'DEBIT';
        duration = "";
        let year = moment().get('y');
        let month = "";
        let monthNum = 0;
        _.each(group, function(grp) {
          duration = $scope.monthArray[moment(grp.to, "YYYY-MM-DD").get('months')] + moment(grp.to, "YYYY-MM-DD").get('years');
          month = $scope.monthArray[moment(grp.to, "YYYY-MM-DD").get('months')];
          monthNum = moment(grp.to, "YYYY-MM-DD").get('months') + 1;
          year = moment(grp.to, "YYYY-MM-DD").get('years');
          if (category === "income") {
            total.amount = total.amount + (grp.creditTotal - grp.debitTotal);
          } else {
            let sum = grp.debitTotal - grp.creditTotal;
            total.amount = total.amount + sum;
          }
          if (category === "income") {
            if (grp.closingBalance.type === "DEBIT") {
              closingBalance.amount = closingBalance.amount - grp.closingBalance.amount;
            } else {
              closingBalance.amount = closingBalance.amount + grp.closingBalance.amount;
            }
          } else {
            if (grp.closingBalance.type === "DEBIT") {
              closingBalance.amount = closingBalance.amount + grp.closingBalance.amount;
            } else {
              closingBalance.amount = closingBalance.amount - grp.closingBalance.amount;
            }
          }
          if (closingBalance.amount < 0) {
            closingBalance.type = "CREDIT";
          } else {
            closingBalance.type = "DEBIT";
          }
          if (total.amount < 0) {
            return total.type = "CREDIT";
          } else {
            return total.type = "DEBIT";
          }
        });
        let intB = {};
        intB.closingBalance = closingBalance;
        intB.duration = duration;
        intB.year = year;
        intB.month = month;
        intB.monthNum = monthNum;
        intB.category = category;
        intB.total = total;
        return addInThis.push(intB);
      });
    });
//    monthWise = _.groupBy(addInThis,'duration')
//    console.log("monthly data : ", addInThis)
    return $scope.generateChartData(addInThis);
  };

  $scope.generateChartData = function(data) {
    $scope.chartData.data.rows = [];
    _.each(data, function(monthly) {
      if ($scope.selectedChart === "sales") {
        return $scope.salesData.push(monthly);
      } else {
        return $scope.expenseData.push(monthly);
      }
    });
    if ($scope.selectedChart === "sales") {
      $scope.unformatData = $scope.salesData;
      $scope.formatData($scope.unformatData);
    } else {
      $scope.unformatData = $scope.expenseData;
      $scope.formatData($scope.unformatData);
    }
    return $scope.dataAvailable = true;
  };

  $scope.formatData = function(data) {
    $scope.chartData.data.rows = [];
    let temp = _.sortBy(data,'year');
    let startWith = temp[0].monthNum;
    let groupedData = [];
    let before = [];
    let after = [];
    _.each(temp, function(group) {
      if (group.monthNum < startWith) {
        return after.push(group);
      } else {
        return before.push(group);
      }
    });
    let final = [];
    final.push(_.groupBy(before, 'monthNum'));
    final.push(_.groupBy(after, 'monthNum'));
    _.each(final, grouped =>
      _.each(grouped, addThis => groupedData.push(addThis))
    );
    let rowsToAdd = [];
    _.each(groupedData, function(itr) {
      let row = {};
      row.c = [];
      row.c.push({v:itr[0].month});
      let sortedData = _.sortBy(itr, 'year');
      _.each(sortedData, function(monthly) {
        row.c.push({
          "v":monthly.closingBalance.amount
        });
        let tooltipText = monthly.year + ": "+$filter('currency')(Number(monthly.closingBalance.amount).toFixed(0), '', 0);
        row.c.push({"v": tooltipText});
        row.c.push({
          "v":monthly.total.amount
        });
        tooltipText = `Monthly change : ${monthly.year}: ${$filter('currency')(Number(monthly.total.amount).toFixed(0), '', 0)}`;
        return row.c.push({"v": tooltipText});
      });
      return rowsToAdd.push(row);
    });
    return $scope.chartData.data.rows = rowsToAdd;
  };

  $scope.switchData = function(condition, rowsToAdd) {
    if (condition === true) {
      return $scope.chartData.data.rows = rowsToAdd;
    } else {
      return $scope.chartDataWODiff.data.rows = rowsToAdd;
    }
  };

  $scope.setDateByFinancialYear = function() {
//    presentYear = $scope.getPresentFinancialYear()
//    if $rootScope.currentFinancialYear == presentYear
//      $scope.fromDate = moment().subtract(1, 'years').add(1,'months').format('DD-MM-YYYY')
//      $scope.toDate = moment().format('DD-MM-YYYY')
//    else
    $scope.fromDate = $rootScope.selectedCompany.activeFinancialYear.financialYearStarts;
    return $scope.toDate = $rootScope.selectedCompany.activeFinancialYear.financialYearEnds;
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

  $scope.$on('company-changed', function(event,changeData) {
    if ((changeData.type === 'CHANGE') || (changeData.type === 'SELECT')) {
      return $scope.getData($scope.selectedChart);
    }
  });

  return $scope.$on('reloadAll', function(event) {
    $scope.hardRefresh = true;
    return $scope.getData($scope.selectedChart);
  });
};

compare.controller('comparisiongraphController',comparisiongraphController)

.directive('compareGraph',[$locationProvider => ({
  restrict: 'E',
  templateUrl: '/public/webapp/Dashboard/comparisionGraphs/compare.html'
//  controller: 'comparisiongraphController'
}) ]
);