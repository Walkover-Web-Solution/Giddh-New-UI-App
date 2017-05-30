angular.module('exportDirectives', [])
.directive('exportPdfaccountwise', [
  '$rootScope',
  '$compile',
  '$filter',
  ($rootScope, $compile, $filter) =>
    ({
      restrict: 'A',
      link(scope, elem, attr) {
        return elem.on('click', function(e) {
          let pdf = new jsPDF('p','pt');
          let groups = [];
          let accounts = [];
          let childGroups = [];
          let total = {
            ob: 0,
            cb: 0,
            cr: 0,
            dr: 0
          };
          let rawData = scope.exportData;
          let companyDetails = $rootScope.selectedCompany;

          _.each(rawData, function(obj) {
            let group = {};
            group.Name = obj.groupName;
            //group.openingBalance = obj.forwardedBalance.amount
            group.Credit = obj.creditTotal;
            group.Debit = obj.debitTotal;
            group.ClosingBalance = obj.closingBalance.amount;
            //group.accounts = obj.accounts
            //group.childGroups = obj.childGroups
            return groups.push(group);
          });


          var sortChildren = function(parent) {
            //push account to accounts if accounts.length > 0
            _.each(parent, function(obj) {
              if (obj.accounts.length > 0) {
                return _.each(obj.accounts, function(acc) {
                  let account = {};
                  account.name = acc.name;
                  account.openingBalance = acc.openingBalance.amount + $filter('recType')(acc.openingBalance.type, acc.openingBalance.amount);
                  account.openingBalanceType = acc.openingBalance.type;
                  account.credit = acc.creditTotal;
                  account.debit = acc.debitTotal;
                  account.closingBalance = acc.closingBalance.amount + $filter('recType')(acc.closingBalance.type, acc.openingBalance.amount);
                  account.closingBalanceType = acc.closingBalance.type;
                  if (acc.isVisible) {
                    total.ob += acc.openingBalance.amount;
                    total.cb += acc.closingBalance.amount;
                    total.cr += acc.creditTotal;
                    total.dr += acc.debitTotal;
                    return accounts.push(account);
                  }
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
                  childGroups.push(childGroup);

                  if (chld.accounts.length > 0) {
                    _.each(chld.accounts, function(acc) {
                      let account = {};
                      account.name = acc.name;
                      account.openingBalance = acc.openingBalance.amount + $filter('recType')(acc.openingBalance.type, acc.openingBalance.amount);
                      account.openingBalanceType = acc.openingBalance.type;
                      account.credit = acc.creditTotal;
                      account.debit = acc.debitTotal;
                      account.closingBalance = acc.closingBalance.amount + $filter('recType')(acc.closingBalance.type, acc.closingBalance.amount);
                      account.closingBalanceType = acc.closingBalance.type;
                      if (acc.isVisible) {
                        total.ob += acc.openingBalance.amount;
                        total.cb += acc.closingBalance.amount;
                        total.cr += acc.creditTotal;
                        total.dr += acc.debitTotal;
                        return accounts.push(account);
                      }
                    });
                  }

                  if (chld.childGroups.length > 0) {
                    _.each(chld.childGroups, function(obj) {
                      let Balance;
                      let group = {};
                      group.Name = obj.groupName;
                      //group.openingBalance = obj.forwardedBalance.amount
                      group.Credit = obj.creditTotal;
                      group.Debit = obj.debitTotal;
                      group.Closing - (Balance = obj.closingBalance.amount);
                      group.accounts = obj.accounts;
                      group.childGroups = obj.childGroups;
                      return groups.push(group);
                    });
                    return sortChildren(chld.childGroups);
                  }
                });
              }
            });
          };

          sortChildren(rawData);

          let columns = [
            {
              title:'Particular',
              dataKey:'name'
            },
            {
              title: 'Opening Balance',
              dataKey: 'openingBalance'
            },
            {
              title: 'Debit',
              dataKey: 'debit'
            },
            {
              title: 'Credit',
              dataKey: 'credit'
            },
            {
              title: 'Closing Balance',
              dataKey: 'closingBalance'
            }
          ];

          let rows = accounts;

          pdf.autoTable(columns,rows, {
              theme: "plain",
              margin: {
                  top: 110
                },
              beforePageContent() {
                pdf.setFontSize(16);
                pdf.text(40,50,companyDetails.name);
                pdf.setFontSize(10);
                pdf.text(40,65,companyDetails.address);
                pdf.text(40,80,companyDetails.city + '-' + companyDetails.pincode);
                return pdf.text(40,95, `Trial Balance: ${$filter('date')(scope.fromDate.date,'dd/MM/yyyy')}-${$filter('date')(scope.toDate.date,'dd/MM/yyyy')}`);
              }
            }
            );

          // write footer
          total.ob = $filter('number')(total.ob, 2);
          total.cb = $filter('number')(total.cb, 2);
          total.dr = $filter('number')(total.dr, 2);
          total.cr = $filter('number')(total.cr, 2);
          let OBT = total.ob.toString();
          let DBT = total.dr.toString();
          let CDT = total.cr.toString();
          let CBT = total.cb.toString();
          let footerX = 40;
          let lastY = pdf.autoTableEndPosY();
          let pageWidth = pdf.internal.pageSize.width - 40;
          pdf.setFontSize(8);
          pdf.line(40, lastY, pageWidth, lastY);
          pdf.text(footerX,lastY+20,"Total");
          pdf.text(footerX+210, lastY+20, OBT);
          pdf.text(footerX+302, lastY+20, DBT);
          pdf.text(footerX+365, lastY+20, CDT);
          pdf.text(footerX+430, lastY+20, CBT);

          return pdf.save('TrialBalance-AccountWise.pdf');
        });
      }
    })

])
.directive('exportPdfgroupwise', [
  '$rootScope',
  '$compile',
  '$filter',
  ($rootScope, $compile, $filter) =>
    ({
      restrict: 'A',
      link(scope, elem, attr) {
        return elem.on('click', function(e) {
          let pdf = new jsPDF('p','pt');
          let groups = [];
          let rawData = scope.exportData;
          let companyDetails = $rootScope.selectedCompany;
          let total = {
            ob: 0,
            cb: 0,
            cr: 0,
            dr: 0
          };

          _.each(rawData, function(obj) {
            let group = {};
            group.name = obj.groupName;
            group.openingBalance = obj.forwardedBalance.amount + $filter('recType')(obj.forwardedBalance.type, obj.forwardedBalance.amount);
            //group.openingBalanceType = obj.forwardedBalance.type
            group.debit = obj.debitTotal;
            group.credit = obj.creditTotal;
            group.closingBalance = obj.closingBalance.amount + $filter('recType')(obj.closingBalance.type, obj.closingBalance.amount);
            //group.closingBalanceType = obj.closingBalance.type
            if (obj.isVisible) {
              if (obj.forwardedBalance.type === "DEBIT") {
                total.ob = total.ob + obj.forwardedBalance.amount;
              } else {
                total.ob = total.ob - obj.forwardedBalance.amount;
              }
              if (obj.closingBalance.type === "DEBIT") {
                total.cb = total.cb + obj.closingBalance.amount;
              } else {
                total.cb = total.cb - obj.closingBalance.amount;
              }
//              total.ob += obj.forwardedBalance.amount
//              total.cb += obj.closingBalance.amount
              total.cr += obj.creditTotal;
              total.dr += obj.debitTotal;
              return groups.push(group);
            }
          });

          let columns = [
            {
              title:'Particular',
              dataKey:'name'
            },
            {
              title: 'Opening Balance',
              dataKey: 'openingBalance'
            },
            {
              title: 'Debit',
              dataKey: 'debit'
            },
            {
              title: 'Credit',
              dataKey: 'credit'
            },
            {
              title: 'Closing Balance',
              dataKey: 'closingBalance'
            }
          ];

          let rows = groups;
          pdf.autoTable(columns,rows, {
              theme: "plain",
              margin: {
                  top: 110
                },
              beforePageContent() {
                pdf.setFontSize(16);
                pdf.text(40,50,companyDetails.name);
                pdf.setFontSize(10);
                pdf.text(40,65,companyDetails.address);
                pdf.text(40,80, companyDetails.city + ' - '+companyDetails.pincode);
                return pdf.text(40,95, `Trial Balance: ${$filter('date')(scope.fromDate.date,'dd/MM/yyyy')}-${$filter('date')(scope.toDate.date,'dd/MM/yyyy')}`);
              }
            }
            );

          // write footer
          total.ob = $filter('number')(total.ob, 2);
          total.cb = $filter('number')(total.cb, 2);
          total.dr = $filter('number')(total.dr, 2);
          total.cr = $filter('number')(total.cr, 2);
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
          let OBT = total.ob.toString();
          let DBT = total.dr.toString();
          let CDT = total.cr.toString();
          let CBT = total.cb.toString();
          let footerX = 45;
          let lastY = pdf.autoTableEndPosY();
          let pageWidth = pdf.internal.pageSize.width - 40;
          pdf.setFontSize(10);
          pdf.line(40, lastY, pageWidth, lastY);
          pdf.text(footerX,lastY+20,"Total");
          pdf.text(footerX+150, lastY+20, OBT);
          pdf.text(footerX+260, lastY+20, DBT);
          pdf.text(footerX+335, lastY+20, CDT);
          pdf.text(footerX+415, lastY+20, CBT);

          return pdf.save('TrialBalance-GroupWise.pdf');
        });
      }
    })

])
.directive('exportPdfcondensed', [
  '$rootScope',
  '$compile',
  '$filter',
  ($rootScope, $compile, $filter) =>
    ({
      restrict: 'A',
      link(scope, elem, attr) {

        let pdf = new jsPDF;
        // initial coordinates
        let companyDetails = $rootScope.selectedCompany;
        let colX = 10;
        let colY = 50;


        // assign object values
        let setObjVal = function(obj) {
          let val = {};
          val.name = $filter('truncate')(obj.Name.toString(),true,25,"...");
          val.ob = obj.OpeningBalance.toString();
          val.dr = obj.Debit.toString();
          val.cr = obj.Credit.toString();
          val.cl = obj.ClosingBalance.toString();
          return val;
        };


        // write text to pdf with arguments
        let writeText = function(obj) {
          let pageHeight = pdf.internal.pageSize.height;
          let val = setObjVal(obj);
          pdf.text(colX, colY, val.name);
          pdf.text(70, colY, val.ob);
          pdf.text(105, colY, val.dr);
          pdf.text(140, colY, val.cr);
          pdf.text(170, colY, val.cl);
          let y = colY % pageHeight;
          if (colY > 247) {
            pdf.addPage();
            colY = 20;
          }
          else {}
          return colY += 5;
        };
        // create pdf
        var createPDF = function(dataArray) {
          let pageHeight = pdf.internal.pageSize.height;
          // Loop over data array and write values
          return _.each(dataArray, function(dataObj) {
            //assign accounts and childgroups
            let { accounts } = dataObj;
            let childgroups = dataObj.childGroups;
            pdf.setFontSize(10);
            //write dataObj values
            writeText(dataObj);

            if (dataObj.accounts.length > 0) {
              //loop over accounts and write values
              colX += 5;
              _.each(accounts, acc => writeText(acc));
              colX -= 5;
            }
            if (childgroups.length > 0) {
              //loop over childgroups and write values
              colX += 5;
              _.each(childgroups, function(childGrp) {
                console.log(childGrp);
                writeText(childGrp);

                if (childGrp.subAccounts.length > 0) {
                  colX += 5;
                  _.each(childGrp.subAccounts, acc => writeText(acc));
                  colX -= 5;
                }

                if (childGrp.subGroups.length > 0) {
                  colX += 5;
                  createPDF(childGrp.subGroups);
                  return colX -= 5;
                }
              });
              return colX -= 5;
            }
          });
        };

        // on element click
        return elem.on('click', function(e) {
          colX = 10;
          colY = 50;
          if (!_.isUndefined(pdf)) {
            pdf = undefined;
            pdf = new jsPDF();
          } else {
            pdf = new jsPDF;
          }
          let rawData = scope.exportData;
          let groupData = [];
          let total = {
              ob: 0,
              cb: 0,
              cr: 0,
              dr: 0
          };
          companyDetails = $rootScope.selectedCompany;

          var sortData = (parent, groups) =>
            _.each(parent, function(obj) {
              if (obj.isVisible) {
                var group = group ||{
                  accounts: [],
                  childGroups: []
                };
                group.Name = obj.groupName.toUpperCase();
                group.OpeningBalance = obj.forwardedBalance.amount + $filter('recType')(obj.forwardedBalance.type, obj.forwardedBalance.amount);
                group.Credit = obj.creditTotal;
                group.Debit = obj.debitTotal;
                group.ClosingBalance = obj.closingBalance.amount + $filter('recType')(obj.closingBalance.type, obj.closingBalance.amount);
                group.ClosingBalanceType = obj.closingBalance.type;
                if (obj.accounts.length > 0) {
                  //group.accounts = obj.accounts
                  _.each(obj.accounts, function(acc) {
                    if (acc.isVisible) {
                      let account = {};
                      account.Name = acc.name.toLowerCase();
                      account.Credit = acc.creditTotal;
                      account.Debit = acc.debitTotal;
                      account.ClosingBalance = acc.closingBalance.amount + $filter('recType')(acc.closingBalance.type, acc.closingBalance.amount);
                      account.ClosingBalanceType = acc.closingBalance.type;
                      account.OpeningBalance = acc.openingBalance.amount + $filter('recType')(acc.openingBalance.type, acc.openingBalance.amount);
                      group.accounts.push(account);
                      total.ob += acc.openingBalance.amount;
                      total.cb += acc.closingBalance.amount;
                      total.cr += acc.creditTotal;
                      return total.dr += acc.debitTotal;
                    }
                  });
                }

                if (obj.childGroups.length > 0) {
                  //group.childGroups = obj.childGroups
                  _.each(obj.childGroups, function(grp) {
                    if (grp.isVisible) {
                      var childGroup = childGroup ||{
                        subGroups: [],
                        subAccounts: []
                      };
                      childGroup.Name = grp.groupName.toUpperCase();
                      childGroup.Credit = grp.creditTotal;
                      childGroup.Debit = grp.debitTotal;
                      childGroup.ClosingBalance = grp.closingBalance.amount + $filter('recType')(grp.closingBalance.type, grp.closingBalance.amount);
                      childGroup.DlosingBalanceType = grp.closingBalance.type;
                      childGroup.OpeningBalance = grp.forwardedBalance.amount + $filter('recType')(grp.forwardedBalance.type, grp.forwardedBalance.amount);
                      group.childGroups.push(childGroup);

                      if (grp.accounts.length > 0) {
                        _.each(grp.accounts, function(acc) {
                          if (acc.isVisible) {
                            childGroup.subAccounts = childGroup.subAccounts ||
                              [];
                            let account = {};
                            account.Name = acc.name.toLowerCase();
                            account.Credit = acc.creditTotal;
                            account.Debit = acc.debitTotal;
                            account.ClosingBalance = acc.closingBalance.amount + $filter('recType')(acc.closingBalance.type, acc.closingBalance.amount);
                            account.ClosingBalanceType = acc.closingBalance.type;
                            account.OpeningBalance = acc.openingBalance.amount + $filter('recType')(acc.openingBalance.type, acc.openingBalance.amount);
                            childGroup.subAccounts.push(account);
                            if (acc.openingBalance.type === "DEBIT") {
                              total.ob = total.ob + acc.openingBalance.amount;
                            } else {
                              total.ob = total.ob - acc.openingBalance.amount;
                            }
                            if (acc.closingBalance.type === "DEBIT") {
                              total.cb = total.cb + acc.closingBalance.amount;
                            } else {
                              total.cb = total.cb - acc.closingBalance.amount;
                            }
//                            total.ob += acc.openingBalance.amount
//                            total.cb += acc.closingBalance.amount
                            total.cr += acc.creditTotal;
                            return total.dr += acc.debitTotal;
                          }
                        });
                      }

                      if (grp.childGroups.length > 0) {
                        return sortData(grp.childGroups, childGroup.subGroups);
                      }
                    }
                  });
                }

                return groups.push(group);
              }
            })
          ;

          sortData(rawData, groupData);

          //write header
          pdf.setFontSize(16);
          pdf.text(10,20,companyDetails.name);
          pdf.setFontSize(10);
          pdf.text(10,25,companyDetails.address);
          pdf.text(10,30,companyDetails.city + '-' + companyDetails.pincode);
          pdf.text(10,35, `Trial Balance: ${$filter('date')(scope.fromDate.date,'dd/MM/yyyy')}-${$filter('date')(scope.toDate.date,'dd/MM/yyyy')}`);
          pdf.line(10,38,200,38);

          //write table header
          pdf.setFontSize(9);
          pdf.text(10, 43, 'PARTICULAR');
          pdf.text(70,43, 'OPENING BALANCE');
          pdf.text(105, 43, 'DEBIT');
          pdf.text(140, 43, 'CREDIT');
          pdf.text(170, 43, 'CLOSING BALANCE');
          pdf.line(10, 45,200,45);

          createPDF(groupData);


          total.ob = $filter('number')(total.ob, 2);
          total.cb = $filter('number')(total.cb, 2);
          total.dr = $filter('number')(total.dr, 2);
          total.cr = $filter('number')(total.cr, 2);
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
          // write table footer
          pdf.line(10, colY, 200, colY);
          pdf.text(10, colY + 5, "TOTAL");
          pdf.text(70, colY + 5, total.ob.toString());
          pdf.text(105, colY + 5, total.dr.toString());
          pdf.text(140, colY + 5, total.cr.toString());
          pdf.text(170, colY + 5, total.cb.toString());

          // save to pdf
          return pdf.save('TrialBalance-Condensed.pdf');
        });
      }
    })

])
.directive('exportPlpdf', [
  '$rootScope',
  '$compile',
  '$filter',
  ($rootScope, $compile, $filter) =>
    ({
      restrict: 'A',
      link(scope, elem, attr) {

        return elem.on('click', function(e) {
          let pdf = new jsPDF('p','pt');
          let { plData } = scope;
          let incomeTotal = plData.incomeTotal.toString();
          let expenseTotal = plData.expenseTotal.toString();
          let pl = $filter('number')(plData.closingBalance, 3);
          let companyDetails = $rootScope.selectedCompany;
          let colX = 20;
          let colY = 40;
          let pWidth = pdf.internal.pageSize.width;
          let pHeight = pdf.internal.pageSize.height;
          let col = pWidth/4;
          let col2 =  col + 40;
          let col3 = (2 * col) + 10;
          let col4 = (3 * col) + 40;
          let pageEnd = 0;
          //write header
          pdf.setFontSize(14);
          pdf.setFontStyle('bold');
          pdf.text(colX,colY, companyDetails.name);
          colY += 15;
          pdf.setFontSize(10);
          pdf.text(colX, colY, companyDetails.address);
          colY+= 15;
          pdf.text(colX,colY,companyDetails.city + '-' + companyDetails.pincode);
          colY+= 15;
          pdf.text(colX,colY, `Profit and Loss: ${$filter('date')(scope.fromDate.date,'dd/MM/yyyy')}-${$filter('date')(scope.toDate.date,'dd/MM/yyyy')}`);
          colY+= 15;
          pdf.line(colX,colY,pWidth-20,colY);
          colY += 20;

          //write table header
          pdf.setFontStyle('normal');
          pdf.setFontSize(12);
          pdf.text(colX, colY,'INCOME');
          pdf.text(col3, colY, 'EXPENSES');
          colY += 10;
          pdf.line(colX, colY, pWidth-20, colY);
          colY+= 20;
          //write table
          let tableStartY = colY;
          _.each(plData.incArr, function(inc) {
            if (colY > (pHeight - 80)) {
              pdf.addPage();
            }
            let name = inc.groupName.toString();
            let amount = $filter('number')(inc.closingBalance.amount, 3);
            amount = amount.toString();
            pdf.setFontSize(10);
            pdf.setFontStyle('normal');
            pdf.text(colX, colY, name);
            pdf.text(col2,colY, amount);
            colY += 15;
            if (inc.childGroups.length > 0) {
              colX += 20;
              _.each(inc.childGroups, function(cInc) {
                if (colY > (pHeight - 80)) {
                  pdf.addPage();
                }
                let cName = cInc.groupName.toString();
                let cAmount = $filter('number')(cInc.closingBalance.amount, 3);
                cAmount = cAmount.toString();
                pdf.text(colX, colY, cName);
                pdf.text(col2 + 10, colY, cAmount);
                return colY += 15;
              });
              return colX -= 20;
            }
          });

          colY = tableStartY;
          _.each(plData.expArr, function(exp) {
            if (colY > (pHeight - 80)) {
              pdf.addPage();
            }
            let name = exp.groupName.toString();
            let amount = $filter('number')(exp.closingBalance.amount, 3);
            amount = amount.toString();
            pdf.setFontSize(10);
            pdf.text(col3, colY, name);
            pdf.text(col4,colY, amount);
            colY += 15;
            if (exp.childGroups.length > 0) {
              col3 += 20;
              _.each(exp.childGroups, function(cExp) {
                if (colY > (pHeight - 80)) {
                  pdf.addPage();
                }
                let cName = cExp.groupName.toString();
                let cAmount = $filter('number')(cExp.closingBalance.amount, 3);
                cAmount = cAmount.toString();
                pdf.text(col3, colY, cName);
                pdf.text(col4 + 10, colY, cAmount);
                return colY += 15;
              });
              return col3 -= 20;
            }
          });
          pageEnd = colY;
          pdf.line(pWidth/2, tableStartY - 20 , pWidth/2, pageEnd + 10);
          pdf.line(20, pageEnd+10, pWidth-20, pageEnd+10);
          pdf.setFontSize(12);
          pageEnd += 30;

          if (plData.closingBalance >= 0) {
            pdf.text(20, pageEnd, 'Profit');
            pdf.text(col2, pageEnd, pl.toString());
          } else {
            pdf.text(col3, pageEnd, 'Loss');
            pdf.text(col4, pageEnd, pl.toString());
          }
          pageEnd += 10;

          pdf.line(20, pageEnd, pWidth-20, pageEnd);
          pageEnd +=20;
          pdf.text(20, pageEnd, 'TOTAL');
          pdf.text(col2, pageEnd, incomeTotal);
          pdf.text(col3, pageEnd, 'TOTAL');
          pdf.text(col4, pageEnd, expenseTotal);

          return pdf.save('Profit-and-Loss.pdf');
        });
      }
    })

])

