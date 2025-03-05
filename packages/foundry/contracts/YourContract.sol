// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PetNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;

    struct Pet {
        string name;
        string breed;
        string color;
        bool isLost;
        string lastSeenLocation;
    }

    struct Report {
        address reporter;
        string imageURI; // IPFS link
        string location;
        uint256 timestamp;
    }

    mapping(uint256 => Pet) public pets; // TokenID -> Pet details
    mapping(uint256 => Report[]) public reports; // TokenID -> list of reports

    event PetMinted(uint256 tokenId, address owner, string metadataURI);
    event PetReportedLost(uint256 tokenId, string lastSeenLocation);
    event PetSighted(
        uint256 tokenId,
        address reporter,
        string imageURI,
        string location
    );
    event PetRecovered(uint256 tokenId);

    constructor() ERC721("LostPetNFT", "PET") {}

    function mintPetNFT(
        string memory metadataURI,
        string memory name,
        string memory breed,
        string memory color
    ) public returns (uint256) {
        _tokenIds++;
        uint256 newTokenId = _tokenIds;

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, metadataURI);

        pets[newTokenId] = Pet(name, breed, color, false, "");

        emit PetMinted(newTokenId, msg.sender, metadataURI);
        return newTokenId;
    }

    function reportPetLost(
        uint256 tokenId,
        string memory lastSeenLocation
    ) public {
        require(ownerOf(tokenId) == msg.sender, "Only owner can mark as lost");
        pets[tokenId].isLost = true;
        pets[tokenId].lastSeenLocation = lastSeenLocation;

        emit PetReportedLost(tokenId, lastSeenLocation);
    }

    function reportPetSighted(
        uint256 tokenId,
        string memory imageURI,
        string memory location
    ) public {
        require(pets[tokenId].isLost, "Pet is not marked as lost");

        reports[tokenId].push(
            Report(msg.sender, imageURI, location, block.timestamp)
        );

        emit PetSighted(tokenId, msg.sender, imageURI, location);
    }

    function markPetAsFound(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Only owner can mark as found");
        pets[tokenId].isLost = false;
        delete reports[tokenId]; // Clear all reports after the pet is found

        emit PetRecovered(tokenId);
    }

    function getReports(uint256 tokenId) public view returns (Report[] memory) {
        return reports[tokenId];
    }
}
