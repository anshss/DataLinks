//SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "usingtellor/contracts/UsingTellor.sol";

contract LinkoNft is ERC721, UsingTellor{

    address payable owner;

    constructor(address payable _tellorAddress) UsingTellor(_tellorAddress)  ERC721("View Token", "VT") {
        owner = payable(msg.sender);
    }

    using Counters for Counters.Counter;
    Counters.Counter private _tokenId;

    struct PaidLinko {
        string cid;
        uint price;
        uint usdPrice;
        address payable host;
        uint linkoId;
    }

    uint public linkoId = 0;
    uint public tokenId = 0;

    mapping (uint => PaidLinko) public idToLinko;

    function setViewCollection(string memory _IpfsFile, uint _price) public {
        linkoId++;

        // uint FilPrice; 
        // bytes memory _queryData = abi.encode("SpotPrice", abi.encode("fil", "usd"));
        // bytes32 _queryId = keccak256(_queryData);
    
        // (bytes memory _value, uint256 _timestampRetrieved) =
        // getDataBefore(_queryId, block.timestamp - 15 minutes);

        // if(_timestampRetrieved > 0) {
        //     if(block.timestamp - _timestampRetrieved < 24 hours) {
        //         FilPrice = _sliceUint(_value);
        //     }
        // }   

        // uint convertedPrice = _price * FilPrice;
        uint convertedPrice = priceInUsdt(_price);

        idToLinko[linkoId] = PaidLinko(_IpfsFile, _price, convertedPrice, payable(msg.sender), linkoId);

    }

    function mint(uint _linkoId) public payable {
        require( msg.value == idToLinko[_linkoId].price, "incorrect amount sent");
        tokenId++;
        _mint(msg.sender, tokenId);

        // _tokenId.increment();
        // uint newTokenId = _tokenId.current();
        // payable(idToLinko[_linkoId].host).transfer(msg.value);
    }

    function fetchLinko() public view returns(PaidLinko[] memory) {
        uint counter = 0;

        PaidLinko[] memory linkos = new PaidLinko[](linkoId);
        for (uint i = 0; i < linkoId; i++) {   
            uint currentId = i+1;
            PaidLinko storage currentItem = idToLinko[currentId];
            linkos[counter] = currentItem;
            counter++;
        }
        return linkos;
    }

    function priceInUsdt(uint _price) public view returns(uint){

        uint FilPrice = 5;

        bytes memory _queryData = abi.encode("SpotPrice", abi.encode("fil", "usd"));
        bytes32 _queryId = keccak256(_queryData);
    
        (bytes memory _value, uint256 _timestampRetrieved) =
        getDataBefore(_queryId, block.timestamp - 15 minutes);

        if(_timestampRetrieved > 0) {
            if(block.timestamp - _timestampRetrieved < 24 hours) {
                FilPrice = _sliceUint(_value);
            }
        }   

        uint convertedPrice = _price * FilPrice;
        return convertedPrice;
    }
}