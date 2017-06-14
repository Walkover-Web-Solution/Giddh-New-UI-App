let settings = require('../util/settings');
let router = settings.express.Router({mergeParams: true});

router.post('/:uniqueName', function(req, res) {
  let abc = req.params.companyUniqueName + '/proforma/'+req.params.uniqueName;
  let str = settings.envUrl+ 'company/' + abc;
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    },
    data: req.body
  };
  return settings.client.post(str, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});


module.exports = router;