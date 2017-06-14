angular.module('trialBalance', []).directive('exportReport', [
  '$rootScope',
  '$compile',
  ($rootScope, $compile) =>
    ({
      restrict: 'A',
      link(scope, elem, attr) {

        let isIE = false;

        let GetIEVersion = function() {
          let sAgent = window.navigator.userAgent;
          let Idx = sAgent.indexOf('MSIE');
          if (Idx > 0) {
            return parseInt(sAgent.substring(Idx + 5, sAgent.indexOf('.', Idx)));
          } else if (!!navigator.userAgent.match(/Trident\/7\./)) {
            return 11;
          } else {
            return 0;
          }
        };

        if (GetIEVersion() > 0) {
          isIE = true;
        } else {
          isIE = false;
        }

        return elem.on('click', function(e) {
          let win;
          switch (attr.report) {
            case 'group-wise':
              if (!isIE) {
                elem.attr({
                  'href': scope.uriGroupWise,
                  'download': scope.fnGroupWise
                });
              } else {
                win = window.open();
                win.document.write('sep=,\r\n',scope.csvGW);
                win.document.close();
                win.document.execCommand('SaveAs',true, scope.fnGroupWise + ".csv");
                win.close();
              }
              break;

            case 'condensed':
              if (!isIE) {
                elem.attr({
                  'href': scope.uriCondensed,
                  'download': scope.fnCondensed
                });
              } else {
                win = window.open();
                win.document.write('sep=,\r\n',scope.csvCond);
                win.document.close();
                win.document.execCommand('SaveAs',true, scope.fnCondensed + ".csv");
                win.close();
              }
              break;
            case 'account-wise':
              if (!isIE) {
                elem.attr({
                  'href': scope.uriAccountWise,
                  'download': scope.fnAccountWise
                });
              } else {
                win = window.open();
                win.document.write('sep=,\r\n',scope.csvAW);
                win.document.close();
                win.document.execCommand('SaveAs',true, scope.fnAccountWise + ".csv");
                win.close();
              }
              break;
            case 'profit-and-loss':
              if (!isIE) {
                elem.attr({
                  'href': scope.profitLoss,
                  'download': scope.fnProfitLoss
                });
              } else {
                win = window.open();
                win.document.write('sep=,\r\n',scope.csvPL);
                win.document.close();
                win.document.execCommand('SaveAs',true, scope.fnProfitLoss + ".csv");
                win.close();
              }
              break;
          }
          return e.stopPropagation();
        });
      }

    })

]).filter('recType', () =>
  function(input, value) {
    if (value !== 0) {
      switch (input) {
        case 'DEBIT':
          input = " Dr.";
          break;
        case 'CREDIT':
          input = " Cr.";
          break;
      }
      return input;
    } else {
      input = "";
      return input;
    }
  }
).filter('truncate', () =>
  function(value, wordwise, max, tail) {
    if (!value) {
      return '';
    }
    max = parseInt(max, 10);
    if (!max) {
      return value;
    }
    if (value.length <= max) {
      return value;
    }
    value = value.substr(0, max);
    if (wordwise) {
      let lastspace = value.lastIndexOf(' ');
      if (lastspace !== -1) {
        value = value.substr(0, lastspace);
      }
    }
    return value + (tail || ' …');
  }
    ).filter('highlight', () =>
  function(text, search, caseSensitive) {
    if (text && (search || angular.isNumber(search))) {
      text = text.toString();
      search = search.toString();
      if (caseSensitive) {
        return text.split(search).join(`<mark class="ui-match">${search}</mark>`);
      } else {
        return text.replace(new RegExp(search, 'gi'), '<mark class="ui-match">$&</mark>');
      }
    } else {
      return text;
    }
  }
  ).directive('trialAccordion', [
  '$rootScope',
  '$compile',
  '$timeout',
  ($rootScope, $compile, $timeout) =>
    ({
      restrict: 'A',
      link(scope, elem, attr) {

        // padding value
        scope.padLeft = 20;

        let showChild = function() {
            if (elem.siblings().hasClass('isHidden')) {
                elem.siblings().removeClass('isHidden');
                return elem.siblings().fadeIn(100);
            } else {
                elem.siblings().fadeOut(100);
                return elem.siblings().addClass('isHidden');
              }
          };

        // expand all
        let expandAll = function() {
          angular.element('.table-container').find('.isHidden').not('.account.isHidden').show().removeClass('isHidden');
          angular.element('.add-manage-grouplist').find('.isHidden').not('.account.isHidden').show().removeClass('isHidden');
          return scope.expanded = true;
        };

        //collapse all
        let collapseAll = () =>
          $timeout((function() {
            angular.element('.table-container').find("[trial-accordion]").not("[trial-accordion = 'expandAll']").siblings().hide().addClass('isHidden');
            angular.element('.add-manage-grouplist').find("[trial-accordion]").not("[trial-accordion = 'expandAll']").siblings().hide().addClass('isHidden');
            return scope.expanded = false;
          }),100)
        ;

        elem.on('click', function(e) {
          if ((attr.trialAccordion !== 'expandAll') && (attr.trialAccordion !== 'collapseAll') && (attr.trialAccordion !== 'search')) {
            showChild();
          }

          if (attr.trialAccordion === 'expandAll') {
            return expandAll();
          } else if (attr.trialAccordion === 'collapseAll') {
            return collapseAll();
          }
        });

        return elem.on('keyup', function(e) {
          if (!_.isUndefined(scope.keyWord)) {
            if (scope.keyWord.length > 2) {
              return expandAll();
            } else {
              return collapseAll();
            }
          }
        });
      }
    })

])
.filter('accntsrch', () =>
  function(input, search) {
    let srch = search.toLowerCase();
    let result = [];

    let checkIndex = function(src, str) {
      if (src.indexOf(str) !== -1) {
        return true;
      } else {
        return false;
      }
    };

    if (_.isEmpty(srch)) {
      _.each(input, grp => grp.accountDetails = grp.beforeFilter);
      return input;
    } else {

      _.each(input, function(grp) {
        grp.accountDetails = grp.beforeFilter;
        let matchCase = '';
        let grpName = grp.groupName.toLowerCase();
        let grpUnq = grp.groupUniqueName.toLowerCase();
        let grpSyn = !_.isNull(grp.groupSynonyms) ? grp.groupSynonyms.toLowerCase() : '';
        let accounts = [];
        if (checkIndex(grpName, srch) || checkIndex(grpUnq, srch) || checkIndex(grpSyn, srch)) {
          matchCase = 'Group';
          if (grp.beforeFilter.length > 0) {
            _.each(grp.beforeFilter, function(acc) {
              let accName = acc.name.toLowerCase();
              let accUnq = acc.uniqueName.toLowerCase();
              let accMergeAcc = acc.mergedAccounts.toLowerCase();
              if (checkIndex(accName, srch) || checkIndex(accUnq, srch) || checkIndex(accMergeAcc, srch)) {
                matchCase = 'Account';
              }
              if (checkIndex(accName, srch) || checkIndex(accUnq, srch) || (checkIndex(accMergeAcc, srch) && checkIndex(grpName, srch)) || checkIndex(grpUnq, srch) || checkIndex(grpSyn, srch)) {
                matchCase = 'Group and Account';
              }

              if (matchCase === 'Account') {
                return accounts.push(acc);
              }
            });
          }

        } else {
          if (grp.beforeFilter.length > 0) {
            _.each(grp.beforeFilter, function(acc) {
              let accName = acc.name.toLowerCase();
              let accUnq = acc.uniqueName.toLowerCase();
              let accMergeAcc = acc.mergedAccounts.toLowerCase();
              if (checkIndex(accName, srch) || checkIndex(accUnq, srch) || checkIndex(accMergeAcc, srch)) {
                matchCase = 'Account';
                accounts.push(acc);
              }
              return grp.accountDetails = accounts;
            });
          }
        }

        switch (matchCase) {
          case 'Group':
            return result.push(grp);
          case 'Account':
            return result.push(grp);
          case 'Group and Account':
            return result.push(grp);
        }
      });

      return result;
    }
  }
).directive('leftMargin', [
  '$rootScope',
  '$compile',
  '$timeout',
  ($rootScope, $compile, $timeout) =>
    ({
      restrict: 'A',
      link(scope, elem, attr) {
        // if attr.dragAround == 'true'
        //   $(elem).draggable()

        //   $(elem).on('drag', (e)->
        //     if $(elem).hasClass('fixed-panel')
        //       $(elem).removeClass('fixed-panel')
        //       $(elem).css('bottom','initial')
        //   )

          let getLeftSectionWidth = function() {
            let left;
            return left = $('.col-xs-2.greyBg').width();
          };

          let setPanelLeftPos = left => $(elem).find('.ledger-panel').css('left', left + 45);

          window.addEventListener('resize', function(e) {
            let left = getLeftSectionWidth();
            return setPanelLeftPos(left);
          });

          return $(document).ready(function(e){
            let left = getLeftSectionWidth();
            return setPanelLeftPos(left);
          });
        }
    })

])

