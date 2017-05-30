(function() {
  var router, settings;

  settings = require('../util/settings');

  router = settings.express.Router();

  router.get('/', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'currency';
    args = {
      headers: {
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

  module.exports = router;

}).call(this);
