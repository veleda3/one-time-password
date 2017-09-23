const admin = require('firebase-admin');
const functions = require('firebase-functions');
const createUser = require('./create_user');
const serviceAccount = require('./service_account.json');
const RequestOneTimePassword = require('./request_one_time_password');
const VerifyOneTimePassword = require('./verify_one_time_password');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://one-time-password-42ab3.firebaseio.com"
});

exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});


exports.createUser = functions.https.onRequest(createUser);
exports.RequestOneTimePassword = functions.https.onRequest(RequestOneTimePassword);
exports.VerifyOneTimePassword = functions.https.onRequest(VerifyOneTimePassword);