.directive('optionList', ['$window', '$timeout', ($window, $timeout) =>

  ({
    link(scope, elem, attr) {

      let btn = $(elem).find('#showHide');
      let target = $(elem).find('.ol-options');


      return btn.on('click', e => target.toggle("slide", {direction: "right"}, 300));
    }
  })




])


.directive('triggerFocus', ['$window', '$timeout', ($window, $timeout) =>
  ({
    scope: {
      txn: '=txn',
      isOpen: '=isOpen'
    },
    link(scope, elem, attr) {

      let idx = parseInt(attr.index);
      let tL = attr.txnlength - 1;

      return scope.$watch('isOpen', function(newVal, oldVal) {
        if (newVal) {
          return $timeout(( function() {
            if ((scope.txn.particular.name === "") && (scope.txn.particular.uniqueName === "")) {
              return $(elem).trigger('focus');
            }
          }), 200);
        }
      });
    }
  })


    // $(elem).on('click', (e)->
    //   if scope.isOpen

    // )

])


.directive('inputFocus', ['$window', '$timeout', ($window, $timeout) =>
  ({
    scope: {
      isOpen: '=isOpen',
      txn: '=txn'
    },
    link(scope, elem, attr) {

      return scope.$watch('isOpen', function(newVal, oldVal) {
        if (newVal && scope.txn.isBlank) {
          return $timeout(( () => $(elem).trigger('focus')), 200);
        }
      });
    }
  })


    // $(elem).on('click', (e)->
    //   if scope.isOpen
    //     $(elem).trigger('focus')
    // )

])

