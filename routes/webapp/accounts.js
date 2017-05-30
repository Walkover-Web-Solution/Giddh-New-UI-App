import settings from '../util/settings';
let router = settings.express.Router({mergeParams: true});

router.get('/', function(req, res) {
  console.log(encodeURIComponent('%'));
  let authHead = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName +
      '/accounts';
  return settings.client.get(hUrl, authHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.get('/:accountUniqueName', function(req, res) {
  let authHead = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName +
      '/accounts/' + encodeURIComponent(req.params.accountUniqueName);
  return settings.client.get(hUrl, authHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    //console.log res
    return res.send(data);
  });
});

router.put('/:accountUniqueName', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName +
      '/accounts/' + encodeURIComponent(req.params.accountUniqueName);
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

router.put('/:accountUniqueName/move', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName +
      '/accounts/' + encodeURIComponent(req.params.accountUniqueName) + '/move';
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

router.put('/:accountUniqueName/merge', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName +
      '/accounts/' + encodeURIComponent(req.params.accountUniqueName) + '/merge';
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

// router.post '/:accountUniqueName/un-merge', (req, res) ->
//   authHead =
//     headers:
//       'Auth-Key': req.session.authKey
//       'X-Forwarded-For': res.locales.remoteIp
//   hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName +
//       '/accounts/' + req.params.accountUniqueName + '/un-merge'
//   data = req.body
//   settings.client.post hUrl, authHead, (data, response) ->
//     if data.status == 'error'
//       res.status(response.statusCode)
//     res.send data

router.post('/:accountUniqueName/un-merge', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName +
      '/accounts/' + encodeURIComponent(req.params.accountUniqueName) + '/un-merge';
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




router.put('/:accountUniqueName/share', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName +
      '/accounts/' + encodeURIComponent(req.params.accountUniqueName) + '/share';
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

router.delete('/:accountUniqueName', function(req, res) {
  let authHead = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName +
      '/accounts/' + encodeURIComponent(req.params.accountUniqueName);
  return settings.client.delete(hUrl, authHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.get('/:accountUniqueName/shared-with', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName +
      '/accounts/' + encodeURIComponent(req.params.accountUniqueName) + '/shared-with';
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

router.put('/:accountUniqueName/unshare', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName +
      '/accounts/' + encodeURIComponent(req.params.accountUniqueName) + '/unshare';
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

//map bank transaction
router.put('/:accountUniqueName/eledgers/map/:transactionId', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/accounts/' + req.params.accountUniqueName + '/eledgers/' + req.params.transactionId;
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

router.get('/:accountUniqueName/export-ledger', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName +
      '/accounts/' + encodeURIComponent(req.params.accountUniqueName) + '/v2/export-ledger';
  // if req.query.ltype == 'condensed'
  //   hUrl = hUrl + '-condensed'
  // else
  //   hUrl = hUrl + '-detailed'
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    },
    parameters: {
      to: req.query.toDate,
      from: req.query.fromDate,
      format : req.query.ltype
    }
  };
  return settings.client.get(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

// get ledger import list
router.get('/:accountUniqueName/xls-imports', function(req, res) {
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName +
      '/accounts/' + encodeURIComponent(req.params.accountUniqueName) + '/xls-imports';
  return settings.client.get(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

// get eledger transactions
router.get('/:accountUniqueName/eledgers', function(req, res) {
  let authHead = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName +
      '/accounts/' + encodeURIComponent(req.params.accountUniqueName) + '/eledgers';
  return settings.client.get(hUrl, authHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

// trash eLedger transaction
router.delete('/:accountUniqueName/eledgers/:transactionId', function(req, res) {
  let authHead = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  let hUrl = settings.envUrl + 'eledgers/' + req.params.transactionId;
  return settings.client.delete(hUrl, authHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

// mail ledger 
router.post('/:accountUniqueName/mail-ledger', function(req, res) {
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    },
    parameters: {
      to: req.query.toDate,
      from: req.query.fromDate,
      format: req.query.format
    },
    data: req.body
  };

  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName +
      '/accounts/' + encodeURIComponent(req.params.accountUniqueName) + '/mail-ledger';
  return settings.client.post(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

// get invoices
router.get('/:accountUniqueName/invoices', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName +
      '/accounts/' + encodeURIComponent(req.params.accountUniqueName) + '/invoices';
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    },
    parameters: {
      to: req.query.toDate,
      from: req.query.fromDate
    }
  };
  return settings.client.get(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

// preview Invoice
router.post('/:accountUniqueName/invoices/preview', function(req, res) {
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    },
    data: req.body
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName+'/accounts/' + encodeURIComponent(req.params.accountUniqueName) + '/invoices/preview';
  return settings.client.post(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

// Generate Invoice
router.post('/:accountUniqueName/invoices/generate', function(req, res) {
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    },
    data: req.body
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName+'/accounts/' + encodeURIComponent(req.params.accountUniqueName) + '/invoices/generate';
  return settings.client.post(hUrl, args, function(data, response) {
    // console.log data
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});


// Download Invoice
router.post('/:accountUniqueName/invoices/download', function(req, res) {
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    },
    data: req.body
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName+'/accounts/' + encodeURIComponent(req.params.accountUniqueName) + '/invoices/download';
  return settings.client.post(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

// preview of generated invoice
router.get('/:accountUniqueName/invoices/:invoiceUniqueID/preview', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName +
      '/accounts/' + encodeURIComponent(req.params.accountUniqueName) + '/invoices/'+req.params.invoiceUniqueID+'/preview';
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

// Sent Invoice by email
router.post('/:accountUniqueName/invoices/mail', function(req, res) {
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    },
    data: req.body
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName+'/accounts/' + encodeURIComponent(req.params.accountUniqueName) + '/invoices/mail';
  return settings.client.post(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

// generate magic link
router.post('/:accountUniqueName/magic-link', function(req, res) {
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    },
    parameters: {
      to: req.query.to,
      from: req.query.from
    }
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName +
      '/accounts/' + encodeURIComponent(req.params.accountUniqueName) + '/magic-link';
  return settings.client.post(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.get('/:accountUniqueName/tax-hierarchy', function(req, res) {
  let hUrl = settings.envUrl + 'company/'+req.params.companyUniqueName + '/accounts/'+ encodeURIComponent(req.params.accountUniqueName) + '/tax-hierarchy';
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


export default router;