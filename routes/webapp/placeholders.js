import settings from '../util/settings';
let router = settings.express.Router({mergeParams: true});


router.get('/', function(req, res) {
  let authHead = { 
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/placeholders?type=' + req.query.type;
  return settings.client.get(hUrl, authHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});


export default router;