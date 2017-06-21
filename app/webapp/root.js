/* eslint-disable */
window.giddh = {};
window.moment = require('moment')
import * as daterangepicker from 'bootstrap-daterangepicker';
window.daterangepicker = daterangepicker
giddh.serviceModule = angular.module("serviceModule", ["LocalStorageModule", "ngResource", "ui.bootstrap"]);

// import './Globals/css/bootstrap.css';
// import './Globals/css/font-awesome.css';
// import './Globals/css/style-1.css';
// import './Globals/css/style-2.css';
// import './Globals/css/fjala.css';
// import './Globals/css/new-style.css';
// import './Globals/css/angular-ui-switch.min.css';
// import './Globals/css/angular-ui-tree.min.css';
// import './Globals/css/select.min.css';
// import './Globals/css/jquery.fullPage.css';
// import './Globals/css/angular-wizard.min.css';
// import './Globals/css/intlTelInput.css';
// import './Globals/css/angular-gridster.min.css';



giddh.webApp = angular.module("giddhWebApp",
    [
        "custom_snippet_giddh",
        "satellizer",
        "LocalStorageModule",
        "perfect_scrollbar",
        "ngSanitize",
        "ui.bootstrap",
        "twygmbh.auto-height",
        "toastr",
        "ngResource",
        "ui.tree",
        "fullPage.js",
        "valid-number",
        "valid-date",
        "ledger",
        "ngVidBg",
        "angular.filter",
        "unique-name",
        "ui.router",
        "trialBalance",
        "ngFileUpload",
        "exportDirectives",
        "serviceModule",
        "chart.js",
        "ui.select",
        "uiSwitch",
        "razor-pay",
        "ngCsv",
        "ngclipboard",
        "dashboard",
        "mgo-angular-wizard",
        "googlechart",
        "ngFileSaver",
        "gridster",
        "ui.tinymce",
        "daterangepicker",
        "inventory",
        "recurringEntry",
        "ui.mask",
        "nzTour",
        "vcRecaptcha",
        "internationalPhoneNumber"
    ]
);
// giddh.webApp.config(ipnConfig => {  ipnConfig.autoFormat = false });
giddh.webApp.config(localStorageServiceProvider => { localStorageServiceProvider.setPrefix('giddh') });

