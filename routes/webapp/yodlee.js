let settings = require('../util/settings');
let router = settings.express.Router();

// router.get '/login-register', (req, res) ->
//   authHead =
//     headers:
//       'Auth-Key': req.session.authKey
//       'X-Forwarded-For': res.locales.remoteIp
//   hUrl = settings.envUrl + 'yodlee/login-register'
//   settings.client.get hUrl, authHead, (data, response) ->
//     if data.status == 'error'
//       res.status(response.statusCode)
//     res.send data


// router.get '/company/:companyUniqueName/accounts', (req, res) ->
//   authHead =
//     headers:
//       'Auth-Key': req.session.authKey
//       'X-Forwarded-For': res.locales.remoteIp
//   hUrl = settings.envUrl + 'yodlee/company/' + req.params.companyUniqueName + '/accounts'
//   settings.client.get hUrl, authHead, (data, response) ->
//     if data.status == 'error'
//       res.status(response.statusCode)
//     res.send data

router.post('/company/:companyUniqueName/add-giddh-account', function(req, res) {
  let hUrl = settings.envUrl + 'yodlee/company/' + req.params.companyUniqueName + '/add-giddh-account';
  let authHead = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    },
    data: req.body
  };
  return settings.client.post(hUrl, authHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});



router.get('/company/:companyUniqueName/all-site-account', function(req, res) {
  let authHead = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  let hUrl = settings.envUrl + 'yodlee/company/' + req.params.companyUniqueName + '/all-site-account';
  return settings.client.get(hUrl, authHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

module.exports = router;