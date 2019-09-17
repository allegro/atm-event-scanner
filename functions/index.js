const functions = require('firebase-functions');
const admin = require('firebase-admin');
const crypto = require('crypto');

admin.initializeApp();

/**
 * Validated users ticket
 *
 * @type {HttpsFunction}
 */
exports.validateTicket = functions.https.onCall(async (requestData, context) => {
    const firestore = admin.firestore();
    const { mode = 'VALIDATE', ticketData } = requestData;
    const { uid, name, type } = ticketData;
    const userRecord = await admin.auth().getUser(uid).catch(() => null);

    if (!userRecord) return { isValid: false, text: 'ticket not found' };

    const userProfile = firestore.collection('users').doc(uid);
    const userProfileData = (await userProfile.get()).data();

    const dataMismatch = name !== userProfileData.displayName || type !== userProfileData.type;

    if (dataMismatch) {
        return {
            isValid: false,
            text: [
                'data mismatch:',
                `name: ${userProfileData.displayName}`,
                `type: ${userProfileData.type}`
            ]
        };
    }

    const scansCollection = userProfile.collection('scans');

    // get previous scans
    const previousScans = await scansCollection.get()
        .then(querySnapshot => {
            const scans = [];
            querySnapshot.forEach(doc => scans.push(doc.data()));
            return scans;
        });

    // record current scan
    await scansCollection.add({ mode, at: Date.now() });

    const byDate = (a, b) => b.at - a.at;
    const printDate = timestamp => new Date(timestamp).toLocaleString(['pl-PL', 'en-GB'], { timeZone: 'Europe/Warsaw' });

    if (mode === 'VALIDATE') {
        const todayValidation = previousScans
            .filter(scan => new Date(scan.at).getDate() === new Date().getDate())
            .sort(byDate)
            .find(scan => scan.mode === 'VALIDATE');

        if (todayValidation) return {
            isValid: false,
            text: [
                'ticket was already scanned today!',
                `last: ${printDate(todayValidation.at)}`
            ]
        };

        return { isValid: true, text: 'registration OK' };
    }

    if (mode === 'PARTY') {
        const prev = previousScans.sort(byDate).find(scan => scan.mode === 'PARTY');
        if (prev) return {
            isValid: false,
            text: [
                `ticket was already scanned at the party!`,
                `last: ${printDate(prev.at)}`
            ]};

        return { isValid: true, text: 'party registration OK' }
    }

    if (mode === 'TEST') {
        return {
            isValid: true,
            text: [
                'validated',
                `${previousScans.filter(scan => scan.mode === 'VALIDATE').length} at registration;`,
                `${previousScans.filter(scan => scan.mode === 'PARTY').length} at party; `,
                `${previousScans.filter(scan => scan.mode === 'TEST').length} in tests; `
            ]
        }
    }

    return {
        isValid: false,
        text: [
            'invalid scanner mode',
            mode
        ]
    };
});

/**
 * Get tickets hashes
 *
 * @type {HttpsFunction}
 */
exports.getHashes = functions.https.onCall(async () => {
    const firestore = admin.firestore();
    const digestMessage = message => crypto.createHash('sha256').update(message).digest('hex');

    const hashes = await firestore.collection('users').get()
        .then(snapshot => {
            const hashes = [];
            snapshot.forEach(doc => hashes.push(digestMessage(doc.id)));
            return hashes;
        })
        .catch(err => console.log('Error getting documents', err));

    if (hashes) {
        return ({ hashes });
    }
});
