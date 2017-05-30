import settings from '../util/settings';
let router = settings.express.Router({mergeParams: true});


// generate magic link
router.post('/companies', function(req, res) {
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp,
      'Content-Type': 'application/json'
    },
    data: req.body.filters
  };
  let hUrl = settings.envUrl + 'admin/companies?page='+req.body.params.page+'&count='+req.body.params.count;
  return settings.client.post(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});


export default router;