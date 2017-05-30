import settings from '../util/settings';
import rest from 'restler';
let router = settings.express.Router();


// upload logo
router.post('/:companyName/logo', function(req, res) {
  let url = settings.envUrl + 'company/' + req.params.companyName + '/logo?type='+ req.body.type;
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
  ).on('complete', data =>
//    console.log 'after upload data is', data
    res.send(data)
  );
});

// end upload logo

// upload master
router.post('/:companyName/master', function(req, res) {
  let url = settings.envUrl + 'company/' + req.params.companyName + '/import-master';
  rest.post(url, {
    multipart: true,
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    },
    data: {
      'datafile': rest.file(req.file.path, req.file.path, req.file.size, null, req.file.mimetype)
    }
  }
  ).on('complete', data => console.log('after upload data is', data));
  let mRes = {
    status: 'Success',
    body: { message: 'Uploaded File is being processed, you can check status later'
  }
  };
  return res.send(mRes);
});

// upload daybook
router.post('/:companyName/daybook', function(req, res) {
  console.log("Daybook file is: ", req.file);
  let url = settings.envUrl + 'company/' + req.params.companyName + '/import-daybook';
  rest.post(url, {
    multipart: true,
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    },
    data: {
      'datafile': rest.file(req.file.path, req.file.path, req.file.size, null, req.file.mimetype)
    }
  }
  ).on('complete', data => console.log('after upload data is', data));
  let mRes = {
    status: 'Success',
    body: { message: 'Uploaded File is being processed, you can check status later'
  }
  };
  return res.send(mRes);
});

// import ledger
router.post('/:companyName/import-ledger', function(req, res) {
  console.log("import-ledger file is: ", req.file);
  let url = settings.envUrl + 'company/' + req.body.urlObj.compUname + '/groups/' +
      req.body.urlObj.selGrpUname + '/accounts/' + req.body.urlObj.acntUname + '/import-ledger-xls';

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
  }
  ).on('complete', data => console.log('after upload data is', data));
  let mRes = {
    status: 'Success',
    body: { message: 'Uploaded File is being processed, you can check status later'
  }
  };
  return res.send(mRes);
});



export default router;