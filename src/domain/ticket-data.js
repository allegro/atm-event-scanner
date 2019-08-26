export default class TicketData {
    constructor({ uid, name, tshirt, error }) {
        this.uid = uid;
        this.name = name;
        this.tshirt = tshirt;

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