.directive('setDropOverflow', ['$window', '$timeout', ($window, $timeout) =>
  ({
    link(scope, elem, attr) {

      return $(elem).parent().parent().css({
        'max-height':250,
        'max-width':400,
        'overflow':'auto'
      });
    }
  })


])

.directive('coverPage', ['$window', '$timeout', ($window, $timeout) =>
  ({
    restrict: "EA",
    link(scope, elem, attr) {
      let interval = Number(attr.timeout) || 2000;

      let setHeight = function() {
        let top = $(elem).offset().top || 108;
        let exclude = $(window).innerHeight() - 54;
        let height = $(window).outerHeight(true) - 54;
        return $(elem).css({"height": height,"min-height":height});
      };

      angular.element($window).on('resize', () => setHeight());

      return $timeout(( () => angular.element($window).triggerHandler('resize')), interval);
    }
  })

])

.directive('customSort', ['$window', '$timeout', '$scope', '$filter', ($window, $timeout, $scope, $filter) =>
  ({
    restrict: "A",
    transclude: true,
    scope: {
      order: '=',
      sort: '='
    },
    template :"<a ng-click='sort_by(order)' style='color: #555555;'>"+
      "<span ng-transclude></span>"+
      "<i ng-class='selectedCls(order)'></i>"+
      "</a>",
    link(scope, elem, attr) {
      scope.sort_by = function(newSortingOrder) {
        let { sort } = scope;

        if (sort.sortingOrder === newSortingOrder) {
          sort.reverse = !sort.reverse;
        }

        return sort.sortingOrder = newSortingOrder;
      };

      return scope.selectedCls = function(column) {
        if (column === scope.sort.sortingOrder) {
          return (`icon-chevron-${(scope.sort.reverse) != null ? scope.sort.reverse : {'down' : 'up'}}`);
        } else {
          return 'icon-sort';
        }
      };
    }
  })


])

