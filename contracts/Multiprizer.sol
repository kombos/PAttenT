/* 
KOMBOS
*/

pragma solidity ^0.5.0;

/**
 * @title Ownable (OpenZeppelin with additions)
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
    address payable private _owner;
    address payable private _timekeeper;

    event OwnershipTransferred(address payable indexed previousOwner, address payable indexed newOwner);
    event TimekeepingTransferred(address payable indexed previousTimekeeper, address payable indexed newTimekeeper);

    /**
     * @dev The Ownable constructor sets the original `owner` of the contract to the sender
     * account.
     */
    constructor() internal {
        _owner = msg.sender;
        emit OwnershipTransferred(address(0), _owner);
    }

    /**
     * @return the address of the owner.
     */
    function owner() public view returns(address payable) {
        return _owner;
    }

    /**
     * @return the address of the timekeeper.
     */
    function timekeeper() public view returns(address payable) {
        return _timekeeper;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(isOwner());
        _;
    }

    /**
     * @dev Throws if called by any account other than the owners (owner and timekeeper).
     */
    modifier onlyOwners() {
        require(isOwner() || isTimekeeper());
        _;
    }

    /**
     * @return true if `msg.sender` is the owner of the contract.
     */
    function isOwner() public view returns(bool) {
        return msg.sender == _owner;
    }

    /**
     * @return true if `msg.sender` is the timekeeper of the contract.
     */
    function isTimekeeper() public view returns(bool) {
        return msg.sender == _timekeeper;
    }

    /**
     * @dev Allows the current owner to transfer control of the contract to a newOwner.
     * @param newOwner The address to transfer ownership to.
     */
    function transferOwnership(address payable newOwner) public onlyOwner {
        require(newOwner != address(0));
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }

    /**
     * @dev Allows the current owners to transfer control of timekeeping to a newOwner.
     * @param newTimeKeeper The address to transfer ownership to.
     */
    function transferTimekeeping(address payable newTimeKeeper) public onlyOwners {
        require(newTimeKeeper != address(0));
        emit TimekeepingTransferred(_timekeeper, newTimeKeeper);
        _timekeeper = newTimeKeeper;
    }
}


/**
 * @title SafeMath (OpenZeppelin)
 * @dev Math operations with safety checks that revert on error
 */
library SafeMath {
    int256 constant private INT256_MIN = -2 ** 255;

    /**
    * @dev Multiplies two unsigned integers, reverts on overflow.
    */
    function mul(uint256 a, uint256 b) internal pure returns(uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b);

        return c;
    }

    /**
    * @dev Multiplies two signed integers, reverts on overflow.
    */
    function mul(int256 a, int256 b) internal pure returns(int256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
        if (a == 0) {
            return 0;
        }

        require(!(a == -1 && b == INT256_MIN)); // This is the only case of overflow not detected by the check below

        int256 c = a * b;
        require(c / a == b);

        return c;
    }

    /**
    * @dev Integer division of two unsigned integers truncating the quotient, reverts on division by zero.
    */
    function div(uint256 a, uint256 b) internal pure returns(uint256) {
        // Solidity only automatically asserts when dividing by 0
        require(b > 0);
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    /**
    * @dev Integer division of two signed integers truncating the quotient, reverts on division by zero.
    */
    function div(int256 a, int256 b) internal pure returns(int256) {
        require(b != 0); // Solidity only automatically asserts when dividing by 0
        require(!(b == -1 && a == INT256_MIN)); // This is the only case of overflow

        int256 c = a / b;

        return c;
    }

    /**
    * @dev Subtracts two unsigned integers, reverts on overflow (i.e. if subtrahend is greater than minuend).
    */
    function sub(uint256 a, uint256 b) internal pure returns(uint256) {
        require(b <= a);
        uint256 c = a - b;

        return c;
    }

    /**
    * @dev Subtracts two signed integers, reverts on overflow.
    */
    function sub(int256 a, int256 b) internal pure returns(int256) {
        int256 c = a - b;
        require((b >= 0 && c <= a) || (b < 0 && c > a));

        return c;
    }

    /**
    * @dev Adds two unsigned integers, reverts on overflow.
    */
    function add(uint256 a, uint256 b) internal pure returns(uint256) {
        uint256 c = a + b;
        require(c >= a);

        return c;
    }

    /**
    * @dev Adds two signed integers, reverts on overflow.
    */
    function add(int256 a, int256 b) internal pure returns(int256) {
        int256 c = a + b;
        require((b >= 0 && c >= a) || (b < 0 && c < a));

        return c;
    }

    /**
    * @dev Divides two unsigned integers and returns the remainder (unsigned integer modulo),
    * reverts when dividing by zero.
    */
    function mod(uint256 a, uint256 b) internal pure returns(uint256) {
        require(b != 0);
        return a % b;
    }
}


contract MultiprizerOraclizeAbstract {
    function newRandomDSQuery() external returns(bytes32 _queryId);
    //function priceOraclize() public returns(uint256 _priceOraclize);
}


/**
 * @title Multiprizer
 * @dev The Multiprizer contract is the core game.
 */

