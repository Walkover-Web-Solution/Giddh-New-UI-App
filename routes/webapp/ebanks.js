import settings from '../util/settings';
let router = settings.express.Router();


router.post('/', function(req, res) {
  let hUrl = settings.envUrl + 'ebanks';
  let authHead = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    },
    data: req.body,
    parameters: {
      name: req.query.name
    }
  };
  return settings.client.post(hUrl, authHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.delete('/:companyUniqueName/login/:loginId',function(req,res) {
  console.log('delete ebank');
  let hUrl = settings.envUrl + 'company/'+req.params.companyUniqueName+'/ebanks/login/'+req.params.loginId;
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  return settings.client.delete(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

export default router;