import settings from '../util/settings';
let router = settings.express.Router();

router.get('/:uniqueName', function(req, res) {
  let authHead = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  let hUrl = settings.envUrl + 'users/' + req.params.uniqueName;
  return settings.client.get(hUrl, authHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

//Delete sub user
router.delete('/:uniqueName', function(req, res) {
  let authHead = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  let hUrl = settings.envUrl + 'users/' + req.params.uniqueName;
  return settings.client.delete(hUrl, authHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

// create sub user
router.post('/:uniqueName/sub-user', function(req, res) {
  let authHead = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    },
    data: req.body
  };
  let hUrl = settings.envUrl + 'users/' + req.params.uniqueName+ '/sub-user';
  return settings.client.post(hUrl, authHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

// get sub user authkey
router.get('/:uniqueName/auth-key/sub-user', function(req, res) {
  let authHead = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    },
    parameters: {
      uniqueName: req.query.uniqueName
    }
  };
  let hUrl = settings.envUrl + 'users/auth-key';
  return settings.client.get(hUrl, authHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.get('/auth-key/:uniqueName', function(req, res) {
  let data = {
    status: "success",
    body: req.session.authKey
  };
  return res.send(data);
});

router.put('/:uniqueName/generate-auth-key', function(req, res) {
  let authHead = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  let hUrl = settings.envUrl + 'users/' + req.params.uniqueName + '/generate-auth-key';
  return settings.client.put(hUrl, authHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    } else {
      req.session.authKey = data.body.authKey;
    }
    return res.send(data);
  });
});

router.get('/:uniqueName/subscribed-companies', function(req, res) {
  let authHead = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  let hUrl = settings.envUrl + 'users/' + req.params.uniqueName + '/subscribed-companies';
  return settings.client.get(hUrl, authHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.get('/:uniqueName/transactions', function(req, res) {
  let authHead = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    },
    parameters: {
      page: req.query.page
    }
  };
  let hUrl = settings.envUrl + 'users/' + req.params.uniqueName + '/transactions';
  return settings.client.get(hUrl, authHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.get('/:uniqueName/available-credit', function(req, res) {
  let authHead = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  let hUrl = settings.envUrl + 'users/' + req.params.uniqueName + '/available-credit';
  return settings.client.get(hUrl, authHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

// delete auto payee self service
router.put('/:uniqueName/delete-payee', function(req, res) {
  let authHead = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp,
      'Content-Type': 'application/json'
    },
    data: req.body
  };
  let hUrl = settings.envUrl + 'users/' + req.params.uniqueName + '/delete-payee';
  return settings.client.put(hUrl, authHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

// add balance in wallet
router.post('/:uniqueName/balance', function(req, res) {
  let hUrl = settings.envUrl + 'users/' + req.params.uniqueName + '/balance';
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

// add mobile number
router.post('/system_admin/verify-number', function(req, res) {
  let authHead = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    },
    data: req.body
  };
  let hUrl = settings.envUrl + 'users/system_admin/verify-number';
  return settings.client.post(hUrl, authHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

// verify mobile number
router.put('/system_admin/verify-number', function(req, res) {
  let authHead = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp,
      'Content-Type': 'application/json'
    },
    data: req.body
  };
  let hUrl = settings.envUrl + 'users/system_admin/verify-number';
  return settings.client.put(hUrl, authHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

//two way auth
router.put('/:uniqueName/settings', function(req, res) {
  let authHead = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp,
      'Content-Type': 'application/json'
    },
    data: req.body
  };
  let hUrl = settings.envUrl + 'users/' + req.params.uniqueName + '/settings';
  return settings.client.put(hUrl, authHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    // else
    //   req.session.authKey = data.body.authKey
    return res.send(data);
  });
});

export default router;