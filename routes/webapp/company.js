(function() {
  var app, env, hitViaSocket, router, settings;

  settings = require('../util/settings');

  app = settings.express();

  router = settings.express.Router();

  env = app.get('env');

  hitViaSocket = function(data) {
    data = JSON.stringify(data);
    data.environment = app.get('env');
    if (env === "PRODUCTION" || env === "production") {
      return settings.request({
        url: 'https://viasocket.com/t/JUXDVNwBZ6dgPacX9zT/giddh-giddh-new-company?authkey=MbK1oT6x1RCoVf2AqL3y',
        qs: {
          from: 'Giddh',
          time: +(new Date)
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
    var args, hUrl;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'X-Forwarded-For': res.locales.remoteIp
      }
    };
    hUrl = settings.envUrl + 'users/' + req.session.name + '/companies';
    return settings.client.get(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router["delete"]('/:uniqueName', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.uniqueName;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      }
    };
    return settings.client["delete"](hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.put('/:uniqueName', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.uniqueName;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      },
      data: req.body
    };
    return settings.client.put(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.get('/:uniqueName/imports', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.uniqueName + '/imports';
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      }
    };
    return settings.client.get(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.get('/:companyUniqueName/users', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/users';
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      }
    };
    return settings.client.get(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.post('/', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/';
    req.body.uniqueName = settings.stringUtil.getRandomString(req.body.name, req.body.city);
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      },
      data: req.body
    };
    return settings.client.post(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      } else {
        hitViaSocket(data);
      }
      return res.send(data);
    });
  });

  router.get('/:uniqueName/shareable-roles', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.uniqueName + '/shareable-roles';
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      }
    };
    return settings.client.get(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        return res.status(response.statusCode).send(data);
      } else {
        return res.send(data);
      }
    });
  });

  router.get('/:uniqueName/shared-with', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.uniqueName + '/shared-with';
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      }
    };
    return settings.client.get(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        return res.status(response.statusCode).send(data);
      } else {
        return res.send(data);
      }
    });
  });

  router.put('/:uniqueName/share', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.uniqueName + '/share';
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      },
      data: req.body
    };
    return settings.client.put(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        return res.status(response.statusCode).send(data);
      } else {
        return res.send(data);
      }
    });
  });

  router.put('/:uniqueName/unshare', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.uniqueName + '/unshare';
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      },
      data: req.body
    };
    return settings.client.put(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        return res.status(response.statusCode).send(data);
      } else {
        return res.send(data);
      }
    });
  });

  router.get('/:uniqueName/transactions', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.uniqueName + '/transactions';
    args = {
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
      if (data.status === 'error' || data.status === void 0) {
        return res.status(response.statusCode).send(data);
      } else {
        return res.send(data);
      }
    });
  });

  router.put('/:uniqueName/subscription-update', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.uniqueName + '/subscription-update';
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      },
      data: req.body
    };
    return settings.client.put(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.post('/:uniqueName/pay-via-wallet', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.uniqueName + '/pay-via-wallet';
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      },
      data: req.body
    };
    return settings.client.post(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.post('/:companyUniqueName/ebanks/:ItemAccountId/verify-mfa', function(req, res) {
    var authHead, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/ebanks/' + req.params.ItemAccountId + '/verify-mfa';
    authHead = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      },
      data: req.body
    };
    return settings.client.post(hUrl, authHead, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.get('/:companyUniqueName/ebanks', function(req, res) {
    var authHead, hUrl;
    authHead = {
      headers: {
        'Auth-Key': req.session.authKey,
        'X-Forwarded-For': res.locales.remoteIp
      }
    };
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/ebanks';
    return settings.client.get(hUrl, authHead, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.get('/:companyUniqueName/ebanks/refresh', function(req, res) {
    var authHead, hUrl;
    authHead = {
      headers: {
        'Auth-Key': req.session.authKey,
        'X-Forwarded-For': res.locales.remoteIp
      }
    };
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/ebanks/refresh';
    return settings.client.get(hUrl, authHead, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router["delete"]('/:companyUniqueName/ebanks/:memSiteAccId/remove', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/ebanks/' + req.params.memSiteAccId + '/remove';
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      }
    };
    return settings.client["delete"](hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router["delete"]('/:companyUniqueName/ebanks/:ItemAccountId/unlink', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/ebanks/' + req.params.ItemAccountId + '/unlink';
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      }
    };
    return settings.client["delete"](hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.post('/:companyUniqueName/ebanks', function(req, res) {
    var authHead, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/ebanks';
    authHead = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      },
      data: req.body
    };
    return settings.client.post(hUrl, authHead, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router["delete"]('/:companyUniqueName/ebanks/:ItemAccountId/:linkedAccount', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/ebanks/' + req.params.ItemAccountId + '/?linkedAccount=' + req.params.linkedAccount;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      },
      data: req.body
    };
    return settings.client["delete"](hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.put('/:companyUniqueName/ebanks/:ItemAccountId', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/ebanks/' + req.params.ItemAccountId;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      },
      data: req.body
    };
    return settings.client.put(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.put('/:companyUniqueName/ebanks/:ItemAccountId/eledgers/:date', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/ebanks/' + req.params.ItemAccountId + '/eledgers?from=' + req.params.date;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      },
      data: req.body
    };
    return settings.client.put(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.put('/:uniqueName/retry', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.uniqueName + '/imports/' + req.body.requestId + '/retry';
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      }
    };
    return settings.client.put(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.post('/:companyUniqueName/logs/:page', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/logs' + '?page=' + req.params.page;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      },
      data: req.body
    };
    return settings.client.post(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        return res.status(response.statusCode).send(data);
      } else {
        return res.send(data);
      }
    });
  });

  router.get('/:companyUniqueName/login/:loginId/token/refresh', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/login/' + req.params.loginId + '/token/refresh';
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      }
    };
    return settings.client.get(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.get('/:companyUniqueName/login/:loginId/token/reconnect', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/login/' + req.params.loginId + '/token/reconnect';
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      }
    };
    return settings.client.get(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router["delete"]('/:companyUniqueName/logs/:beforeDate', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/logs?beforeDate=' + req.params.beforeDate;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      },
      data: req.body
    };
    return settings.client["delete"](hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.get('/:uniqueName/switchUser', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.uniqueName;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      }
    };
    return settings.client.patch(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.get('/:companyUniqueName/tax', function(req, res) {
    var authHead, hUrl;
    authHead = {
      headers: {
        'Auth-Key': req.session.authKey,
        'X-Forwarded-For': res.locales.remoteIp
      }
    };
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/tax';
    return settings.client.get(hUrl, authHead, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.post('/:companyUniqueName/tax', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/tax?updateEntries=' + req.body.updateEntries;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      },
      data: req.body
    };
    return settings.client.post(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router["delete"]('/:companyUniqueName/tax/:taxUniqueName', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/tax/' + req.params.taxUniqueName;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      }
    };
    return settings.client["delete"](hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.put('/:companyUniqueName/tax/:taxUniqueName/:updateEntries', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/tax/' + req.params.taxUniqueName + '?updateEntries=' + req.params.updateEntries;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      },
      data: req.body
    };
    return settings.client.put(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.get('/:uniqueName/templates', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.uniqueName + '/templates';
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      }
    };
    return settings.client.get(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.put('/:uniqueName/templates/:tempUname', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.uniqueName + '/invoices/templates/' + req.params.tempUname;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      }
    };
    return settings.client.put(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.put('/:uniqueName/templates', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.uniqueName + '/templates';
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      },
      data: req.body
    };
    return settings.client.put(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router["delete"]('/:uniqueName/invoices/:invoiceUniqueID', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.uniqueName + '/invoices/' + req.params.invoiceUniqueID;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      }
    };
    return settings.client["delete"](hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.get('/:uniqueName/ebanks/token', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.uniqueName + '/ebanks/token';
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      }
    };
    return settings.client.get(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router["delete"]('/:companyUniqueName/login/:loginId', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/login/' + req.params.loginId;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      }
    };
    return settings.client["delete"](hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.get('/:companyUniqueName/cropped-flatten-account', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/cropped-flatten-accounts';
    if (req.query.query !== '') {
      hUrl = hUrl + '?q=' + req.query.query;
    }
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      }
    };
    return settings.client.get(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.post('/:companyUniqueName/cropped-flatten-account', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/cropped-flatten-accounts';
    if (req.query.query !== '') {
      hUrl = hUrl + '?q=' + req.query.query;
    }
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      }
    };
    return settings.client.post(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.get('/:companyUniqueName/settings', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/settings';
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      }
    };
    return settings.client.get(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.put('/:companyUniqueName/settings', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/settings';
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      },
      data: req.body
    };
    return settings.client.put(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.post('/:companyUniqueName/settings/webhooks', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/settings/webhooks';
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      },
      data: req.body
    };
    return settings.client.post(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router["delete"]('/:companyUniqueName/settings/webhooks/:webhookUniqueName', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/settings/webhooks/' + req.params.webhookUniqueName;
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      }
    };
    return settings.client["delete"](hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.get('/:companyUniqueName/razorpay', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/razorpay';
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      }
    };
    return settings.client.get(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.post('/:companyUniqueName/razorpay', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/razorpay';
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      },
      data: req.body
    };
    return settings.client.post(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.put('/:companyUniqueName/razorpay', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/razorpay';
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      },
      data: req.body
    };
    return settings.client.put(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router["delete"]('/:companyUniqueName/razorpay', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'company/' + req.params.companyUniqueName + '/razorpay';
    args = {
      headers: {
        'Auth-Key': req.session.authKey,
        'Content-Type': 'application/json',
        'X-Forwarded-For': res.locales.remoteIp
      }
    };
    return settings.client["delete"](hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  module.exports = router;

}).call(this);
