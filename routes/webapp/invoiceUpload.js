let settings = require('../util/settings');
let rest = require('restler');
let router = settings.express.Router();


// upload logo
router.post('/', function(req, res) {
  let url = settings.envUrl + 'company/' + req.body.company + '/ledger/upload';
  return rest.post(url, {
    multipart: true,
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    },
    data: {
      'file': rest.file(req.file.path, req.file.path, req.file.size, null, req.file.mimetype)
    }
  }
  ).on('complete', function(data) {
    console.log('after upload data is', data);
    if (data.status === 'success') {
      return res.send(data);
    } else if (data.status === 'error') {
      return res.status(400).send(data);
    } else {
      let error = {
        message:"Upload failed, please check that size of the file is less than 1mb"
      };
      return res.status(400).send(error);
    }
  });
});


module.exports = router;