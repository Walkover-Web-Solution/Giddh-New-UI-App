(function() {
  var router, settings;

  settings = require('../util/settings');

  router = settings.express.Router({
    mergeParams: true
  });

  router.get('/profit-loss-collapsed-download', function(req, res) {
    var args, hUrl;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'X-Forwarded-For': res.locales.remoteIp
      },
      parameters: {
        fy: req.query.fy
      }
    };
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/profit-loss-collapsed-download';
    return settings.client.get(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  module.exports = router;

}).call(this);
