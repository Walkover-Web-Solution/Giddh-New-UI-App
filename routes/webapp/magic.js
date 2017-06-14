let settings = require('../util/settings');
let router = settings.express.Router();

router.post('/', function(req, res) {
  let hUrl;
  if ((req.body.data.from !== undefined) && (req.body.data.to !== undefined)) {
    hUrl = settings.envUrl + '/magic-link/' + req.body.data.id + '?from=' + req.body.data.from + '&to=' + req.body.data.to;
  } else {
    hUrl = settings.envUrl + '/magic-link/' + req.body.data.id;
  }
  return settings.client.get(hUrl, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

module.exports = router;