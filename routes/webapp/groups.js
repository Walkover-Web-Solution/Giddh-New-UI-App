let settings = require('../util/settings');
let router = settings.express.Router({mergeParams: true});

router.get('/', function(req, res) {
  let authHead = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/groups';
  return settings.client.get(hUrl, authHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.get('/flatten-groups-accounts', function(req, res) {
  let authHead = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    },
    parameters: {
      'q':req.query.q,
      'page': req.query.page,
      'count':req.query.count,
      'showEmptyGroups':req.query.showEmptyGroups || false
    }
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/flatten-groups-with-accounts';
  return settings.client.get(hUrl, authHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.get('/flatten-accounts', function(req, res) {
  let authHead = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    },
    parameters: {
      'q':req.query.q,
      'page': req.query.page,
      'count':req.query.count
    }
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/flatten-accounts';
  return settings.client.get(hUrl, authHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.post('/flatten-accounts', function(req, res) {
  let authHead = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp,
      'Content-Type': 'application/json'
    },
    parameters: {
      'q':req.query.q,
      'page': req.query.page,
      'count':req.query.count
    },
    data: req.body
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/flatten-accounts';
  return settings.client.post(hUrl, authHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.get('/with-accounts', function(req, res) {
  let authHead = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    },
    parameters: {
      'q':req.query.q || ''
    }
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/groups-with-accounts';
  return settings.client.get(hUrl, authHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.get('/detailed-groups', function(req, res) {
  let authHead = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/detailed-groups';
  return settings.client.get(hUrl, authHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.get('/detailed-groups-with-accounts', function(req, res) {
  let authHead = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/groups-with-accounts';
  return settings.client.get(hUrl, authHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.put('/:groupUniqueName', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/groups/' + req.params.groupUniqueName;
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    },
    data: req.body
  };
  return settings.client.put(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.put('/:groupUniqueName/move', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/groups/' + req.params.groupUniqueName + '/move';
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    },
    data: req.body
  };
  return settings.client.put(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.put('/:groupUniqueName/share', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/groups/' + req.params.groupUniqueName + '/share';
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    },
    data: req.body
  };
  return settings.client.put(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.put('/:groupUniqueName/unshare', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/groups/' + req.params.groupUniqueName + '/unshare';
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    },
    data: req.body
  };
  return settings.client.put(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.get('/:groupUniqueName/shared-with', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/groups/' + req.params.groupUniqueName + '/shared-with';
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  return settings.client.get(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.delete('/:groupUniqueName', function(req, res) {
  console.log("from groups API");
  let authHead = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/groups/' + req.params.groupUniqueName;
  return settings.client.delete(hUrl, authHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.get('/:groupUniqueName', function(req, res) {
  let authHead = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/groups/' + req.params.groupUniqueName;
  return settings.client.get(hUrl, authHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.post('/', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/groups';
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    },
    data: req.body
  };
  return settings.client.post(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.post('/:groupUniqueName/accounts', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/groups/' + req.params.groupUniqueName + '/accounts';
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    },
    data: req.body
  };
  return settings.client.post(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

// get closing balance
router.get('/:groupUniqueName/closing-balance', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/groups/' + req.params.groupUniqueName + '/closing-balance';
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    },
    parameters: {
      from: req.query.fromDate,
      to: req.query.toDate,
      refresh: req.query.refresh
    }
  };
  return settings.client.get(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.get('/:groupUniqueName/subgroups-with-accounts', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/groups/' + req.params.groupUniqueName + '/subgroups-with-accounts';
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  return settings.client.get(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.get('/:groupUniqueName/tax-hierarchy', function(req, res) {
  let hUrl = settings.envUrl + 'company/'+req.params.companyUniqueName + '/groups/'+req.params.groupUniqueName+'/tax-hierarchy';
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  return settings.client.get(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});



module.exports = router;