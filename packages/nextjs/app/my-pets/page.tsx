"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAccount } from "wagmi";
import { AuthGuard } from "~~/components/AuthGuard";

interface PetNFT {
  id: number;
  name: string;
  description: string;
  image: string;
  breed: string;
  age: string;
}

const MyPets = () => {
  const { address } = useAccount();
  const [pets, setPets] = useState<PetNFT[]>([]);

  if (!address) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-xl">Please connect your wallet to view your pets</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Pet Collection</h1>
        <Link
          href="/mint-pet"
          className="bg-primary hover:bg-primary-focus text-white font-bold py-2 px-4 rounded"
        >
          Mint New Pet
        </Link>
      </div>

      {pets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-4">You don't have any pet NFTs yet</p>
          <Link
            href="/mint-pet"
            className="text-primary hover:text-primary-focus underline"
          >
            Mint your first pet NFT
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <div
              key={pet.id}
              className="bg-base-100 rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{pet.name}</h2>
                <p className="text-gray-600 mb-2">Breed: {pet.breed}</p>
                <p className="text-gray-600 mb-2">Age: {pet.age}</p>
                <p className="text-gray-600 line-clamp-2">{pet.description}</p>
                <div className="mt-4">
                  <span className="text-sm text-gray-500">
                    Token ID: #{pet.id}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ProtectedHomePage = () => {
  return (
    <AuthGuard requireAuth={true}>
      <MyPets />
    </AuthGuard>
  );
};

export default ProtectedHomePage;
