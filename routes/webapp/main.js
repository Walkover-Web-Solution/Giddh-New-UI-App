let settings = require('../util/settings');
let router = settings.express.Router();

let dirName = settings.path.resolve(__dirname, '..', '..');

let options = {
  root: dirName + '/webapp/views',
  dotfiles: 'deny',
  headers: {
    'x-timestamp': Date.now(),
    'x-sent': true
  }
};



router.get('/app/*', function(req, res) {
  if (req.session.name !== undefined) {
    return res.sendFile('index.html', options);
  } else {
    return res.redirect('/login');
  }
});

router.get('/thanks', (req, res) => res.sendFile('thanks.html', options));

router.post('/logout', function(req, res) {
  req.session.destroy();
  return res.json({status: 'success'});
});


module.exports = router;
