/**
 * This file is autogenerated by Scaffold-ETH.
 * You should not edit it manually or your changes might be overwritten.
 */
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const deployedContracts = {
  534351: {
    YourContract: {
      address: "0x39e01ff59e150f137e294248a4781d1ea4548c56",
      abi: [
        {
          type: "constructor",
          inputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "approve",
          inputs: [
            {
              name: "to",
              type: "address",
              internalType: "address",
            },
            {
              name: "tokenId",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "balanceOf",
          inputs: [
            {
              name: "owner",
              type: "address",
              internalType: "address",
            },
          ],
          outputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "getAllLostPets",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "tuple[]",
              internalType: "struct YourContract.LostPet[]",
              components: [
                {
                  name: "tokenId",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "name",
                  type: "string",
                  internalType: "string",
                },
                {
                  name: "breed",
                  type: "string",
                  internalType: "string",
                },
                {
                  name: "color",
                  type: "string",
                  internalType: "string",
                },
                {
                  name: "description",
                  type: "string",
                  internalType: "string",
                },
                {
                  name: "imageURI",
                  type: "string",
                  internalType: "string",
                },
                {
                  name: "owner",
                  type: "address",
                  internalType: "address",
                },
                {
                  name: "isLost",
                  type: "bool",
                  internalType: "bool",
                },
                {
                  name: "reward",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "latitude",
                  type: "int256",
                  internalType: "int256",
                },
                {
                  name: "longitude",
                  type: "int256",
                  internalType: "int256",
                },
              ],
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "getApproved",
          inputs: [
            {
              name: "tokenId",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [
            {
              name: "",
              type: "address",
              internalType: "address",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "getLostPet",
          inputs: [
            {
              name: "tokenId",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "",
              type: "string",
              internalType: "string",
            },
            {
              name: "",
              type: "string",
              internalType: "string",
            },
            {
              name: "",
              type: "string",
              internalType: "string",
            },
            {
              name: "",
              type: "string",
              internalType: "string",
            },
            {
              name: "",
              type: "string",
              internalType: "string",
            },
            {
              name: "",
              type: "address",
              internalType: "address",
            },
            {
              name: "",
              type: "bool",
              internalType: "bool",
            },
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "",
              type: "int256",
              internalType: "int256",
            },
            {
              name: "",
              type: "int256",
              internalType: "int256",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "getSightings",
          inputs: [
            {
              name: "tokenId",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [
            {
              name: "",
              type: "tuple[]",
              internalType: "struct YourContract.SightingInfo[]",
              components: [
                {
                  name: "user",
                  type: "address",
                  internalType: "address",
                },
                {
                  name: "owner",
                  type: "address",
                  internalType: "address",
                },
                {
                  name: "sighting",
                  type: "tuple",
                  internalType: "struct YourContract.Sighting",
                  components: [
                    {
                      name: "sightingId",
                      type: "uint256",
                      internalType: "uint256",
                    },
                    {
                      name: "latitude",
                      type: "int256",
                      internalType: "int256",
                    },
                    {
                      name: "longitude",
                      type: "int256",
                      internalType: "int256",
                    },
                    {
                      name: "description",
                      type: "string",
                      internalType: "string",
                    },
                    {
                      name: "imageURI",
                      type: "string",
                      internalType: "string",
                    },
                  ],
                },
                {
                  name: "isVerified",
                  type: "bool",
                  internalType: "bool",
                },
              ],
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "getUserMintedPets",
          inputs: [
            {
              name: "user",
              type: "address",
              internalType: "address",
            },
          ],
          outputs: [
            {
              name: "",
              type: "tuple[]",
              internalType: "struct YourContract.Pet[]",
              components: [
                {
                  name: "tokenId",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "name",
                  type: "string",
                  internalType: "string",
                },
                {
                  name: "breed",
                  type: "string",
                  internalType: "string",
                },
                {
                  name: "color",
                  type: "string",
                  internalType: "string",
                },
                {
                  name: "description",
                  type: "string",
                  internalType: "string",
                },
                {
                  name: "imageURI",
                  type: "string",
                  internalType: "string",
                },
                {
                  name: "owner",
                  type: "address",
                  internalType: "address",
                },
              ],
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "isApprovedForAll",
          inputs: [
            {
              name: "owner",
              type: "address",
              internalType: "address",
            },
            {
              name: "operator",
              type: "address",
              internalType: "address",
            },
          ],
          outputs: [
            {
              name: "",
              type: "bool",
              internalType: "bool",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "lostReports",
          inputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [
            {
              name: "tokenId",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "isLost",
              type: "bool",
              internalType: "bool",
            },
            {
              name: "reward",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "latitude",
              type: "int256",
              internalType: "int256",
            },
            {
              name: "longitude",
              type: "int256",
              internalType: "int256",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "mintPetNFT",
          inputs: [
            {
              name: "name",
              type: "string",
              internalType: "string",
            },
            {
              name: "breed",
              type: "string",
              internalType: "string",
            },
            {
              name: "color",
              type: "string",
              internalType: "string",
            },
            {
              name: "description",
              type: "string",
              internalType: "string",
            },
            {
              name: "imageURI",
              type: "string",
              internalType: "string",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "name",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "string",
              internalType: "string",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "nextSightingId",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "nextTokenId",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "ownerOf",
          inputs: [
            {
              name: "tokenId",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [
            {
              name: "",
              type: "address",
              internalType: "address",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "pets",
          inputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [
            {
              name: "tokenId",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "name",
              type: "string",
              internalType: "string",
            },
            {
              name: "breed",
              type: "string",
              internalType: "string",
            },
            {
              name: "color",
              type: "string",
              internalType: "string",
            },
            {
              name: "description",
              type: "string",
              internalType: "string",
            },
            {
              name: "imageURI",
              type: "string",
              internalType: "string",
            },
            {
              name: "owner",
              type: "address",
              internalType: "address",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "reportLost",
          inputs: [
            {
              name: "tokenId",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "latitude",
              type: "int256",
              internalType: "int256",
            },
            {
              name: "longitude",
              type: "int256",
              internalType: "int256",
            },
          ],
          outputs: [],
          stateMutability: "payable",
        },
        {
          type: "function",
          name: "resolveFound",
          inputs: [
            {
              name: "tokenId",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "rewardPool",
          inputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "safeTransferFrom",
          inputs: [
            {
              name: "from",
              type: "address",
              internalType: "address",
            },
            {
              name: "to",
              type: "address",
              internalType: "address",
            },
            {
              name: "tokenId",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "safeTransferFrom",
          inputs: [
            {
              name: "from",
              type: "address",
              internalType: "address",
            },
            {
              name: "to",
              type: "address",
              internalType: "address",
            },
            {
              name: "tokenId",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "data",
              type: "bytes",
              internalType: "bytes",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "setApprovalForAll",
          inputs: [
            {
              name: "operator",
              type: "address",
              internalType: "address",
            },
            {
              name: "approved",
              type: "bool",
              internalType: "bool",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "sightingList",
          inputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [
            {
              name: "user",
              type: "address",
              internalType: "address",
            },
            {
              name: "owner",
              type: "address",
              internalType: "address",
            },
            {
              name: "sighting",
              type: "tuple",
              internalType: "struct YourContract.Sighting",
              components: [
                {
                  name: "sightingId",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "latitude",
                  type: "int256",
                  internalType: "int256",
                },
                {
                  name: "longitude",
                  type: "int256",
                  internalType: "int256",
                },
                {
                  name: "description",
                  type: "string",
                  internalType: "string",
                },
                {
                  name: "imageURI",
                  type: "string",
                  internalType: "string",
                },
              ],
            },
            {
              name: "isVerified",
              type: "bool",
              internalType: "bool",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "sightingUsers",
          inputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [
            {
              name: "",
              type: "address",
              internalType: "address",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "sightings",
          inputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "",
              type: "address",
              internalType: "address",
            },
          ],
          outputs: [
            {
              name: "sightingId",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "latitude",
              type: "int256",
              internalType: "int256",
            },
            {
              name: "longitude",
              type: "int256",
              internalType: "int256",
            },
            {
              name: "description",
              type: "string",
              internalType: "string",
            },
            {
              name: "imageURI",
              type: "string",
              internalType: "string",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "supportsInterface",
          inputs: [
            {
              name: "interfaceId",
              type: "bytes4",
              internalType: "bytes4",
            },
          ],
          outputs: [
            {
              name: "",
              type: "bool",
              internalType: "bool",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "symbol",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "string",
              internalType: "string",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "tokenURI",
          inputs: [
            {
              name: "tokenId",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [
            {
              name: "",
              type: "string",
              internalType: "string",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "transferFrom",
          inputs: [
            {
              name: "from",
              type: "address",
              internalType: "address",
            },
            {
              name: "to",
              type: "address",
              internalType: "address",
            },
            {
              name: "tokenId",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "updateSightings",
          inputs: [
            {
              name: "tokenId",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "latitude",
              type: "int256",
              internalType: "int256",
            },
            {
              name: "longitude",
              type: "int256",
              internalType: "int256",
            },
            {
              name: "description",
              type: "string",
              internalType: "string",
            },
            {
              name: "imageURI",
              type: "string",
              internalType: "string",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "verifications",
          inputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [
            {
              name: "",
              type: "address",
              internalType: "address",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "verifiedSightings",
          inputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [
            {
              name: "",
              type: "bool",
              internalType: "bool",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "verifySighting",
          inputs: [
            {
              name: "tokenId",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "sightingId",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "event",
          name: "Approval",
          inputs: [
            {
              name: "owner",
              type: "address",
              indexed: true,
              internalType: "address",
            },
            {
              name: "approved",
              type: "address",
              indexed: true,
              internalType: "address",
            },
            {
              name: "tokenId",
              type: "uint256",
              indexed: true,
              internalType: "uint256",
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "ApprovalForAll",
          inputs: [
            {
              name: "owner",
              type: "address",
              indexed: true,
              internalType: "address",
            },
            {
              name: "operator",
              type: "address",
              indexed: true,
              internalType: "address",
            },
            {
              name: "approved",
              type: "bool",
              indexed: false,
              internalType: "bool",
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "BatchMetadataUpdate",
          inputs: [
            {
              name: "_fromTokenId",
              type: "uint256",
              indexed: false,
              internalType: "uint256",
            },
            {
              name: "_toTokenId",
              type: "uint256",
              indexed: false,
              internalType: "uint256",
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "MetadataUpdate",
          inputs: [
            {
              name: "_tokenId",
              type: "uint256",
              indexed: false,
              internalType: "uint256",
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "PetMinted",
          inputs: [
            {
              name: "tokenId",
              type: "uint256",
              indexed: true,
              internalType: "uint256",
            },
            {
              name: "owner",
              type: "address",
              indexed: false,
              internalType: "address",
            },
            {
              name: "name",
              type: "string",
              indexed: false,
              internalType: "string",
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "PetReportedLost",
          inputs: [
            {
              name: "tokenId",
              type: "uint256",
              indexed: true,
              internalType: "uint256",
            },
            {
              name: "latitude",
              type: "int256",
              indexed: false,
              internalType: "int256",
            },
            {
              name: "longitude",
              type: "int256",
              indexed: false,
              internalType: "int256",
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "PetSighted",
          inputs: [
            {
              name: "tokenId",
              type: "uint256",
              indexed: true,
              internalType: "uint256",
            },
            {
              name: "user",
              type: "address",
              indexed: true,
              internalType: "address",
            },
            {
              name: "latitude",
              type: "int256",
              indexed: false,
              internalType: "int256",
            },
            {
              name: "longitude",
              type: "int256",
              indexed: false,
              internalType: "int256",
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "PetVerified",
          inputs: [
            {
              name: "tokenId",
              type: "uint256",
              indexed: true,
              internalType: "uint256",
            },
            {
              name: "verifier",
              type: "address",
              indexed: true,
              internalType: "address",
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "RewardDistributed",
          inputs: [
            {
              name: "tokenId",
              type: "uint256",
              indexed: true,
              internalType: "uint256",
            },
            {
              name: "totalReward",
              type: "uint256",
              indexed: false,
              internalType: "uint256",
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "SightingVerified",
          inputs: [
            {
              name: "tokenId",
              type: "uint256",
              indexed: true,
              internalType: "uint256",
            },
            {
              name: "sightingId",
              type: "uint256",
              indexed: false,
              internalType: "uint256",
            },
            {
              name: "verifier",
              type: "address",
              indexed: false,
              internalType: "address",
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "Transfer",
          inputs: [
            {
              name: "from",
              type: "address",
              indexed: true,
              internalType: "address",
            },
            {
              name: "to",
              type: "address",
              indexed: true,
              internalType: "address",
            },
            {
              name: "tokenId",
              type: "uint256",
              indexed: true,
              internalType: "uint256",
            },
          ],
          anonymous: false,
        },
        {
          type: "error",
          name: "ERC721IncorrectOwner",
          inputs: [
            {
              name: "sender",
              type: "address",
              internalType: "address",
            },
            {
              name: "tokenId",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "owner",
              type: "address",
              internalType: "address",
            },
          ],
        },
        {
          type: "error",
          name: "ERC721InsufficientApproval",
          inputs: [
            {
              name: "operator",
              type: "address",
              internalType: "address",
            },
            {
              name: "tokenId",
              type: "uint256",
              internalType: "uint256",
            },
          ],
        },
        {
          type: "error",
          name: "ERC721InvalidApprover",
          inputs: [
            {
              name: "approver",
              type: "address",
              internalType: "address",
            },
          ],
        },
        {
          type: "error",
          name: "ERC721InvalidOperator",
          inputs: [
            {
              name: "operator",
              type: "address",
              internalType: "address",
            },
          ],
        },
        {
          type: "error",
          name: "ERC721InvalidOwner",
          inputs: [
            {
              name: "owner",
              type: "address",
              internalType: "address",
            },
          ],
        },
        {
          type: "error",
          name: "ERC721InvalidReceiver",
          inputs: [
            {
              name: "receiver",
              type: "address",
              internalType: "address",
            },
          ],
        },
        {
          type: "error",
          name: "ERC721InvalidSender",
          inputs: [
            {
              name: "sender",
              type: "address",
              internalType: "address",
            },
          ],
        },
        {
          type: "error",
          name: "ERC721NonexistentToken",
          inputs: [
            {
              name: "tokenId",
              type: "uint256",
              internalType: "uint256",
            },
          ],
        },
      ],
      inheritedFunctions: {},
      deploymentFile: "run-1741318807.json",
      deploymentScript: "Deploy.s.sol",
    },
  },
} as const;

export default deployedContracts satisfies GenericContractsDeclaration;
