let combined = angular.module('combinedModule', []);

let combinedController = function($scope, $rootScope, localStorageService, toastr, groupService, $filter, reportService, $timeout, $state, $http, $window) {
  $scope.monthArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  $scope.chartDataAvailable = false;
  $scope.errorMessage = "";
  $scope.fromDate = moment().format('DD-MM-YYYY');
  $scope.toDate = moment().format('DD-MM-YYYY');
  $scope.chartOptions = {
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
      format: 'long',
      scaleType: 'mirrorLog'
    }
  };
  $scope.plData = {
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
          "id": "monthlyBalance",
          "label": "Monthly P&L",
          "type": "number",
          "p": {}
        }]
    },
    "options": $scope.chartOptions
  };
  $scope.networthData = {
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
          "id": "monthlyBalance",
          "label": "Monthly change",
          "type": "number",
          "p": {}
        },{
          "id": "yearlyBalance",
          "label": "Net worth",
          "type": "number",
          "p": {}
        }]
    },
    "options": $scope.chartOptions
  };
  
  $scope.hardRefresh = false;


  $scope.getCombinedData = function() {
    $scope.chartDataAvailable = false;
    $scope.errorMessage = "";
    if (_.isUndefined($rootScope.selectedCompany)) {
      $rootScope.selectedCompany = localStorageService.get("_selectedCompany");
    }
    if ($rootScope.currentFinancialYear === undefined) {
      return $timeout(( () => $scope.getCombinedData()),2000);
    } else {
      $scope.setDateByFinancialYear();
      return $scope.getComData($scope.fromDate,$scope.toDate);
    }
  };

  $scope.getComData = function(fromDate, toDate) {
    $scope.errorMessage = "";
    $scope.chartDataAvailable = false;
    let reqParam = {
      'cUname': $rootScope.selectedCompany.uniqueName,
      'fromDate': fromDate,
      'toDate': toDate,
      'interval': "monthly",
      'refresh': $scope.hardRefresh
    };
    return $scope.getCombinedGraphData(reqParam);
  };

  $scope.getCombinedGraphData = reqParam => reportService.networthNprofitloss(reqParam).then($scope.getCGraphDataSuccess, $scope.getCGraphDataFailure);

  $scope.getCGraphDataSuccess = function(res) {
    $scope.hardRefresh = false;
    $scope.errorMessage = "";
    let nwGraphData = res.body;
    $scope.formatNetworthData((nwGraphData.networth));
    return $scope.formatPLdata(nwGraphData.profitLoss);
  };

  $scope.getCGraphDataFailure = function(res) {
    if (res.data.code === "INVALID_DATE") {
      let setDate = "";
      if (moment().get('months') > 4) {
        setDate = `01-04-${moment().get('YEARS')}`;
      } else {
        setDate = `01-04-${moment().subtract(1, 'years').get('YEARS')}`;
      }
      $scope.fromDate = setDate;
      $scope.toDate = moment().format('DD-MM-YYYY');
      $scope.getComData(setDate,moment().format('DD-MM-YYYY'));
    } else {
      $scope.chartDataAvailable = false;
      $scope.chartData = [];
      //    toastr.error(res.data.message)
      $scope.errorMessage = res.data.message;
    }
    return $scope.hardRefresh = false;
  };

  $scope.formatNetworthData = function(data) {
    $scope.networthData.data.rows = [];
    let monthlyBalances = [];
    let yearlyBalances = [];
    _.each(data.periodBalances, function(nw) {
      let row = {};
      row.c = [];
      let str = $scope.monthArray[moment(nw.to, 'DD-MM-YYYY').get('months')] + moment(nw.to, 'DD-MM-YYYY').get('y');
      monthlyBalances.push(nw.monthlyBalance);
      yearlyBalances.push(nw.yearlyBalance);
      row.c.push({v:str});
      row.c.push({v:nw.monthlyBalance});
      row.c.push({v:nw.yearlyBalance});
      return $scope.networthData.data.rows.push(row);
    });
    return $scope.chartDataAvailable = true;
  };

  $scope.formatPLdata = function(data) {
    $scope.plData.data.rows = [];
    let monthlyBalances = [];
    let yearlyBalances = [];
    _.each(data.periodBalances, function(nw) {
      let row = {};
      row.c = [];
      let str = $scope.monthArray[moment(nw.to, 'DD-MM-YYYY').get('months')] + moment(nw.to, 'DD-MM-YYYY').get('y');
      monthlyBalances.push(nw.monthlyBalance);
      yearlyBalances.push(nw.yearlyBalance);
      row.c.push({v:str});
      row.c.push({v:nw.monthlyBalance});
      return $scope.plData.data.rows.push(row);
    });
    return $scope.chartDataAvailable = true;
  };

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

  $scope.goToReports = function() {
    $rootScope.stateParam = {'frmDt': $scope.fromDate, 'toDt': $scope.toDate, 'type': 'networth'};
    return $state.go('Reports',{'frmDt': $scope.fromDate, 'toDt': $scope.toDate, 'type': 'networth'});
  };

  $scope.$on('company-changed', function(event,changeData) {
    if ((changeData.type === 'CHANGE') || (changeData.type === 'SELECT')) {
      $scope.setDateByFinancialYear();
      return $scope.getComData($scope.fromDate,$scope.toDate);
    }
  });


  return $scope.$on('reloadAll', function(event) {
    $scope.hardRefresh = true;
    $scope.setDateByFinancialYear();
    return $scope.getComData($scope.fromDate,$scope.toDate);
  });
};

combined.controller('combinedController',combinedController)

.directive('combined',[($locationProvider,$rootScope) => ({
  restrict: 'E',
  templateUrl: '/public/webapp/Dashboard/networthNprofitloss/combined.html'
}) ]);