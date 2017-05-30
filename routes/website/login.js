(function() {
  var app, googleLoginUrl, hitViaSocket, jwt, linkedinLoginUrl, qs, router, settings, twitterLoginUrl;

  settings = require('../util/settings');

  app = settings.express();

  jwt = require('jwt-simple');

  qs = require('qs');

  router = settings.express.Router();

  googleLoginUrl = settings.envUrl + 'signup-with-google';

  linkedinLoginUrl = settings.envUrl + 'signup-with-linkedIn';

  twitterLoginUrl = settings.envUrl + 'signup-with-twitter';

  hitViaSocket = function(data) {
    data.environment = app.get('env');
    data = JSON.stringify(data);
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


  /*
   |--------------------------------------------------------------------------
   | login with google
   |--------------------------------------------------------------------------
   */

  router.post('/google', function(req, res, next) {
    var googleAccessTokenUrl, params;
    googleAccessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
    params = {
      code: req.body.code,
      client_id: req.body.clientId,
      client_secret: settings.googleKey,
      redirect_uri: req.body.redirectUri,
      grant_type: 'authorization_code'
    };
    return settings.request.post(googleAccessTokenUrl, {
      json: true,
      form: params
    }, function(err, response, token) {
      var accessToken, args, userDetailObj;
      accessToken = token.access_token;
      userDetailObj = {};
      args = {
        headers: {
          'Content-Type': 'application/json',
          'Access-Token': accessToken
        }
      };
      return settings.client.get(googleLoginUrl, args, function(data, response) {
        if (data.status === 'error' || data.status === void 0) {
          res.status(response.statusCode);
        } else {
          if (data.body.authKey) {
            userDetailObj = data.body.user;
            req.session.name = data.body.user.uniqueName;
            req.session.authKey = data.body.authKey;
            data.body.sId = req.sessionID;
            hitViaSocket(data.body);
          }
        }
        return res.send({
          token: token,
          userDetails: userDetailObj,
          result: data
        });
      });
    });
  });


  /*
   |--------------------------------------------------------------------------
   | Login with Twitter
   |--------------------------------------------------------------------------
   */

  router.post('/twitter', function(req, res) {
    var accessTokenOauth, profileUrl, requestTokenOauth, requestTokenUrl, twitterAccessTokenUrl;
    requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
    twitterAccessTokenUrl = 'https://api.twitter.com/oauth/access_token';
    profileUrl = 'https://api.twitter.com/1.1/users/show.json?screen_name=';
    if (!req.body.oauth_token || !req.body.oauth_verifier) {
      requestTokenOauth = {
        consumer_key: settings.twitterKey,
        consumer_secret: settings.twitterSecret,
        callback: req.body.redirectUri
      };
      return settings.request.post({
        url: requestTokenUrl,
        oauth: requestTokenOauth
      }, function(err, response, body) {
        var oauthToken;
        oauthToken = qs.parse(body);
        return res.send(oauthToken);
      });
    } else {
      accessTokenOauth = {
        consumer_key: settings.twitterKey,
        consumer_secret: settings.twitterSecret,
        token: req.body.oauth_token,
        verifier: req.body.oauth_verifier
      };
      return settings.request.post({
        url: twitterAccessTokenUrl,
        oauth: accessTokenOauth
      }, function(err, response, accessToken) {
        var args, userDetailObj;
        accessToken = qs.parse(accessToken);
        userDetailObj = {};
        args = {
          headers: {
            'Content-Type': 'application/json',
            'Access-Token': accessToken.oauth_token,
            'Access-Secret': accessToken.oauth_token_secret
          }
        };
        return settings.client.get(twitterLoginUrl, args, function(data, response) {
          if (data.status === 'error' || data.status === void 0) {
            res.status(response.statusCode);
          } else {
            if (data.body.authKey) {
              userDetailObj = data.body.user;
              req.session.name = data.body.user.uniqueName;
              req.session.authKey = data.body.authKey;
              data.body.sId = req.sessionID;
            }
          }
          return res.send({
            token: accessToken.oauth_token,
            userDetails: userDetailObj,
            result: data
          });
        });
      });
    }
  });


  /*
   |--------------------------------------------------------------------------
   | Login with LinkedIn
   |--------------------------------------------------------------------------
   */

  router.post('/linkedin/callback', function(req, res) {
    return console.log(req, "callback");
  });

  router.post('/linkedin', function(req, res) {
    var linkedinAccessTokenUrl, params, peopleApiUrl;
    linkedinAccessTokenUrl = 'https://www.linkedin.com/uas/oauth2/accessToken';
    peopleApiUrl = 'https://api.linkedin.com/v1/people/~:(id,first-name,last-name,email-address,picture-url)';
    params = {
      code: req.body.code,
      client_id: req.body.clientId,
      client_secret: settings.linkedinSecret,
      redirect_uri: req.body.redirectUri,
      grant_type: 'authorization_code'
    };
    return settings.request.post(linkedinAccessTokenUrl, {
      form: params,
      json: true
    }, function(err, response, body) {
      var params;
      var args, userDetailObj;
      if (response.statusCode !== 200) {
        return res.status(response.statusCode).send({
          message: body.error_description
        });
      }
      userDetailObj = {};
      args = {
        headers: {
          'Content-Type': 'application/json',
          'Access-Token': body.access_token
        }
      };
      return settings.client.get(linkedinLoginUrl, args, function(data, response) {
        if (data.status === 'error' || data.status === void 0) {
          res.status(response.statusCode);
        } else {
          if (data.body.authKey) {
            userDetailObj = data.body.user;
            req.session.name = data.body.user.uniqueName;
            req.session.authKey = data.body.authKey;
            data.body.sId = req.sessionID;
          }
        }
        return res.send({
          token: body.access_token,
          userDetails: userDetailObj,
          result: data
        });
      });
    });
  });

  module.exports = router;

}).call(this);
