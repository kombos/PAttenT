/* 
  KOMBOS
*/  

pragma solidity ^0.5.0;

/**
 * @title Ownable (OpenZeppelin)
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

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
    function owner() public view returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(isOwner());
        _;
    }

    /**
     * @return true if `msg.sender` is the owner of the contract.
     */
    function isOwner() public view returns (bool) {
        return msg.sender == _owner;
    }
    
    /**
     * @dev Allows the current owner to transfer control of the contract to a newOwner.
     * @param newOwner The address to transfer ownership to.
     */
    function transferOwnership(address newOwner) public onlyOwner {
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers control of the contract to a newOwner.
     * @param newOwner The address to transfer ownership to.
     */
    function _transferOwnership(address newOwner) internal {
        require(newOwner != address(0));
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
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
    uint256 totalRoundsDone;
    uint256 totalValuePlaced;
    uint256 totalWinnings;
    uint256 directPlayTokenValue;
}

struct Round{
    uint256 gameID;
    uint256 roundNumber;
    uint256 iterationStartTimeMS;
    uint256 iterationStartTimeBlock;
    mapping (address => uint256) playerTokens;
    address payable[] playerlist;
    address payable winner;
}

/**  
*  @dev DirectPlay enables a player to place a single token for any of the strategy games   
*  without the need of going to the website to play. It doesn't even require metamask or  
*  other web3 injectors. All you need is an ethereum wallet from which you can directly send
*  certain valued ethers to enable automatic participation in specific games. You could even
*  execute manual withdraw of your prizes won by sending directPlayWithdraw value of ethers. 
  */

uint256 directPlayWithdrawValue;
uint256 prizeOnLoss;

mapping (address => uint256) playerWithdrawals;
mapping (uint256 => Game) public gameStrategies;
uint256[] gameStrategiesKeys;
mapping (uint256 => Round) rounds;

constructor (
    uint256[14] memory _gameProperties,
    uint256 _directPlayWithdrawValue,
    uint256 _prizeOnLoss
    ) public {
        for(uint256 index=0; index < _gameProperties[0]; index++) {
            addGameByAdmin(_gameProperties);
            updateDirectPlayByAdmin(
                _directPlayWithdrawValue,
                _prizeOnLoss
            );

        }


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
        _gameProperties[10] : uint256 totalRoundsDone,
        _gameProperties[11] : uint256 totalValuePlaced,
        _gameProperties[12] : uint256 totalWinnings,
        _gameProperties[13] : uint256 directPlayTokenValue
*/

function addGameByAdmin(uint256[14] memory _gameProperties) public 
    onlyOwner returns(uint256 _newGameIndex) {

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
        gameObj.totalRoundsDone = _gameProperties[10];
        gameObj.totalValuePlaced = _gameProperties[11];
        gameObj.totalWinnings = _gameProperties[12];
        gameObj.directPlayTokenValue = _gameProperties[13];
        
        gameStrategies[gameObj.gameID] = gameObj;
        gameStrategiesKeys[gameStrategiesKeys.length++] = gameObj.gameID;
        _newGameIndex = gameStrategiesKeys.length;

}

function updateGameByAdmin(uint256[14] calldata _gameProperties, uint256 _gameID) external 
    onlyOwner returns (bool _success) {

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
        gameObj.totalRoundsDone = _gameProperties[10];
        gameObj.totalValuePlaced = _gameProperties[11];
        gameObj.totalWinnings = _gameProperties[12];
        gameObj.directPlayTokenValue = _gameProperties[13];
        
        gameStrategies[_gameID] = gameObj;
        return true;
}


function deleteGameByAdmin(uint256 _gameID) external 
    onlyOwner returns (bool _success) {

        uint256 i=0;
        _success=false;
        require(gameStrategies[_gameID].gameID != 0, " GameID doesn't exist ");
        
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
            if(gameStrategiesKeys[i] == _gameID)
                delete gameStrategiesKeys[i];
        }
        else {
            delete gameStrategiesKeys[i];
        }
        return _success;
}


function updateDirectPlayByAdmin(
    uint256 _directPlayWithdrawValue,
    uint256 _prizeOnLoss
    ) public 
    onlyOwner returns(bool _success) {
        directPlayWithdrawValue = _directPlayWithdrawValue;
        prizeOnLoss = _prizeOnLoss;
        return true;

}

// fallback function
    function () external payable {
        //# this needs to be filled
    }




}






