(function() {
  var app, router, settings;

  settings = require('../util/settings');

  app = settings.express();

  router = settings.express.Router();

  router.get('/', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'state-details';
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

  router.post('/', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'state-details';
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

  module.exports = router;

}).call(this);
