angular.module('twygmbh.auto-height', []).
directive('autoHeight', ['$window', '$timeout', ($window, $timeout) =>
  ({
    link($scope, $element, $attrs) {

      let interval = Number($attrs.timeout) || 1000;

      let combineHeights = function(collection) {
        let heights = 0;
        for (let node of Array.from(collection)) { heights += node.offsetHeight; }
        return heights;
      };

      let siblings = $elm => Array.from($elm.parent().children()).filter((elm) => elm !== $elm[0]).map((elm) => elm);

      let adjustHeight = function() {
        let additionalHeight = $attrs.additionalHeight || 0;
        let minHeight = $attrs.minHeight || 600;
        if ($element[0].parentElement) {
          let parentHeight = $window.innerHeight-$element[0].parentElement.getBoundingClientRect().top;
          $element.css('min-height',minHeight + 'px');
          return $element.css('height', (parentHeight - combineHeights(siblings($element)) - additionalHeight) + "px");
        }
      };

      angular.element($window).on('resize', () => adjustHeight());

      return $timeout(( () => angular.element($window).triggerHandler('resize')), interval);
    }
  })

])

// invoice widget
.directive('invoiceWidget', [() =>
  ({
    restrict: 'E|A',
    //called IFF compile not defined
    link(scope, elem, attr) {
      elem = $(elem);
      let input = elem.find('textarea');
      let clickEvent = true;
      let cancelClick = null;
      let div = elem.find('.matter');
      let selectedText = '';

      let noClick = () => clickEvent = false;

      elem.on('mousedown', e=> cancelClick = setTimeout(noClick, 200));

      return elem.on('mouseup', function(e) {
        clearTimeout( cancelClick );
        if (clickEvent) {
          input.trigger('focus');
        } else {
          selectedText = window.getSelection().toString();
          // get selected text
          if (selectedText.length > 0) {
            let start = scope.widget.text.indexOf(selectedText);
            let end = start + selectedText.length;
            let strArray = scope.widget.text.split(selectedText);
            selectedText = ` <b>${selectedText}</b> `;
            let result = "";
            strArray.forEach(function(str, idx){
              if (idx < (strArray.length - 1)) {
                return result = str + " " + selectedText;
              } else {
                return result += str;
              }
            });
            scope.widget.text = result;
          }
        }

        return clickEvent = true;
      });
    }
  })

])

.directive('setIframeHeight', ['$timeout', $timeout =>
  ({
    restrict: 'E|A',
    link(scope, elem, attr) {
      return $timeout(( function() {
        elem = $(elem);
        let input = elem.find('iframe');
        return input[0].style.height = '100%';
      }),1000);
    }
  })

])

// sarfaraz
// to remove class dynamic
// init with outside-click="YOUR_CLASS_NAME"

.directive("outsideClick", ['$document','$parse', ($document, $parse)=>
  ({
    link($scope, $element, $attributes) {
      let cls = $attributes.outsideClick;
      let onDocumentClick =function(event){
        let isChild = $element[0].contains(event.target);
        if(!isChild) {
          return $element.removeClass(cls);
        }
      };

      $document.on("click", onDocumentClick);

      return $element.on('$destroy', ()=> $document.off("click", onDocumentClick));
    }
  })

]);



