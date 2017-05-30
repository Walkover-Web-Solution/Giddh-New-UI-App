(function() {
  var dirName, hitViaSocket, options, panelOption, requestIp, router, settings;

  settings = require('../util/settings');

  requestIp = require('request-ip');

  router = settings.express.Router();

  dirName = settings.path.resolve(__dirname, '..', '..');

  options = {
    root: dirName + '/website/views',
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  };

  panelOption = {
    root: dirName + '/adminPanel',
    dotFiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  };

  router.get('/sindhu', function(req, res) {
    return res.sendFile('admin-panel.html', panelOption);
  });

  router.get('/', function(req, res) {
    return res.sendFile('index.html', options);
  });

  router.get('/index', function(req, res) {
    return res.sendFile('index.html', options);
  });

  router.get('/affiliate', function(req, res) {
    return res.sendFile('joinus.html', options);
  });

  router.get('/global', function(req, res) {
    return res.sendFile('global.html', options);
  });

  router.get('/gst', function(req, res) {
    return res.sendFile('gst.html', options);
  });

  router.get('/about', function(req, res) {
    return res.sendFile('about.html', options);
  });

  router.get('/beta', function(req, res) {
    return res.sendFile('beta.html', options);
  });

  router.get('/pricing', function(req, res) {
    return res.sendFile('pricing.html', options);
  });

  router.get('/privacy', function(req, res) {
    return res.sendFile('privacy.html', options);
  });

  router.get('/terms', function(req, res) {
    return res.sendFile('terms.html', options);
  });

  router.get('/login', function(req, res) {
    return res.sendFile('login.html', options);
  });

  router.get('/magic', function(req, res) {
    return res.sendFile('magic.html', options);
  });

  router.get('/payment', function(req, res) {
    return res.sendFile('payment.html', options);
  });

  router.get('/google87e474bb481dae55.html', function(req, res) {
    return res.sendFile('google87e474bb481dae55.html', options);
  });

  router.get('/sitemap.xml', function(req, res) {
    return res.sendFile('sitemap.xml', options);
  });

  router.get('/robots.txt', function(req, res) {
    return res.sendFile('robots.txt', options);
  });

  router.get('/success', function(req, res) {
    return res.sendFile('success.html', options);
  });

  router.get('/company/verify-email', function(req, res) {
    return res.sendFile('verifyEmail.html', options);
  });

  router.get('/refresh-completed', function(req, res) {
    return res.sendFile('refresh-completed.html', options);
  });

  router.get('/signup', function(req, res) {
    return res.sendFile('signup.html', options);
  });

  router.get('/IE', function(req, res) {
    return res.sendFile('incompatible-browser.html', options);
  });

  router.post('/magic-link', function(req, res) {
    var hUrl;
    if (req.body.data.from !== void 0 && req.body.data.to !== void 0) {
      hUrl = settings.envUrl + '/magic-link/' + req.body.data.id + '?from=' + req.body.data.from + '&to=' + req.body.data.to;
    } else {
      hUrl = settings.envUrl + '/magic-link/' + req.body.data.id;
    }
    return settings.client.get(hUrl, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.post('/magic-link/download-invoice', function(req, res) {
    var hUrl;
    hUrl = settings.envUrl + '/magic-link/' + req.body.data.id + '/download-invoice/' + req.body.data.invoiceNum;
    return settings.client.get(hUrl, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.put('/ebanks/login', function(req, res) {
    var hUrl;
    hUrl = settings.envUrl + '/ebanks/login/' + req.body.loginId;
    return settings.client.put(hUrl, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.post('/verify-email', function(req, res) {
    var data, hUrl;
    data = req.body;
    hUrl = settings.envUrl + '/company/' + data.companyUname + '/invoice-setting/verify-email?emailAddress=' + data.emailAddress + '&scope=' + data.scope;
    return settings.client.get(hUrl, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.sendFile('/public/webapp/views/index.html', options);
    });
  });

  router.post('/proforma/pay', function(req, res) {
    var args, data, hUrl;
    data = req.body;
    hUrl = settings.envUrl + 'company/' + data.companyUniqueName + '/proforma/' + data.uniqueName + '/pay';
    args = {
      headers: {
        "Content-Type": "application/json"
      },
      data: {
        "paymentId": data.paymentId
      }
    };
    return settings.client.post(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.post('/invoice/pay', function(req, res) {
    var args, data, hUrl;
    data = req.body;
    hUrl = settings.envUrl + 'company/' + data.companyUniqueName + '/invoices/' + data.uniqueName + '/pay';
    args = {
      headers: {
        "Content-Type": "application/json"
      },
      data: {
        "paymentId": data.paymentId
      }
    };
    return settings.client.post(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.post('/invoice-pay-request', function(req, res) {
    var hUrl;
    hUrl = settings.envUrl + 'invoice-pay-request/' + req.body.randomNumber;
    return settings.client.get(hUrl, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.post('/get-login-otp', function(req, res) {
    var args, data, hUrl;
    data = req.body;
    data.getGeneratedOTP = false;
    hUrl = "https://sendotp.msg91.com/api/generateOTP";
    args = {
      headers: {
        "Content-Type": "application/json",
        "application-Key": settings.getOtpKey
      },
      data: data
    };
    return settings.client.post(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.post('/verify-login-otp', function(req, res) {
    var args, data, hUrl;
    data = req.body;
    hUrl = "https://sendotp.msg91.com/api/verifyOTP";
    args = {
      headers: {
        "Content-Type": "application/json",
        "application-Key": settings.getOtpKey
      },
      data: data
    };
    return settings.client.post(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      }
      return res.send(data);
    });
  });

  router.post('/login-with-number', function(req, res) {
    var args, hUrl;
    hUrl = hUrl = settings.envUrl + 'login-with-number?' + "countryCode=" + req.body.countryCode + "&mobileNumber=" + req.body.mobileNumber;
    args = {
      headers: {
        "Content-Type": "application/json",
        "Access-Token": req.body.token
      }
    };
    return settings.client.get(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      } else {
        req.session.name = data.body.user.uniqueName;
        req.session.authKey = data.body.authKey;
      }
      return res.send(data);
    });
  });

  router.post('/signup-with-email', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'signup-with-email';
    args = {
      headers: {
        "Content-Type": "application/json",
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

  router.post('/verify-email-now', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + 'verify-email';
    args = {
      headers: {
        "Content-Type": "application/json",
        'X-Forwarded-For': res.locales.remoteIp
      },
      data: req.body
    };
    return settings.client.post(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      } else {
        req.session.name = data.body.user.uniqueName;
        req.session.authKey = data.body.authKey;
      }
      return res.send(data);
    });
  });

  router.post('/verify-number', function(req, res) {
    var args, hUrl;
    hUrl = settings.envUrl + '/verify-number';
    args = {
      headers: {
        "Content-Type": "application/json",
        'X-Forwarded-For': res.locales.remoteIp
      },
      data: req.body
    };
    return settings.client.post(hUrl, args, function(data, response) {
      if (data.status === 'error' || data.status === void 0) {
        res.status(response.statusCode);
      } else {
        req.session.name = data.body.user.uniqueName;
        req.session.authKey = data.body.authKey;
      }
      return res.send(data);
    });
  });

  router.get('/contact/submitDetails', function(req, res) {
    var geo, ip;
    ip = requestIp.getClientIp(req);
    geo = settings.geoIp.lookup(ip);
    if (geo !== null && geo.country !== 'IN') {
      return res.redirect(301, 'https://giddh.com');
    } else {
      return res.redirect(301, 'https://giddh.com');
    }
  });

  hitViaSocket = function(data) {
    data = JSON.stringify(data);
    data.environment = app.get('env');
    if (data.isNewUser) {
      return settings.request({
        url: 'https://viasocket.com/t/fDR1TMJLvMQgwyjBUMVs/giddh-giddh-login?authkey=MbK1oT6x1RCoVf2AqL3y',
        qs: {
          from: 'Giddh',
          time: +(new Date)
        },
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Auth-Key': 'MbK1oT6x1RCoVf2AqL3y'
        },
        body: data.user
      }, function(error, response, body) {
        if (error) {
          console.log(error);
        } else {
          console.log(response.statusCode, body, 'from viasocket');
        }
      });
    }
  };

  router.post('/global-user', function(req, res) {
    var data;
    data = req.body;
    hitViaSocket(data);
    return res.status(200).send('success');
  });

  router.get('/user-location', function(req, res) {
    var geo, ip;
    ip = requestIp.getClientIp(req);
    geo = settings.geoIp.lookup(ip);
    if (geo !== null) {
      return res.send(geo);
    } else {
      res.status(404);
      return res.send('unable to retrieve location');
    }
  });

  router.get('/global', function(req, res) {
    return res.sendFile('global.html', options);
  });

  module.exports = router;

}).call(this);
