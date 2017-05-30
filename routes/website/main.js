import settings from '../util/settings';
import requestIp from 'request-ip';
let router = settings.express.Router();

let dirName = settings.path.resolve(__dirname, '..', '..');
let options = {
  root: dirName + '/website/views',
  dotfiles: 'deny',
  headers: {
    'x-timestamp': Date.now(),
    'x-sent': true
  }
};


let panelOption = {
  root: dirName + '/adminPanel',
  dotFiles: 'deny',
  headers: {
    'x-timestamp': Date.now(),
    'x-sent': true
  }
};

router.get('/sindhu', (req,res) => res.sendFile('admin-panel.html', panelOption));

// router.get '/sindhu/panel', (req, res) ->
//   res.sendFile 'sindhu.html', panelOption

router.get('/', (req, res) => res.sendFile('index.html', options));


router.get('/index', (req, res) => res.sendFile('index.html', options));

router.get('/affiliate', (req,res) => res.sendFile('joinus.html', options));

router.get('/global', (req,res) => res.sendFile('global.html', options));

router.get('/gst', (req,res) => res.sendFile('gst.html', options));

router.get('/about', (req, res) => res.sendFile('about.html', options));

router.get('/beta', (req, res) => res.sendFile('beta.html', options));

router.get('/pricing', (req, res) => res.sendFile('pricing.html', options));

router.get('/privacy', (req, res) => res.sendFile('privacy.html', options));

router.get('/terms', (req, res) => res.sendFile('terms.html', options));

router.get('/login', (req, res) => res.sendFile('login.html', options));

router.get('/magic', (req, res) => res.sendFile('magic.html', options));

router.get('/payment', (req, res) => res.sendFile('payment.html', options));

router.get('/google87e474bb481dae55.html',(req, res) => res.sendFile('google87e474bb481dae55.html', options));

router.get('/sitemap.xml', (req, res) => res.sendFile('sitemap.xml', options));

router.get('/robots.txt', (req, res) => res.sendFile('robots.txt', options));

router.get('/success', (req, res) => res.sendFile('success.html', options));

router.get('/company/verify-email', (req, res) => res.sendFile('verifyEmail.html', options));

router.get('/refresh-completed', (req, res) => res.sendFile('refresh-completed.html', options));

router.get('/signup', (req, res) => res.sendFile('signup.html', options));

router.get('/IE', (req, res) => res.sendFile('incompatible-browser.html', options));

