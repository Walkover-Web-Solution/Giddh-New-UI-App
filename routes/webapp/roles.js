(function() {
  var router, settings;

  settings = require('../util/settings');

  router = settings.express.Router();

  router.get('/', function(req, res) {
    var hUrl, onlyAuthHead;
    onlyAuthHead = {
      headers: {
        'Auth-Key': req.session.authKey,
        'X-Forwarded-For': res.locales.remoteIp
      }
    };
    hUrl = settings.envUrl + 'roles';
    return settings.client.get(hUrl, onlyAuthHead, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.get('/getEnvVars', function(req, res) {
    var authHead, data;
    authHead = {
      headers: {
        'Auth-Key': req.session.authKey,
        'X-Forwarded-For': res.locales.remoteIp
      }
    };
    data = {
      envUrl: settings.cdnUrl
    };
    return res.send(data);
  });

  module.exports = router;

}).call(this);
