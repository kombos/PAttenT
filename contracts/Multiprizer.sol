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
    constructor () internal {
        _owner = msg.sender;
        emit OwnershipTransferred(address(0), _owner);
    }

    /**
     * @return the address of the owner.
     */
    function owner() public view returns (address payable) {
        return _owner;
    }

    /**
     * @return the address of the timekeeper.
     */
    function timekeeper() public view returns (address payable) {
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
    function isOwner() public view returns (bool) {
        return msg.sender == _owner;
    }

    /**
     * @return true if `msg.sender` is the timekeeper of the contract.
     */
    function isTimekeeper() public view returns (bool) {
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
    int256 constant private INT256_MIN = -2**255;

    /**
    * @dev Multiplies two unsigned integers, reverts on overflow.
    */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
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
    function mul(int256 a, int256 b) internal pure returns (int256) {
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
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // Solidity only automatically asserts when dividing by 0
        require(b > 0);
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    /**
    * @dev Integer division of two signed integers truncating the quotient, reverts on division by zero.
    */
    function div(int256 a, int256 b) internal pure returns (int256) {
        require(b != 0); // Solidity only automatically asserts when dividing by 0
        require(!(b == -1 && a == INT256_MIN)); // This is the only case of overflow

        int256 c = a / b;

        return c;
    }

    /**
    * @dev Subtracts two unsigned integers, reverts on overflow (i.e. if subtrahend is greater than minuend).
    */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a);
        uint256 c = a - b;

        return c;
    }

    /**
    * @dev Subtracts two signed integers, reverts on overflow.
    */
    function sub(int256 a, int256 b) internal pure returns (int256) {
        int256 c = a - b;
        require((b >= 0 && c <= a) || (b < 0 && c > a));

        return c;
    }

    /**
    * @dev Adds two unsigned integers, reverts on overflow.
    */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a);

        return c;
    }

    /**
    * @dev Adds two signed integers, reverts on overflow.
    */
    function add(int256 a, int256 b) internal pure returns (int256) {
        int256 c = a + b;
        require((b >= 0 && c >= a) || (b < 0 && c < a));

        return c;
    }

    /**
    * @dev Divides two unsigned integers and returns the remainder (unsigned integer modulo),
    * reverts when dividing by zero.
    */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b != 0);
        return a % b;
    }
}


contract Multiprizer_oraclizeAbstract {
    function newRandomDSQuery() external returns (bytes32 _queryId);
}


/**
 * @title Multiprizer
 * @dev The Multiprizer contract is the core game.
 */

