// website urls

export const webUrl = {
    Inventory: {
        get: '/company/:companyUniqueName/stock-group/groups-with-stocks-flatten',
        getHeirarchy: '/company/:companyUniqueName/stock-group/groups-with-stocks-hierarchy-min',
        addGroup: '/company/:companyUniqueName/stock-group',
        updateGroup: '/company/:companyUniqueName/stock-group/:stockGroupUniqueName',
        getStockGroups: '/company/:companyUniqueName/stock-group/:stockGroupUniqueName/stocks',
        createStock: '/company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock',
        deleteStock: '/company/:companyUniqueName/stock-group/delete-stock',
        updateStockItem: '/company/:companyUniqueName/stock-group/update-stock-item',
        getAllStocks: '/company/:companyUniqueName/stock-group/stocks',
        getStockDetail: '/company/:companyUniqueName/stock-group/:stockGroupUniqueName',
        getStockType: '/company/:companyUniqueName/stock-group/unit-types',
        createStockUnit: '/company/:companyUniqueName/stock-group/unit-types',
        updateStockUnit: '/company/:companyUniqueName/stock-group/unit-types',
        deleteStockUnit: '/company/:companyUniqueName/stock-group/unit-types',
        getFilteredStockGroups: '/company/:companyUniqueName/stock-group/hierarchical-stock-groups',
        getStockItemDetails: '/company/:companyUniqueName/stock-group/get-stock-detail',
        getStockReport: '/company/:companyUniqueName/stock-group/get-stock-report',
        deleteStockGrp: '/company/:companyUniqueName/stock-group/delete-stockgrp'
    },
    Invoice: {
        getAll: '/company/:companyUniqueName/invoices?from=:date1&to=:date2',
        getAllLedgers: '/company/:companyUniqueName/invoices/ledgers?from=:date1&to=:date2',
        generateBulkInvoice: '/company/:companyUniqueName/invoices/bulk-generate?combined=:combined',
        actionOnInvoice: '/company/:companyUniqueName/invoices/action',
        getAllProforma: '/company/:companyUniqueName/invoices/proforma/all?from=:date1&to=:date2&count=:count&page=:page',
        getAllProformaByFilter: '/company/:companyUniqueName/invoices/proforma/all',
        deleteProforma: '/company/:companyUniqueName/invoices/proforma/delete',
        updateBalanceStatus: '/company/:companyUniqueName/invoices/proforma/updateBalanceStatus',
        linkProformaAccount: '/company/:companyUniqueName/invoices/proforma/link-account',
        getTemplates: '/company/:companyUniqueName/invoices/proforma/templates',
        createProforma: '/company/:companyUniqueName/invoices/proforma',
        updateProforma: '/company/:companyUniqueName/invoices/proforma/update',
        getProforma: '/company/:companyUniqueName/invoices/proforma/get',
        sendMail: '/company/:companyUniqueName/invoices/proforma/mail',
        downloadProforma: '/company/:companyUniqueName/invoices/proforma/download',
        setDefaultProformaTemplate: '/company/:companyUniqueName/invoices/proforma/templates/default'
    },
    Ledger: {
        get: '/company/:companyUniqueName/accounts/:accountsUniqueName/ledgers',
        create: '/company/:companyUniqueName/accounts/:accountsUniqueName/ledgers/',
        update: '/company/:companyUniqueName/accounts/:accountsUniqueName/ledgers/:entryUniqueName',
        getEntry: '/company/:companyUniqueName/accounts/:accountsUniqueName/ledgers/:entryUniqueName',
        delete: '/company/:companyUniqueName/accounts/:accountsUniqueName/ledgers/:entryUniqueName',
        getEntrySettings: '/company/:companyUniqueName/entry-settings',
        updateEntrySettings: '/company/:companyUniqueName/update-entry-settings',
        getInvoiceFile: '/company/:companyUniqueName/accounts/:accountsUniqueName/ledgers/invoice-file',
        getReconcileEntries: '/company/:companyUniqueName/accounts/:accountsUniqueName/ledgers/reconcile',
        getAllTransactions: '/company/:companyUniqueName/accounts/:accountsUniqueName/ledgers/transactions'
    },
    otherLedger: {
        getTransactions: '/company/:companyUniqueName/accounts/:accountsUniqueName/eledgers',
        getFreshTransactions: '/company/:companyUniqueName/accounts/:accountsUniqueName/eledgers?refresh=true',
        trashTransaction: '/company/:companyUniqueName/accounts/:accountsUniqueName/eledgers/:transactionId',
        mapEntry: '/company/:companyUniqueName/accounts/:accountsUniqueName/eledgers/map/:transactionId'
    },
    Company: {
        getCompanyList: '/company/all',
        deleteCompany: '/company/:uniqueName',
        updateCompany: '/company/:uniqueName',
        shareCompany: '/company/:uniqueName/share',
        getSharedList: '/company/:uniqueName/shared-with',
        getCmpRolesList: '/company/:uniqueName/shareable-roles',
        unSharedUser: '/company/:uniqueName/unshare',
        getUploadListDetails: '/company/:uniqueName/imports',
        getProfitLoss: '/company/:uniqueName/profit-loss',
        switchUser: '/company/:uniqueName/switchUser',
        getCompTrans: '/company/:uniqueName/transactions?page=:page',
        updtCompSubs: '/company/:uniqueName/subscription-update',
        payBillViaWallet: '/company/:uniqueName/pay-via-wallet',
        retryXmlUpload: '/company/:uniqueName/retry',
        getInvTemplates: '/company/:uniqueName/templates',
        setDefltInvTemplt: '/company/:uniqueName/templates/:tempUname',
        updtInvTempData: '/company/:uniqueName/templates',
        delInv: '/company/:uniqueName/invoices/:invoiceUniqueID',
        getTax: '/company/:uniqueName/tax',
        addTax: '/company/:uniqueName/tax',
        deleteTax: '/company/:uniqueName/tax/:taxUniqueName',
        editTax: '/company/:uniqueName/tax/:taxUniqueName/:updateEntries',
        saveSmsKey: '/company/:companyUniqueName/sms-key',
        saveEmailKey: '/company/:companyUniqueName/email-key',
        getSmsKey: '/company/:companyUniqueName/sms-key',
        getEmailKey: '/company/:companyUniqueName/email-key',
        sendEmail: '/company/:companyUniqueName/accounts/bulk-email?from=:from&to=:to',
        sendSms: '/company/:companyUniqueName/accounts/bulk-sms?from=:from&to=:to',
        getFY: '/company/:companyUniqueName/financial-year',
        updateFY: '/company/:companyUniqueName/financial-year',
        switchFY: '/company/:companyUniqueName/active-financial-year',
        lockFY: '/company/:companyUniqueName/financial-year-lock',
        unlockFY: '/company/:companyUniqueName/financial-year-unlock',
        addFY: '/company/:companyUniqueName/financial-year',
        getMagicLink: '/company/:companyUniqueName/accounts/:accountUniqueName/magic-link?from=:from&to=:to',
        assignTax: '/company/:companyUniqueName/tax/assign',
        saveInvoiceSetting: '/company/:companyUniqueName/invoice-setting',
        getCroppedAcnt: '/company/:companyUniqueName/cropped-flatten-account',
        postCroppedAcnt: '/company/:companyUniqueName/cropped-flatten-account',
        getAllSettings: '/company/:companyUniqueName/settings',
        updateAllSettings: '/company/:companyUniqueName/settings',
        createWebhook: '/company/:companyUniqueName/settings/webhooks',
        deleteWebhook: '/company/:companyUniqueName/settings/webhooks/:webhookUniqueName',
        getRazorPayDetail: '/company/:companyUniqueName/razorpay',
        addRazorPayDetail: '/company/:companyUniqueName/razorpay',
        updateRazorPayDetail: '/company/:companyUniqueName/razorpay',
        deleteRazorPayDetail: '/company/:companyUniqueName/razorpay'
    },
    Group: {
       getAllWithAccounts: '/company/:companyUniqueName/groups/with-accounts',
       getAllInDetail: '/company/:companyUniqueName/groups/detailed-groups',
       getAllWithAccountsInDetail: '/company/:companyUniqueName/groups/detailed-groups-with-accounts',
       getFlattenGrpWithAcc: '/company/:companyUniqueName/groups/flatten-groups-accounts?q=:q&page=:page&count=:count&showEmptyGroups=:showEmptyGroups',
       getFlatAccList: '/company/:companyUniqueName/groups/flatten-accounts',
       postFlatAccList: '/company/:companyUniqueName/groups/flatten-accounts',
       update: '/company/:companyUniqueName/groups/:groupUniqueName',
       delete: '/company/:companyUniqueName/groups/:groupUniqueName',
       get: '/company/:companyUniqueName/groups/:groupUniqueName',
       move: '/company/:companyUniqueName/groups/:groupUniqueName/move',
       share: '/company/:companyUniqueName/groups/:groupUniqueName/share',
       unshare: '/company/:companyUniqueName/groups/:groupUniqueName/unshare',
       sharedWith: '/company/:companyUniqueName/groups/:groupUniqueName/shared-with',
       getUserList: '/company/:companyUniqueName/users',
       getClosingBal: '/company/:companyUniqueName/groups/:groupUniqueName/closing-balance?fromDate=:date1&toDate=:date2&refresh=:refresh',
       deleteLogs: '/company/:companyUniqueName/logs/:beforeDate',
       getSubgroups: '/company/:companyUniqueName/groups/:groupUniqueName/subgroups-with-accounts',
       getMultipleSubGroups: '/company/:companyUniqueName/subgroups-with-accounts',
       getTaxHierarchy: '/company/:companyUniqueName/groups/:groupUniqueName/tax-hierarchy'
    },
    recEntry: {
        create : '/company/:companyUniqueName/recurring-entry',
        get: '/company/:companyUniqueName/recurring-entry',
        getDuration: '/company/:companyUniqueName/recurring-entry/duration-type',
        update: '/company/:companyUniqueName/recurring-entry/update',
        delete: '/company/:companyUniqueName/recurring-entry/delete'
    },
    Report: {
        historicData: '/company/:companyUniqueName/history?fromDate=:date1&toDate=:date2&interval=:interval',
        newHistoricData: '/company/:companyUniqueName/group-history?fromDate=:date1&toDate=:date2&interval=:interval&refresh=:refresh',
        plHistoricData: '/company/:companyUniqueName/profit-loss-history?fromDate=:date1&toDate=:date2&interval=:interval',
        profitLossData: '/company/:companyUniqueName/profit-loss?fromDate=:date1&toDate=:date2&interval=:interval',
        nwHistoricData: '/company/:companyUniqueName/networth-history?fromDate=:date1&toDate=:date2&interval=:interval',
        networthData: '/company/:companyUniqueName/networth?fromDate=:date1&toDate=:date2&interval=:interval',
        combinedData: '/company/:companyUniqueName/dashboard?fromDate=:date1&toDate=:date2&interval=:interval'
    },
    Account: {
        update: '/company/:companyUniqueName/accounts/:accountsUniqueName',
        share: '/company/:companyUniqueName/accounts/:accountsUniqueName/share',
        unshare: '/company/:companyUniqueName/accounts/:accountsUniqueName/unshare',
        merge: '/company/:companyUniqueName/accounts/:accountsUniqueName/merge',
        unMergeDelete: '/company/:companyUniqueName/accounts/:accountsUniqueName/un-merge',
        sharedWith: '/company/:companyUniqueName/accounts/:accountsUniqueName/shared-with',
        delete: '/company/:companyUniqueName/accounts/:accountsUniqueName',
        get: '/company/:companyUniqueName/accounts/:accountsUniqueName',
        move: '/company/:companyUniqueName/accounts/:accountsUniqueName/move',
        export: '/company/:companyUniqueName/accounts/:accountsUniqueName/export-ledger',
        getlist: '/company/:companyUniqueName/accounts/:accountsUniqueName/xls-imports',
        emailLedger: '/company/:companyUniqueName/accounts/:accountsUniqueName/mail-ledger',
        getInvList: '/company/:companyUniqueName/accounts/:accountsUniqueName/invoices?fromDate=:fromDate&toDate=:toDate',
        prevInvoice: '/company/:companyUniqueName/accounts/:accountsUniqueName/invoices/preview',
        genInvoice: '/company/:companyUniqueName/accounts/:accountsUniqueName/invoices/generate',
        downloadInvoice: '/company/:companyUniqueName/accounts/:accountsUniqueName/invoices/download',
        prevOfGenInvoice: '/company/:companyUniqueName/accounts/:accountsUniqueName/invoices/:invoiceUniqueID/preview',
        mailInvoice: '/company/:companyUniqueName/accounts/:accountsUniqueName/invoices/mail',
        updateInvoice: '/company/:companyUniqueName/invoices',
        generateMagicLink: '/company/:companyUniqueName/accounts/:accountsUniqueName/magic-link?fromDate=:fromDate&toDate=:toDate',
        getTaxHierarchy: '/company/:companyUniqueName/accounts/:accountUniqueName/tax-hierarchy'
    },
    Coupon: {
        Detail: '/coupon/get-coupon'
    },
    setService: {
        save: '/company/:companyUniqueName/templates',
        update: '/company/:companyUniqueName/templates/update/:templateUniqueName',
        getAllTemplates: '/company/:companyUniqueName/templates/all',
        getTemplate: '/company/:companyUniqueName/templates/:templateUniqueName?operation=:operation',
        deleteTemplate: '/company/:companyUniqueName/templates/:templateUniqueName'
    },
    trialBal: {
        getAll: '/company/:companyUniqueName/trial-balance',
        getBalSheet: '/company/:companyUniqueName/trial-balance/balance-sheet',
        getPL: '/company/:companyUniqueName/trial-balance/profit-loss',
        downloadTBExcel: '/company/:companyUniqueName/trial-balance/excel-export'
    },
    balanceSheet: {
        downloadBSExcel: '/company/:companyUniqueName/balance-sheet/balance-sheet-collapsed-download'
    },
    profitLoss: {
        downloadPLExcel: '/company/:companyUniqueName/profit-loss/profit-loss-collapsed-download'
    },
    UserSET: {
        getUserDetails: '/users/:uniqueName',
        getSetAuthKey: '/users/auth-key/:uniqueName',
        generateAuthKey: '/users/:uniqueName/generate-auth-key',
        getSubList: '/users/:uniqueName/subscribed-companies',
        getUserSubList: '/users/:uniqueName/transactions?page=:page',
        getWltBal: '/users/:uniqueName/available-credit',
        cancelAutoPay: '/users/:uniqueName/delete-payee',
        addBalInWallet: '/users/:uniqueName/balance',
        searchSite: '/ebanks',
        addSiteAccount: '/company/:companyUniqueName/ebanks',
        getAccounts: '/company/:companyUniqueName/ebanks',
        addGiddhAccount: '/company/:companyUniqueName/ebanks/:itemAccountId',
        setTransactionDate: '/company/:companyUniqueName/ebanks/:itemAccountId/eledgers/:date',
        verifyMfa: '/company/:companyUniqueName/ebanks/:itemAccountId/verify-mfa',
        refreshAll: '/company/:companyUniqueName/ebanks/refresh',
        deleteBAccount: '/company/:companyUniqueName/login/:loginId',
        removeGiddhAccount: '/company/:companyUniqueName/ebanks/:ItemAccountId/unlink',
        createSubUser: '/users/:uniqueName/sub-user',
        deleteSubUser: '/users/:uniqueName',
        getSubUserAuthKey: '/users/:uniqueName/auth-key/sub-user?uniqueName=:uniqueName',
        addMobileNumber: '/users/system_admin/verify-number',
        verifyNumber: '/users/system_admin/verify-number',
        connectBankAc: '/company/:companyUniqueName/ebanks/token',
        refreshAccount: '/company/:companyUniqueName/login/:loginId/token/refresh',
        reconnectAccount: '/company/:companyUniqueName/login/:loginId/token/reconnect',
        changeTwoWayAuth: '/users/:uniqueName/settings'

    },
    AuditLogsHttpService: {
        getLogs: 'company/:companyUniqueName/logs/:page'
    }
};

