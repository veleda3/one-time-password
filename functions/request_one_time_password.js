const admin = require('firebase-admin');
const twilio = require('./twilio');

module.exports = function(req, res) {
  if (!req.body.phone) {
    return res.status(422).send({ error: 'You must provide a phone number' });
  }

  const phone = String(req.body.phone).replace(/[^\d]/g, '');

  admin.auth().getUser(phone)
    .then(userRecord => {
      const code = Math.floor((Math.random() * 8999 + 1000));
      // twilio api does not support promises which is why you need to
      // use a call back functions for error handlening
      twilio.messages.create({
        body: 'Your code is ' + code,
        to: phone,
        from: '+16176487329'
      }, (err) => {
        if (err) { return res.status(422).send(err); }
        // you cannot save random data to firebase model in this case 'user'
        // because firebase auth only allows for certain commands to be call
        // on that user and you cannot add any additional commands which is
        // why we will be using the database
        admin.database().ref('users/' + phone)
          .update({ code: code, codeValid: true }, () => {
            res.send({ success: true });
          });
      })
    })
    .catch((err) => {
      res.status(422).send({ error: err });
    });
}
