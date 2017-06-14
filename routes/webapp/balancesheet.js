let settings = require('../util/settings');
let router = settings.express.Router({mergeParams: true});

//download balance sheet data
router.get('/balance-sheet-collapsed-download', function(req, res) {
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    },
    parameters: {
      fy: req.query.fy
    }
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName  + '/balance-sheet-collapsed-download';
  return settings.client.get(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});    

module.exports = router;