import Pattent from '../contracts/Pattent.json';

const drizzleOptions = {
    web3: {
        block: false,
        fallback: {
            type: 'ws',
            url: 'ws://127.0.0.1:8545',
        },
    },
    contracts: [Pattent],
    events: {
        Pattent:
            [
                {
                    eventName: 'adSkipEvent',
                    eventOptions: {
                        fromBlock: 0,
                    },
                },
            ],
    },
    polls: {
        accounts: 1500,
        blocks: 3000,
    },
};

export default drizzleOptions;
