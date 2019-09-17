export default class TicketData {
    constructor({ uid, name, type, error }) {
        this.uid = uid;
        this.name = name;
        this.type = type;
        this.error = error;
    }

    /**
     * @param {String} text
     * @return {TicketData}
     */
    static fromText(text) {
        const parsed = JSON.parse(text);
        return new TicketData(parsed);
    }
}
