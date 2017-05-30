import * as path from 'path'
import * as express from 'express'
import * as webpack from 'webpack'
import * as webpackMiddleware from 'webpackMiddleware'
import * as webpackHotMiddleware from 'webpackHotMiddleware'
import * as config from '../config/webpack.config'


const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 8000 : process.env.PORT;
// require('newrelic');
// comment it while developement
import * as settings from '../routes/util/settings';
import * as favicon from 'serve-favicon';

import * as logger from 'morgan';

import * as cookieParser from 'cookie-parser';

import * as bodyParser from 'body-parser';


import * as session from 'express-session';

import * as engines from 'consolidate';

import * as requestIp from 'request-ip';

import * as multer from 'multer';

const app = settings.express();

app.disable('x-powered-by');

// let port = process.env.PORT || 8000;
// enabling cors
// app.use(cors())


// set engine
app.set('public', `${__dirname}/public/`);
app.engine('html', engines.mustache);
app.set('view engine', 'html');

app.use(favicon(`${__dirname}/app/website/images/favicon.ico`));

app.use(logger('dev'));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(settings.express.static(settings.path.join(__dirname, 'public')));
app.use('/app/bower_components', settings.express.static(`${__dirname}/bower_components`));
app.use('/bower_components', settings.express.static(`${__dirname}/bower_components`));
app.use('/node_modules', settings.express.static(`${__dirname}/node_modules`));
app.use('/public', settings.express.static(`${__dirname}/public`));

// set ttl for session expiry, format : milliseconds * seconds * minutes
const sessionTTL = 1000 * 60 * 30;
// if (app.get('env') === 'development') {
//   // one hour
//   sessionTTL = 1000 * 60 * 60
// }
// else{
//   // ten minutes
//   sessionTTL = 1000 * 60 * 60
// }

app.use(session({
  secret: 'keyboardcat',
  name: 'userAuth',
  resave: true,
  saveUninitialized: true,
  cookie: {
    path: '/',
    secure: false,
    maxAge: sessionTTL,
    domain: 'giddh.com',
    httpOnly: false,
  },

  // ,store: new MongoStore({
  //   url: settings.mongoUrl,
  //   autoRemove: 'interval',
  //   autoRemoveInterval: sessionTTL,
  //   ttl: sessionTTL,
  //   touchAfter: sessionTTL - 300
  // })
  // store   : new MemcachedStore({
  //   hosts: ['127.0.0.1:11211'],
  //   secret: 'keyboardcat'
  // })
}));

// some global letiables
global.clientIp = '';
app.use((req, res, next) => {
  clientIp = requestIp.getClientIp(req);
  res.locales = {
    siteTitle: 'Giddh ~ Accounting at its Rough!',
    author: 'The Mechanic',
    description: 'Giddh App description',
    remoteIp: requestIp.getClientIp(req),
  };
  req.session._garbage = Date();
  req.session.touch();
  next();
});

// to allow cookie sharing across subdomains
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, authorization');
  next();
});

// do not remove code from this position
import * as login from '../routes/website/login';
import * as contact from '../routes/website/contact';
import * as websiteRoutes from '../routes/website/main';

app.use('/app/auth', login);
app.use('/contact', contact);
app.use('/app/api', websiteRoutes);

global.mStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './uploads/');
  },
  filename(req, file, cb) {
    switch (file.mimetype) {
      case 'image/*' :
        cb(null, file.originalname);
        break;
      case 'application/vnd.ms-excel' :
        cb(null, `${Date.now()}.xls`);
        break;
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' :
        cb(null, `${Date.now()}.xlsx`);
        break;
      default:
        cb(null, file.originalname);
    }
    // if (file.mimetype === "application/vnd.ms-excel"){
    //   cb(null, Date.now() + '.xls')
    // }
    // else if (file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
    //   cb(null, Date.now() + '.xlsx')
    // }
    // else{
    //   cb(null, Date.now() + '.xml')
    // }
  },
});


// disable browser cache
app.use((req, res, next) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
});


const parseUploads = multer({ storage: mStorage }).single('file');

import * as currency from '../routes/webapp/currency';
import * as location from '../routes/webapp/location';
import * as company from '../routes/webapp/company';
import * as groups from '../routes/webapp/groups';
import * as accounts from '../routes/webapp/accounts';
import * as ledgers from '../routes/webapp/ledgers';
import * as appRoutes from '../routes/webapp/main';
import * as users from '../routes/webapp/users';
import * as roles from '../routes/webapp/roles';
import * as trialBalance from '../routes/webapp/trialBal';
import * as balanceSheet from '../routes/webapp/balancesheet';
import * as upload from '../routes/webapp/upload';
import * as profitLoss from '../routes/webapp/profitLoss';
import * as reports from '../routes/webapp/reports';
import * as coupon from '../routes/webapp/coupon';
import * as yodlee from '../routes/webapp/yodlee';
import * as ebanks from '../routes/webapp/ebanks';
import * as magicLink from '../routes/webapp/magic';
import * as timetest from '../routes/webapp/timetest';
import * as invoice from '../routes/webapp/invoices';
import * as templates from '../routes/webapp/templates';
import * as proforma from '../routes/webapp/proformas';
import * as placeholders from '../routes/webapp/placeholders';
import * as inventory from '../routes/webapp/inventory';
import * as adminPanel from '../routes/adminPanel/adminPanel';
import * as recEntry from '../routes/webapp/recurringEntry';
import * as invoiceUpload from '../routes/webapp/invoiceUpload';
import * as stateDetails from '../routes/webapp/stateDetails';