.directive('accordionControls',[
  '$rootScope',
  '$compile',
  '$filter',
  '$timeout',
  ($rootScope, $compile, $filter, $timeout) =>
    ({
      restrict: 'A',
      link(scope, elem, attr) {
        let { action } = attr;
        return elem.on('click', function() {
          if (action === 'expandAll') {
            return scope.accordion.expandAll();
          } else if (action === 'closeAll') {
            return scope.accordion.collapseAll();
          }
        });
      }
    })

])

.directive('selectOnClick', [
  '$window',
  $window =>
    // Linker function
    (scope, element, attrs) =>
      element.bind('click', function() {
        return $(this).select();
      })


])

.directive('ignoreMouseWheel',[
  '$rootScope',
  $rootScope =>
    ({
      restrict: 'A',
      link(scope, element, attrs) {
        return element.bind('mousewheel', event => element.blur());
      }
    })

])


// .directive( 'ignoreMouseWheel', function( $rootScope ) {
//   return {
//     restrict: 'A',
//     link: function( scope, element, attrs ){
//       element.bind('mousewheel', function ( event ) {
//         element.blur();
//       } );
//     }
//   }
// } );

// module.directive('selectOnClick', ['$window', function ($window) {
//   // Linker function
//   return function (scope, element, attrs) {
//     element.bind('click', function () {
//       if (!$window.getSelection().toString()) {
//         this.setSelectionRange(0, this.value.length)
//       }
//     });
//   };
// }]);

