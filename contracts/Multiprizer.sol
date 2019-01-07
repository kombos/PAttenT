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


/*

ORACLIZE_API

Copyright (c) 2015-2016 Oraclize SRL
Copyright (c) 2016 Oraclize LTD

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

contract OraclizeI {

    address public cbAddress;

    function setProofType(byte _proofType) external;
    function setCustomGasPrice(uint _gasPrice) external;
    function getPrice(string memory _datasource) public returns (uint _dsprice);
    function randomDS_getSessionPubKeyHash() external view returns (bytes32 _sessionKeyHash);
    function getPrice(string memory _datasource, uint _gasLimit) public returns (uint _dsprice);
    function queryN(uint _timestamp, string memory _datasource, bytes memory _argN) public payable returns (bytes32 _id);
    function query(uint _timestamp, string calldata _datasource, string calldata _arg) external payable returns (bytes32 _id);
    function query2(uint _timestamp, string memory _datasource, string memory _arg1, string memory _arg2) public payable returns (bytes32 _id);
    function query_withGasLimit(uint _timestamp, string calldata _datasource, string calldata _arg, uint _gasLimit) external payable returns (bytes32 _id);
    function queryN_withGasLimit(uint _timestamp, string calldata _datasource, bytes calldata _argN, uint _gasLimit) external payable returns (bytes32 _id);
    function query2_withGasLimit(uint _timestamp, string calldata _datasource, string calldata _arg1, string calldata _arg2, uint _gasLimit) external payable returns (bytes32 _id);
}

contract OraclizeAddrResolverI {
    function getAddress() public returns (address _address);
}
/*

Begin solidity-cborutils

https://github.com/smartcontractkit/solidity-cborutils

MIT License

Copyright (c) 2018 SmartContract ChainLink, Ltd.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/
library Buffer {

    struct buffer {
        bytes buf;
        uint capacity;
    }

    function init(buffer memory _buf, uint _capacity) internal pure {
        uint capacity = _capacity;
        if (capacity % 32 != 0) {
            capacity += 32 - (capacity % 32);
        }
        _buf.capacity = capacity; // Allocate space for the buffer data
        assembly {
            let ptr := mload(0x40)
            mstore(_buf, ptr)
            mstore(ptr, 0)
            mstore(0x40, add(ptr, capacity))
        }
    }

    function resize(buffer memory _buf, uint _capacity) private pure {
        bytes memory oldbuf = _buf.buf;
        init(_buf, _capacity);
        append(_buf, oldbuf);
    }

    function max(uint _a, uint _b) private pure returns (uint _max) {
        if (_a > _b) {
            return _a;
        }
        return _b;
    }
    /**
      * @dev Appends a byte array to the end of the buffer. Resizes if doing so
      *      would exceed the capacity of the buffer.
      * @param _buf The buffer to append to.
      * @param _data The data to append.
      * @return The original buffer.
      *
      */
    function append(buffer memory _buf, bytes memory _data) internal pure returns (buffer memory _buffer) {
        if (_data.length + _buf.buf.length > _buf.capacity) {
            resize(_buf, max(_buf.capacity, _data.length) * 2);
        }
        uint dest;
        uint src;
        uint len = _data.length;
        assembly {
            let bufptr := mload(_buf) // Memory address of the buffer data
            let buflen := mload(bufptr) // Length of existing buffer data
            dest := add(add(bufptr, buflen), 32) // Start address = buffer address + buffer length + sizeof(buffer length)
            mstore(bufptr, add(buflen, mload(_data))) // Update buffer length
            src := add(_data, 32)
        }
        for(; len >= 32; len -= 32) { // Copy word-length chunks while possible
            assembly {
                mstore(dest, mload(src))
            }
            dest += 32;
            src += 32;
        }
        uint mask = 256 ** (32 - len) - 1; // Copy remaining bytes
        assembly {
            let srcpart := and(mload(src), not(mask))
            let destpart := and(mload(dest), mask)
            mstore(dest, or(destpart, srcpart))
        }
        return _buf;
    }
    /**
      *
      * @dev Appends a byte to the end of the buffer. Resizes if doing so would
      * exceed the capacity of the buffer.
      * @param _buf The buffer to append to.
      * @param _data The data to append.
      * @return The original buffer.
      *
      */
    function append(buffer memory _buf, uint8 _data) internal pure {
        if (_buf.buf.length + 1 > _buf.capacity) {
            resize(_buf, _buf.capacity * 2);
        }
        assembly {
            let bufptr := mload(_buf) // Memory address of the buffer data
            let buflen := mload(bufptr) // Length of existing buffer data
            let dest := add(add(bufptr, buflen), 32) // Address = buffer address + buffer length + sizeof(buffer length)
            mstore8(dest, _data)
            mstore(bufptr, add(buflen, 1)) // Update buffer length
        }
    }
    /**
      *
      * @dev Appends a byte to the end of the buffer. Resizes if doing so would
      * exceed the capacity of the buffer.
      * @param _buf The buffer to append to.
      * @param _data The data to append.
      * @return The original buffer.
      *
      */
    function appendInt(buffer memory _buf, uint _data, uint _len) internal pure returns (buffer memory _buffer) {
        if (_len + _buf.buf.length > _buf.capacity) {
            resize(_buf, max(_buf.capacity, _len) * 2);
        }
        uint mask = 256 ** _len - 1;
        assembly {
            let bufptr := mload(_buf) // Memory address of the buffer data
            let buflen := mload(bufptr) // Length of existing buffer data
            let dest := add(add(bufptr, buflen), _len) // Address = buffer address + buffer length + sizeof(buffer length) + len
            mstore(dest, or(and(mload(dest), not(mask)), _data))
            mstore(bufptr, add(buflen, _len)) // Update buffer length
        }
        return _buf;
    }
}

