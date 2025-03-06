// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract YourContract is ERC721URIStorage {
    uint256 public nextTokenId;
    mapping(uint256 => Pet) public pets;
    mapping(uint256 => bool) public isLost;
    mapping(uint256 => mapping(address => string)) public sightings;
    mapping(uint256 => address[]) public verifications;
    mapping(uint256 => uint256) public rewardPool;

    struct Pet {
        string name;
        string breed;
        uint256 age;
        string imageURI;
        address owner;
    }

    event PetMinted(uint256 indexed tokenId, address owner, string name);
    event PetReportedLost(uint256 indexed tokenId);
    event PetSighted(
        uint256 indexed tokenId,
        address indexed user,
        string location
    );
    event PetVerified(uint256 indexed tokenId, address indexed verifier);
    event RewardDistributed(uint256 indexed tokenId, uint256 totalReward);

    constructor() ERC721("Pet Identity NFT", "PETID") {}

    function mintPetNFT(
        string memory name,
        string memory breed,
        uint256 age,
        string memory imageURI
    ) external {
        uint256 tokenId = nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, imageURI);
        pets[tokenId] = Pet(name, breed, age, imageURI, msg.sender);

        emit PetMinted(tokenId, msg.sender, name);
    }

    function getPetDetails(
        uint256 tokenId
    )
        external
        view
        returns (
            string memory name,
            string memory breed,
            uint256 age,
            string memory imageURI,
            address owner
        )
    {
        require(ownerOf(tokenId) != address(0), "Pet NFT does not exist.");

        Pet memory pet = pets[tokenId];
        return (pet.name, pet.breed, pet.age, pet.imageURI, pet.owner);
    }

    function reportLost(uint256 tokenId) external payable {
        require(
            ownerOf(tokenId) == msg.sender,
            "Only pet owner can report lost."
        );
        require(!isLost[tokenId], "Pet is already reported lost.");
        require(msg.value > 0, "Reward must be greater than 0.");

        isLost[tokenId] = true;
        rewardPool[tokenId] += msg.value; // Store the ETH reward pool

        emit PetReportedLost(tokenId);
    }

    function updateSightings(uint256 tokenId, string memory location) external {
        require(isLost[tokenId], "Pet is not reported lost.");
        sightings[tokenId][msg.sender] = location;
        emit PetSighted(tokenId, msg.sender, location);
    }

    function verifySighting(uint256 tokenId, address user) external {
        require(ownerOf(tokenId) == msg.sender, "Only pet owner can verify.");
        verifications[tokenId].push(user);
        emit PetVerified(tokenId, user);
    }

    function resolveFound(uint256 tokenId) external {
        require(
            ownerOf(tokenId) == msg.sender,
            "Only pet owner can mark as found."
        );
        require(isLost[tokenId], "Pet is not lost.");

        isLost[tokenId] = false;
        uint256 totalReward = rewardPool[tokenId];

        if (verifications[tokenId].length > 0) {
            uint256 perUserReward = totalReward / verifications[tokenId].length;
            for (uint256 i = 0; i < verifications[tokenId].length; i++) {
                payable(verifications[tokenId][i]).transfer(perUserReward);
            }
        } else {
            // No verifications? Refund the pet owner
            payable(msg.sender).transfer(totalReward);
        }

        rewardPool[tokenId] = 0;
        delete verifications[tokenId];

        emit RewardDistributed(tokenId, totalReward);
    }
}
