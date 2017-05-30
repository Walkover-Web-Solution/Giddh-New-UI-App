(function() {
  var router, settings;

  settings = require('../util/settings');

  router = settings.express.Router({
    mergeParams: true
  });

  router.post('/:uniqueName', function(req, res) {
    var abc, args, str;
    abc = req.params.companyUniqueName + '/proforma/' + req.params.uniqueName;
    str = settings.envUrl + 'company/' + abc;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'X-Forwarded-For': res.locales.remoteIp
      },
      data: req.body
    };
    return settings.client.post(str, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  module.exports = router;

}).call(this);
