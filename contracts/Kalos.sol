// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Kalos is ERC721URIStorage {
    // Maximium amount of active Kalos artworks in general
    uint private constant MAX_TOTAL_ARTWORKS = 999;
    // Maximium amount of active Kalos artworks that a normal account can own
    uint private constant MAX_PERSONAL_ARTWORKS = 3;
    // Maximium amount of active Kalos artworks that the deployer can own
    uint private constant MAX_DEPLOYER_ARTWORKS = 10;

    using Counters for Counters.Counter;

    // The counter for all artworks (including active / burnt)
    Counters.Counter private _artworkCounter;

    // The counter for all burnt artworks
    Counters.Counter private _burntArtworkCounter;

    // The deployer of this contract
    address public deployer;

    // The tip balance for each artwork, which could be withdrawn by owner of the artwork
    mapping(uint => uint) public tipBalances;

    // To declare name and symbol of the token, as well as memorize the deployer when create the contract
    constructor() ERC721('Kalos', 'KLS') {
      deployer = _msgSender();
    }

    // Total amount of all artworks (including active / burnt)
    function totalArtworks() public view returns (uint) {
      return _artworkCounter.current();
    }

    // Total amount of all active artworks
    function totalActiveArtworks() public view returns (uint) {
      uint artworkTotalNum = _artworkCounter.current();
      uint burntArtworkTotalNum = _burntArtworkCounter.current();
      uint activeArtworkTotalNum = artworkTotalNum - burntArtworkTotalNum;
      return activeArtworkTotalNum;
    }
    
    // Revert if no empty slot exists for a specific account to store artworks
    function _requirePersonalEmptySlot(address _account) private view {
      bool isDeployer = deployer == _account;
      uint maxOwned = isDeployer ? MAX_DEPLOYER_ARTWORKS : MAX_PERSONAL_ARTWORKS;
      uint currentOwned = balanceOf(_account);
      require(maxOwned > currentOwned, 'No empty slot for the owner');
    }

    // Revert if no empty slot exists for all accounts in general
    function _requireTotalEmptySlot() private view {
      uint activeArtworkTotalNum = totalActiveArtworks();
      require(MAX_TOTAL_ARTWORKS > activeArtworkTotalNum, 'No empty slot for all');
    }

    function _requireNotReachMaxIntLimit(uint currentNum) private pure {
      uint maxUint = type(uint).max;
      require(currentNum < maxUint, 'The current number has reached the max limit for integer');
    }

    // Revert if the caller is not owner of a specific artwork
    modifier onlyArtworkOwner(uint _artworkId) {
      address artworkOwner = ownerOf(_artworkId);
      require(artworkOwner == _msgSender(), 'the caller is not owner of the artwork');
      _;
    }

    // Revert if no tip balance exists for a specific artwork
    modifier onlyHasTipBalance(uint _artworkId) {
      uint tipBalance = tipBalances[_artworkId];
      require(tipBalance > 0, 'No tip balance exists for the artwork');
      _;
    }

    // Mint an artwork for a specific account if there is any empty slot
    // The ID of artwork starts from 0
    // Note: We will freeze minting if artwork ID reach max integer limit (although such case is nearly impossible to happen)
    function mint(string calldata _artworkURI, address _toAccount) public {
      uint newArtworkId = _artworkCounter.current();
      _requireNotReachMaxIntLimit(newArtworkId);
      _requireTotalEmptySlot();
      _requirePersonalEmptySlot(_toAccount);
      _artworkCounter.increment();
      _setTokenURI(newArtworkId, _artworkURI);
      _safeMint(_toAccount, newArtworkId);
      address minter = _msgSender();
      emit Mint(minter, newArtworkId, _artworkURI);
    }

    // Destroy a specific artwork by its owner, and withdraw tips first to avoid losing them
    // Note: We will freeze destroying if the total number of burnt artworks reach max integer limit (although such case is nearly impossible to happen)
    function destroy(uint _artworkId) onlyArtworkOwner(_artworkId) public {
      uint burntArtworkTotalNum = _burntArtworkCounter.current();
      _requireNotReachMaxIntLimit(burntArtworkTotalNum);
      if (tipBalances[_artworkId] > 0) {
        withdraw(_artworkId);
      }
      _burn(_artworkId);
      _burntArtworkCounter.increment();
      string memory artworkURI = tokenURI(_artworkId);
      address caller = _msgSender();
      emit Destroy(caller, _artworkId, artworkURI);
    }

    // Transfer artwork from its owner to someone with empty slot
    function transfer(uint _artworkId, address _toAccount) onlyArtworkOwner(_artworkId) public {
      address msgSender = _msgSender();
      require(msgSender != _toAccount, 'The transferee cannot be the same as transferor');
      _requirePersonalEmptySlot(_toAccount);
      safeTransferFrom(msgSender, _toAccount, _artworkId);
      string memory artworkURI = tokenURI(_artworkId);
      emit Transfer(msgSender, _toAccount, _artworkId, artworkURI);
    }

    // Tip on a specific active artwork
    function tip(uint _artworkId) external payable {
      require(msg.value > 0, 'the tip amount should not be 0');
      _requireMinted(_artworkId);
      tipBalances[_artworkId] += msg.value;
      string memory artworkURI = tokenURI(_artworkId);
      address payer = _msgSender();
      emit Tip(payer, _artworkId, artworkURI, msg.value);
    }

    // To withdraw a specifc amount of tips from the owner of the artwork
    function withdraw(uint _artworkId, uint _amount) onlyArtworkOwner(_artworkId) onlyHasTipBalance(_artworkId) public {
      uint tipBalance = tipBalances[_artworkId];
      require(_amount <= tipBalance, 'the amount to withdraw exceeds the tip balance');
      address payable artworkOwner = payable(ownerOf(_artworkId));
      (bool success, ) = artworkOwner.call{value: _amount}("");
      require(success, "Failed to transfer value to artwork owner");
      tipBalances[_artworkId] -= _amount;
      string memory artworkURI = tokenURI(_artworkId);
      emit Withdraw(artworkOwner, _artworkId, artworkURI, _amount);
    }

    // To withdraw all tips from the owner of the artwork
    function withdraw(uint _artworkId) onlyArtworkOwner(_artworkId) onlyHasTipBalance(_artworkId) public {
      uint tipBalance = tipBalances[_artworkId];
      withdraw(_artworkId, tipBalance);
    }

    event Mint(address indexed minter, uint artworkId, string indexed artworkURI);
    event Destroy(address indexed destroyer, uint artworkId, string indexed artworkURI);
    event Transfer(address indexed transferor, address indexed transferee, uint artworkId, string indexed artworkURI);
    event Tip(address indexed payer, uint artworkId, string indexed artworkURI, uint amount);
    event Withdraw(address indexed owner, uint artworkId, string indexed artworkURI, uint amount);
}
