// firebase.js
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://calendar-app-e41af-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const database = admin.database();

module.exports = { database };
