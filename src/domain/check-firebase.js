import * as firebase from "firebase/app";
import "firebase/functions";

const firebaseConfig = {
    apiKey: "AIzaSyDwGFsr2F-ju_u162LengdX2BeGZ_Bh4Xw",
    authDomain: "atm-voting.firebaseapp.com",
    databaseURL: "https://atm-voting.firebaseio.com",
    projectId: "atm-voting",
    storageBucket: "atm-voting.appspot.com",
    messagingSenderId: "639364440999",
    appId: "1:639364440999:web:2185c88196af2cc6"
};

firebase.initializeApp(firebaseConfig);

const validateTicket = firebase.functions().httpsCallable('validateTicket');

export default {
    name: 'online',
    func: async (ticketData) => {
        try {
            const { data } = await validateTicket(ticketData);
            return {
                ...data,
                text: data.isValid
                    ? `OK (checked ${data.scans} times before)`
                    : `NOT OK`
            };
        } catch {
            return null;
        }
    }
};