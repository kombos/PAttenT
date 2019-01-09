var MultiprizerCore = artifacts.require("Multiprizer");
var MultiprizerOraclize = artifacts.require("Multiprizer_oraclize");

module.exports = function(deployer, network) {
    
    if(network == "development") {
        deployer.deploy(MultiprizerCore, {gas:10000000}).then(function() {
            return deployer.deploy(MultiprizerOraclize, MultiprizerCore.address, {gas:10000000});
        });

    }

    if(network == "ganache") {
        deployer.deploy(MultiprizerCore, {gas:10000000}).then(function() {
            return deployer.deploy(MultiprizerOraclize, MultiprizerCore.address, {gas:10000000});

        });
    }
  
};