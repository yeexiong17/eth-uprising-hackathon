"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { AuthGuard } from "~~/components/AuthGuard";
import { MintPetModal } from "~~/components/pet-finder/MintPetModal";
import { PetNFTCard } from "~~/components/pet-finder/PetNFTCard";
import { useUserMintedPets, Pet } from "~~/hooks/useGraphQueries";

interface PetNFT {
  tokenId: string;
  name: string;
  breed: string;
  color: string;
  description: string;
  imageURI: string;
}

const MyPetsPage = () => {
  const { address } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [myPets, setMyPets] = useState<PetNFT[]>([]);

  const { data: petsData, isLoading } = useUserMintedPets(address || "");

  useEffect(() => {
    console.log('Raw pets data:', petsData);
    if (!isLoading && petsData?.pets) {
      console.log('User pets data:', petsData.pets);
      const formattedPets = petsData.pets.map((pet: Pet) => ({
        tokenId: pet.tokenId.toString(),
        name: pet.name,
        breed: pet.breed,
        color: pet.color,
        description: pet.description,
        imageURI: pet.imageURI,
      }));

      console.log('Formatted pets:', formattedPets);
      setMyPets(formattedPets);
    }
  }, [petsData, isLoading]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-white py-4 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col justify-between items-center gap-2">
            <div className="flex-1">
              <div className="flex flex-col justify-center items-center gap-3">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  My Pet Collection
                </h1>
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                  {myPets.length} Pets
                </span>
              </div>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="btn btn-primary gap-2 mt-2">
              <PlusCircleIcon className="h-5 w-5" />
              Mint New Pet
            </button>
          </div>
        </div>
      </div>

      {/* Pet NFT Grid Section */}
      <div className="container mx-auto px-4 py-6">
        {myPets.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {myPets.map(pet => (
              <PetNFTCard key={pet.tokenId} pet={pet} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-bold mb-2">No Pets Found</h3>
              <p className="text-sm text-gray-600 mb-4">
                You haven&#39;t minted any pet NFTs yet. Start by creating your first digital pet!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Mint Modal */}
      {isModalOpen && <MintPetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

const ProtectedHomePage = () => {
  return (
    <AuthGuard requireAuth={true}>
      <MyPetsPage />
    </AuthGuard>
  );
};

export default ProtectedHomePage;
