import settings from '../util/settings';
let app = settings.express();
let router = settings.express.Router();

let env = app.get('env');

let hitViaSocket = function(data) {
  data = JSON.stringify(data);
  data.environment = app.get('env');
  if ((env === "PRODUCTION") || (env === "production")) {
    return settings.request({
      url: 'https://viasocket.com/t/JUXDVNwBZ6dgPacX9zT/giddh-giddh-new-company?authkey=MbK1oT6x1RCoVf2AqL3y',
      qs: {
        from: 'Giddh',
        time: +new Date
      },
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Auth-Key': 'MbK1oT6x1RCoVf2AqL3y'
      },
      body: data
    }, function(error, response, body) {
      if (error) {
        console.log(error);
      } else {
        console.log(response.statusCode, body, 'from viasocket');
      }
    });
  } else {
    return console.log("not hitting via socket because we are in ", env);
  }
};

router.get('/all', function(req, res) {
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  let hUrl = settings.envUrl + 'users/' + req.session.name + '/companies';
  return settings.client.get(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

//delete company
router.delete('/:uniqueName', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.uniqueName;
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  return settings.client.delete(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

//update company
router.put('/:uniqueName', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.uniqueName;
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

router.get('/:uniqueName/imports', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.uniqueName+ '/imports';
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

router.get('/:companyUniqueName/users', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName+ '/users';
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

router.post('/', function(req, res) {
  let hUrl = settings.envUrl + 'company/';
  req.body.uniqueName = settings.stringUtil.getRandomString(req.body.name, req.body.city);
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
    } else {
      hitViaSocket(data);
    }
    return res.send(data);
  });
});

//get all Roles
router.get('/:uniqueName/shareable-roles', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.uniqueName + '/shareable-roles';
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  return settings.client.get(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      return res.status(response.statusCode).send(data);
    } else {
      return res.send(data);
    }
  });
});

//get company Shared user list
router.get('/:uniqueName/shared-with', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.uniqueName + '/shared-with';
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  return settings.client.get(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      return res.status(response.statusCode).send(data);
    } else {
      return res.send(data);
    }
  });
});

//share company with user
router.put('/:uniqueName/share', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.uniqueName + '/share';
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
      return res.status(response.statusCode).send(data);
    } else {
      return res.send(data);
    }
  });
});

//unShare company with user
router.put('/:uniqueName/unshare', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.uniqueName + '/unshare';
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
      return res.status(response.statusCode).send(data);
    } else {
      return res.send(data);
    }
  });
});

//get company transaction list
router.get('/:uniqueName/transactions', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.uniqueName + '/transactions';
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    },
    parameters: {
      page: req.query.page
    }
  };
  return settings.client.get(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      return res.status(response.statusCode).send(data);
    } else {
      return res.send(data);
    }
  });
});

