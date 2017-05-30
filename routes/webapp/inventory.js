(function() {
  var router, settings;

  settings = require('../util/settings');

  router = settings.express.Router({
    mergeParams: true
  });

  router.get('/unit-types', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/stock-unit';
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
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

  router.post('/unit-types', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/stock-unit';
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

  router.put('/unit-types', function(req, res) {
    var args, hUrl;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      },
      data: req.body
    };
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/stock-unit/' + req.body.uName;
    return settings.client.put(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router["delete"]('/unit-types', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/stock-unit/' + req.query.uName;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      }
    };
    return settings.client["delete"](hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.post('/', function(req, res) {
    var args, hUrl;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      },
      data: req.body
    };
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/stock-group';
    return settings.client.post(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.get('/get-stock-report', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/stock-group/' + req.query.stockGroupUniqueName + '/stock/' + req.query.stockUniqueName + '/report?from=' + req.query.from + '&to=' + req.query.to;
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

  router.get('/groups-with-stocks-flatten', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/flatten-stock-groups-with-stocks?page=' + req.query.page + '&count=' + req.query.count + '&q=' + req.query.q;
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

  router.get('/groups-with-stocks-hierarchy-min', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/hierarchical-stock-groups';
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

  router.put('/update-stock-item', function(req, res) {
    var args, hUrl;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      },
      data: req.body
    };
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/stock-group/' + req.query.stockGroupUniqueName + '/stock/' + req.query.stockUniqueName;
    return settings.client.put(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.put('/:stockGroupUniqueName', function(req, res) {
    var args, hUrl;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      },
      data: req.body
    };
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/stock-group/' + req.params.stockGroupUniqueName;
    return settings.client.put(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.get('/:stockGroupUniqueName/stocks', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/stock-group/' + req.params.stockGroupUniqueName + '/stocks';
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

  router.post('/:stockGroupUniqueName/stock', function(req, res) {
    var args, hUrl;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      },
      data: req.body
    };
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/stock-group/' + req.params.stockGroupUniqueName + '/stock';
    return settings.client.post(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.get('/stocks', function(req, res) {
    var args, hUrl;
    if (req.query.q) {
      hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/stocks?q=' + req.query.q + '&page=' + req.query.page + '&count=' + req.query.count;
    } else {
      hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/stocks';
    }
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

  router.get('/hierarchical-stock-groups', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/hierarchical-stock-groups?q=' + req.query.q + '&page=' + req.query.page + '&count=' + req.query.count;
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

  router.get('/get-stock-detail', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/stock-group/' + req.query.stockGroupUniqueName + '/stock/' + req.query.stockUniqueName;
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

  router.get('/:stockGroupUniqueName', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/stock-group/' + req.params.stockGroupUniqueName;
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

  router["delete"]('/delete-stock', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/stock-group/' + req.query.stockGroupUniqueName + '/stock/' + req.query.stockUniqueName;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      }
    };
    return settings.client["delete"](hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router["delete"]('/delete-stockgrp', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/stock-group/' + req.query.stockGroupUniqueName;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      }
    };
    return settings.client["delete"](hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  module.exports = router;

}).call(this);
