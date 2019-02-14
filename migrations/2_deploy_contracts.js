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
        _gameProperties[11] : uint256 directPlayTokenGas
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
    var _gameProperties2 = [
        103,
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
    var _gameProperties3 = [
        104,
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

    if(network == "ganache") {
        console.log("deploy Multiprizer ...");
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
            // add a new game
            .then(function(receipt) {
                console.log("Add Game by admin ......  ");
                return multiprizerInstance.addGameByAdmin(_gameProperties2, {from:accounts[0]});
            })
            // add a new game
            .then(function(receipt) {
                console.log("Add Game by admin ......  ");
                return multiprizerInstance.addGameByAdmin(_gameProperties3, {from:accounts[0]});
            })
            // deploy Multiprizer_oraclize
            .then(function(receipt) {
                console.log("deploy MultiprizerOraclize ....... ");
                return deployer.deploy(MultiprizerOraclize, Multiprizer.address, {from:accounts[0], gas:10000000});
            })
            // update multiprizer_oraclize props
            .then(function(oraclize_instance) {
                multiprizerOraclizeInstance = oraclize_instance;
                let _gasLimitOraclize = 900000;
                let _gasPriceOraclize = 2e10;
                let _numBytesOraclize = 7;
                let _delayOraclize = 0;
                console.log("Update Oraclize props .... ");
                return multiprizerOraclizeInstance.updateOraclizePropsByAdmin(_gasLimitOraclize, _gasPriceOraclize,
                    _numBytesOraclize, _delayOraclize, {from:accounts[0]});
            })
            // set deployed address of Multiprizer_oraclize in Multiprizer
            .then(function(receipt) {
                console.log("Set Oraclize by admin .... ");
                console.log("Multiprizer.address", multiprizerInstance.address);
                console.log("Oraclize address: ", multiprizerOraclizeInstance.address);
                return multiprizerInstance.setOraclizeByAdmin(multiprizerOraclizeInstance.address, {from:accounts[0]});
            })
            // unlock games
            .then(function(receipt) {
                console.log("unlock game ..... ");
                return multiprizerInstance.unlockGamesByAdmin([102,103,104],{from:accounts[0]});
            })
            // complete rounds
            .then(function(receipt) {
                console.log("complete round for current game ..... ");
                return multiprizerInstance.completeRoundsByAdmin([102,103,104],{from:accounts[0]});
            })
            .catch(function(e){
                console.log(e);
            });


    }
    
  
};