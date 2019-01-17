
var Multiprizer = artifacts.require("Multiprizer");

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

contract("Multiprizer", accounts => {
    var multiprizer;

    it("should be successfully deployed", async () => {
        let contract = await Multiprizer.deployed()
        multiprizer = await new web3.eth.Contract(contract.abi, contract.address);
        let balance = await web3.eth.getBalance(accounts[0]);
        multiprizer.options.gas = 1000000;
        if (multiprizer) {
            console.log("Account Balance : ", balance);
            assert.ok(true);
        }
        else {
            assert.fail("Deployment of Multiprizer contract failed !");
        }

    });

    it("should add games by admin : positive scenario  : addGameByAdmin() ", async () => {

        let _gameProperties = [100, 100, 2e15, (60 * 60 * 24 * 2), (4 * 60 * 24 * 2), 5, 5000, 1000, 0, 0, 0, 1e14];
        let gasEstimate = await multiprizer.methods.addGameByAdmin(_gameProperties).estimateGas({from: accounts[0]});
        console.log(" addGameByAdmin() Invocation Gas : ",gasEstimate);
        await multiprizer.methods.addGameByAdmin(_gameProperties).send({ from: accounts[0] })
            .on('transactionHash', function (hash) {
                console.log("Transaction Hash : ", hash);
            })
            .on('receipt', async function (receipt) {
                console.log("Transaction Receipt : "+ receipt);
                let gameData = await multiprizer.methods.gameStrategies(_gameProperties[0]).call({ from: accounts[0] });
                if (gameData.gameID == _gameProperties[0])
                    assert.ok(true);
                else
                    assert.fail("Error: game added but gameData parameters dont match! ");

            })
            .on('confirmation', function (confirmationNumber, receipt) {
                console.log("Transaction Confirmation : ", confirmationNumber);
                console.log("Transaction Receipt : "+ receipt);
            })
            .on('error', console.error(" Error Event of transaction called ! "));

    });

    
 
    it("should again add games by admin : positive scenario   : addGameByAdmin() ", async () => {
 
        let _gameProperties = [101, 400, 2e15, (60 * 60 * 24 * 2), (4 * 60 * 24 * 2), 5, 8000, 1000, 0, 0, 0, 1e14];
        let gasEstimate = await multiprizer.methods.addGameByAdmin(_gameProperties).estimateGas({from: accounts[0]});
        console.log(" addGameByAdmin() Invocation Gas : ",gasEstimate);
        await multiprizer.methods.addGameByAdmin(_gameProperties).send({ from: accounts[0] })
            .on('transactionHash', function (hash) {
                console.log("Transaction Hash : ", hash);
            })
            .on('receipt', async function (receipt) {
                console.log("Transaction Receipt : "+ receipt);
                let gameData = await multiprizer.methods.gameStrategies(_gameProperties[0]).call({ from: accounts[0] });
                if (gameData.gameID == _gameProperties[0])
                    assert.ok(true);
                else
                    assert.fail("Error: game added but gameData parameters dont match! ");

            })
            .on('confirmation', function (confirmationNumber, receipt) {
                console.log("Transaction Confirmation : ", confirmationNumber);
                console.log("Transaction Receipt : "+ receipt);
            })
            .on('error', console.error(" Error Event of transaction called ! "));
 
    });
 
    it("should update games by admin : positive scenario   : updateGameByAdmin() ", async () => {
 
        let _gameProperties = [101, 305, 2e15, (60 * 50 * 24 * 2), (4 * 60 * 24 * 2), 7, 8000, 1000, 0, 0, 0, 1e14];
        let gasEstimate = await multiprizer.methods.updateGameByAdmin(_gameProperties).estimateGas({from: accounts[0]});
        console.log(" updateGameByAdmin() Invocation Gas : ",gasEstimate);
        await multiprizer.methods.updateGameByAdmin(_gameProperties).send({ from: accounts[0] })
            .on('transactionHash', function (hash) {
                console.log("Transaction Hash : ", hash);
            })
            .on('receipt', async function (receipt) {
                console.log("Transaction Receipt : "+ receipt);
                let gameData = await multiprizer.methods.gameStrategies(_gameProperties[0]).call({ from: accounts[0] });
                if (gameData.gameID == _gameProperties[0])
                    assert.ok(true);
                else
                    assert.fail("Error: game updated but gameData parameters dont match! ");

            })
            .on('confirmation', function (confirmationNumber, receipt) {
                console.log("Transaction Confirmation : ", confirmationNumber);
                console.log("Transaction Receipt : "+ receipt);
            })
            .on('error', console.error(" Error Event of transaction called ! "));
 
    });
 
    it("should again update games by admin : positive scenario   : updateGameByAdmin() ", async () => {
 
        let _gameProperties = [100, 550, 2e14, (60 * 50 * 24 * 2), (4 * 60 * 24 * 2), 7, 8000, 1000, 0, 0, 0, 1e14];
        let gasEstimate = await multiprizer.methods.updateGameByAdmin(_gameProperties).estimateGas({from: accounts[0]});
        console.log(" updateGameByAdmin() Invocation Gas : ",gasEstimate);
        await multiprizer.methods.updateGameByAdmin(_gameProperties).send({ from: accounts[0] })
            .on('transactionHash', function (hash) {
                console.log("Transaction Hash : ", hash);
            })
            .on('receipt', async function (receipt) {
                console.log("Transaction Receipt : "+ receipt);
                let gameData = await multiprizer.methods.gameStrategies(_gameProperties[0]).call({ from: accounts[0] });
                if (gameData.gameID == _gameProperties[0])
                    assert.ok(true);
                else
                    assert.fail("Error: gamezzz updated but gameData parameters dont match! ");

            })
            .on('confirmation', function (confirmationNumber, receipt) {
                console.log("Transaction Confirmation : ", confirmationNumber);
                console.log("Transaction Receipt : "+ receipt);
            })
            .on('error', console.error(" Error Event of transaction called ! "));
 
    });
 
    it("should close games by admin : positive scenario   : closeGameByAdmin() ", async () => {
 
        let _gameID = 101;
        let gasEstimate = await multiprizer.methods.closeGameByAdmin(_gameID).estimateGas({from: accounts[0]});
        console.log(" closeGameByAdmin() Invocation Gas : ",gasEstimate);
        await multiprizer.methods.closeGameByAdmin(_gameID).send({ from: accounts[0] })
            .on('transactionHash', function (hash) {
                console.log("Transaction Hash : ", hash);
            })
            .on('receipt', async function (receipt) {
                console.log("Transaction Receipt : "+ receipt);
                let gameData = await multiprizer.methods.gameStrategies(_gameID).call({ from: accounts[0] });
                console.log("delete function gameStrategies gameID: ", gameData.gameID);
                if (gameData.gameID != _gameID)
                    assert.ok(true);
                else
                    assert.fail("Error: game deleted but gameData parameters dont match! ");

            })
            .on('confirmation', function (confirmationNumber, receipt) {
                console.log("Transaction Confirmation : ", confirmationNumber);
                console.log("Transaction Receipt : "+ receipt);
            })
            .on('error', console.error(" Error Event of transaction called ! "));
 
    });

    it("should resume a locked game : Positive Scenario   : unlockGamesByAdmin() ", async () => {

        let _gameProperties = [100];
        let gasEstimate = await multiprizer.methods.unlockGamesByAdmin(_gameProperties).estimateGas({from: accounts[0]});
        console.log(" unlockGamesByAdmin() Invocation Gas : ",gasEstimate);
        await multiprizer.methods.unlockGamesByAdmin(_gameProperties).send({ from: accounts[0] })
            .on('transactionHash', function (hash) {
                console.log("Transaction Hash : ", hash);
            })
            .on('receipt', async function (receipt) {
                console.log("Transaction Receipt : "+ receipt);
                let gameData = await multiprizer.methods.gameStrategies(_gameProperties[0]).call({ from: accounts[0] });
                if (!gameData.isLocked && !gameData.isLateLocked)
                    assert.ok(true);
                else
                    assert.fail("Error: game unlocked but gameData parameters dont match! ");

            })
            .on('confirmation', function (confirmationNumber, receipt) {
                console.log("Transaction Confirmation : ", confirmationNumber);
                console.log("Transaction Receipt : "+ receipt);
            })
            .on('error', console.error(" Error Event of transaction called ! "));

    });

    it("should update the directPlay variables : Positive Scenario   : updateDirectPlayByAdmin() ", async () => {

        let _directPlayWithdrawValue = 1e15;
        let _isDirectPlayEnabled = true;
        let gasEstimate = await multiprizer.methods.updateDirectPlayByAdmin(_directPlayWithdrawValue, _isDirectPlayEnabled).estimateGas({from: accounts[0]});
        console.log(" updateDirectPlayByAdmin() Invocation Gas : ",gasEstimate);
        await multiprizer.methods.updateDirectPlayByAdmin(_directPlayWithdrawValue, _isDirectPlayEnabled).send({ from: accounts[0] })
            .on('transactionHash', function (hash) {
                console.log("Transaction Hash : ", hash);
            })
            .on('receipt', async function (receipt) {
                console.log("Transaction Receipt : "+ receipt);
                let gameData = await multiprizer.methods.viewDirectPlayInfo().call({ from: accounts[0] });
                if (gameData._directPlayWithdrawValue == _directPlayWithdrawValue && gameData._isDirectPlayEnabled == _isDirectPlayEnabled)
                    assert.ok(true);
                else
                    assert.fail("Error: DirectPlay updated but gameData parameters dont match! ");

            })
            .on('confirmation', function (confirmationNumber, receipt) {
                console.log("Transaction Confirmation : ", confirmationNumber);
                console.log("Transaction Receipt : "+ receipt);
            })
            .on('error', console.error(" Error Event of transaction called ! "));

    });

    it("should update the megaPrize variables : Positive Scenario   : updateMegaPrizeByAdmin() ", async () => {

        let _megaPrizeID = 900; 
        let _megaPrizeAmount = 0; 
        let _isMegaPrizeEnabled = true; 
        let _isMegaPrizeLateLocked = false; 
        let _isMegaPrizeMatured = false; 
        let _megaPrizeDurationInEpoch = 1234567; 
        let _megaPrizeDurationInBlocks = 80000;

        let gasEstimate = await multiprizer.methods.updateMegaPrizeByAdmin(
            _megaPrizeID, 
            _megaPrizeAmount, 
            _isMegaPrizeEnabled, 
            _isMegaPrizeLateLocked, 
            _isMegaPrizeMatured, 
            _megaPrizeDurationInEpoch, 
            _megaPrizeDurationInBlocks
        ).estimateGas({from: accounts[0]});

        console.log(" updateMegaPrizeByAdmin() Invocation Gas : ",gasEstimate);
        await multiprizer.methods.updateMegaPrizeByAdmin(
            _megaPrizeID, 
            _megaPrizeAmount, 
            _isMegaPrizeEnabled, 
            _isMegaPrizeLateLocked, 
            _isMegaPrizeMatured, 
            _megaPrizeDurationInEpoch, 
            _megaPrizeDurationInBlocks
        ).send({ from: accounts[0] })
            .on('transactionHash', function (hash) {
                console.log("Transaction Hash : ", hash);
            })
            .on('receipt', async function (receipt) {
                console.log("Transaction Receipt : "+ receipt);
                let gameData = await multiprizer.methods.getMegaPrizeByAdmin().call({ from: accounts[0] });
                if (
                    gameData._megaPrizeID == _megaPrizeID && 
                    gameData._megaPrizeAmount == _megaPrizeAmount && 
                    gameData._isMegaPrizeEnabled == _isMegaPrizeEnabled && 
                    gameData._isMegaPrizeLateLocked == _isMegaPrizeLateLocked &&
                    gameData._isMegaPrizeMatured ==  _isMegaPrizeMatured &&
                    gameData._megaPrizeDurationInEpoch ==  _megaPrizeDurationInEpoch &&
                    gameData._megaPrizeDurationInBlocks ==  _megaPrizeDurationInBlocks
                ) {
                    assert.ok(true);
                }
                    
                else
                    assert.fail("Error: megaPrize updated but gameData parameters dont match! ");

            })
            .on('confirmation', function (confirmationNumber, receipt) {
                console.log("Transaction Confirmation : ", confirmationNumber);
                console.log("Transaction Receipt : "+ receipt);
            })
            .on('error', console.error(" Error Event of transaction called ! "));

    });

    it("should resume a locked mega Prize : Positive Scenario   : unlockMegaPrizeByAdmin() ", async () => {

        let gasEstimate = await multiprizer.methods.unlockMegaPrizeByAdmin().estimateGas({from: accounts[0]});
        console.log(" unlockMegaPrizeByAdmin() Invocation Gas : ",gasEstimate);
        await multiprizer.methods.unlockMegaPrizeByAdmin().send({ from: accounts[0] })
            .on('transactionHash', function (hash) {
                console.log("Transaction Hash : ", hash);
            })
            .on('receipt', async function (receipt) {
                console.log("Transaction Receipt : "+ receipt);
                let gameData = await multiprizer.methods.getMegaPrizeByAdmin().call({ from: accounts[0] });
                if (gameData._isMegaPrizeLateLocked == false && gameData._isMegaPrizeEnabled)
                    assert.ok(true);
                else
                    assert.fail("Error: megaPrize unlocked but gameData parameters dont match! ");

            })
            .on('confirmation', function (confirmationNumber, receipt) {
                console.log("Transaction Confirmation : ", confirmationNumber);
                console.log("Transaction Receipt : "+ receipt);
            })
            .on('error', console.error(" Error Event of transaction called ! "));

    });

    it("should late lock mega Prize : Positive Scenario   : lockMegaPrizeByAdmin() ", async () => {

        let gasEstimate = await multiprizer.methods.lockMegaPrizeByAdmin().estimateGas({from: accounts[0]});
        console.log(" lockMegaPrizeByAdmin() Invocation Gas : ",gasEstimate);
        await multiprizer.methods.lockMegaPrizeByAdmin().send({ from: accounts[0] })
            .on('transactionHash', function (hash) {
                console.log("Transaction Hash : ", hash);
            })
            .on('receipt', async function (receipt) {
                console.log("Transaction Receipt : "+ receipt);
                let gameData = await multiprizer.methods.getMegaPrizeByAdmin().call({ from: accounts[0] });
                if (gameData.isMegaPrizeLateLocked)
                    assert.ok(true);
                else
                    assert.fail("Error: megaPrize locked but gameData parameters dont match! ");

            })
            .on('confirmation', function (confirmationNumber, receipt) {
                console.log("Transaction Confirmation : ", confirmationNumber);
                console.log("Transaction Receipt : "+ receipt);
            })
            .on('error', console.error(" Error Event of transaction called ! "));

    });





});