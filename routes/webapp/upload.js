(function() {
  var rest, router, settings;

  settings = require('../util/settings');

  rest = require('restler');

  router = settings.express.Router();

  router.post('/:companyName/logo', function(req, res) {
    var url;
    url = settings.envUrl + 'company/' + req.params.companyName + '/logo?type=' + req.body.type;
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
      return res.send(data);
    });
  });

  router.post('/:companyName/master', function(req, res) {
    var mRes, url;
    url = settings.envUrl + 'company/' + req.params.companyName + '/import-master';
    rest.post(url, {
      multipart: true,
      headers: {
        'Auth-Key': req.session.authKey,
        'X-Forwarded-For': res.locales.remoteIp
      },
      data: {
        'datafile': rest.file(req.file.path, req.file.path, req.file.size, null, req.file.mimetype)
      }
    }).on('complete', function(data) {
      return console.log('after upload data is', data);
    });
    mRes = {
      status: 'Success',
      body: {
        message: 'Uploaded File is being processed, you can check status later'
      }
    };
    return res.send(mRes);
  });

  router.post('/:companyName/daybook', function(req, res) {
    var mRes, url;
    console.log("Daybook file is: ", req.file);
    url = settings.envUrl + 'company/' + req.params.companyName + '/import-daybook';
    rest.post(url, {
      multipart: true,
      headers: {
        'Auth-Key': req.session.authKey,
        'X-Forwarded-For': res.locales.remoteIp
      },
      data: {
        'datafile': rest.file(req.file.path, req.file.path, req.file.size, null, req.file.mimetype)
      }
    }).on('complete', function(data) {
      return console.log('after upload data is', data);
    });
    mRes = {
      status: 'Success',
      body: {
        message: 'Uploaded File is being processed, you can check status later'
      }
    };
    return res.send(mRes);
  });

  router.post('/:companyName/import-ledger', function(req, res) {
    var mRes, url;
    console.log("import-ledger file is: ", req.file);
    url = settings.envUrl + 'company/' + req.body.urlObj.compUname + '/groups/' + req.body.urlObj.selGrpUname + '/accounts/' + req.body.urlObj.acntUname + '/import-ledger-xls';
    console.log(url, "actual URL");
    rest.post(url, {
      multipart: true,
      headers: {
        'Auth-Key': req.session.authKey,
        'X-Forwarded-For': res.locales.remoteIp
      },
      data: {
        'datafile': rest.file(req.file.path, req.file.path, req.file.size, null, req.file.mimetype)
      }
    }).on('complete', function(data) {
      return console.log('after upload data is', data);
    });
    mRes = {
      status: 'Success',
      body: {
        message: 'Uploaded File is being processed, you can check status later'
      }
    };
    return res.send(mRes);
  });

  module.exports = router;

}).call(this);