.directive('clearSearch',[
  '$rootScope',
  '$compile',
  '$filter',
  '$timeout',
  ($rootScope, $compile, $filter, $timeout) =>
    ({
      restrict: 'A',
      link(scope, elem, attr) {

        scope.isNotEmpty = false;
        let model = attr.ngModel;
        let initModel = model;
        let remove = $compile("<i class='glyphicon glyphicon-remove clear' ng-show='isNotEmpty'></i>")(scope);

        elem.after(remove);

        elem.on('keydown', e =>
          $timeout((function() {
            if (elem.val().length > 1) {
              return scope.isNotEmpty = true;
            } else {
              return scope.isNotEmpty = false;
            }
          }), 10)
        );

        return $('.clear').on('click', () =>
          $timeout(( function() {
            elem[0].value = '';
            scope.acntSrch = null;
            return scope.isNotEmpty = false;

          }), 10)
        );
      }
    })

])

.filter('grpsrch', () =>
  function(input, search) {
    let srch;
    if (!_.isUndefined(search)) {
      srch = search.toLowerCase();
    }
    let initial = input;

    let checkIndex = function(src, str) {
      if (src.indexOf(str) !== -1) {
        return true;
      } else {
        return false;
      }
    };

    var performSearch  = input =>
      _.each(input, function(grp) {
        let grpName = grp.name.toLowerCase();
        let grpUnq = grp.uniqueName.toLowerCase();
        if (!checkIndex(grpName, srch) && !checkIndex(grpUnq, srch)) {
          grp.isVisible = false;
          if (grp.groups.length > 0) {
            return _.each(grp.groups, function(sub) {
              let subName = sub.name.toLowerCase();
              let subUnq = sub.uniqueName.toLowerCase();

              if (!checkIndex(subName, srch) && !checkIndex(subUnq, srch)) {
                sub.isVisible = false;
                if (sub.groups.length) {
                  return _.each(sub.groups, function(child) {
                    let childName = child.name.toLowerCase();
                    let childUnq = child.uniqueName.toLowerCase();
                    if (!checkIndex(childName, srch) && !checkIndex(childUnq, srch)) {
                      child.isVisible = false;
                      if (child.groups.length > 0) {
                        return _.each(child.groups, function(subChild) {
                          let subChildName = subChild.name.toLowerCase();
                          let subChildUnq = subChild.uniqueName.toLowerCase();
                          if (!checkIndex(subChildName, srch) && !checkIndex(subChildUnq, srch)) {
                            subChild.isVisible = false;
                            if (subChild.groups.length > 0) {
                              return _.each(child.groups, function(subChild2) {
                                let subChild2Name = subChild2.name.toLowerCase();
                                let subChild2Unq = subChild2.uniqueName.toLowerCase();
                                if (!checkIndex(subChild2Name, srch) && !checkIndex(subChild2Unq, srch)) {
                                  subChild2.isVisible = false;
                                  if (subChild2.groups.length > 0) {
                                    return performSearch(subChild.groups);
                                  }
                                } else {
                                  grp.isVisible = true;
                                  child.isVisible = true;
                                  sub.isVisible = true;
                                  subChild.isVisible = true;
                                  return subChild2.isVisible = true;
                                }
                              });
                            }
                          } else {
                            grp.isVisible = true;
                            child.isVisible = true;
                            sub.isVisible = true;
                            return subChild.isVisible = true;
                          }
                        });
                      }
                    } else if (checkIndex(childName, srch) || checkIndex(childUnq, srch)) {
                      grp.isVisible = true;
                      child.isVisible = true;
                      return sub.isVisible = true;
                    }
                  });
                }
              } else if (checkIndex(subName, srch) || checkIndex(subUnq, srch)) {
                grp.isVisible = true;
                return sub.isVisible = true;
              }
            });
          }
        } else if (checkIndex(grpName, srch) || checkIndex(grpUnq, srch)) {
          return grp.isVisible = true;
        }
      })
    ;

    var resetSearch = input =>
      _.each(input, function(grp) {
        grp.isVisible = true;
        if (grp.groups.length > 0) {
          return _.each(grp.groups, function(sub){
            sub.isVisible = true;
            if (sub.groups.length > 0) {
              return resetSearch(sub.groups);
            }
          });
        }
      })
    ;

    if (!_.isUndefined(srch)) {
      performSearch(input);
      if (srch.length < 2) {
        resetSearch(input);
      }
    }
    return input;
  }


)

