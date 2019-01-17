var Multiprizer = artifacts.require("Multiprizer");
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

    var multiprizerInstance, multiprizerOraclizeInstance;
    
    if(network == "development") {
        deployer.deploy(Multiprizer, {gas:10000000}).then(function() {
            
            return deployer.deploy(MultiprizerOraclize, Multiprizer.address, {gas:10000000});
        });

    }

    if(network == "ganache") {
        deployer.deploy(Multiprizer, {gas:10000000})
            .then(function(instance) {
                multiprizerInstance = instance;
                return multiprizerInstance.transferTimekeeping(accounts[1], {from:accounts[0]});
            })
            // deploy Multiprizer_oraclize
            .then(function(receipt) {
                return deployer.deploy(MultiprizerOraclize, Multiprizer.address, {from:accounts[0], gas:10000000});
            })
            // set deployed address of  Multiprizer_oraclize in Multiprizer
            .then(function(receipt) {
                return multiprizerInstance.setOraclizeByAdmin(MultiprizerOraclize.address, {from:accounts[0]});
            })
            // add a new game
            .then(function(receipt) {
                return multiprizerInstance.addGameByAdmin(_gameProperties, {from:accounts[0]});
            })
            // resume all games
            .then(function(receipt) {
                return multiprizerInstance.resumeAllGamesByAdmin({from:accounts[0]});
            })
            
            .catch(function(e){
                console.log(e);
            });


    }
  
};