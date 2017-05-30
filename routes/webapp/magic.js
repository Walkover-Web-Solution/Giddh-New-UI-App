(function() {
  var router, settings;

  settings = require('../util/settings');

  router = settings.express.Router();

  router.post('/', function(req, res) {
    var hUrl;
    if (req.body.data.from !== void 0 && req.body.data.to !== void 0) {
      hUrl = settings.envUrl + '/magic-link/' + req.body.data.id + '?from=' + req.body.data.from + '&to=' + req.body.data.to;
    } else {
      hUrl = settings.envUrl + '/magic-link/' + req.body.data.id;
    }
    return settings.client.get(hUrl, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  module.exports = router;

}).call(this);