// convert digit to words
giddh.webApp.filter('numtowords', function() {

  let frac = f => f % 1;

  var convert_number = function(number) {
    let ones = Array('', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN');
    let tens = Array('', '', 'TWENTY', 'THIRTY', 'FOURTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY');
    if ((number < 0) || (number > 999999999)) {
      return 'NUMBER OUT OF RANGE!';
    }
    let Gn = Math.floor(number / 10000000);

    /* Crore */

    number -= Gn * 10000000;
    let kn = Math.floor(number / 100000);

    /* lakhs */

    number -= kn * 100000;
    let Hn = Math.floor(number / 1000);

    /* thousand */

    number -= Hn * 1000;
    let Dn = Math.floor(number / 100);

    /* Tens (deca) */

    number = number % 100;

    /* Ones */

    let tn = Math.floor(number / 10);
    let one = Math.floor(number % 10);
    let res = '';
    if (Gn > 0) {
      res += convert_number(Gn) + ' CRORE';
    }
    if (kn > 0) {
      res += (res === '' ? '' : ' ') + convert_number(kn) + ' LAKH';
    }
    if (Hn > 0) {
      res += (res === '' ? '' : ' ') + convert_number(Hn) + ' THOUSAND';
    }
    if (Dn) {
      res += (res === '' ? '' : ' ') + convert_number(Dn) + ' HUNDRED';
    }
    if ((tn > 0) || (one > 0)) {
      if (!(res === '')) {
        res += ' ';
      }
      if (tn < 2) {
        res += ones[(tn * 10) + one];
      } else {
        res += tens[tn];
        if (one > 0) {
          res += ` ${ones[one]}`;
        }
      }
    }
    return res;
  };

  return function(value) {
    let fraction = Math.round(frac(value) * 100);
    let f_text = '';
    if (fraction > 0) {
      f_text = `AND ${convert_number(fraction)}`;
    }
    let convertNumber = convert_number(value);
    if (convertNumber === '') {
      return '';
    } else {
      return convertNumber + ' ' + f_text + ' ONLY';
    }
  };
});



// capitalize first letter of a string
giddh.webApp.filter('capitalize', () =>
  function(input) {
    if (!!input) { return input.charAt(0).toUpperCase() + input.substr(1).toLowerCase(); } else { return ''; }
  }
);

// for date time filter for usage
// http://stackoverflow.com/questions/20662140/using-angularjs-date-filter-with-utc-date
//  usage
// {{ anyDateObjectOrString | moment: 'format': 'MMM DD, YYYY' }}
// {{ anyDateObjectOrString | moment: 'fromNow' }}
giddh.webApp.filter('moment', () =>
  function(input, momentFn) {
    let args = Array.prototype.slice.call(arguments, 2);
    let momentObj = moment(input, "DD-MM-YYYY HH:mm:ss");
    return momentObj[momentFn].apply(momentObj, args);
  }
);

angular.module('unique-name', []).
directive('validUnique', toastr=>
  ({
  require: 'ngModel',
  link(scope, element, attrs, modelCtrl) {
    element.on('keypress', function(event) {
      if (event.which === 32) {
        toastr.warning("Space not allowed", "Warning");
        event.preventDefault();
      }
    });
    modelCtrl.$parsers.push(function(inputValue) {
      let transformedInput = inputValue.toLowerCase().replace(RegExp(' ', 'g'), '');
      if (transformedInput !== inputValue) {
        modelCtrl.$setViewValue(transformedInput);
        modelCtrl.$render();
      }
      return transformedInput;
    });
  }
  })
);

angular.module('valid-number', []).
directive('validNumber', () =>
  ({
  require: '?ngModel',
  link(scope, element, attrs, ngModelCtrl) {
    if (!ngModelCtrl) {
      return;
    }
    ngModelCtrl.$parsers.push(function(val) {
      if (angular.isUndefined(val)) {
        val = '';
      }
      if (_.isNull(val)) {
        val = '';
      }
      let clean = val.replace(/[^0-9\.]/g, '');
      let decimalCheck = clean.split('.');
      if (!angular.isUndefined(decimalCheck[1])) {
        decimalCheck[1] = decimalCheck[1].slice(0, 2);
        clean = decimalCheck[0] + '.' + decimalCheck[1];
      }
      if (val !== clean) {
        ngModelCtrl.$setViewValue(clean);
        ngModelCtrl.$render();
      }
      return clean;
    });
    element.on('keypress', function(event) {
      if (event.keyCode === 32) {
        event.preventDefault();
      }
    });
  }

  })
)
.directive('validNumberNeg', () =>
  ({
  require: '?ngModel',
  link(scope, element, attrs, ngModelCtrl) {
    if (!ngModelCtrl) {
      return;
    }
    ngModelCtrl.$parsers.push(function(val) {
      if (angular.isUndefined(val)) {
        val = '';
      }
      if (_.isNull(val)) {
        val = '';
      }
      let clean = val.replace(/[^0-9\.]/g, '');
      // clean = val.replace(/^-?[1-9]\d{0,1}(\.[1-9]{1})?$/g, '')
      let decimalCheck = clean.split('.');
      if (!angular.isUndefined(decimalCheck[1])) {
        decimalCheck[1] = decimalCheck[1].slice(0, 2);
        clean = decimalCheck[0] + '.' + decimalCheck[1];
      }
      if (val !== clean) {
        ngModelCtrl.$setViewValue(clean);
        ngModelCtrl.$render();
      }
      return clean;
    });
    return element.on('keypress', function(event) {
      if (event.keyCode === 32) {
        return event.preventDefault();
      }
    });
  }
  })
);
// payment method razorpay
angular.module('razor-pay', []).
directive('razorPay', ['$compile', '$filter', '$document', '$parse', '$rootScope', '$timeout', 'toastr', ($compile, $filter, $document, $parse, $rootScope, $timeout, toastr) =>
  ({
    restrict: 'A',
    scope: false,
    transclude: false,
    controller: "userController",
    link(scope, element, attrs) {
      scope.proceedToPay = function(e, amount) {
        let options = {
          // key: "rzp_test_6SDWNz3uMF944l"
          key: "rzp_live_rM2Ub3IHfDnvBq",
          amount,
          name: "Giddh",
          description: $rootScope.selectedCompany.name+ " Subscription for Giddh",
          image: `file:///${__dirname}/public/webapp/Globals/images/logo.png`,
          handler(response){
            // hit api after success
            console.log(response, "response after success");
            return scope.addBalViaRazor(response);
          },
          prefill: {
            name: $rootScope.basicInfo.name,
            email: $rootScope.basicInfo.email,
            contact: $rootScope.selectedCompany.mobileNo
          },
          notes: {
            address: $rootScope.selectedCompany.address
          },
          theme: {
            color: "#449d44"
          }
        };
        let rzp1 = new Razorpay(options);
        rzp1.open();
        return e.preventDefault();
      };

      return element.on('click', function(e) {
        let diff;
        if (scope.isHaveCoupon && !_.isEmpty(scope.coupRes)) {
          if (scope.amount > scope.discount) {
            diff = scope.amount-scope.discount;
            return scope.proceedToPay(e, diff*100);
          } else {
            toastr.warning("Actual amount cannot be less than discount amount", "Warning");
            return false;
          }
        } else {
          diff = scope.removeDotFromString(scope.wlt.Amnt);
          return scope.proceedToPay(e, diff*100);
        }
      });
    }
  })

]);
// only for ledger
angular.module('valid-date', []).
directive('validDate', (toastr, $filter) =>
  ({
  require: '?ngModel',
  link(scope, element, attrs, ngModelCtrl) {
    if (!ngModelCtrl) {
      return;
    }
    ngModelCtrl.$parsers.push(function(val) {
      if (angular.isUndefined(val)) {
        val = '';
      }
      if (_.isNull(val)) {
        val = '';
      }
      let clean = val.replace(/[^0-9\-]/g, '');
      let hyphenCheck = clean.split('-');
      if (!angular.isUndefined(hyphenCheck[2])) {
        clean = hyphenCheck[0] + '-' + hyphenCheck[1] + '-' + hyphenCheck[2];
      }
      if (val !== clean) {
        ngModelCtrl.$setViewValue(clean);
        ngModelCtrl.$render();
      }
      return clean;
    });
    element.on('keypress', function(event) {
      element.removeClass('error');
      if (event.keyCode === 32) {
        event.preventDefault();
      }
    });
    element.on('focus', function() {
      if ((element.context.value === "") || (element.context.value === undefined) || (element.context.value === null)) {
        return scope.item.sharedData.entryDate = $filter('date')(new Date(), "dd-MM-yyyy");
      }
    });

    element.on('blur', function() {
      if (moment(element.context.value, "DD-MM-YYYY").isAfter(new Date())) {
        element.addClass('error');
        return toastr.error("You can\'t make a future entry", "Error");
      } else if (moment(element.context.value, "DD-MM-YYYY", true).isValid()) {
        return element.removeClass('error');
      } else {
        toastr.error("Date is not valid.", "Error");
        return element.addClass('error');
      }
    });
  }

  })
);

angular.module('ledger', [])
// .directive 'eLedger', ['$compile', '$filter', '$document', '$parse', '$rootScope', '$timeout', ($compile, $filter, $document, $parse, $rootScope, $timeout) ->
//   {
//     restrict: 'A'
//     replace: true
//     transclude: true
//     scope:
//       index: '=index'
//       item: '=itemdata'
//       aclist: '=acntlist'
//       canVWDLT: '=canViewAndDelete'
//       canAddAndEdit: '=canAddAndEdit'
//       selAcntUname: '=selAcntUname'
//       moveLedger: '&'
//       trashLedger: '&'
//       removeLedgdialog: '&'
//       discardLedger: '&'
//       removeClassInAllEle: '&'
//     controller: 'ledgerController'
//     template: "<form novalidate tabindex='-1'>
//       <div>
//         <script type='text/ng-template' id='customETemp.html'>
//           <a>
//             <span ng-bind-html='match.model.name'></span>
//             <span class='small'>({{match.model.uniqueName}})</span>
//           </a>
//         </script>
//           <table class='table ldgrInnerTbl'>
//             <tr>
//               <td width='28%'>
//                 <input pos='1' type='text' class='nobdr eLedgInpt' ng-model='item.sharedData.entryDate' tabindex='-1' ng-readonly='true' />
//               </td>
//               <td width=44%'>
//                 <div class='dropdown-parent'>
//                   <input pos='2' type='text'
//                   tabindex='-1' class='nobdr eLedgInpt' required
//                   name='trans_{{item.transactionId}}'
//                   ng-model-options='{debounce: 400}'
//                   ng-model='item.transactions[0].particular'
//                   uib-typeahead='obj as obj.name for obj in aclist | omit: isECurrentAc | filter:$viewValue'
//                   class='form-control' autocomplete='off'
//                   typeahead-no-results='noResultsE' typeahead-template-url='customETemp.html'
//                   typeahead-select-on-blur='true'
//                   >
//                 </div>
//               </td>
//               <td width='28%'>
//                 <input pos='3' type='text' class='alR nobdr eLedgInpt' tabindex='-1' autocomplete='off'
//                   ng-readonly='true' ng-model='item.transactions[0].amount'/>
//               </td>
//             </tr>
//           </table>
//         </div></form>"
//     link: (scope, elem, attrs) ->
//       index = scope.index
//       scope.el = elem[0]
//       fields = elem[0].getElementsByClassName('eLedgInpt')
//       i = 0
//       while i < fields.length
//         fields[i].addEventListener 'focus', (event) ->
//           eParentForm = angular.element(this).parents('form')
//           if !eParentForm.hasClass('open')
//             $timeout ->
//               scope.openEDialog(scope.item, eParentForm, index)
//             , 300
//         i++

//       scope.isECurrentAc =(obj) ->
//         obj.uniqueName is scope.selAcntUname

//       scope.highlightEntry =(item)->
//         scope.removeClassInAllEle("eLedgEntryForm", "highlightRow")
//         el = document.getElementsByClassName("entry_"+item.sharedData.transactionId)
//         angular.element(el).addClass('highlightRow')

//       scope.openEDialog = (item, eParentForm, index) ->
//         scope.highlightEntry(scope.item)
//         scope.removeClassInAllEle("eLedgEntryForm", "open")
//         elem.addClass('open')
//         rect = eParentForm[0].getBoundingClientRect()
//         childCount = eParentForm[0].childElementCount
//         formEle = "drELedgerEntryForm_"+index
//         popHtml = angular.element('
//           <div class="popover fade bottom eLedgerPopDiv">
//           <div class="arrow"></div>
//           <div class="popover-inner">
//           <h3 class="popover-title">Move entry to Giddh</h3>
//           <div class="popover-content">
//             <div class="clearfix form-group">
//               <div style="margin-top:0px" class="checkbox mrR1 pull-left" ng-if="canVWDLT">
//                 <label>
//                   <input ng-readonly="!canAddAndEdit" ng-model="item.sharedData.unconfirmedEntry" type="checkbox">Unconfirmed Entry
//                 </label>
//               </div>
//               <a class="pull-right" href="javascript:void(0)" ng-click="addNewAccount()" ng-show="noResultsE">Add new account</a>
//             </div>
//             <div class="row">
//               <div class="col-xs-6">
//                 <div class="form-group">
//                   <select
//                     class="form-control"
//                     name="voucherType"
//                     ng-model="item.sharedData.voucherType"
//                     ng-options="item.shortCode as item.name for item in voucherTypeList">
//                   </select>
//                 </div>
//                 <div class="form-group">
//                   <input type="text" name="tag" class="form-control" ng-model="item.sharedData.tag" placeholder="Tag" />
//                 </div>
//               </div>
//               <div class="col-xs-6">
//                 <div class="form-group">
//                   <textarea class="form-control" name="description" ng-model="item.sharedData.description" placeholder="Description"></textarea>
//                 </div>
//               </div>
//             </div>
//             <div class="form-group">
//               <button ng-init="isMoveDisabled=false" ng-disabled="item.transactions[0].particular.name === undefined || noResultsE || isMoveDisabled" ng-click="isMoveDisabled=true; moveLedger({entry: item})" class="btn btn-success mrR">Move in Giddh</button>
//               <button  ng-init="isTrashDisabled=false" ng-disabled="isTrashDisabled" class="btn btn-danger" ng-click="isTrashDisabled=true; trashLedger({entry: item})">Delete Entry</button>
//             </div>
//           </div>
//           </div>')

//         $document.on "click", (event)->
//           onDocumentClick(event)

//         onDocumentClick = (event) ->
//           inBox = angular.element(event.target).parents('.eLedgerPopDiv').length is 1 || event.target.parentNode.nodeName is "LI" || event.target.parentNode.nodeName is "A" || event.target.nodeName is "INPUT"
//           if !inBox
//             $document.off 'click'
//             scope.removeLedgerDialog('.eLedgerPopDiv')
//             scope.removeClassInAllEle("eLedgEntryForm", "open")
//             scope.removeClassInAllEle("eLedgEntryForm", "highlightRow")

//         if childCount == 1
//           scope.removeLedgerDialog('.eLedgerPopDiv')
//           $compile(popHtml)(scope)
//           eParentForm.append(popHtml)
//           popHtml.css({
//             display: "block",
//             top: rect.height + 13,
//             left: "0px",
//             visibility: "visible",
//             maxWidth: rect.width,
//             width: rect.width
//           })
//           popHtml.addClass('in')
//         else
//           return false
//         return true
//   }
// ]
// .directive 'ledgerPop', ['$compile', '$filter', '$document', '$parse', '$rootScope', '$timeout', 'toastr',($compile, $filter, $document, $parse, $rootScope, $timeout, toastr) ->
//   {
//   restrict: 'A'
//   replace: true
//   transclude: true
//   scope:
//     index: '=index'
//     item: '=itemdata'
//     aclist: '=acntlist'
//     ftype: '=ftype'
//     formClass: '@formClass'
//     canVWDLT: '=canViewAndDelete'
//     canAddAndEdit: '=canAddAndEdit'
//     selAcntUname: '=selAcntUname'
//     updateLedger: '&'
//     addLedger: '&'
//     removeLedgdialog: '&'
//     discardLedger: '&'
//     removeClassInAllEle: '&'
//     enterRowdebit: '&'
//     enterRowcredit: '&'
//     el:'&'
//     ledgerDataArray:'=ledgerDataArray'
//     taxList: '=taxList'
//   controller: 'ledgerController'
//   template: "<form novalidate tabindex='-1'>
//       <div>
//         <script type='text/ng-template' id='customTemplate.html'>
//           <a>
//             <span ng-bind-html='match.model.name'></span>
//             <span class='small'>({{match.model.uniqueName}})</span>
//           </a>
//         </script>
//           <table class='table ldgrInnerTbl'>
//             <tr>
//               <td width='28%'>
//                 <input pos='1' type='text' class='nobdr ledgInpt'
//                   tabindex='-1' required autocomplete='off'
//                   name='entryDate_{{index}}' ng-readonly='!canAddAndEdit'
//                   ng-model='item.sharedData.entryDate' valid-date/>
//               </td>
//               <td width=44%' class='dropdown-parent'>
//                 <input pos='2' type='text' ng-readonly='!canAddAndEdit'
//                   tabindex='-1'  class='nobdr ledgInpt' required
//                   name='trnsName_{{index}}'
//                   ng-model-options='{debounce: 400}''
//                   ng-model='item.transactions[0].particular'
//                   uib-typeahead='obj as obj.name for obj in aclist | omit: isCurrentAc | filter:$viewValue'
//                   class='form-control' autocomplete='off'
//                   typeahead-no-results='noResults' typeahead-template-url='customTemplate.html'
//                   typeahead-on-select='addCrossFormField($item, $model, $label)'>
//               </td>
//               <td width='28%'>
//                 <input pos='3' type='text' class='alR nobdr ledgInpt'
//                   tabindex='-1' required autocomplete='off'
//                   name='amount_{{index}}' ng-readonly='!canAddAndEdit'
//                   ng-model='item.transactions[0].amount'
//                   valid-number/>
//               </td>
//             </tr>
//           </table>
//         </div></form>"
//   link: (scope, elem, attrs) ->
//     scope.el = elem[0]
//     fields = elem[0].getElementsByClassName('ledgInpt')
//     i = 0
//     while i < fields.length
//       fields[i].addEventListener 'keydown', (e) ->
//         scope.moveCursor(e, this)

//       fields[i].addEventListener 'focus', (event) ->
//         parentForm = angular.element(this).parents('form')
//         if !parentForm.hasClass('open')
//           $timeout ->
//             if scope.canAddAndEdit
//               scope.openDialog(scope.item, scope.index, scope.ftype, parentForm)
//             else
//               scope.highlightMultiEntry(scope.item)
//               console.info "You don\'t have appropriate permission"
//           , 300
//       i++

//     scope.moveForward = (e, ths)->
//       target = ths.parentElement.nextElementSibling.firstElementChild
//       target.focus()

//     scope.moveBackward = (e, ths)->
//       target = ths.parentElement.previousElementSibling.firstElementChild
//       target.focus()

//     scope.moveCursor = (e, ths) ->
//       pos = ths.getAttribute("pos")
//       keycode1 = if window.event then e.keyCode else e.which
//       if pos is "1" or pos is "2"
//         # tab without shift key
//         if !e.shiftKey and (keycode1 is 0 or keycode1 is 9)
//           e.preventDefault()
//           scope.moveForward(e, ths)
//         # tab with shift key
//         if e.shiftKey and (keycode1 is 0 or keycode1 is 9)
//           e.preventDefault()
//           if pos is "2"
//             scope.moveBackward(e, ths)
//       else
//         if e.shiftKey and (keycode1 is 0 or keycode1 is 9)
//           e.preventDefault()
//           scope.moveBackward(e, ths)

//     scope.isCurrentAc =(acnt) ->
//       acnt.uniqueName is scope.selAcntUname

//     scope.addCrossFormField = (i, d, c) ->
//       # console.log i, d, c

//     scope.closeEntry = ()->
//       scope.removeLedgerDialog('.ledgerPopDiv')
//       scope.removeClassInAllEle("ledgEntryForm", "open")
//       scope.removeClassInAllEle("ledgEntryForm", "highlightRow")
//       scope.removeClassInAllEle("ledgEntryForm", "newMultiEntryRow")
//       scope.resetEntry(scope.item, $rootScope.lItem)

//     scope.closeAllEntry =()->
//       $rootScope.lItem = []
//       scope.removeLedgerDialog('.ledgerPopDiv')
//       scope.removeClassInAllEle("ledgEntryForm", "open")
//       scope.removeClassInAllEle("ledgEntryForm", "highlightRow")
//       scope.removeClassInAllEle("ledgEntryForm", "newMultiEntryRow")
//       scope.$emit('reloadFromAuto')


//     scope.resetEntry = (item, lItem) ->
//       scope.removeClassInAllEle("ledgEntryForm", "newMultiEntryRow")
//       if lItem.length > 1
//         _.each(lItem, (entry) ->
//           if entry.id is item.id
//             angular.copy(entry, item)
//         )
//       else
//         angular.copy(lItem[0], item)

//       if _.isUndefined(scope.item.sharedData.uniqueName)
//         item.sharedData.entryDate = undefined
//       return false

//     scope.setItemInLocalItemArr = (item) ->
//       if $rootScope.lItem.length > 0
//         found = undefined
//         if $rootScope.lItem[0].sharedData.uniqueName is item.sharedData.uniqueName
//           found = _.find($rootScope.lItem, (obj)->
//               obj.id is item.id
//             )
//           if found is undefined
//             $rootScope.lItem.push(angular.copy(item))
//             found = undefined
//         else
//           $rootScope.lItem = []
//           $rootScope.lItem.push(angular.copy(item))
//       else
//         $rootScope.lItem.push(angular.copy(item))

//     scope.checkDateField = (item) ->
//       if (item.sharedData.entryDate is "" || item.sharedData.entryDate is undefined || item.sharedData.entryDate is null)
//         item.sharedData.entryDate = $filter('date')(new Date(), "dd-MM-yyyy")

//     scope.highlightMultiEntry =(item)->
//       scope.removeClassInAllEle("ledgEntryForm", "highlightRow")
//       el = document.getElementsByClassName(item.sharedData.uniqueName)
//       angular.element(el).addClass('highlightRow')

//     scope.makeItHigh = () ->
//       scope.forwardtoCntrlScope(angular.element(scope.el), scope.item)
//       return false

//     scope.setTotalVal = (item) ->
//       if _.isNumber(item.sharedData.total)
//         if item.sharedData.total > 0
//           scope.ttlValD = item.sharedData.total.toFixed(2)
//           scope.ttlValDType = " CR"
//         else
//           scope.ttlValD = Math.abs(item.sharedData.total).toFixed(2)
//           scope.ttlValDType = " DR"
//       else
//         console.info "not a number"

//     scope.openDialog = (item, indexs, ftype, parentForm) ->
//       taxes_1 = []
//       refreshTaxList = (taxes) ->
//         taxes_refresh = []
//         _.each taxes, (tax) ->
//           if tax.isSelected
//             taxes_refresh.push(tax)
//         item.sharedData.taxes = taxes_refresh

//       manageTaxOndialog = (item) ->
//         obj = item
//         $timeout( ->
//           unq = obj.sharedData.uniqueName
//           taxList_1 = scope.taxList
//           siblings = []
//           if obj.sharedData.entryDate != undefined
// #            console.log obj.sharedData.entryDate
//             edArr = obj.sharedData.entryDate.split('-')
//             edMmddyy = edArr[1] + '-' + edArr[0] + '-' + edArr[2]
//             entryDate = new Date(edMmddyy).getTime()
//             item.sharedData.eDate = entryDate

//           _.each scope.ledgerDataArray.ledgers, (ledger) ->
//             if unq == ledger.uniqueName
//               siblings = ledger.transactions

//           _.each obj.transactions, (txn)->
//             _.each taxList_1, (tax) ->
//               tax.isSelected = false
//               if tax.account.uniqueName != 0 && tax.account.uniqueName == txn.particular.uniqueName
//                 tax.isSelected = true

//           _.each siblings, (txn) ->
//             _.each taxList_1, (tax) ->
//               if tax.account.uniqueName != 0 && tax.account.uniqueName == txn.particular.uniqueName
//                 tax.isSelected = true

//           _.each taxList_1, (tax) ->
//             dates = []
//             tax.withinDate = false

//             _.each tax.taxDetail, (det) ->
//               detArr = det.date.split('-');
//               detMmddyy = detArr[1] + '-' + detArr[0] + '-' + detArr[2]
//               date = new Date(detMmddyy).getTime()
//               dates.push(date)
//             dates = dates.sort()

//             if entryDate >= dates[0]
//               tax.withinDate = true

//           taxes_1 = taxList_1
//         )

//       manageTaxOndialog(item)

//       scope.$watch('item.sharedData.entryDate', (newVal, oldVal)->
//         if newVal != oldVal
//           manageTaxOndialog(item)
//       )

//       scope.$watch('item.transactions[0].amount', (newVal, oldVal)->
//         if newVal != oldVal
//           refreshTaxList(taxes_1)
//       )

//       scope.$watch('item.sharedData.unconfirmedEntry', (newVal, oldVal)->
//         refreshTaxList(taxes_1)
//       )

//       scope.removeClassInAllEle("ledgEntryForm", "open")
//       elem.addClass('open')
//       scope.highlightMultiEntry(item)
//       scope.checkDateField(item)
//       scope.setTotalVal(item)
//       rect = parentForm[0].getBoundingClientRect()
//       childCount = parentForm[0].childElementCount
//       popHtml = angular.element('
//           <div class="popover fade bottom ledgerPopDiv" id="popid_{{index}}">
//           <div class="arrow"></div>
//           <div class="popover-inner">
//           <h3 class="popover-title" ng-if="ftype == \'Update\'">Update entry - <span ng-if="item.sharedData.invoiceGenerated">Invoice for this entry is created, please delete invoice to edit this entry.</span></h3>
//           <h3 class="popover-title" ng-if="ftype == \'Add\'">Add new entry</h3>
//           <div class="popover-content">
//             <div class="mrT">
//               <div class="form-group">
//                 <div style="margin-top:3px" class="checkbox mrR1 pull-left" ng-if="canVWDLT && !item.sharedData.invoiceGenerated">
//                   <label>
//                     <input ng-readonly="!canAddAndEdit" ng-model="item.sharedData.unconfirmedEntry" type="checkbox">Unconfirmed Entry
//                   </label>
//                 </div>
//                 <button ng-disabled="{{formClass}}.$invalid || noResults || item.sharedData.invoiceGenerated" class="btn btn-sm btn-info mrR1" ng-click="enterRowdebit({entry: item}); makeItHigh();" ng-show="canAddAndEdit">Add in DR</button>
//                 <button ng-disabled="{{formClass}}.$invalid || noResults || item.sharedData.invoiceGenerated" class="btn btn-sm btn-primary" ng-click="enterRowcredit({entry: item}); makeItHigh();" ng-show="canAddAndEdit">Add in CR</button>
//                 <a class="pull-right" href="javascript:void(0)" ng-click="addNewAccount()" ng-show="noResults">Add new account</a>
//                 <div class="row mrT1" ng-show="{{formClass}}.$valid">
//                   <hr>
//                   <ul class="list-inline" style="margin-left:15px">
//                     <li ng-repeat="tax in taxList" ng-class="{pad0: tax.account.uniqueName == 0 || !tax.withinDate}">
//                        <div class="checkbox" ng-if="tax.account.uniqueName != 0 && tax.withinDate"><label><input type="checkbox" ng-model="tax.isSelected" ng-change="addTaxEntry(tax, item)" ng-disabled="item.sharedData.invoiceGenerated">{{tax.name}}</label></div>
//                     </li>
//                   </ul>
//                   <hr>
//                 </div>
//               </div>
//               <div class="row">
//                 <div class="col-xs-6">
//                   <div class="form-group">
//                     <select
//                       class="form-control"
//                       ng-readonly="!canAddAndEdit"
//                       name="voucherType"
//                       ng-model="item.sharedData.voucher.shortCode"
//                       ng-options="item.shortCode as item.name for item in voucherTypeList"
//                       ng-disabled="item.sharedData.invoiceGenerated">
//                     </select>
//                   </div>
//                   <div class="form-group">
//                     <input type="text" name="tag" ng-readonly="!canAddAndEdit" class="form-control" ng-model="item.sharedData.tag" placeholder="Tag"  ng-disabled="item.sharedData.invoiceGenerated"/>
//                   </div>
//                 </div>
//                 <div class="col-xs-6">
//                   <div class="form-group" ng-if="ftype == \'Update\'">
//                     <label>Voucher no. </label>
//                     {{item.sharedData.voucher.shortCode}}-{{item.sharedData.voucherNo}}
//                   </div>
//                   <div class="form-group">
//                     <textarea class="form-control" ng-readonly="!canAddAndEdit" name="description" ng-model="item.sharedData.description" placeholder="Description"  ng-disabled="item.sharedData.invoiceGenerated"></textarea>
//                   </div>
//                 </div>
//               </div>
//               <div class="mrB">
//                 <label>Total: {{ttlValD + ttlValDType}}</label>
//               </div>
//               <div class="">
//                 <button ng-if="ftype == \'Update\'" ng-show="canAddAndEdit" class="btn btn-success" type="button" ng-disabled="{{formClass}}.$invalid || noResults || item.sharedData.invoiceGenerated"
//                   ng-click="updateLedger({entry: item})">Update</button>
//                 <button  ng-if="ftype == \'Add\'" ng-show="canAddAndEdit" class="btn btn-success" type="button" ng-disabled="{{formClass}}.$invalid || noResults || item.sharedData.invoiceGenerated"
//                   ng-click="addLedger({entry: item});checkItem(item)">Add</button>

//                 <button ng-click="closeEntry()" class="btn btn-default mrL1" type="button" ng-disabled="item.sharedData.invoiceGenerated">close</button>

//                 <button ng-click="closeAllEntry()" ng-show="canAddAndEdit" class="btn btn-default mrL1" type="button" ng-disabled="item.sharedData.invoiceGenerated">close All</button>

//                 <button ng-if="canAddAndEdit" ng-show="item.sharedData.uniqueName != undefined" class="pull-right btn btn-danger" ng-click="discardLedger({entry: item})" ng-disabled="item.sharedData.invoiceGenerated">Delete Entry</button>
//               </div>
//             </div>
//           </div>
//         </div></div>')

//       $document.on "click", (event)->
//         onDocumentClick(event)

//       # scopeExpression = attrs.removeLedgdialog

//       onDocumentClick = (event) ->
//         inBox = angular.element(event.target).parents('.ledgerPopDiv').length is 1 || event.target.parentNode.nodeName is "LI" || event.target.parentNode.nodeName is "A" || event.target.nodeName is "INPUT"
//         if !inBox
//           if !_.isUndefined(item.sharedData.multiEntry) || !_.isUndefined(item.sharedData.addType)
//             if item.sharedData.multiEntry || item.sharedData.addType
//               console.info "is child and multiEntry"
//           else
//             scope.resetEntry(item, $rootScope.lItem)
//           # scope.$apply(scopeExpression)
//           scope.removeLedgerDialog('.ledgerPopDiv')
//           scope.removeClassInAllEle("ledgEntryForm", "open")
//           scope.removeClassInAllEle("ledgEntryForm", "highlightRow")
//           $document.off 'click'

//       if childCount == 1
//         scope.setItemInLocalItemArr(item)
//         scope.removeLedgerDialog('.ledgerPopDiv')
//         $compile(popHtml)(scope)
//         parentForm.append(popHtml)
//         popHtml.css({
//           display: "block",
//           top: rect.height + 13,
//           left: "0px",
//           visibility: "visible",
//           maxWidth: rect.width,
//           width: rect.width
//         })
//         popHtml.addClass('in')
//       else
//         return false
//       return true
//     scope.el = elem[0]
//   }
// ]

.filter('searchfilter', () =>
  function(input, q) {
    let result = [];
    _.each(input, function(g) {
      let p = RegExp(q, 'i');
      if (g.groupName.match(p) || g.groupUniqueName.match(p) || ((g.groupSynonyms !== null) && g.groupSynonyms.match(p))) {
        result.push(g);
      } else {
        let acMatch = false;
        _.each(g.accountDetails, function(a) {
          if (!acMatch) {
            if (a.name.match(p) || a.uniqueName.match(p) || a.mergedAccounts.match(p)) {
              acMatch = true;
              result.push(g);
            }
          }
        });
      }
    });
    return result;
  }
).filter('searchfilterInvoice', () =>
  function(input, q) {
    let result = [];
    _.each(input, function(g) {
      let p = RegExp(q, 'i');
      if (g.name.match(p) || g.uniqueName.match(p)) {
        result.push(g);
      } else {
        let acMatch = false;
        _.each(g.accounts, function(a) {
          if (!acMatch) {
            if (a.name.match(p) || a.uniqueName.match(p) || a.mergedAccounts.match(p)) {
              acMatch = true;
              result.push(g);
            }
          }
        });
      }
    });
    return result;
  }
  ).filter('addStockinAccountList', () =>
  function(input,baseAccount) {
    let result = [];
    _.each(input, function(q) {
      if (baseAccount.stocks) {
        _.each(baseAccount.stocks, stock => q.stocks = baseAccount.stocks);
      }

      if (q.stocks && (q.stocks.length > 0)) {
        _.each(q.stocks, function(stock) {
          let withStock = _.extend({}, q);
          withStock.stocks = [];
          withStock.stock = stock;
          withStock.stocks.push(stock);
          return result.push(withStock);
        });
        let withoutStock = _.extend({},q);
        delete withoutStock.stocks;
        return result.push(withoutStock);
      } else {
        return result.push(q);
      }
    });
    return result;
  }
  ).filter('searchAccountInPaginated', () =>
  function(input, g) {
    let result = [];
    _.each(input, function(q) {
      let p = RegExp(g, 'i');
      // # check if query matches with name and uniqueName
      if (q.name.match(p) || q.uniqueName.match(p) || ((q.mergedAccounts.length > 0) && q.mergedAccounts.match(p)) || (q.stock && (q.stock.name.match(p) || q.stock.uniqueName.match(p)))) {
        return result.push(q);
      }
    });
    return result;
  }
  ).directive('numbersOnly', () =>
  ({
    require: 'ngModel',
    link(scope, element, attr, ngModelCtrl) {
      let fromUser = function(text) {
        if (text) {
          let transformedInput = text.replace(/[^0-9]/g, '');
          if (transformedInput !== text) {
            ngModelCtrl.$setViewValue(transformedInput);
            ngModelCtrl.$render();
          }
          return transformedInput;
        }
        return undefined;
      };

      ngModelCtrl.$parsers.push(fromUser);
    }

  })
  );