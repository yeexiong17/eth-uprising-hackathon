"use client";

import type { NextPage } from "next";
import { useState } from "react";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

const PetDescription: NextPage = () => {
  // Sample data for reported found pets (Replace with real data later)
  const [foundPets, setFoundPets] = useState([
    {
      id: 1,
      name: "Golden Retriever",
      breed: "Golden Retriever (Possible)",
      color: "Golden, Has a pet necklace",
      lastSeen: "Brooklyn Bridge, NY",
      image: "/2.avif",
      reporter: "0x123...abcd", // Mock wallet address
    },
    {
      id: 2,
      name: "Husky",
      breed: "Siberian Husky",
      color: "Black & White",
      lastSeen: "Times Square, NY",
      image: "/3.webp",
      reporter: "0x456...efgh",
    },
    {
      id: 3,
      name: "German Shepherd",
      breed: "German Shepherd (Possible)",
      color: "Brown & Black",
      lastSeen: "Central Park, NY",
      image: "/4.avif",
      reporter: "0x789...ijkl",
    },
  ]);

  // State to track verified pets
  const [verifiedPets, setVerifiedPets] = useState<number[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  // Function to handle verification
  const handleVerify = (id: number) => {
    if (!verifiedPets.includes(id)) {
      setVerifiedPets((prev) => [...prev, id]); // Add pet ID to verified list
    }
  };

  // Handle "I Found My Dog" click
  const handleFoundMyDog = () => {
    setModalOpen(true);
  };

  // Calculate Prize Distribution (e.g., 100 USDC total)
  const totalPrize = 100;
  const verifiedReporters = foundPets.filter((pet) =>
    verifiedPets.includes(pet.id)
  );
  const prizePerPerson =
    verifiedReporters.length > 0
      ? totalPrize / verifiedReporters.length
      : 0;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      {/* Wallet Connection Button */}
      <div className="flex justify-end mb-4">
        <RainbowKitCustomConnectButton />
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">
        Report Lost & Found Pets
      </h1>

      {/* Reporting a Lost Pet Section */}
      <div className="bg-white shadow-md rounded-lg p-4 md:p-6 mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-red-600 mb-4">
          🐾 Reporting a Lost Pet
        </h2>
        <div className="flex flex-col md:flex-row items-center md:items-start">
          {/* Pet Image */}
          <img
            src="/1.jpeg"
            alt="Lost Pet"
            className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-lg border border-gray-300"
          />
          {/* Pet Details */}
          <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left">
            <p className="text-lg font-medium">
              🐶 Pet Name: <span className="font-semibold">Buddy</span>
            </p>
            <p className="text-gray-700">🐕 Breed: Golden Retriever</p>
            <p className="text-gray-700">
              🎨 Color: Golden, Got a pet necklace, a black mole on his tail
            </p>
            <p className="text-gray-700">📍 Last Seen: Central Park, NY</p>
          </div>
          {/* "I Found My Dog" Button */}
          {verifiedPets.length > 0 && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleFoundMyDog}
                className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition"
              >
                I Found My Dog 🎉
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reporting a Found Pet List */}
      <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-semibold text-green-600 mb-4">
          🐾 Reporting Found Pets
        </h2>
        {foundPets.map((pet) => (
          <div
            key={pet.id}
            className="flex flex-col md:flex-row items-center md:items-start bg-gray-50 shadow-sm rounded-md p-4 mb-4"
          >
            {/* Pet Image */}
            <img
              src={pet.image}
              alt="Found Pet"
              className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-lg border border-gray-300"
            />
            {/* Pet Details */}
            <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left flex-grow">
              <p className="text-lg font-medium">
                🐶 Pet Found: <span className="font-semibold">{pet.name}</span>
              </p>
              <p className="text-gray-700">🐕 Breed: {pet.breed}</p>
              <p className="text-gray-700">🎨 Color: {pet.color}</p>
              <p className="text-gray-700">📍 Found At: {pet.lastSeen}</p>
            </div>
            {/* Verify Button */}
            <button
              onClick={() => handleVerify(pet.id)}
              disabled={verifiedPets.includes(pet.id)}
              className={`mt-4 md:mt-0 px-4 py-2 font-semibold rounded-md shadow-md transition 
                ${verifiedPets.includes(pet.id)
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
            >
              {verifiedPets.includes(pet.id) ? "Verified ✅" : "Verify"}
            </button>
          </div>
        ))}
      </div>

      {/* Success Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <h2 className="text-xl font-semibold text-green-600">
              🎉 Pet Found Successful!
            </h2>
            <p className="text-gray-700 mt-2">
              The prize has been distributed to the verified reporters.
            </p>
            <div className="mt-4">
              <h3 className="font-semibold text-gray-800">Prize Distribution</h3>
              <ul className="text-gray-700 mt-2">
                {verifiedReporters.map((pet) => (
                  <li key={pet.id}>
                    {pet.reporter} - {prizePerPerson.toFixed(2)} USDC
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => setModalOpen(false)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetDescription;
