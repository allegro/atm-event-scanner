import { EventEmitter } from 'events';

const DEFAULT_EXPIRATION_TIME = 10 * 60 * 1000; // 10 minutes

class Hashes {
    constructor({ updatedAt = 0, hashes = [], expirationTime = DEFAULT_EXPIRATION_TIME } = {}) {
        this.updatedAt = updatedAt;
        this.hashes = hashes;
        this.expirationTime = expirationTime;
    }

    isOutdated() {
        const { updatedAt, expirationTime } = this;
        return Date.now() - updatedAt > expirationTime;
    }
}

export default class HashesStorage extends EventEmitter {
    constructor({ storage, storageKey, updater }) {
        super();
        this.storage = storage;
        this.storageKey =  storageKey;
        this.updater = updater;
    }

    save(hashes = []) {
        const toStore = new Hashes({ updatedAt: Date.now(), hashes });
        this.storage.setItem(this.storageKey, JSON.stringify(toStore));
        this.emit('update', toStore);
    }

    /**
     * @return {Hashes}
     */
    getValue() {
        let retrievedValue = {};

        try {
            const storedHashes = this.storage.getItem(this.storageKey);

            if (storedHashes) {
                retrievedValue = JSON.parse(storedHashes);
            }
        } catch (e) {}

        return new Hashes(retrievedValue);
    }

    async update() {
        try {
            if (this.getValue().isOutdated()) {
                const hashesList = await this.updater();
                this.save(hashesList);
            }
        } catch (error) {
            console.log(error);
        }
    }
}