router.post('/magic-link', function(req, res) {
  let hUrl;
  if ((req.body.data.from !== undefined) && (req.body.data.to !== undefined)) {
    hUrl = settings.envUrl + '/magic-link/' + req.body.data.id + '?from=' + req.body.data.from + '&to=' + req.body.data.to;
  } else {
    hUrl = settings.envUrl + '/magic-link/' + req.body.data.id;
  }
  return settings.client.get(hUrl, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.post('/magic-link/download-invoice', function(req, res) {
  let hUrl = settings.envUrl + '/magic-link/' + req.body.data.id + '/download-invoice/' + req.body.data.invoiceNum;
  return settings.client.get(hUrl, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.put('/ebanks/login', function(req, res) {
  let hUrl = settings.envUrl + '/ebanks/login/' + req.body.loginId;
  return settings.client.put(hUrl, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.post('/verify-email', function(req, res) {
  let data = req.body;
  let hUrl = settings.envUrl + '/company/'+data.companyUname+'/invoice-setting/verify-email?emailAddress='+data.emailAddress+'&scope='+data.scope;
  return settings.client.get(hUrl, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.sendFile('/public/webapp/views/index.html',options);
  });
});

router.post('/proforma/pay', function(req, res) {
  let data = req.body;
  let hUrl = settings.envUrl + 'company/' + data.companyUniqueName+'/proforma/' + data.uniqueName + '/pay';
  let args = {
    headers: {
      "Content-Type": "application/json"
    },
    data: {
      "paymentId" : data.paymentId
    }
  };
  return settings.client.post(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.post('/invoice/pay', function(req, res) {
  let data = req.body;
  let hUrl = settings.envUrl + 'company/'+data.companyUniqueName+'/invoices/'+data.uniqueName+'/pay';
  let args = {
    headers: {
      "Content-Type": "application/json"
    },
    data: {
      "paymentId" : data.paymentId
    }
  };
  return settings.client.post(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.post('/invoice-pay-request', function(req, res) {
  let hUrl = settings.envUrl + 'invoice-pay-request/'+req.body.randomNumber;
  return settings.client.get(hUrl, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.post('/get-login-otp', function(req, res) {
  let data = req.body;
  data.getGeneratedOTP = false;
  let hUrl = "https://sendotp.msg91.com/api/generateOTP";
  let args = {
    headers: {
      "Content-Type": "application/json",
      "application-Key" : settings.getOtpKey
    },
    data
  };
  return settings.client.post(hUrl,args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.post('/verify-login-otp', function(req, res) {
  let data = req.body;
  let hUrl = "https://sendotp.msg91.com/api/verifyOTP";
  let args = {
    headers: {
      "Content-Type": "application/json",
      "application-Key" : settings.getOtpKey
    },
    data
  };
  return settings.client.post(hUrl,args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.post('/login-with-number', function(req, res) {
  var hUrl = (hUrl = settings.envUrl + 'login-with-number?' + "countryCode=" + req.body.countryCode + "&mobileNumber=" + req.body.mobileNumber);
  let args = {
    headers: {
      "Content-Type": "application/json",
      "Access-Token" : req.body.token
    }
  };
  return settings.client.get(hUrl,args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    } else {
      req.session.name = data.body.user.uniqueName;
      req.session.authKey = data.body.authKey;
    }
    return res.send(data);
  });
});

router.post('/signup-with-email', function(req, res) {
  let hUrl = settings.envUrl + 'signup-with-email';
  let args = {
    headers: {
      "Content-Type": "application/json",
      'X-Forwarded-For': res.locales.remoteIp
    },
    data:req.body
  };
  return settings.client.post(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

router.post('/verify-email-now', function(req, res) {
  let hUrl = settings.envUrl + 'verify-email';
  let args = {
    headers: {
      "Content-Type": "application/json",
      'X-Forwarded-For': res.locales.remoteIp
    },
    data:req.body
  };
  return settings.client.post(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    } else {
      req.session.name = data.body.user.uniqueName;
      req.session.authKey = data.body.authKey;
    }
    return res.send(data);
  });
});

router.post('/verify-number', function(req, res) {
  let hUrl = settings.envUrl + '/verify-number';
  let args = {
    headers: {
      "Content-Type": "application/json",
      'X-Forwarded-For': res.locales.remoteIp
    },
    data:req.body
  };
  return settings.client.post(hUrl, args, function(data, response) {
    if ((data.status === 'error') || (data.status === undefined)) {
      res.status(response.statusCode);
    } else {
      req.session.name = data.body.user.uniqueName;
      req.session.authKey = data.body.authKey;
    }
    return res.send(data);
  });
});


router.get('/contact/submitDetails', function(req, res) {
  let ip = requestIp.getClientIp(req);
  let geo = settings.geoIp.lookup(ip);
  if ((geo !== null) && (geo.country !== 'IN')) {
    return res.redirect(301, 'https://giddh.com');
  } else {
    return res.redirect(301, 'https://giddh.com');
  }
});



let hitViaSocket = function(data) {
  data = JSON.stringify(data);
  data.environment = app.get('env');
  if (data.isNewUser) {
    return settings.request({
      url: 'https://viasocket.com/t/fDR1TMJLvMQgwyjBUMVs/giddh-giddh-login?authkey=MbK1oT6x1RCoVf2AqL3y',
      qs: {
        from: 'Giddh',
        time: +new Date
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
  let data = req.body;
  hitViaSocket(data);
  return res.status(200).send('success');
});

router.get('/user-location', function(req, res) {
  let ip = requestIp.getClientIp(req);
  let geo = settings.geoIp.lookup(ip);
  if (geo !== null) {
    return res.send(geo);
  } else {
    res.status(404);
    return res.send('unable to retrieve location');
  }
});

router.get('/global', (req, res) => res.sendFile('global.html', options));

export default router;