giddh.webApp.config([
    '$authProvider',
    function ($authProvider) {
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
giddh.webApp.config(vcRecaptchaServiceProvider => {
    return vcRecaptchaServiceProvider.setDefaults({
        key: '6LcgBiATAAAAAMhNd_HyerpTvCHXtHG6BG-rtcmi'
        // theme: 'dark'
        //stoken: '6LcgBiATAAAAACj5K_70CDbRUSyGR1R7e9gckO1w'
        // size: 'compact'
    })
}
);

giddh.webApp.config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $qProvider) {
    // $qProvider.errorOnUnhandledRejections(false);

    // $rootScope.prefixThis = "https://test-fs8eefokm8yjj.stackpathdns.com"
    let appendThis = "";
    $stateProvider.state('/home', {
        url: '/home',
        resolve: {
            companyServices: 'companyServices',
            localStorageService: 'localStorageService',
            toastr: 'toastr',
            getLedgerState(companyServices, localStorageService, toastr) {
                let user = {
                    role: {
                        uniqueName: undefined
                    },
                    firstLogin: true
                };
                let checkRole = data =>
                    ({
                        type: data.role.uniqueName,
                        data
                    })
                    ;
                let onSuccess = function (res) {
                    let a;
                    let companyList = _.sortBy(res.body, 'shared');
                    let cdt = localStorageService.get("_selectedCompany");
                    if (!_.isNull(cdt) && !_.isEmpty(cdt) && !_.isUndefined(cdt)) {
                        let cst = _.findWhere(companyList, { uniqueName: cdt.uniqueName });
                        if (_.isUndefined(cst)) {
                            a = checkRole(companyList[0]);
                            localStorageService.set("_selectedCompany", companyList[0]);
                            return a;
                        } else {
                            a = checkRole(cst);
                            localStorageService.set("_selectedCompany", cst);
                            return a;
                        }
                    } else {
                        localStorageService.set("_selectedCompany", companyList[0]);
                        if (companyList.length < 1) {
                            a = checkRole(user);
                            return a;
                        } else {
                            a = checkRole(companyList[0]);
                            return a;
                        }
                    }
                };
                let onFailure = res => toastr.error(`Failed to retrieve company list${res.data.message}`);
                if (!isElectron) {
                    return companyServices.getAll().then(onSuccess, onFailure);
                } else {
                    if (window.sessionStorage.getItem('_ak')) {
                        let cdt = localStorageService.get("_uniqueName");
                        return companyServices.getAllElectron(cdt).then(onSuccess, onFailure);
                    } else {
                        return { data: {} }
                    }
                }
            }
        },
        templateUrl: 'public/webapp/views/demo.html',
        controller: 'homeController'
    }
    ).state('login', {
        url: '/login',
        templateUrl: 'public/webapp/views/login.html',
        controller: 'loginController'
    })
        .state('Reports', {
            url: '/reports',
            templateUrl: appendThis + 'public/webapp/Reports/reports.html',
            controller: 'reportsController',
            params: { 'frmDt': null, 'toDt': null, 'type': null }
        }
        )
        .state('audit-logs', {
            url: '/audit-logs',
            templateUrl: appendThis + 'public/webapp/AuditLogs/audit-logs.html',
            controller: 'logsController'
        }
        )
        .state('search', {
            url: '/search',
            templateUrl: appendThis + 'public/webapp/Search/searchContent.html',
            controller: 'searchController'
        }
        )
        .state('invoice', {
            url: '',
            abstract: true,
            templateUrl: appendThis + 'public/webapp/views/home.html',
            controller: 'invoiceController'
        }
        )
        .state('invoice.accounts', {
            url: '/invoice',
            views: {
                'accounts': {
                    templateUrl: appendThis + 'public/webapp/Invoice/invoiceAccounts.html'
                },
                'rightPanel': {
                    abstract: true,
                    template: '<div ui-view></div>'
                }
            }
        }
        )
        .state('invoice.accounts.invoiceId', {
            url: '/:invId',
            templateUrl: appendThis + 'public/webapp/Invoice/invoiceContent.html'
        }
        )
        .state('company', {
            url: '',
            abstract: true,
            templateUrl: appendThis + 'public/webapp/views/home.html',
            controller: 'groupController'
        }
        )
        .state('company.content', {
            url: '',
            views: {
                'rightPanel': {
                    abstract: true,
                    template: '<div ui-view="rightPanel"></div>',
                    controller: 'companyController'
                }
            }
        }
        )
        .state('company.content.manage', {
            url: '/manage',
            views: {
                'rightPanel': {
                    templateUrl: appendThis + 'public/webapp/ManageCompany/manageCompany.html'
                }
            }
        }
        )
        .state('company.content.user', {
            url: '/user',
            views: {
                'rightPanel': {
                    templateUrl: appendThis + 'public/webapp/UserDetails/userDetails.html',
                    controller: 'userController'
                }
            }
        }
        )
        .state('company.content.tbpl', {
            url: '/trial-balance-and-profit-loss',
            views: {
                'rightPanel': {
                    templateUrl: appendThis + 'public/webapp/Tbpl/tbpl.html',
                    controller: 'tbplController'
                }
            }
        }
        )
        .state('company.content.ledgerContent', {
            url: '/ledger/:unqName',
            views: {
                'rightPanel': {
                    templateUrl: appendThis + 'public/webapp/Ledger/ledger-wrapper.html',
                    controller: 'ledgerController',
                    controllerAs: 'ledgerCtrl'
                }
            }
        }
        )
        // .state('company.content.ledgerContent1',
        //   url: '/ledger-paginated/:unqName'
        //   views:{
        //     # 'accountsList':{
        //     #   templateUrl: appendThis+'public/webapp/views/accounts.html'
        //     # }
        //     'rightPanel':{
        //       templateUrl: appendThis+'public/webapp/Ledger/ledgerPaginated.html'
        //       controller: 'ledgerController'
        //       controllerAs: 'ledgerCtrl'
        //     }
        //   }
        // )
        .state('dashboard', {
            url: '/dashboard',
            templateUrl: appendThis + 'public/webapp/Dashboard/dashboard.html',
            controller: "dashboardController"
        }
        )
        .state('inventory', {
            url: '/inventory',
            templateUrl: 'public/webapp/Inventory/inventory.html',
            controller: 'stockController',
            controllerAs: 'stock'
        }
        )
        .state('inventory.custom-stock', {
            url: '/custom-stock',
            views: {
                'inventory-detail': {
                    templateUrl: 'public/webapp/Inventory/partials/custom-stock-unit.html',
                    controller: 'inventoryCustomStockController',
                    controllerAs: 'vm'
                }
            }
        }
        )
        .state('inventory.add-group', {
            url: '/add-group/:grpId',
            views: {
                'inventory-detail': {
                    templateUrl: 'public/webapp/Inventory/partials/add-group-stock.html'
                }
            }
        }
        )
        .state('inventory.add-group.stock-report', {
            url: '/stock-report/:stockId',
            views: {
                'inventory-detail@inventory': {
                    templateUrl: 'public/webapp/Inventory/partials/stock-report.html',
                    controller: 'inventoryStockReportController',
                    controllerAs: 'vm'
                }
            }
        }
        )
        .state('inventory.add-group.add-stock', {
            url: '/add-stock/:stockId',
            views: {
                'inventory-detail@inventory': {
                    templateUrl: 'public/webapp/Inventory/partials/stock-operations.html',
                    controller: 'inventoryAddStockController',
                    controllerAs: 'vm'
                }
            }
        }
        )
        .state('recurring-entry', {
            url: '/recurring-entry',
            templateUrl: 'public/webapp/recurring-entry/recurring-entry.html',
            controller: 'recurringEntryController',
            controllerAs: 'recEntry'
        }
        )
        .state('/thankyou', {
            url: '/thankyou',
            templateUrl: appendThis + 'public/webapp/views/thanks.html',
            controller: 'thankyouController'
        }
        )
        .state('proforma', {
            url: '',
            abstract: true,
            templateUrl: appendThis + 'public/webapp/views/home.html',
            controller: 'proformaController'
        }
        )
        .state('proforma.accounts', {
            url: '/proforma',
            views: {
                'accounts': {
                    templateUrl: appendThis + 'public/webapp/invoice2/proforma/proformaAccounts.html'
                },
                'rightPanel': {
                    abstract: true,
                    templateUrl: appendThis + 'public/webapp/invoice2/proforma/proformaContent.html'
                }
            }
        }
        )
        .state('settings', {
            url: '/settings',
            templateUrl: appendThis + 'public/webapp/Settings/settings.html',
            controller: 'settingsController'
        }
        )
        .state('invoice2', {
            url: '/invoice2',
            templateUrl: appendThis + 'public/webapp/invoice2/invoice2.html',
            controller: 'invoice2Controller'
        }
        );
    //
    if (!isElectron) {
        // $locationProvider.html5Mode(false);
    }
    $urlRouterProvider.otherwise('/home');
});
giddh.webApp.run([
    '$rootScope',
    '$state',
    '$stateParams',
    '$location',
    '$window',
    'toastr',
    'localStorageService',
    'DAServices',
    'groupService',
    '$http',
    function ($rootScope, $state, $stateParams, $location, $window, toastr, localStorageService, DAServices, groupService, $http) {

        if (localStorageService.get('_ak')) {
            window.sessionStorage.setItem('_ak', localStorageService.get('_ak'))
        }

        $rootScope.magicLinkPage = false;
        $rootScope.whiteLinks = false;
        $rootScope.loginPage = false;
        $rootScope.signupPage = false;
        $rootScope.fixedHeader = false;
        $rootScope.showBlack = false;
        let loc = window.location.pathname;
        if ((loc === "/index") || (loc === "/")) {
            $rootScope.hideHeader = false;
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
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.showLedgerBox = false;


            if (_.isEmpty(toParams)) {
                return $rootScope.selAcntUname = undefined;
            }
        });
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $('html,body').animate({ scrollTop: $('html').offset().top }, 'slow');
            if (isElectron) {
                if (!window.sessionStorage.getItem('_ak') && toState !== 'login') {
                    $rootScope.toState = toState.name;
                    event.preventDefault();
                    $state.go('login').then(function () {
                        $rootScope.toState = undefined;
                    });
                }
            }
            return false;
        });
        $rootScope.msieBrowser = function () {
            let ua = window.navigator.userAgent;
            let msie = ua.indexOf('MSIE');
            if ((msie > 0) || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
                return true;
            } else {
                console.info(window.navigator.userAgent, 'otherbrowser', msie);
                return false;
            }
        };
        //    # open window for IE
        $rootScope.openWindow = function (url) {
            let win = window.open();
            win.document.write('sep=,\r\n', url);
            win.document.close();
            win.document.execCommand('SaveAs', true, 'abc.xls');
            return win.close();
        };
        //
        //   $rootScope.firstLogin = true

        $rootScope.$on('companyChanged', function () {
            DAServices.ClearData();
            localStorageService.remove("_ledgerData");
            return localStorageService.remove("_selectedAccount");
        });
        return $rootScope.canChangeCompany = false;
    }
]);

