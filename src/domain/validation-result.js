import { EventEmitter } from 'events';

export default class ValidationResult extends EventEmitter {
    /**
     * @param {TicketData} ticketData
     */
    constructor({ ticketData }) {
        super();
        this.ticketData = ticketData;
        this.checks = new Map();
    }

    registerCheck(name) {
        this.checks.set(name, undefined);
    }

    setCheckResult(name, result) {
        this.checks.set(name, result);
        this.emit('update');
    }
}