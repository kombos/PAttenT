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
    
  },
  polls: {
    accounts: 3000
  }
};

export default drizzleOptions;