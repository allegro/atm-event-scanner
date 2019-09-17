async function digestMessage(message) {
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function({ hashStorage }) {
    hashStorage.update();

    return {
        name: 'offline check',
        func: async (ticketData) => {
            const { uid } = ticketData;
            const { hashes: validHashes } = hashStorage.getValue();
            const digestHex = await digestMessage(uid);
            const isValid = validHashes.includes(digestHex);

            return { isValid, text: `offline check ${isValid ? 'OK' : 'failed'}` };
        }
    };
}
