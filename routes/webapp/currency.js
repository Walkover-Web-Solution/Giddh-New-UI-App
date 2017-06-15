let settings = require('../util/settings');
let router = settings.express.Router();

router.get('/', function(req, res) {
  let hUrl = settings.envUrl + 'currency';
  let args = {
  	headers: {
  		'Content-Type': 'application/json',
  		'X-Forwarded-For': res.locales.remoteIp
}
};
  return settings.client.get(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

module.exports = router;