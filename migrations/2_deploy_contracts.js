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
        500,
        web3.utils.toHex(1e16),
        (60*60*24*2),
        (4*60*24*2),
        10,
        10000,
        1000,
        0,
        0,
        0,
        web3.utils.toHex(1e16)
    ];
    var _gameProperties2 = [
        103,
        300,
        web3.utils.toHex(5e16),
        (60*60*36),
        (4*60*36),
        30,
        10000,
        1000,
        0,
        0,
        0,
        web3.utils.toHex(1e16)
    ];
    var _gameProperties3 = [
        104,
        40,
        web3.utils.toHex(1e17),
        (60*60*8),
        (4*60*8),
        2,
        10000,
        1000,
        0,
        0,
        0,
        web3.utils.toHex(1e16)
    ];
    var _gameProperties4 = [
        105,
        100,
        web3.utils.toHex(1e18),
        (60*60*24),
        (4*60*24),
        1,
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
            // add a new game
            .then(function(receipt) {
                console.log("Add Game by admin ......  ");
                return multiprizerInstance.addGameByAdmin(_gameProperties4, {from:accounts[0]});
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
                return multiprizerInstance.unlockGamesByAdmin([102,103,104,105],{from:accounts[0]});
            })
            // complete rounds
            .then(function(receipt) {
                console.log("complete round for current game ..... ");
                return multiprizerInstance.completeRoundsByAdmin([102,103,104,105],{from:accounts[0]});
            })
            .catch(function(e){
                console.log(e);
            });


    }


    if(network == "ropsten") {
        console.log("deploy Multiprizer ...");
        deployer.deploy(Multiprizer)
            .then(function(instance) {
                multiprizerInstance = instance;
                console.log("nominate timekeeper....... ");
                console.log("accounts[1]: ", accounts[1]);
                console.log("accounts[0]: ", accounts[0]);
                return multiprizerInstance.transferTimekeeping("0xA2906Be2cde0d579761C842D6d1dB0E1002Daa69", {from:accounts[0]});
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
            // add a new game
            .then(function(receipt) {
                console.log("Add Game by admin ......  ");
                return multiprizerInstance.addGameByAdmin(_gameProperties4, {from:accounts[0]});
            })
            // deploy Multiprizer_oraclize
            .then(function(receipt) {
                console.log("deploy MultiprizerOraclize ....... ");
                return deployer.deploy(MultiprizerOraclize, Multiprizer.address, {from:accounts[0]});
            })
            // update multiprizer_oraclize props
            .then(function(oraclize_instance) {
                multiprizerOraclizeInstance = oraclize_instance;
                let _gasLimitOraclize = 400000;
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
                return multiprizerInstance.unlockGamesByAdmin([102,103,104,105],{from:accounts[0]});
            })
            // complete rounds
            .then(function(receipt) {
                console.log("complete round for current game ..... ");
                return multiprizerInstance.completeRoundsByAdmin([102,103,104,105],{from:accounts[0]});
            })
            .catch(function(e){
                console.log(e);
            });


    }
    
  
};