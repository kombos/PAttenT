

// Ethscan URLs
// export const TX_HASH_URL = 'https://ropsten.etherscan.io/tx/';
export const TX_HASH_URL = "https://etherscan.io/tx/";
// export const ADDRESS_HASH_URL = 'https://ropsten.etherscan.io/address/';
export const ADDRESS_HASH_URL = "https://etherscan.io/address/";

// Game ID names
// ...
// ...

// Drawer Items
export const DRAWERITEMS = [
    'Notifications',
];

export const DRAWERICONS = [
    'Notifications',
];

// Indicator Props
export const BOUNTYSIZE_DIVISOR = 5e18;

// Trust Wallet Deep Link (mainnet)
export const TRUST_WALLET_DEEPLINK = "https://links.trustwalletapp.com/dWVTMiVEAW";
// Trust Wallet Deep Link (ropsten)
// export const TRUST_WALLET_DEEPLINK = "https://links.trustwalletapp.com/VBK1M04EAW";

const adArray = [
    "tech Ad",
    "finance Ad",
    "blockchain Ad",
    "fashion Ad",
    "real estate Ad",
    "Shopping Ad",
    "Automobile Ad",
    "Travel Ad",
    "Healthcare Ad",
    "Gaming Ad"
]

export const getAd = (num) => {
    return adArray[num-1];
}