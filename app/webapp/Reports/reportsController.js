let reportsController = function($scope, $rootScope, localStorageService, toastr, groupService, $filter, reportService, $stateParams) {
  $scope.today = new Date();
  $scope.fromDate = {date: new Date()};
  $scope.toDate = {date: new Date()};
  $scope.fromPLDate = {date: new Date()};
  $scope.toPLDate = {date: new Date()};
  $scope.fromNWDate = {date: new Date()};
  $scope.toNWDate = {date: new Date()};
  $scope.fromDatePickerIsOpen = false;
  $scope.toDatePickerIsOpen = false;
  $scope.GroupsAndAccounts = [];
  $scope.selected = {
    groups: [],
    accounts: [],
    interval: 'Daily',
    filterBy: 'Closing Balance',
    createChartBy : 'Closing Balance',
    createChartByMultiple: [],
    filteredGroupsAndAccounts: {}
  };
  $scope.tabs = [
    {title:'Historical Comparision', active: true},
    {title:'Profit & Loss', active: false},
    {title:'Net Worth', active: false}
  ];
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
  // variable to show chart on ui
  $scope.chartDataAvailable = true;
  $scope.showFilters = false;
  // parameters required to create graph
  $scope.series = [];
  $scope.chartData = [];
  $scope.labels = [];
  $scope.plSeries = [];
  $scope.plChartData = [];
  $scope.plLabels = [];
  $scope.nwSeries = [];
  $scope.nwChartData = [];
  $scope.nwLabels = [];
  $scope.chartOptions = {
    datasetFill:false
  };
  $scope.chartTypes = ['Bar', 'Line'];
  $scope.chartType = $scope.chartTypes[1];
  $scope.listBeforeLimit = {
    groups: [],
    accounts: []
  };
  $scope.noData = false;
  $rootScope.selectedCompany = localStorageService.get("_selectedCompany");

  $rootScope.getFlatAccountList($rootScope.selectedCompany.uniqueName);

  $scope.fromDatePickerOpen = function() {
    return this.fromDatePickerIsOpen = true;
  };

  $scope.toDatePickerOpen = function() {
    return this.toDatePickerIsOpen = true;
  };

//  $scope.intervalVals = [1, 3, 7, 30, 90, 180, 365]
  $scope.intervalVals = ["Daily", "Weekly", "Bi-Weekly","Monthly", "Yearly"];
  $scope.chartParams = ['Closing Balance', 'Credit Total', 'Debit Total'];

  $scope.getAccountsGroupsList = function(){
    $rootScope.selectedCompany = localStorageService.get("_selectedCompany");
    $scope.showAccountList = false;
    if (_.isEmpty($rootScope.selectedCompany)) {
      return toastr.error("Select company first.", "Error");
    } else {
      return groupService.getGroupsWithAccountsInDetail($rootScope.selectedCompany.uniqueName).then($scope.getGroupsSuccess,
        $scope.getGroupsFailure);
    }
  };

  $scope.getGroupsSuccess = function(res) {
    $scope.groupList = res.body;
    $scope.flattenGroupList = groupService.flattenGroup($scope.groupList, []);
    $scope.flatAccntWGroupsList = groupService.flattenGroupsWithAccounts($scope.flattenGroupList);
    $scope.sortGroupsAndAccounts($scope.flatAccntWGroupsList);
    // $scope.selected.groups = [$scope.groups[0]]
    // $scope.selected.accounts = [$scope.accounts[0]]
    if (($scope.groups.length < 1) && ($scope.accounts.length < 1)) {
      $scope.noData = true;
    }
    return $rootScope.showLedgerBox = true;
  };

  $scope.getGroupsFailure = res => toastr.error(res.data.message, res.data.status);

  //sort groups and accounts lists
  
  $scope.sortGroupsAndAccounts =  function(dataArray) {
    $scope.groups = [];
    $scope.accounts = [];
    return _.each(dataArray,function(obj) {
      let group = {};
      group.name = obj.groupName;
      group.uniqueName = obj.groupUniqueName;
      $scope.groups.push(group);
      $scope.listBeforeLimit.groups.push(group);
      if (obj.accountDetails.length > 0) {
        return _.each(obj.accountDetails, function(acc) {
          let account = {};
          account.name = acc.name;
          account.uniqueName = acc.uniqueName;
          $scope.accounts.push(account);
          return $scope.listBeforeLimit.accounts.push(account);
        });
      }
    });
  };

  $scope.createArrayWithUniqueName = function(dataArray) {
    let finalArray = [];
    _.each(dataArray, obj => finalArray.push(obj.uniqueName));
    return finalArray;
  };


  $scope.getAccountsGroupsList();
  
  $scope.formatGraphData = function(graphData) {
    $scope.series = [];
    $scope.chartData = [];
    $scope.labels = [];
    $scope.GroupsAndAccounts = [];
    let data = graphData;
    let groups = [];
    let accounts = [];


    if (data.groups.length > 0) {
      _.each(data.groups ,grp => groups.push(grp));
    }

    if ((data.accounts !== null) && (data.accounts.length > 0)) {
      _.each(data.accounts, acc => accounts.push(acc));
    }

    if (groups.length > 0) {
      _.each(groups, function(grp) {
        let grpObj = {
          category: '',
          forSeries:{
            dr: '',
            cr: '',
            cb: ''
          },
          forData: {
            dr: [],
            cr: [],
            cb: []
          },
          forLabels: []
        };
        let fgrp = {
          name: '',
          category: '',
          forfilter:{
            cb: {
              type: 'cb',
              val: false
            },
            cr: {
              type: 'cr',
              val: false
            },
            dr: {
              type: 'dr',
              val: false
            }
          }
        };
        grpObj.category = grp.category;
        grpObj.forSeries.dr = grp.name + " (DR)";
        grpObj.forSeries.cr = grp.name + " (CR)";
        grpObj.forSeries.cb = grp.name + " (C/B)";
        fgrp.name = grp.name;
        fgrp.category = grp.category;
        
        if (grp.intervalBalances.length > 0) {
          _.each(grp.intervalBalances, function(bal) {
            grpObj.forData.dr.push(bal.debitTotal);
            grpObj.forData.cr.push(bal.creditTotal);
            grpObj.forData.cb.push(bal.closingBalance.amount);
            return grpObj.forLabels.push(bal.to);
          });
        }

        switch (grpObj.category.toLowerCase()) {
          case "assets":
            $scope.series.push(grpObj.forSeries.dr);
            $scope.series.push(grpObj.forSeries.cb);
            $scope.chartData.push(grpObj.forData.dr);
            $scope.chartData.push(grpObj.forData.cb);
            fgrp.forfilter.cb.val = true;
            fgrp.forfilter.dr.val = true;
            break;

          case "liabilities":
            $scope.series.push(grpObj.forSeries.cr);
            $scope.series.push(grpObj.forSeries.cb);
            $scope.chartData.push(grpObj.forData.cr);
            $scope.chartData.push(grpObj.forData.cb);
            fgrp.forfilter.cb.val = true;
            fgrp.forfilter.cr.val = true;
            break;
          case "income":
            $scope.series.push(grpObj.forSeries.cr);
            $scope.series.push(grpObj.forSeries.cb);
            $scope.chartData.push(grpObj.forData.cr);
            $scope.chartData.push(grpObj.forData.cb);
            fgrp.forfilter.cb.val = true;
            fgrp.forfilter.cr.val = true;
            break;

          case "expenses":
            $scope.series.push(grpObj.forSeries.dr);
            $scope.series.push(grpObj.forSeries.cb);
            $scope.chartData.push(grpObj.forData.dr);
            $scope.chartData.push(grpObj.forData.cb);
            fgrp.forfilter.cb.val = true;
            fgrp.forfilter.dr.val = true;
            break;
        }

        $scope.labels = grpObj.forLabels;
        return $scope.GroupsAndAccounts.push(fgrp);
      });
    }

    if (accounts.length > 0) {
      _.each(accounts, function(acc) {
        let accObj = {
          category: '',
          forSeries:{
            dr: '',
            cr: '',
            cb: ''
          },
          forData: {
            dr: [],
            cr: [],
            cb: []
          },
          forLabels: []
        };
        let facc = {
          name: '',
          category: '',
          forfilter:{
            cb: {
              type: 'cb',
              val: false
            },
            cr: {
              type: 'cr',
              val: false
            },
            dr: {
              type: 'dr',
              val: false
            }
          }
        };
        accObj.category = acc.category;
        accObj.forSeries.dr = acc.name + " (DR)";
        accObj.forSeries.cr = acc.name + " (CR)";
        accObj.forSeries.cb = acc.name + " (C/B)";
        facc.name = acc.name;
        facc.category = acc.category;
        
        if (acc.intervalBalances.length > 0) {
          _.each(acc.intervalBalances, function(bal) {
            accObj.forData.dr.push(bal.debitTotal);
            accObj.forData.cr.push(bal.creditTotal);
            accObj.forData.cb.push(bal.closingBalance.amount);
            return accObj.forLabels.push(bal.to);
          });
        }

        switch (accObj.category.toLowerCase()) {
          case "assets":
            $scope.series.push(accObj.forSeries.dr);
            $scope.series.push(accObj.forSeries.cb);
            $scope.chartData.push(accObj.forData.dr);
            $scope.chartData.push(accObj.forData.cb);
            facc.forfilter.cb.val = true;
            facc.forfilter.dr.val = true;
            break;

          case "liabilities":
            $scope.series.push(accObj.forSeries.cr);
            $scope.series.push(accObj.forSeries.cb);
            $scope.chartData.push(accObj.forData.cr);
            $scope.chartData.push(accObj.forData.cb);
            facc.forfilter.cb.val = true;
            facc.forfilter.cr.val = true;
            break;

          case "income":
            $scope.series.push(accObj.forSeries.cr);
            $scope.series.push(accObj.forSeries.cb);
            $scope.chartData.push(accObj.forData.cr);
            $scope.chartData.push(accObj.forData.cb);
            facc.forfilter.cb.val = true;
            facc.forfilter.cr.val = true;
            break;

          case "expenses":
            $scope.series.push(accObj.forSeries.dr);
            $scope.series.push(accObj.forSeries.cb);
            $scope.chartData.push(accObj.forData.dr);
            $scope.chartData.push(accObj.forData.cb);
            facc.forfilter.cb.val = true;
            facc.forfilter.dr.val = true;
            break;
        }
        if (groups.length < 1) {    
          $scope.labels = accObj.forLabels;
        }
          
        return $scope.GroupsAndAccounts.push(facc);
      });
    }

    // set variable to show chart on ui
    $scope.chartDataAvailable = true;
    return $scope.showFilters = true;
  };

  $scope.filterGraph = function(arg) {
    let seriesIdc = [];
    let { series } = $scope;
    let idx = 0;
    let { chartData } = $scope;
    let targetData = {};
    let { groups } = $scope.graphData;
    let { accounts } = $scope.graphData;
    let grpacc = [];
    let filteredObj = {};
    let selectedValue = $scope.selected.filteredGroupsAndAccounts;

    _.each(groups, grp => grpacc.push(grp));
    _.each(accounts, acc => grpacc.push(acc));

    if (!_.isEmpty(selectedValue)) {
      while (idx < series.length) {
        if (series[idx].indexOf(selectedValue.name) !== -1) {
          seriesIdc.push(idx);
        }
        idx++;
      }

      return _.each(grpacc, function(obj) {
        if (obj.name === selectedValue.name) {
          let addAtIdx, removeAtIdx;
          let dataObj = {
            forSeries: {
              dr: obj.name + ' (DR)',
              cr: obj.name + ' (CR)',
              cb: obj.name + ' (C/B)'
            },
            forData: {
              dr: [],
              cr: [],
              cb: []
            }
          };  
          _.each(obj.intervalBalances, function(bal) {
            dataObj.forData.cb.push(bal.closingBalance.amount);
            dataObj.forData.cr.push(bal.creditTotal);
            return dataObj.forData.dr.push(bal.debitTotal);
          });

          filteredObj = dataObj;

          switch (arg.type) {
            case "cr":
              if ((arg.val === true) && ($scope.series.indexOf(filteredObj.forSeries.cr) === -1)) {
                addAtIdx = seriesIdc[seriesIdc.length-1];
                $scope.series.splice(addAtIdx, 0, filteredObj.forSeries.cr);
                return $scope.chartData.splice(addAtIdx, 0, filteredObj.forData.cr);
              } else if ((arg.val === false) && ($scope.series.indexOf(filteredObj.forSeries.cr) !== -1)) {
                removeAtIdx = seriesIdc[seriesIdc.length-1] - 1; 
                $scope.series.splice(removeAtIdx, 1);
                return $scope.chartData.splice(removeAtIdx, 1);
              }
              break;
            case "dr":
              if ((arg.val === true) && ($scope.series.indexOf(filteredObj.forSeries.dr) === -1)) {             
                addAtIdx = seriesIdc[seriesIdc.length-1];
                $scope.series.splice(addAtIdx, 0, filteredObj.forSeries.dr);
                return $scope.chartData.splice(addAtIdx, 0, filteredObj.forData.dr);
              } else if ((arg.val === false) && ($scope.series.indexOf(filteredObj.forSeries.dr) !== -1)) {
                removeAtIdx = $scope.series.indexOf(filteredObj.forSeries.dr); 
                $scope.series.splice(removeAtIdx, 1);
                return $scope.chartData.splice(removeAtIdx, 1);
              }
              break;
            case "cb":
              if ((arg.val === true) && ($scope.series.indexOf(filteredObj.forSeries.cb) === -1)) {             
                addAtIdx = seriesIdc[seriesIdc.length-1];
                $scope.series.splice(addAtIdx, 0, filteredObj.forSeries.cb);
                return $scope.chartData.splice(addAtIdx, 0, filteredObj.forData.cb);
              } else if ((arg.val === false) && ($scope.series.indexOf(filteredObj.forSeries.cb) !== -1)) {
                removeAtIdx = $scope.series.indexOf(filteredObj.forSeries.cb); 
                $scope.series.splice(removeAtIdx, 1);
                return $scope.chartData.splice(removeAtIdx, 1);
              }
              break;
          }
        }
      });                 
    }
  };

  $scope.getGraphData  = (reqParam,graphParam) => reportService.historicData(reqParam, graphParam).then($scope.getGraphDataSuccess, $scope.getGraphDataFailure);

  $scope.getGraphDataSuccess = function(res) {
    $scope.graphData = res.body;
    return $scope.formatGraphData($scope.graphData);
  };

  $scope.getGraphDataFailure = function(res) {
    $scope.chartDataAvailable = true;
    return toastr.error(res.data.message, res.data.status);
  };

  $scope.generateGraph = function() {
    $scope.chartDataAvailable = false;
    $scope.showFilters = false;
    let reqParam = {
      'cUname': $rootScope.selectedCompany.uniqueName,
      'fromDate': $filter('date')($scope.fromDate.date,'dd-MM-yyyy'),
      'toDate': $filter('date')($scope.toDate.date, "dd-MM-yyyy"),
      'interval': $scope.selected.interval 
    };
    let graphParam = {
      'groups' : $scope.createArrayWithUniqueName($scope.selected.groups),
      'accounts' : $scope.createArrayWithUniqueName($scope.selected.accounts)
    };
    if (($scope.selected.groups.length > 0) || ($scope.selected.accounts.length > 0)) {
      return $scope.getGraphData(reqParam, graphParam);
    } else {
      toastr.error('Please select atleast one group or account to create graph');
      return $scope.chartDataAvailable = true;
    }
  };
    
  $scope.$watch('selected.groups', function(newVal, oldVal){
    if (newVal !== oldVal) {
      if (newVal.length > 3) {
        $scope.groups = [];
        return toastr.info('You can only select 4 Groups at a time.');
      } else if (newVal.length < 4) {
        return $scope.groups = $scope.listBeforeLimit.groups;
      }
    }
  }); 

  $scope.$watch('selected.accounts', function(newVal, oldVal){
    if (newVal !== oldVal) {
      if (newVal.length > 3) {
        $scope.accounts = [];
        return toastr.info('You can only select 4 Accounts at a time.');
      } else if (newVal.length < 4) {
        return $scope.accounts = $scope.listBeforeLimit.accounts;
      }
    }
  });

  $scope.$watch('fromDate.date', function(newVal,oldVal) {
    let oldDate = new Date(oldVal).getTime();
    let newDate = new Date(newVal).getTime();

    let toDate = new Date($scope.toDate.date).getTime();

    if (newDate > toDate) {
      return $scope.toDate.date =  newDate;
    }
  });

  // for profit and loss graphs
  $scope.showHistoryFilters = true;
  $scope.showPLGraphFilters = false;
  $scope.showNWfilters = false;

  $scope.showPLFilter = function() {
    $scope.showPLGraphFilters = true;
    $scope.showNWfilters = false;
    return $scope.showHistoryFilters = false;
  };

  $scope.showHistoryFilter = function() {
    $scope.showPLGraphFilters = false;
    $scope.showNWfilters = false;
    return $scope.showHistoryFilters = true;
  };

  $scope.showNWfilter = function() {
    $scope.showPLGraphFilters = false;
    $scope.showNWfilters = true;
    return $scope.showHistoryFilters = false;
  };
  

  $scope.getPLgraphData = reqParam => reportService.profitLossData(reqParam).then($scope.getPLgraphDataSuccess, $scope.getPLgraphDataFailure);

  $scope.getPLgraphDataSuccess = function(res) {
    $scope.plGraphData = res.body;
    $scope.formatPLgraphData($scope.plGraphData);
    return $scope.chartDataAvailable = true;
  };
    
  $scope.getPLgraphDataFailure = function(res) {
    $scope.chartDataAvailable = true;
    return toastr.error(res.data.message);
  };

  $scope.generatePLgraph = function() {
    let reqParam = {
      'cUname': $rootScope.selectedCompany.uniqueName,
      'fromDate': $filter('date')($scope.fromPLDate.date,'dd-MM-yyyy'),
      'toDate': $filter('date')($scope.toPLDate.date, "dd-MM-yyyy"),
      'interval': $scope.selected.interval 
    };
    $scope.getPLgraphData(reqParam); 
    return $scope.chartDataAvailable = false;
  };

  $scope.formatPLgraphData = function(plData) {
    $scope.plSeries = [];
    $scope.plChartData = [];
    $scope.plLabels = [];

    let monthlyBalances = [];
    let yearlyBalances = [];

    _.each(plData.periodBalances, function(pl) {
      $scope.plLabels.push(pl.to);
      monthlyBalances.push(pl.monthlyBalance);
      $scope.plSeries.push('Monthly Balances');
      yearlyBalances.push(pl.yearlyBalance);
      return $scope.plSeries.push('Yearly Balances');
    });

    $scope.plChartData.push(monthlyBalances, yearlyBalances);
    return $scope.chartDataAvailable = true;
  };

  $scope.$watch('fromPLDate.date', function(newVal,oldVal) {
    let oldDate = new Date(oldVal).getTime();
    let newDate = new Date(newVal).getTime();

    let toDate = new Date($scope.toDate.date).getTime();

    if (newDate > toDate) {
      return $scope.toDate.date =  newDate;
    }
  });

  // for networth graph

  $scope.getNWgraphData = reqParam => reportService.networthData(reqParam).then($scope.getNWgraphDataSuccess, $scope.getNWgraphDataFailure);

  $scope.getNWgraphDataSuccess = function(res) {
    $scope.nwGraphData = res.body;
    return $scope.formatNWgraphData(($scope.nwGraphData));
  };

  $scope.getNWgraphDataFailure = function(res) {
    $scope.chartDataAvailable = true;
    return toastr.error(res.data.message);
  };

  $scope.generateNWgraph = function() {
    let reqParam = {
      'cUname': $rootScope.selectedCompany.uniqueName,
      'fromDate': $filter('date')($scope.fromNWDate.date,'dd-MM-yyyy'),
      'toDate': $filter('date')($scope.toNWDate.date, "dd-MM-yyyy"),
      'interval': $scope.selected.interval 
    };
    $scope.getNWgraphData(reqParam); 
    return $scope.chartDataAvailable = false;
  };

  $scope.formatNWgraphData = function(nwData) {
    $scope.nwSeries = [];
    $scope.nwChartData = [];
    $scope.nwLabels = [];

    let monthlyBalances = [];
    let yearlyBalances = [];

    _.each(nwData.periodBalances, function(nw) {
      $scope.nwLabels.push(nw.to);
      monthlyBalances.push(nw.monthlyBalance);
      $scope.nwSeries.push('Monthly Balances');
      yearlyBalances.push(nw.yearlyBalance);
      return $scope.nwSeries.push('Yearly Balances');
    });

    $scope.nwChartData.push(monthlyBalances, yearlyBalances);
    return $scope.chartDataAvailable = true;
  };
  
   //---------get flat accounts list------#
//  $rootScope.getFlatAccountList($rootScope.selectedCompany.uniqueName)
//  $scope.flatAccList = {
//    page: 1
//    count: 5
//    totalPages: 0
//    currentPage : 1
//  }

  $scope.getFlatAccountList = compUname => $rootScope.getFlatAccountList(compUname);
//    reqParam = {
//      companyUniqueName: compUname
//      q: ''
//      page: $scope.flatAccList.page
//      count: $scope.flatAccList.count
//    }
//    groupService.getFlatAccList(reqParam).then($scope.getFlatAccountListListSuccess, $scope.getFlatAccountListFailure)

  $scope.getFlatAccountListListSuccess = res => $rootScope.fltAccntListPaginated = res.body.results;

  $scope.getFlatAccountListFailure = res => toastr.error(res.data.message);

//  $scope.getFlatAccountList($rootScope.selectedCompany.uniqueName)

  // search flat accounts list
  $rootScope.searchAccounts = function(str) {
    let reqParam = {};
    reqParam.companyUniqueName = $rootScope.selectedCompany.uniqueName;
    if (str.length > 2) {
      reqParam.q = str;
      return groupService.getFlatAccList(reqParam).then($scope.getFlatAccountListListSuccess, $scope.getFlatAccountListFailure);
    } else {
      reqParam.q = '';
      reqParam.count = 5;
      return groupService.getFlatAccList(reqParam).then($scope.getFlatAccountListListSuccess, $scope.getFlatAccountListFailure);
    }
  };

  $scope.$watch('fromNWDate.date', function(newVal,oldVal) {
    let oldDate = new Date(oldVal).getTime();
    let newDate = new Date(newVal).getTime();

    let toDate = new Date($scope.toDate.date).getTime();

    if (newDate > toDate) {
      return $scope.toDate.date =  newDate;
    }
  });

  $scope.$on('$stateChangeSuccess', function(params) {
//    console.log($rootScope.stateParams)
    if ($stateParams !== null) {
      if ($stateParams.type === "networth") {
        $scope.tabs[2].active = true;
        $scope.tabs[0].active = false;
        $scope.tabs[1].active = false;
        $scope.selected.interval = "Monthly";
        $scope.fromNWDate.date = $stateParams.frmDt;
        $scope.toNWDate.date = $stateParams.toDt;
        return $scope.generateNWgraph();
      }
    }
  });

  return $scope.$on('company-changed' , () => $scope.getAccountsGroupsList());
};

giddh.webApp.controller('reportsController', reportsController);