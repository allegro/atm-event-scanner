export default function ({ firebase, modeStorage }) {
    const validateTicket = firebase.functions().httpsCallable('validateTicket');

    return {
        name: 'online check',
        func: async (ticketData) => {
            try {
                const mode = modeStorage.getValue();
                const { data } = await validateTicket({ mode, ticketData });
                const { isValid, text } = data;
                return { isValid, text };
            } catch (err) {
                console.log(err);
                return null;
            }
        }
    };
};