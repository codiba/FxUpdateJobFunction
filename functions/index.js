
const logger = require("firebase-functions/logger");
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');

admin.initializeApp();

const db = admin.firestore();


exports.UpdateCurrencyRateJob = functions.pubsub.topic('CurrencyUpdate').onPublish(async (_) => {
   try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/users');
        const users = response.data;

        const writePromises = users.map(user => {
            const { id, ...rest } = user;
            const docRef = db.collection('users').doc(id.toString());
            return docRef.set(rest);
        });

        await Promise.all(writePromises);
        console.log('Users successfully fetched and stored in Firestore!');
        logger.log("Sanırım oldu");
    } catch (error) {
        console.error('Error fetching users or writing to Firestore: ', error);
        throw new functions.https.HttpsError('internal', 'Internal Server Error');
    }
})