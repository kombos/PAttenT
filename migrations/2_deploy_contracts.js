var Multiprizer = artifacts.require("Multiprizer");
var MultiprizerOraclize = artifacts.require("Multiprizer_oraclize");

module.exports = function(deployer, network, accounts) {

    /**
    * _gameProperties::
        _gameProperties[0] : uint256 gameID,
        _gameProperties[1] : uint256 maxTokens,
        _gameProperties[2] : uint256 tokenValue,
        _gameProperties[3] : uint256 gameDurationInEpoch,
        _gameProperties[4] : uint256 gameDurationInBlocks,
        _gameProperties[5] : uint256 maxTokensPerPlayer,
        _gameProperties[6] : uint256 houseEdge,
        _gameProperties[7] : uint256 megaPrizeEdge,
        _gameProperties[8] : uint256 currentRound,
        _gameProperties[9] : uint256 totalValueForGame,
        _gameProperties[10] : uint256 totalWinnings,
        _gameProperties[11] : uint256 directPlayTokenValue
*/

    var _gameProperties = [
        102,
        200,
        web3.utils.toHex(1e16),
        (60*60*24*2),
        (4*60*24*2),
        5,
        10000,
        1000,
        0,
        0,
        0,
        web3.utils.toHex(1e16)
    ];

    var multiprizerInstance, multiprizerOraclizeInstance;
    
    if(network == "development") {
        deployer.deploy(Multiprizer, {gas:10000000}).then(function(instance) {
            multiprizerInstance = instance;
            return deployer.deploy(MultiprizerOraclize, Multiprizer.address, {gas:10000000});
        });

    }

/* 
    if(network == "ganache") {
        console.log("deploy Multiprizer....... ");
        deployer.deploy(Multiprizer, {gas:10000000})
            .then(function(instance) {
                multiprizerInstance = instance;
                console.log("nominate timekeeper....... ");
                return multiprizerInstance.transferTimekeeping(accounts[1], {from:accounts[0]});
            })
            // add a new game
            .then(function(receipt) {
                console.log("Add Game by admin ......  ");
                return multiprizerInstance.addGameByAdmin(_gameProperties, {from:accounts[0]});
            })
            // deploy Multiprizer_oraclize
            .then(function(receipt) {
                console.log("deploy MultiprizerOraclize ....... ");
                return deployer.deploy(MultiprizerOraclize, Multiprizer.address, {from:accounts[0], gas:10000000});
            })
            .catch(function(e){
                console.log(e);
            });


    }
 */



    if(network == "ganache") {
        deployer.deploy(Multiprizer, {gas:10000000})
            .then(function(instance) {
                multiprizerInstance = instance;
                console.log("nominate timekeeper....... ");
                return multiprizerInstance.transferTimekeeping(accounts[1], {from:accounts[0]});
            })
            // add a new game
            .then(function(receipt) {
                console.log("Add Game by admin ......  ");
                return multiprizerInstance.addGameByAdmin(_gameProperties, {from:accounts[0]});
            })
            // deploy Multiprizer_oraclize
            .then(function(receipt) {
                console.log("deploy MultiprizerOraclize ....... ");
                return deployer.deploy(MultiprizerOraclize, Multiprizer.address, {from:accounts[0], gas:10000000});
            })
            // set deployed address of  Multiprizer_oraclize in Multiprizer
            .then(function(instance) {
                multiprizerOraclizeInstance = instance;
                console.log("Set Oraclize by admin .... ");
                return multiprizerInstance.setOraclizeByAdmin(MultiprizerOraclize.address, {from:accounts[0]});
            })
            // resume all games
            .then(function(receipt) {
                console.log("resume all games ..... ");
                return multiprizerInstance.resumeAllGamesByAdmin({from:accounts[0]});
            })
            .catch(function(e){
                console.log(e);
            });


    }
    
  
};