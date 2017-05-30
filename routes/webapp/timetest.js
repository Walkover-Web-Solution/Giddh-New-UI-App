(function() {
  var router, settings;

  settings = require('../util/settings');

  router = settings.express.Router({
    mergeParams: true
  });

  router.get('/', function(req, res) {
    var authHead, data;
    console.log("we are here");
    authHead = {
      headers: {
        'Auth-Key': req.session.authKey,
        'X-Forwarded-For': res.locales.remoteIp
      }
    };
    data = {
      envUrl: settings.envUrl
    };
    return res.send(data);
  });

  module.exports = router;

}).call(this);
