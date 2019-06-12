pragma solidity ^ 0.5.0;

import "./ERC20.sol";
import "./Ownable.sol";

/**
 * @title Pattent
 * @dev The Pattent contract is the core contract to store and retrieve viewer preference data.
 */
contract Pattent is Ownable, ERC20 {

    mapping (address => bool) private advertiserID;
    mapping (address => uint256) private viewerPreferences;
    mapping (address => address) private getAdvertiser;
    uint256 adSkipCost;
    uint256 adCredits;
    event adSkipEvent(address viewer);
    

    constructor() public {
        adSkipCost = 3;
        _mint(msg.sender, 100000);    
        adCredits = 10;
    }

    function registerAdvertiser(address payable _address) external onlyOwner
    {
        advertiserID[_address] = true;
    }

    function getViewerData(address payable _address) public view returns(uint256 viewerData) {
        return viewerPreferences[_address];
    }

    function purchaseAdSkip() external
    {
        // cost of AdSkip is 5 tokens
        require(balanceOf(msg.sender) >= adSkipCost, "no_bal_skip");
        transfer(getAdvertiser[msg.sender], adSkipCost);
        emit adSkipEvent(msg.sender);
    }
    
    function creditTokens() external 
    {
        // cost of AdSkip is 5 tokens
        require(balanceOf(owner()) >= adCredits, "no_bal_cred");
        _mint(msg.sender, adCredits);
    }
    
    // fallback function (payable)
    function () external payable {

    }

    // self destruct contract after reverting all pending games of players and sending back funds
    function ownerKill() external
    onlyOwner {
        address payable owner = address(uint160(owner()));
        selfdestruct(owner);
    }

}
/**
 * @dev End of Pattent
 */










