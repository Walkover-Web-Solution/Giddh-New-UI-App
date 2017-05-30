(function() {
  var rest, router, settings;

  settings = require('../util/settings');

  rest = require('restler');

  router = settings.express.Router();

  router.post('/', function(req, res) {
    var url;
    url = settings.envUrl + 'company/' + req.body.company + '/ledger/upload';
    return rest.post(url, {
      multipart: true,
      headers: {
        'Auth-Key': req.session.authKey,
        'X-Forwarded-For': res.locales.remoteIp
      },
      data: {
        'file': rest.file(req.file.path, req.file.path, req.file.size, null, req.file.mimetype)
      }
    }).on('complete', function(data) {
      var error;
      console.log('after upload data is', data);
      if (data.status === 'success') {
        return res.send(data);
      } else if (data.status === 'error') {
        return res.status(400).send(data);
      } else {
        error = {
          message: "Upload failed, please check that size of the file is less than 1mb"
        };
        return res.status(400).send(error);
      }
    });
  });

  module.exports = router;

}).call(this);
