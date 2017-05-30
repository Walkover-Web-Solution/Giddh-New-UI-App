import settings from '../util/settings';
let router = settings.express.Router();

router.get('/get-coupon', function(req, res) {
  let authHead = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  let hUrl = settings.envUrl + 'coupon/' + req.query.code;
  return settings.client.get(hUrl, authHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

export default router;