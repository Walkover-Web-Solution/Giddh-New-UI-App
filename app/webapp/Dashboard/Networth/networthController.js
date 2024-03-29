let networth = angular.module('networthModule', [
//"networthControllers"
//"networthDirectives"
]);

let networthController = function($scope, $rootScope, localStorageService, toastr, groupService, $filter, reportService, $timeout, $state, $http, $window, $stateParams) {
  $scope.unq = 0;
  $scope.monthArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  $scope.series = ['Net worth'];
  $scope.chartData = [
    [1424785, 1425744, 1425874, 1425985, 1435200, 1432999, 1437010]
  ];
  $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
  $scope.chartOptions = {
    datasetFill:true
  };
  $scope.chartDataAvailable = false;
  $scope.errorMessage = "";
  $scope.fromDate = moment().format('DD-MM-YYYY');
  $scope.toDate = moment().format('DD-MM-YYYY');
  $scope.myChartData = {
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
        format: 'long',
        scaleType: 'mirrorLog'
      }
    }
  };

  $scope.getNetWorthData = function() {
//    get net worth data here
    $scope.chartDataAvailable = false;
    $scope.errorMessage = "";
    if (_.isUndefined($rootScope.selectedCompany)) {
      $rootScope.selectedCompany = localStorageService.get("_selectedCompany");
    }
    if ($rootScope.currentFinancialYear === undefined) {
      return $timeout(( () => $scope.getNetWorthData()),2000);
    } else {
      $scope.setDateByFinancialYear();
      return $scope.getNWdata($scope.fromDate,$scope.toDate);
    }
  };

  // for networth graph

  $scope.getNWdata = function(fromDate, toDate) {
    $scope.errorMessage = "";
    $scope.chartDataAvailable = false;
    let reqParam = {
      'cUname': $rootScope.selectedCompany.uniqueName,
      'fromDate': fromDate,
      'toDate': toDate,
      'interval': "monthly"
    };
    return $scope.getNWgraphData(reqParam);
  };

  $scope.getNWgraphData = reqParam =>
//    config = [
//      headers:{
//        'Auth-Key': $window.sessionStorage._ak
//      }
//    ]
//    $http.get("https://api.giddh.com/company/"+$rootScope.selectedCompany.uniqueName+"/networth?from="+reqParam.fromDate+"&to="+reqParam.toDate+"&interval=monthly",config).then($scope.getNWgraphDataSuccess, $scope.getNWgraphDataFailure)
    reportService.networthData(reqParam).then($scope.getNWgraphDataSuccess, $scope.getNWgraphDataFailure)
  ;

  $scope.getNWgraphDataSuccess = function(res) {
    $scope.errorMessage = "";
    let nwGraphData = res.body;
    return $scope.formatNWgraphData((nwGraphData));
  };

  $scope.getNWgraphDataFailure = function(res) {
    if (res.data.code === "INVALID_DATE") {
      let setDate = "";
      if (moment().get('months') > 4) {
        setDate = `01-04-${moment().get('YEARS')}`;
      } else {
        setDate = `01-04-${moment().subtract(1, 'years').get('YEARS')}`;
      }
      $scope.fromDate = setDate;
      $scope.toDate = moment().format('DD-MM-YYYY');
      return $scope.getNWdata(setDate,moment().format('DD-MM-YYYY'));
    } else {
      $scope.chartDataAvailable = false;
      $scope.chartData = [];
      //    toastr.error(res.data.message)
      return $scope.errorMessage = res.data.message;
    }
  };

  $scope.formatNWgraphData = function(nwData) {
    $scope.myChartData.data.rows = [];
    $scope.nwSeries = [];
    $scope.nwChartData = [];
    $scope.nwLabels = [];
    let monthlyBalances = [];
    let yearlyBalances = [];
    _.each(nwData.periodBalances, function(nw) {
      let row = {};
      row.c = [];
      let str = $scope.monthArray[moment(nw.to, 'DD-MM-YYYY').get('months')] + moment(nw.to, 'DD-MM-YYYY').get('y');
      $scope.nwLabels.push(str);
      monthlyBalances.push(nw.monthlyBalance);
      $scope.nwSeries.push('Monthly Balances');
      yearlyBalances.push(nw.yearlyBalance);
      $scope.nwSeries.push('Yearly Balances');
      row.c.push({v:str});
      row.c.push({v:nw.monthlyBalance});
      row.c.push({v:nw.yearlyBalance});
      return $scope.myChartData.data.rows.push(row);
    });

    $scope.chartData = [];
    $scope.chartData.push(yearlyBalances);
    $scope.labels = [];
    $scope.labels = $scope.nwLabels;
    return $scope.chartDataAvailable = true;
  };

  $scope.setDateByFinancialYear = function() {
    let presentYear = $scope.getPresentFinancialYear();
    if ($rootScope.currentFinancialYear === presentYear) {
      if ($rootScope.selectedCompany.financialYears.length > 1) {
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
//    $stateParams.frmDt = $scope.fromDate
//    $stateParams.toDt = $scope.toDate
//    $stateParams.type = "networth"
    $rootScope.stateParam = {'frmDt': $scope.fromDate, 'toDt': $scope.toDate, 'type': 'networth'};
//    url = $state.href('Reports', {'params':{'frmDt': $scope.fromDate, 'toDt': $scope.toDate, 'type': 'networth'}});
//    window.open(url,'_blank');
//    return true
    return $state.go('Reports',{'frmDt': $scope.fromDate, 'toDt': $scope.toDate, 'type': 'networth'});
  };

  return $scope.$on('company-changed', function(event,changeData) {
    if (changeData.type === 'CHANGE') {
      $scope.setDateByFinancialYear();
      return $scope.getNWdata($scope.fromDate,$scope.toDate);
    }
  });
};


networth.controller('networthController', networthController)


.directive('netWorth',[() => ({
  restrict: 'E',
  templateUrl: 'public/webapp/Dashboard/Networth/net-worth.html',
//  controller: 'networthController'
  link(scope,elem,attr) {}
  //    console.log "networth scope : ",scope
}) ]);
