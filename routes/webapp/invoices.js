let settings = require('../util/settings');
let router = settings.express.Router({mergeParams: true});

router.post('/', function(req, res) {
  let abc = req.params.companyUniqueName + '/invoices?from='+req.query.from+'&to='+req.query.to + '&count=' + req.query.count + '&page=' + req.query.page;
  let str = settings.envUrl+ 'company/' + abc;
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp,
      'Content-Type': 'application/json'
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

router.post('/bulk-generate', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/invoices/bulk-generate?combined=' + req.query.combined;
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp,
      'Content-Type': 'application/json'
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

router.post('/ledgers', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/ledgers?from=' + req.query.from + '&to=' + req.query.to + '&count=' + req.query.count + '&page=' + req.query.page;
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp,
      'Content-Type': 'application/json'
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

// get all proforma
router.get('/proforma/all', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/proforma/list?from=' + req.query.from + '&to=' + req.query.to + '&page=' + req.query.page + '&count=' + req.query.count;
  hUrl = "";
  if ((req.body.fromDate === undefined) && (req.body.toDate !== undefined)) {
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/proforma/list?to=' + req.query.to + '&page=' + req.query.page + '&count=' + req.query.count;
  } else if ((req.body.toDate === undefined) && (req.body.fromDate !== undefined)) {
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/proforma/list?from=' + req.query.from + '&page=' + req.query.page + '&count=' + req.query.count;
  } else if ((req.body.toDate === undefined) && (req.body.fromDate === undefined)) {
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/proforma/list?page=' + req.query.page + '&count=' + req.query.count;
  } else {
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/proforma/list?from=' + req.query.from + '&to=' + req.query.to + '&page=' + req.query.page + '&count=' + req.query.count;
  }
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp,
      'Content-Type': 'application/json'
    }
  };
  return settings.client.get(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.post('/action', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/invoices/' + req.query.invoiceUniqueName + '/action';
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp,
      'Content-Type': 'application/json'
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


router.post('/proforma/all', function(req, res) {
  let hUrl = "";
  if ((req.body.fromDate === undefined) && (req.body.toDate !== undefined)) {
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/proforma/list?to=' + req.body.toDate + '&page=' + req.body.page + '&count=' + req.body.count;
  } else if ((req.body.toDate === undefined) && (req.body.fromDate !== undefined)) {
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/proforma/list?from=' + req.body.fromDate + '&page=' + req.body.page + '&count=' + req.body.count;
  } else if ((req.body.toDate === undefined) && (req.body.fromDate === undefined)) {
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/proforma/list?page=' + req.body.page + '&count=' + req.body.count;
  } else {
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/proforma/list?from=' + req.body.fromDate + '&to=' + req.body.toDate + '&page=' + req.body.page + '&count=' + req.body.count;
  }

  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp,
      'Content-Type': 'application/json'
    },
    data: req.body
  };
  console.log(hUrl);
  return settings.client.post(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.delete('/proforma/delete', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/proforma/' + req.query.proforma;
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp,
      'Content-Type': 'application/json'
    }
  };
  return settings.client.delete(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.post('/proforma/updateBalanceStatus', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/proforma/' + req.body.proformaUniqueName + '/action';
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp,
      'Content-Type': 'application/json'
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

router.post('/proforma/link-account', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/proforma/' + req.body.proformaUniqueName + '/link-account';
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp,
      'Content-Type': 'application/json'
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

router.post('/proforma', function(req, res) {
  console.log(req.body);
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/proforma';
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp,
      'Content-Type': 'application/json'
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

router.put('/proforma/update', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/proforma/' + req.body.proforma;
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp,
      'Content-Type': 'application/json'
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

router.get('/proforma/templates', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/templates/all';
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp,
      'Content-Type': 'application/json'
    }
  };
  return settings.client.get(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.post('/proforma/get', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/proforma/' + req.body.proforma; 
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp,
      'Content-Type': 'application/json'
    }
  };
  return settings.client.get(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.post('/proforma/mail', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/proforma/mail';
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp,
      'Content-Type': 'application/json'
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

router.post('/proforma/download', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/proforma/download';
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp,
      'Content-Type': 'application/json'
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

router.put('/proforma/templates/default', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/templates/'+ req.body.templateUniqueName + '/default';
  console.log(hUrl);
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp,
      'Content-Type': 'application/json'
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


module.exports = router;