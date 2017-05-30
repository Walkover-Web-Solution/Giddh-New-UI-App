
let app = angular.module("giddhApp", [
    "satellizer",
    "ui.bootstrap",
    "LocalStorageModule",
    "ngResource",
    "toastr",
    "ngVidBg",
    "fullPage.js",
    "vcRecaptcha",
    "valid-number",
    "razor-pay",
    "internationalPhoneNumber",
    "ngFileSaver"
]
);
app.config(ipnConfig => { dfebugger; ipnConfig.autoFormat = false });

angular.module('valid-number', []).
    directive('validNumber', () =>
        ({
            require: '?ngModel',
            link(scope, element, attrs, ngModelCtrl) {
                if (!ngModelCtrl) {
                    return;
                }
                ngModelCtrl.$parsers.push(function (val) {
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
                element.on('keypress', function (event) {
                    if (event.keyCode === 32) {
                        event.preventDefault();
                    }
                });
            }

        })
    );

angular.module('razor-pay', []).
    directive('razorPay', ['$compile', '$filter', '$document', '$parse', '$rootScope', '$timeout', 'toastr', ($compile, $filter, $document, $parse, $rootScope, $timeout, toastr) =>
        ({
            restrict: 'A',
            scope: false,
            transclude: false,
            link(scope, element, attrs) {
                scope.proceedToPay = function (e, amount) {
                    let options = {
                        // key: scope.wlt.razorPayKey
                        key: "rzp_live_rM2Ub3IHfDnvBq",
                        amount,
                        name: scope.wlt.company.name,
                        description: `Pay for ${scope.wlt.contentType} #${scope.wlt.contentNumber}`,
                        handler(response) {
                            // hit api after success
                            //          console.log response, "response after success"
                            let sendThis = {
                                companyUniqueName: scope.wlt.company.uniqueName,
                                uniqueName: scope.wlt.contentNumber,
                                paymentId: response.razorpay_payment_id
                            };
                            return scope.successPayment(sendThis);
                        },
                        // need to call payment api
                        prefill: {
                            name: scope.wlt.consumer.name,
                            email: scope.wlt.consumer.email,
                            contact: scope.wlt.consumer.contactNo
                        },
                        order_id: scope.wlt.orderId,
                        notes: {
                            order_id: scope.wlt.orderId
                        }
                    };
                    let rzp1 = new Razorpay(options);
                    rzp1.open();
                    return e.preventDefault();
                };

                return element.on('click', function (e) {
                    let diff = scope.removeDotFromString(scope.wlt.amount);
                    return scope.proceedToPay(e, Number(scope.wlt.amount) * 100);
                });
            }
        })

    ]);
app.controller('paymentCtrl', [
    '$scope', 'toastr', '$http', '$location', '$rootScope', '$filter', '$sce',
    function ($scope, toastr, $http, $location, $rootScope, $filter, $sce) {
        debugger
        let urlSearch = window.location.search;
        let searchArr = urlSearch.split("=");
        $scope.randomUniqueName = searchArr[1];
        let data = {};
        data.randomNumber = $scope.randomUniqueName;
        $scope.wlt = {
            Amnt: 100,
            orderId: ""
        };
        $scope.basicInfo = {
            name: 'ravi soni',
            email: 'ravisoni@walkover.in'
        };
        $scope.pdfFile = "";
        $scope.showInvoice = false;
        $scope.removeDotFromString = str => Math.floor(Number(str));

        $scope.b64toBlob = function (b64Data, contentType, sliceSize) {
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
            let blob = new Blob(byteArrays, { type: contentType });
            return blob;
        };
        $scope.getDetails = () =>
            $http.post('/invoice-pay-request', data).then(
                function (response) {
                    $scope.wlt = response.data.body;
                    //          str = $scope.wlt.content + "/" + $scope.wlt.contentNumber
                    //          data = $scope.b64toBlob(str, "application/pdf", 512)
                    //          blobUrl = URL.createObjectURL(data)
                    //
                    $scope.content = `data:application/pdf;base64,${$scope.wlt.content}`;
                    $scope.pdfFile = $sce.trustAsResourceUrl($scope.content);
                    $scope.contentHtml = $sce.trustAsHtml($scope.wlt.htmlContent);
                    return $scope.showInvoice = true;
                },
                error => toastr.error(error.data.message))
            ;

        $scope.successPayment = function (data) {
            if ($scope.wlt.contentType === "invoice") {
                return $http.post('/invoice/pay', data).then(
                    response => toastr.success(response.data.body),
                    error => toastr.error(error.data.message));
            } else if ($scope.wlt.contentType === "proforma") {
                return $http.post('/proforma/pay', data).then(
                    response => toastr.success(response.body),
                    error => toastr.error(error.data.message));
            }
        };

        $scope.downloadInvoice = function () {
            let dataUri = `data:application/pdf;base64,${$scope.wlt.content}`;
            let a = document.createElement('a');
            a.download = $scope.wlt.contentNumber + ".pdf";
            a.href = dataUri;
            return a.click();
        };

        return $scope.getDetails();
    }
]);

app.controller('homeCtrl', [
    '$scope', 'toastr', '$http', 'vcRecaptchaService', '$rootScope', '$location',
    function ($scope, toastr, $http, vcRecaptchaService, $rootScope, $location) {
        debugger;
        $scope.showLoginBox = false;
        $scope.toggleLoginBox = function (e) {
            $scope.showLoginBox = !$scope.showLoginBox;
            return e.stopPropagation();
        };

        $scope.resources = [
            'https://test-fs8eefokm8yjj.stackpathdns.com/public/website/images/Giddh.mp4'
        ];
        $scope.poster = 'https://test-fs8eefokm8yjj.stackpathdns.com/public/website/images/new/banner.jpg';
        $scope.fullScreen = true;
        $scope.muted = false;
        $scope.zIndex = '0';
        $scope.playInfo = {};
        $scope.pausePlay = true;

        $scope.formSubmitted = false;
        $scope.formProcess = false;

        $scope.pageOptions = {
            sectionsColor: ['#1bbc9b', '#FFF6E7', '#E3422E', '#4BBFC3', '#7BAABE', '#FFF6E7', '#FFF6E7', '#E34A26'],
            navigation: true,
            navigationPosition: 'right',
            scrollingSpeed: 800,
            scrollOverflow: true,
            responsiveWidth: 600,
            responsiveHeight: 400
        };
        $rootScope.homePage = true;
        $rootScope.pricingPage = false;

        $scope.socialList = [
            // {
            //   name: "Google",
            //   url: "javascript:void(0)",
            //   class: "gplus"
            // }
            {
                name: "Facebook",
                url: "http://www.facebook.com/giddh",
                class: "fb"
            },
            {
                name: "Linkedin",
                url: "javascript:void(0)",
                class: "in"
            },
            {
                name: "Twitter",
                url: "https://twitter.com/giddhcom/",
                class: "twit"
            }
            // {
            //   name: "Youtube"
            //   url: "http://www.youtube.com/watch?v=p6HClX7mMMY"
            //   class: "yt"
            // }
            // {
            //   name: "RSS"
            //   url: "http://blog.giddh.com/feed/"
            //   class: "rss"
            // }
        ];

        $scope.captchaKey = '6LcgBiATAAAAAMhNd_HyerpTvCHXtHG6BG-rtcmi';


        // check string has whitespace
        $scope.hasWhiteSpace = s => /\s/g.test(s);

        $scope.validateEmail = function (emailStr) {
            let pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return pattern.test(emailStr);
        };

        $scope.submitForm = function (data) {

            $scope.formProcess = true;
            //check and split full name in first and last name
            if ($scope.hasWhiteSpace(data.name)) {
                let unameArr = data.name.split(" ");
                data.uFname = unameArr[0];
                data.uLname = unameArr[1];
            } else {
                data.uFname = data.name;
                data.uLname = "  ";
            }

            if (!($scope.validateEmail(data.email))) {
                toastr.warning("Enter valid Email ID", "Warning");
                return false;
            }

            data.company = '';

            if (_.isEmpty(data.message)) {
                data.message = 'test';
            }

            return $http.post('/contact/submitDetails', data).then(function (response) {
                $scope.formSubmitted = true;
                if ((response.status === 200) && _.isUndefined(response.data.status)) {
                    return $scope.responseMsg = "Thanks! we will get in touch with you soon";
                } else {
                    return $scope.responseMsg = response.data.message;
                }
            });
        };

        $(document).on('click', e => $scope.showLoginBox = false);
        $scope.goTo = state => window.location = state;

        $scope.goToNewTab = state => window.open(state, "_blank");


        $scope.geo = {};
        $scope.geo.country = 'IN';
        let getLocation = function () {
            this.success = res => $scope.geo = res.data;

            this.failure = res => console.log(res);
            //toastr.error(res.data)

            return $http.get('/app/api/user-location').then(this.success, this.failure);
        };

        return getLocation();
    }
]);

app.config([
    '$authProvider',
    function ($authProvider) {
        debugger;
        $authProvider.google({
            clientId: '641015054140-3cl9c3kh18vctdjlrt9c8v0vs85dorv2.apps.googleusercontent.com',
            url: '/app/auth/google'
        });
        $authProvider.twitter({
            clientId: 'w64afk3ZflEsdFxd6jyB9wt5j',
            url: '/app/auth/twitter'
        });
        $authProvider.linkedin({
            clientId: '75urm0g3386r26',
            url: '/app/auth/linkedin'
        });

        // LinkedIn
        return $authProvider.linkedin({
            url: '/app/auth/linkedin',
            authorizationEndpoint: 'https://www.linkedin.com/uas/oauth2/authorization',
            // redirectUri: "http://localhost:8000/login/"
            redirectUri: window.location.origin + "/login/",
            requiredUrlParams: ['state'],
            scope: ['r_emailaddress'],
            scopeDelimiter: ' ',
            state: 'STATE',
            type: '2.0',
            popupOptions: { width: 527, height: 582 }
        });
    }
]);

app.config(localStorageServiceProvider => { debugger; localStorageServiceProvider.setPrefix('giddh') });


app.config(vcRecaptchaServiceProvider => {
    debugger;
    return vcRecaptchaServiceProvider.setDefaults({
        key: '6LcgBiATAAAAAMhNd_HyerpTvCHXtHG6BG-rtcmi'
        // theme: 'dark'
        //stoken: '6LcgBiATAAAAACj5K_70CDbRUSyGR1R7e9gckO1w'
        // size: 'compact'
    })
}
);

// app.config [
//   '$locationProvider'
//   ($locationProvider) ->
//     $locationProvider.html5Mode({
//       enabled: true
//       requireBase: false
//     })
// ]

app.run([
    '$rootScope',
    '$window',
    function ($rootScope, $window) {
        debugger;
        $rootScope.magicLinkPage = false;
        $rootScope.whiteLinks = false;
        $rootScope.loginPage = false;
        $rootScope.signupPage = false;
        $rootScope.fixedHeader = false;
        $rootScope.showBlack = false;
        let loc = window.location.pathname;
        if ((loc === "/index") || (loc === "/")) {
            $rootScope.whiteLinks = true;
        }
        if (loc === "/magic") {
            $rootScope.magicLinkPage = true;
            $rootScope.fixedHeader = false;
            $rootScope.showBlack = true;
        }
        if (loc === "/login") {
            $rootScope.whiteLinks = true;
            $rootScope.loginPage = true;
        }
        if (loc === "/about") {
            $rootScope.whiteLinks = true;
            $rootScope.fixedHeader = true;
        }
        if (loc === "/payment") {
            $rootScope.showBlack = true;
        }
        if (loc === "/signup") {
            $rootScope.whiteLinks = true;
            $rootScope.signupPage = true;
        }

        //#detect if browser is IE##
        let isIE = function () {
            let ua = navigator.userAgent;

            /* MSIE used to detect old browsers and Trident used to newer ones*/

            let is_ie = (ua.indexOf('MSIE ') > -1) || (ua.indexOf('Trident/') > -1);
            return is_ie;
        };

        $rootScope.browserIE = false;

        if (isIE()) {
            $rootScope.browserIE = true;
            return window.location.pathname = '/IE';
        }
    }
]);



(() =>
    angular.module('giddhApp').directive('autoActive', [
        '$location',
        $location =>
            ({
                restrict: 'A',
                scope: false,
                link(scope, element) {
                    let setActive = function () {
                        let cElem;
                        let fURL = $location.absUrl().split('/');
                        let pathT = fURL.reverse();
                        let path = pathT[0];

                        if (path) {
                            cElem = element.find(`li a.${path}`);
                            return cElem.addClass('active');
                        } else {
                            cElem = element.find('.nav li a.home');
                            return cElem.addClass('active');
                        }
                    };

                    setActive();
                    return scope.$on('$locationChangeSuccess', setActive);
                }
            })

    ])
)();

app.controller('magicCtrl', [
    '$scope', 'toastr', '$http', '$location', '$rootScope', '$filter', 'FileSaver',
    function ($scope, toastr, $http, $location, $rootScope, $filter, FileSaver) {
        let ml = this;
        $rootScope.magicLinkPage = true;
        $scope.magicReady = false;
        $scope.magicLinkId = window.location.search.split('=');
        $scope.magicLinkId = $scope.magicLinkId[1];
        $scope.ledgerData = [];
        $scope.magicUrl = '/magic-link';
        $scope.downloadInvoiceUrl = $scope.magicUrl + '/download-invoice';
        $scope.today = new Date();
        $scope.fromDate = { date: new Date() };
        $scope.toDate = { date: new Date() };
        $scope.fromDatePickerIsOpen = false;
        $scope.toDatePickerIsOpen = false;
        $scope.dateOptions = {
            'year-format': "'yy'",
            'starting-day': 1,
            'showWeeks': false,
            'show-button-bar': false,
            'year-range': 1,
            'todayBtn': false
        };
        $scope.format = "dd-MM-yyyy";
        $scope.showError = false;
        $scope.accountName = '';
        $scope.isCompoundEntry = false;


        $scope.fromDatePickerOpen = function () {
            return this.fromDatePickerIsOpen = true;
        };

        $scope.toDatePickerOpen = function () {
            return this.toDatePickerIsOpen = true;
        };

        $scope.data = {
            id: $scope.magicLinkId
        };

        $scope.filterLedgers = ledgers =>
            _.each(ledgers, function (lgr) {
                lgr.hasDebit = false;
                lgr.hasCredit = false;
                if (lgr.transactions.length > 0) {
                    return _.each(lgr.transactions, function (txn) {
                        if (txn.type === 'DEBIT') {
                            return lgr.hasDebit = true;
                        } else if (txn.type === 'CREDIT') {
                            return lgr.hasCredit = true;
                        }
                    });
                }
            })
            ;

        $scope.assignDates = function (fromDate, toDate) {
            let fdArr = fromDate.split('-');
            let tdArr = toDate.split('-');
            let from = new Date(fdArr[1] + '/' + fdArr[0] + '/' + fdArr[2]);
            let to = new Date(tdArr[1] + '/' + tdArr[0] + '/' + tdArr[2]);
            $scope.fromDate.date = from;
            return $scope.toDate.date = to;
        };

        $scope.getData = function (data, updateDates) {
            $scope.magicReady = false;
            let _data = data;
            return $http.post($scope.magicUrl, { data: _data }).then(
                function (success) {
                    $scope.companyName = success.data.body.companyName.split(" ");
                    $scope.companyName = $scope.companyName[0];
                    $scope.accountName = success.data.body.account.name;
                    $scope.ledgerData = success.data.body.ledgerTransactions;
                    $scope.filterLedgers($scope.ledgerData.ledgers);
                    $scope.countTotalTransactions();
                    $scope.calReckoningTotal();
                    $scope.magicReady = true;
                    $scope.showError = false;
                    if (updateDates) {
                        return $scope.assignDates($scope.ledgerData.ledgers[0].entryDate, $scope.ledgerData.ledgers[$scope.ledgerData.ledgers.length - 1].entryDate);
                    }
                },
                function (error) {
                    toastr.error(error.data.message);
                    $scope.magicReady = true;
                    return $scope.showError = true;
                });
        };

        $scope.downloadInvoice = function (invoiceNumber) {
            this.success = function (res) {
                let blobData = ml.b64toBlob(res.data.body, "application/pdf", 512);
                return FileSaver.saveAs(blobData, invoiceNumber + ".pdf");
            };
            this.failure = res => toastr.error(res.message);
            let _data = {
                id: $scope.data.id,
                invoiceNum: invoiceNumber
            };
            return $http.post($scope.downloadInvoiceUrl, { data: _data }).then(this.success, this.failure);
        };

        $scope.getData($scope.data, true);

        ml.b64toBlob = function (b64Data, contentType, sliceSize) {
            contentType = contentType || '';
            sliceSize = sliceSize || 512;
            // b64Data = b64Data.replace(/\s/g, '')
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
            let blob = new Blob(byteArrays, { type: contentType });
            return blob;
        };

        $scope.getDataByDate = function (updateDates) {
            $scope.data.from = $filter('date')($scope.fromDate.date, 'dd-MM-yyyy');
            $scope.data.to = $filter('date')($scope.toDate.date, 'dd-MM-yyyy');
            return $scope.getData($scope.data, updateDates);
        };

        //for contact form
        // check string has whitespace
        $scope.hasWhiteSpace = s => /\s/g.test(s);

        $scope.validateEmail = function (emailStr) {
            let pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return pattern.test(emailStr);
        };

        $scope.captchaKey = '6LcgBiATAAAAAMhNd_HyerpTvCHXtHG6BG-rtcmi';

        $scope.submitForm = function (data) {
            $scope.formProcess = true;
            //check and split full name in first and last name
            if ($scope.hasWhiteSpace(data.name)) {
                let unameArr = data.name.split(" ");
                data.uFname = unameArr[0];
                data.uLname = unameArr[1];
            } else {
                data.uFname = data.name;
                data.uLname = "";
            }

            if (!($scope.validateEmail(data.email))) {
                toastr.warning("Enter valid Email ID", "Warning");
                return false;
            }

            data.company = '';

            if (_.isEmpty(data.message)) {
                data.message = 'test';
            }

            return $http.post('https://giddh.com/contact/submitDetails', data).then(function (response) {
                $scope.formSubmitted = true;
                if ((response.status === 200) && _.isUndefined(response.data.status)) {
                    return $scope.responseMsg = "Thanks! will get in touch with you soon";
                } else {
                    return $scope.responseMsg = response.data.message;
                }
            });
        };

        $scope.entryTotal = {};
        $scope.entryTotal.amount = '';
        $scope.entryTotal.type = '';

        $scope.checkCompEntry = function (ledger) {
            //$scope.entryTotal = ledger.total
            let unq = ledger.uniqueName;
            ledger.isCompoundEntry = true;
            return _.each($scope.ledgerData.ledgers, function (lgr) {
                if (unq === lgr.uniqueName) {
                    return lgr.isCompoundEntry = true;
                } else {
                    return lgr.isCompoundEntry = false;
                }
            });
        };

        $scope.creditTotal = 0;
        $scope.debitTotal = 0;
        $scope.reckoningDebitTotal = 0;
        $scope.reckoningCreditTotal = 0;
        $scope.countTotalTransactions = function () {
            $scope.creditTotal = 0;
            $scope.debitTotal = 0;
            $scope.dTxnCount = 0;
            $scope.cTxnCount = 0;
            if ($scope.ledgerData.ledgers.length > 0) {
                return _.each($scope.ledgerData.ledgers, function (ledger) {
                    if (ledger.transactions.length > 0) {
                        return _.each(ledger.transactions, function (txn) {
                            txn.isOpen = false;
                            if (txn.type === 'DEBIT') {
                                $scope.dTxnCount += 1;
                                return $scope.debitTotal += Number(txn.amount);
                            } else {
                                $scope.cTxnCount += 1;
                                return $scope.creditTotal += Number(txn.amount);
                            }
                        });
                    }
                });
            }
        };

        return $scope.calReckoningTotal = function () {
            $scope.reckoningDebitTotal = $scope.ledgerData.debitTotal;
            $scope.reckoningCreditTotal = $scope.ledgerData.creditTotal;
            if ($scope.ledgerData.balance.type === 'CREDIT') {
                $scope.reckoningDebitTotal += $scope.ledgerData.balance.amount;
                return $scope.reckoningCreditTotal += $scope.ledgerData.forwardedBalance.amount;
            } else if ($scope.ledgerData.balance.type === 'DEBIT') {
                $scope.reckoningCreditTotal += $scope.ledgerData.balance.amount;
                return $scope.reckoningDebitTotal += $scope.ledgerData.forwardedBalance.amount;
            }
        };
    }
]);


app.controller('successCtrl', [
    '$scope', 'toastr', '$http', '$location', '$rootScope', '$filter',
    function ($scope, toastr, $http, $location, $rootScope, $filter) {
        let urlSearch = window.location.search;
        let searchArr = urlSearch.split("=");
        let LoginId = searchArr[1];
        let url = '/ebanks/login';
        let data = {
            loginId: LoginId
        };

        return $http.put(url, data).then(
            function (success) { },

            function (error) { }

        );
    }

]);

app.controller('verifyEmailCtrl', [
    '$scope', 'toastr', '$http',
    function ($scope, toastr, $http) {
        let urlSearch = window.location.search;
        if (!_.isEmpty(urlSearch)) {
            let searchArr = urlSearch.split("&");
            let emailAddress = searchArr[0].split("=")[1];
            let companyUniqueName = searchArr[1].split("=")[1];
            let scope = searchArr[2].split("=")[1];
            let data = {};
            data.companyUname = companyUniqueName;
            data.emailAddress = emailAddress;
            data.scope = scope;
            let url = '/verify-email';

            return $http.post(url, data).then(
                success => console.log(success),
                error => console.log(error));
        }
    }
]);

app.directive('numbersOnly', () =>
    ({
        require: 'ngModel',
        link(scope, element, attr, ngModelCtrl) {

            let fromUser = function (text) {
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

app.directive('numberSelect', () =>
    ({
        require: 'ngModel',
        link(scope, element, attr, ngModelCtrl) {
            $(element).intlTelInput();
            scope.intlNumber = $(element).intlTelInput("getNumber");

            scope.$watch('intlNumber', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    return console.log(newVal);
                }
            });

            return $(element).on("countrychange", (e, countrydata) => console.log(countrydata));
        }

    })
);

// resources locations
// video background- https://github.com/2013gang/angular-video-background
// angular-fullPage.js- https://github.com/hellsan631/angular-fullpage.js
// angular-recaptcha- https://github.com/VividCortex/angular-recaptcha
