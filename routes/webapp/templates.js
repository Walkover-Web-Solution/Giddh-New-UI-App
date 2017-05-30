(function() {
  var router, settings;

  settings = require('../util/settings');

  router = settings.express.Router({
    mergeParams: true
  });

  router.post('/', function(req, res) {
    var args, hUrl;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'X-Forwarded-For': res.locales.remoteIp,
        'Content-Type': 'application/json'
      },
      data: req.body
    };
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/templates';
    return settings.client.post(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.put('/update/:templateUniqueName', function(req, res) {
    var args, hUrl;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'X-Forwarded-For': res.locales.remoteIp,
        'Content-Type': 'application/json'
      },
      data: req.body
    };
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/templates/' + req.params.templateUniqueName;
    return settings.client.put(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.get('/all', function(req, res) {
    var args, hUrl;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'X-Forwarded-For': res.locales.remoteIp,
        'Content-Type': 'application/json'
      }
    };
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/templates/all';
    return settings.client.get(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.get('/:templateUniqueName', function(req, res) {
    var args, hUrl;
    console.log('from get');
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'X-Forwarded-For': res.locales.remoteIp,
        'Content-Type': 'application/json'
      }
    };
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/templates/' + req.params.templateUniqueName + '?operation=' + req.query.operation;
    return settings.client.get(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router["delete"]('/:templateUniqueName', function(req, res) {
    var args, hUrl;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'X-Forwarded-For': res.locales.remoteIp,
        'Content-Type': 'application/json'
      }
    };
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/templates/' + req.params.templateUniqueName;
    console.log(hUrl);
    return settings.client["delete"](hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.get('/placeholders', function(req, res) {
    var args, hUrl;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'X-Forwarded-For': res.locales.remoteIp,
        'Content-Type': 'application/json'
      }
    };
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/placeholders';
    return settings.client.post(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  module.exports = router;

}).call(this);