contract Multiprizer is Ownable  {

using SafeMath for uint256;

struct Game{
    uint256 gameID;
    uint256 maxTokens;
    uint256 tokenValue;
    uint256 gameDurationInEpoch;
    uint256 gameDurationInBlocks;
    uint256 maxTokensPerPlayer;
    uint256 houseEdge;
    uint256 megaPrizeEdge;
    uint256 totalValueForGame;
    uint256 totalWinnings;
    uint256 directPlayTokenValue;
    uint256 currentRound;
    bool isGameLocked;
    bool isGameLateLocked;
}

struct Round{
    uint256 gameID;
    uint256 roundNumber;
    uint256 totalTokensPurchased;
    uint256 iterationStartTimeMS;
    uint256 iterationStartTimeBlock;
    mapping (address => uint256) playerTokens;
    address payable[] playerList;
    address payable winner;
    bytes32 oraclizeID;
    bytes oraclizeProof;
    bool isRoundOpen;
}

/** 
*  DirectPlay Variables 
*  @dev DirectPlay enables a player to place a single token for any of the strategy games   
*  without the need of going to the website to play. It doesn't even require metamask or  
*  other web3 injectors. All you need is an ethereum wallet from which you can directly send
*  specific valued ethers to enable automatic participation in specific games. You could even
*  execute manual withdraw of your prizes won by sending directPlayWithdraw value of ethers. 
  */
uint256 public directPlayWithdrawValue;
uint256 public prizeOnLoss;
bool public isDirectPlayEnabled;

/** 
*  Control Variables 
*  @dev DirectPlay enables a player to place a single token for any of the strategy games   
*  execute manual withdraw of your prizes won by sending directPlayWithdraw value of ethers. 
  */
bool private isGamesPaused;
uint256 pauseTime;
uint256 constant DIVISOR_POWER_5 = 100000;
uint256 constant DIRECTPLAYTOKEN = 1;


/** 
*  Oraclize Variables 
*  @dev DirectPlay enables a player to place a single token for any of the strategy games   
*  execute manual withdraw of your prizes won by sending directPlayWithdraw value of ethers. 
  */
/*   
uint256 gasLimitOraclize;
uint256 gasPriceOraclize;
uint256 numBytesOraclize;
uint256 delayOraclize;
string constant dataSourceOraclize = "random";
 */


/** 
*  Game Variables 
*  @dev DirectPlay enables a player to place a single token for any of the strategy games   
*  execute manual withdraw of your prizes won by sending directPlayWithdraw value of ethers. 
  */
mapping (uint256 => Round) private rounds;
mapping (uint256 => Game) public gameStrategies;
uint256[] public gameStrategiesKeys;
mapping (address => uint256) private playerWithdrawals;
address payable[] private playerWithdrawalsKeys;

/** 
*  Oraclize Variables 
*  @dev DirectPlay enables a player to place a single token for any of the strategy games   
*  execute manual withdraw of your prizes won by sending directPlayWithdraw value of ethers. 
  */
mapping (bytes32 => uint256[]) private roundsOfOraclizeID;
uint256[] private pendingRoundsOraclize;
Multiprizer_oraclizeAbstract private multiprizer_oraclize;
address payable oraclizeAddress;


/** 
*  MegaPrize Variables 
*  @dev DirectPlay enables a player to place a single token for any of the strategy games   
*  execute manual withdraw of your prizes won by sending directPlayWithdraw value of ethers. 
  */
uint256 megaPrizeID;
uint256 megaPrizeAmount;
mapping (address => uint256) private megaPrizePlayers;
address payable[] private megaPrizePlayersKeys;
mapping (uint256 => address) public megaPrizeWinners;
bool private isMegaPrizeEnabled;
bool private isMegaPrizeLateLocked;
bool private isMegaPrizeMatured;
uint256 megaPrizeNumber;
uint256 megaPrizeDurationInEpoch;
uint256 megaPrizeDurationInBlocks;

/** 
*  Event Logs 
*  @dev DirectPlay enables a player to place a single token for any of the strategy games   
*  execute manual withdraw of your prizes won by sending directPlayWithdraw value of ethers. 
  */
//event lockEvent(string messageSender);

/** 
*  Constructor call 
*  @dev DirectPlay enables a player to place a single token for any of the strategy games   
*  execute manual withdraw of your prizes won by sending directPlayWithdraw value of ethers. 
  */
constructor () public {
    //# EMIT EVENT LOG - to be done
    isGamesPaused = false;
    // set MegaPrize parameters
    megaPrizeAmount = 0;
    isMegaPrizeEnabled = false;
    isMegaPrizeMatured = false;
    isMegaPrizeLateLocked = false;
    megaPrizeNumber = 1;
    
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
        _gameProperties[11] : uint256 directPlayTokenValue
*/

function addGameByAdmin(uint256[12] calldata _gameProperties) external 
    onlyOwner {

        require(gameStrategies[_gameProperties[0]].gameID == 0, " GameID already exists ");
        require(_gameProperties[0] != 0 && _gameProperties[1] != 0 && _gameProperties[2] != 0 && _gameProperties[5] < _gameProperties[1] &&
            _gameProperties[6] < DIVISOR_POWER_5 && _gameProperties[7] < DIVISOR_POWER_5, " Invalid game parameters specified. Try again ");
        require(_gameProperties[3] != 0 || _gameProperties[4] != 0, " Both duration in epoch and blocks cannot be zero together ");

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
        gameObj.directPlayTokenValue = _gameProperties[11];
        gameObj.isGameLocked = true;
        gameObj.isGameLateLocked = true;
        
        gameStrategies[gameObj.gameID] = gameObj;
        gameStrategiesKeys.push(gameObj.gameID);

        //# EMIT EVENT LOG - to be done

}

function updateGameByAdmin(uint256[12] calldata _gameProperties, uint256 _gameID) external 
    onlyOwner { 

        require(gameStrategies[_gameID].gameID != 0, " GameID doesn't exist ");
        require(_gameProperties[0] != 0 && _gameProperties[5] < _gameProperties[1], 
            " Invalid game parameters specified. Try again ");
        
        /* game should be in both locked mode and late locked mode. 
        This would prove the round had finished before it was locked for update.  */
        require(gameStrategies[_gameID].isGameLocked == true && gameStrategies[_gameID].isGameLateLocked == true, 
            " Game round has to finish and both locks set before the game can be updated. ");
        
        // update the values in gameStrategies type
        gameStrategies[_gameID].gameID = _gameProperties[0];
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
        gameStrategies[_gameID].directPlayTokenValue = _gameProperties[11];
        gameStrategies[_gameID].isGameLocked = true;
        gameStrategies[_gameID].isGameLateLocked = true;

        // update the gameID value in gameStrategiesKeys
        for (uint256 i=0; i < gameStrategiesKeys.length; i++) {
            if(gameStrategiesKeys[i] == _gameID)
                gameStrategiesKeys[i] = _gameProperties[0];

        }
        
        
        //# EMIT EVENT LOG - to be done
}


function closeGameByAdmin(uint256 _gameID) external 
    onlyOwner {
        
        require(gameStrategies[_gameID].gameID != 0, " GameID doesn't exist ");
        /* game should be in both locked mode and late locked mode. 
        This would prove the round had finished before it was locked for update.  */
        require(gameStrategies[_gameID].isGameLocked == true && gameStrategies[_gameID].isGameLateLocked == true, 
            " Game round has to finish and both locks set before the game can be closed. ");
        uint256 i;
        bool _success=false;

        // delete the Game data type in gameStrategies
        delete gameStrategies[_gameID];

        // remove the gameID from gameStrategiesKeys
        for (i=0; i < (gameStrategiesKeys.length).sub(1); i++) {
            if(gameStrategiesKeys[i] == _gameID) {
                _success=true;
            }
            if(_success == true){
                gameStrategiesKeys[i] = gameStrategiesKeys[i.add(1)];
            }
        }

        if(_success != true) {
            if(gameStrategiesKeys[i] == _gameID) {
                gameStrategiesKeys.length =  (gameStrategiesKeys.length).sub(1);
            }
            else
                revert(" Error during game deletion. Couldn't find the required game. ");
        }
        else {
            gameStrategiesKeys.length =  (gameStrategiesKeys.length).sub(1);
        }

        //# EMIT EVENT LOG - to be done
}


function updateDirectPlayByAdmin( uint256 _directPlayWithdrawValue, uint256 _prizeOnLoss, bool _isDirectPlayEnabled ) external 
    onlyOwner {
        directPlayWithdrawValue = _directPlayWithdrawValue;
        prizeOnLoss = _prizeOnLoss;
        isDirectPlayEnabled = _isDirectPlayEnabled;

        //# EMIT EVENT LOG - to be done
}




/* 
function updateOraclizeByAdmin(uint256 _gasLimitOraclize, uint256 _gasPriceOraclize, 
    uint256 _numBytesOraclize, uint256 _delayOraclize) external 
    onlyOwners {

    gasLimitOraclize = _gasLimitOraclize;
    gasPriceOraclize = _gasPriceOraclize;
    oraclize_setCustomGasPrice(_gasPriceOraclize);
    oraclize_setProof(proofType_Ledger);
    numBytesOraclize = _numBytesOraclize;
    delayOraclize = _delayOraclize;
        
    //# EMIT EVENT LOG - to be done
}
 */

function setOraclizeByAdmin(address payable _contractAddress) external 
    onlyOwners {
        multiprizer_oraclize = Multiprizer_oraclizeAbstract(_contractAddress);
        oraclizeAddress = _contractAddress;
    }


function updateMegaPrizeByAdmin(
    uint256 _megaPrizeID, 
    uint256 _megaPrizeAmount, 
    bool _isMegaPrizeEnabled, 
    bool _isMegaPrizeLateLocked, 
    bool _isMegaPrizeMatured, 
    uint256 _megaPrizeDurationInEpoch, 
    uint256 _megaPrizeDurationInBlocks) external payable
    onlyOwners {

        require(_megaPrizeAmount == msg.value, " _megaPrizeAmount parameter value does not match the funds injected ");

        megaPrizeID = _megaPrizeID;
        megaPrizeAmount = megaPrizeAmount.add(_megaPrizeAmount);
        isMegaPrizeEnabled = _isMegaPrizeEnabled;
        isMegaPrizeLateLocked = _isMegaPrizeLateLocked;
        isMegaPrizeMatured = _isMegaPrizeMatured;
        megaPrizeDurationInEpoch = _megaPrizeDurationInEpoch;
        megaPrizeDurationInBlocks = _megaPrizeDurationInBlocks;
        
    //# EMIT EVENT LOG - to be done
}


function lockMegaPrizeByAdmin() external 
    onlyOwners {

        isMegaPrizeLateLocked = true;
        //# EMIT EVENT LOG1
}


function unlockMegaPrizeByAdmin() external 
    onlyOwners {

        isMegaPrizeLateLocked = false;
        isMegaPrizeEnabled = true;
        //# EMIT EVENT LOG1
}


function lockGamesByAdmin(uint256[] calldata _gameIDs) external 
    onlyOwners {
        // specific games are 'late locked' by admin to make sure that locking happens only after the round has completed.
        for(uint256 i=0; i<_gameIDs.length; i++) {
            require(gameStrategies[_gameIDs[i]].gameID != 0, " GameID doesn't exist ");
            gameStrategies[_gameIDs[i]].isGameLateLocked = true;

        }

        //# EMIT EVENT LOG1
        //emit lockEvent("admin", _gameIDs);
}


function unlockGamesByAdmin(uint256[] calldata _gameIDs) external 
    onlyOwners {
        // specific games are unlocked by admin to resume rounds.
        for(uint256 i=0; i<_gameIDs.length; i++) {
            require(gameStrategies[_gameIDs[i]].gameID != 0, " GameID doesn't exist ");
            gameStrategies[_gameIDs[i]].isGameLocked = false;
            gameStrategies[_gameIDs[i]].isGameLateLocked = false;

        }

        //# EMIT EVENT LOG1
        //emit unlockEvent("admin", _gameIDs);

}

function pauseAllGamesByAdmin() public 
    onlyOwners {
        // All games are instantly locked and all further game play is frozen. During this period, the funds of the players
        // will be perfectly safe and can also be withdrawn. Their placed tokens for the current round can also be reverted 
        // using revertGame. This is an emergency lock, only invoked when a malicious attempt has been detected and needs to be addressed.
        isGamesPaused = true;
        for(uint256 i=0; i<gameStrategiesKeys.length; i++) {
            gameStrategies[gameStrategiesKeys[i]].isGameLocked = true;
            gameStrategies[gameStrategiesKeys[i]].isGameLateLocked = true;

        }

        pauseTime = now;

        // VERY IMPORTANT TO EMIT EVENT TO PAUSE TIMER AT TIMEKEEPER END!!!
        //# EMIT EVENT LOG1  
        //emit unlockEvent("admin", _gameIDs);

}

function resumeAllGamesByAdmin() public 
    onlyOwners {
        // All games are instantly resumed from the exact same point when it was paused. The remaining time for the current round is 
        // also saved so no disruption to the round occurs. 
        isGamesPaused = false;
        for(uint256 i=0; i<gameStrategiesKeys.length; i++) {
            gameStrategies[gameStrategiesKeys[i]].isGameLocked = false;
            gameStrategies[gameStrategiesKeys[i]].isGameLateLocked = false;

        }

        // VERY IMPORTANT TO EMIT EVENT TO RESUME TIMER AT TIMEKEEPER END!!!
        //# EMIT EVENT LOG1  
        //emit unlockEvent("admin", _gameIDs);

}

function revertFundsToPlayers() public 
    onlyOwner {
        // Pause all games if not already done. 
        pauseAllGamesByAdmin();

        uint256 _roundNumber;
        uint256 _gameID;
        uint256 _tokenValue;
        uint256 _roundID;
        uint256 _playerAmount;
        address payable _playerAddress;
        // revert all active tokens at play back to the players, for every game. 
        for(uint256 i=0; i<gameStrategiesKeys.length; i++) {
            _roundNumber = gameStrategies[gameStrategiesKeys[i]].currentRound;
            _gameID = gameStrategies[gameStrategiesKeys[i]].gameID;
            _tokenValue = gameStrategies[gameStrategiesKeys[i]].tokenValue;
            _roundID = cantorPairing(_gameID, _roundNumber);

            for(uint256 j=0; j<rounds[_roundID].playerList.length; j++) {
                _playerAddress = rounds[_roundID].playerList[j];
                _playerAmount = _tokenValue.mul(rounds[_roundID].playerTokens[_playerAddress]);
                rounds[_roundID].playerTokens[_playerAddress] = 0;
                if(_playerAmount == 0) continue;
                if(safeSend(_playerAddress, _playerAmount))
                    //# check if re-entrancy attack is possible ???
                    //# EMIT EVENT LOG - Successful transfer of funds

                    true;
                    
                else
                    //# EMIT EVENT LOG - Transfer unsuccessful, use pull withdrawals mechanism
                    true; 
                    
    
            }

            rounds[_roundID].totalTokensPurchased = 0;
            delete rounds[_roundID].playerList;

        }


        // VERY IMPORTANT TO EMIT EVENT TO PAUSE TIMER AT TIMEKEEPER END!!!
        //# EMIT EVENT LOG1  
        //emit unlockEvent("admin", _gameIDs);

}


function playGame(uint256 _gameID, uint256 _roundNumber, uint256 _numberOfTokens ) public  
    payable {
        // _gameID should be valid
        require(gameStrategies[_gameID].gameID != 0, " GameID doesn't exist. ");
        // game should not be in locked mode
        require(!gameStrategies[_gameID].isGameLocked, 
            " Game round is set in locked state by admin. Wait till the game resumes. ");
        // zero check for _roundNumber and _numberOfTokens
        require(_roundNumber != 0 && _numberOfTokens != 0, " Invalid values given in game parameters. ");
        // ethers value sent should be equal to token value
        require(msg.value == _numberOfTokens.mul(gameStrategies[_gameID].tokenValue),  
            " Amount sent is less than required ");
        // get the unique roundID value from the _gameID & _roundNumber pair (pairing function)
        uint256 _roundID = cantorPairing(_gameID, _roundNumber);
        // game round (_roundNumber) should be active
        require(rounds[_roundID].isRoundOpen == true, " Round chosen is not a valid and active round. ");
        // check if the totalTokensPurchased for the round doesn't cross maxTokens for the game 
        require(_numberOfTokens.add(rounds[_roundID].totalTokensPurchased) <= gameStrategies[_gameID].maxTokens,
            " Max tokens that can be purchased for this round has been exceeded. Wait for open slots. ");
        // _numberOfTokens should be a valid value as per game strategy
        require(_numberOfTokens.add(rounds[_roundID].playerTokens[msg.sender]) <= gameStrategies[_gameID].maxTokensPerPlayer,
            " Total tokens purchased by player exceeds maximum allowed for this game. Try another game. ");
        
        if(rounds[_roundID].playerTokens[msg.sender] == 0) {
            rounds[_roundID].playerList.push(msg.sender);
        }
        rounds[_roundID].playerTokens[msg.sender] = (rounds[_roundID].playerTokens[msg.sender]).add(_numberOfTokens);
        rounds[_roundID].totalTokensPurchased = (rounds[_roundID].totalTokensPurchased).add(_numberOfTokens);
        
        //# EMIT EVENT LOG - to be done

}

//revert active tokens at play back to the players
function revertGame(uint256 _gameID, uint256 _roundNumber, address payable _playerAddress ) public  {
    // _gameID should be valid
    require(gameStrategies[_gameID].gameID != 0, " GameID doesn't exist. ");
    // check the validity of sender address / player address
    require(msg.sender == owner() || msg.sender == timekeeper() || msg.sender == _playerAddress, " Message sender address invalid. ");
    // zero check for _roundNumber
    require(_roundNumber != 0, " Invalid round number given in game parameters. ");
    // get the unique roundID value from the _gameID & _roundNumber pair (pairing function)
    uint256 _roundID = cantorPairing(_gameID, _roundNumber);
    // game round (_roundNumber) should be active
    require(rounds[_roundID].isRoundOpen == true, " Round chosen is not the active round. ");
    // _numberOfTokens should be a valid value as per game strategy
    require(rounds[_roundID].playerTokens[_playerAddress] > 0,
        " There are no existing tokens in the active round to revert. ");
    
    // refund the amount placed 
    uint256 _refundAmount = (rounds[_roundID].playerTokens[_playerAddress]).mul((gameStrategies[_gameID].tokenValue));
    rounds[_roundID].totalTokensPurchased = (rounds[_roundID].totalTokensPurchased).sub(rounds[_roundID].playerTokens[_playerAddress]);
    rounds[_roundID].playerTokens[_playerAddress] = 0;
    // remove the entry of _playerAddress from playerList array of the round
    uint256 i;
    uint256 _playerListLength = rounds[_roundID].playerList.length;
    for (i=0; i < _playerListLength; i++) {
        if(rounds[_roundID].playerList[i] == _playerAddress) {
            rounds[_roundID].playerList[i] = rounds[_roundID].playerList[_playerListLength.sub(1)];
            break;
        }
    }

    if(i == _playerListLength) {
        revert(" Error during revert token function. Couldn't find the required token(s). ");
    }
    else {
        rounds[_roundID].playerList.length = (rounds[_roundID].playerList.length).sub(1);
    }

    if( safeSend(_playerAddress, _refundAmount) )
        //# EMIT EVENT LOG - Successful transfer of funds
        true;
    else
        //# EMIT EVENT LOG - Transfer unsuccessful, use pull withdrawals mechanism
        true; 

}


function completeRoundsByAdmin(uint256[] memory _gameIDs) public 
    onlyOwners {
        // gameIDs should be valid
        for(uint256 k=0; k<_gameIDs.length; k++) {
            // if gameID corresponds to megaPrize game, set the mega prize matured flag and continue.
            if(_gameIDs[k] == megaPrizeID) {
                isMegaPrizeMatured = true;
                continue;
            }
            require(gameStrategies[_gameIDs[k]].gameID != 0, " One or more of the GameIDs doesn't exist ");
        }
        uint256 _roundNumber;
        uint256 _nextRoundNumber;
        uint256 _roundID;
        uint256 _nextRoundID;
        uint256 _totalValueForRound;
        address payable _playerAddress;
        bool _needsOraclize = false;

        // set the _needsOraclize flag if in at least one of the games, the number of players is more than 1
        for(uint256 j=0; j<_gameIDs.length; j++) {

            if(_gameIDs[j] == megaPrizeID || gameStrategies[_gameIDs[j]].isGameLocked) {
                continue;
            }
           
            _roundNumber = gameStrategies[_gameIDs[j]].currentRound;
            _roundID = cantorPairing(_gameIDs[j], _roundNumber);
            _needsOraclize = ((rounds[_roundID].playerList.length > 1) || _needsOraclize || (isMegaPrizeMatured && isMegaPrizeEnabled)) ? true : false ;

        }

        // create an Oraclize query for RNG
        bytes32 _oraclizeID;
        if(_needsOraclize) {
            _oraclizeID = multiprizer_oraclize.newRandomDSQuery();

        }
        // save round info and create new round for relevant games
        for(uint256 i=0; i < _gameIDs.length; i++) {

            if(_gameIDs[i] == megaPrizeID || gameStrategies[_gameIDs[i]].isGameLocked) {
                continue;
            }

            // close the current round if not already closed
            _roundNumber = gameStrategies[_gameIDs[i]].currentRound;
            _roundID = cantorPairing(_gameIDs[i], _roundNumber);
            if(_roundNumber != 0 && rounds[_roundID].isRoundOpen) {
                // set oraclizeID only if the number of players is more than 1
                if(rounds[_roundID].playerList.length > 1) {
                    // store the oraclizeID for the relevant game (GameID)
                    rounds[_roundID].oraclizeID = _oraclizeID;
                    roundsOfOraclizeID[_oraclizeID].push(_roundID);
                    // update the total value of tokens placed for the game
                    _totalValueForRound = (gameStrategies[_gameIDs[i]].tokenValue).mul(rounds[_roundID].totalTokensPurchased);
                    gameStrategies[_gameIDs[i]].totalValueForGame = 
                        (gameStrategies[_gameIDs[i]].totalValueForGame).add(_totalValueForRound);
                }
                // else if number of players is 1 or 0, revertGame and refund player's tokens
                else {
                    if(rounds[_roundID].playerList.length == 1) {
                        _playerAddress = rounds[_roundID].playerList[0];
                        revertGame(_gameIDs[i], _roundNumber, _playerAddress);
                        // reinput the playerTokens number and player address in playerList for historical record-keeping of the round commenced
                        rounds[_roundID].totalTokensPurchased = 0;
                        rounds[_roundID].playerList.push(_playerAddress);
                        rounds[_roundID].playerTokens[_playerAddress] = 1;

                    }
                }
                // close the current round flag
                rounds[_roundID].isRoundOpen = false;
                
            }

            if(!gameStrategies[_gameIDs[i]].isGameLateLocked) {
                // increment the round number and start a new round
                _nextRoundNumber = _roundNumber.add(1);
                gameStrategies[_gameIDs[i]].currentRound = _nextRoundNumber;
                _nextRoundID = cantorPairing(_gameIDs[i], _nextRoundNumber);
                rounds[_nextRoundID].gameID = gameStrategies[_gameIDs[i]].gameID;
                rounds[_nextRoundID].roundNumber = _nextRoundNumber;
                rounds[_nextRoundID].totalTokensPurchased = 0;
                rounds[_nextRoundID].iterationStartTimeMS = now;
                rounds[_nextRoundID].iterationStartTimeBlock = block.number;
                rounds[_nextRoundID].isRoundOpen = true;

            }
            else {
                gameStrategies[_gameIDs[i]].isGameLocked = true;
                gameStrategies[_gameIDs[i]].isGameLateLocked = true;
            }

        }
        //# EMIT EVENT LOG
}


function callback(bytes32 _oraclizeID, string calldata _result, bytes calldata _oraclizeProof, bool _isProofValid) external {
    
    // using require statement instead since using modifiers may use extra call stack
    require(msg.sender == oraclizeAddress, " __callback cannot be called by any actor apart from Oraclize ");
    if (!_isProofValid) {

        for(uint256 p=0;p < roundsOfOraclizeID[_oraclizeID].length; p++) {
            pendingRoundsOraclize.push(roundsOfOraclizeID[_oraclizeID][p]);
        
        }

        //# EMIT EVENT LOG
        return;
    }

    uint256 _gameID;
    uint256 _slabIndex;
    uint256 _oraclizeRandomNumber;
    address payable[] memory _tokenSlab;
    uint256[] memory _numTokensSlab;
    
    uint256[] memory _roundsOfOraclizeID = new uint256[]((roundsOfOraclizeID[_oraclizeID].length).add(pendingRoundsOraclize.length));
    _slabIndex = 0;
    // add the pending rounds first, which were not processed by Oraclize previously due to proof mismatch
    for(uint256 n=0;n < pendingRoundsOraclize.length; n++) {
        _roundsOfOraclizeID[_slabIndex] =  pendingRoundsOraclize[n];
        _slabIndex = _slabIndex.add(1);
    }
    // add the new rounds associated with the current oraclizeID
    for(uint256 m=0;m < roundsOfOraclizeID[_oraclizeID].length; m++) {
        _roundsOfOraclizeID[_slabIndex] =  roundsOfOraclizeID[_oraclizeID][m];
        _slabIndex = _slabIndex.add(1);
    }
    // remove the pending oraclize rounds since they have been included in the new array _roundsOfOraclizeID
    delete pendingRoundsOraclize;
    _slabIndex = 0; 

    for(uint256 i=0; i < _roundsOfOraclizeID.length; i++) {
        //_roundID = _roundsOfOraclizeID[i];
        // if a round has been already decided by Oraclize callback, then continue with next round. 
        // This will also help to prevent any possible malicious execution by Oraclize
        if(rounds[_roundsOfOraclizeID[i]].oraclizeProof.length != 0) continue;
        _gameID = rounds[_roundsOfOraclizeID[i]].gameID;
        address payable[] storage _playerList = rounds[_roundsOfOraclizeID[i]].playerList;
        // get the Provable Oraclize Random Number and mod it to the length of totalTokensPurchased (or _tokenSlab)
        _oraclizeRandomNumber = uint256(keccak256(bytes(_result))).mod(rounds[_roundsOfOraclizeID[i]].totalTokensPurchased);
        // _tokenSlab will be the array in which we choose a random index provided by Oraclize to pick winner.
        // _numTokensSlab is the array containing number of tokens purchased by each player of this round.
        // We will use these two arrays, alongwith playerList to input values in the _tokenSlab in a transposing manner.
        // This enables a very fine mixing of values before picking winner, and also prevents any outcome prediction.
        _numTokensSlab = new uint256[](_playerList.length);
        _tokenSlab = new address payable[](rounds[_roundsOfOraclizeID[i]].totalTokensPurchased);

        for(uint256 j=0; j < _playerList.length; j++) {
            _numTokensSlab[j] = rounds[_roundsOfOraclizeID[i]].playerTokens[_playerList[j]];
            // consider for Mega Prize
            if(megaPrizePlayers[_playerList[j]] == 0) {
                megaPrizePlayersKeys.push(_playerList[j]);
            }
            megaPrizePlayers[_playerList[j]] = megaPrizePlayers[_playerList[j]].add(rounds[_roundsOfOraclizeID[i]].playerTokens[_playerList[j]]);

        }
        _slabIndex = 0;
        // input player address values in the _tokensSlab in a transposing manner. A player address value is input in 
        //_tokenSlab multiple times if more than one token is bought, providing weighted probabilities of winning.
        for(uint256 k=0; _slabIndex < rounds[_roundsOfOraclizeID[i]].totalTokensPurchased; k++) {
            
            if(_numTokensSlab[k.mod(_numTokensSlab.length)] == 0) {
                continue;
            }

            else {
                _tokenSlab[_slabIndex] = _playerList[k.mod(_playerList.length)];
                _slabIndex = _slabIndex.add(1);
                _numTokensSlab[k.mod(_numTokensSlab.length)] = (_numTokensSlab[k.mod(_numTokensSlab.length)]).sub(1);

            }
            
        }
        // select the winner address using Oraclize provided Provable Random Number
        rounds[_roundsOfOraclizeID[i]].winner = _tokenSlab[_oraclizeRandomNumber];
        // set the oraclizeProof data into the round data
        rounds[_roundsOfOraclizeID[i]].oraclizeProof = _oraclizeProof;
        // compensate the winner and deduct houseEdge and megaPrizeEdge in a seperate private function
        compensateWinner(rounds[_roundsOfOraclizeID[i]].winner, _roundsOfOraclizeID[i], _result);
        
        //# EMIT EVENT LOG
        delete _numTokensSlab; 
        delete _tokenSlab;
    }

}


/**
    * @dev sends the winning amount of ethers to the required winner address
    * Make sure all the state changes are already committed prior to invocation. 
*/
function compensateWinner(address payable _winnerAddress, uint256 _roundID, string memory _result) private {

    uint256 _gameID;
    uint256 _totalValuePurchased;
    uint256 _winnerAmount;
    uint256 _houseEdgeAmount;
    uint256 _megaPrizeEdgeAmount;

    _gameID = rounds[_roundID].gameID;
    _totalValuePurchased = gameStrategies[_gameID].tokenValue.mul(rounds[_roundID].totalTokensPurchased);
    gameStrategies[_gameID].totalValueForGame = (gameStrategies[_gameID].totalValueForGame).add(_totalValuePurchased);
    
    // transfer the prize amount to winner, after deducting house edge and megaprize edge
    _megaPrizeEdgeAmount = isMegaPrizeEnabled ? (_totalValuePurchased.mul(gameStrategies[_gameID].megaPrizeEdge)).div(DIVISOR_POWER_5) : 0;
    _houseEdgeAmount = ((_totalValuePurchased.mul(gameStrategies[_gameID].houseEdge)).div(DIVISOR_POWER_5)).sub(_megaPrizeEdgeAmount);
    _winnerAmount = _totalValuePurchased.sub((_houseEdgeAmount.add(_megaPrizeEdgeAmount)));
    gameStrategies[_gameID].totalWinnings = (gameStrategies[_gameID].totalWinnings).add(_winnerAmount);
    // deduct the house edge and transfer it to the house account
    if(playerWithdrawals[owner()] == 0) {
                playerWithdrawalsKeys.push(owner());
    }
    playerWithdrawals[owner()] = playerWithdrawals[owner()].add(_houseEdgeAmount);
    megaPrizeAmount = megaPrizeAmount.add(_megaPrizeEdgeAmount);
    // send the winning amount to the winner using safeSend
    if(safeSend(_winnerAddress, _winnerAmount)) {
        //# EMIT EVENT LOG - Successful transfer of funds
    }
    else {
        //# EMIT EVENT LOG - Transfer unsuccessful, use pull withdrawals mechanism
    }
    
    if(isMegaPrizeEnabled && isMegaPrizeMatured) {

        address payable _megaPrizeWinner;
        uint256 _megaPrizeAmount;
        uint256 _megaPrizeRandomNumber = uint256(keccak256(bytes(_result))).mod(megaPrizePlayersKeys.length);

        // find the mega prize winner address using Provable Random Number from Oraclize 
        _megaPrizeWinner = megaPrizePlayersKeys[_megaPrizeRandomNumber];
        megaPrizeWinners[megaPrizeNumber] = _megaPrizeWinner;
        _megaPrizeAmount = megaPrizeAmount;
        
        // delete all megaPrize storage variable values pertaining to players
        isMegaPrizeMatured = false;
        megaPrizeAmount = 0;
        megaPrizeNumber = megaPrizeNumber.add(1);
        for(uint256 i=0; i < megaPrizePlayersKeys.length; i++) {
            megaPrizePlayers[megaPrizePlayersKeys[i]] = 0;
        }
        delete megaPrizePlayersKeys;
        // lock the next mega prize round if isMegaPrizeLateLocked flag is set
        if(isMegaPrizeLateLocked) {
            isMegaPrizeEnabled = false;
        }
        
        // safeSend the relevant mega prize amount to the mega prize winner
        if(safeSend(_megaPrizeWinner, _megaPrizeAmount)) {
            //# EMIT EVENT LOG - Successful transfer of funds
        }
        else {
            //# EMIT EVENT LOG - Transfer unsuccessful, use pull withdrawals mechanism
        }

    }

}


function viewDirectPlayInfo() external view  
    returns(
        uint256 _directPlayWithdrawValue,
        uint256 _prizeOnLoss,
        bool _isDirectPlayEnabled
        ) {
        
        return (
            directPlayWithdrawValue,
            prizeOnLoss,
            isDirectPlayEnabled
        );

}


function viewWithdrawalInfo(address payable _playerAddress) external view  
    returns(uint256 _amount) {
        
        _amount = playerWithdrawals[_playerAddress];
        return(_amount);

        //SOME ERROR IN PLAYERWITHDRAWAL KEYS, THEY WAY THEY DEDUCT WHEN WITHDRAWN. FIX IT.

}


function viewMegaPrizeInfo() external view  
    returns(
        uint256 _megaPrizeAmount,
        uint256 _megaPrizeDurationInEpoch,
        uint256 _megaPrizeDurationInBlocks,
        bool _isMegaPrizeEnabled,
        bool _isMegaPrizeMatured
    ){
        return (
            megaPrizeAmount,
            megaPrizeDurationInEpoch,
            megaPrizeDurationInBlocks,
            isMegaPrizeEnabled,
            isMegaPrizeMatured
        );

}


function viewRoundInfo(uint256 _gameID, uint256 _roundNumber ) external view  
    returns(
        uint256 _totalTokensPurchased,
        uint256 _iterationStartTimeMS,
        uint256 _iterationStartTimeBlock,
        address payable[] memory _playerList,
        uint256[] memory _playerTokensList,
        address payable _winner,
        bytes memory _oraclizeProof
    ){
        // _gameID should be valid
        require(gameStrategies[_gameID].gameID != 0, " GameID doesn't exist. ");
        // check _roundNumber is valid and not the current round number
        require(_roundNumber != 0 && _roundNumber < gameStrategies[_gameID].currentRound, 
            " Round number can't be current round or an invalid round number. ");
        // get the unique roundID value from the _gameID & _roundNumber pair (pairing function)
        uint256 roundID = cantorPairing(_gameID, _roundNumber);
        // game round (_roundNumber) should not be active or open
        require(rounds[roundID].isRoundOpen != true, " Round number chosen is stil open. ");

        _totalTokensPurchased = rounds[roundID].totalTokensPurchased;
        _iterationStartTimeMS = rounds[roundID].iterationStartTimeMS;
        _iterationStartTimeBlock = rounds[roundID].iterationStartTimeBlock;
        _playerList = rounds[roundID].playerList;
        _playerTokensList = new uint256[](_playerList.length);
        for (uint256 i=0; i<rounds[roundID].playerList.length; i++) {
            _playerTokensList[i] =  rounds[roundID].playerTokens[_playerList[i]];

        }
        _winner = rounds[roundID].winner;
        _oraclizeProof = rounds[roundID].oraclizeProof;

        return( 
            _totalTokensPurchased,
            _iterationStartTimeMS,
            _iterationStartTimeBlock,
            _playerList,
            _playerTokensList,
            _winner,
            _oraclizeProof 
        );

}


function viewGameIDs() external view  
    returns(
        uint256[] memory _gameIDs,
        uint256 _gameIDsLength
    ){
        _gameIDsLength = gameStrategiesKeys.length;
        _gameIDs = new uint256[](_gameIDsLength);

        for(uint256 i=0;i < _gameIDsLength;i++) {
            _gameIDs[i] = gameStrategies[gameStrategiesKeys[i]].gameID;
        }

}


function getMegaPrizeByAdmin() external view  
    onlyOwners returns(
        uint256 _megaPrizeID,
        uint256 _megaPrizeAmount,
        uint256 _megaPrizeNumber,
        uint256 _megaPrizeDurationInEpoch,
        uint256 _megaPrizeDurationInBlocks,
        address payable[] memory _megaPrizePlayersKeys,
        bool _isMegaPrizeEnabled,
        bool _isMegaPrizeLateLocked,
        bool _isMegaPrizeMatured
    ){
        _megaPrizeID = megaPrizeID;
        _megaPrizeAmount = megaPrizeAmount;
        _megaPrizeNumber = megaPrizeNumber;
        _megaPrizeDurationInEpoch = megaPrizeDurationInEpoch;
        _megaPrizeDurationInBlocks = megaPrizeDurationInBlocks;
        _megaPrizePlayersKeys = megaPrizePlayersKeys;
        _isMegaPrizeEnabled = isMegaPrizeEnabled;
        _isMegaPrizeLateLocked = isMegaPrizeLateLocked;
        _isMegaPrizeMatured = isMegaPrizeMatured;

        return (
            _megaPrizeID,
            _megaPrizeAmount,
            _megaPrizeNumber,
            _megaPrizeDurationInEpoch,
            _megaPrizeDurationInBlocks,
            _megaPrizePlayersKeys,
            _isMegaPrizeEnabled,
            _isMegaPrizeLateLocked,
            _isMegaPrizeMatured
        );

}


function getWithdrawalsByAdmin() external view 
    onlyOwners returns(uint256[] memory _playerWithdrawalsAmounts, address payable[] memory _playerWithdrawalsKeys) {

        _playerWithdrawalsKeys = playerWithdrawalsKeys;
        uint256 withdrawalListLength = playerWithdrawalsKeys.length;
        uint256[] memory _playerWithdrawals = new uint256[](withdrawalListLength);
        // copy the pending withdraw amounts of players to an array
        for(uint256 i=0;i < withdrawalListLength; i++) {
            _playerWithdrawals[i] = playerWithdrawals[playerWithdrawalsKeys[i]];

        }

        return(_playerWithdrawalsAmounts, _playerWithdrawalsKeys);

}


function getOraclizeByAdmin() external view onlyOwners returns(uint256[] memory _pendingRoundsOraclize) {
        _pendingRoundsOraclize = pendingRoundsOraclize;
}


/**
    * @dev sends the amount of ethers to the required _toAddress
    * Make sure all the state changes are already committed prior to invocation. 
*/
function safeSend(address payable _toAddress, uint256 _amount) private 
    returns (bool _success) {

        if(!_toAddress.send(_amount)) {
            if(playerWithdrawals[_toAddress] == 0) {
                playerWithdrawalsKeys.push(_toAddress);
            }
            playerWithdrawals[_toAddress] = (playerWithdrawals[_toAddress]).add(_amount);
            _success = false;
        }
        else {
            _success = true;
        }

        return _success;
}


/**
    * @dev function for players to manually withdraw their amounts in case of send invocation error
    * Make sure all the state changes are already committed prior to invocation. 
*/
function withdraw() public {
        uint256 _amount = playerWithdrawals[msg.sender];
        
        require(_amount > 0, " There is no _amount left to withdraw ");
        require(address(this).balance >= _amount, 
            " Insufficient funds available in contract to invoke withdraw. Contact admin in case of a legitimate irregularity. ");

        playerWithdrawals[msg.sender] = 0;
        // implement code to remove the address entry from the withdrawplayerlist

        uint256 i;
        uint256 _withdrawKeysLength = playerWithdrawalsKeys.length;
        for (i=0; i < _withdrawKeysLength; i++) {
            if(playerWithdrawalsKeys[i] == msg.sender) {
                playerWithdrawalsKeys[i] = playerWithdrawalsKeys[_withdrawKeysLength.sub(1)];
                break;
            }
        }
        playerWithdrawalsKeys.length = (playerWithdrawalsKeys.length).sub(1);
        msg.sender.transfer(_amount);
}


/**
    * @dev function for transferring funds to a given To address
    * Only owner address can transfer ether, in case contract based transfers revert. 
*/
function transferByAdmin(address payable _toAddress, uint _amount) public 
    onlyOwner {

        require(_amount > 0, " There is no amount left to withdraw ");
        require(address(this).balance >= _amount, 
        " Insufficient funds available in contract to invoke withdraw. Contact admin in case of legit irregularity. ");

        playerWithdrawals[_toAddress] = 0;
        // remove the entry of _toAddress from playerWithdrawalsKeys array
        uint256 i;
        uint256 _withdrawKeysLength = playerWithdrawalsKeys.length;
        for (i=0; i < _withdrawKeysLength; i++) {
            if(playerWithdrawalsKeys[i] == _toAddress) {
                playerWithdrawalsKeys[i] = playerWithdrawalsKeys[_withdrawKeysLength.sub(1)];
                break;
            }
        }

        if(i != _withdrawKeysLength) {
            playerWithdrawalsKeys.length = (playerWithdrawalsKeys.length).sub(1);
        }
        // send the amount to the destination address
        if(_toAddress.send(_amount)) 
            //# EMIT EVENT LOG - Successful transfer of funds
            true;
        else
            //# EMIT EVENT LOG - Transfer unsuccessful, use pull withdrawals mechanism
            true; 

}


/**
    * @dev outputs the Cantor Pairing Function result of two input natural numbers 
    * Function: π(a,b)=1/2(a+b)(a+b+1)+b  
*/
function cantorPairing(uint256 _a, uint256 _b) private pure
    returns (uint256 _result) {

        require(_a > 0 && _b > 0, 
            " Exception raised in internal mathematical operation ");
        _result = (((_a.add(_b)).mul((_a.add(_b)).add(1)))/2).add(_b);

        return _result;
}


// fallback function which implements DirectPlay
function () external payable {

    if(msg.sender != owner() && msg.sender != timekeeper()) {
        // if the token value pertains to DirectPlay Withdraw feature, withdraw player's pending amount alongwith token value
        if(msg.value == directPlayWithdrawValue) {
            playerWithdrawals[msg.sender] = (playerWithdrawals[msg.sender]).add(msg.value);
            withdraw();
            return;
        }
        // else scan through the tokenValue of every game to find which game the player wants to play
        uint256 _gameID;
        uint256 _roundNumber;
        uint256 i;
        require(!isGamesPaused, " All games are in Pause mode. Wait till admin resumes the game. ");
        for(i=0;i < gameStrategiesKeys.length; i++) {
            if(msg.value == gameStrategies[gameStrategiesKeys[i]].tokenValue) {
                _gameID = gameStrategiesKeys[i];
                _roundNumber = gameStrategies[gameStrategiesKeys[i]].currentRound;
                playGame(_gameID, _roundNumber, DIRECTPLAYTOKEN);
                break;

            }
        }
        // if the token value doesn't match any of the features, revert the transaction
        if(i == gameStrategiesKeys.length) { revert(" token value sent doesn't match any of the Direct Play options. ");}
    }
    else {
        if(msg.value == directPlayWithdrawValue) {
            withdraw();
            return;
        }
        
    }
}


// self destruct contract after reverting all pending games of players and sending back funds
function ownerKill() external 
    onlyOwner{
        revertFundsToPlayers();
        selfdestruct(owner());
        
}


}
/*

END MULTIPRIZER

*/








