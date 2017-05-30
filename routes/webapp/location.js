import settings from '../util/settings';
let router = settings.express.Router();

router.get('/search', function(req, res) {
  let googleApi = 'http://maps.googleapis.com/maps/api/geocode/json?';
  if (req.query.country !== undefined) {
    googleApi = googleApi + 'address=' + req.query.queryString + '&components=country:' + req.query.country + '|administrative_area:' + req.query.queryString;
  } else if (req.query.administrator_level !== undefined) {
    googleApi = googleApi + 'address=' + req.query.queryString + '&components=administrative_area:' + req.query.administrator_level;
  } else if (req.query.onlyCity) {
    googleApi = googleApi + 'address=' + req.query.queryString;
  } else {
    googleApi = googleApi + 'components=country:' + req.query.queryString;
  }
  return settings.request.get(googleApi, (err, response) => res.send(response.body));
});

export default router;