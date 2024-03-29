let settings = require('../util/settings');
let router = settings.express.Router({mergeParams: true});

//Get all ledgers for an account, query params are - fromDate/toDate {dd-mm-yyyy}
router.get('/', function(req, res) {
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    },
    parameters: {
      to: req.query.toDate,
      from: req.query.fromDate,
      count:Number(req.query.count) || 0,
      page:Number(req.query.page) || 1
    }
  };
      //sort:req.query.sort
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/accounts/' + encodeURIComponent(req.params.accountUniqueName) + '/ledgers';
  return settings.client.get(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.get('/transactions', function(req, res) {
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    },
    parameters: {
      to: req.query.toDate,
      from: req.query.fromDate,
      count:Number(req.query.count) || 0,
      page:Number(req.query.page),
      sort:req.query.sort,
      reversePage: req.query.reversePage,
      q: req.query.q
    }
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/accounts/' + encodeURIComponent(req.params.accountUniqueName) + '/ledgers/transactions';
  return settings.client.get(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

//Delete all ledgers of an account
router.delete('/', function(req, res) {
  let authHead = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName +
      '/accounts/' + req.params.accountUniqueName + '/ledgers';
  return settings.client.delete(hUrl, authHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

//download invoice attachement
router.get('/invoice-file', function(req, res) {
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
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/ledger/upload/' + req.query.fileName;
  return settings.client.get(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

//get reconciled entries
router.get('/reconcile', function(req, res) {
  let authHead = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    },
    parameters: {
      to: req.query.to,
      from: req.query.from,
      chequeNumber:req.query.chequeNumber || ''
    }
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName +
      '/accounts/' + req.params.accountUniqueName + '/ledgers/reconcile';
  return settings.client.get(hUrl, authHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

//Get ledgers
router.get('/:ledgerUniqueName', function(req, res) {
  let authHead = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName +
      '/accounts/' + req.params.accountUniqueName + '/ledgers/' + req.params.ledgerUniqueName;
  return settings.client.get(hUrl, authHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

//Create ledgers
router.post('/', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName +
      '/accounts/' + req.params.accountUniqueName + '/ledgers';
  req.body.uniqueName = settings.stringUtil.getRandomString(req.params.accountUniqueName, req.params.companyUniqueName);
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp,
      'Content-Type': 'application/json'
    },
    data: req.body
  };
  return settings.client.post(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});
    
//Update ledgers
router.put('/:ledgerUniqueName', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName +
      '/accounts/' + req.params.accountUniqueName + '/ledgers/' + req.params.ledgerUniqueName;
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp,
      'Content-Type': 'application/json'
    },
    data: req.body
  };
  return settings.client.put(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

//Delete ledgers
router.delete('/:ledgerUniqueName', function(req, res) {
  let authHead = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName +
      '/accounts/' + req.params.accountUniqueName + '/ledgers/' + req.params.ledgerUniqueName;
  return settings.client.delete(hUrl, authHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.post('/paymentTransactions', function(req, res) {
  let authHead = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    },
    data: req.body
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName +
      '/accounts/' + req.params.accountUniqueName + '/ledgers/paymentTransactions';
  return settings.client.post(hUrl, authHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});


    
module.exports = router;