.filter('tbsearch', () =>
  function(input, search) {

    let srch;
    if (!_.isUndefined(search)) {
      srch = search.toLowerCase();
    }
    let initial = input;

    let checkIndex = function(src, str) {
      if (src.indexOf(str) !== -1) {
        return true;
      } else {
        return false;
      }
    };

    var performSearch  = input =>
      _.each(input, function(grp) {
        let grpName = grp.groupName.toLowerCase();
        let grpUnq = grp.uniqueName.toLowerCase();

        if (!checkIndex(grpName, srch) && !checkIndex(grpName, srch)) {
          grp.isVisible = false;
          if (grp.childGroups.length > 0) {
            _.each(grp.childGroups, function(child) {
              let childName = child.groupName.toLowerCase();
              let childUnq = child.groupName.toLowerCase();

              if (!checkIndex(childName, srch) && !checkIndex(childUnq, srch)) {
                child.isVisible = false;
                if (child.childGroups.length > 0) {
                  _.each(child.childGroups, function(nChild1) {
                    let nchild1Name = nChild1.groupName.toLowerCase();
                    let nChild1Unq = nChild1.uniqueName.toLowerCase();
                    if (!checkIndex(nchild1Name, srch) && !checkIndex(nChild1Unq, srch)) {
                      nChild1.isVisible = false;
                      if (nChild1.childGroups.length > 0) {
                        _.each(nChild1.childGroups, function(nChild2) {
                          let nChild2Name = nChild2.groupName.toLowerCase();
                          let nChild2Unq = nChild2.uniqueName.toLowerCase();
                          if (!checkIndex(nChild2Name, srch) && !checkIndex(nChild2Unq, srch)) {
                            nChild2.isVisible = false;
                            if (nChild2.childGroups.length > 0) {
                              _.each(nChild2.childGroups, function(nChild3) {
                                let nChild3Name = nChild3.groupName.toLowerCase();
                                let nChild3Unq = nChild2.uniqueName.toLowerCase();
                                if (!checkIndex(nChild3Name, srch) && !checkIndex(nChild3Unq, srch)) {
                                  nChild3.isVisible = false;
                                  if (nChild3.childGroups.length > 0) {
                                    performSearch(nChild3.childGroups);
                                  }
                                  if (nChild3.accounts.length > 0) {

                                    return _.each(nChild3.accounts, function(acc) {
                                      let accName = acc.name.toLowerCase();
                                      let accUnq = acc.uniqueName.toLowerCase();
                                      if (!checkIndex(accName, srch) && !checkIndex(accUnq, srch)) {
                                        return acc.isVisible = false;
                                      } else if (checkIndex(accName, srch) || checkIndex(accUnq, srch)) {
                                        nChild3.isVisible = true;
                                        nChild2.isVisible = true;
                                        nChild1.isVisible = true;
                                        child.isVisible = true;
                                        grp.isVisible = true;
                                        return acc.isVisible = true;
                                      }
                                    });
                                  }
                                } else if (checkIndex(nChild3Name, srch) || checkIndex(nChild3Unq, srch)) {
                                  nChild3.isVisible = true;
                                  nChild2.isVisible = true;
                                  nChild1.isVisible = true;
                                  child.isVisible = true;
                                  return grp.isVisible = true;
                                }
                              });
                            }
                            if (nChild2.accounts.length > 0) {
                              return _.each(nChild2.accounts, function(acc) {
                                let accName = acc.name.toLowerCase();
                                let accUnq = acc.uniqueName.toLowerCase();
                                if (!checkIndex(accName, srch) && !checkIndex(accUnq, srch)) {
                                  return acc.isVisible = false;
                                } else if (checkIndex(accName, srch) || checkIndex(accUnq, srch)) {
                                  nChild2.isVisible = true;
                                  nChild1.isVisible = true;
                                  child.isVisible = true;
                                  grp.isVisible = true;
                                  return acc.isVisible = true;
                                }
                              });
                            }
                          } else if (checkIndex(nChild2Name, srch) || checkIndex(nChild2Unq, srch)) {
                            nChild2.isVisible = true;
                            nChild1.isVisible = true;
                            child.isVisible = true;
                            return grp.isVisible = true;
                          }
                        });
                      }
                      if (nChild1.accounts.length > 0) {
                        return _.each(nChild1.accounts, function(acc) {
                          let accName = acc.name.toLowerCase();
                          let accUnq = acc.uniqueName.toLowerCase();
                          if (!checkIndex(accName, srch) && !checkIndex(accUnq, srch)) {
                            return acc.isVisible = false;
                          } else if (checkIndex(accName, srch) || checkIndex(accUnq, srch)) {
                            nChild1.isVisible = true;
                            child.isVisible = true;
                            grp.isVisible = true;
                            return acc.isVisible = true;
                          }
                        });
                      }
                    } else if (checkIndex(nchild1Name, srch) || checkIndex(nChild1Unq, srch)) {
                      nChild1.isVisible = true;
                      child.isVisible = true;
                      return grp.isVisible = true;
                    }
                  });
                }

                if (child.accounts.length > 0) {
                  return _.each(child.accounts, function(acc) {
                    let accName = acc.name.toLowerCase();
                    let accUnq = acc.uniqueName.toLowerCase();

                    if (!checkIndex(accName, srch) && !checkIndex(accUnq, srch)) {
                      return acc.isVisible = false;
                    } else if (checkIndex(accName, srch) || checkIndex(accUnq, srch)) {
                      child.isVisible = true;
                      grp.isVisible = true;
                      return acc.isVisible = true;
                    }
                  });
                }

              } else if (checkIndex(childName, srch) || checkIndex(childUnq, srch)) {
                grp.isVisible = true;
                return child.isVisible = true;
              }
            });
          }

          if (grp.accounts.length > 0) {
            return _.each(grp.accounts, function(acc) {
              let accName = acc.name.toLowerCase();
              let accUnq = acc.uniqueName.toLowerCase();

              if (!checkIndex(accName, srch) && !checkIndex(accUnq, srch)) {
                return acc.isVisible = false;
              } else if (checkIndex(accName, srch) || checkIndex(accUnq, srch)) {
                grp.isVisible = true;
                return acc.isVisible = true;
              }
            });
          }



        } else if (checkIndex(grpName, srch) || checkIndex(grpName, srch)) {
          return grp.isVisible = true;
        }
      })
    ;


    var resetSearch = input =>
      _.each(input, function(grp) {
        grp.isVisible = true;
        if (grp.childGroups.length > 0) {
          _.each(grp.childGroups, function(sub){
            sub.isVisible = true;
            if (sub.childGroups.length > 0) {
              resetSearch(sub.childGroups);
            }
            if (sub.accounts.length > 0) {
              return _.each(sub.accounts, acc => acc.isVisible = true);
            }
          });
        }
        if (grp.accounts.length > 0) {
          return _.each(grp.accounts, acc => acc.isVisible = true);
        }
      })
    ;

    if (!_.isUndefined(srch)) {
      performSearch(input);
      if (srch.length < 2) {
        resetSearch(input);
      }
    }
    return input;
  }

);