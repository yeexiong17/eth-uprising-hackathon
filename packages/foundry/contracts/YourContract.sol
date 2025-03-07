// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract YourContract is ERC721URIStorage {
    uint256 public nextTokenId;
    uint256 public nextSightingId;
    mapping(uint256 => Pet) public pets;
    mapping(uint256 => LostReport) public lostReports;
    mapping(uint256 => mapping(address => Sighting)) public sightings;
    mapping(uint256 => address[]) public verifications;
    mapping(uint256 => uint256) public rewardPool;
    mapping(uint256 => address[]) public sightingUsers;
    mapping(uint256 => SightingInfo[]) public sightingList; // Stores sightings per tokenId
    mapping(uint256 => mapping(uint256 => bool)) public verifiedSightings; // Track verified sightings (tokenId => sightingId => verified)

    struct Pet {
        uint256 tokenId;
        string name;
        string breed;
        string color;
        string description;
        string imageURI;
        address owner;
    }
    struct LostPet {
        uint256 tokenId;
        string name;
        string breed;
        string color;
        string description;
        string imageURI;
        address owner;
        bool isLost;
        uint256 reward;
        int256 latitude;
        int256 longitude;
    }

    struct LostReport {
        uint256 tokenId;
        bool isLost;
        uint256 reward;
        int256 latitude;
        int256 longitude;
    }

    struct Sighting {
        uint256 sightingId;
        int256 latitude;
        int256 longitude;
        string description;
        string imageURI;
    }

    struct SightingInfo {
        address user; // Who reported the sighting
        address owner; // Pet owner's address
        Sighting sighting;
        bool isVerified;
    }

    event PetMinted(uint256 indexed tokenId, address owner, string name);
    event PetReportedLost(
        uint256 indexed tokenId,
        int256 latitude,
        int256 longitude
    );
    event PetSighted(
        uint256 indexed tokenId,
        address indexed user,
        int256 latitude,
        int256 longitude
    );
    event SightingVerified(
        uint256 indexed tokenId,
        uint256 sightingId,
        address verifier
    );
    event PetVerified(uint256 indexed tokenId, address indexed verifier);
    event RewardDistributed(uint256 indexed tokenId, uint256 totalReward);

    constructor() ERC721("Pet Identity NFT", "PETID") {}

    function mintPetNFT(
        string memory name,
        string memory breed,
        string memory color,
        string memory description,
        string memory imageURI
    ) external {
        uint256 tokenId = nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, imageURI);

        pets[tokenId] = Pet(
            tokenId,
            name,
            breed,
            color,
            description,
            imageURI,
            msg.sender
        );

        emit PetMinted(tokenId, msg.sender, name);
    }

    function getLostPet(
        uint256 tokenId
    )
        external
        view
        returns (
            uint256,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            address,
            bool,
            uint256,
            int256,
            int256
        )
    {
        require(ownerOf(tokenId) != address(0), "Pet NFT does not exist.");
        require(lostReports[tokenId].isLost, "Pet is not reported lost.");

        Pet memory pet = pets[tokenId];
        LostReport memory lostReport = lostReports[tokenId];

        return (
            pet.tokenId,
            pet.name,
            pet.breed,
            pet.color,
            pet.description,
            pet.imageURI,
            pet.owner,
            lostReport.isLost,
            lostReport.reward,
            lostReport.latitude,
            lostReport.longitude
        );
    }

    function getUserMintedPets(
        address user
    ) external view returns (Pet[] memory) {
        uint256 totalPets = nextTokenId; // Total number of minted pets
        uint256 count = 0;

        // Count the number of pets owned by the user
        for (uint256 i = 0; i < totalPets; i++) {
            if (pets[i].owner == user) {
                count++;
            }
        }

        // Create an array to store pet details
        Pet[] memory userPets = new Pet[](count);
        uint256 index = 0;

        // Populate the array with pet details
        for (uint256 i = 0; i < totalPets; i++) {
            if (pets[i].owner == user) {
                userPets[index] = pets[i];
                index++;
            }
        }

        return userPets;
    }

    function reportLost(
        uint256 tokenId,
        int256 latitude,
        int256 longitude
    ) external payable {
        require(
            ownerOf(tokenId) == msg.sender,
            "Only pet owner can report lost."
        );
        require(!lostReports[tokenId].isLost, "Pet is already reported lost.");
        require(msg.value > 0, "Reward must be greater than 0.");

        lostReports[tokenId] = LostReport(
            tokenId,
            true,
            msg.value,
            latitude,
            longitude
        );
        rewardPool[tokenId] += msg.value;

        emit PetReportedLost(tokenId, latitude, longitude);
    }

    function updateSightings(
        uint256 tokenId,
        int256 latitude,
        int256 longitude,
        string memory description,
        string memory imageURI
    ) external {
        require(lostReports[tokenId].isLost, "Pet is not reported lost.");

        uint256 sightingId = nextSightingId++; // Generate unique sighting ID
        address owner = ownerOf(tokenId); // Get pet owner's address

        Sighting memory newSighting = Sighting(
            sightingId,
            latitude,
            longitude,
            description,
            imageURI
        );

        sightingList[tokenId].push(
            SightingInfo(msg.sender, owner, newSighting, false) // Store owner
        );

        emit PetSighted(tokenId, msg.sender, latitude, longitude);
    }

    function verifySighting(uint256 tokenId, uint256 sightingId) external {
        require(ownerOf(tokenId) == msg.sender, "Only pet owner can verify.");

        bool found = false;
        for (uint256 i = 0; i < sightingList[tokenId].length; i++) {
            if (sightingList[tokenId][i].sighting.sightingId == sightingId) {
                found = true;
                sightingList[tokenId][i].isVerified = true; // Mark sighting as verified

                // Add the reporter to verifications list if not already added
                address verifier = sightingList[tokenId][i].user;
                bool alreadyVerified = false;
                for (uint256 j = 0; j < verifications[tokenId].length; j++) {
                    if (verifications[tokenId][j] == verifier) {
                        alreadyVerified = true;
                        break;
                    }
                }
                if (!alreadyVerified) {
                    verifications[tokenId].push(verifier);
                }

                break;
            }
        }
        require(found, "Sighting ID not found.");

        verifiedSightings[tokenId][sightingId] = true;

        emit SightingVerified(tokenId, sightingId, msg.sender);
    }

    function resolveFound(uint256 tokenId) external {
        require(
            ownerOf(tokenId) == msg.sender,
            "Only pet owner can mark as found."
        );
        require(lostReports[tokenId].isLost, "Pet is not lost.");

        lostReports[tokenId].isLost = false;
        uint256 totalReward = rewardPool[tokenId];

        if (verifications[tokenId].length > 0) {
            uint256 perUserReward = totalReward / verifications[tokenId].length;
            for (uint256 i = 0; i < verifications[tokenId].length; i++) {
                payable(verifications[tokenId][i]).transfer(perUserReward);
            }
        } else {
            payable(msg.sender).transfer(totalReward); // Refund pet owner
        }

        // Clear all previous data related to the lost report
        rewardPool[tokenId] = 0;
        delete verifications[tokenId];
        delete sightingList[tokenId]; // Clears all past sightings

        emit RewardDistributed(tokenId, totalReward);
    }

    function getAllLostPets() external view returns (LostPet[] memory) {
        uint256 totalPets = nextTokenId;
        uint256 count = 0;

        // Count lost pets
        for (uint256 i = 0; i < totalPets; i++) {
            if (lostReports[i].isLost) {
                count++;
            }
        }

        // Create an array to store combined lost pet details
        LostPet[] memory lostPets = new LostPet[](count);
        uint256 index = 0;

        // Populate the array with lost pet details
        for (uint256 i = 0; i < totalPets; i++) {
            if (lostReports[i].isLost) {
                Pet memory pet = pets[i];
                LostReport memory lostReport = lostReports[i];

                lostPets[index] = LostPet(
                    pet.tokenId,
                    pet.name,
                    pet.breed,
                    pet.color,
                    pet.description,
                    pet.imageURI,
                    pet.owner,
                    lostReport.isLost,
                    lostReport.reward,
                    lostReport.latitude,
                    lostReport.longitude
                );
                index++;
            }
        }

        return lostPets;
    }

    function getSightings(
        uint256 tokenId
    ) external view returns (SightingInfo[] memory) {
        return sightingList[tokenId];
    }
}
