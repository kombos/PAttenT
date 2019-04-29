import Multiprizer from '../contracts/Multiprizer.json';

const drizzleOptions = {
    web3: {
        block: false,
        fallback: {
            type: 'ws',
            url: 'ws://127.0.0.1:7545',
        },
    },
    contracts: [Multiprizer],
    events: {
        Multiprizer:
            [
                {
                    eventName: 'LogPlayGame',
                    eventOptions: {
                        fromBlock: 0,
                    },
                },
                {
                    eventName: 'LogRevertGame',
                    eventOptions: {
                        fromBlock: 0,
                    },
                },
                {
                    eventName: 'LogCompleteRound',
                    eventOptions: {
                        fromBlock: 0,
                    },
                },
                {
                    eventName: 'LogCompleteMPRound',
                    eventOptions: {
                        fromBlock: 0,
                    },
                },
                {
                    eventName: 'LogGameLocked',
                    eventOptions: {
                        fromBlock: 0,
                    },
                },
                {
                    eventName: 'LogGameUnlocked',
                    eventOptions: {
                        fromBlock: 0,
                    },
                },
                {
                    eventName: 'LogWinner',
                    eventOptions: {
                        fromBlock: 0,
                    },
                },
                {
                    eventName: 'LogMegaPrizeWinner',
                    eventOptions: {
                        fromBlock: 0,
                    },
                },
                {
                    eventName: 'LogMegaPrizeUpdate',
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
