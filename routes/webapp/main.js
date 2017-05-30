(function() {
  var dirName, options, router, settings;

  settings = require('../util/settings');

  router = settings.express.Router();

  dirName = settings.path.resolve(__dirname, '..', '..');

  options = {
    root: dirName + '/webapp/views',
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  };

  router.get('/app/*', function(req, res) {
    if (req.session.name !== void 0) {
      return res.sendFile('index.html', options);
    } else {
      return res.redirect('/login');
    }
  });

  router.get('/thanks', function(req, res) {
    return res.sendFile('thanks.html', options);
  });

  router.post('/logout', function(req, res) {
    req.session.destroy();
    return res.json({
      status: 'success'
    });
  });

  module.exports = router;

}).call(this);
