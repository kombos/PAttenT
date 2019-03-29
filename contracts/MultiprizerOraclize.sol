pragma solidity ^ 0.5.0;
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
 * @title MultiprizerAbstract
 * @dev This contract denotes the core Multiprizer contract.
 */
contract MultiprizerAbstract {
    function calculateWinnerByOracle(
        bytes32 _oraclizeID,
        bytes calldata _result,
        //bytes calldata _oraclizeProof,
        bool _isProofValid) external;
}


/**
 * @title MultiprizerOraclize
 * @dev The Multiprizer contract is the core game.
 */

contract MultiprizerOraclize is Ownable, usingOraclize {

    /** 
    *  Contract Variable
    *  @dev DirectPlay enables a player to place a single token for any of the strategy games   
    *  execute manual withdraw of your prizes won by sending directPlayWithdraw value of ethers. 
      */
    MultiprizerAbstract private multiprizer;

    /** 
    *  Oraclize Props Variables 
    *  @dev DirectPlay enables a player to place a single token for any of the strategy games   
    *  execute manual withdraw of your prizes won by sending directPlayWithdraw value of ethers. 
      */
    uint256 private gasLimitOraclize;
    uint256 private gasPriceOraclize;
    uint256 private numBytesOraclize;
    uint256 private delayOraclize;
    uint256 public priceOraclize;
    string constant private DATASOURCE = "random";

    /** 
    *  Oraclize Result Variables 
    *  @dev DirectPlay enables a player to place a single token for any of the strategy games   
    *  execute manual withdraw of your prizes won by sending directPlayWithdraw value of ethers. 
      */
    /* mapping(bytes32 => uint256) private oraclizeIDIndexes;
    bytes32[] public oraclizeIDs;
    mapping(uint256 => bytes) private oraclizeProofs;
    mapping(uint256 => bytes) private results;
    mapping(uint256 => bool) private isProofsValid;
    uint256 public oraclizeLength; */


    /** 
    *  Control Variables 
    *  @dev DirectPlay enables a player to place a single token for any of the strategy games   
    *  execute manual withdraw of your prizes won by sending directPlayWithdraw value of ethers. 
      */
    address payable public multiprizerAddress;

    /** 
    *  Event Logs 
    *  @dev DirectPlay enables a player to place a single token for any of the strategy games   
    *  execute manual withdraw of your prizes won by sending directPlayWithdraw value of ethers. 
      */
    event OraclizeValues(bytes32 _oraclizeID, bool _isProofValid, bytes _oraclizeProof, bytes _result);

    /** 
    *  Constructor call 
    *  @dev DirectPlay enables a player to place a single token for any of the strategy games   
    *  execute manual withdraw of your prizes won by sending directPlayWithdraw value of ethers. 
      */
    constructor(address payable _contractAddress) public {
        //# EMIT EVENT LOG - to be done
        multiprizerAddress = _contractAddress;
        multiprizer = MultiprizerAbstract(multiprizerAddress);
        // set proof type as 'ledger'. this needn't be changed further
        oraclize_setProof(proofType_Ledger);
        // push a zero-init value to the oraclizeIDs array to help it prevent malicious oraclize executions
        /* oraclizeIDs.push("");
        oraclizeLength = oraclizeIDs.length; */
    }

    function setContractAddrByAdmin(address payable _contractAddress) external
    onlyOwners {
        multiprizerAddress = _contractAddress;
        multiprizer = MultiprizerAbstract(multiprizerAddress);
    }

    function updateOraclizePropsByAdmin(uint256 _gasLimitOraclize, uint256 _gasPriceOraclize,
        uint256 _numBytesOraclize, uint256 _delayOraclize) external
    onlyOwners {

        if (gasLimitOraclize != _gasLimitOraclize) {
            gasLimitOraclize = _gasLimitOraclize;
            if (gasPriceOraclize != _gasPriceOraclize) {
                gasPriceOraclize = _gasPriceOraclize;
                oraclize_setCustomGasPrice(_gasPriceOraclize);
            }
            priceOraclize = oraclize_getPrice(DATASOURCE, gasLimitOraclize);
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

    function newRandomDSQuery() external payable returns(bytes32 _queryId) {
        require(msg.sender == multiprizerAddress, "caller_err");
        //check if contract has enough funds to invoke oraclize
        if (priceOraclize > address(this).balance) {
            // pause all games until contract funds have been replenished
            return (_queryId);
        }
        _queryId = oraclize_newRandomDSQuery(delayOraclize, numBytesOraclize, gasLimitOraclize);
    }

    function __callback(bytes32 _oraclizeID, string memory _result, bytes memory _oraclizeProof) public {
        // check if the callback was invoked by oraclize
        require(msg.sender == oraclize_cbAddress(), "caller_err");
        uint8 _proofCode = oraclize_randomDS_proofVerify__returnCode(_oraclizeID, _result, _oraclizeProof);
        bool _isProofValid = (_proofCode == 0) ? true : false;
        multiprizer.calculateWinnerByOracle(_oraclizeID, bytes(_result), _isProofValid);
        emit OraclizeValues(_oraclizeID, _isProofValid, _oraclizeProof, bytes(_result));
    }

    // transfer amount to address (admin)
    function safeSend(address payable _toAddress, uint256 _amount) external onlyOwners
    {
        require(_amount > 0, "amt_zero");
        require(address(this).balance >= _amount,
            "no_funds");

        _toAddress.transfer(_amount);
    }

    // fallback function (payable)
    function () external payable {

    }

    // self destruct contract after reverting all pending games of players and sending back funds
    function ownerKill() external
    onlyOwner {
        selfdestruct(owner());

    }

}


//# IMPLEMENT TRANSFER FUNCTION FOR MANUAL TRANSFER OF FUNDS FROM CONTRACT








