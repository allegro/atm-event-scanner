const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

/**
 * Validated users ticket
 *
 * @type {HttpsFunction}
 */
exports.validateTicket = functions.https.onCall(async (ticketData, context) => {
    const firestore = admin.firestore();
    const { uid } = ticketData;
    const userRecord = await admin.auth().getUser(uid);

    if (!userRecord) return { isValid: false };

    const userProfile = firestore.collection('users').doc(uid);
    const { scanCount: prevScansCount } = (await userProfile.get()).data();

    if (!prevScansCount) {
        await userProfile.set({
            scanCount: 1,
            scanAt: new Date().getTime()
        }, { merge: true });
    } else {
        await userProfile.update("scanCount", prevScansCount + 1);
    }

    return {
        isValid: true,
        scans: prevScansCount
    };
});
