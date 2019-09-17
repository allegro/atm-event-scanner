import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import * as serviceWorker from './serviceWorker';
import firebase from './firebase';

import App from './components/app';
import Validator from "./domain/validator";
import HashesStorage from "./domain/hashes-storage";
import ModeStorage from "./domain/mode-storage";

import getOnlineValidator from './domain/check-firebase';
import getOfflineValidator from './domain/check-hash';

const hashStorage = new HashesStorage({
    storage: window.localStorage,
    storageKey: 'atm-scnr-hashes',
    updater: async () => {
        const getHashes = firebase.functions().httpsCallable('getHashes');
        const result = await getHashes();
        return result.data.hashes;
    }
});

const modeStorage = new ModeStorage({
    storage: window.localStorage,
    storageKey: 'atm-scnr-mode'
});

const validator = new Validator([
    getOfflineValidator({ hashStorage }),
    getOnlineValidator({ firebase, modeStorage }),
]);

ReactDOM.render(<App validator={validator} hashStorage={hashStorage} modeStorage={modeStorage} />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
