let settings = require('../util/settings');
let router = settings.express.Router({mergeParams: true});

router.get('/', function(req, res) {
  console.log("we are here");
  let authHead = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  let data = {envUrl: settings.envUrl};
  return res.send(data);
});





module.exports = router;