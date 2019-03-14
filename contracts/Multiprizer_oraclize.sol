pragma solidity ^0.5.0;
import "./oraclizeAPI.sol"; 

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
 * @title Multiprizer_abstract
 * @dev The Multiprizer contract is the core game.
 */
contract Multiprizer_abstract {
    function calculateWinnerByOracle(
    bytes32 _oraclizeID, 
    bytes calldata _result, 
    bytes calldata _oraclizeProof, 
    bool _isProofValid) external;
}


/**
 * @title Multiprizer_oraclize
 * @dev The Multiprizer contract is the core game.
 */

contract Multiprizer_oraclize is Ownable, usingOraclize  {

/** 
*  Contract Variable
*  @dev DirectPlay enables a player to place a single token for any of the strategy games   
*  execute manual withdraw of your prizes won by sending directPlayWithdraw value of ethers. 
  */
Multiprizer_abstract private multiprizer;

/** 
*  Oraclize Props Variables 
*  @dev DirectPlay enables a player to place a single token for any of the strategy games   
*  execute manual withdraw of your prizes won by sending directPlayWithdraw value of ethers. 
  */
uint256 gasLimitOraclize;
uint256 gasPriceOraclize;
uint256 numBytesOraclize;
uint256 delayOraclize;
uint256 priceOraclize;
string constant dataSourceOraclize = "random";

/** 
*  Oraclize Result Variables 
*  @dev DirectPlay enables a player to place a single token for any of the strategy games   
*  execute manual withdraw of your prizes won by sending directPlayWithdraw value of ethers. 
  */
mapping(bytes32 => uint256) private oraclizeIDIndexes;
bytes32[] public oraclizeIDs;
mapping(uint256 => bytes) private oraclizeProofs;
mapping(uint256 => bytes) private results;
mapping(uint256 => bool) private isProofsValid;
uint256 public oraclizeLength;


/** 
*  Control Variables 
*  @dev DirectPlay enables a player to place a single token for any of the strategy games   
*  execute manual withdraw of your prizes won by sending directPlayWithdraw value of ethers. 
  */
address payable public multiprizerAddress;

/** 
*  Constructor call 
*  @dev DirectPlay enables a player to place a single token for any of the strategy games   
*  execute manual withdraw of your prizes won by sending directPlayWithdraw value of ethers. 
  */
constructor (address payable _contractAddress) public {
    //# EMIT EVENT LOG - to be done
    multiprizerAddress = _contractAddress;
    multiprizer = Multiprizer_abstract(multiprizerAddress);
    // set proof type as 'ledger'. this needn't be changed further
    oraclize_setProof(proofType_Ledger);
    // push a zero-init value to the oraclizeIDs array to help it prevent malicious oraclize executions
    oraclizeIDs.push("");
}

function updateOraclizePropsByAdmin(uint256 _gasLimitOraclize, uint256 _gasPriceOraclize, 
    uint256 _numBytesOraclize, uint256 _delayOraclize) external 
    onlyOwners {

    if(gasLimitOraclize != _gasLimitOraclize) {
        gasLimitOraclize = _gasLimitOraclize;
        if(gasPriceOraclize != _gasPriceOraclize) {
            gasPriceOraclize = _gasPriceOraclize;
            oraclize_setCustomGasPrice(_gasPriceOraclize);
        }
        priceOraclize = oraclize_getPrice(dataSourceOraclize, gasLimitOraclize);
    }
    numBytesOraclize = _numBytesOraclize;
    delayOraclize = _delayOraclize;
    // dataSource is constant to "random"
    // proof type is fixed to 'ledger' proof
        
    //# EMIT EVENT LOG - to be done
}

function getOraclizePropsByAdmin() external view 
    onlyOwners returns(
        uint256 _gasLimitOraclize,
        uint256 _gasPriceOraclize,
        uint256 _numBytesOraclize,
        uint256 _delayOraclize, 
        uint256 _priceOraclize
    ) {
        _gasLimitOraclize = gasLimitOraclize;
        _gasPriceOraclize = gasPriceOraclize;
        _numBytesOraclize = numBytesOraclize;
        _delayOraclize = delayOraclize;
        _priceOraclize = priceOraclize;
}

function getOraclizeResultByAdmin(bytes32 _oraclizeID) external view
    onlyOwners returns (
        bytes memory _result, 
        bytes memory _oraclizeProof, 
        bool _isProofValid
        ) {
    // can only be called by the Multiprizer contract
    //if (msg.sender != multiprizerAddress) revert();
    uint256 resultIndex = oraclizeIDIndexes[_oraclizeID];
    if(resultIndex == 0) {
        return("","",false);
    }
    _result = results[resultIndex];
    _oraclizeProof = oraclizeProofs[resultIndex];
    _isProofValid = isProofsValid[resultIndex];
}

function newRandomDSQuery() external returns (bytes32 _queryId) {
    if (msg.sender != multiprizerAddress) revert("caller_err");
        //check if contract has enough funds to invoke oraclize
        if(priceOraclize > address(this).balance) {
            // pause all games until contract funds have been replenished
            return(_queryId);
        }
        _queryId = oraclize_newRandomDSQuery(delayOraclize, numBytesOraclize, gasLimitOraclize);
}

function __callback(bytes32 _oraclizeID, string memory _result, bytes memory _oraclizeProof) public {
    // check if the callback was invoked by oraclize
    if (msg.sender != oraclize_cbAddress()) revert("caller_err");
    bool _isProofValid;
    uint256 _proofCode;
    // if a round has been already decided by Oraclize callback, then continue with next round. 
    // This will also help to prevent any possible malicious execution by Oraclize itself
    if(oraclizeIDIndexes[_oraclizeID] != 0) return;
    _proofCode = oraclize_randomDS_proofVerify__returnCode(_oraclizeID, _result, _oraclizeProof);
    if (_proofCode != 0) {
        _isProofValid = false;
    }
    else {
        _isProofValid = true;
    }
    // store the oraclize results in the Oraclize Result State Variables
    oraclizeIDs.push(_oraclizeID);
    oraclizeLength = oraclizeIDs.length;
    oraclizeIDIndexes[_oraclizeID] = oraclizeLength-1;
    results[oraclizeLength-1] = bytes(_result);
    oraclizeProofs[oraclizeLength-1] = _oraclizeProof;
    isProofsValid[oraclizeLength-1] = _isProofValid;
    multiprizer.calculateWinnerByOracle(_oraclizeID, results[oraclizeLength-1], _oraclizeProof, _isProofValid);
}

// fallback function 
function () external payable {
    /* if(msg.sender != owner() && msg.sender != timekeeper() && msg.sender != multiprizerAddress)
        revert(" only admins can send funds to this contract "); */
    
}

// self destruct contract after reverting all pending games of players and sending back funds
function ownerKill() external 
    onlyOwner{
        selfdestruct(owner());
        
}

}


//# IMPLEMENT TRANSFER FUNCTION FOR MANUAL TRANSFER OF FUNDS FROM CONTRACT








