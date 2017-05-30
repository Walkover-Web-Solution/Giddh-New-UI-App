(function() {
  var router, settings;

  settings = require('../util/settings');

  router = settings.express.Router({
    mergeParams: true
  });

  router.get('/', function(req, res) {
    var args, hUrl;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'X-Forwarded-For': res.locales.remoteIp
      },
      parameters: {
        to: req.query.toDate,
        from: req.query.fromDate,
        count: Number(req.query.count) || 0,
        page: Number(req.query.page) || 1
      }
    };
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/accounts/' + encodeURIComponent(req.params.accountUniqueName) + '/ledgers';
    return settings.client.get(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.get('/transactions', function(req, res) {
    var args, hUrl;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'X-Forwarded-For': res.locales.remoteIp
      },
      parameters: {
        to: req.query.toDate,
        from: req.query.fromDate,
        count: Number(req.query.count) || 0,
        page: Number(req.query.page) || 1,
        sort: req.query.sort,
        reversePage: req.query.reversePage
      }
    };
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/accounts/' + encodeURIComponent(req.params.accountUniqueName) + '/ledgers/transactions';
    return settings.client.get(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router["delete"]('/', function(req, res) {
    var authHead, hUrl;
    authHead = {
      headers: {
        'Auth-Key': req.session.authKey,
        'X-Forwarded-For': res.locales.remoteIp
      }
    };
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/accounts/' + req.params.accountUniqueName + '/ledgers';
    return settings.client["delete"](hUrl, authHead, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.get('/invoice-file', function(req, res) {
    var args, hUrl;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'X-Forwarded-For': res.locales.remoteIp
      },
      parameters: {
        to: req.query.toDate,
        from: req.query.fromDate
      }
    };
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/ledger/upload/' + req.query.fileName;
    return settings.client.get(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.get('/reconcile', function(req, res) {
    var authHead, hUrl;
    authHead = {
      headers: {
        'Auth-Key': req.session.authKey,
        'X-Forwarded-For': res.locales.remoteIp
      },
      parameters: {
        to: req.query.to,
        from: req.query.from,
        chequeNumber: req.query.chequeNumber || ''
      }
    };
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/accounts/' + req.params.accountUniqueName + '/ledgers/reconcile';
    return settings.client.get(hUrl, authHead, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.get('/:ledgerUniqueName', function(req, res) {
    var authHead, hUrl;
    authHead = {
      headers: {
        'Auth-Key': req.session.authKey,
        'X-Forwarded-For': res.locales.remoteIp
      }
    };
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/accounts/' + req.params.accountUniqueName + '/ledgers/' + req.params.ledgerUniqueName;
    return settings.client.get(hUrl, authHead, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.post('/', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/accounts/' + req.params.accountUniqueName + '/ledgers';
    req.body.uniqueName = settings.stringUtil.getRandomString(req.params.accountUniqueName, req.params.companyUniqueName);
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'X-Forwarded-For': res.locales.remoteIp,
        'Content-Type': 'application/json'
      },
      data: req.body
    };
    return settings.client.post(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.put('/:ledgerUniqueName', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/accounts/' + req.params.accountUniqueName + '/ledgers/' + req.params.ledgerUniqueName;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'X-Forwarded-For': res.locales.remoteIp,
        'Content-Type': 'application/json'
      },
      data: req.body
    };
    return settings.client.put(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router["delete"]('/:ledgerUniqueName', function(req, res) {
    var authHead, hUrl;
    authHead = {
      headers: {
        'Auth-Key': req.session.authKey,
        'X-Forwarded-For': res.locales.remoteIp
      }
    };
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/accounts/' + req.params.accountUniqueName + '/ledgers/' + req.params.ledgerUniqueName;
    return settings.client["delete"](hUrl, authHead, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.post('/paymentTransactions', function(req, res) {
    var authHead, hUrl;
    authHead = {
      headers: {
        'Auth-Key': req.session.authKey,
        'X-Forwarded-For': res.locales.remoteIp
      },
      data: req.body
    };
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/accounts/' + req.params.accountUniqueName + '/ledgers/paymentTransactions';
    return settings.client.post(hUrl, authHead, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  module.exports = router;

}).call(this);