giddh.webApp.config($sceProvider => $sceProvider.enabled(false));

giddh.webApp.config($httpProvider => $httpProvider.interceptors.push('appInterceptor'));

giddh.webApp.factory('appInterceptor', ['$q', '$location', '$log', 'toastr', '$timeout', '$rootScope',
    ($q, $location, $log, toastr, $timeout, $rootScope) =>
        ({
            request(request) {
                $rootScope.superLoader = true;
                if (isElectron) {
                    var unhandledExt = ['html', 'png', 'css', 'jpg', 'gif', 'woff', 'woff2'];
                    var requestUrl = request.url;
                    if (unhandledExt.indexOf(requestUrl.split('.').pop()) > -1) {
                        return request
                    }
                    request.url = 'http://apitest.giddh.com/' + requestUrl
                    if (window.sessionStorage.getItem('_ak')) {
                    request.headers['Auth-Key'] = window.sessionStorage.getItem('_ak');
                    request.headers['X-Forwarded-For'] = '::1'
                    }
                    // if (window.sessionStorage.getItem('_userDetails'))
                    //     request.headers['user-uniquename'] = window.sessionStorage.getItem('_userDetails');

                }
                return request;

            },
            response(response) {
                $rootScope.superLoader = false;
                return response;
            },
            responseError(responseError) {
                $rootScope.superLoader = false;
                if ((responseError.status === 500) && (responseError.data !== undefined)) {
                    if (_.isObject(responseError.data)) {
                        return $q.reject(responseError);
                    } else {
                        //check if responseError.data contains error regarding Auth-Key
                        let isError = responseError.data.indexOf("`value` required in setHeader");
                        let isAuthKeyError = responseError.data.indexOf("Auth-Key");
                        //if Auth-Key Error found, redirect to login
                        if (isAuthKeyError !== -1) {
                            toastr.error('Your Session has Expired, Please Login Again.');
                            return $timeout((() => window.location.assign('/login')), 2000);
                        }
                    }
                } else if (responseError.status === 401) {
                    if (_.isObject(responseError.data) && (responseError.data.code === "INVALID_AUTH_KEY")) {
                        toastr.error('Your Session has Expired, Please Login Again.');
                        return $timeout((() => window.location.assign('/login')), 2000);
                    } else {
                        return $q.reject(responseError);
                    }
                } else {
                    return $q.reject(responseError);
                }
            }
        })

]);

