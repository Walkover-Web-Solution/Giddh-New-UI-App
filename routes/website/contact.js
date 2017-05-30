(function() {
  var app, hitViaSocket, router, sendEmailToGiddhTeam, sendEmailToUser, sendgrid, settings;

  settings = require('../util/settings');

  app = settings.express();

  router = settings.express.Router();

  sendgrid = require('sendgrid')(settings.sendGridKey);

  hitViaSocket = function(data) {
    data = JSON.stringify(data);
    data.environment = app.get('env');
    return settings.request({
      url: 'https://viasocket.com/t/zX62dMuqyjqikthjh5/giddh-giddh-contact-form?authkey=MbK1oT6x1RCoVf2AqL3y',
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
  };

  sendEmailToUser = function(data) {
    var email;
    console.log("user email", data);
    email = new sendgrid.Email({
      to: data.email,
      toname: data.name,
      from: 'shubhendra@giddh.com',
      fromname: 'Shubhendra Agrawal',
      subject: 'Giddh Team',
      html: '<p>Dear ' + data.uFname + ',</p><p>Thanks for showing your interest</p><p>We will get in touch with you shortly!</p><p></p>'
    });
    return sendgrid.send(email, function(err, json) {
      if (err) {
        return console.error(err);
      }
      return console.log("sendEmailToUser:", json);
    });
  };

  sendEmailToGiddhTeam = function(data) {
    var email;
    console.log("sendEmailToGiddhTeam", data);
    email = new sendgrid.Email({
      to: 'shubhendra@giddh.com',
      from: data.email,
      fromname: data.name,
      subject: 'Contact Form Query from website',
      html: '<p>Name: ' + data.name + '</p><p>Number: ' + data.number + '</p><p>Message: ' + data.message + '</p>'
    });
    return sendgrid.send(email, function(err, json) {
      if (err) {
        return console.error(err);
      }
      return console.log("sendEmailToGiddhTeam:", json);
    });
  };

  router.post('/submitDetails', function(req, res) {
    var data;
    console.log(req.body);
    sendEmailToUser(req.body);
    sendEmailToGiddhTeam(req.body);
    hitViaSocket(req.body);
    data = {
      status: "success",
      message: "Form submitted successfully! We will get in touch with you soon"
    };
    return res.send(data);
  });

  module.exports = router;

}).call(this);
