async function digestMessage(message) {
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const validHashes = [
    '3ea3c08890606678c4e381a29305a26a9688e0f0f6191e8e52624fafb36291aa'
];

export default {
    name: 'offline',
    func: async (ticketData) => {
        const { uid } = ticketData;
        const digestHex = await digestMessage(uid);
        const isValid = validHashes.includes(digestHex)

        return {
            isValid,
            text: isValid
                ? `OK`
                : `NOT OK (see online)`
        };
    }
};