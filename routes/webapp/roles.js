import settings from '../util/settings';
let router = settings.express.Router();

router.get('/', function(req, res) {
  let onlyAuthHead = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  let hUrl = settings.envUrl + 'roles';
  return settings.client.get(hUrl, onlyAuthHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.get('/getEnvVars', function(req, res) {
  let authHead = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  let data = {envUrl: settings.cdnUrl};
  return res.send(data);
});

export default router;