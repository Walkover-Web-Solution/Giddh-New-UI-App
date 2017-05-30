(function() {
  var router, settings;

  settings = require('../util/settings');

  router = settings.express.Router();

  router.get('/search', function(req, res) {
    var googleApi;
    googleApi = 'http://maps.googleapis.com/maps/api/geocode/json?';
    if (req.query.country !== void 0) {
      googleApi = googleApi + 'address=' + req.query.queryString + '&components=country:' + req.query.country + '|administrative_area:' + req.query.queryString;
    } else if (req.query.administrator_level !== void 0) {
      googleApi = googleApi + 'address=' + req.query.queryString + '&components=administrative_area:' + req.query.administrator_level;
    } else if (req.query.onlyCity) {
      googleApi = googleApi + 'address=' + req.query.queryString;
    } else {
      googleApi = googleApi + 'components=country:' + req.query.queryString;
    }
    return settings.request.get(googleApi, function(err, response) {
      return res.send(response.body);
    });
  });

  module.exports = router;

}).call(this);