library CBOR {

    using Buffer for Buffer.buffer;

    uint8 private constant MAJOR_TYPE_INT = 0;
    uint8 private constant MAJOR_TYPE_MAP = 5;
    uint8 private constant MAJOR_TYPE_BYTES = 2;
    uint8 private constant MAJOR_TYPE_ARRAY = 4;
    uint8 private constant MAJOR_TYPE_STRING = 3;
    uint8 private constant MAJOR_TYPE_NEGATIVE_INT = 1;
    uint8 private constant MAJOR_TYPE_CONTENT_FREE = 7;

    function encodeType(Buffer.buffer memory _buf, uint8 _major, uint _value) private pure {
        if (_value <= 23) {
            _buf.append(uint8((_major << 5) | _value));
        } else if (_value <= 0xFF) {
            _buf.append(uint8((_major << 5) | 24));
            _buf.appendInt(_value, 1);
        } else if (_value <= 0xFFFF) {
            _buf.append(uint8((_major << 5) | 25));
            _buf.appendInt(_value, 2);
        } else if (_value <= 0xFFFFFFFF) {
            _buf.append(uint8((_major << 5) | 26));
            _buf.appendInt(_value, 4);
        } else if (_value <= 0xFFFFFFFFFFFFFFFF) {
            _buf.append(uint8((_major << 5) | 27));
            _buf.appendInt(_value, 8);
        }
    }

    function encodeIndefiniteLengthType(Buffer.buffer memory _buf, uint8 _major) private pure {
        _buf.append(uint8((_major << 5) | 31));
    }

    function encodeUInt(Buffer.buffer memory _buf, uint _value) internal pure {
        encodeType(_buf, MAJOR_TYPE_INT, _value);
    }

    function encodeInt(Buffer.buffer memory _buf, int _value) internal pure {
        if (_value >= 0) {
            encodeType(_buf, MAJOR_TYPE_INT, uint(_value));
        } else {
            encodeType(_buf, MAJOR_TYPE_NEGATIVE_INT, uint(-1 - _value));
        }
    }

    function encodeBytes(Buffer.buffer memory _buf, bytes memory _value) internal pure {
        encodeType(_buf, MAJOR_TYPE_BYTES, _value.length);
        _buf.append(_value);
    }

    function encodeString(Buffer.buffer memory _buf, string memory _value) internal pure {
        encodeType(_buf, MAJOR_TYPE_STRING, bytes(_value).length);
        _buf.append(bytes(_value));
    }

    function startArray(Buffer.buffer memory _buf) internal pure {
        encodeIndefiniteLengthType(_buf, MAJOR_TYPE_ARRAY);
    }

    function startMap(Buffer.buffer memory _buf) internal pure {
        encodeIndefiniteLengthType(_buf, MAJOR_TYPE_MAP);
    }

    function endSequence(Buffer.buffer memory _buf) internal pure {
        encodeIndefiniteLengthType(_buf, MAJOR_TYPE_CONTENT_FREE);
    }
}
/*

End solidity-cborutils

*/
contract usingOraclize {

    using CBOR for Buffer.buffer;

    OraclizeI oraclize;
    OraclizeAddrResolverI OAR;

    uint constant day = 60 * 60 * 24;
    uint constant week = 60 * 60 * 24 * 7;
    uint constant month = 60 * 60 * 24 * 30;

    byte constant proofType_NONE = 0x00;
    byte constant proofType_Ledger = 0x30;
    byte constant proofType_Native = 0xF0;
    byte constant proofStorage_IPFS = 0x01;
    byte constant proofType_Android = 0x40;
    byte constant proofType_TLSNotary = 0x10;

    string oraclize_network_name;
    uint8 constant networkID_auto = 0;
    uint8 constant networkID_morden = 2;
    uint8 constant networkID_mainnet = 1;
    uint8 constant networkID_testnet = 2;
    uint8 constant networkID_consensys = 161;

    mapping(bytes32 => bytes32) oraclize_randomDS_args;
    mapping(bytes32 => bool) oraclize_randomDS_sessionKeysHashVerified;

    modifier oraclizeAPI {
        if ((address(OAR) == address(0)) || (getCodeSize(address(OAR)) == 0)) {
            oraclize_setNetwork(networkID_auto);
        }
        if (address(oraclize) != OAR.getAddress()) {
            oraclize = OraclizeI(OAR.getAddress());
        }
        _;
    }

    modifier oraclize_randomDS_proofVerify(bytes32 _queryId, string memory _result, bytes memory _proof) {
        // RandomDS Proof Step 1: The prefix has to match 'LP\x01' (Ledger Proof version 1)
        require((_proof[0] == "L") && (_proof[1] == "P") && (uint8(_proof[2]) == uint8(1)));
        bool proofVerified = oraclize_randomDS_proofVerify__main(_proof, _queryId, bytes(_result), oraclize_getNetworkName());
        require(proofVerified);
        _;
    }

    function oraclize_setNetwork(uint8 _networkID) internal returns (bool _networkSet) {
      return oraclize_setNetwork();
      _networkID; // silence the warning and remain backwards compatible
    }

    function oraclize_setNetworkName(string memory _network_name) internal {
        oraclize_network_name = _network_name;
    }

    function oraclize_getNetworkName() internal view returns (string memory _networkName) {
        return oraclize_network_name;
    }

    function oraclize_setNetwork() internal returns (bool _networkSet) {
        if (getCodeSize(0x1d3B2638a7cC9f2CB3D298A3DA7a90B67E5506ed) > 0) { //mainnet
            OAR = OraclizeAddrResolverI(0x1d3B2638a7cC9f2CB3D298A3DA7a90B67E5506ed);
            oraclize_setNetworkName("eth_mainnet");
            return true;
        }
        if (getCodeSize(0xc03A2615D5efaf5F49F60B7BB6583eaec212fdf1) > 0) { //ropsten testnet
            OAR = OraclizeAddrResolverI(0xc03A2615D5efaf5F49F60B7BB6583eaec212fdf1);
            oraclize_setNetworkName("eth_ropsten3");
            return true;
        }
        if (getCodeSize(0xB7A07BcF2Ba2f2703b24C0691b5278999C59AC7e) > 0) { //kovan testnet
            OAR = OraclizeAddrResolverI(0xB7A07BcF2Ba2f2703b24C0691b5278999C59AC7e);
            oraclize_setNetworkName("eth_kovan");
            return true;
        }
        if (getCodeSize(0x146500cfd35B22E4A392Fe0aDc06De1a1368Ed48) > 0) { //rinkeby testnet
            OAR = OraclizeAddrResolverI(0x146500cfd35B22E4A392Fe0aDc06De1a1368Ed48);
            oraclize_setNetworkName("eth_rinkeby");
            return true;
        }
        if (getCodeSize(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475) > 0) { //ethereum-bridge
            OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
            return true;
        }
        if (getCodeSize(0x20e12A1F859B3FeaE5Fb2A0A32C18F5a65555bBF) > 0) { //ether.camp ide
            OAR = OraclizeAddrResolverI(0x20e12A1F859B3FeaE5Fb2A0A32C18F5a65555bBF);
            return true;
        }
        if (getCodeSize(0x51efaF4c8B3C9AfBD5aB9F4bbC82784Ab6ef8fAA) > 0) { //browser-solidity
            OAR = OraclizeAddrResolverI(0x51efaF4c8B3C9AfBD5aB9F4bbC82784Ab6ef8fAA);
            return true;
        }
        return false;
    }

    function __callback(bytes32 _myid, string memory _result) public {
        __callback(_myid, _result, new bytes(0));
    }

    function __callback(bytes32 _myid, string memory _result, bytes memory _proof) public {
      return;
      _myid; _result; _proof; // Silence compiler warnings
    }

    function oraclize_getPrice(string memory _datasource) oraclizeAPI internal returns (uint _queryPrice) {
        return oraclize.getPrice(_datasource);
    }

    function oraclize_getPrice(string memory _datasource, uint _gasLimit) oraclizeAPI internal returns (uint _queryPrice) {
        return oraclize.getPrice(_datasource, _gasLimit);
    }

    function oraclize_query(string memory _datasource, string memory _arg) oraclizeAPI internal returns (bytes32 _id) {
        uint price = oraclize.getPrice(_datasource);
        if (price > 1 ether + tx.gasprice * 200000) {
            return 0; // Unexpectedly high price
        }
        return oraclize.query.value(price)(0, _datasource, _arg);
    }

    function oraclize_query(uint _timestamp, string memory _datasource, string memory _arg) oraclizeAPI internal returns (bytes32 _id) {
        uint price = oraclize.getPrice(_datasource);
        if (price > 1 ether + tx.gasprice * 200000) {
            return 0; // Unexpectedly high price
        }
        return oraclize.query.value(price)(_timestamp, _datasource, _arg);
    }

    function oraclize_query(uint _timestamp, string memory _datasource, string memory _arg, uint _gasLimit) oraclizeAPI internal returns (bytes32 _id) {
        uint price = oraclize.getPrice(_datasource,_gasLimit);
        if (price > 1 ether + tx.gasprice * _gasLimit) {
            return 0; // Unexpectedly high price
        }
        return oraclize.query_withGasLimit.value(price)(_timestamp, _datasource, _arg, _gasLimit);
    }

    function oraclize_query(string memory _datasource, string memory _arg, uint _gasLimit) oraclizeAPI internal returns (bytes32 _id) {
        uint price = oraclize.getPrice(_datasource, _gasLimit);
        if (price > 1 ether + tx.gasprice * _gasLimit) {
           return 0; // Unexpectedly high price
        }
        return oraclize.query_withGasLimit.value(price)(0, _datasource, _arg, _gasLimit);
    }

    function oraclize_query(string memory _datasource, string memory _arg1, string memory _arg2) oraclizeAPI internal returns (bytes32 _id) {
        uint price = oraclize.getPrice(_datasource);
        if (price > 1 ether + tx.gasprice * 200000) {
            return 0; // Unexpectedly high price
        }
        return oraclize.query2.value(price)(0, _datasource, _arg1, _arg2);
    }

    function oraclize_query(uint _timestamp, string memory _datasource, string memory _arg1, string memory _arg2) oraclizeAPI internal returns (bytes32 _id) {
        uint price = oraclize.getPrice(_datasource);
        if (price > 1 ether + tx.gasprice * 200000) {
            return 0; // Unexpectedly high price
        }
        return oraclize.query2.value(price)(_timestamp, _datasource, _arg1, _arg2);
    }

    function oraclize_query(uint _timestamp, string memory _datasource, string memory _arg1, string memory _arg2, uint _gasLimit) oraclizeAPI internal returns (bytes32 _id) {
        uint price = oraclize.getPrice(_datasource, _gasLimit);
        if (price > 1 ether + tx.gasprice * _gasLimit) {
            return 0; // Unexpectedly high price
        }
        return oraclize.query2_withGasLimit.value(price)(_timestamp, _datasource, _arg1, _arg2, _gasLimit);
    }

    function oraclize_query(string memory _datasource, string memory _arg1, string memory _arg2, uint _gasLimit) oraclizeAPI internal returns (bytes32 _id) {
        uint price = oraclize.getPrice(_datasource, _gasLimit);
        if (price > 1 ether + tx.gasprice * _gasLimit) {
            return 0; // Unexpectedly high price
        }
        return oraclize.query2_withGasLimit.value(price)(0, _datasource, _arg1, _arg2, _gasLimit);
    }

    function oraclize_query(string memory _datasource, string[] memory _argN) oraclizeAPI internal returns (bytes32 _id) {
        uint price = oraclize.getPrice(_datasource);
        if (price > 1 ether + tx.gasprice * 200000) {
            return 0; // Unexpectedly high price
        }
        bytes memory args = stra2cbor(_argN);
        return oraclize.queryN.value(price)(0, _datasource, args);
    }

    function oraclize_query(uint _timestamp, string memory _datasource, string[] memory _argN) oraclizeAPI internal returns (bytes32 _id) {
        uint price = oraclize.getPrice(_datasource);
        if (price > 1 ether + tx.gasprice * 200000) {
            return 0; // Unexpectedly high price
        }
        bytes memory args = stra2cbor(_argN);
        return oraclize.queryN.value(price)(_timestamp, _datasource, args);
    }

    function oraclize_query(uint _timestamp, string memory _datasource, string[] memory _argN, uint _gasLimit) oraclizeAPI internal returns (bytes32 _id) {
        uint price = oraclize.getPrice(_datasource, _gasLimit);
        if (price > 1 ether + tx.gasprice * _gasLimit) {
            return 0; // Unexpectedly high price
        }
        bytes memory args = stra2cbor(_argN);
        return oraclize.queryN_withGasLimit.value(price)(_timestamp, _datasource, args, _gasLimit);
    }

    function oraclize_query(string memory _datasource, string[] memory _argN, uint _gasLimit) oraclizeAPI internal returns (bytes32 _id) {
        uint price = oraclize.getPrice(_datasource, _gasLimit);
        if (price > 1 ether + tx.gasprice * _gasLimit) {
            return 0; // Unexpectedly high price
        }
        bytes memory args = stra2cbor(_argN);
        return oraclize.queryN_withGasLimit.value(price)(0, _datasource, args, _gasLimit);
    }

    function oraclize_query(string memory _datasource, string[1] memory _args) oraclizeAPI internal returns (bytes32 _id) {
        string[] memory dynargs = new string[](1);
        dynargs[0] = _args[0];
        return oraclize_query(_datasource, dynargs);
    }

    function oraclize_query(uint _timestamp, string memory _datasource, string[1] memory _args) oraclizeAPI internal returns (bytes32 _id) {
        string[] memory dynargs = new string[](1);
        dynargs[0] = _args[0];
        return oraclize_query(_timestamp, _datasource, dynargs);
    }

    function oraclize_query(uint _timestamp, string memory _datasource, string[1] memory _args, uint _gasLimit) oraclizeAPI internal returns (bytes32 _id) {
        string[] memory dynargs = new string[](1);
        dynargs[0] = _args[0];
        return oraclize_query(_timestamp, _datasource, dynargs, _gasLimit);
    }

    function oraclize_query(string memory _datasource, string[1] memory _args, uint _gasLimit) oraclizeAPI internal returns (bytes32 _id) {
        string[] memory dynargs = new string[](1);
        dynargs[0] = _args[0];
        return oraclize_query(_datasource, dynargs, _gasLimit);
    }

    function oraclize_query(string memory _datasource, string[2] memory _args) oraclizeAPI internal returns (bytes32 _id) {
        string[] memory dynargs = new string[](2);
        dynargs[0] = _args[0];
        dynargs[1] = _args[1];
        return oraclize_query(_datasource, dynargs);
    }

    function oraclize_query(uint _timestamp, string memory _datasource, string[2] memory _args) oraclizeAPI internal returns (bytes32 _id) {
        string[] memory dynargs = new string[](2);
        dynargs[0] = _args[0];
        dynargs[1] = _args[1];
        return oraclize_query(_timestamp, _datasource, dynargs);
    }

    function oraclize_query(uint _timestamp, string memory _datasource, string[2] memory _args, uint _gasLimit) oraclizeAPI internal returns (bytes32 _id) {
        string[] memory dynargs = new string[](2);
        dynargs[0] = _args[0];
        dynargs[1] = _args[1];
        return oraclize_query(_timestamp, _datasource, dynargs, _gasLimit);
    }

    function oraclize_query(string memory _datasource, string[2] memory _args, uint _gasLimit) oraclizeAPI internal returns (bytes32 _id) {
        string[] memory dynargs = new string[](2);
        dynargs[0] = _args[0];
        dynargs[1] = _args[1];
        return oraclize_query(_datasource, dynargs, _gasLimit);
    }

    function oraclize_query(string memory _datasource, string[3] memory _args) oraclizeAPI internal returns (bytes32 _id) {
        string[] memory dynargs = new string[](3);
        dynargs[0] = _args[0];
        dynargs[1] = _args[1];
        dynargs[2] = _args[2];
        return oraclize_query(_datasource, dynargs);
    }

    function oraclize_query(uint _timestamp, string memory _datasource, string[3] memory _args) oraclizeAPI internal returns (bytes32 _id) {
        string[] memory dynargs = new string[](3);
        dynargs[0] = _args[0];
        dynargs[1] = _args[1];
        dynargs[2] = _args[2];
        return oraclize_query(_timestamp, _datasource, dynargs);
    }

    function oraclize_query(uint _timestamp, string memory _datasource, string[3] memory _args, uint _gasLimit) oraclizeAPI internal returns (bytes32 _id) {
        string[] memory dynargs = new string[](3);
        dynargs[0] = _args[0];
        dynargs[1] = _args[1];
        dynargs[2] = _args[2];
        return oraclize_query(_timestamp, _datasource, dynargs, _gasLimit);
    }

    function oraclize_query(string memory _datasource, string[3] memory _args, uint _gasLimit) oraclizeAPI internal returns (bytes32 _id) {
        string[] memory dynargs = new string[](3);
        dynargs[0] = _args[0];
        dynargs[1] = _args[1];
        dynargs[2] = _args[2];
        return oraclize_query(_datasource, dynargs, _gasLimit);
    }

    function oraclize_query(string memory _datasource, string[4] memory _args) oraclizeAPI internal returns (bytes32 _id) {
        string[] memory dynargs = new string[](4);
        dynargs[0] = _args[0];
        dynargs[1] = _args[1];
        dynargs[2] = _args[2];
        dynargs[3] = _args[3];
        return oraclize_query(_datasource, dynargs);
    }

    function oraclize_query(uint _timestamp, string memory _datasource, string[4] memory _args) oraclizeAPI internal returns (bytes32 _id) {
        string[] memory dynargs = new string[](4);
        dynargs[0] = _args[0];
        dynargs[1] = _args[1];
        dynargs[2] = _args[2];
        dynargs[3] = _args[3];
        return oraclize_query(_timestamp, _datasource, dynargs);
    }

    function oraclize_query(uint _timestamp, string memory _datasource, string[4] memory _args, uint _gasLimit) oraclizeAPI internal returns (bytes32 _id) {
        string[] memory dynargs = new string[](4);
        dynargs[0] = _args[0];
        dynargs[1] = _args[1];
        dynargs[2] = _args[2];
        dynargs[3] = _args[3];
        return oraclize_query(_timestamp, _datasource, dynargs, _gasLimit);
    }

    function oraclize_query(string memory _datasource, string[4] memory _args, uint _gasLimit) oraclizeAPI internal returns (bytes32 _id) {
        string[] memory dynargs = new string[](4);
        dynargs[0] = _args[0];
        dynargs[1] = _args[1];
        dynargs[2] = _args[2];
        dynargs[3] = _args[3];
        return oraclize_query(_datasource, dynargs, _gasLimit);
    }

    function oraclize_query(string memory _datasource, string[5] memory _args) oraclizeAPI internal returns (bytes32 _id) {
        string[] memory dynargs = new string[](5);
        dynargs[0] = _args[0];
        dynargs[1] = _args[1];
        dynargs[2] = _args[2];
        dynargs[3] = _args[3];
        dynargs[4] = _args[4];
        return oraclize_query(_datasource, dynargs);
    }

    function oraclize_query(uint _timestamp, string memory _datasource, string[5] memory _args) oraclizeAPI internal returns (bytes32 _id) {
        string[] memory dynargs = new string[](5);
        dynargs[0] = _args[0];
        dynargs[1] = _args[1];
        dynargs[2] = _args[2];
        dynargs[3] = _args[3];
        dynargs[4] = _args[4];
        return oraclize_query(_timestamp, _datasource, dynargs);
    }

    function oraclize_query(uint _timestamp, string memory _datasource, string[5] memory _args, uint _gasLimit) oraclizeAPI internal returns (bytes32 _id) {
        string[] memory dynargs = new string[](5);
        dynargs[0] = _args[0];
        dynargs[1] = _args[1];
        dynargs[2] = _args[2];
        dynargs[3] = _args[3];
        dynargs[4] = _args[4];
        return oraclize_query(_timestamp, _datasource, dynargs, _gasLimit);
    }

    function oraclize_query(string memory _datasource, string[5] memory _args, uint _gasLimit) oraclizeAPI internal returns (bytes32 _id) {
        string[] memory dynargs = new string[](5);
        dynargs[0] = _args[0];
        dynargs[1] = _args[1];
        dynargs[2] = _args[2];
        dynargs[3] = _args[3];
        dynargs[4] = _args[4];
        return oraclize_query(_datasource, dynargs, _gasLimit);
    }

    function oraclize_query(string memory _datasource, bytes[] memory _argN) oraclizeAPI internal returns (bytes32 _id) {
        uint price = oraclize.getPrice(_datasource);
        if (price > 1 ether + tx.gasprice * 200000) {
            return 0; // Unexpectedly high price
        }
        bytes memory args = ba2cbor(_argN);
        return oraclize.queryN.value(price)(0, _datasource, args);
    }

    function oraclize_query(uint _timestamp, string memory _datasource, bytes[] memory _argN) oraclizeAPI internal returns (bytes32 _id) {
        uint price = oraclize.getPrice(_datasource);
        if (price > 1 ether + tx.gasprice * 200000) {
            return 0; // Unexpectedly high price
        }
        bytes memory args = ba2cbor(_argN);
        return oraclize.queryN.value(price)(_timestamp, _datasource, args);
    }

    function oraclize_query(uint _timestamp, string memory _datasource, bytes[] memory _argN, uint _gasLimit) oraclizeAPI internal returns (bytes32 _id) {
        uint price = oraclize.getPrice(_datasource, _gasLimit);
        if (price > 1 ether + tx.gasprice * _gasLimit) {
            return 0; // Unexpectedly high price
        }
        bytes memory args = ba2cbor(_argN);
        return oraclize.queryN_withGasLimit.value(price)(_timestamp, _datasource, args, _gasLimit);
    }

    function oraclize_query(string memory _datasource, bytes[] memory _argN, uint _gasLimit) oraclizeAPI internal returns (bytes32 _id) {
        uint price = oraclize.getPrice(_datasource, _gasLimit);
        if (price > 1 ether + tx.gasprice * _gasLimit) {
            return 0; // Unexpectedly high price
        }
        bytes memory args = ba2cbor(_argN);
        return oraclize.queryN_withGasLimit.value(price)(0, _datasource, args, _gasLimit);
    }

    function oraclize_query(string memory _datasource, bytes[1] memory _args) oraclizeAPI internal returns (bytes32 _id) {
        bytes[] memory dynargs = new bytes[](1);
        dynargs[0] = _args[0];
        return oraclize_query(_datasource, dynargs);
    }

    function oraclize_query(uint _timestamp, string memory _datasource, bytes[1] memory _args) oraclizeAPI internal returns (bytes32 _id) {
        bytes[] memory dynargs = new bytes[](1);
        dynargs[0] = _args[0];
        return oraclize_query(_timestamp, _datasource, dynargs);
    }

    function oraclize_query(uint _timestamp, string memory _datasource, bytes[1] memory _args, uint _gasLimit) oraclizeAPI internal returns (bytes32 _id) {
        bytes[] memory dynargs = new bytes[](1);
        dynargs[0] = _args[0];
        return oraclize_query(_timestamp, _datasource, dynargs, _gasLimit);
    }

    function oraclize_query(string memory _datasource, bytes[1] memory _args, uint _gasLimit) oraclizeAPI internal returns (bytes32 _id) {
        bytes[] memory dynargs = new bytes[](1);
        dynargs[0] = _args[0];
        return oraclize_query(_datasource, dynargs, _gasLimit);
    }

    function oraclize_query(string memory _datasource, bytes[2] memory _args) oraclizeAPI internal returns (bytes32 _id) {
        bytes[] memory dynargs = new bytes[](2);
        dynargs[0] = _args[0];
        dynargs[1] = _args[1];
        return oraclize_query(_datasource, dynargs);
    }

    function oraclize_query(uint _timestamp, string memory _datasource, bytes[2] memory _args) oraclizeAPI internal returns (bytes32 _id) {
        bytes[] memory dynargs = new bytes[](2);
        dynargs[0] = _args[0];
        dynargs[1] = _args[1];
        return oraclize_query(_timestamp, _datasource, dynargs);
    }

    function oraclize_query(uint _timestamp, string memory _datasource, bytes[2] memory _args, uint _gasLimit) oraclizeAPI internal returns (bytes32 _id) {
        bytes[] memory dynargs = new bytes[](2);
        dynargs[0] = _args[0];
        dynargs[1] = _args[1];
        return oraclize_query(_timestamp, _datasource, dynargs, _gasLimit);
    }

    function oraclize_query(string memory _datasource, bytes[2] memory _args, uint _gasLimit) oraclizeAPI internal returns (bytes32 _id) {
        bytes[] memory dynargs = new bytes[](2);
        dynargs[0] = _args[0];
        dynargs[1] = _args[1];
        return oraclize_query(_datasource, dynargs, _gasLimit);
    }

    function oraclize_query(string memory _datasource, bytes[3] memory _args) oraclizeAPI internal returns (bytes32 _id) {
        bytes[] memory dynargs = new bytes[](3);
        dynargs[0] = _args[0];
        dynargs[1] = _args[1];
        dynargs[2] = _args[2];
        return oraclize_query(_datasource, dynargs);
    }

    function oraclize_query(uint _timestamp, string memory _datasource, bytes[3] memory _args) oraclizeAPI internal returns (bytes32 _id) {
        bytes[] memory dynargs = new bytes[](3);
        dynargs[0] = _args[0];
        dynargs[1] = _args[1];
        dynargs[2] = _args[2];
        return oraclize_query(_timestamp, _datasource, dynargs);
    }

    function oraclize_query(uint _timestamp, string memory _datasource, bytes[3] memory _args, uint _gasLimit) oraclizeAPI internal returns (bytes32 _id) {
        bytes[] memory dynargs = new bytes[](3);
        dynargs[0] = _args[0];
        dynargs[1] = _args[1];
        dynargs[2] = _args[2];
        return oraclize_query(_timestamp, _datasource, dynargs, _gasLimit);
    }

    function oraclize_query(string memory _datasource, bytes[3] memory _args, uint _gasLimit) oraclizeAPI internal returns (bytes32 _id) {
        bytes[] memory dynargs = new bytes[](3);
        dynargs[0] = _args[0];
        dynargs[1] = _args[1];
        dynargs[2] = _args[2];
        return oraclize_query(_datasource, dynargs, _gasLimit);
    }

    function oraclize_query(string memory _datasource, bytes[4] memory _args) oraclizeAPI internal returns (bytes32 _id) {
        bytes[] memory dynargs = new bytes[](4);
        dynargs[0] = _args[0];
        dynargs[1] = _args[1];
        dynargs[2] = _args[2];
        dynargs[3] = _args[3];
        return oraclize_query(_datasource, dynargs);
    }

    function oraclize_query(uint _timestamp, string memory _datasource, bytes[4] memory _args) oraclizeAPI internal returns (bytes32 _id) {
        bytes[] memory dynargs = new bytes[](4);
        dynargs[0] = _args[0];
        dynargs[1] = _args[1];
        dynargs[2] = _args[2];
        dynargs[3] = _args[3];
        return oraclize_query(_timestamp, _datasource, dynargs);
    }

    function oraclize_query(uint _timestamp, string memory _datasource, bytes[4] memory _args, uint _gasLimit) oraclizeAPI internal returns (bytes32 _id) {
        bytes[] memory dynargs = new bytes[](4);
        dynargs[0] = _args[0];
        dynargs[1] = _args[1];
        dynargs[2] = _args[2];
        dynargs[3] = _args[3];
        return oraclize_query(_timestamp, _datasource, dynargs, _gasLimit);
    }

    function oraclize_query(string memory _datasource, bytes[4] memory _args, uint _gasLimit) oraclizeAPI internal returns (bytes32 _id) {
        bytes[] memory dynargs = new bytes[](4);
        dynargs[0] = _args[0];
        dynargs[1] = _args[1];
        dynargs[2] = _args[2];
        dynargs[3] = _args[3];
        return oraclize_query(_datasource, dynargs, _gasLimit);
    }

    function oraclize_query(string memory _datasource, bytes[5] memory _args) oraclizeAPI internal returns (bytes32 _id) {
        bytes[] memory dynargs = new bytes[](5);
        dynargs[0] = _args[0];
        dynargs[1] = _args[1];
        dynargs[2] = _args[2];
        dynargs[3] = _args[3];
        dynargs[4] = _args[4];
        return oraclize_query(_datasource, dynargs);
    }

    function oraclize_query(uint _timestamp, string memory _datasource, bytes[5] memory _args) oraclizeAPI internal returns (bytes32 _id) {
        bytes[] memory dynargs = new bytes[](5);
        dynargs[0] = _args[0];
        dynargs[1] = _args[1];
        dynargs[2] = _args[2];
        dynargs[3] = _args[3];
        dynargs[4] = _args[4];
        return oraclize_query(_timestamp, _datasource, dynargs);
    }

    function oraclize_query(uint _timestamp, string memory _datasource, bytes[5] memory _args, uint _gasLimit) oraclizeAPI internal returns (bytes32 _id) {
        bytes[] memory dynargs = new bytes[](5);
        dynargs[0] = _args[0];
        dynargs[1] = _args[1];
        dynargs[2] = _args[2];
        dynargs[3] = _args[3];
        dynargs[4] = _args[4];
        return oraclize_query(_timestamp, _datasource, dynargs, _gasLimit);
    }

    function oraclize_query(string memory _datasource, bytes[5] memory _args, uint _gasLimit) oraclizeAPI internal returns (bytes32 _id) {
        bytes[] memory dynargs = new bytes[](5);
        dynargs[0] = _args[0];
        dynargs[1] = _args[1];
        dynargs[2] = _args[2];
        dynargs[3] = _args[3];
        dynargs[4] = _args[4];
        return oraclize_query(_datasource, dynargs, _gasLimit);
    }

    function oraclize_setProof(byte _proofP) oraclizeAPI internal {
        return oraclize.setProofType(_proofP);
    }


    function oraclize_cbAddress() oraclizeAPI internal returns (address _callbackAddress) {
        return oraclize.cbAddress();
    }

    function getCodeSize(address _addr) view internal returns (uint _size) {
        assembly {
            _size := extcodesize(_addr)
        }
    }

    function oraclize_setCustomGasPrice(uint _gasPrice) oraclizeAPI internal {
        return oraclize.setCustomGasPrice(_gasPrice);
    }

    function oraclize_randomDS_getSessionPubKeyHash() oraclizeAPI internal returns (bytes32 _sessionKeyHash) {
        return oraclize.randomDS_getSessionPubKeyHash();
    }

    function parseAddr(string memory _a) internal pure returns (address _parsedAddress) {
        bytes memory tmp = bytes(_a);
        uint160 iaddr = 0;
        uint160 b1;
        uint160 b2;
        for (uint i = 2; i < 2 + 2 * 20; i += 2) {
            iaddr *= 256;
            b1 = uint160(uint8(tmp[i]));
            b2 = uint160(uint8(tmp[i + 1]));
            if ((b1 >= 97) && (b1 <= 102)) {
                b1 -= 87;
            } else if ((b1 >= 65) && (b1 <= 70)) {
                b1 -= 55;
            } else if ((b1 >= 48) && (b1 <= 57)) {
                b1 -= 48;
            }
            if ((b2 >= 97) && (b2 <= 102)) {
                b2 -= 87;
            } else if ((b2 >= 65) && (b2 <= 70)) {
                b2 -= 55;
            } else if ((b2 >= 48) && (b2 <= 57)) {
                b2 -= 48;
            }
            iaddr += (b1 * 16 + b2);
        }
        return address(iaddr);
    }

    function strCompare(string memory _a, string memory _b) internal pure returns (int _returnCode) {
        bytes memory a = bytes(_a);
        bytes memory b = bytes(_b);
        uint minLength = a.length;
        if (b.length < minLength) {
            minLength = b.length;
        }
        for (uint i = 0; i < minLength; i ++) {
            if (a[i] < b[i]) {
                return -1;
            } else if (a[i] > b[i]) {
                return 1;
            }
        }
        if (a.length < b.length) {
            return -1;
        } else if (a.length > b.length) {
            return 1;
        } else {
            return 0;
        }
    }

    function indexOf(string memory _haystack, string memory _needle) internal pure returns (int _returnCode) {
        bytes memory h = bytes(_haystack);
        bytes memory n = bytes(_needle);
        if (h.length < 1 || n.length < 1 || (n.length > h.length)) {
            return -1;
        } else if (h.length > (2 ** 128 - 1)) {
            return -1;
        } else {
            uint subindex = 0;
            for (uint i = 0; i < h.length; i++) {
                if (h[i] == n[0]) {
                    subindex = 1;
                    while(subindex < n.length && (i + subindex) < h.length && h[i + subindex] == n[subindex]) {
                        subindex++;
                    }
                    if (subindex == n.length) {
                        return int(i);
                    }
                }
            }
            return -1;
        }
    }

    function strConcat(string memory _a, string memory _b) internal pure returns (string memory _concatenatedString) {
        return strConcat(_a, _b, "", "", "");
    }

    function strConcat(string memory _a, string memory _b, string memory _c) internal pure returns (string memory _concatenatedString) {
        return strConcat(_a, _b, _c, "", "");
    }

    function strConcat(string memory _a, string memory _b, string memory _c, string memory _d) internal pure returns (string memory _concatenatedString) {
        return strConcat(_a, _b, _c, _d, "");
    }

    function strConcat(string memory _a, string memory _b, string memory _c, string memory _d, string memory _e) internal pure returns (string memory _concatenatedString) {
        bytes memory _ba = bytes(_a);
        bytes memory _bb = bytes(_b);
        bytes memory _bc = bytes(_c);
        bytes memory _bd = bytes(_d);
        bytes memory _be = bytes(_e);
        string memory abcde = new string(_ba.length + _bb.length + _bc.length + _bd.length + _be.length);
        bytes memory babcde = bytes(abcde);
        uint k = 0;
        uint i = 0;
        for (i = 0; i < _ba.length; i++) {
            babcde[k++] = _ba[i];
        }
        for (i = 0; i < _bb.length; i++) {
            babcde[k++] = _bb[i];
        }
        for (i = 0; i < _bc.length; i++) {
            babcde[k++] = _bc[i];
        }
        for (i = 0; i < _bd.length; i++) {
            babcde[k++] = _bd[i];
        }
        for (i = 0; i < _be.length; i++) {
            babcde[k++] = _be[i];
        }
        return string(babcde);
    }

    function safeParseInt(string memory _a) internal pure returns (uint _parsedInt) {
        return safeParseInt(_a, 0);
    }

    function safeParseInt(string memory _a, uint _b) internal pure returns (uint _parsedInt) {
        bytes memory bresult = bytes(_a);
        uint mint = 0;
        bool decimals = false;
        for (uint i = 0; i < bresult.length; i++) {
            if ((uint(uint8(bresult[i])) >= 48) && (uint(uint8(bresult[i])) <= 57)) {
                if (decimals) {
                   if (_b == 0) break;
                    else _b--;
                }
                mint *= 10;
                mint += uint(uint8(bresult[i])) - 48;
            } else if (uint(uint8(bresult[i])) == 46) {
                require(!decimals, 'More than one decimal encountered in string!');
                decimals = true;
            } else {
                revert("Non-numeral character encountered in string!");
            }
        }
        if (_b > 0) {
            mint *= 10 ** _b;
        }
        return mint;
    }

    function parseInt(string memory _a) internal pure returns (uint _parsedInt) {
        return parseInt(_a, 0);
    }

    function parseInt(string memory _a, uint _b) internal pure returns (uint _parsedInt) {
        bytes memory bresult = bytes(_a);
        uint mint = 0;
        bool decimals = false;
        for (uint i = 0; i < bresult.length; i++) {
            if ((uint(uint8(bresult[i])) >= 48) && (uint(uint8(bresult[i])) <= 57)) {
                if (decimals) {
                   if (_b == 0) {
                       break;
                   } else {
                       _b--;
                   }
                }
                mint *= 10;
                mint += uint(uint8(bresult[i])) - 48;
            } else if (uint(uint8(bresult[i])) == 46) {
                decimals = true;
            }
        }
        if (_b > 0) {
            mint *= 10 ** _b;
        }
        return mint;
    }

    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len - 1;
        while (_i != 0) {
            bstr[k--] = byte(uint8(48 + _i % 10));
            _i /= 10;
        }
        return string(bstr);
    }

    function stra2cbor(string[] memory _arr) internal pure returns (bytes memory _cborEncoding) {
        safeMemoryCleaner();
        Buffer.buffer memory buf;
        Buffer.init(buf, 1024);
        buf.startArray();
        for (uint i = 0; i < _arr.length; i++) {
            buf.encodeString(_arr[i]);
        }
        buf.endSequence();
        return buf.buf;
    }

    function ba2cbor(bytes[] memory _arr) internal pure returns (bytes memory _cborEncoding) {
        safeMemoryCleaner();
        Buffer.buffer memory buf;
        Buffer.init(buf, 1024);
        buf.startArray();
        for (uint i = 0; i < _arr.length; i++) {
            buf.encodeBytes(_arr[i]);
        }
        buf.endSequence();
        return buf.buf;
    }

    function oraclize_newRandomDSQuery(uint _delay, uint _nbytes, uint _customGasLimit) internal returns (bytes32 _queryId) {
        require((_nbytes > 0) && (_nbytes <= 32));
        _delay *= 10; // Convert from seconds to ledger timer ticks
        bytes memory nbytes = new bytes(1);
        nbytes[0] = byte(uint8(_nbytes));
        bytes memory unonce = new bytes(32);
        bytes memory sessionKeyHash = new bytes(32);
        bytes32 sessionKeyHash_bytes32 = oraclize_randomDS_getSessionPubKeyHash();
        assembly {
            mstore(unonce, 0x20)
            /*
             The following variables can be relaxed.
             Check the relaxed random contract at https://github.com/oraclize/ethereum-examples
             for an idea on how to override and replace commit hash variables.
            */
            mstore(add(unonce, 0x20), xor(blockhash(sub(number, 1)), xor(coinbase, timestamp)))
            mstore(sessionKeyHash, 0x20)
            mstore(add(sessionKeyHash, 0x20), sessionKeyHash_bytes32)
        }
        bytes memory delay = new bytes(32);
        assembly {
            mstore(add(delay, 0x20), _delay)
        }
        bytes memory delay_bytes8 = new bytes(8);
        copyBytes(delay, 24, 8, delay_bytes8, 0);
        bytes[4] memory args = [unonce, nbytes, sessionKeyHash, delay];
        bytes32 queryId = oraclize_query("random", args, _customGasLimit);
        bytes memory delay_bytes8_left = new bytes(8);
        assembly {
            let x := mload(add(delay_bytes8, 0x20))
            mstore8(add(delay_bytes8_left, 0x27), div(x, 0x100000000000000000000000000000000000000000000000000000000000000))
            mstore8(add(delay_bytes8_left, 0x26), div(x, 0x1000000000000000000000000000000000000000000000000000000000000))
            mstore8(add(delay_bytes8_left, 0x25), div(x, 0x10000000000000000000000000000000000000000000000000000000000))
            mstore8(add(delay_bytes8_left, 0x24), div(x, 0x100000000000000000000000000000000000000000000000000000000))
            mstore8(add(delay_bytes8_left, 0x23), div(x, 0x1000000000000000000000000000000000000000000000000000000))
            mstore8(add(delay_bytes8_left, 0x22), div(x, 0x10000000000000000000000000000000000000000000000000000))
            mstore8(add(delay_bytes8_left, 0x21), div(x, 0x100000000000000000000000000000000000000000000000000))
            mstore8(add(delay_bytes8_left, 0x20), div(x, 0x1000000000000000000000000000000000000000000000000))
        }
        oraclize_randomDS_setCommitment(queryId, keccak256(abi.encodePacked(delay_bytes8_left, args[1], sha256(args[0]), args[2])));
        return queryId;
    }

    function oraclize_randomDS_setCommitment(bytes32 _queryId, bytes32 _commitment) internal {
        oraclize_randomDS_args[_queryId] = _commitment;
    }

    function verifySig(bytes32 _tosignh, bytes memory _dersig, bytes memory _pubkey) internal returns (bool _sigVerified) {
        bool sigok;
        address signer;
        bytes32 sigr;
        bytes32 sigs;
        bytes memory sigr_ = new bytes(32);
        uint offset = 4 + (uint(uint8(_dersig[3])) - 0x20);
        sigr_ = copyBytes(_dersig, offset, 32, sigr_, 0);
        bytes memory sigs_ = new bytes(32);
        offset += 32 + 2;
        sigs_ = copyBytes(_dersig, offset + (uint(uint8(_dersig[offset - 1])) - 0x20), 32, sigs_, 0);
        assembly {
            sigr := mload(add(sigr_, 32))
            sigs := mload(add(sigs_, 32))
        }
        (sigok, signer) = safer_ecrecover(_tosignh, 27, sigr, sigs);
        if (address(uint160(uint256(keccak256(_pubkey)))) == signer) {
            return true;
        } else {
            (sigok, signer) = safer_ecrecover(_tosignh, 28, sigr, sigs);
            return (address(uint160(uint256(keccak256(_pubkey)))) == signer);
        }
    }

    function oraclize_randomDS_proofVerify__sessionKeyValidity(bytes memory _proof, uint _sig2offset) internal returns (bool _proofVerified) {
        bool sigok;
        // Random DS Proof Step 6: Verify the attestation signature, APPKEY1 must sign the sessionKey from the correct ledger app (CODEHASH)
        bytes memory sig2 = new bytes(uint(uint8(_proof[_sig2offset + 1])) + 2);
        copyBytes(_proof, _sig2offset, sig2.length, sig2, 0);
        bytes memory appkey1_pubkey = new bytes(64);
        copyBytes(_proof, 3 + 1, 64, appkey1_pubkey, 0);
        bytes memory tosign2 = new bytes(1 + 65 + 32);
        tosign2[0] = byte(uint8(1)); //role
        copyBytes(_proof, _sig2offset - 65, 65, tosign2, 1);
        bytes memory CODEHASH = hex"fd94fa71bc0ba10d39d464d0d8f465efeef0a2764e3887fcc9df41ded20f505c";
        copyBytes(CODEHASH, 0, 32, tosign2, 1 + 65);
        sigok = verifySig(sha256(tosign2), sig2, appkey1_pubkey);
        if (!sigok) {
            return false;
        }
        // Random DS Proof Step 7: Verify the APPKEY1 provenance (must be signed by Ledger)
        bytes memory LEDGERKEY = hex"7fb956469c5c9b89840d55b43537e66a98dd4811ea0a27224272c2e5622911e8537a2f8e86a46baec82864e98dd01e9ccc2f8bc5dfc9cbe5a91a290498dd96e4";
        bytes memory tosign3 = new bytes(1 + 65);
        tosign3[0] = 0xFE;
        copyBytes(_proof, 3, 65, tosign3, 1);
        bytes memory sig3 = new bytes(uint(uint8(_proof[3 + 65 + 1])) + 2);
        copyBytes(_proof, 3 + 65, sig3.length, sig3, 0);
        sigok = verifySig(sha256(tosign3), sig3, LEDGERKEY);
        return sigok;
    }

    function oraclize_randomDS_proofVerify__returnCode(bytes32 _queryId, string memory _result, bytes memory _proof) internal returns (uint8 _returnCode) {
        // Random DS Proof Step 1: The prefix has to match 'LP\x01' (Ledger Proof version 1)
        if ((_proof[0] != "L") || (_proof[1] != "P") || (uint8(_proof[2]) != uint8(1))) {
            return 1;
        }
        bool proofVerified = oraclize_randomDS_proofVerify__main(_proof, _queryId, bytes(_result), oraclize_getNetworkName());
        if (!proofVerified) {
            return 2;
        }
        return 0;
    }

    function matchBytes32Prefix(bytes32 _content, bytes memory _prefix, uint _nRandomBytes) internal pure returns (bool _matchesPrefix) {
        bool match_ = true;
        require(_prefix.length == _nRandomBytes);
        for (uint256 i = 0; i< _nRandomBytes; i++) {
            if (_content[i] != _prefix[i]) {
                match_ = false;
            }
        }
        return match_;
    }

    function oraclize_randomDS_proofVerify__main(bytes memory _proof, bytes32 _queryId, bytes memory _result, string memory _contextName) internal returns (bool _proofVerified) {
        // Random DS Proof Step 2: The unique keyhash has to match with the sha256 of (context name + _queryId)
        uint ledgerProofLength = 3 + 65 + (uint(uint8(_proof[3 + 65 + 1])) + 2) + 32;
        bytes memory keyhash = new bytes(32);
        copyBytes(_proof, ledgerProofLength, 32, keyhash, 0);
        if (!(keccak256(keyhash) == keccak256(abi.encodePacked(sha256(abi.encodePacked(_contextName, _queryId)))))) {
            return false;
        }
        bytes memory sig1 = new bytes(uint(uint8(_proof[ledgerProofLength + (32 + 8 + 1 + 32) + 1])) + 2);
        copyBytes(_proof, ledgerProofLength + (32 + 8 + 1 + 32), sig1.length, sig1, 0);
        // Random DS Proof Step 3: We assume sig1 is valid (it will be verified during step 5) and we verify if '_result' is the _prefix of sha256(sig1)
        if (!matchBytes32Prefix(sha256(sig1), _result, uint(uint8(_proof[ledgerProofLength + 32 + 8])))) {
            return false;
        }
        // Random DS Proof Step 4: Commitment match verification, keccak256(delay, nbytes, unonce, sessionKeyHash) == commitment in storage.
        // This is to verify that the computed args match with the ones specified in the query.
        bytes memory commitmentSlice1 = new bytes(8 + 1 + 32);
        copyBytes(_proof, ledgerProofLength + 32, 8 + 1 + 32, commitmentSlice1, 0);
        bytes memory sessionPubkey = new bytes(64);
        uint sig2offset = ledgerProofLength + 32 + (8 + 1 + 32) + sig1.length + 65;
        copyBytes(_proof, sig2offset - 64, 64, sessionPubkey, 0);
        bytes32 sessionPubkeyHash = sha256(sessionPubkey);
        if (oraclize_randomDS_args[_queryId] == keccak256(abi.encodePacked(commitmentSlice1, sessionPubkeyHash))) { //unonce, nbytes and sessionKeyHash match
            delete oraclize_randomDS_args[_queryId];
        } else return false;
        // Random DS Proof Step 5: Validity verification for sig1 (keyhash and args signed with the sessionKey)
        bytes memory tosign1 = new bytes(32 + 8 + 1 + 32);
        copyBytes(_proof, ledgerProofLength, 32 + 8 + 1 + 32, tosign1, 0);
        if (!verifySig(sha256(tosign1), sig1, sessionPubkey)) {
            return false;
        }
        // Verify if sessionPubkeyHash was verified already, if not.. let's do it!
        if (!oraclize_randomDS_sessionKeysHashVerified[sessionPubkeyHash]) {
            oraclize_randomDS_sessionKeysHashVerified[sessionPubkeyHash] = oraclize_randomDS_proofVerify__sessionKeyValidity(_proof, sig2offset);
        }
        return oraclize_randomDS_sessionKeysHashVerified[sessionPubkeyHash];
    }
    /*
     The following function has been written by Alex Beregszaszi (@axic), use it under the terms of the MIT license
    */
    function copyBytes(bytes memory _from, uint _fromOffset, uint _length, bytes memory _to, uint _toOffset) internal pure returns (bytes memory _copiedBytes) {
        uint minLength = _length + _toOffset;
        require(_to.length >= minLength); // Buffer too small. Should be a better way?
        uint i = 32 + _fromOffset; // NOTE: the offset 32 is added to skip the `size` field of both bytes variables
        uint j = 32 + _toOffset;
        while (i < (32 + _fromOffset + _length)) {
            assembly {
                let tmp := mload(add(_from, i))
                mstore(add(_to, j), tmp)
            }
            i += 32;
            j += 32;
        }
        return _to;
    }
    /*
     The following function has been written by Alex Beregszaszi (@axic), use it under the terms of the MIT license
     Duplicate Solidity's ecrecover, but catching the CALL return value
    */
    function safer_ecrecover(bytes32 _hash, uint8 _v, bytes32 _r, bytes32 _s) internal returns (bool _success, address _recoveredAddress) {
        /*
         We do our own memory management here. Solidity uses memory offset
         0x40 to store the current end of memory. We write past it (as
         writes are memory extensions), but don't update the offset so
         Solidity will reuse it. The memory used here is only needed for
         this context.
         FIXME: inline assembly can't access return values
        */
        bool ret;
        address addr;
        assembly {
            let size := mload(0x40)
            mstore(size, _hash)
            mstore(add(size, 32), _v)
            mstore(add(size, 64), _r)
            mstore(add(size, 96), _s)
            ret := call(3000, 1, 0, size, 128, size, 32) // NOTE: we can reuse the request memory because we deal with the return code.
            addr := mload(size)
        }
        return (ret, addr);
    }
    /*
     The following function has been written by Alex Beregszaszi (@axic), use it under the terms of the MIT license
    */
    function ecrecovery(bytes32 _hash, bytes memory _sig) internal returns (bool _success, address _recoveredAddress) {
        bytes32 r;
        bytes32 s;
        uint8 v;
        if (_sig.length != 65) {
            return (false, address(0));
        }
        /*
         The signature format is a compact form of:
           {bytes32 r}{bytes32 s}{uint8 v}
         Compact means, uint8 is not padded to 32 bytes.
        */
        assembly {
            r := mload(add(_sig, 32))
            s := mload(add(_sig, 64))
            /*
             Here we are loading the last 32 bytes. We exploit the fact that
             'mload' will pad with zeroes if we overread.
             There is no 'mload8' to do this, but that would be nicer.
            */
            v := byte(0, mload(add(_sig, 96)))
            /*
              Alternative solution:
              'byte' is not working due to the Solidity parser, so lets
              use the second best option, 'and'
              v := and(mload(add(_sig, 65)), 255)
            */
        }
        /*
         albeit non-transactional signatures are not specified by the YP, one would expect it
         to match the YP range of [27, 28]
         geth uses [0, 1] and some clients have followed. This might change, see:
         https://github.com/ethereum/go-ethereum/issues/2053
        */
        if (v < 27) {
            v += 27;
        }
        if (v != 27 && v != 28) {
            return (false, address(0));
        }
        return safer_ecrecover(_hash, v, r, s);
    }

    function safeMemoryCleaner() internal pure {
        assembly {
            let fmem := mload(0x40)
            codecopy(fmem, codesize, sub(msize, fmem))
        }
    }
}
/*

END ORACLIZE_API

*/


