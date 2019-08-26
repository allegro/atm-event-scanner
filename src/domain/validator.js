import ValidationResult from './validation-result';
import TicketData from './ticket-data';

import checkOnline from './check-firebase';
import checkHash from './check-hash';

export default class Validator {
    constructor({ checks = [] }) {
        this.checks = checks;
    }

    /**
     *
     * @param {String} qrCodeText
     * @return {ValidationResult}
     */
    check(qrCodeText) {
        const ticketData = TicketData.fromText(qrCodeText);
        const validationResult = new ValidationResult({ ticketData });

        this.checks.forEach(async (check) => {
            validationResult.registerCheck(check.name);
            validationResult.setCheckResult(check.name, await check.func(validationResult.ticketData));
        });

        return validationResult;
    }

    static getDefault() {
        const checks = [ checkHash, checkOnline ];
        return new Validator({ checks })
    }
}
