import deployedContracts from "../contracts/deployedContracts"; // Adjust the path as necessary
import { useScaffoldReadContract, useScaffoldWriteContract } from "../hooks/scaffold-eth";

const chainId = 534351; // Replace with your actual chain ID
const contractDetails = deployedContracts[chainId].YourContract;

export const useYourContract = () => {
    const { read: readContract } = useScaffoldReadContract({
        contractName: "YourContract",
        contractAddress: contractDetails.address,
        abi: contractDetails.abi,
    });

    const { write: writeContract } = useScaffoldWriteContract({
        contractName: "YourContract",
        contractAddress: contractDetails.address,
        abi: contractDetails.abi,
    });

    const mintPetNFT = async (name, breed, color, description, imageURI) => {
        const tx = await writeContract("mintPetNFT", [name, breed, color, description, imageURI]);
        await tx.wait();
    };

    const getPetDetails = async (tokenId) => {
        const details = await readContract("getPetDetails", [tokenId]);
        return details;
    };

    const reportLost = async (tokenId, reward) => {
        const tx = await writeContract("reportLost", [tokenId], { value: reward });
        await tx.wait();
    };

    const updateSightings = async (tokenId, location) => {
        const tx = await writeContract("updateSightings", [tokenId, location]);
        await tx.wait();
    };

    const resolveFound = async (tokenId) => {
        const tx = await writeContract("resolveFound", [tokenId]);
        await tx.wait();
    };

    return { mintPetNFT, getPetDetails, reportLost, updateSightings, resolveFound };
};
