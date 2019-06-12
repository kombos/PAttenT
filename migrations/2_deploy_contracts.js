var Pattent = artifacts.require("Pattent");

module.exports = function (deployer, network, accounts) {

    

    if (network == "ganache") {
        console.log("deploy Pattent ...");
        deployer.deploy(Pattent, {
            from: accounts[0],
            gas: 6721975
        });
        
    }


};