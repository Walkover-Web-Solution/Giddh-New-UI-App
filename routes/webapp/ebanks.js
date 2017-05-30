(function() {
  var router, settings;

  settings = require('../util/settings');

  router = settings.express.Router();

  router.post('/', function(req, res) {
    var authHead, hUrl;
    hUrl = settings.envUrl + 'ebanks';
    authHead = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      },
      data: req.body,
      parameters: {
        name: req.query.name
      }
    };
    return settings.client.post(hUrl, authHead, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router["delete"]('/:companyUniqueName/login/:loginId', function(req, res) {
    var args, hUrl;
    console.log('delete ebank');
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/ebanks/login/' + req.params.loginId;
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
