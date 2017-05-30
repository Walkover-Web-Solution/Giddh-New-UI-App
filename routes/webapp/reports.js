import settings from '../util/settings';
let router = settings.express.Router({mergeParams: true});
router.post('/history', function(req, res) {
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    },
    parameters: {
      to: req.query.toDate,
      from: req.query.fromDate,
      interval: req.query.interval
    },
    data: req.body
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName +
          '/history';
  return settings.client.post(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.post('/group-history', function(req, res) {
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    },
    parameters: {
      to: req.query.toDate,
      from: req.query.fromDate,
      interval: req.query.interval,
      refresh: req.query.refresh
    },
    data: req.body
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName +
      '/group-history';
  return settings.client.post(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.get('/profit-loss-history', function(req, res) {
  let authHead = { 
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    },
    parameters: {
      to: req.query.toDate,
      from: req.query.fromDate,
      interval: req.query.interval
    } 
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/profit-loss-history';
  return settings.client.get(hUrl, authHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.get('/profit-loss', function(req, res) {
  let authHead = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    },
    parameters: {
      to: req.query.toDate,
      from: req.query.fromDate,
      interval: req.query.interval
    }
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/profit-loss';
  return settings.client.get(hUrl, authHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.get('/networth-history', function(req, res) {
  let authHead = { 
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    },
    parameters: {
      to: req.query.toDate,
      from: req.query.fromDate,
      interval: req.query.interval
    } 
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/networth-history';
  return settings.client.get(hUrl, authHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.get('/networth', function(req, res) {
  let authHead = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    },
    parameters: {
      to: req.query.toDate,
      from: req.query.fromDate,
      interval: req.query.interval
    }
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/networth';
  return settings.client.get(hUrl, authHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.get('/dashboard', function(req, res) {
  let authHead = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    },
    parameters: {
      to: req.query.toDate,
      from: req.query.fromDate,
      interval: req.query.interval,
      refresh: req.query.refresh
    }
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/dashboard';
  return settings.client.get(hUrl, authHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.get('/sms-key', function(req, res) {
  let authHead = { 
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    } 
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/sms-key';
  return settings.client.get(hUrl, authHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.get('/email-key', function(req, res) {
  let authHead = { 
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/email-key';
  return settings.client.get(hUrl, authHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.get('/financial-year', function(req, res) {
  let authHead = { 
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/financial-year';
  return settings.client.get(hUrl, authHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.put('/financial-year', function(req, res) {
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    },
    data: req.body
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/financial-year';
  return settings.client.put(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.post('/financial-year', function(req, res) {
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    },
    data: req.body
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/financial-year';
  return settings.client.post(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.patch('/active-financial-year', function(req, res) {
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    },
    data: req.body
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/active-financial-year';
  return settings.client.patch(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.patch('/financial-year-lock', function(req, res) {
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    },
    data: req.body
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/financial-year-lock';
  return settings.client.patch(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.patch('/financial-year-unlock', function(req, res) {
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    },
    data: req.body
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/financial-year-unlock';
  return settings.client.patch(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.post('/sms-key', function(req, res) {
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    },
    data: req.body
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName +
      '/sms-key';
  return settings.client.post(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.post('/email-key', function(req, res) {
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    },
    data: req.body
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName +
      '/email-key';
  return settings.client.post(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.post('/accounts/bulk-sms', function(req, res) {
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    },
    data: req.body,
    parameters: {
      to:req.query.to,
      from:req.query.from
    }
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName +
      '/accounts/bulk-sms';
  return settings.client.post(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.post('/accounts/bulk-email', function(req, res) {
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    },
    data: req.body,
    parameters: {
      to:req.query.to,
      from:req.query.from
    }
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName +
      '/accounts/bulk-email';
  return settings.client.post(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});


router.post('/subgroups-with-accounts', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/groups-with-accounts';
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

// update generated invoice
router.put('/invoices', function(req, res) {
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    },
    data: req.body
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/invoices';
  return settings.client.put(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.post('/tax/assign', function(req,res) {
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    },
    data: req.body
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/tax/assign';
  return settings.client.post(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.put('/invoice-setting', function(req, res) {
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    },
    data: req.body
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/invoice-setting';
  return settings.client.put(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

//entry settings
router.get('/entry-settings', function(req, res) {
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
    // parameters:
    //   to: req.query.toDate
    //   from: req.query.fromDate
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName +
      '/entry-settings';
  console.log(hUrl);
  return settings.client.get(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.put('/update-entry-settings', function(req, res) {
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    },
    data: req.body
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/entry-settings';
  return settings.client.put(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

export default router;