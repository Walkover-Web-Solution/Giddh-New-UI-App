let settings = require('../util/settings');
let router = settings.express.Router({mergeParams: true});

router.post('/', function(req, res) {
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp,
      'Content-Type' :'application/json'
    },
    data: req.body
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/templates';
  return settings.client.post(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.put('/update/:templateUniqueName', function(req, res) {
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp,
      'Content-Type' :'application/json'
    },
    data: req.body
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/templates/' + req.params.templateUniqueName;
  return settings.client.put(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.get('/all', function(req, res) {
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp,
      'Content-Type' :'application/json'
    }
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/templates/all';
  return settings.client.get(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.get('/:templateUniqueName', function(req, res) {
  console.log('from get');
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp,
      'Content-Type' :'application/json'
    }
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/templates/' + req.params.templateUniqueName + '?operation=' + req.query.operation;
  return settings.client.get(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.delete('/:templateUniqueName', function(req, res) {
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp,
      'Content-Type' :'application/json'
    }
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/templates/' + req.params.templateUniqueName;
  console.log(hUrl);
  return settings.client.delete(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.get('/placeholders', function(req, res) {
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp,
      'Content-Type' :'application/json'
    }
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/placeholders';
  return settings.client.post(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

module.exports = router;
