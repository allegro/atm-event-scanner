import { EventEmitter } from 'events';

const DEFAULT_MODE = 'VALIDATE';

export default class ModeStorage extends EventEmitter {
    constructor({ storage, storageKey }) {
        super();
        this.storage = storage;
        this.storageKey =  storageKey;
    }

    getAvailableModes() {
        return ['VALIDATE', 'PARTY', 'TEST'];
    }

    toggle() {
        const available = this.getAvailableModes();
        const current = this.getValue();
        const next = available[available.indexOf(current) + 1 % available.length];

        this.save(next);
    }

    save(mode = DEFAULT_MODE) {
        this.storage.setItem(this.storageKey, mode);
        this.emit('update', mode);
    }

    getValue() {
        try {
            const storedMode = this.storage.getItem(this.storageKey);
            return storedMode || DEFAULT_MODE;
        } catch (e) {}

        return DEFAULT_MODE;
    }
}