.directive('getFullHeight', ['$window', '$timeout', ($window, $timeout) =>
  ({
    restrict: "EA",
    link(scope, elem, attr) {
      let setHeight = function() {
        let height = $(window).innerHeight() - 54 - 54;
        return $(elem).css({"height": height, "overflow-y":"auto"});
      };

      $(window).on('resize', e => setHeight());

      return setHeight();
    }
  })

])

.directive('tableHeight', ['$window', '$timeout', ($window, $timeout) =>
  ({
    restrict: "EA",
    link(scope, elem, attr) {
      let setHeight = function() {
        let height = $(window).innerHeight() - 112;
        return $(elem).css({"height": height});
      };

      $(window).on('resize', e => setHeight());

      return setHeight();
    }
  })

])

// check ul overflow
.directive('overflowfix', ['$window', '$timeout', ($window, $timeout) =>
  ({
    restrict: "A",
    link(scope, elem) {
      let elem1 = elem[0];
      let scroll = $(elem).scrollTop();
      return $(elem).on('scroll', function(e) {
        if ($(elem1).hasClass("fix")) {
          return 0;
        }
        if (scroll <= 20) {
          return $(elem1).addClass("fix");
        }
      });
    }
  })

])


// .directive 'ledgerScroller', ['$window', '$timeout','$parse', ($window, $timeout, $parse) ->
//   restrict: "EA"
//   link: (scope, elem, attrs) ->
//     invoker = $parse(attrs.scrolled)

//     $(elem).on('scroll', (e) ->
//       if $(elem).scrollTop()+$(elem).innerHeight() >= elem[0].scrollHeight
//         invoker(scope, {top : $(elem).scrollTop(), height:elem[0].scrollHeight, position:'next'})
//       else if $(elem).scrollTop() == 0
//         invoker(scope, {top : $(elem).scrollTop(), height:elem[0].scrollHeight, position:'prev'})
//     )

// ]


.directive('columnScroller', ['$window', '$timeout','$parse', ($window, $timeout, $parse) =>
  ({
    restrict: "EA",
    scope : {
      scrollto : '=scrollto',
      ledgerContainer : '=ledgerContainer',
      scrolled : '&',
      sortOrder : '=sortOrder'
    },
    link(scope, elem, attrs) {
      scope.$watch('scrollto', function(newVal, oldVal){
        if (newVal && newVal.to && (newVal !== oldVal) && newVal.to.transactions.length && newVal.to.uniqueName) {
          let a = $(`#${newVal.first.uniqueName}`).offset().top;
          let x = $(`#${newVal.to.uniqueName}`).offset().top;
          let scrollVal = x-a;
          // console.log x-a, a, x
          return $(elem).animate({
            scrollTop: scrollVal
          }, 200);
        }
      });
      scope.lastScrollTop = 0;
      $(elem).on('scroll', function(e) {
        let mouseScrollDirection;
        if ($(elem).scrollTop() > scope.lastScrollTop) {
          mouseScrollDirection = 1; //down
        } else {
          mouseScrollDirection = 0; //up
        }
        let scrollableArea = elem[0].scrollHeight - $(elem).innerHeight();
        let margin = 300;  //Math.floor(scrollableArea / 10) #replace with function for dynamic
        if (scope.ledgerContainer) {
          if (!scope.ledgerContainer.scrollDisable) {
            if (
              ( // == sign represents Xnor
                ((scope.sortOrder === 1) && scope.ledgerContainer.upperBoundReached) ===
                ((scope.sortOrder === 0) && scope.ledgerContainer.lowerBoundReached)
              ) && (mouseScrollDirection === 0) &&
              ($(elem).scrollTop() < margin)
            ) { //top sortorder 0 = asc 1 =desc

              $(elem).animate({
                scrollTop: margin
              }, 200);
              scope.ledgerContainer.scrollDisable = true;
              scope.scrolled({top : $(elem).scrollTop(), height:elem[0].scrollHeight, position:'prev'});
            } else if (
              (
                ((scope.sortOrder === 1) && scope.ledgerContainer.lowerBoundReached) ===
                ((scope.sortOrder === 0) && scope.ledgerContainer.upperBoundReached)
              ) && (mouseScrollDirection === 1) &&
              ($(elem).scrollTop() > (scrollableArea - margin))
            ) { //bottom

              scope.ledgerContainer.scrollDisable = true;
              // $(elem).animate({
              //   scrollTop: scrollableArea - margin
              // }, 200)
              scope.scrolled({top : $(elem).scrollTop(), height:elem[0].scrollHeight, position:'next'});
            }
          }

        } else { //this else condition to be removed completely as there must always be declaration for ledgerContainer
          if (($(elem).scrollTop()+$(elem).innerHeight()) >= elem[0].scrollHeight) {
            scope.scrolled({top : $(elem).scrollTop(), height:elem[0].scrollHeight, position:'next'});
          } else if ($(elem).scrollTop() === 0) {
            scope.scrolled({top : $(elem).scrollTop(), height:elem[0].scrollHeight, position:'prev'});
          }
        }

        return scope.lastScrollTop = $(elem).scrollTop();
      });
    }
  })

])



