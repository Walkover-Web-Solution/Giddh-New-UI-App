let settings = require('../util/settings');
let router = settings.express.Router({mergeParams: true});

//Get trial balance for an account, query params are - fromDate/toDate {dd-mm-yyyy}
router.get('/', function(req, res) {
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    },
    parameters: {
      to: req.query.toDate,
      from: req.query.fromDate
    }
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName  + '/trial-balance';
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
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

//get balance sheet data
router.get('/balance-sheet', function(req, res) {
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    },
    parameters: {
      fy: req.query.fy
    }
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName  + '/balance-sheet';
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
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
}); 

//get profit loss data
router.get('/profit-loss', function(req, res) {
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    },
    parameters: {
      fy: req.query.fy
    }
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName  + '/profit-loss';
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
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
}); 

//download trial balance data
router.get('/excel-export', function(req, res) {
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    },
    parameters: {
      to: req.query.toDate,
      from: req.query.fromDate,
      export: req.query.exportType,
      q: req.query.q
    }
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName  + '/trial-balance-export';
  return settings.client.get(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});  

module.exports = router;