contract Multiprizer is Ownable {

    using SafeMath for uint256;

    struct Game {
        uint256 gameID;
        uint256 currentRound;
        uint256 maxTokens;
        uint256 tokenValue;
        uint256 gameDurationInEpoch;
        uint256 gameDurationInBlocks;
        uint256 maxTokensPerPlayer;
        uint256 houseEdge;
        uint256 megaPrizeEdge;
        uint256 totalValueForGame;
        uint256 totalWinnings;
        bool isGameLocked;
        bool isGameLateLocked;
    }

    struct Round {
        uint256 gameID;
        uint256 roundNumber;
        uint256 totalTokensPurchased;
        uint256 roundStartTimeSecs;
        uint256 roundStartTimeBlock;
        mapping(address => uint256) playerTokens;
        address payable[] playerList;
        address payable winner;
        bytes32 oraclizeID;
        bytes oraclizeProof;
        bool isRoundOpen;
    }

    /** 
    *  DirectPlay & Control Variables 
    *  @dev DirectPlay enables a player to place a single token for any of the strategy games   
    *  execute manual withdraw of your prizes won by sending directPlayWithdraw value of ethers. 
      */
    uint256 constant private DIVISOR_POWER_5 = 100000;
    uint256 private directPlayWithdrawValue;
    uint256 private directPlayTokenGas;
    bool private isDirectPlayEnabled;

    /** 
    *  Game Variables 
    *  @dev DirectPlay enables a player to place a single token for any of the strategy games   
    *  execute manual withdraw of your prizes won by sending directPlayWithdraw value of ethers. 
      */
    mapping(uint256 => Round) public rounds;
    mapping(uint256 => Game) public gameStrategies;
    uint256[] private gameStrategiesKeys;
    mapping(address => uint256) private playerWithdrawals;
    address payable[] private playerWithdrawalsKeys;

    /** 
    *  Oraclize Variables 
    *  @dev DirectPlay enables a player to place a single token for any of the strategy games   
    *  execute manual withdraw of your prizes won by sending directPlayWithdraw value of ethers. 
      */
    mapping(bytes32 => uint256) private roundOfOraclizeID;
    MultiprizerOraclizeAbstract private multiprizerOraclize;
    address payable public oraclizeAddress;

    /** 
    *  MegaPrize Variables 
    *  @dev DirectPlay enables a player to place a single token for any of the strategy games   
    *  execute manual withdraw of your prizes won by sending directPlayWithdraw value of ethers. 
      */
    mapping(uint256 => uint256) private megaPrizeAmount;
    mapping(uint256 => address payable[]) private megaPrizePlayersKeys;
    mapping(uint256 => uint256[]) private megaPrizePlayers;
    mapping(uint256 => bytes32) private megaPrizeOraclizeID;
    mapping(bytes32 => uint256) private mpNumberOfOraclizeID;
    address payable[] private megaPrizeWinners;
    uint256 private megaPrizeNumber;
    uint256 private megaPrizeDurationInEpoch;
    uint256 private megaPrizeDurationInBlocks;
    uint256 private megaPrizeStartTimeSecs;
    bool private isMegaPrizeEnabled;
    bool private isMegaPrizeLateLocked;
    bool private isMegaPrizeMatured;

    /** 
    *  Event Logs 
    *  @dev DirectPlay enables a player to place a single token for any of the strategy games   
    *  execute manual withdraw of your prizes won by sending directPlayWithdraw value of ethers. 
      */
    event LogPlayGame(uint256 indexed gameID, uint256 indexed roundNumber, address playerAddress, 
        uint256 playerTokens, uint256 timeSecs, uint256 timeBlock);

    event LogRevertGame(uint256 indexed gameID, uint256 indexed roundNumber, address playerAddress, 
        uint256 playerTokens, uint256 timeSecs, uint256 timeBlock);

    event LogCompleteRound(uint256 gameID, uint256 roundNumber, uint256 numPlayers, uint256 timeSecs, uint256 timeBlock);
    event LogCompleteMPRound(uint256 megaPrizeNumber, uint256 numPlayers, uint256 timeSecs, uint256 timeBlock);
    event LogGameLocked(uint256 gameID, uint256 roundNumber, uint256 timeSecs, uint256 timeBlock);
    event LogGameUnlocked(uint256 gameID, uint256 roundNumber, uint256 timeSecs, uint256 timeBlock);

    event LogWinner(uint256 gameID, uint256 roundNumber, address winnerAddress, uint256 winnerAmount, 
        uint256 timeSecs, uint256 timeBlock);

    event LogMegaPrizeWinner(uint256 megaPrizeNumber, address megaPrizeWinner, uint256 megaPrizeAmount, 
        uint256 timeSecs, uint256 timeBlock);

    event LogMegaPrizeUpdate(uint256 megaPrizeNumber, uint256 megaPrizeAmount, uint256 timeSecs, uint256 timeBlock);

    /** 
    *  Constructor call 
    *  @dev DirectPlay enables a player to place a single token for any of the strategy games   
    *  execute manual withdraw of your prizes won by sending directPlayWithdraw value of ethers. 
      */
    constructor() public {
        // set DirectPlay parameters
        isDirectPlayEnabled = true;
        directPlayWithdrawValue = 234560000000000;
        directPlayTokenGas = 234567;
        // set MegaPrize parameters. Duration set to 7 days as default
        megaPrizeNumber = 1;
        isMegaPrizeEnabled = false;
        isMegaPrizeMatured = false;
        isMegaPrizeLateLocked = true;
        megaPrizeDurationInEpoch = 604800;
        megaPrizeDurationInBlocks = 40320;
    }

    /**
        * @dev Adds a new Game with the following game properties defined in the 
        * array _gameProperties: 
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
    */
    function addGameByAdmin(uint256[11]calldata _gameProperties) external
    onlyOwner {

        require(gameStrategies[_gameProperties[0]].gameID == 0, "gameID_err");
        require(_gameProperties[0] != 0 && _gameProperties[1] != 0 &&
            _gameProperties[2] != 0 && _gameProperties[5] < _gameProperties[1] &&
            _gameProperties[6] < DIVISOR_POWER_5 && _gameProperties[7] < DIVISOR_POWER_5,
            "param_err");
        require(_gameProperties[3] != 0 || _gameProperties[4] != 0, "time_err");

        Game memory gameObj;
        gameObj.gameID = _gameProperties[0];
        gameObj.maxTokens = _gameProperties[1];
        gameObj.tokenValue = _gameProperties[2];
        gameObj.gameDurationInEpoch = _gameProperties[3];
        gameObj.gameDurationInBlocks = _gameProperties[4];
        gameObj.maxTokensPerPlayer = _gameProperties[5];
        gameObj.houseEdge = _gameProperties[6];
        gameObj.megaPrizeEdge = _gameProperties[7];
        gameObj.currentRound = _gameProperties[8];
        gameObj.totalValueForGame = _gameProperties[9];
        gameObj.totalWinnings = _gameProperties[10];
        gameObj.isGameLocked = true;
        gameObj.isGameLateLocked = true;
        gameStrategies[gameObj.gameID] = gameObj;
        gameStrategiesKeys.push(gameObj.gameID);
        //# EMIT EVENT LOG - to be done
    }

    function updateGameByAdmin(uint256[11]calldata _gameProperties) external
    onlyOwner {

        uint256 _gameID = _gameProperties[0];
        require(_gameProperties[0] != 0 && _gameProperties[1] != 0 && _gameProperties[2] != 0 && 
        _gameProperties[5] < _gameProperties[1] && _gameProperties[6] < DIVISOR_POWER_5 && 
        _gameProperties[7] < DIVISOR_POWER_5, "param_err");
        require(_gameProperties[3] != 0 || _gameProperties[4] != 0, "time_err");
        require(gameStrategies[_gameID].gameID != 0, "gameID_err");
        /* game should be in both locked mode and late locked mode. 
        This would prove the round had finished before it was locked for update.  */
        require(gameStrategies[_gameID].isGameLocked && gameStrategies[_gameID].isGameLateLocked,
            "not_locked");

        // update the values in gameStrategies type
        gameStrategies[_gameID].maxTokens = _gameProperties[1];
        gameStrategies[_gameID].tokenValue = _gameProperties[2];
        gameStrategies[_gameID].gameDurationInEpoch = _gameProperties[3];
        gameStrategies[_gameID].gameDurationInBlocks = _gameProperties[4];
        gameStrategies[_gameID].maxTokensPerPlayer = _gameProperties[5];
        gameStrategies[_gameID].houseEdge = _gameProperties[6];
        gameStrategies[_gameID].megaPrizeEdge = _gameProperties[7];
        gameStrategies[_gameID].currentRound = _gameProperties[8];
        gameStrategies[_gameID].totalValueForGame = _gameProperties[9];
        gameStrategies[_gameID].totalWinnings = _gameProperties[10];
        gameStrategies[_gameID].isGameLocked = true;
        gameStrategies[_gameID].isGameLateLocked = true;
        //# EMIT EVENT LOG - to be done
    }

    function closeGameByAdmin(uint256 _gameID) external
    onlyOwner {

        require(gameStrategies[_gameID].gameID != 0, "gameID_err");
        /* game should be in both locked mode and late locked mode. 
        This would prove the round had finished before it was locked for closure.  */
        require(gameStrategies[_gameID].isGameLocked && gameStrategies[_gameID].isGameLateLocked,
            "not_locked");
        uint256 i;
        bool _success = false;
        // delete the Game data type in gameStrategies
        delete gameStrategies[_gameID];
        // remove the gameID from gameStrategiesKeys, and shift positions of remaining gameIDs
        for (i = 0; i < (gameStrategiesKeys.length); i++) {
            if (gameStrategiesKeys[i] == _gameID) {
                _success = true;
            }
            if (_success == true && i < (gameStrategiesKeys.length).sub(1)) {
                gameStrategiesKeys[i] = gameStrategiesKeys[i + (1)];
            }
        }
        if (_success == true)
            gameStrategiesKeys.length = (gameStrategiesKeys.length).sub(1);
    }

    function setOraclizeByAdmin(address payable _contractAddress) external
    onlyOwners {
        multiprizerOraclize = MultiprizerOraclizeAbstract(_contractAddress);
        oraclizeAddress = _contractAddress;
    }

    function updateDirectPlayByAdmin(uint256 _directPlayWithdrawValue, uint256 _directPlayTokenGas, bool _isDirectPlayEnabled) external
    onlyOwners {
        directPlayWithdrawValue = _directPlayWithdrawValue;
        directPlayTokenGas = _directPlayTokenGas;
        isDirectPlayEnabled = _isDirectPlayEnabled;
    }

    function updateMegaPrizeByAdmin(
        uint256 _megaPrizeAmount,
        uint256 _megaPrizeDurationInEpoch,
        uint256 _megaPrizeDurationInBlocks) external payable
    onlyOwners {
        // megaprize funds infused should be the same as mentioned in _megaPrizeAmount
        require(_megaPrizeAmount == msg.value, "funds_err");
        require(_megaPrizeDurationInEpoch != 0 || _megaPrizeDurationInBlocks != 0, "time_err");
        require(!isMegaPrizeEnabled && isMegaPrizeLateLocked,
            "not_locked");
        // note that admins cannot deduct the mega prize amount, only infuse additional amount to it.
        megaPrizeAmount[megaPrizeNumber] += (_megaPrizeAmount);
        megaPrizeDurationInEpoch = _megaPrizeDurationInEpoch;
        megaPrizeDurationInBlocks = _megaPrizeDurationInBlocks;
        emit LogMegaPrizeUpdate(megaPrizeNumber, megaPrizeAmount[megaPrizeNumber], now, block.number);
    }

    function unlockGamesByAdmin(uint256[] calldata _gameIDs) external
    onlyOwners {
        // specific games are unlocked by admin to resume rounds.
        uint256 _roundNumber;
        uint256 _roundID;
        for (uint256 i = 0; i < _gameIDs.length; i++) {
            require(gameStrategies[_gameIDs[i]].gameID != 0, "gameID_err");
            if (!gameStrategies[_gameIDs[i]].isGameLocked) continue;
            gameStrategies[_gameIDs[i]].isGameLocked = false;
            gameStrategies[_gameIDs[i]].isGameLateLocked = false;
            _roundNumber = gameStrategies[_gameIDs[i]].currentRound == 0 ? 1 : gameStrategies[_gameIDs[i]].currentRound;
            gameStrategies[_gameIDs[i]].currentRound = _roundNumber;
            _roundID = cantorPairing(_gameIDs[i], _roundNumber);
            rounds[_roundID].gameID = _gameIDs[i];
            rounds[_roundID].roundNumber = _roundNumber;
            rounds[_roundID].roundStartTimeSecs = now;
            rounds[_roundID].roundStartTimeBlock = block.number;
            rounds[_roundID].isRoundOpen = true;
            emit LogGameUnlocked(_gameIDs[i], _roundNumber, now, block.number);
        }
    }

    function lockGamesByAdmin(uint256[] calldata _gameIDs) external
    onlyOwners {
        // specific games are 'late locked' by admin to make sure that locking happens 
        // only after the round has completed.
        for (uint256 i = 0; i < _gameIDs.length; i++) {
            require(gameStrategies[_gameIDs[i]].gameID != 0, "gameID_err");
            gameStrategies[_gameIDs[i]].isGameLateLocked = true;
        }
    }

    function playGame(uint256 _gameID, uint256 _numberOfTokens) public
    payable {
        // _gameID should be valid
        require(gameStrategies[_gameID].gameID != 0 && _numberOfTokens != 0, "param_err");
        // game should not be in locked mode
        require(!gameStrategies[_gameID].isGameLocked,
            "locked");
        // get the current round number of the specified game.
        uint256 _roundNumber = gameStrategies[_gameID].currentRound;
        // zero check for _roundNumber and _numberOfTokens
        require(_roundNumber != 0, "round_zero");
        // ethers value sent should be equal to token value
        require(msg.value == _numberOfTokens.mul(gameStrategies[_gameID].tokenValue),
            "funds_err");
        // get the unique roundID value from the _gameID & _roundNumber pair (pairing function)
        uint256 _roundID = cantorPairing(_gameID, _roundNumber);
        // game round (_roundNumber) should be active
        require(rounds[_roundID].isRoundOpen == true, "game_inactive");
        // check if the totalTokensPurchased for the round doesn't cross maxTokens for the game 
        require(_numberOfTokens + (rounds[_roundID].totalTokensPurchased) <= gameStrategies[_gameID].maxTokens,
            "max_exceeded");
        // _numberOfTokens should be a valid value as per game strategy
        require(_numberOfTokens + (rounds[_roundID].playerTokens[msg.sender]) <= 
            gameStrategies[_gameID].maxTokensPerPlayer, "buy_exceeded");

        if (rounds[_roundID].playerTokens[msg.sender] == 0) {
            rounds[_roundID].playerList.push(msg.sender);
        }
        rounds[_roundID].playerTokens[msg.sender] += (_numberOfTokens);
        rounds[_roundID].totalTokensPurchased += (_numberOfTokens);
        // consider for megaPrize
        if (isMegaPrizeEnabled) {
            uint256 i;
            for (i = 0; i < megaPrizePlayersKeys[megaPrizeNumber].length; i++) {
                if (megaPrizePlayersKeys[megaPrizeNumber][i] == msg.sender) {
                    break;
                }
            }
            if (i == megaPrizePlayersKeys[megaPrizeNumber].length) {
                megaPrizePlayersKeys[megaPrizeNumber].push(msg.sender);
                megaPrizePlayers[megaPrizeNumber].push(_numberOfTokens);
            } else {
                megaPrizePlayers[megaPrizeNumber][i] += _numberOfTokens;
            }

        }
        //# EMIT EVENT LOG - to be done
        emit LogPlayGame(_gameID, _roundNumber, msg.sender, _numberOfTokens, now, block.number);
    }

    //revert active tokens at play back to the players
    function revertGame(uint256 _gameID, address payable _playerAddress) public {
        // _gameID should be valid
        require(gameStrategies[_gameID].gameID != 0, "gameID_err");
        // check the validity of sender address / player address
        require(msg.sender == owner() || msg.sender == timekeeper() || msg.sender == _playerAddress, "addr_err");
        // get the current round number of the specified game.
        uint256 _roundNumber = gameStrategies[_gameID].currentRound;
        // zero check for _roundNumber
        require(_roundNumber != 0, "round_zero");
        // get the unique roundID value from the _gameID & _roundNumber pair (pairing function)
        uint256 _roundID = cantorPairing(_gameID, _roundNumber);
        uint256 _playerTokens = rounds[_roundID].playerTokens[_playerAddress];
        // game round (_roundNumber) should be active
        require(rounds[_roundID].isRoundOpen == true, "game_inactive");
        // _numberOfTokens should be a valid value as per game strategy
        require(_playerTokens > 0,
            "no_tokens");

        uint256 i;
        // remove tokens from megaPrize consideration
        if (isMegaPrizeEnabled) {
            for (i = 0; i < megaPrizePlayersKeys[megaPrizeNumber].length; i++) {
                if (megaPrizePlayersKeys[megaPrizeNumber][i] == _playerAddress) {
                    megaPrizePlayers[megaPrizeNumber][i] = megaPrizePlayers[megaPrizeNumber][i].sub(_playerTokens);
                    if (megaPrizePlayers[megaPrizeNumber][i] == 0) {
                        // remove the megaprize entry of that player
                        megaPrizePlayersKeys[megaPrizeNumber][i] = megaPrizePlayersKeys[megaPrizeNumber][megaPrizePlayersKeys[megaPrizeNumber].length - 1];
                        megaPrizePlayersKeys[megaPrizeNumber].length = megaPrizePlayersKeys[megaPrizeNumber].length.sub(1);
                        megaPrizePlayers[megaPrizeNumber][i] = megaPrizePlayers[megaPrizeNumber][megaPrizePlayers[megaPrizeNumber].length - 1];
                        megaPrizePlayers[megaPrizeNumber].length = megaPrizePlayers[megaPrizeNumber].length.sub(1);
                    }
                    break;
                }
            }
        }
        // refund the amount placed 
        uint256 _refundAmount = (_playerTokens) * ((gameStrategies[_gameID].tokenValue));
        rounds[_roundID].totalTokensPurchased = (rounds[_roundID].totalTokensPurchased).sub(_playerTokens);
        delete rounds[_roundID].playerTokens[_playerAddress];
        // remove the entry of _playerAddress from playerList array of the round
        uint256 _playerListLength = rounds[_roundID].playerList.length;
        for (i = 0; i < _playerListLength; i++) {
            if (rounds[_roundID].playerList[i] == _playerAddress) {
                rounds[_roundID].playerList[i] = rounds[_roundID].playerList[_playerListLength.sub(1)];
                break;
            }
        }

        if (i != _playerListLength) {
            rounds[_roundID].playerList.length = (rounds[_roundID].playerList.length).sub(1);
        } else {
            revert("revert_revert");
        }
        // Send the refund amount to the player address and log event
        safeSend(_playerAddress, _refundAmount);
        emit LogRevertGame(_gameID, _roundNumber, _playerAddress, _playerTokens, now, block.number);
    }

    function unlockMegaPrizeByAdmin() external
    onlyOwners {
        // reset megaPrizeStartTimeSecs only if Mega Prize is set to locked (and not just late-locked)
        if (isMegaPrizeLateLocked == true && isMegaPrizeEnabled == false) {
            megaPrizeStartTimeSecs = now;
        }
        isMegaPrizeLateLocked = false;
        isMegaPrizeEnabled = true;
    }

    function lockMegaPrizeByAdmin() external
    onlyOwners {
        isMegaPrizeLateLocked = true;
    }

    function completeMegaPrizeRoundByAdmin() external
    onlyOwners {
        if (isMegaPrizeEnabled) {
            // emit mega prize round completion event
            emit LogCompleteMPRound(megaPrizeNumber, megaPrizePlayersKeys[megaPrizeNumber].length, now, block.timestamp);
            // generate oraclize ID and move to the next round
            if (megaPrizePlayersKeys[megaPrizeNumber].length > 1 && megaPrizeAmount[megaPrizeNumber] > 0) {
                isMegaPrizeMatured = true;
                bytes32 _oraclizeID = multiprizerOraclize.newRandomDSQuery();
                megaPrizeOraclizeID[megaPrizeNumber] = _oraclizeID;
                mpNumberOfOraclizeID[_oraclizeID] = megaPrizeNumber;
                megaPrizeNumber += 1;
            } else {
                megaPrizeNumber += 1;
                megaPrizeAmount[megaPrizeNumber] += megaPrizeAmount[megaPrizeNumber.sub(1)];
                delete megaPrizeAmount[megaPrizeNumber.sub(1)];
            }
            // lock the next mega prize round if isMegaPrizeLateLocked flag is set
            if (isMegaPrizeLateLocked) {
                isMegaPrizeEnabled = false;
            } else {
                megaPrizeStartTimeSecs = now;
            }
        }
    }

    function completeRoundByAdmin(uint256 _gameID) external
    onlyOwners {
        // gameIDs should be valid
        require(gameStrategies[_gameID].gameID != 0, "gameID_err");
        // exit if game is already locked
        if (gameStrategies[_gameID].isGameLocked) {
            return;
        }
        uint256 _roundNumber;
        uint256 _nextRoundNumber;
        uint256 _roundID;
        uint256 _nextRoundID;
        address payable _playerAddress;
        bytes32 _oraclizeID;
        // close the current round if not already closed
        _roundNumber = gameStrategies[_gameID].currentRound;
        _roundID = (_roundNumber == 0) ? 0 : cantorPairing(_gameID, _roundNumber);
        // to close the current round requires it to be not already closed or not 0
        if (_roundNumber != 0 && rounds[_roundID].isRoundOpen) {
            // set oraclizeID only if the number of players is more than 1
            emit LogCompleteRound(_gameID, _roundNumber, rounds[_roundID].playerList.length, now, block.number);
            if (rounds[_roundID].playerList.length > 1) {
                // generate oraclizeID
                _oraclizeID = multiprizerOraclize.newRandomDSQuery();
                // if _oraclizeID is still 0, revert
                if (_oraclizeID == bytes32(0)) {
                    revert("oraclize_zero");
                }
                // store the oraclizeID for the relevant game (GameID)
                rounds[_roundID].oraclizeID = _oraclizeID;
                roundOfOraclizeID[_oraclizeID] = _roundID;

            } else { // else if number of players is 1 or 0, revertGame and refund player's tokens
                if (rounds[_roundID].playerList.length == 1) {
                    _playerAddress = rounds[_roundID].playerList[0];
                    revertGame(_gameID, _playerAddress);
                }
            }
            // close the current round flag
            rounds[_roundID].isRoundOpen = false;
        }
        // increment the round number and start a new round
        _nextRoundNumber = _roundNumber + (1);
        gameStrategies[_gameID].currentRound = _nextRoundNumber;
        _nextRoundID = cantorPairing(_gameID, _nextRoundNumber);
        rounds[_nextRoundID].roundNumber = _nextRoundNumber;
        //rounds[_nextRoundID].totalTokensPurchased = 0;
        if (gameStrategies[_gameID].isGameLateLocked) {
            gameStrategies[_gameID].isGameLocked = true;
            emit LogGameLocked(_gameID, _roundNumber, now, block.number);
        } else {
            rounds[_nextRoundID].gameID = gameStrategies[_gameID].gameID;
            rounds[_nextRoundID].roundStartTimeSecs = now;
            rounds[_nextRoundID].roundStartTimeBlock = block.number;
            rounds[_nextRoundID].isRoundOpen = true;
        }
    }

    function calculateWinnerByOracle(
        bytes32 _oraclizeID,
        bytes calldata _result,
        bool _isProofValid) external
    {
        require(msg.sender == oraclizeAddress, "addr_err");
        // if the oraclize ID is meant for game rounds
        // SOMETHING WRONG WITH USIING ROUNDSOFORACLIZEID FOR BOTH MEGAPRIZE AND GAME
        uint256 _roundID = roundOfOraclizeID[_oraclizeID];
        if (_roundID != 0) {
            if (rounds[_roundID].winner != address(0)) {
                return;
            }
            if (!_isProofValid) {
                //uint256 _priceOraclize = multiprizerOraclize.priceOraclize();
                //playerWithdrawals[owner()] -= _priceOraclize;
                bytes32 newOraclizeID = multiprizerOraclize.newRandomDSQuery();
                rounds[_roundID].oraclizeID = newOraclizeID;
                roundOfOraclizeID[newOraclizeID] = _roundID;
                delete roundOfOraclizeID[_oraclizeID];
                return;
            }
            // get the Provable Oraclize Random Number and mod it to the length of totalTokensPurchased  (or gameSlab)
            uint256 _oraclizeRandomNumber = uint256(keccak256(_result)).mod(rounds[_roundID].totalTokensPurchased).add(1);
            // find the winner using Provable Oraclize Random Number
            for (uint256 j = 0; j < rounds[_roundID].playerList.length; j++) {
                for (uint256 k = 0; k < rounds[_roundID].playerTokens[(rounds[_roundID].playerList[j])]; k++) {
                    _oraclizeRandomNumber = _oraclizeRandomNumber.sub(1);
                    if (_oraclizeRandomNumber == 0) {
                        rounds[_roundID].winner = rounds[_roundID].playerList[j];
                        break;
                    }
                }
                if (rounds[_roundID].winner != address(0)) {
                    break;
                }
            }
            //rounds[roundOfOraclizeID[_oraclizeID]].oraclizeProof = _oraclizeProof;
            // compensate the winner and deduct houseEdge and megaPrizeEdge in a seperate private function
            compensateWinner(_oraclizeID);
        } else {
            // else if the oraclize ID is meant for megaprize
            uint256 _megaPrizeNumber = mpNumberOfOraclizeID[_oraclizeID];
            if (isMegaPrizeMatured && megaPrizeOraclizeID[_megaPrizeNumber] == _oraclizeID) {
                if (!_isProofValid) {
                    bytes32 newOraclizeID = multiprizerOraclize.newRandomDSQuery();
                    megaPrizeOraclizeID[_megaPrizeNumber] = newOraclizeID;
                    mpNumberOfOraclizeID[newOraclizeID] = _megaPrizeNumber;
                    delete mpNumberOfOraclizeID[_oraclizeID];
                    return;
                }
                uint256 _oraclizeRandomNumber = uint256(keccak256(_result)).mod(megaPrizePlayersKeys[_megaPrizeNumber].length);
                // find the mega prize winner address using Provable Random Number from Oraclize 
                address payable _megaPrizeWinner = megaPrizePlayersKeys[_megaPrizeNumber][_oraclizeRandomNumber];
                megaPrizeWinners.push(_megaPrizeWinner);
                uint256 _megaPrizeAmount = megaPrizeAmount[_megaPrizeNumber];
                delete megaPrizePlayersKeys[_megaPrizeNumber];
                delete megaPrizePlayers[_megaPrizeNumber];
                delete mpNumberOfOraclizeID[megaPrizeOraclizeID[_megaPrizeNumber]];
                delete megaPrizeOraclizeID[_megaPrizeNumber];
                delete megaPrizeAmount[_megaPrizeNumber];
                emit LogMegaPrizeWinner(_megaPrizeNumber, _megaPrizeWinner, _megaPrizeAmount, now, block.number);
                // reset all megaPrize storage variable values pertaining to players
                isMegaPrizeMatured = false;
                // safeSend the relevant mega prize amount to the mega prize winner
                safeSend(_megaPrizeWinner, _megaPrizeAmount);
            }
        }
    }

    /**
        * @dev sends the winning amount of ethers to the required winner address
        * Make sure all the state changes are already committed prior to invocation. 
    */
    function compensateWinner(bytes32 _oraclizeID) private {
        uint256 _gameID;
        uint256 _roundID;
        uint256 _totalValuePurchased;
        address payable _winnerAddress;
        uint256 _winnerAmount;
        uint256 _houseEdgeAmount;
        uint256 _megaPrizeEdgeAmount;

        _roundID = roundOfOraclizeID[_oraclizeID];
        _gameID = rounds[_roundID].gameID;
        _winnerAddress = rounds[_roundID].winner;
        _totalValuePurchased = gameStrategies[_gameID].tokenValue * (rounds[_roundID].totalTokensPurchased);
        gameStrategies[_gameID].totalValueForGame = (gameStrategies[_gameID].totalValueForGame) + (_totalValuePurchased);
        // transfer the prize amount to winner, after deducting house edge and megaprize edge
        _megaPrizeEdgeAmount = isMegaPrizeEnabled ? (_totalValuePurchased * (gameStrategies[_gameID].megaPrizeEdge)).div(DIVISOR_POWER_5) : 0;
        _houseEdgeAmount = ((_totalValuePurchased * (gameStrategies[_gameID].houseEdge)).div(DIVISOR_POWER_5)).sub(_megaPrizeEdgeAmount);
        _winnerAmount = _totalValuePurchased.sub((_houseEdgeAmount + (_megaPrizeEdgeAmount)));
        gameStrategies[_gameID].totalWinnings = (gameStrategies[_gameID].totalWinnings) + (_winnerAmount);
        // transfer the house edge to the house account
        if (playerWithdrawals[owner()] == 0) {
            playerWithdrawalsKeys.push(owner());
        }
        playerWithdrawals[owner()] = playerWithdrawals[owner()] + (_houseEdgeAmount);
        megaPrizeAmount[megaPrizeNumber] += (_megaPrizeEdgeAmount);
        // send the winning amount to the winner using safeSend
        safeSend(_winnerAddress, _winnerAmount);
        //# EMIT EVENT LOG - Transfer unsuccessful, use pull withdrawals mechanism
        emit LogWinner(_gameID, rounds[_roundID].roundNumber, _winnerAddress, _winnerAmount, now, block.number);
    }

    function viewDirectPlayInfo() external view
    returns(
        uint256 _directPlayWithdrawValue,
        uint256 _directPlayTokenGas,
        bool _isDirectPlayEnabled
    ) {
        _directPlayWithdrawValue = directPlayWithdrawValue;
        _directPlayTokenGas = directPlayTokenGas;
        _isDirectPlayEnabled = isDirectPlayEnabled;
    }

    function viewMegaPrizeInfo() external view
    returns(
        uint256 _megaPrizeStartTimeSecs,
        uint256 _megaPrizeAmount,
        uint256 _megaPrizeNumber,
        uint256 _megaPrizeDurationInEpoch,
        uint256 _megaPrizeDurationInBlocks,
        bool _isMegaPrizeEnabled
    ) {
        _megaPrizeStartTimeSecs = megaPrizeStartTimeSecs;
        _megaPrizeAmount = megaPrizeAmount[megaPrizeNumber];
        _megaPrizeNumber = megaPrizeNumber;
        _megaPrizeDurationInEpoch = megaPrizeDurationInEpoch;
        _megaPrizeDurationInBlocks = megaPrizeDurationInBlocks;
        _isMegaPrizeEnabled = isMegaPrizeEnabled;
    }

    function viewWithdrawalInfo(address payable _playerAddress) external view
    returns(uint256 _amount) {
        _amount = playerWithdrawals[_playerAddress];
    }

    function viewRoundInfo(uint256 gameID, uint256 roundNumber) external view
    returns(
        uint256 _gameID,
        uint256 _roundNumber,
        uint256 _totalTokensPurchased,
        uint256 _roundStartTimeSecs,
        uint256 _roundStartTimeBlock,
        address payable[] memory _playerList,
        uint256[] memory _playerTokensList,
        address payable _winner,
        bool _isRoundOpen
    ) {
        // gameID should be valid
        require(gameStrategies[gameID].gameID != 0, "gameID_err");
        // check roundNumber is valid and not the current round number
        require(roundNumber != 0,
            "round_zero");
        // get the unique roundID value from the gameID & roundNumber pair (pairing function)
        uint256 roundID = cantorPairing(gameID, roundNumber);
        _gameID = rounds[roundID].gameID;
        _roundNumber = rounds[roundID].roundNumber;
        _totalTokensPurchased = rounds[roundID].totalTokensPurchased;
        _roundStartTimeSecs = rounds[roundID].roundStartTimeSecs;
        _roundStartTimeBlock = rounds[roundID].roundStartTimeBlock;
        _playerList = rounds[roundID].playerList;
        _playerTokensList = new uint256[](_playerList.length);
        for (uint256 i = 0; i < rounds[roundID].playerList.length; i++) {
            _playerTokensList[i] = rounds[roundID].playerTokens[_playerList[i]];
        }
        _winner = rounds[roundID].winner;
        _isRoundOpen = rounds[roundID].isRoundOpen;
    }

    function viewGameIDs() external view
    returns(
        uint256[] memory _gameIDs,
        uint256 _gameIDsLength
    ) {
        _gameIDsLength = gameStrategiesKeys.length;
        _gameIDs = new uint256[](_gameIDsLength);
        for (uint256 i = 0; i < _gameIDsLength; i++) {
            _gameIDs[i] = gameStrategies[gameStrategiesKeys[i]].gameID;
        }
    }

    function getMegaPrizeByAdmin() external view
    onlyOwners returns(
        uint256 _megaPrizeStartTimeSecs,
        uint256 _megaPrizeAmount,
        uint256 _megaPrizeNumber,
        uint256 _megaPrizeDurationInEpoch,
        uint256 _megaPrizeDurationInBlocks,
        address payable[] memory _megaPrizePlayersKeys,
        address payable[] memory _megaPrizeWinners,
        bool _isMegaPrizeEnabled,
        bool _isMegaPrizeLateLocked,
        bool _isMegaPrizeMatured
    ) {
        _megaPrizeStartTimeSecs = megaPrizeStartTimeSecs;
        _megaPrizeAmount = megaPrizeAmount[megaPrizeNumber];
        _megaPrizeNumber = megaPrizeNumber;
        _megaPrizeDurationInEpoch = megaPrizeDurationInEpoch;
        _megaPrizeDurationInBlocks = megaPrizeDurationInBlocks;
        _megaPrizePlayersKeys = megaPrizePlayersKeys[megaPrizeNumber];
        _megaPrizeWinners = megaPrizeWinners;
        _isMegaPrizeEnabled = isMegaPrizeEnabled;
        _isMegaPrizeLateLocked = isMegaPrizeLateLocked;
        _isMegaPrizeMatured = isMegaPrizeMatured;
    }

    function getWithdrawalsByAdmin() external view
    onlyOwners returns(uint256[] memory _playerWithdrawalsAmounts, address payable[] memory _playerWithdrawalsKeys) {
        _playerWithdrawalsKeys = playerWithdrawalsKeys;
        _playerWithdrawalsAmounts = new uint256[](playerWithdrawalsKeys.length);
        // copy the pending withdraw amounts of players to an array
        for (uint256 i = 0; i < playerWithdrawalsKeys.length; i++) {
            _playerWithdrawalsAmounts[i] = playerWithdrawals[playerWithdrawalsKeys[i]];
        }
    }

    function getOraclizeRoundByAdmin(bytes32 _oraclizeID) external view onlyOwners returns(uint256  _oraclizeRound) {
        _oraclizeRound = roundOfOraclizeID[_oraclizeID];
    }

    /**
        * @dev sends the amount of ethers to the required _toAddress
        * Make sure all the state changes are already committed prior to invocation. 
    */
    function safeSend(address payable _toAddress, uint256 _amount) private
    {
        require(_amount > 0, "amt_zero");
        require(address(this).balance >= _amount,
            "no_funds");

        if (!_toAddress.send(_amount)) {
            if (playerWithdrawals[_toAddress] == 0) {
                playerWithdrawalsKeys.push(_toAddress);
            }
            playerWithdrawals[_toAddress] = (playerWithdrawals[_toAddress]).add(_amount);
        }
    }

    /**
        * @dev function for players to manually withdraw their amounts in case of send invocation error
        * Make sure all the state changes are already committed prior to invocation. 
    */
    function withdraw() public {
        uint256 _amount = playerWithdrawals[msg.sender];
        require(_amount > 0, "amt_zero");
        require(address(this).balance >= _amount,
            "no_funds");

        uint256 i;
        delete playerWithdrawals[msg.sender];
        // implement code to remove the address entry from the withdrawplayerlist
        for (i = 0; i < playerWithdrawalsKeys.length; i++) {
            if (playerWithdrawalsKeys[i] == msg.sender) {
                playerWithdrawalsKeys[i] = playerWithdrawalsKeys[playerWithdrawalsKeys.length.sub(1)];
                break;
            }
        }
        if (i < playerWithdrawalsKeys.length) {
            playerWithdrawalsKeys.length = (playerWithdrawalsKeys.length).sub(1);
        }
        msg.sender.transfer(_amount);
    }

    /**
        * @dev fallback function which also implements DirectPlay 
    */
    function () external payable {
        // if the token value pertains to DirectPlay Withdraw feature, withdraw player's pending amount alongwith token value
        if (msg.sender != owner() && msg.sender != timekeeper()) {
            if (!isDirectPlayEnabled) revert("revert_disabled");
        }
        if (msg.value == directPlayWithdrawValue) {
            if (playerWithdrawals[msg.sender] == 0) revert("revert_amt");
            uint256 _amount = playerWithdrawals[msg.sender] + msg.value;
            delete playerWithdrawals[msg.sender];
            // implement code to remove the address entry from the withdrawplayerlist
            uint256 i;
            for (i = 0; i < playerWithdrawalsKeys.length; i++) {
                if (playerWithdrawalsKeys[i] == msg.sender) {
                    playerWithdrawalsKeys[i] = playerWithdrawalsKeys[playerWithdrawalsKeys.length.sub(1)];
                    break;
                }
            }
            if (i < playerWithdrawalsKeys.length) {
                playerWithdrawalsKeys.length = (playerWithdrawalsKeys.length).sub(1);
            }
            msg.sender.transfer(_amount);
            return;
        } else {
            uint256 i;
            for (i = 0; i < gameStrategiesKeys.length; i++) {
                if ((msg.value).mod(gameStrategies[gameStrategiesKeys[i]].tokenValue) == 0) {
                    playGame(gameStrategiesKeys[i], (msg.value).div(gameStrategies[gameStrategiesKeys[i]].tokenValue));
                    break;
                }
            }
            // if the token value doesn't match any of the features, revert the transaction
            if (msg.sender != owner() && msg.sender != timekeeper()) {
                if (i >= gameStrategiesKeys.length) { revert("revert_option"); }
            }
        }
    }

    /**
        * @dev self destruct contract after all game rounds have completed and all games are locked.
    */
    function ownerKill() external
    onlyOwner {
        uint256 _currentRound;
        uint256 _gameID;
        uint256 _currentRoundID;
        // ownerKill() can only happen once all game rounds have completed and all games are locked
        for (uint256 i = 0; i < gameStrategiesKeys.length; i++) {
            _gameID = gameStrategies[gameStrategiesKeys[i]].gameID;
            _currentRound = gameStrategies[gameStrategiesKeys[i]].currentRound;
            if (_currentRound == 0) continue;
            _currentRoundID = cantorPairing(_gameID, _currentRound);
            if (
                gameStrategies[gameStrategiesKeys[i]].isGameLocked == false ||
                gameStrategies[gameStrategiesKeys[i]].isGameLateLocked == false ||
                rounds[_currentRoundID].isRoundOpen
            ) {revert("revert_open");}
        }
        selfdestruct(owner());
    }

    /**
        * @dev outputs the Cantor Pairing Function result of two input natural numbers 
        * Function: π(a,b)=1/2(a+b)(a+b+1)+b  
    */
    function cantorPairing(uint256 _a, uint256 _b) private pure
    returns(uint256 _result) {
        require(_a > 0 && _b > 0, "cantor_err");
        _result = (((_a + (_b)) * ((_a + (_b)) + (1))) / 2) + (_b);
    }
}
/*

END MULTIPRIZER

*/