app.use('/time-test', timetest);
app.use('/currency', currency);
app.use('/users', users);
app.use('/roles', roles);
app.use('/location', location);
app.use('/company', company);
app.use('/app/company/:companyUniqueName/placeholders', placeholders);
app.use('/company/:companyUniqueName/invoices', invoice);
app.use('/company/:companyUniqueName/proforma', proforma);
app.use('/company/:companyUniqueName/groups', groups);
app.use('/company/:companyUniqueName/accounts', accounts);
app.use('/company/:companyUniqueName/accounts/:accountUniqueName/ledgers', ledgers);
app.use('/company/:companyUniqueName/trial-balance', trialBalance);
app.use('/company/:companyUniqueName/balance-sheet', balanceSheet);
app.use('/upload-invoice', parseUploads, invoiceUpload);
app.use('/upload', parseUploads, upload);
app.use('/', appRoutes);
app.use('/company/:companyUniqueName/stock-group', inventory);
app.use('/company/:companyUniqueName/profit-loss', profitLoss);
app.use('/company/:companyUniqueName/templates', templates);
app.use('/company/:companyUniqueName/recurring-entry', recEntry);
app.use('/company/:companyUniqueName', reports);
app.use('/coupon', coupon);
app.use('/yodlee', yodlee);
app.use('/ebanks', ebanks);
app.use('/admin', adminPanel);
app.use('/state-details', stateDetails);
app.use('/magic-link', magicLink);


// delete user session on logout
app.use('/logout', (req, res) => {
  if (req.session.name) {
    delete req.session;
    res.redirect('https://giddh.com');
    // res.status(200).send({message:'user logged out'})
  } else {
    res.status(403).send({ message: 'user not found' });
  }
});

// return user-details
app.use('/fetch-user', (req, res) => {
  const authHead = {
    headers: {
      'Auth-Key': req.session.authKey,
      'Content-Type': 'application/json',
      'X-Forwarded-For': res.locales.remoteIp,
    },
  };
  const hUrl = `${settings.envUrl}users/${req.session.name}`;
  return settings.client.get(hUrl, authHead, (data, response) => {
    if (data.status === 'error' || data.status === void 0) {
      res.status(response.statusCode);
    }
    return res.send(data);
  });
});

// serve magic-link page
app.use('/magic', (req, res) => {
  res.sendFile(`${__dirname}/public/website/views/magic.html`);
});

// get user auth key
app.get('/userak', (req, res) => {
  if (req.session.name) {
    res.send(req.session.authKey);
  } else {
    res.status(403);
    res.send('Invalid User');
  }
});

// get session id and match with existing session
const getSession = function (req, res, next) {
  const sessionId = req.query.sId;
  req.sessionStore.get(sessionId, (err, session) => {
    if (session) {
          // createSession() re-assigns req.session
      req.sessionStore.createSession(req, session);
    }
    next();
  });
};

// serve index.html, this has to come after *ALL* routes are defined
app.use('/', getSession, (req, res) => {
  if (req.session.name) {
    res.sendFile(`${__dirname}/public/webapp/views/index.html`);
  } else {
    res.status(404);
    res.redirect('https://www.giddh.com');
  }
});


/*
 # set all route above this snippet
 # redirecting to 404 if page/route not found
*/
app.use(redirectUnmatched);
function redirectUnmatched(req, res) {
  const options = {
    root: `${__dirname}/public/website/views`,
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true,
    },
  };
  res.sendFile('404.html', options);
}

if (isDeveloping) {
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false,
    },
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  app.get('*', (req, res) => {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, '/../dist/index.html')));
    res.end();
  });
} else {
  app.use(express.static(path.join(__dirname, '/../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });
}

app.listen(port, (err) => {
  if (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
  // eslint-disable-next-line no-console
  console.info(`Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`);
});

app.use((req, res, next) => {
  const err = new Error('Page Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    const filePath = `${__dirname}/public/website/views/error`;
    res.render(filePath, {
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  console.log(err, 'error');
  res.status(err.status || 500);
  const filePath = `${__dirname}/public/website/views/error`;
  res.render(filePath, {
    message: err.message,
    error: {},
  });
});


module.exports = app;