.directive('setPopoverPosition', ['$window', '$timeout', ($window, $timeout) =>
  ({
    restrict: "EA",
    link(scope, elem, attrs) {

      // setPos = () ->
      //   $timeout ( ->
      //     frame = $(window).height() / 3 * 2
      //     offset = $(elem).offset().top

      //     if offset > frame
      //       attrs.$set("popoverPlacement", "top")
      //     else
      //       attrs.$set("popoverPlacement", "bottom")

      //   ), 500

      // setPos()

      return $(elem).on('mouseover', function(e){
        if (e.pageY > (($(window).height() / 3) * 2)) {
          return attrs.$set("popoverPlacement", "top");
        } else {
          return attrs.$set("popoverPlacement", "bottom");
        }
      });
    }
  })


    // $(elem).find('input').on('focus', (e) ->
    //   if $(e.currentTarget).offset().top > $(window).height() / 3 * 2
    //     attrs.$set("popoverPlacement", "top")
    //   else
    //     attrs.$set("popoverPlacement", "bottom")
    // )

])

.directive('triggerResize', ['$window', '$timeout','$parse', ($window, $timeout, $parse) =>
  ({
    restrict: "EA",
    link(scope, elem, attrs) {

      return $(elem).on('click',e=>
        $timeout(( () => $(window).trigger('resize')), 500)
      );
    }
  })


])


// .directive 'triggerClick', ['$window', '$timeout','$parse', ($window, $timeout, $parse) ->
//   restrict: "EA"
//   link: (scope, elem, attrs) ->

//     $(elem).on('click',(e)->
//       $(elem).find('input').trigger('click')
//     )

// ]

.filter('numberlimit', () =>
  function(floatNum) {
    if (floatNum !== undefined) {
      let decimal = floatNum.toString().split('.');
      if (decimal[1] && (decimal[1].length > 2)) {
        decimal[1] = decimal[1][0] + decimal[1][1];
        floatNum = decimal[0] + '.' + decimal[1];
      }
    } else {
      floatNum = 0;
    }
    return floatNum;
  }
).filter('orderObjectBy', () =>
  function(items, field, reverse) {
    let filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function(a, b) {
      if (a[field] > b[field]) { return 1; } else { return -1; }
    });
    if (reverse) {
      filtered.reverse();
    }
    return filtered;
  }
  ).directive('scrollBtn', ['$window', '$timeout','$parse', ($window, $timeout, $parse) =>
  ({
    restrict: "EA",
    link(scope, elem, attrs) {

      return $(elem).on('click',function(e){
        let top = $('#middleBody').scrollTop();
        return $('#middleBody').animate({
          'scrollTop' : top + 100
        });
      });
    }
  })

])

.directive('fileModel', [
  '$parse',
  '$timeout',
  ($parse, $timeout) =>
    ({
      restrict: 'A',
      link(scope, element, attrs) {
        let model = $parse(attrs.fileModel);
        let modelSetter = model.assign;
        element.bind('change', function() {
          $timeout(function() {
            modelSetter(scope, element[0].files[0]);
          });
        });
      }

    })

])

.filter('abs', () =>
  function(num) {
    num = Math.abs(num);
    return num;
  }
);