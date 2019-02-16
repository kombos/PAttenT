import Multiprizer_oraclize from './contracts/Multiprizer_oraclize.json'
import Multiprizer from './contracts/Multiprizer.json'

const drizzleOptions = {
    web3: {
        block: false,
        fallback: {
            type: 'ws',
            url: 'ws://127.0.0.1:7545'
        }
    },
    contracts: [Multiprizer],

    events: {
        Multiprizer: [

            {
                eventName:'logPlayGame',
                eventOptions:{
                    fromBlock: 0
                }
            },
            {
                eventName:'logRevertGame',
                eventOptions:{
                    fromBlock: 0
                }
            },
            {
                eventName:'logPauseGames',
                eventOptions:{
                    fromBlock: 0
                }
            },
            {
                eventName:'logResumeGames',
                eventOptions:{
                    fromBlock: 0
                }
            },
            {
                eventName:'logRevertFunds',
                eventOptions:{
                    fromBlock: 0
                }
            },
            {
                eventName:'logCompleteRound',
                eventOptions:{
                    fromBlock: 0
                }
            },
            {
                eventName:'logGameLocked',
                eventOptions:{
                    fromBlock: 0
                }
            },
            {
                eventName:'logWinner',
                eventOptions:{
                    fromBlock: 0
                }
            },
            {
                eventName:'logMegaPrizeWinner',
                eventOptions:{
                    fromBlock: 0
                }
            },
        ]

    },
    
    polls: {
        accounts: 3000
    }
};

export default drizzleOptions;