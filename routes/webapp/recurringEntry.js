let settings = require('../util/settings');
let router = settings.express.Router({mergeParams: true});


router.post('/', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/accounts/' + req.query.accountUniqueName + '/recurring-entry';
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

router.get('/', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/recurring-entry/ledgers';
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp,
      'Content-Type': 'application/json'
    }
  };
  return settings.client.get(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.get('/duration-type', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/recurring-entry/duration-type';
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp,
      'Content-Type': 'application/json'
    }
  };
  return settings.client.get(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.put('/update', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/accounts/' + req.query.accountUniqueName + '/recurring-entry/' + req.query.recurringentryUniqueName;
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

router.delete('/delete', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/recurring-entry/' + req.query.recurringentryUniqueName;
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp,
      'Content-Type': 'application/json'
    }
  };
  return settings.client.delete(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

module.exports = router;