/**
 * @title Multiprizer
 * @dev The Multiprizer contract is the core game.
 */

contract Multiprizer is Ownable, usingOraclize  {

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
uint256 gasLimitOraclize;
uint256 gasPriceOraclize;
uint256 numBytesOraclize;
uint256 delayOraclize;
string dataSourceOraclize;

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
mapping (bytes32 => uint256[]) private roundsOfOraclizeID;
uint256[] private pendingRoundsOraclize;

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
event lockEvent(string messageSender);

/** 
*  Constructor call 
*  @dev DirectPlay enables a player to place a single token for any of the strategy games   
*  execute manual withdraw of your prizes won by sending directPlayWithdraw value of ethers. 
  */
constructor () public {
    //# EMIT EVENT LOG - to be done
    isGamesPaused = false;
    // set Oraclize parameters
    gasLimitOraclize = 235000;
    gasPriceOraclize = 20000000000 wei;
    oraclize_setCustomGasPrice(gasPriceOraclize);
    oraclize_setProof(proofType_Ledger);
    numBytesOraclize = 8;
    delayOraclize = 0;
    dataSourceOraclize = "random";
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

function addGameByAdmin(uint256[14] calldata _gameProperties) external 
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

function updateGameByAdmin(uint256[14] calldata _gameProperties, uint256 _gameID) external 
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

function updateOraclizeByAdmin(uint256 _gasLimitOraclize, uint256 _gasPriceOraclize, 
    uint256 _numBytesOraclize, uint256 _delayOraclize, string calldata _dataSourceOraclize) external 
    onlyOwners {

    gasLimitOraclize = _gasLimitOraclize;
    gasPriceOraclize = _gasPriceOraclize;
    oraclize_setCustomGasPrice(_gasPriceOraclize);
    numBytesOraclize = _numBytesOraclize;
    delayOraclize = _delayOraclize;
    dataSourceOraclize = _dataSourceOraclize;
        
    //# EMIT EVENT LOG - to be done
}


function updateMegaPrizeByAdmin(uint256 _megaPrizeID, uint256 _megaPrizeAmount, bool _isMegaPrizeEnabled, 
    bool _isMegaPrizeLateLocked, bool _isMegaPrizeMatured, uint256 _megaPrizeDurationInEpoch, uint256 _megaPrizeDurationInBlocks) external payable
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

            //check if contract has enough funds to invoke oraclize
            if(oraclize_getPrice(dataSourceOraclize, gasLimitOraclize) > address(this).balance) {
                // pause all games until contract funds have been replenished
                pauseAllGamesByAdmin();
                return;
            }
            else {
                // this function internally generates the correct oraclize_query and returns its queryId
                _oraclizeID = oraclize_newRandomDSQuery(delayOraclize, numBytesOraclize, gasLimitOraclize);
            }

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


function __callback(bytes32 _oraclizeID, string memory _result, bytes memory _oraclizeProof) public {
    
    // using require statement instead since using modifiers may use extra call stack
    require(msg.sender == oraclize_cbAddress(), " __callback cannot be called by any actor apart from Oraclize ");
    if (oraclize_randomDS_proofVerify__returnCode(_oraclizeID, _result, _oraclizeProof) != 0) {

        for(uint256 p=0;p < roundsOfOraclizeID[_oraclizeID].length; p++) {
            pendingRoundsOraclize.push(roundsOfOraclizeID[_oraclizeID][p]);
        
        }

        //# EMIT EVENT LOG
        return;
    }

    uint256 _gameID;
    uint256 _roundID;
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
        _roundID = _roundsOfOraclizeID[i];
        // if a round has been already decided by Oraclize callback, then continue with next round. 
        // This will also help to prevent any possible malicious execution by Oraclize
        if(rounds[_roundID].oraclizeProof.length != 0) continue;
        _gameID = rounds[_roundID].gameID;
        address payable[] storage _playerList = rounds[_roundID].playerList;
        // get the Provable Oraclize Random Number and mod it to the length of totalTokensPurchased (or _tokenSlab)
        _oraclizeRandomNumber = uint256(keccak256(bytes(_result))).mod(rounds[_roundID].totalTokensPurchased);
        // _tokenSlab will be the array in which we choose a random index provided by Oraclize to pick winner.
        // _numTokensSlab is the array containing number of tokens purchased by each player of this round.
        // We will use these two arrays, alongwith playerList to input values in the _tokenSlab in a transposing manner.
        // This enables a very fine mixing of values before picking winner, and also prevents any outcome prediction.
        _numTokensSlab = new uint256[](_playerList.length);
        _tokenSlab = new address payable[](rounds[_roundID].totalTokensPurchased);

        for(uint256 j=0; j < _playerList.length; j++) {
            _numTokensSlab[j] = rounds[_roundID].playerTokens[_playerList[j]];
            // consider for Mega Prize
            if(megaPrizePlayers[_playerList[j]] == 0) {
                megaPrizePlayersKeys.push(_playerList[j]);
            }
            megaPrizePlayers[_playerList[j]] = megaPrizePlayers[_playerList[j]].add(rounds[_roundID].playerTokens[_playerList[j]]);

        }
        _slabIndex = 0;
        // input player address values in the _tokensSlab in a transposing manner. A player address value is input in 
        //_tokenSlab multiple times if more than one token is bought, providing weighted probabilities of winning.
        for(uint256 k=0; _slabIndex < rounds[_roundID].totalTokensPurchased; k++) {
            
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
        rounds[_roundID].winner = _tokenSlab[_oraclizeRandomNumber];
        // set the oraclizeProof data into the round data
        rounds[_roundID].oraclizeProof = _oraclizeProof;
        // compensate the winner and deduct houseEdge and megaPrizeEdge in a seperate private function
        compensateWinner(rounds[_roundID].winner, _roundID, _result);
        
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


function getGamesByAdmin() external view  
    onlyOwners returns(
        uint256[] memory _gameIDs,
        uint256[] memory _maxTokens,
        uint256[] memory _tokenValues,
        uint256[] memory _gameDurationsInEpoch,
        uint256[] memory _gameDurationsInBlocks,
        uint256[] memory _maxTokensPerPlayers,
        uint256[] memory _houseEdges,
        uint256[] memory _megaPrizeEdges,
        uint256[] memory _totalValueForGames,
        uint256[] memory _totalWinnings,
        uint256[] memory _directPlayTokenValues,
        uint256[] memory _currentRounds,
        bool[] memory _isGameLocked,
        bool[] memory _isGameLateLocked
    ){
        _gameIDs = new uint256[](gameStrategiesKeys.length);
        _maxTokens = new uint256[](gameStrategiesKeys.length);
        _tokenValues = new uint256[](gameStrategiesKeys.length);
        _gameDurationsInEpoch = new uint256[](gameStrategiesKeys.length);
        _gameDurationsInBlocks = new uint256[](gameStrategiesKeys.length);
        _maxTokensPerPlayers = new uint256[](gameStrategiesKeys.length);
        _houseEdges = new uint256[](gameStrategiesKeys.length);
        _megaPrizeEdges = new uint256[](gameStrategiesKeys.length);
        _totalValueForGames = new uint256[](gameStrategiesKeys.length);
        _totalWinnings = new uint256[](gameStrategiesKeys.length);
        _directPlayTokenValues = new uint256[](gameStrategiesKeys.length);
        _currentRounds = new uint256[](gameStrategiesKeys.length);
        _isGameLocked = new bool[](gameStrategiesKeys.length);
        _isGameLateLocked = new bool[](gameStrategiesKeys.length);

        for(uint256 i=0;i < gameStrategiesKeys.length;i++) {
            _gameIDs[i] = gameStrategies[gameStrategiesKeys[i]].gameID;
            _maxTokens[i] = gameStrategies[gameStrategiesKeys[i]].maxTokens;
            _tokenValues[i] = gameStrategies[gameStrategiesKeys[i]].tokenValue;
            _gameDurationsInEpoch[i] = gameStrategies[gameStrategiesKeys[i]].gameDurationInEpoch;
            _gameDurationsInBlocks[i] = gameStrategies[gameStrategiesKeys[i]].gameDurationInBlocks;
            _maxTokensPerPlayers[i] = gameStrategies[gameStrategiesKeys[i]].maxTokensPerPlayer;
            _houseEdges[i] = gameStrategies[gameStrategiesKeys[i]].houseEdge;
            _megaPrizeEdges[i] = gameStrategies[gameStrategiesKeys[i]].megaPrizeEdge;
            _totalValueForGames[i] = gameStrategies[gameStrategiesKeys[i]].totalValueForGame;
            _totalWinnings[i] = gameStrategies[gameStrategiesKeys[i]].totalWinnings;
            _directPlayTokenValues[i] = gameStrategies[gameStrategiesKeys[i]].directPlayTokenValue;
            _currentRounds[i] = gameStrategies[gameStrategiesKeys[i]].currentRound;
            _isGameLocked[i] = gameStrategies[gameStrategiesKeys[i]].isGameLocked;
            _isGameLateLocked[i] = gameStrategies[gameStrategiesKeys[i]].isGameLateLocked;
        }

        return (
            _gameIDs,
            _maxTokens,
            _tokenValues,
            _gameDurationsInEpoch,
            _gameDurationsInBlocks,
            _maxTokensPerPlayers,
            _houseEdges,
            _megaPrizeEdges,
            _totalValueForGames,
            _totalWinnings,
            _directPlayTokenValues,
            _currentRounds,
            _isGameLocked,
            _isGameLateLocked
        );
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


function getOraclizeByAdmin() external view 
    onlyOwners returns(
        uint256 _gasLimitOraclize,
        uint256 _gasPriceOraclize,
        uint256 _numBytesOraclize,
        uint256 _delayOraclize,
        string memory _dataSourceOraclize,
        uint256[] memory _pendingRoundsOraclize
    ) {

        _gasLimitOraclize = gasLimitOraclize;
        _gasPriceOraclize = gasPriceOraclize;
        _numBytesOraclize = numBytesOraclize;
        _delayOraclize = delayOraclize;
        _dataSourceOraclize = dataSourceOraclize;
        _pendingRoundsOraclize = pendingRoundsOraclize;

        return(
            _gasLimitOraclize,
            _gasPriceOraclize,
            _numBytesOraclize,
            _delayOraclize,
            _dataSourceOraclize,
            _pendingRoundsOraclize
        );

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

        playerWithdrawalsKeys.length = (playerWithdrawalsKeys.length).sub(1);

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








