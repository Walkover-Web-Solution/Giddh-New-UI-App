(function() {
  var router, settings;

  settings = require('../util/settings');

  router = settings.express.Router({
    mergeParams: true
  });

  router.post('/', function(req, res) {
    var abc, args, str;
    abc = req.params.companyUniqueName + '/invoices?from=' + req.query.from + '&to=' + req.query.to + '&count=' + req.query.count + '&page=' + req.query.page;
    str = settings.envUrl + 'company/' + abc;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'X-Forwarded-For': res.locales.remoteIp,
        'Content-Type': 'application/json'
      },
      data: req.body
    };
    return settings.client.post(str, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.post('/bulk-generate', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/invoices/bulk-generate?combined=' + req.query.combined;
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

  router.post('/ledgers', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/ledgers?from=' + req.query.from + '&to=' + req.query.to + '&count=' + req.query.count + '&page=' + req.query.page;
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

  router.get('/proforma/all', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/proforma/list?from=' + req.query.from + '&to=' + req.query.to + '&page=' + req.query.page + '&count=' + req.query.count;
    hUrl = "";
    if (req.body.fromDate === void 0 && req.body.toDate !== void 0) {
      hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/proforma/list?to=' + req.query.to + '&page=' + req.query.page + '&count=' + req.query.count;
    } else if (req.body.toDate === void 0 && req.body.fromDate !== void 0) {
      hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/proforma/list?from=' + req.query.from + '&page=' + req.query.page + '&count=' + req.query.count;
    } else if (req.body.toDate === void 0 && req.body.fromDate === void 0) {
      hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/proforma/list?page=' + req.query.page + '&count=' + req.query.count;
    } else {
      hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/proforma/list?from=' + req.query.from + '&to=' + req.query.to + '&page=' + req.query.page + '&count=' + req.query.count;
    }
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'X-Forwarded-For': res.locales.remoteIp,
        'Content-Type': 'application/json'
      }
    };
    return settings.client.get(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.post('/action', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/invoices/' + req.query.invoiceUniqueName + '/action';
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

  router.post('/proforma/all', function(req, res) {
    var args, hUrl;
    hUrl = "";
    if (req.body.fromDate === void 0 && req.body.toDate !== void 0) {
      hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/proforma/list?to=' + req.body.toDate + '&page=' + req.body.page + '&count=' + req.body.count;
    } else if (req.body.toDate === void 0 && req.body.fromDate !== void 0) {
      hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/proforma/list?from=' + req.body.fromDate + '&page=' + req.body.page + '&count=' + req.body.count;
    } else if (req.body.toDate === void 0 && req.body.fromDate === void 0) {
      hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/proforma/list?page=' + req.body.page + '&count=' + req.body.count;
    } else {
      hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/proforma/list?from=' + req.body.fromDate + '&to=' + req.body.toDate + '&page=' + req.body.page + '&count=' + req.body.count;
    }
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'X-Forwarded-For': res.locales.remoteIp,
        'Content-Type': 'application/json'
      },
      data: req.body
    };
    console.log(hUrl);
    return settings.client.post(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router["delete"]('/proforma/delete', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/proforma/' + req.query.proforma;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'X-Forwarded-For': res.locales.remoteIp,
        'Content-Type': 'application/json'
      }
    };
    return settings.client["delete"](hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.post('/proforma/updateBalanceStatus', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/proforma/' + req.body.proformaUniqueName + '/action';
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

  router.post('/proforma/link-account', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/proforma/' + req.body.proformaUniqueName + '/link-account';
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

  router.post('/proforma', function(req, res) {
    var args, hUrl;
    console.log(req.body);
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/proforma';
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

  router.put('/proforma/update', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/proforma/' + req.body.proforma;
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

  router.get('/proforma/templates', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/templates/all';
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'X-Forwarded-For': res.locales.remoteIp,
        'Content-Type': 'application/json'
      }
    };
    return settings.client.get(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.post('/proforma/get', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/proforma/' + req.body.proforma;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'X-Forwarded-For': res.locales.remoteIp,
        'Content-Type': 'application/json'
      }
    };
    return settings.client.get(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.post('/proforma/mail', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/proforma/mail';
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

  router.post('/proforma/download', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/proforma/download';
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

  router.put('/proforma/templates/default', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/templates/' + req.body.templateUniqueName + '/default';
    console.log(hUrl);
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

  module.exports = router;

}).call(this);
