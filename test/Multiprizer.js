
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

/**
    * @dev outputs the Cantor Pairing Function result of two input natural numbers 
    * Function: π(a,b)=1/2(a+b)(a+b+1)+b  
*/
contract("Multiprizer", accounts => {
    var multiprizer, instance;

    const cantorPairing = (a, b) => {
        return((((a+b)*(a+b+1))/2)+b);

    } 

    it("should be successfully deployed", async () => {
        let contract = await Multiprizer.deployed();
        instance = contract;
        multiprizer = await new web3.eth.Contract(contract.abi, contract.address);
        let balance = await web3.eth.getBalance(accounts[0]);
        multiprizer.options.gas = 1000000;
        if (multiprizer) {
            console.log("Account Number: ", accounts[0], "|  Account[0] Balance : ", balance);
            assert.ok(true);
        }
        else {
            assert.fail("Deployment of Multiprizer contract failed !");
        }

    });

    it("should add games by admin : positive scenario  : addGameByAdmin() ", async () => {

        let _gameProperties = [100, 100, 2e15, (60 * 60 * 24 * 2), (4 * 60 * 24 * 2), 5, 5000, 1000, 0, 0, 0, 1e14];
        let gasEstimate = await multiprizer.methods.addGameByAdmin(_gameProperties).estimateGas({ from: accounts[0] });
        console.log(" addGameByAdmin() Invocation Gas : ", gasEstimate);
        await instance.addGameByAdmin(_gameProperties, { from: accounts[0] })
            .then(async function (receipt) {
                console.log("Transaction Receipt : " + receipt);
                let gameData = await instance.gameStrategies(_gameProperties[0], { from: accounts[0] });
                if (gameData.gameID == _gameProperties[0])
                    assert.ok(true);
                else
                    assert.fail("Error: game added but gameData parameters dont match! ");

            })

    });

    it("should again add games by admin : positive scenario   : addGameByAdmin() ", async () => {

        let _gameProperties = [101, 400, 2e15, (60 * 60 * 24 * 2), (4 * 60 * 24 * 2), 5, 8000, 1000, 0, 0, 0, 1e14];
        let gasEstimate = await multiprizer.methods.addGameByAdmin(_gameProperties).estimateGas({ from: accounts[0] });
        console.log(" addGameByAdmin() Invocation Gas : ", gasEstimate);
        await instance.addGameByAdmin(_gameProperties, { from: accounts[0] })
            .then(async function (receipt) {
                console.log("Transaction Receipt : " + receipt);
                let gameData = await instance.gameStrategies(_gameProperties[0], { from: accounts[0] });
                if (gameData.gameID == _gameProperties[0])
                    assert.ok(true);
                else
                    assert.fail("Error: game added but gameData parameters dont match! ");

            })

    });

    it("should update games by admin : positive scenario   : updateGameByAdmin() ", async () => {

        let _gameProperties = [101, 305, 2e15, (60 * 50 * 24 * 2), (4 * 60 * 24 * 2), 7, 8000, 1000, 0, 0, 0, 1e14];
        let gasEstimate = await multiprizer.methods.updateGameByAdmin(_gameProperties).estimateGas({ from: accounts[0] });
        console.log(" updateGameByAdmin() Invocation Gas : ", gasEstimate);
        await instance.updateGameByAdmin(_gameProperties, { from: accounts[0] })
            .then(async function (receipt) {
                console.log("Transaction Receipt : " + receipt);
                let gameData = await instance.gameStrategies(_gameProperties[0], { from: accounts[0] });
                if (gameData.gameID == _gameProperties[0])
                    assert.ok(true);
                else
                    assert.fail("Error: game updated but gameData parameters dont match! ");

            })

    });

    it("should again update games by admin : positive scenario   : updateGameByAdmin() ", async () => {

        let _gameProperties = [100, 550, 2e14, (60 * 50 * 24 * 2), (4 * 60 * 24 * 2), 7, 8000, 1000, 0, 0, 0, 1e14];
        let gasEstimate = await multiprizer.methods.updateGameByAdmin(_gameProperties).estimateGas({ from: accounts[0] });
        console.log(" updateGameByAdmin() Invocation Gas : ", gasEstimate);
        await instance.updateGameByAdmin(_gameProperties, { from: accounts[0] })
            .then(async function (receipt) {
                console.log("Transaction Receipt : " + receipt);
                let gameData = await instance.gameStrategies(_gameProperties[0], { from: accounts[0] });
                if (gameData.gameID == _gameProperties[0])
                    assert.ok(true);
                else
                    assert.fail("Error: gamezzz updated but gameData parameters dont match! ");

            })

    });

    it("should close games by admin : positive scenario   : closeGameByAdmin() ", async () => {

        let _gameID = 101;
        let gasEstimate = await multiprizer.methods.closeGameByAdmin(_gameID).estimateGas({ from: accounts[0] });
        console.log(" closeGameByAdmin() Invocation Gas : ", gasEstimate);
        await instance.closeGameByAdmin(_gameID, { from: accounts[0] })
            .then(async function (receipt) {
                console.log("Transaction Receipt : " + receipt);
                let gameData = await instance.gameStrategies(_gameID, { from: accounts[0] });
                if (gameData.gameID != _gameID)
                    assert.ok(true);
                else
                    assert.fail("Error: game deleted but gameData parameters dont match! ");

            })

    });

    it("should resume a locked game : Positive Scenario   : unlockGamesByAdmin() ", async () => {

        let _gameProperties = [100];
        let gasEstimate = await multiprizer.methods.unlockGamesByAdmin(_gameProperties).estimateGas({ from: accounts[0] });
        console.log(" unlockGamesByAdmin() Invocation Gas : ", gasEstimate);
        await instance.unlockGamesByAdmin(_gameProperties, { from: accounts[0] })
            .then(async function (receipt) {
                console.log("Transaction Receipt : " + receipt);
                let gameData = await instance.gameStrategies(_gameProperties[0], { from: accounts[0] });
                if (!gameData.isLocked && !gameData.isLateLocked)
                    assert.ok(true);
                else
                    assert.fail("Error: game unlocked but gameData parameters dont match! ");

            })

    });

    it("should lock game : Positive Scenario   : lockGamesByAdmin() ", async () => {

        let _gameProperties = [100];
        let gasEstimate = await multiprizer.methods.lockGamesByAdmin(_gameProperties).estimateGas({ from: accounts[0] });
        console.log(" lockGamesByAdmin() Invocation Gas : ", gasEstimate);
        await instance.lockGamesByAdmin(_gameProperties, { from: accounts[0] })
            .then(async function (receipt) {
                console.log("Transaction Receipt : " + receipt);
                let gameData = await instance.gameStrategies(_gameProperties[0], { from: accounts[0] });
                if (gameData.isGameLateLocked)
                    assert.ok(true);
                else
                    assert.fail("Error: game locked but gameData parameters dont match! ");

            })

    });

    it("should Pause all games : Positive Scenario   : pauseAllGamesByAdmin() ", async () => {

        let gasEstimate = await multiprizer.methods.pauseAllGamesByAdmin().estimateGas({ from: accounts[0] });
        console.log(" pauseAllGamesByAdmin() Invocation Gas : ", gasEstimate);
        await instance.pauseAllGamesByAdmin({ from: accounts[0] })
            .then(async function (receipt) {
                console.log("Transaction Receipt : " + receipt);
                let gameIDs = await instance.viewGameIDs({ from: accounts[0] });
                let i, _gameID;
                for (i = 0; i < gameIDs.length; i++) {
                    _gameID = gameIDs[i];
                    let gameData = await instance.gameStrategies(_gameID, { from: accounts[0] });
                    if (!gameData.isGameLocked || !gameData.isGameLateLocked) {
                        assert.fail("Error: game paused but gameData parameters dont match! ");
                    }
                }
                assert.ok(true);

            })

    });

    it("should resume all games : Positive Scenario   : resumeAllGamesByAdmin() ", async () => {

        let gasEstimate = await multiprizer.methods.resumeAllGamesByAdmin().estimateGas({ from: accounts[0] });
        console.log(" resumeAllGamesByAdmin() Invocation Gas : ", gasEstimate);
        await instance.resumeAllGamesByAdmin({ from: accounts[0] })
            .then(async function (receipt) {
                console.log("Transaction Receipt : " + receipt);
                let gameIDs = await instance.viewGameIDs({ from: accounts[0] });
                let i, _gameID;
                for (i = 0; i < gameIDs.length; i++) {
                    _gameID = gameIDs[i];
                    let gameData = await instance.gameStrategies(_gameID, { from: accounts[0] });
                    if (gameData.isLocked || gameData.isLateLocked) {
                        assert.fail("Error: game paused but gameData parameters dont match! ");
                    }
                }
                assert.ok(true);

            })

    });

    it("should update the directPlay variables : Positive Scenario   : updateDirectPlayByAdmin() ", async () => {

        let _directPlayWithdrawValue = 1e15;
        let _isDirectPlayEnabled = true;
        let gasEstimate = await multiprizer.methods.updateDirectPlayByAdmin(_directPlayWithdrawValue, _isDirectPlayEnabled).estimateGas({ from: accounts[0] });
        console.log(" updateDirectPlayByAdmin() Invocation Gas : ", gasEstimate);
        await instance.updateDirectPlayByAdmin(_directPlayWithdrawValue, _isDirectPlayEnabled, { from: accounts[0] })
            .then(async function (receipt) {
                console.log("Transaction Receipt : " + receipt);
                let gameData = await instance.viewDirectPlayInfo({ from: accounts[0] });
                if (gameData._directPlayWithdrawValue == _directPlayWithdrawValue && gameData._isDirectPlayEnabled == _isDirectPlayEnabled)
                    assert.ok(true);
                else
                    assert.fail("Error: DirectPlay updated but gameData parameters dont match! ");

            })

    });

    it("should update the megaPrize variables : Positive Scenario   : updateMegaPrizeByAdmin() ", async () => {

        let _megaPrizeID = 900;
        let _megaPrizeAmount = 0;
        let _isMegaPrizeEnabled = false;
        let _isMegaPrizeLateLocked = true;
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
        ).estimateGas({ from: accounts[0] });

        console.log(" updateMegaPrizeByAdmin() Invocation Gas : ", gasEstimate);
        await instance.updateMegaPrizeByAdmin(
            _megaPrizeID,
            _megaPrizeAmount,
            _isMegaPrizeEnabled,
            _isMegaPrizeLateLocked,
            _isMegaPrizeMatured,
            _megaPrizeDurationInEpoch,
            _megaPrizeDurationInBlocks
            , { from: accounts[0] })
            .then(async function (receipt) {
                console.log("Transaction Receipt : " + receipt);
                let gameData = await instance.getMegaPrizeByAdmin({ from: accounts[0] });
                if (
                    gameData._megaPrizeID == _megaPrizeID &&
                    gameData._megaPrizeAmount == _megaPrizeAmount &&
                    gameData._isMegaPrizeEnabled == _isMegaPrizeEnabled &&
                    gameData._isMegaPrizeLateLocked == _isMegaPrizeLateLocked &&
                    gameData._isMegaPrizeMatured == _isMegaPrizeMatured &&
                    gameData._megaPrizeDurationInEpoch == _megaPrizeDurationInEpoch &&
                    gameData._megaPrizeDurationInBlocks == _megaPrizeDurationInBlocks
                ) {
                    assert.ok(true);
                }

                else
                    assert.fail("Error: megaPrize updated but gameData parameters dont match! ");

            })

    });

    it("should unlock or resume a locked mega Prize : Positive Scenario   : unlockMegaPrizeByAdmin() ", async () => {

        let gasEstimate = await multiprizer.methods.unlockMegaPrizeByAdmin().estimateGas({ from: accounts[0] });
        console.log(" unlockMegaPrizeByAdmin() Invocation Gas : ", gasEstimate);
        await instance.unlockMegaPrizeByAdmin({ from: accounts[0] })
            .then(async function (receipt) {
                console.log("Transaction Receipt : " + receipt);
                let gameData = await instance.getMegaPrizeByAdmin({ from: accounts[0] });
                if (gameData._isMegaPrizeLateLocked == false && gameData._isMegaPrizeEnabled)
                    assert.ok(true);
                else
                    assert.fail("Error: megaPrize unlocked but gameData parameters dont match! ");

            })

    });

    it("should late lock mega Prize : Positive Scenario   : lockMegaPrizeByAdmin() ", async () => {
        // this has to be further combined with winners calculation for integration testing

        let gasEstimate = await multiprizer.methods.lockMegaPrizeByAdmin().estimateGas({ from: accounts[0] });
        console.log(" lockMegaPrizeByAdmin() Invocation Gas : ", gasEstimate);
        await instance.lockMegaPrizeByAdmin({ from: accounts[0] })
            .then(async function (receipt) {
                console.log("Transaction Receipt : " + receipt);
                let gameData = await instance.getMegaPrizeByAdmin({ from: accounts[0] });
                if (gameData._isMegaPrizeLateLocked)
                    assert.ok(true);
                else
                    assert.fail("Error: megaPrize locked but gameData parameters dont match! ");

            })

    });

    it("should complete pending rounds and create new rounds : Positive Scenario   : completeRoundsByAdmin() ", async () => {
        // this has to be further combined with winners calculation for integration testing
        let _gameID = 102;
        let gasEstimate = await multiprizer.methods.completeRoundsByAdmin([_gameID]).estimateGas({ from: accounts[0] });
        console.log(" completeRoundsByAdmin() Invocation Gas : ", gasEstimate);
        await instance.completeRoundsByAdmin([_gameID], { from: accounts[0] })
            .then(async function (receipt) {
                console.log("Transaction Receipt : " + receipt);
                let gameData = await instance.gameStrategies(_gameID, { from: accounts[0] });
                let _currentRound = gameData.currentRound;
                if (gameData.currentRound != 0) {
                    assert.ok(true);
                }
                else {
                    assert.fail("Error: round completed but gameData not set ");
                }

            })

    });


    it("should initiate play game : Positive Scenario   : playGame() ", async () => {
        // this has to be further combined with winners calculation for integration testing
        let _gameID = 102;
        let _numberofTokens = 1;
        let _playerAddress = [accounts[2], accounts[3], accounts[4], accounts[5], accounts[6], accounts[5], accounts[3], accounts[7],
        accounts[2], accounts[6], accounts[7], accounts[8], accounts[6], accounts[7], accounts[8], accounts[8], accounts[6],
        accounts[8], accounts[2], accounts[2], accounts[4], accounts[3]];

        let gameData = await instance.gameStrategies(_gameID, { from: accounts[0] });
        let _currentRound = gameData.currentRound;

        let gasEstimate = await multiprizer.methods.playGame(_gameID, _numberofTokens)
            .estimateGas({ from: accounts[0], value: (gameData.tokenValue * _numberofTokens) });
        console.log(" playGame() Invocation Gas : ", gasEstimate);

        for (var j = 0; j < _playerAddress.length; j++) {

            await instance.playGame(_gameID, _numberofTokens, { from: _playerAddress[j], value: (gameData.tokenValue * _numberofTokens) });
            let rData = await instance.viewRoundInfo(_gameID, _currentRound, { from: accounts[0] });
            let _playerList = rData._playerList;
            let i=0;
            for (i = 0; i < _playerList.length; i++) {
                if (_playerList[i] == _playerAddress[j])
                    break;
            }

            if (i == _playerList.length)
                assert.fail("Error playGame : play game initiated but roundData parameters dont match! ");
            else {
                assert.ok(true);
            }

        }

        let rData = await instance.viewRoundInfo(_gameID, _currentRound, { from: accounts[0] });
        let _playerList = rData._playerList;
        console.log("Player List : ", _playerList);

    });

    it("should initiate revert game : Positive Scenario   : revertGame() ", async () => {
        // this has to be further combined with winners calculation for integration testing
        let _gameID = 102;
        let _numberofTokens = 1;
        let _playerAddress = accounts[2];

        let gameData = await instance.gameStrategies(_gameID, { from: accounts[0] });
        let _currentRound = gameData.currentRound.toNumber();

        let gasEstimate = await multiprizer.methods.revertGame(_gameID, _playerAddress)
            .estimateGas({ from: accounts[0]});
        console.log(" revertGame() Invocation Gas : ", gasEstimate);

        await instance.revertGame(_gameID, _playerAddress, { from: _playerAddress });
        let _roundID = cantorPairing(_gameID, _currentRound);
        //let _playerTokens = await instance.rounds(_roundID, playerTokens(_playerAddress), { from: accounts[0] });
        let rData = await instance.viewRoundInfo(_gameID, _currentRound, { from: accounts[0] });
        let _playerList = rData._playerList;
        let i=0;
            for (i = 0; i < _playerList.length; i++) {
                if (_playerList[i] == _playerAddress)
                    break;
            }

            if (i == _playerList.length)
                assert.ok(true);
            else {
                console.log("Error: Player data found though reverted : Player Address: ", _playerList[i], " Player tokens: ", __playerTokensList[i]);
                assert.fail("Error playGame : play game initiated but roundData parameters dont match! ");
            }
        

        //let rData = await instance.viewRoundInfo(_gameID, _currentRound, { from: accounts[0] });
        console.log("Player List : ", _playerList);

    });







    // Integration testing:: 
    // revertFundsToPlayers
    // resume all games




});