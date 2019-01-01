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
    event TimekeepingTransferred(address payable indexed previousOwner, address payable indexed newOwner);

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
     * @param newOwner The address to transfer ownership to.
     */
    function transferTimekeeping(address payable newOwner) public onlyOwners {
        require(newOwner != address(0));
        emit TimekeepingTransferred(_timekeeper, newOwner);
        _timekeeper = newOwner;    
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


/**
 * @title Multiprizer
 * @dev The Multiprizer contract is the core game.
 */

contract Multiprizer is Ownable {

using SafeMath for uint256;

//gameID and roundNumber cannot start from zero value since they are used to compute roundID
struct Game{
    uint256 gameID;
    uint256 maxTokens;
    uint256 tokenValue;
    uint256 gameDurationInMilliseconds;
    uint256 timeLockDurationInMS;
    uint256 gameDurationInBlocks;
    uint256 timeLockDurationInBlocks;
    uint256 maxTokensPerPlayer;
    uint256 houseEdge;
    uint256 megaPrizeEdge;
    uint256 currentRound;
    uint256 totalValuePlaced;
    uint256 totalWinnings;
    uint256 directPlayTokenValue;
    bool isGameLocked;
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
    bytes32 oraclizeProof;
    bool isRoundOpen;
}

/**  
*  @dev DirectPlay enables a player to place a single token for any of the strategy games   
*  without the need of going to the website to play. It doesn't even require metamask or  
*  other web3 injectors. All you need is an ethereum wallet from which you can directly send
*  specific valued ethers to enable automatic participation in specific games. You could even
*  execute manual withdraw of your prizes won by sending directPlayWithdraw value of ethers. 
  */

uint256 public directPlayWithdrawValue;
uint256 public prizeOnLoss;



// Key value for rounds is 'roundID' generated uniquely from gameID and roundNumber 
// using a Pairing Function (like Cantor Pairing Function)
mapping (uint256 => Round) private rounds;
mapping (bytes32 => uint256[]) private roundsOfOraclizeID;
mapping (uint256 => Game) public gameStrategies;
uint256[] public gameStrategiesKeys;
mapping (address => uint256) private playerWithdrawals;
address payable[] private playerWithdrawalsKeys;


event lockEvent(string messageSender);

 /**
     * @dev Throws if called by any account other than the oraclize cbAddress.
     */
    modifier onlyOraclize() {
        require(msg.sender == oraclize_cbAddress());
        _;
    }

constructor () public {
            //# EMIT EVENT LOG - to be done

}

/**
    * @dev Adds a new Game with the following game properties defined in the 
    * array _gameProperties: 
        _gameProperties[0] : uint256 gameID,
        _gameProperties[1] : uint256 maxTokens,
        _gameProperties[2] : uint256 tokenValue,
        _gameProperties[3] : uint256 gameDurationInMilliseconds,
        _gameProperties[4] : uint256 timeLockDurationInMS,
        _gameProperties[5] : uint256 gameDurationInBlocks,
        _gameProperties[6] : uint256 timeLockDurationInBlocks,
        _gameProperties[7] : uint256 maxTokensPerPlayer,
        _gameProperties[8] : uint256 houseEdge,
        _gameProperties[9] : uint256 megaPrizeEdge,
        _gameProperties[10] : uint256 currentRound,
        _gameProperties[11] : uint256 totalValuePlaced,
        _gameProperties[12] : uint256 totalWinnings,
        _gameProperties[13] : uint256 directPlayTokenValue
*/

function addGameByAdmin(uint256[14] calldata _gameProperties) external 
    onlyOwner {

        require(gameStrategies[_gameProperties[0]].gameID == 0, " GameID already exists ");

        Game memory gameObj;
        gameObj.gameID = _gameProperties[0];
        gameObj.maxTokens = _gameProperties[1];
        gameObj.tokenValue = _gameProperties[2];
        gameObj.gameDurationInMilliseconds = _gameProperties[3];
        gameObj.timeLockDurationInMS = _gameProperties[4];
        gameObj.gameDurationInBlocks = _gameProperties[5];
        gameObj.timeLockDurationInBlocks = _gameProperties[6];
        gameObj.maxTokensPerPlayer = _gameProperties[7];
        gameObj.houseEdge = _gameProperties[8];
        gameObj.megaPrizeEdge = _gameProperties[9];
        gameObj.currentRound = _gameProperties[10];
        gameObj.totalValuePlaced = _gameProperties[11];
        gameObj.totalWinnings = _gameProperties[12];
        gameObj.directPlayTokenValue = _gameProperties[13];
        gameObj.isGameLocked = true;
        
        gameStrategies[gameObj.gameID] = gameObj;
        gameStrategiesKeys.push(gameObj.gameID);

        //# EMIT EVENT LOG - to be done

}

function updateGameByAdmin(uint256[14] calldata _gameProperties, uint256 _gameID) external 
    onlyOwner {

        require(gameStrategies[_gameID].gameID != 0, " GameID doesn't exist ");

        Game memory gameObj;
        gameObj.gameID = _gameProperties[0];
        gameObj.maxTokens = _gameProperties[1];
        gameObj.tokenValue = _gameProperties[2];
        gameObj.gameDurationInMilliseconds = _gameProperties[3];
        gameObj.timeLockDurationInMS = _gameProperties[4];
        gameObj.gameDurationInBlocks = _gameProperties[5];
        gameObj.timeLockDurationInBlocks = _gameProperties[6];
        gameObj.maxTokensPerPlayer = _gameProperties[7];
        gameObj.houseEdge = _gameProperties[8];
        gameObj.megaPrizeEdge = _gameProperties[9];
        gameObj.currentRound = _gameProperties[10];
        gameObj.totalValuePlaced = _gameProperties[11];
        gameObj.totalWinnings = _gameProperties[12];
        gameObj.directPlayTokenValue = _gameProperties[13];
        gameObj.isGameLocked = true;
        
        gameStrategies[_gameID] = gameObj;
        //# EMIT EVENT LOG - to be done
}


function deleteGameByAdmin(uint256 _gameID) external 
    onlyOwner {

        
        require(gameStrategies[_gameID].gameID != 0, " GameID doesn't exist ");
        uint256 i;
        bool _success=false;
        delete gameStrategies[_gameID];
        for (i=0; i < gameStrategiesKeys.length-1; i++) {
            if(gameStrategiesKeys[i] == _gameID) {
                _success=true;
            }
            if(_success == true){
                gameStrategiesKeys[i] = gameStrategiesKeys[i+1];
            }
        }

        if(_success != true) {
            if(gameStrategiesKeys[i] == _gameID) {
                delete gameStrategiesKeys[i];
                gameStrategiesKeys.length--;
            }
            else
                revert(" Error during game deletion. Couldn't find the required game. ");
        }
        else {
            delete gameStrategiesKeys[i];
            gameStrategiesKeys.length--;
        }

        //# EMIT EVENT LOG - to be done
}


function updateDirectPlayByAdmin( uint256 _directPlayWithdrawValue, uint256 _prizeOnLoss ) external 
    onlyOwner {
        directPlayWithdrawValue = _directPlayWithdrawValue;
        prizeOnLoss = _prizeOnLoss;

        //# EMIT EVENT LOG - to be done
}



function lockGamesByAdmin(uint256[] calldata _gameIDs) external 
    onlyOwners {

        for(uint256 i=0; i<_gameIDs.length; i++) {
            require(gameStrategies[_gameIDs[i]].gameID != 0, " GameID doesn't exist ");
            gameStrategies[_gameIDs[i]].isGameLocked = true;

        }

        //# EMIT EVENT LOG1
        //emit lockEvent("admin", _gameIDs);
}


function unlockGamesByAdmin(uint256[] calldata _gameIDs) external 
    onlyOwners {

        for(uint256 i=0; i<_gameIDs.length; i++) {
            require(gameStrategies[_gameIDs[i]].gameID != 0, " GameID doesn't exist ");
            gameStrategies[_gameIDs[i]].isGameLocked = false;

        }

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
        // zero check for _roundNumber and numberOfTokens
        require(_roundNumber != 0 && _numberOfTokens != 0, " Invalid values given in game parameters. ");
        // get the unique roundID value from the _gameID & _roundNumber pair (pairing function)
        uint256 roundID = cantorPairing(_gameID, _roundNumber);
        // game round (_roundNumber) should be active
        require(rounds[roundID].isRoundOpen == true, " Round chosen is not a valid and active round. ");
        // check if the totalTokensPurchased for the round doesn't cross maxTokens for the game 
        require(_numberOfTokens + rounds[roundID].totalTokensPurchased <= gameStrategies[_gameID].maxTokens,
            " Max tokens that can be purchased for this round has been exceeded. Wait for open slots. ");
        // _numberOfTokens should be a valid value as per game strategy
        require(_numberOfTokens + rounds[roundID].playerTokens[msg.sender] <= gameStrategies[_gameID].maxTokensPerPlayer,
            " Total tokens purchased by player exceeds maximum allowed for this game. Try another game. ");
        // ethers sent should be equal to token value
        require(msg.value >= _numberOfTokens.mul(gameStrategies[_gameID].tokenValue),  
            " Amount sent is less than required ");
        
        rounds[roundID].playerTokens[msg.sender] = (rounds[roundID].playerTokens[msg.sender]).add(_numberOfTokens);
        rounds[roundID].playerList.push(msg.sender);
        rounds[roundID].totalTokensPurchased = (rounds[roundID].totalTokensPurchased).add(rounds[roundID].playerTokens[msg.sender]);
        
        //# EMIT EVENT LOG - to be done

}


function revertGame(uint256 _gameID, uint256 _roundNumber, address payable _playerAddress ) public  {
    
    // _gameID should be valid
    require(gameStrategies[_gameID].gameID != 0, " GameID doesn't exist. ");
    // check the validity of sender address / player address
    require(msg.sender == owner() || msg.sender == _playerAddress, " Message sender address invalid. ");
    if(msg.sender == _playerAddress) {
        // game should not be in locked mode
        require(!gameStrategies[_gameID].isGameLocked, 
            " Revert not possible as game is locked by admin. Wait till the game resumes. ");
    }
    // zero check for _roundNumber and numberOfTokens
    require(_roundNumber != 0, " Invalid round number given in game parameters. ");
    // get the unique roundID value from the _gameID & _roundNumber pair (pairing function)
    uint256 roundID = cantorPairing(_gameID, _roundNumber);
    // game round (_roundNumber) should be active
    require(rounds[roundID].isRoundOpen == true, " Round chosen is not a valid and active round. ");
    // _numberOfTokens should be a valid value as per game strategy
    require(rounds[roundID].playerTokens[_playerAddress] > 0,
        " There are no existing tokens in the active round to revert. ");
    
    // refund the amount placed 
    uint256 refundAmount = (rounds[roundID].playerTokens[_playerAddress]).mul((gameStrategies[_gameID].tokenValue));
    rounds[roundID].totalTokensPurchased = (rounds[roundID].totalTokensPurchased).sub(rounds[roundID].playerTokens[_playerAddress]);

    // remove the entry of _playerAddress from playerList array of the round
    uint256 i;
    bool _success=false;
    for (i=0; i < rounds[roundID].playerList.length-1; i++) {
        if(rounds[roundID].playerList[i] == _playerAddress) {
            _success=true;
        }
        if(_success == true){
            rounds[roundID].playerList[i] = rounds[roundID].playerList[i+1];
        }
    }

    if(_success != true) {
        if(rounds[roundID].playerList[i] == _playerAddress) {
            delete rounds[roundID].playerList[i];
            rounds[roundID].playerList.length--;
        }
        else
            revert(" Error during revert token function. Couldn't find the required token(s). ");
    }
    else {
        delete rounds[roundID].playerList[i];
        rounds[roundID].playerList.length--;
    }
    // remove the _playerAddress entry from the playerTokens mapping value of the round
    rounds[roundID].playerTokens[_playerAddress] = 0;
    if(!_playerAddress.send(refundAmount)) {
        //# EMIT EVENT LOG - to be done

        playerWithdrawals[_playerAddress] = (playerWithdrawals[_playerAddress]).add(refundAmount);
    }

    //# EMIT EVENT LOG - to be done
}


function completeRounds(uint256[] memory _gameIDs) public 
    onlyOwners {
        // _gameIDs should be valid
        for(uint256 i=0; i<_gameIDs.length; i++) {
            require(gameStrategies[_gameIDs[i]].gameID != 0, " GameID doesn't exist ");

        }

        bytes32 _oraclizeID;
        
        _oraclizeID = oraclize_query(); //# finish this oraclize function

        uint256 _roundNumber;
        uint256 _nextRoundNumber;
        uint256 roundID;
        uint256 nextRoundID;

        for(uint256 i=0; i<_gameIDs.length; i++) {
            if(!gameStrategies[_gameIDs[i]].isGameLocked) {
                // close the current round
                _roundNumber = gameStrategies[_gameIDs[i]].currentRound;
                roundID = cantorPairing(_gameIDs[i], _roundNumber);
                rounds[roundID].isRoundOpen = false;
                rounds[roundID].oraclizeID = _oraclizeID;
                roundsOfOraclizeID[_oraclizeID].push(_gameIDs[i]);
                // increment the round number and start a new round
                _nextRoundNumber = _roundNumber.add(1);
                gameStrategies[_gameIDs[i]].currentRound = _nextRoundNumber;
                nextRoundID = cantorPairing(_gameIDs[i], _nextRoundNumber);
                rounds[roundID].gameID = gameStrategies[_gameIDs[i]].gameID;
                rounds[roundID].roundNumber = _nextRoundNumber;
                rounds[roundID].totalTokensPurchased = 0;
                rounds[roundID].iterationStartTimeMS = now;
                rounds[roundID].iterationStartTimeBlock = block.number;
                rounds[roundID].isRoundOpen = true;

            }

        }

        gameStrategies[_gameID].isGameLocked = true;

        if(msg.sender == timekeeper())
        //# EMIT EVENT LOG1
        emit lockEvent("timekeeper");
        else
        //# EMIT EVENT LOG1
        emit lockEvent("admin");

        //# playerTokensValue in round needs to be updated
        //lets do it at the playGame and revert end itself
        //oops there is no var called playerTokensValue
}


function __callback(bytes32 oraclizeID, string memory result, bytes memory proof) public   
    onlyOraclize {

        //# transpose the values of player tokens to make sure a common random number for 
        //several games does not make the game predictable

}


function getRoundInfo(uint256 _gameID, uint256 _roundNumber ) public view  
    returns(
        uint256 _totalTokensPurchased,
        uint256 _iterationStartTimeMS,
        uint256 _iterationStartTimeBlock,
        address payable _winner,
        bytes32 _oraclizeProof
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
        _winner = rounds[roundID].winner;
        _oraclizeProof = rounds[roundID].oraclizeProof;

        return( 
            _totalTokensPurchased,
            _iterationStartTimeMS,
            _iterationStartTimeBlock,
            _winner,
            _oraclizeProof );

}


/**
    * @dev outputs the Cantor Pairing Function result of two input natural numbers 
    * Function: π(a,b)=1/2(a+b)(a+b+1)+b  
*/
function cantorPairing(uint256 _a, uint256 _b) internal 
    pure returns (uint256 _result) {

        require(_a > 0 && _b > 0, 
            " Exception raised in internal mathematical operation ");
        _result = (((_a.add(_b)).mul((_a.add(_b)).add(1)))/2).add(_b);

        //# EMIT EVENT LOG - to be done
        return _result;
}



// fallback function
    function () external payable {
        //# this needs to be filled
    }




}// End of Multiprizer Contract