// toastr setting
giddh.webApp.config(function (toastrConfig) {
    angular.extend(toastrConfig, {
        maxOpened: 3,
        closeButton: true,
        preventDuplicates: false,
        preventOpenDuplicates: true,
        target: 'body'
    }
    );
});

giddh.webApp.directive('autoActive', [
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

giddh.webApp.controller('paymentCtrl', [
    '$scope', 'toastr', '$http', '$location', '$rootScope', '$filter', '$sce',
    function ($scope, toastr, $http, $location, $rootScope, $filter, $sce) {
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


giddh.webApp.controller('magicCtrl', [
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


giddh.webApp.controller('successCtrl', [
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

giddh.webApp.controller('verifyEmailCtrl', [
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

giddh.webApp.directive('numbersOnly', () =>
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

giddh.webApp.directive('numberSelect', () =>
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

//for project lib helps check out
//bootstrap related - http://angular-ui.github.io/bootstrap/#/tooltip
//LocalStorageModule - https://github.com/grevory/angular-local-storage
//perfect_scrollbar - https://github.com/noraesae/perfect-scrollbar
//toastr = https://github.com/Foxandxss/angular-toastr
//angular filter - https://github.com/a8m/angular-filter#filterby
//file upload - https://github.com/danialfarid/ng-file-upload

export const obj = window.giddh