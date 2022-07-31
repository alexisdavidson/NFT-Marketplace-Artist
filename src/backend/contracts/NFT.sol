// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {
    uint public tokenCount;

    mapping(uint => address[]) public buyers;

    constructor() ERC721("Artist Marketplace NFT", "AMN") {}

    function mint(string memory _tokenURI) external returns(uint) {
        tokenCount += 1;
        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);
        return(tokenCount);
    }

    function addBuyer(address _user, uint256 _tokenId) public {
        buyers[_tokenId].push(_user);
    }

    function getBuyersCount(uint256 _tokenId) public view returns(uint) {
        return buyers[_tokenId].length;
    }

    function userHasBoughtToken(address _user, uint256 _tokenId) public view returns(bool) {
        for (uint i = 0; i < buyers[_tokenId].length; i++) {
            if (buyers[_tokenId][i] == _user) {
                return true;
            }
        }
        return false;
    }
}