// electron urls
export const electronUrl = {
    Inventory: {
        get: '/company/:companyUniqueName/flatten-stock-groups-with-stocks',
        getHeirarchy: '/company/:companyUniqueName/hierarchical-stock-groups',
        addGroup: '/company/:companyUniqueName/stock-group',
        updateGroup: '/company/:companyUniqueName/stock-group/:stockGroupUniqueName',
        getStockGroups: '/company/:companyUniqueName/stock-group/:stockGroupUniqueName/stocks',
        createStock: '/company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock',
        deleteStock: '/company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock/:stockUniqueName',
        updateStockItem: '/company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock/:stockUniqueName',
        getAllStocks: '/company/:companyUniqueName/stocks',
        getStockDetail: '/company/:companyUniqueName/stock-group/:stockGroupUniqueName',
        getStockType: '/company/:companyUniqueName/stock-unit',
        createStockUnit: '/company/:companyUniqueName/stock-unit',
        updateStockUnit: '/company/:companyUniqueName/stock-unit/:uName',
        deleteStockUnit: '/company/:companyUniqueName/stock-unit/:uName',
        getFilteredStockGroups: '/company/:companyUniqueName/hierarchical-stock-groups',
        getStockItemDetails: '/company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock/:stockUniqueName',
        getStockReport: '/company/:companyUniqueName/stock-group/:stockGroupUniqueName/stock/:stockUniqueName/report-v2',
        deleteStockGrp: '/company/:companyUniqueName/stock-group/:stockGroupUniqueName'
    },
    Invoice: {
        getAll: '/company/:companyUniqueName/invoices',
        getAllLedgers: '/company/:companyUniqueName/ledgers',
        generateBulkInvoice: '/company/:companyUniqueName/invoices/bulk-generate',
        actionOnInvoice: '/company/:companyUniqueName/invoices/:invoiceUniqueName/action',
        getAllProforma: '/company/:companyUniqueName/proforma/list',
        getAllProformaByFilter: '/company/:companyUniqueName/proforma/list',
        deleteProforma: '/company/:companyUniqueName/proforma/proforma',
        updateBalanceStatus: '/company/:companyUniqueName/proforma/:proformaUniqueName/action',
        linkProformaAccount: '/company/:companyUniqueName/proforma/:proformaUniqueName/link-account',
        getTemplates: '/company/:companyUniqueName/templates/all',
        createProforma: '/company/:companyUniqueName/proforma',
        updateProforma: '/company/:companyUniqueName/proforma/:proforma',
        getProforma: '/company/:companyUniqueName/proforma/:proforma',
        sendMail: '/company/:companyUniqueName/proforma/mail',
        downloadProforma: '/company/:companyUniqueName/proforma/download',
        setDefaultProformaTemplate: '/company/:companyUniqueName/templates/:templateUniqueName/default'
    },
    Ledger: {
        get: '/company/:companyUniqueName/accounts/:accountsUniqueName/ledgers',
        create: '/company/:companyUniqueName/accounts/:accountsUniqueName/ledgers/',
        update: '/company/:companyUniqueName/accounts/:accountsUniqueName/ledgers/:entryUniqueName',
        getEntry: '/company/:companyUniqueName/accounts/:accountsUniqueName/ledgers/:entryUniqueName',
        delete: '/company/:companyUniqueName/accounts/:accountsUniqueName/ledgers/:entryUniqueName',
        getEntrySettings: '/company/:companyUniqueName/entry-settings',
        updateEntrySettings: '/company/:companyUniqueName/entry-settings',
        getInvoiceFile: '/company/:companyUniqueName/ledgers/upload/:fileName',
        getReconcileEntries: '/company/:companyUniqueName/accounts/:accountsUniqueName/ledgers/reconcile',
        getAllTransactions: '/company/:companyUniqueName/accounts/:accountsUniqueName/ledgers/transactions'
    },
    otherLedger: {
        getTransactions: '/company/:companyUniqueName/accounts/:accountsUniqueName/eledgers',
        getFreshTransactions: '/company/:companyUniqueName/accounts/:accountsUniqueName/eledgers',
        trashTransaction: '/eledgers/:transactionId',
        mapEntry: '/company/:companyUniqueName/accounts/:accountsUniqueName/eledgers/:transactionId'
    },
    Company: {
        getCompanyList: '/users/:uniqueName/companies',
        deleteCompany: '/company/:uniqueName',
        updateCompany: '/company/:uniqueName',
        shareCompany: '/company/:uniqueName/share',
        getSharedList: '/company/:uniqueName/shared-with',
        getCmpRolesList: '/company/:uniqueName/shareable-roles',
        unSharedUser: '/company/:uniqueName/unshare',
        getUploadListDetails: '/company/:uniqueName/imports',
        getProfitLoss: '/company/:uniqueName/profit-loss',
        switchUser: '/company/:uniqueName',
        getCompTrans: '/company/:uniqueName/transactions',
        updtCompSubs: '/company/:uniqueName/subscription-update',
        payBillViaWallet: '/company/:uniqueName/pay-via-wallet',
        retryXmlUpload: '/company/:uniqueName/imports/:requestId/retry',
        getInvTemplates: '/company/:uniqueName/templates',
        setDefltInvTemplt: '/company/:uniqueName/invoices/templates/:tempUname',
        updtInvTempData: '/company/:uniqueName/templates',
        delInv: '/company/:uniqueName/invoices/:invoiceUniqueID',
        getTax: '/company/:uniqueName/tax',
        addTax: '/company/:uniqueName/tax',
        deleteTax: '/company/:uniqueName/tax/:taxUniqueName',
        editTax: '/company/:uniqueName/tax/:taxUniqueName',
        saveSmsKey: '/company/:companyUniqueName/sms-key',
        saveEmailKey: '/company/:companyUniqueName/email-key',
        getSmsKey: '/company/:companyUniqueName/sms-key',
        getEmailKey: '/company/:companyUniqueName/email-key',
        sendEmail: '/company/:companyUniqueName/accounts/bulk-email',
        sendSms: '/company/:companyUniqueName/accounts/bulk-sms',
        getFY: '/company/:companyUniqueName/financial-year',
        updateFY: '/company/:companyUniqueName/financial-year',
        switchFY: '/company/:companyUniqueName/active-financial-year',
        lockFY: '/company/:companyUniqueName/financial-year-lock',
        unlockFY: '/company/:companyUniqueName/financial-year-unlock',
        addFY: '/company/:companyUniqueName/financial-year',
        getMagicLink: '/company/:companyUniqueName/accounts/:accountUniqueName/magic-link',
        assignTax: '/company/:companyUniqueName/tax/assign',
        saveInvoiceSetting: '/company/:companyUniqueName/invoice-setting',
        getCroppedAcnt: '/company/:companyUniqueName/cropped-flatten-accounts',
        postCroppedAcnt: '/company/:companyUniqueName/cropped-flatten-accounts',
        getAllSettings: '/company/:companyUniqueName/settings',
        updateAllSettings: '/company/:companyUniqueName/settings',
        createWebhook: '/company/:companyUniqueName/settings/webhooks',
        deleteWebhook: '/company/:companyUniqueName/settings/webhooks/:webhookUniqueName',
        getRazorPayDetail: '/company/:companyUniqueName/razorpay',
        addRazorPayDetail: '/company/:companyUniqueName/razorpay',
        updateRazorPayDetail: '/company/:companyUniqueName/razorpay',
        deleteRazorPayDetail: '/company/:companyUniqueName/razorpay'
    },
    Group: {
       getAllWithAccounts: '/company/:companyUniqueName/groups-with-accounts',
       getAllInDetail: '/company/:companyUniqueName/detailed-groups',
       getAllWithAccountsInDetail: '/company/:companyUniqueName/groups-with-accounts',
       getFlattenGrpWithAcc: '/company/:companyUniqueName/flatten-groups-with-accounts',
       getFlatAccList: '/company/:companyUniqueName/flatten-accounts',
       postFlatAccList: '/company/:companyUniqueName/flatten-accounts',
       update: '/company/:companyUniqueName/groups/:groupUniqueName',
       delete: '/company/:companyUniqueName/groups/:groupUniqueName',
       get: '/company/:companyUniqueName/groups/:groupUniqueName',
       move: '/company/:companyUniqueName/groups/:groupUniqueName/move',
       share: '/company/:companyUniqueName/groups/:groupUniqueName/share',
       unshare: '/company/:companyUniqueName/groups/:groupUniqueName/unshare',
       sharedWith: '/company/:companyUniqueName/groups/:groupUniqueName/shared-with',
       getUserList: '/company/:companyUniqueName/users',
       getClosingBal: '/company/:companyUniqueName/groups/:groupUniqueName/closing-balance',
       deleteLogs: '/company/:companyUniqueName/logs/:beforeDate',
       getSubgroups: '/company/:companyUniqueName/groups/:groupUniqueName/subgroups-with-accounts',
       getMultipleSubGroups: '/company/:companyUniqueName/groups-with-accounts',
       getTaxHierarchy: '/company/:companyUniqueName/groups/:groupUniqueName/tax-hierarchy'
    },
    recEntry: {
        create: '/company/:companyUniqueName/accounts/:accountUniqueName/recurring-entry',
        get: '/company/:companyUniqueName/recurring-entry/ledgers',
        getDuration: '/company/:companyUniqueName/recurring-entry/duration-type',
        update: '/company/:companyUniqueName/accounts/:accountUniqueName/recurring-entry/:recurringentryUniqueName',
        delete: '/company/:companyUniqueName/recurring-entry/:recurringentryUniqueName'
    },
    Report: {
        historicData: '/company/:companyUniqueName/history',
        newHistoricData: '/company/:companyUniqueName/group-history',
        plHistoricData: '/company/:companyUniqueName/profit-loss-history',
        profitLossData: '/company/:companyUniqueName/profit-loss',
        nwHistoricData: '/company/:companyUniqueName/networth-history',
        networthData: '/company/:companyUniqueName/networth',
        combinedData: '/company/:companyUniqueName/dashboard'
    },
    Account: {
        update: '/company/:companyUniqueName/accounts/:accountsUniqueName',
        share: '/company/:companyUniqueName/accounts/:accountsUniqueName/share',
        unshare: '/company/:companyUniqueName/accounts/:accountsUniqueName/unshare',
        merge: '/company/:companyUniqueName/accounts/:accountsUniqueName/merge',
        unMergeDelete: '/company/:companyUniqueName/accounts/:accountsUniqueName/un-merge',
        sharedWith: '/company/:companyUniqueName/accounts/:accountsUniqueName/shared-with',
        delete: '/company/:companyUniqueName/accounts/:accountsUniqueName',
        get: '/company/:companyUniqueName/accounts/:accountsUniqueName',
        move: '/company/:companyUniqueName/accounts/:accountsUniqueName/move',
        export: '/company/:companyUniqueName/accounts/:accountsUniqueName/v2/export-ledger',
        getlist: '/company/:companyUniqueName/accounts/:accountsUniqueName/xls-imports',
        emailLedger: '/company/:companyUniqueName/accounts/:accountsUniqueName/mail-ledger',
        getInvList: '/company/:companyUniqueName/accounts/:accountsUniqueName/invoices',
        prevInvoice: '/company/:companyUniqueName/accounts/:accountsUniqueName/invoices/preview',
        genInvoice: '/company/:companyUniqueName/accounts/:accountsUniqueName/invoices/generate',
        downloadInvoice: '/company/:companyUniqueName/accounts/:accountsUniqueName/invoices/download',
        prevOfGenInvoice: '/company/:companyUniqueName/accounts/:accountsUniqueName/invoices/:invoiceUniqueID/preview',
        mailInvoice: '/company/:companyUniqueName/accounts/:accountsUniqueName/invoices/mail',
        updateInvoice: '/company/:companyUniqueName/invoices',
        generateMagicLink: '/company/:companyUniqueName/accounts/:accountsUniqueName/magic-link',
        getTaxHierarchy: '/company/:companyUniqueName/accounts/:accountUniqueName/tax-hierarchy'
    },
    Coupon: {
        Detail: '/coupon/get-coupon'
    },
    setService: {
        save: '/company/:companyUniqueName/templates',
        update: '/company/:companyUniqueName/templates/:templateUniqueName',
        getAllTemplates: '/company/:companyUniqueName/templates/all',
        getTemplate: '/company/:companyUniqueName/templates/:templateUniqueName',
        deleteTemplate: '/company/:companyUniqueName/templates/:templateUniqueName'
    },
    trialBal: {
        getAll: '/company/:companyUniqueName/trial-balance',
        getBalSheet: '/company/:companyUniqueName/balance-sheet',
        getPL: '/company/:companyUniqueName/profit-loss',
        downloadTBExcel: '/company/:companyUniqueName/trial-balance-export'

    },
    balanceSheet: {
        downloadBSExcel: '/company/:companyUniqueName/balance-sheet-collapsed-download'
    },
    profitLoss: {
        downloadPLExcel: '/company/:companyUniqueName/profit-loss-collapsed-download'
    },
    UserSET: {
        getUserDetails: '/users/:uniqueName',
        getSetAuthKey: '/users/auth-key/:uniqueName',
        generateAuthKey: '/users/:uniqueName/generate-auth-key',
        getSubList: '/users/:uniqueName/subscribed-companies',
        getUserSubList: '/users/:uniqueName/transactions',
        getWltBal: '/users/:uniqueName/available-credit',
        cancelAutoPay: '/users/:uniqueName/delete-payee',
        addBalInWallet: '/users/:uniqueName/balance',
        searchSite: '/ebanks',
        addSiteAccount: '/company/:companyUniqueName/ebanks',
        getAccounts: '/company/:companyUniqueName/ebanks',
        addGiddhAccount: '/company/:companyUniqueName/ebanks/:itemAccountId',
        setTransactionDate: '/company/:companyUniqueName/ebanks/:itemAccountId/eledgers/:date',
        verifyMfa: '/company/:companyUniqueName/ebanks/:itemAccountId/verify-mfa',
        refreshAll: '/company/:companyUniqueName/ebanks/refresh',
        deleteBAccount: '/company/:companyUniqueName/login/:loginId',
        removeGiddhAccount: '/company/:companyUniqueName/ebanks/:ItemAccountId/unlink',
        createSubUser: '/users/:uniqueName/sub-user',
        deleteSubUser: '/users/:uniqueName',
        getSubUserAuthKey: '/users/:uniqueName/auth-key/sub-user',
        addMobileNumber: '/users/system_admin/verify-number',
        verifyNumber: '/users/system_admin/verify-number',
        connectBankAc: '/company/:companyUniqueName/ebanks/token',
        refreshAccount: '/company/:companyUniqueName/login/:loginId/token/refresh',
        reconnectAccount: '/company/:companyUniqueName/login/:loginId/token/reconnect',
        changeTwoWayAuth: '/users/:uniqueName/settings'

    },
    AuditLogsHttpService: {
        getLogs: 'company/:companyUniqueName/logs?page=:page'
    }
};
