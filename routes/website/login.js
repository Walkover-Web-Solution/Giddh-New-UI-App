import settings from '../util/settings';
let app = settings.express();
import * as jwt from 'jwt-simple';
let jwt = jwt;
import * as qs from 'qs';

let router = settings.express.Router();
let googleLoginUrl = settings.envUrl + 'signup-with-google';
let linkedinLoginUrl =  settings.envUrl + 'signup-with-linkedIn';
let twitterLoginUrl =  settings.envUrl + 'signup-with-twitter';

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


/*
 |--------------------------------------------------------------------------
 | login with google
 |--------------------------------------------------------------------------
*///

router.post('/google', function(req, res, next) {
  let googleAccessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
  let params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: settings.googleKey,
    redirect_uri: req.body.redirectUri,
    grant_type: 'authorization_code'
  };
  // Step 1. Login in Giddh API.
  return settings.request.post(googleAccessTokenUrl, {
    json: true,
    form: params
  }, function(err, response, token) {
    let accessToken = token.access_token;
    let userDetailObj = {};
    let args = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Token': accessToken
      }
    };
    // Step 2. Retrieve profile information about the current user.
    return settings.client.get(googleLoginUrl, args, function(data, response) {
      if ((data.status === 'error') || (data.status === undefined)) {
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
        token,
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
  let requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
  let twitterAccessTokenUrl = 'https://api.twitter.com/oauth/access_token';
  let profileUrl = 'https://api.twitter.com/1.1/users/show.json?screen_name=';
  // Part 1 of 2: Initial request from Satellizer.
  if (!req.body.oauth_token || !req.body.oauth_verifier) {
    let requestTokenOauth = {
      consumer_key: settings.twitterKey,
      consumer_secret: settings.twitterSecret,
      callback: req.body.redirectUri
    };
    // Step 1. Obtain request token for the authorization popup.
    return settings.request.post({
      url: requestTokenUrl,
      oauth: requestTokenOauth
    }, function(err, response, body) {
      let oauthToken = qs.parse(body);
      // Step 2. Send OAuth token back to open the authorization screen.
      return res.send(oauthToken);
    });
  } else {
    // Part 2 of 2: Second request after Authorize app is clicked.
    let accessTokenOauth = {
      consumer_key: settings.twitterKey,
      consumer_secret: settings.twitterSecret,
      token: req.body.oauth_token,
      verifier: req.body.oauth_verifier
    };
    // Step 3. Exchange oauth token and oauth verifier for access token.
    return settings.request.post({
      url: twitterAccessTokenUrl,
      oauth: accessTokenOauth
    }, function(err, response, accessToken) {
      accessToken = qs.parse(accessToken);
      let userDetailObj = {};
      // Step 4 hit our java api
      let args = {
        headers: {
          'Content-Type': 'application/json',
          'Access-Token': accessToken.oauth_token,
          'Access-Secret': accessToken.oauth_token_secret
        }
      };
      return settings.client.get(twitterLoginUrl, args, function(data, response) {
        if ((data.status === 'error') || (data.status === undefined)) {
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
router.post('/linkedin/callback', (req, res) => console.log(req, "callback"));


router.post('/linkedin', function(req, res) {
  let linkedinAccessTokenUrl = 'https://www.linkedin.com/uas/oauth2/accessToken';
  let peopleApiUrl = 'https://api.linkedin.com/v1/people/~:(id,first-name,last-name,email-address,picture-url)';
  let params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: settings.linkedinSecret,
    redirect_uri: req.body.redirectUri,
    grant_type: 'authorization_code'
  };
  // Step 1. Exchange authorization code for access token.
  return settings.request.post(linkedinAccessTokenUrl, {
    form: params,
    json: true
  }, function(err, response, body) {
    let params;
    if (response.statusCode !== 200) {
      return res.status(response.statusCode).send({message: body.error_description});
    }
    let userDetailObj = {};
    let args = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Token': body.access_token
      }
    };
    // Step 2. Retrieve profile information about the current user.
    return settings.client.get(linkedinLoginUrl, args, function(data, response) {
      if ((data.status === 'error') || (data.status === undefined)) {
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


export default router;