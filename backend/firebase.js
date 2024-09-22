const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json');

// Initialize the Firebase app
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// Initialize Firestore
const firestore = admin.firestore();
const auth = admin.auth();

module.exports = { auth, admin, firestore };