//update company subscription
router.put('/:uniqueName/subscription-update', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.uniqueName + '/subscription-update';
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

//pay bill via wallet
router.post('/:uniqueName/pay-via-wallet', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.uniqueName + '/pay-via-wallet';
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

// verify MFA
router.post('/:companyUniqueName/ebanks/:ItemAccountId/verify-mfa', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/ebanks/'+req.params.ItemAccountId+'/verify-mfa';
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

//get added ebanks list
router.get('/:companyUniqueName/ebanks', function(req, res) {
  let authHead = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/ebanks';
  return settings.client.get(hUrl, authHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

//refresh added banks list
router.get('/:companyUniqueName/ebanks/refresh', function(req, res) {
  let authHead = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/ebanks/refresh';
  return settings.client.get(hUrl, authHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

//login to ebank

router.delete('/:companyUniqueName/ebanks/:memSiteAccId/remove', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/ebanks/' + req.params.memSiteAccId + '/remove';
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  return settings.client.delete(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.delete('/:companyUniqueName/ebanks/:ItemAccountId/unlink', function(req,res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/ebanks/' + req.params.ItemAccountId + '/unlink';
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  return settings.client.delete(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.post('/:companyUniqueName/ebanks', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/ebanks';
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

router.delete('/:companyUniqueName/ebanks/:ItemAccountId/:linkedAccount', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/ebanks/' + req.params.ItemAccountId + '/?linkedAccount=' + req.params.linkedAccount;
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    },
    data: req.body
  };
  return settings.client.delete(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});



router.put('/:companyUniqueName/ebanks/:ItemAccountId', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/ebanks/' + req.params.ItemAccountId;
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

router.put('/:companyUniqueName/ebanks/:ItemAccountId/eledgers/:date', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/ebanks/' + req.params.ItemAccountId + '/eledgers?from=' + req.params.date;
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

// retry upload tally xml master
router.put('/:uniqueName/retry', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.uniqueName+ '/imports/'+req.body.requestId+'/retry';
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  return settings.client.put(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

// switch user
//get audit logs
router.post('/:companyUniqueName/logs/:page', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/logs' + '?page=' + req.params.page;
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
      return res.status(response.statusCode).send(data);
    } else {
      return res.send(data);
    }
  });
});

//refresh-token
router.get('/:companyUniqueName/login/:loginId/token/refresh', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/login/' + req.params.loginId + '/token/refresh';
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

//refresh-token
router.get('/:companyUniqueName/login/:loginId/token/reconnect', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/login/' + req.params.loginId + '/token/reconnect';
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


//delete audit logs
router.delete('/:companyUniqueName/logs/:beforeDate', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/logs?beforeDate=' + req.params.beforeDate;
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    },
    data: req.body
  };
  return settings.client.delete(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.get('/:uniqueName/switchUser', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.uniqueName;
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  return settings.client.patch(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});


// get taxes
router.get('/:companyUniqueName/tax', function(req, res) {
  let authHead = {
    headers: {
      'Auth-Key': req.session.authKey,
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/tax';
  return settings.client.get(hUrl, authHead, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

// add taxes
router.post('/:companyUniqueName/tax', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/tax?updateEntries=' + req.body.updateEntries;
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

// delete tax
router.delete('/:companyUniqueName/tax/:taxUniqueName', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/tax/' + req.params.taxUniqueName;
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  return settings.client.delete(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

//edit/update taxe
router.put('/:companyUniqueName/tax/:taxUniqueName/:updateEntries', function(req, res) {
  let hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/tax/' + req.params.taxUniqueName + '?updateEntries=' + req.params.updateEntries;
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


// get Invoice templates
router.get('/:uniqueName/templates', function(req, res) {
  let hUrl = settings.envUrl+'company/'+req.params.uniqueName+'/templates';
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
    
// set default template
router.put('/:uniqueName/templates/:tempUname', function(req, res) {
  let hUrl = settings.envUrl+'company/'+req.params.uniqueName+'/invoices/templates/'+req.params.tempUname;
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  return settings.client.put(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

// set template data
router.put('/:uniqueName/templates', function(req, res) {
  let hUrl = settings.envUrl+'company/'+req.params.uniqueName+'/templates';
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

// delete invoice
router.delete('/:uniqueName/invoices/:invoiceUniqueID', function(req, res) {
  let hUrl = settings.envUrl+'company/'+req.params.uniqueName+'/invoices/'+req.params.invoiceUniqueID;
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  return settings.client.delete(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});


// connect banks
router.get('/:uniqueName/ebanks/token', function(req, res) {
  let hUrl = settings.envUrl+'company/'+req.params.uniqueName+'/ebanks/token';
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

router.delete('/:companyUniqueName/login/:loginId',function(req,res) {
  let hUrl = settings.envUrl + 'company/'+req.params.companyUniqueName+'/login/'+req.params.loginId;
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  return settings.client.delete(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});


router.get('/:companyUniqueName/cropped-flatten-account', function(req,res) {
  let hUrl = settings.envUrl + 'company/'+req.params.companyUniqueName+'/cropped-flatten-accounts';
  if (req.query.query !== '') {
    hUrl = hUrl + '?q='+req.query.query;
  }
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

router.post('/:companyUniqueName/cropped-flatten-account', function(req,res) {
  let hUrl = settings.envUrl + 'company/'+req.params.companyUniqueName+'/cropped-flatten-accounts';
  if (req.query.query !== '') {
    hUrl = hUrl + '?q='+req.query.query;
  }
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  return settings.client.post(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.get('/:companyUniqueName/settings', function(req,res) {
  let hUrl = settings.envUrl + 'company/'+req.params.companyUniqueName + '/settings';
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

router.put('/:companyUniqueName/settings', function(req,res) {
  let hUrl = settings.envUrl + 'company/'+req.params.companyUniqueName + '/settings';
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

router.post('/:companyUniqueName/settings/webhooks', function(req,res) {
  let hUrl = settings.envUrl + 'company/'+req.params.companyUniqueName + '/settings/webhooks';
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

router.delete('/:companyUniqueName/settings/webhooks/:webhookUniqueName', function(req, res) {
  let hUrl = settings.envUrl + 'company/'+req.params.companyUniqueName + '/settings/webhooks/'+req.params.webhookUniqueName;
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  return settings.client.delete(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});


router.get('/:companyUniqueName/razorpay', function(req, res) {
  let hUrl = settings.envUrl + 'company/'+req.params.companyUniqueName + '/razorpay';
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


router.post('/:companyUniqueName/razorpay', function(req, res) {
  let hUrl = settings.envUrl + 'company/'+req.params.companyUniqueName + '/razorpay';
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

router.put('/:companyUniqueName/razorpay', function(req, res) {
  let hUrl = settings.envUrl + 'company/'+req.params.companyUniqueName + '/razorpay';
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

router.delete('/:companyUniqueName/razorpay', function(req, res) {
  let hUrl = settings.envUrl + 'company/'+req.params.companyUniqueName + '/razorpay';
  let args = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp
    }
  };
  return settings.client.delete(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

export default router;