var MultiprizerCore = artifacts.require("Multiprizer");
var MultiprizerOraclize = artifacts.require("Multiprizer_oraclize");

module.exports = function(deployer, network, accounts) {

    var _gameProperties = [
        102,
        200,
        1e15,
        (60*60*24*2),
        (4*60*24*2),
        5,
        10000,
        1000,
        0,
        0,
        0,
        1e14
    ];

    var multiprizerCoreInstance, multiprizerOraclizeInstance;
    
    if(network == "development") {
        deployer.deploy(MultiprizerCore, {gas:10000000}).then(function() {
            
            return deployer.deploy(MultiprizerOraclize, MultiprizerCore.address, {gas:10000000});
        });

    }

    if(network == "ganache") {
        deployer.deploy(MultiprizerCore, {gas:10000000})
            .then(function(instance) {
                multiprizerCoreInstance = instance;
                return multiprizerCoreInstance.transferTimekeeping(accounts[1], {from:accounts[0]});
            })
            .then(function(receipt) {
                return multiprizerCoreInstance.addGameByAdmin(_gameProperties, {from:accounts[0]});
            })
            .then(function(receipt) {
                return multiprizerCoreInstance.resumeAllGamesByAdmin({from:accounts[0]});
            })
            .then(function(receipt) {
                return deployer.deploy(MultiprizerOraclize, MultiprizerCore.address, {from:accounts[0], gas:10000000});
            })
            .catch(function(e){
                console.log(e);
            });


    }
  
};