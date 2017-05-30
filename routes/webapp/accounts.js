(function() {
  var router, settings;

  settings = require('../util/settings');

  router = settings.express.Router({
    mergeParams: true
  });

  router.get('/', function(req, res) {
    var authHead, hUrl;
    console.log(encodeURIComponent('%'));
    authHead = {
      headers: {
        'Auth-Key': req.session.authKey,
        'X-Forwarded-For': res.locales.remoteIp
      }
    };
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/accounts';
    return settings.client.get(hUrl, authHead, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.get('/:accountUniqueName', function(req, res) {
    var authHead, hUrl;
    authHead = {
      headers: {
        'Auth-Key': req.session.authKey,
        'X-Forwarded-For': res.locales.remoteIp
      }
    };
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/accounts/' + encodeURIComponent(req.params.accountUniqueName);
    return settings.client.get(hUrl, authHead, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.put('/:accountUniqueName', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/accounts/' + encodeURIComponent(req.params.accountUniqueName);
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
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

  router.put('/:accountUniqueName/move', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/accounts/' + encodeURIComponent(req.params.accountUniqueName) + '/move';
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
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

  router.put('/:accountUniqueName/merge', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/accounts/' + encodeURIComponent(req.params.accountUniqueName) + '/merge';
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
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

  router.post('/:accountUniqueName/un-merge', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/accounts/' + encodeURIComponent(req.params.accountUniqueName) + '/un-merge';
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
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

  router.put('/:accountUniqueName/share', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/accounts/' + encodeURIComponent(req.params.accountUniqueName) + '/share';
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
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

  router["delete"]('/:accountUniqueName', function(req, res) {
    var authHead, hUrl;
    authHead = {
      headers: {
        'Auth-Key': req.session.authKey,
        'X-Forwarded-For': res.locales.remoteIp
      }
    };
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/accounts/' + encodeURIComponent(req.params.accountUniqueName);
    return settings.client["delete"](hUrl, authHead, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.get('/:accountUniqueName/shared-with', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/accounts/' + encodeURIComponent(req.params.accountUniqueName) + '/shared-with';
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      }
    };
    return settings.client.get(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.put('/:accountUniqueName/unshare', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/accounts/' + encodeURIComponent(req.params.accountUniqueName) + '/unshare';
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
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

  router.put('/:accountUniqueName/eledgers/map/:transactionId', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/accounts/' + req.params.accountUniqueName + '/eledgers/' + req.params.transactionId;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
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

  router.get('/:accountUniqueName/export-ledger', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/accounts/' + encodeURIComponent(req.params.accountUniqueName) + '/v2/export-ledger';
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      },
      parameters: {
        to: req.query.toDate,
        from: req.query.fromDate,
        format: req.query.ltype
      }
    };
    return settings.client.get(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.get('/:accountUniqueName/xls-imports', function(req, res) {
    var args, hUrl;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'X-Forwarded-For': res.locales.remoteIp
      }
    };
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/accounts/' + encodeURIComponent(req.params.accountUniqueName) + '/xls-imports';
    return settings.client.get(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.get('/:accountUniqueName/eledgers', function(req, res) {
    var authHead, hUrl;
    authHead = {
      headers: {
        'Auth-Key': req.session.authKey,
        'X-Forwarded-For': res.locales.remoteIp
      }
    };
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/accounts/' + encodeURIComponent(req.params.accountUniqueName) + '/eledgers';
    return settings.client.get(hUrl, authHead, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router["delete"]('/:accountUniqueName/eledgers/:transactionId', function(req, res) {
    var authHead, hUrl;
    authHead = {
      headers: {
        'Auth-Key': req.session.authKey,
        'X-Forwarded-For': res.locales.remoteIp
      }
    };
    hUrl = settings.envUrl + 'eledgers/' + req.params.transactionId;
    return settings.client["delete"](hUrl, authHead, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.post('/:accountUniqueName/mail-ledger', function(req, res) {
    var args, hUrl;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      },
      parameters: {
        to: req.query.toDate,
        from: req.query.fromDate,
        format: req.query.format
      },
      data: req.body
    };
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/accounts/' + encodeURIComponent(req.params.accountUniqueName) + '/mail-ledger';
    return settings.client.post(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.get('/:accountUniqueName/invoices', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/accounts/' + encodeURIComponent(req.params.accountUniqueName) + '/invoices';
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      },
      parameters: {
        to: req.query.toDate,
        from: req.query.fromDate
      }
    };
    return settings.client.get(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.post('/:accountUniqueName/invoices/preview', function(req, res) {
    var args, hUrl;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      },
      data: req.body
    };
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/accounts/' + encodeURIComponent(req.params.accountUniqueName) + '/invoices/preview';
    return settings.client.post(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.post('/:accountUniqueName/invoices/generate', function(req, res) {
    var args, hUrl;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      },
      data: req.body
    };
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/accounts/' + encodeURIComponent(req.params.accountUniqueName) + '/invoices/generate';
    return settings.client.post(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.post('/:accountUniqueName/invoices/download', function(req, res) {
    var args, hUrl;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      },
      data: req.body
    };
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/accounts/' + encodeURIComponent(req.params.accountUniqueName) + '/invoices/download';
    return settings.client.post(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.get('/:accountUniqueName/invoices/:invoiceUniqueID/preview', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/accounts/' + encodeURIComponent(req.params.accountUniqueName) + '/invoices/' + req.params.invoiceUniqueID + '/preview';
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      }
    };
    return settings.client.get(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.post('/:accountUniqueName/invoices/mail', function(req, res) {
    var args, hUrl;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      },
      data: req.body
    };
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/accounts/' + encodeURIComponent(req.params.accountUniqueName) + '/invoices/mail';
    return settings.client.post(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.post('/:accountUniqueName/magic-link', function(req, res) {
    var args, hUrl;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'X-Forwarded-For': res.locales.remoteIp
      },
      parameters: {
        to: req.query.to,
        from: req.query.from
      }
    };
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/accounts/' + encodeURIComponent(req.params.accountUniqueName) + '/magic-link';
    return settings.client.post(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.get('/:accountUniqueName/tax-hierarchy', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/accounts/' + encodeURIComponent(req.params.accountUniqueName) + '/tax-hierarchy';
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      }
    };
    return settings.client.get(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  module.exports = router;

}).call(this);
