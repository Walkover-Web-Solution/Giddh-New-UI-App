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
        from: req.query.fromDate
      }
    };
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/trial-balance';
    if (req.query.refresh === "true") {
      args = {
        headers: {
          'Auth-Key': req.session.authKey,
          'X-Forwarded-For': res.locales.remoteIp
        },
        parameters: {
          to: req.query.toDate,
          from: req.query.fromDate,
          refresh: true
        }
      };
    }
    return settings.client.get(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.get('/balance-sheet', function(req, res) {
    var args, hUrl;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'X-Forwarded-For': res.locales.remoteIp
      },
      parameters: {
        fy: req.query.fy
      }
    };
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/balance-sheet';
    if (req.query.refresh === "true") {
      args = {
        headers: {
          'Auth-Key': req.session.authKey,
          'X-Forwarded-For': res.locales.remoteIp
        },
        parameters: {
          fy: req.query.fy,
          refresh: true
        }
      };
    }
    return settings.client.get(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.get('/profit-loss', function(req, res) {
    var args, hUrl;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'X-Forwarded-For': res.locales.remoteIp
      },
      parameters: {
        fy: req.query.fy
      }
    };
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/profit-loss';
    if (req.query.refresh === "true") {
      args = {
        headers: {
          'Auth-Key': req.session.authKey,
          'X-Forwarded-For': res.locales.remoteIp
        },
        parameters: {
          fy: req.query.fy,
          refresh: true
        }
      };
    }
    return settings.client.get(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.get('/excel-export', function(req, res) {
    var args, hUrl;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'X-Forwarded-For': res.locales.remoteIp
      },
      parameters: {
        to: req.query.toDate,
        from: req.query.fromDate,
        "export": req.query.exportType,
        q: req.query.q
      }
    };
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/trial-balance-export';
    return settings.client.get(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  module.exports = router;

}).call(this);
