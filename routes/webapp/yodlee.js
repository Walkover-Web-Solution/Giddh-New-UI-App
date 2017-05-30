(function() {
  var router, settings;

  settings = require('../util/settings');

  router = settings.express.Router();

  router.post('/company/:companyUniqueName/add-giddh-account', function(req, res) {
    var authHead, hUrl;
    hUrl = settings.envUrl + 'yodlee/company/' + req.params.companyUniqueName + '/add-giddh-account';
    authHead = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      },
      data: req.body
    };
    return settings.client.post(hUrl, authHead, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.get('/company/:companyUniqueName/all-site-account', function(req, res) {
    var authHead, hUrl;
    authHead = {
      headers: {
        'Auth-Key': req.session.authKey,
        'X-Forwarded-For': res.locales.remoteIp
      }
    };
    hUrl = settings.envUrl + 'yodlee/company/' + req.params.companyUniqueName + '/all-site-account';
    return settings.client.get(hUrl, authHead, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  module.exports = router;

}).call(this);
