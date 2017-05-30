let tbplController = function($scope, $rootScope, trialBalService, localStorageService, $filter, toastr, $timeout, $window, companyServices, $state, FileSaver) {
  let tb = this;
  $scope.showTbplLoader = true;
  $scope.showBSLoader = true;
  $scope.showPLLoader = true;
  $scope.inProfit = true;
  $scope.expanded = false;
  $scope.today = new Date();
  $scope.fromDate = {date: new Date()};
  $scope.toDate = {date: new Date()};
  $scope.fromDatePickerIsOpen = false;
  $scope.toDatePickerIsOpen = false;
  $scope.showOptions = false;
  $scope.plShowOptions = false;
  $scope.sendRequest = true;
  $scope.showChildren = false;
  $scope.showpdf = false;
  $scope.showTbXls = false;
  $scope.showNLevel = false;
  $rootScope.cmpViewShow = true;
  $scope.showClearSearch = false;
  $scope.noData = false;
  $scope.enableDownload = true;
  $scope.keyWord = {
    query: ''
  };
  $scope.dateOptions = {
    'year-format': "'yy'",
    'starting-day': 1,
    'showWeeks': false,
    'show-button-bar': false,
    'year-range': 1,
    'todayBtn': false
  };
  $scope.plData = {
    closingBalance: 0,
    incomeTotal: 0,
    expenseTotal: 0
  };
  $scope.format = "dd-MM-yyyy";
  $scope.exportData = [];
  // $scope.filteredExportData = []
  // $scope.addToExportNow = false
  $scope.filteredTotal = {
    exportingFiltered: false,
    openingBalance: 0,
    creditTotal: 0,
    debitTotal: 0,
    closingBalance: 0
  };


  $scope.balSheet = {
    liabilities : [],
    assets : [],
    assetTotal : 0,
    liabTotal : 0
  };
  
  $scope.fy = {
    fromYear: '',
    toYear: ''
  };

  $scope.hardRefresh = false;
  $scope.bsHardRefresh = false;
  $scope.plHardRefresh = false;

  $scope.fyChecked = false;

  $scope.fromDatePickerOpen = function() {
    return this.fromDatePickerIsOpen = true;
  };

  $scope.toDatePickerOpen = function() {
    return this.toDatePickerIsOpen = true;
  };

  $rootScope.selectedCompany = localStorageService.get("_selectedCompany");
  $scope.activeFinancialYear = localStorageService.get("activeFY");

  tb.getActiveFinancialYearIndex = function(activeFY, financialYears) {
    $scope.tempFYIndex = 0;
    _.each(financialYears, function(fy, index) {
      if (fy.uniqueName === activeFY.uniqueName) {
        if(index === 0) {
          return $scope.tempFYIndex = index;
        } else {
          return $scope.tempFYIndex = index * -1;
        }
      }
    });
    return $scope.tempFYIndex; 
  };

  $scope.getFYs = function(companyUniqueName) {
    this.fySuccess = function(res) {
      $scope.financialYears = res.body.financialYears;
      $scope.activeBSFYIndex = tb.getActiveFinancialYearIndex($scope.activeFinancialYear, $scope.financialYears);
      return $scope.activePLFYIndex = tb.getActiveFinancialYearIndex($scope.activeFinancialYear, $scope.financialYears);
    };
    this.fyFailure = res => toastr.error(res.data.message);
    return companyServices.getFY(companyUniqueName).then(this.fySuccess, this.fyFailure);    
  };

  $scope.activeBSFYIndex = 0;
  $scope.activePLFYIndex = 0;
  $scope.financialYears = [];
  $scope.getFYs($rootScope.selectedCompany.uniqueName);

  // financial year functions
  $rootScope.setActiveFinancialYear($scope.activeFinancialYear);

  $scope.getDateObj = function(date) {
    let dateArray = date.split('-');
    date = new Date(dateArray[2], dateArray[1] - 1, dateArray[0]);
    return date; 
  };

  $scope.checkFY = function(reqParam) {
    let currentYear = moment().get('year');
    let currentFY =  $rootScope.activeYear.start;
    $scope.fromDate.date = $scope.getDateObj($rootScope.fy.financialYearStarts);
    $scope.toDate.date = $scope.getDateObj($rootScope.fy.financialYearEnds);
    reqParam.fromDate = $filter('date')($scope.fromDate.date, 'dd-MM-yyyy');
    return reqParam.toDate = $filter('date')($scope.toDate.date, 'dd-MM-yyyy');
  };

  // p&l functions
  $scope.calCulateTotalIncome = function(data) {
    let eTtl = 0;
    _.each(data, function(item) {
      if (item.closingBalance.type === 'DEBIT') {
        return eTtl -= Number(item.closingBalance.amount);
      } else {
        return eTtl += Number(item.closingBalance.amount);
      }
    });
    return Number((eTtl).toFixed(2));
  };

  $scope.calCulateTotalExpense = function(data) {
    let eTtl = 0;
    _.each(data, function(item) {
      if (item.closingBalance.type === 'CREDIT') {
        return eTtl -= Number(item.closingBalance.amount);
      } else {
        return eTtl += Number(item.closingBalance.amount);
      }
    });
    return Number((eTtl).toFixed(2));
  };


  $scope.filterBSData = function(data) {
    $scope.balSheet.assets = [];
    $scope.balSheet.liabilities = [];
    return _.each(data, function(grp) {
      switch (grp.category) {
        case 'assets':
          return $scope.balSheet.assets.push(grp);
        case 'liabilities':
          return $scope.balSheet.liabilities.push(grp);
      }
    });
  };

  $scope.makeDataForBS = function(data) {
    $scope.filterBSData(data.groupDetails);
    $scope.balSheet.assetTotal = $scope.calCulateTotalAssets($scope.balSheet.assets);
    return $scope.balSheet.liabTotal = $scope.calCulateTotalLiab($scope.balSheet.liabilities);
  };
    // if $scope.inProfit == false
    //   $scope.balSheet.assetTotal += $scope.plData.closingBalance
    // else if $scope.inProfit == true
    //   $scope.balSheet.liabTotal += $scope.plData.closingBalance

  $scope.filterPlData = function(data) {
    let filterPlData = {};
    filterPlData.incArr = [];
    filterPlData.expArr = [];
    filterPlData.othArr = [];
    let income = [];
    let expenses = [];
    let others = [];
    _.each(data, function(grp) {
      switch (grp.category) {
        case 'income':
          return income.push(grp);
        case 'expenses':
          return expenses.push(grp);
        default:
          return others.push(grp);
      }
    });
    _.each(others, obj => filterPlData.othArr.push(obj)); 
    _.each(income, inc => filterPlData.incArr.push(inc));
    _.each(expenses, exp => filterPlData.expArr.push(exp));
    return filterPlData;
  };

  $scope.makeDataForPl = function(data) {
    let fData = $scope.filterPlData(data.groupDetails);
    $scope.plData = _.omit(fData, "othArr");
    $scope.plData.expenseTotal = $scope.calCulateTotalExpense(fData.expArr);
    $scope.plData.incomeTotal = $scope.calCulateTotalIncome(fData.incArr);
    let clB = $scope.plData.incomeTotal - $scope.plData.expenseTotal;

    $scope.plData.closingBalance = Math.abs(clB);

    if ($scope.plData.incomeTotal >= $scope.plData.expenseTotal) {
      //console.info "Income is Greater"
      $scope.inProfit = true;
      $scope.plData.expenseTotal += $scope.plData.closingBalance;
    }
    if ($scope.plData.incomeTotal < $scope.plData.expenseTotal) {
      //console.info "expenses is Greater"
      $scope.inProfit = false;
      return $scope.plData.incomeTotal += $scope.plData.closingBalance;
    }
  };
    

  $scope.exportPLdataHorizontal = function(e) {
    let { plData } =  $scope;
    let zippedData = _.zip($scope.plData.expArr, $scope.plData.incArr);
    let csv = '';
    let row = '';
    let header = '';
    let title = 'EXPENSES,,,INCOME\r\nParticular,Amount,,Particular,Amount\r\n\r\n';
    $scope.fnProfitLoss = "Profit-and-Loss.csv";

    let companyDetails = $rootScope.selectedCompany;
    header = companyDetails.name + '\r\n' + '"'+companyDetails.address+'"' + '\r\n' + companyDetails.city + '-' + companyDetails.pincode + '\r\n' + 'Profit and Loss' + ': ' + $filter('date')($scope.fromDate.date,'dd-MM-yyyy') + ' to ' + $filter('date')($scope.toDate.date,
      "dd-MM-yyyy") + '\r\n';
    csv += header + '\r\n' + title;

    
    _.each(zippedData, function(row) {
      let index = 1;
      return _.each(row, function(val) {
        csv += val.groupName + ',' + val.closingBalance.amount + ',' + '' + ','; 
        if ((index % 2) === 0) {
          csv += '\r\n';
        }
        return index = index + 1;
      });
    });

    if (plData.closingBalance > 0) {
      csv += `\r\nProfit,${plData.closingBalance}\r\n`;
    } else if (plData.closingBalance < 0) {
      csv += `\r\n,,Loss,${plData.closingBalance}\r\n`;
    }

    csv += `Total,${plData.expenseTotal},,Total,${plData.incomeTotal}`;

    csv += row + '\r\n';
    
    $scope.csvPL = csv;

    $scope.profitLoss = `data:text/csv;charset=utf-8,${escape(csv)}`;
    $scope.plShowOptions = false;
    return e.stopPropagation();
  };

  $scope.exportPLdataVertical = function(e) {
    let { plData } =  $scope;
    let csv = '';
    let incRow = '';
    let expRow = '';
    let incTotal = '';
    let expTotal = '';
    let header = '';
    let total = '';
    let expTitle = 'EXPENSES\r\nParticular,Amount\r\n';
    let incTitle = 'INCOME\r\nParticular,Amount\r\n';
    $scope.fnProfitLoss = "Profit-and-Loss.csv";

    let companyDetails = $rootScope.selectedCompany;
    header = companyDetails.name + '\r\n' + '"'+companyDetails.address+'"' + '\r\n' + companyDetails.city + '-' + companyDetails.pincode + '\r\n' + 'Profit and Loss' + ': ' + $filter('date')($scope.fromDate.date,'dd-MM-yyyy') + ' to ' + $filter('date')($scope.toDate.date,
      "dd-MM-yyyy") + '\r\n';
    
    //add income details
    _.each(plData.incArr, function(inc) {
      incRow += inc.groupName + ',' + inc.closingBalance.amount + '\r\n';
      if (inc.childGroups.length > 0) {
        return _.each(inc.childGroups, cInc => incRow += `          ${cInc.groupName},${cInc.closingBalance.amount}\r\n`);
      }
    });

    incTotal += `Total,${plData.incomeTotal}\r\n`;
 

    //add expenses details
    _.each(plData.expArr, function(exp) {
      expRow += exp.groupName + ',' + exp.closingBalance.amount + '\r\n';
      if (exp.childGroups.length > 0) {
        return _.each(exp.childGroups, cExp => expRow += `          ${cExp.groupName},${cExp.closingBalance.amount}\r\n`);
      }
    });

    expTotal += `Total,${plData.expenseTotal}\r\n`;
    
    if (plData.closingBalance >= 0) {
      total += `Profit,${plData.closingBalance}`;
    } else {
      total += `Loss,${plData.closingBalance}`;
    }

    csv += header + '\r\n' + incTitle + '\r\n' + incRow + incTotal + '\r\n' + '\r\n' + expTitle + '\r\n' + expRow + expTotal + '\r\n' + total;
    
    $scope.csvPL = csv;

    $scope.profitLoss = `data:text/csv;charset=utf-8,${escape(csv)}`;
    $scope.plShowOptions = false;
    return e.stopPropagation();
  };


  $scope.showPLoptions = function(e) {
    $scope.plShowOptions = !$scope.plShowOptions;
    return e.stopPropagation();
  };

  // P&l functions end

  $scope.addUIKey = data =>
    _.each(data, function(grp) {
      grp.isVisible = true;
      _.each(grp.accounts, acc => acc.isVisible = true);
      return _.each(grp.childGroups, function(chld) {
        if (chld.accounts.length > 0) {
          _.each(chld.accounts, acc => acc.isVisible = true);
        }
        chld.isVisible = true;
        if (chld.childGroups.length > 0) {
          return $scope.addUIKey(chld.childGroups);
        }
      });
    })
  ;

  $scope.getDefaultDate = function() {
    let date = undefined;
    let mm = '01';
    let dd = '04';
    let year = moment().get('year');
    let currentMonth = moment().get('month') + 1;
    let getDate = function() {
      let dateStr;
      if (currentMonth >= 4) {
        dateStr = dd + '-' + mm + '-' + year;
        date = Date.parse(dateStr.replace(/-/g,"/"));
      } else {
        year -= 1;
        dateStr = dd + '-' + mm + '-' + year;
        date = Date.parse(dateStr.replace(/-/g,"/"));
      }
      return date;  
    };
    return {date: getDate()};
  };

  // $scope.fromDate = {
  //   date: $scope.getDefaultDate().date
  // }

  $scope.setRefresh = () => $scope.hardRefresh = true;

  $scope.setRefreshForBalanceSheet = () => $scope.bsHardRefresh = true;

  $scope.setRefreshForProfitLoss = () => $scope.plHardRefresh = true;

  $scope.getTrialBal = function(data) {
    $scope.showTbplLoader = true;
    if (_.isNull(data.fromDate) || _.isNull(data.toDate)) {
      toastr.error("Date should be in proper format", "Error");
      return false;
    }

    let reqParam = {
      'companyUniqueName': $rootScope.selectedCompany.uniqueName,
      'fromDate': data.fromDate,
      'toDate': data.toDate
    };
//    console.log($scope.hardRefresh)
    if ($scope.hardRefresh === true) {
      reqParam = {
        'companyUniqueName': $rootScope.selectedCompany.uniqueName,
        'fromDate': data.fromDate,
        'toDate': data.toDate,
        'refresh': true
      };
    }
    //$scope.checkFY(reqParam)
    return trialBalService.getAllFor(reqParam).then($scope.getTrialBalSuccess, $scope.getTrialBalFailure);
  };

  $scope.count = 0;
  $scope.detailedGroups = [];
  $scope.getTrialBalSuccess = function(res) {
    // $scope.makeDataForPl(res.body)
    $scope.exportData = [];
    $scope.addUIKey(res.body.groupDetails);
    $scope.count = 0;
    $scope.detailedGroups = $scope.removeZeroAmountAccount(res.body.groupDetails);
    $scope.removeZeroAmountGroup($scope.detailedGroups);
    angular.copy($scope.detailedGroups,$scope.exportData);
    $scope.removeSd($scope.detailedGroups);
    $scope.data = res.body;
    $scope.data.groupDetails = $scope.orderGroups($scope.detailedGroups);
    // $scope.balSheet.assetTotal = $scope.calCulateTotalAssets($scope.balSheet.assets)
    // $scope.balSheet.liabTotal = $scope.calCulateTotalLiab($scope.balSheet.liabilities)
    // if $scope.inProfit == false
    //   $scope.balSheet.assetTotal += $scope.plData.closingBalance
    // else if $scope.inProfit == true
    //   $scope.balSheet.liabTotal += $scope.plData.closingBalance
    if (($scope.data.closingBalance.amount === 0) && ($scope.data.creditTotal === 0) && ($scope.data.debitTotal === 0) && ($scope.data.forwardedBalance.amount === 0)) {
      $scope.noData = true;
    } else {
      $scope.noData = false;
    }
    $scope.showTbplLoader = false;
    return $scope.hardRefresh = false;
  };

  $scope.removeZeroAmountAccount = function(grpList) {
    _.each(grpList, function(grp) {
      let tempAcc = [];
      let count = 0;
      if ((grp.closingBalance.amount > 0) || (grp.forwardedBalance.amount > 0) || (grp.creditTotal > 0) || (grp.debitTotal > 0)) {
        _.each(grp.accounts, function(account) {
          if ((account.closingBalance.amount > 0) || (account.openingBalance.amount > 0) || (account.creditTotal > 0) || (account.debitTotal > 0)) {
            return tempAcc.push(account);
          } else {
            return count = count + 1;
          }
        });
      }
//      console.log("= 0 ", grp.groupName + " are " + count)
//      console.log("> 0 ", grp.groupName + " are " + tempAcc.length)
      if (tempAcc.length > 0) {
        grp.accounts = tempAcc;
      }
      if (grp.childGroups.length > 0) {
        return $scope.removeZeroAmountAccount(grp.childGroups);
      }
    });
    return grpList;
  };

  $scope.removeZeroAmountGroup = grpList =>
    _.each(grpList, function(grp) {
      if (grp.childGroups.length > 0) {
        $scope.removeZeroAmountGroup(grp.childGroups);
      }
      return _.reject(grp.childGroups, function(cGrp) {
        if ((cGrp.closingBalance.amount === 0) && (cGrp.forwardedBalance.amount === 0) && (cGrp.creditTotal === 0) && (cGrp.debitTotal === 0)) { return; }
      });
    })
  ;

  $scope.removeSd = function(data) {
    let count = 0;
    return _.each(data, function(grp) {
      if (grp.childGroups.length > 0) {
        return _.each(grp.childGroups, function(ch) {
          count = $scope.countAccounts(ch);
          if (ch.uniqueName === $rootScope.groupName.sundryDebtors) {
            if (count > 50) {
              ch.accounts = [];
              if (ch.childGroups.length > 0) {
                return $scope.removeAcc(ch);
              }
            }
          }
        });
      }
    });
  };


  $scope.countAccounts = function(group) {
    let count = 0;
    if (group.childGroups.length > 0) {
      _.each(group.childGroups, function(grp) {
        count = count + grp.accounts.length;
        if (grp.childGroups.length > 0) {
          return count = count + $scope.countAccounts(grp);
        }
      });
    }
    return count;
  };

  $scope.removeAcc = function(grp) {
    grp.accounts = [];
    if (grp.childGroups.length > 0) {
      return _.each(grp.childGroups, ch => $scope.removeAcc(ch));
    }
  };

  $scope.getTrialBalFailure = function(res) {
    $scope.hardRefresh = false;
    toastr.error(res.data.message, res.data.status);
    return $scope.showTbplLoader = false;
  };

  $scope.filterBydate = function() {
    let dateObj = {
      'fromDate': $filter('date')($scope.getDefaultDate().date,'dd-MM-yyyy'),
      'toDate': $filter('date')($scope.toDate.date, 'dd-MM-yyyy')
    };
    $scope.expanded = false;
    $scope.enableDownload = true;

    // $rootScope.showLedgerBox = false
    dateObj.fromDate = $filter('date')($scope.fromDate.date, 'dd-MM-yyyy');
    dateObj.toDate = $filter('date')($scope.toDate.date, 'dd-MM-yyyy');
    return $scope.getTrialBal(dateObj);
  };


  if ($scope.sendRequest) {
    let dateObj = {
      'fromDate': $filter('date')($scope.getDefaultDate().date,'dd-MM-yyyy'),
      'toDate': $filter('date')($scope.toDate.date, "dd-MM-yyyy")
    };
    $scope.checkFY(dateObj);
    $scope.getTrialBal(dateObj);
    $scope.sendRequest = false;
  }

  $scope.firstCapital = function(input) {
    let s = input.split('');
    let first = s[0].toUpperCase();
    let rest = s.splice(1);
    let i = first + rest.join('');
    input = i;
    return input;
  };

  //format $scope.data to convert into csv
  $scope.formatDataGroupWise = function(e) {
    let groups = [];
    let rawData = $scope.exportData;
    let total = {
      ob: 0,
      cb: 0,
      cr: 0,
      dr: 0
    };
    let csv = '';
    let row = '';
    let header = '';
    let title = ',Opening Balance,Debit,Credit,Closing Balance\n';
    $scope.fnGroupWise = "Trial_Balance.csv";
    let companyDetails = $rootScope.selectedCompany;
    header = companyDetails.name + '\r\n' + '"'+companyDetails.address+'"' + '\r\n' + companyDetails.city + '-' + companyDetails.pincode + '\r\n' + 'Trial Balance' + ': ' + $filter('date')($scope.fromDate.date,'dd-MM-yyyy') + ' to ' + $filter('date')($scope.toDate.date,
      "dd-MM-yyyy") + '\r\n';
    csv += header + '\r\n' + title;

    _.each(rawData, function(obj) {
      let group = {};
      group.name = obj.groupName;
      group.openingBalance = obj.forwardedBalance.amount;
      group.openingBalanceType = obj.forwardedBalance.type;
      group.credit = obj.creditTotal;
      group.debit = obj.debitTotal;
      group.closingBalance = obj.closingBalance.amount;
      group.closingBalanceType = obj.closingBalance.type;
      group.isVisible = obj.isVisible;
      return groups.push(group);
    });

    _.each(groups, function(obj) {
      if (obj.isVisible) {
        row += obj.name + ',' + obj.openingBalance + ' ' + $filter('recType')(obj.openingBalanceType,obj.openingBalance) + ',' + obj.debit + ',' + obj.credit + ',' + obj.closingBalance + $filter('recType')(obj.closingBalanceType,obj.closingBalance) + '\r\n';
        if (obj.openingBalanceType === "DEBIT") {
          total.ob = total.ob + obj.openingBalance;
        } else {
          total.ob = total.ob - obj.openingBalance;
        }
        if (obj.closingBalanceType === "DEBIT") {
          total.cb = total.cb + obj.closingBalance;
        } else {
          total.cb = total.cb - obj.closingBalance;
        }
//        total.ob += obj.openingBalance
//        total.cb += obj.closingBalance
        total.cr += obj.credit;
        return total.dr += obj.debit;
      }
    });

    if (total.ob < 0) {
      total.ob = total.ob * -1;
      total.ob = total.ob + " Cr";
    } else {
      total.ob = total.ob + " Dr";
    }
    if (total.cb < 0) {
      total.cb = total.cb * -1;
      total.cb = total.cb + " Cr";
    } else {
      total.cb = total.cb + " Dr";
    }
    csv += row + '\r\n';
    // csv += '\r\n' + 'Total' + ',' + $scope.filteredTotal.openingBalance + ',' + $scope.filteredTotal.debitTotal + ',' + $scope.filteredTotal.creditTotal + ',' + $scope.filteredTotal.closingBalance + '\n'
    csv += `\r\nTotal,${total.ob},${total.dr},${total.cr},${total.cb}\n`;
    $scope.csvGW = csv;

    $scope.uriGroupWise = `data:text/csv;charset=utf-8,${escape(csv)}`;
    $scope.showOptions = true;
    return e.stopPropagation();
  };

  $scope.formatDataAccountWise = function(e) {
    let groups = [];
    let accounts = [];
    let childGroups = [];
    let rawData = $scope.exportData;
    let total = {
      ob: 0,
      cb: 0,
      cr: 0,
      dr: 0
    };
    $scope.fnAccountWise = "Trial_Balance_account-wise.csv";
    let row = '';
    let title = '';
    let body = '';
    let footer = '';
    let companyDetails = $rootScope.selectedCompany;
    let header = companyDetails.name + '\r\n' + '"'+companyDetails.address+'"' + '\r\n' + companyDetails.city + '-' + companyDetails.pincode + '\r\n' + 'Trial Balance' + ': ' + $filter('date')($scope.fromDate.date,
        "dd-MM-yyyy") + ' to ' + $filter('date')($scope.toDate.date,
        "dd-MM-yyyy") + '\r\n';

    _.each(rawData, function(obj) {
      let group = {};
      group.Name = obj.groupName;
      group.openingBalance = obj.forwardedBalance.amount;
      group.Credit = obj.creditTotal;
      group.Debit = obj.debitTotal;
      group.ClosingBalance = obj.closingBalance.amount;
      group.accounts = obj.accounts;
      group.childGroups = obj.childGroups;
      group.isVisible = obj.isVisible;
      return groups.push(group);
    });


    var sortChildren = function(parent) {
      //push account to accounts if accounts.length > 0
      _.each(parent, function(obj) {
        let parentGroup = obj.groupName;
        if (obj.accounts.length > 0) {
          return _.each(obj.accounts, function(acc) {
            let account = {};
            account.name = acc.name;
            account.openingBalance = acc.openingBalance.amount;
            account.openingBalanceType = acc.openingBalance.type;
            account.credit = acc.creditTotal;
            account.debit = acc.debitTotal;
            account.closingBalance = acc.closingBalance.amount;
            account.closingBalanceType = acc.closingBalance.type;
            account.parent = parentGroup;
            account.isVisible = acc.isVisible;
            return accounts.push(account);
          });
        }
      });

      //push childgroup to childGroups if childGroups.length > 0
      return _.each(parent, function(obj) {
        if (obj.childGroups.length > 0) {
          return _.each(obj.childGroups, function(chld) {
            let childGroup = {};
            childGroup.name = chld.groupName;
            childGroup.credit = chld.creditTotal;
            childGroup.debit = chld.debitTotal;
            childGroup.closingBalance = chld.closingBalance.amount;
            childGroup.isVisible = chld.isVisible;
            childGroups.push(childGroup);

            if (chld.accounts.length > 0) {
              _.each(chld.accounts, function(acc) {
                let account = {};
                account.name = acc.name;
                account.openingBalance = acc.openingBalance.amount;
                account.openingBalanceType = acc.openingBalance.type;
                account.credit = acc.creditTotal;
                account.debit = acc.debitTotal;
                account.closingBalance = acc.closingBalance.amount;
                account.closingBalanceType = acc.closingBalance.type;
                account.parent = childGroup.name;
                account.isVisible = acc.isVisible;
                return accounts.push(account);
              });
            }

            if (chld.childGroups.length > 0) {
              _.each(chld.childGroups, function(obj) {
                let Balance;
                let group = {};
                group.Name = obj.groupName;
                group.openingBalance = obj.forwardedBalance.amount;
                group.openingBalanceType = obj.forwardedBalance.type;
                group.Credit = obj.creditTotal;
                group.Debit = obj.debitTotal;
                group.Closing - (Balance = obj.closingBalance.amount);
                group.accounts = obj.accounts;
                group.childGroups = obj.childGroups;
                group.isVisible = obj.isVisible;
                return groups.push(group);
              });
              return sortChildren(chld.childGroups);
            }
          });
        }
      });
    };

    sortChildren(rawData);

    title += 'Name,Opening Balance,Debit,Credit,Closing Balance\r\n';

    let createCsv = function(data){
      _.each(data, function(obj) {
        row = row ||
          '';
        if (obj.isVisible === true) {
          row += obj.name + ' (' + obj.parent  + ')' + ',' + obj.openingBalance+ ' ' + $filter('recType')(obj.openingBalanceType ,obj.openingBalance) +  ',' + obj.debit + ',' + obj.credit + ',' + obj.closingBalance + ',' + $filter('recType')(obj.closingBalanceType,obj.closingBalance) + '\r\n';
          if (obj.openingBalanceType === "DEBIT") {
            total.ob = total.ob + obj.openingBalance;
          } else {
            total.ob = total.ob - obj.openingBalance;
          }
          if (obj.closingBalanceType === "DEBIT") {
            total.cb = total.cb + obj.closingBalance;
          } else {
            total.cb = total.cb - obj.closingBalance;
          }
          //        total.ob += obj.openingBalance
          //        total.cb += obj.closingBalance
          total.cr += obj.credit;
          return total.dr += obj.debit;
        }
      });

      if (total.ob < 0) {
        total.ob = total.ob * -1;
        total.ob = total.ob + " Cr";
      } else {
        total.ob = total.ob + " Dr";
      }
      if (total.cb < 0) {
        total.cb = total.cb * -1;
        total.cb = total.cb + " Cr";
      } else {
        total.cb = total.cb + " Dr";
      }
      return body += row + '\r\n';
    };

    createCsv(accounts);
    footer += `Total,${total.ob},${total.dr},${total.cr},${total.cb}\n`;
    let csv = header + '\r\n\r\n' + title + '\r\n' + body + footer;

    $scope.csvAW = csv;
    $scope.uriAccountWise = `data:text/csv;charset=utf-8,${escape(csv)}`;
    $scope.showOptions = true;
    return e.stopPropagation();
  };

  $scope.formatDataCondensed = function(e) {
    let rawData = $scope.exportData;
    let groupData = [];
    let total = {
      ob: 0,
      cb: 0,
      cr: 0,
      dr: 0
    };
    let csv = '';
    let title = '';
    let body = '';
    let footer = '';
    let companyDetails = $rootScope.selectedCompany;
    let header = companyDetails.name + '\r\n' + '"'+ companyDetails.address+'"' + '\r\n' + companyDetails.city + '-' + companyDetails.pincode + '\r\n' + 'Trial Balance' + ': ' + $filter('date')($scope.fromDate.date,
        "dd-MM-yyyy") + ' to ' + $filter('date')($scope.toDate.date,
        "dd-MM-yyyy") + '\r\n';

    $scope.fnCondensed = "Trial_Balance_condensed.csv";
    var sortData = (parent, groups) =>
      _.each(parent, function(obj) {
        var group = group ||{
          accounts: [],
          childGroups: []
        };
        group.name = obj.groupName;
        group.openingBalance = obj.forwardedBalance.amount;
        group.openingBalanceType = obj.forwardedBalance.type;
        group.credit = obj.creditTotal;
        group.debit = obj.debitTotal;
        group.closingBalance = obj.closingBalance.amount;
        group.closingBalanceType = obj.closingBalance.type;
        group.isVisible = obj.isVisible;
        if (obj.accounts.length > 0) {
          //group.accounts = obj.accounts
          _.each(obj.accounts, function(acc) {
            let account = {};
            account.name = acc.name;
            account.openingBalance = acc.openingBalance.amount;
            account.openingBalanceType = acc.openingBalance.type;
            account.credit = acc.creditTotal;
            account.debit = acc.debitTotal;
            account.closingBalance = acc.closingBalance.amount;
            account.closingBalanceType = acc.closingBalance.type;
            account.isVisible = acc.isVisible;
            return group.accounts.push(account);
          });
        }

        if (obj.childGroups.length > 0) {
          //group.childGroups = obj.childGroups
          
          _.each(obj.childGroups, function(grp) {
            var childGroup = childGroup ||{
              childGroups: [],
              accounts: []
            };
            childGroup.name = grp.groupName;
            childGroup.parent = obj.groupName;
            childGroup.openingBalance = grp.forwardedBalance.amount;
            childGroup.openingBalanceType = grp.forwardedBalance.type;
            childGroup.credit = grp.creditTotal;
            childGroup.debit = grp.debitTotal;
            childGroup.closingBalance = grp.closingBalance.amount;
            childGroup.closingBalanceType = grp.closingBalance.type;
            childGroup.isVisible = grp.isVisible;
            group.childGroups.push(childGroup);

            if (grp.accounts.length > 0) {
              _.each(grp.accounts, function(acc) {
                childGroup.accounts = childGroup.accounts ||
                  [];
                let account = {};
                account.name = acc.name;
                account.openingBalance = acc.openingBalance.amount;
                account.openingBalanceType = acc.openingBalance.type;
                account.credit = acc.creditTotal;
                account.debit = acc.debitTotal;
                account.closingBalance = acc.closingBalance.amount;
                account.closingBalanceType = acc.closingBalance.type;
                account.isVisible = acc.isVisible;
                return childGroup.accounts.push(account);
              });
            }

            if (grp.childGroups.length > 0) {
              return sortData(grp.childGroups, childGroup.childGroups);
            }
          });
        }
        return groups.push(group);
      })
    ;

    sortData(rawData, groupData);

    title += 'Name,Opening Balance,Debit,Credit,Closing Balance\r\n';
    // footer += 'Total' + ',' + $scope.filteredTotal.openingBalance + ',' + $scope.filteredTotal.debitTotal + ',' + $scope.filteredTotal.creditTotal + ',' + $scope.filteredTotal.closingBalance + '\n'

    let createCsv = function(csvObj) {
      //console.log csvObj, 'csvObj'
      let index = 0;
      var bodyGen = function(csvObj, index) {
        let bd = '';
        _.each(csvObj, function(obj) {
          let row = '';
          let strIndex = '';
          for (let i = 0, end = index, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) { strIndex += '   '; }
          if ((obj.isVisible === true) && (obj.closingBalance !== 0)) {
            row += strIndex + obj.name.toUpperCase() + ',' + obj.openingBalance + $filter('recType')(obj.openingBalanceType,obj.openingBalance) + ',' + obj.debit + ',' + obj.credit + ',' + obj.closingBalance + $filter('recType')(obj.closingBalanceType,obj.ClosingBalance) + '\r\n';
            if (obj.accounts === undefined) {
              console.log(obj);
            }
            if (obj.accounts.length > 0) {
              _.each(obj.accounts, function(acc) {
                if (acc.isVisible === true) {
                  row += strIndex + '   ' +$scope.firstCapital(acc.name.toLowerCase()) + ' (' + $scope.firstCapital(obj.name) + ')' + ',' + acc.openingBalance + $filter('recType')(acc.openingBalanceType,acc.openingBalance) + ',' + acc.debit + ',' + acc.credit + ',' + acc.closingBalance + $filter('recType')(acc.closingBalanceType,acc.closingBalance) + '\r\n';
                  if (acc.openingBalanceType === "DEBIT") {
                    total.ob = total.ob + acc.openingBalance;
                  } else {
                    total.ob = total.ob - acc.openingBalance;
                  }
                  if (acc.closingBalanceType === "DEBIT") {
                    total.cb = total.cb + acc.closingBalance;
                  } else {
                    total.cb = total.cb - acc.closingBalance;
                  }
//                  total.ob += acc.openingBalance
//                  total.cb += acc.closingBalance
                  total.cr += acc.credit;
                  return total.dr += acc.debit;
                }
              });
              if (total.ob < 0) {
                total.ob = total.ob * -1;
                total.ob = total.ob + " Cr";
              } else {
                total.ob = total.ob + " Dr";
              }
              if (total.cb < 0) {
                total.cb = total.cb * -1;
                total.cb = total.cb + " Cr";
              } else {
                total.cb = total.cb + " Dr";
              }
            }
            if (obj.childGroups.length > 0) {
             row += bodyGen(obj.childGroups, index+1);
           }
          }
          return bd += row;
        });
        return bd;
      };
      body = bodyGen(csvObj, 0);
      footer += `Total,${total.ob},${total.dr},${total.cr},${total.cb}\n`;
      return csv = header + '\r\n\r\n' + title + '\r\n' + body + '\r\n' + footer + '\r\n';
    };

    createCsv(groupData);

    $scope.csvCond = csv;

    $scope.uriCondensed = `data:text/csv;charset=utf-8,${escape(csv)}`;
    $scope.showOptions = true;
    return e.stopPropagation();
  };

  $scope.formatData = function(e) {
    $scope.formatDataGroupWise(e);
    $scope.formatDataCondensed(e);
    return $scope.formatDataAccountWise(e);
  };

  $scope.hideOptions = function(e) {
    $timeout((function() {
      $scope.showOptions = false;
      return $scope.showpdf = false;
    }), 100);
    return e.stopPropagation();
  };

  $scope.showTbXlsOptions = function(e) {
    $scope.showTbXls = true;
    return e.stopPropagation();
  };

  $scope.downloadTbXls = function(exportType) {
    $timeout(( function() {
      $scope.showOptions = false;
      return $scope.showTbXls = false;
    }), 100);
    let reqParam = {
      'companyUniqueName': $rootScope.selectedCompany.uniqueName,
      'fromDate': $filter('date')($scope.fromDate.date,'dd-MM-yyyy'),
      'toDate': $filter('date')($scope.toDate.date, 'dd-MM-yyyy'),
      'exportType': exportType,
      'query':$scope.keyWord.query
    };
    return trialBalService.downloadTBExcel(reqParam).then($scope.downloadTBExcelSuccess, $scope.downloadTBExcelFailure);
  };

  $scope.downloadTBExcelSuccess = function(res) {
    let data = tb.b64toBlob(res.body, "application/xml", 512);
    return FileSaver.saveAs(data, "trialbalance.xlsx");
  };

  $scope.downloadTBExcelFailure = res => toastr.error(res.data.message, res.data.status);
    
    
  $(document).on('click', e =>
    $timeout((function() {
      $scope.showOptions = false;
      $scope.plShowOptions = false;
      $scope.showpdf = false;
      return $scope.showTbXls = false;
    }), 100)
  );

  $scope.addData = function() {
    if ($scope.showChildren) {
      return $scope.showChildren = false;
    } else {
      return $scope.showChildren = true;
    }
  };

  $scope.showPdfOptions = function(e) {
    $scope.showpdf = true;
    return e.stopPropagation();
  };

  $scope.showNLevelList = e => $scope.showNLevel = true;

  $scope.orderGroups = function(data) {
    let orderedGroups = [];
    let assets = [];
    let liabilities = [];
    let income = [];
    let expenses = [];
    _.each(data, function(grp) {
      switch (grp.category) {
        case 'assets':
          return assets.push(grp);
          // $scope.balSheet.assets.push(grp)
        case 'liabilities':
          return liabilities.push(grp);
          // $scope.balSheet.liabilities.push(grp)
        case 'income':
          return income.push(grp);
        case 'expenses':
          return expenses.push(grp);
        default:
          return assets.push(grp);
      }
    });
    _.each(liabilities, liability => orderedGroups.push(liability));
    _.each(assets, asset => orderedGroups.push(asset)); 
    _.each(income, inc => orderedGroups.push(inc));
    _.each(expenses, exp => orderedGroups.push(exp));
    return orderedGroups;
  };
  
  $scope.$watch('fromDate.date', function(newVal,oldVal) {
    let oldDate = new Date(oldVal).getTime();
    let newDate = new Date(newVal).getTime();
    let toDate = new Date($scope.toDate.date).getTime();
    if (newDate > toDate) {
      $scope.toDate.date =  newDate;
    }
    if (newVal !== oldVal) {
      return $scope.enableDownload = false;
    }
  });

  // for Balance sheet

  $scope.calCulateTotalAssets = function(data) {
    let total = 0;
    _.each(data, function(obj) {
      if (obj.closingBalance.type === 'CREDIT') {
        return total -= obj.closingBalance.amount;
      } else {
        return total += obj.closingBalance.amount;
      }
    });
    return total;
  };

  $scope.calCulateTotalLiab = function(data) {
    let total = 0;
    _.each(data, function(obj) {
      if (obj.closingBalance.type === 'DEBIT') {
        return total -= obj.closingBalance.amount;
      } else {
        return total += obj.closingBalance.amount;
      }
    });
    return total;
  };

  $scope.getBalanceSheetData = function() {
    $scope.showBSLoader = true;
    let reqParam = {
      'companyUniqueName': $rootScope.selectedCompany.uniqueName,
      'refresh': $scope.bsHardRefresh,
      'fy': $scope.activeBSFYIndex
    };
    return trialBalService.getBalSheet(reqParam).then($scope.getBalanceSheetDataSuccess, $scope.getBalanceSheetDataFailure);
  };

  $scope.getProfitLossData = function() {
    $scope.showPLLoader = true;
    let reqParam = {
      'companyUniqueName': $rootScope.selectedCompany.uniqueName,
      'refresh': $scope.plHardRefresh,
      'fy': $scope.activePLFYIndex
    };
    return trialBalService.getPL(reqParam).then($scope.getPLSuccess, $scope.getPLFailure);
  };

  $scope.getBalanceSheetDataSuccess = function(res) {
    $scope.makeDataForBS(res.body);
    $scope.bsHardRefresh = false;
    return $scope.showBSLoader = false;
  };

  $scope.getPLSuccess = function(res) {
    $scope.makeDataForPl(res.body);
    $scope.plHardRefresh = false;
    return $scope.showPLLoader = false;
  };

  $scope.getBalanceSheetDataFailure = function(res) {
    toastr.error(res.data.message, res.data.status);
    $scope.bsHardRefresh = false;
    return $scope.showBSLoader = false;
  };

  $scope.getPLFailure = function(res) {
    toastr.error(res.data.message, res.data.status);
    $scope.plHardRefresh = false;
    return $scope.showPLLoader = false;
  };

  $timeout((() => $scope.getBalanceSheetData()), 1000);

  $timeout((() => $scope.getProfitLossData()), 1000);
  
  $scope.changeBSFYIdx = item =>
    _.each($scope.financialYears, function(fy, index) {
      if(fy.uniqueName === item.uniqueName) {
        if (index === 0) {
          return $scope.activeBSFYIndex = index;
        } else {
          return $scope.activeBSFYIndex = index * -1;
        }
      }
    })
  ;

  $scope.changePLFYIdx = item =>
    _.each($scope.financialYears, function(fy, index) {
      if(fy.uniqueName === item.uniqueName) {
        if (index === 0) {
          return $scope.activePLFYIndex = index;
        } else {
          return $scope.activePLFYIndex = index * -1;
        }
      }
    })
  ;

  $scope.downloadBSExcel = function() {
    let reqParam = {
      'companyUniqueName': $rootScope.selectedCompany.uniqueName,
      'fy': $scope.activeBSFYIndex
    };
    return trialBalService.downloadBSExcel(reqParam).then($scope.downloadBSExcelSuccess, $scope.downloadBSExcelFailure);
  };

  $scope.downloadPLExcel = function() {
    let reqParam = {
      'companyUniqueName': $rootScope.selectedCompany.uniqueName,
      'fy': $scope.activePLFYIndex
    };
    return trialBalService.downloadPLExcel(reqParam).then($scope.downloadPLExcelSuccess, $scope.downloadPLExcelFailure);
  };

  $scope.downloadBSExcelSuccess = function(res) {
    let data = tb.b64toBlob(res.body, "application/xml", 512);
    return FileSaver.saveAs(data, "balancesheet.xlsx");
  };

  $scope.downloadPLExcelSuccess = function(res) {
    let data = tb.b64toBlob(res.body, "application/xml", 512);
    return FileSaver.saveAs(data, "profitloss.xlsx");
  };

  $scope.downloadBSExcelFailure = res => toastr.error(res.data.message, res.data.status);

  $scope.downloadPLExcelFailure = res => toastr.error(res.data.message, res.data.status);

  tb.b64toBlob = function(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    let offset = 0;
    while (offset < byteCharacters.length) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);
      let byteNumbers = new Array(slice.length);
      let i = 0;
      while (i < slice.length) {
        byteNumbers[i] = slice.charCodeAt(i);
        i++;
      }
      let byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
      offset += sliceSize;
    }
    let blob = new Blob(byteArrays, {type: contentType});
    return blob;  
  };

  return $scope.$on('company-changed' , function(event, data) {
    if (data.type === 'CHANGE') {
      return $state.reload();
    }
  });
};
 

giddh.webApp.controller('tbplController', tbplController);