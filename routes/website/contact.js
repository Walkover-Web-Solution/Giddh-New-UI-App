import settings from '../util/settings';
let app = settings.express();
let router = settings.express.Router();
// sendgrid
import * as sendgrid from 'sendgrid';
let sendgrid  = sendgrid(settings.sendGridKey);

// hubURL = 'https://api.hubapi.com/contacts/v1/contact/?hapikey=41e07798-d4bf-499b-81df-4dfa52317054'
//hit viasocket
let hitViaSocket = function(data) {
  data = JSON.stringify(data);
  data.environment = app.get('env');
  return settings.request({
    url: 'https://viasocket.com/t/zX62dMuqyjqikthjh5/giddh-giddh-contact-form?authkey=MbK1oT6x1RCoVf2AqL3y',
    qs: {
      from: 'Giddh',
      time: +new Date
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



// send email to user
let sendEmailToUser =function(data) {
  console.log("user email", data);
  let email = new (sendgrid.Email)({
    to: data.email,
    toname: data.name,
    from: 'shubhendra@giddh.com',
    fromname: 'Shubhendra Agrawal',
    subject: 'Giddh Team',
    html: `<p>Dear ${data.uFname},</p><p>Thanks for showing your interest</p><p>We will get in touch with you shortly!</p><p></p>`
    });
  return sendgrid.send(email, function(err, json) {
    if (err) {
      return console.error(err);
    }
    return console.log("sendEmailToUser:", json);
  });
};

// send email to user
let sendEmailToGiddhTeam =function(data) {
  console.log("sendEmailToGiddhTeam", data);
  let email = new (sendgrid.Email)({
    to: 'shubhendra@giddh.com',
    from: data.email,
    fromname: data.name,
    subject: 'Contact Form Query from website',
    html: `<p>Name: ${data.name}</p><p>Number: ${data.number}</p><p>Message: ${data.message}</p>`
  });
  return sendgrid.send(email, function(err, json) {
    if (err) {
      return console.error(err);
    }
    return console.log("sendEmailToGiddhTeam:", json);
  });
};

router.post('/submitDetails', function(req, res) {
  // send email by sendgrid to user
  console.log(req.body);
  sendEmailToUser(req.body);
  sendEmailToGiddhTeam(req.body);
  hitViaSocket(req.body);
  let data = {
    status: "success",
    message: "Form submitted successfully! We will get in touch with you soon"
  };
  return res.send(data);
});




  // hubspot commented
  // formData =
  //   'properties': [
  //     {
  //       'property': 'email',
  //       'value': req.body.email
  //     }
  //     {
  //       'property': 'firstname',
  //       'value': req.body.uFname
  //     }
  //     {
  //       'property': 'lastname',
  //       'value': req.body.uLname
  //     }
  //     {
  //       'property': 'company',
  //       'value': req.body.company
  //     }
  //     {
  //       'property': 'message',
  //       'value': req.body.message
  //     }
  //   ]
  // args = {
  //   data: formData
  //   headers:
  //     'Content-Type': 'application/json'
  // }

  // settings.client.post hubURL, args, (data) ->
  //   if Buffer.isBuffer(data)
  //     data = data.toString('utf-8')
  //   res.send data

export default router;
