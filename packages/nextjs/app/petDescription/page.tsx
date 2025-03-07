"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Map, { Marker } from "react-map-gl/mapbox";
import { useAccount } from "wagmi";
import { AuthGuard } from "~~/components/AuthGuard";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface PetData {
  tokenId: string; // Assuming tokenId is a bigint
  name: string;
  breed: string;
  color: string;
  description: string;
  imageUrl: string; // Ensure this matches the property returned
  latitude: number; // Assuming latitude is stored as bigint
  longitude: number; // Assuming longitude is stored as bigint
  isLost: boolean;
  reward: number; // Assuming reward is stored as bigint
  owner: string;
}

interface FoundPets {
  sightingId: number;
  petId: string;
  user: string;
  latitude: number;
  longitude: number;
  description: string;
  imageUrl: string;
  isVerified: boolean;
  owner: string;
}

const PetDescription = () => {
  const { writeContract } = useScaffoldWriteContract({ contractName: "YourContract" });
  const { address: account } = useAccount();
  const searchParams = useSearchParams();
  const petId = searchParams.get("id");
  const router = useRouter();

  const [pet, setPet] = useState<PetData | null>(null);
  const [foundPets, setFoundPets] = useState<FoundPets[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    color: "",
    lastSeen: "",
    description: "",
    location: { lat: 0, lng: 0 },
    prizeAmount: 0,
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [verifiedPets, setVerifiedPets] = useState<number[]>([]);
  const [rewardAmount, setRewardAmount] = useState(100); // Example total reward amount
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const geocoderRef = useRef<MapboxGeocoder | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

  const { data: petsData } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "getLostPet",
    args: [BigInt(petId!)],
    watch: true,
  });

  const { data: sightingsData } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "getSightings",
    args: [BigInt(petId!)],
    watch: true,
  });

  useEffect(() => {
    if (!petId) return;
    setPet(null); // Reset pet before fetching new data

    if (petsData && petsData.length > 0) {
      console.log(petsData);
      const formattedPets = {
        tokenId: Number(petsData[0]).toString(),
        name: petsData[1],
        breed: petsData[2],
        color: petsData[3],
        description: petsData[4],
        imageUrl: petsData[5],
        latitude: Number(petsData[9]) / 100000,
        longitude: Number(petsData[10]) / 100000,
        isLost: petsData[7],
        reward: Number(petsData[8]) / 10 ** 18,
        owner: petsData[6],
      };

      setPet(formattedPets);
    }
  }, [petsData]);

  useEffect(() => {
    if (!petId) return;
    setFoundPets([]); // Reset pet before fetching new data

    if (sightingsData && sightingsData.length > 0) {
      console.log(sightingsData);
      const formattedPets = sightingsData.map(pet => ({
        sightingId: Number(pet.sighting.sightingId),
        petId: petId,
        user: pet.user,
        description: pet.sighting.description,
        imageUrl: pet.sighting.imageURI,
        latitude: Number(pet.sighting.latitude) / 100000,
        longitude: Number(pet.sighting.longitude) / 100000,
        isVerified: pet.isVerified,
        owner: pet.owner,
      }));

      console.log(formattedPets);

      setFoundPets(formattedPets);
    }
  }, [sightingsData]);

  const handleVerify = async (isVerified: boolean, sightingId: number) => {
    if (isVerified) return;

    const result = await writeContract({
      functionName: "verifySighting",
      args: [BigInt(petId!), BigInt(sightingId)],
    });

    console.log("result", result);
  };

  const [isPetFound, setIsPetFound] = useState(() => {
    return localStorage.getItem(`petFound_${petId}`) === "true";
  });

  const handleDistributeRewards = async () => {
    alert("Are you sure you want to distribute the reward?");

    try {
      const result = await writeContract({
        functionName: "resolveFound",
        args: [BigInt(petId!)],
      });
      console.log("result", result);
      alert(`Reward has been distributed to each verified user!`);

      // Route to /home after successful distribution
      router.push("/home");
    } catch (error) {
      console.error("Error distributing rewards:", error);
    }
  };

  useEffect(() => {
    if (!modalOpen || !mapContainerRef.current) return;

    // Remove old Mapbox instance before creating a new one
    if (mapRef.current) {
      mapRef.current.remove();
    }

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [101.7118, 3.2003], // Default center (Malaysia)
      zoom: 12,
    });

    geocoderRef.current = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken || "",
      mapboxgl: mapboxgl as any,
      placeholder: "Search for a location...",
      marker: false,
    });

    const geocoderContainer = document.getElementById("geocoder-container");
    if (geocoderContainer) {
      geocoderContainer.innerHTML = ""; // Clear previous geocoder
      geocoderContainer.appendChild(geocoderRef.current.onAdd(mapRef.current));
    }

    geocoderRef.current.on("result", e => {
      const { center, place_name } = e.result;
      if (center) {
        const [lng, lat] = center;
        setFormData(prev => ({ ...prev, lastSeen: place_name, location: { lat, lng } }));
        mapRef.current?.flyTo({ center: [lng, lat], zoom: 14 });

        if (markerRef.current) markerRef.current.remove();
        markerRef.current = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(mapRef.current!);
      }
    });

    // Update the onClick event to set the location
    mapRef.current.on("click", e => {
      const { lng, lat } = e.lngLat;
      setFormData(prev => ({
        ...prev,
        lastSeen: `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`,
        location: { lat, lng },
      }));

      if (markerRef.current) markerRef.current.remove();
      markerRef.current = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(mapRef.current!);
    });

    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, [modalOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => setPreviewUrl(reader.result as string);
    }
  };

  const handleSubmitFoundPet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.location.lat || !formData.location.lng) return alert("Please select a valid location.");
    if (!selectedImage) return alert("Please upload an image of the pet.");

    const uploadData = new FormData();
    if (selectedImage) {
      uploadData.append("file", selectedImage);
    } else {
      console.error("No image selected for upload.");
      return;
    }

    const pinataToken = process.env.NEXT_PUBLIC_PINATA_TOKEN; // Use the token if needed

    try {
      const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${pinataToken}`,
        },
        body: uploadData,
      });

      const data = await response.json();
      if (response.ok) {
        const ipfsHash = data.IpfsHash; // Get the IPFS URL
        console.log("Image uploaded successfully:", ipfsHash);

        // Step 2: Prepare metadata for the NFT
        const name = formData.name;
        const breed = formData.breed;
        const color = formData.color;
        const description = formData.description;
        const imageURI = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

        const latitude = Math.floor(formData.location.lat * 100000); // Convert to integer
        const longitude = Math.floor(formData.location.lng * 100000); // Convert to integer

        // Step 3: Call the smart contract to mint the NFT
        const result = await writeContract({
          functionName: "updateSightings",
          args: [BigInt(petId!), BigInt(latitude), BigInt(longitude), description, imageURI],
        });
        console.log("result", result);
        // Step 4: Call onMintSuccess with the new pet data
        router.push("/home");
      } else {
        console.error("Error uploading image:", data);
      }
    } catch (error) {
      console.error("Error uploading to Pinata:", error);
    }
  };

  const handleLocationClick = (latitude: number, longitude: number) => {
    setSelectedLocation({ lat: latitude, lng: longitude });
  };

  const truncateAddress = (address: string) => {
    if (address.length <= 10) return address; // Return the full address if it's short
    return `${address.slice(0, 6)}...${address.slice(-4)}`; // Truncate to first 6 and last 4 characters
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="bg-white py-4 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col justify-center items-center gap-3">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Pet Details
            </h1>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row items-center w-full">
        {/* 🔹 Pet Image */}
        <img src={pet?.imageUrl} alt={pet?.name} className="w-full h-40 object-contain rounded-md border" />

        {/* 🔹 Pet Info */}
        <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left flex-grow">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">{pet?.name}</h2>
          <p className="text-gray-700">🐕 Breed: {pet?.breed}</p>
          <p className="text-gray-700">🎨 Color: {pet?.color}</p>
          <p className="text-gray-700">📝 {pet?.description}</p>
          <p className="text-gray-700 font-semibold">💰 Prize: {pet?.reward} ETH</p>
        </div>

        <div className="mt-4 md:mt-0 flex flex-col space-y-4">
          {/* ✅ "Report a Found Pet" button - Disabled if pet is found */}
          <button
            onClick={() => setModalOpen(true)}
            disabled={isPetFound}
            className={`px-6 py-3 text-lg font-semibold rounded-lg shadow-md transition-all duration-200 ${isPetFound
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600 text-white hover:shadow-lg"
              }`}
          >
            📝 Report a Found Pet
          </button>

          {/* ✅ "Pet Found - Distribute Reward" button - Disabled after clicking */}
          <button
            onClick={() => handleDistributeRewards()}
            disabled={pet?.owner === account ? false : true}
            className={`${pet?.owner === account ? "bg-purple-500 hover:bg-purple-600 text-white hover:shadow-lg" : "bg-gray-400 text-white cursor-not-allowed"} px-6 py-3 text-lg font-semibold rounded-lg shadow-md transition-all duration-200`}
          >
            🎉 Pet Found - Distribute Reward
          </button>
        </div>
      </div>

      {/* 🐾 Reporting Found Pets */}
      <h2 className="text-xl md:text-2xl font-semibold text-green-600 mt-6">🐾 Reporting Found Pets</h2>

      {foundPets.length > 0 ? (
        foundPets.map((foundPet, index) => (
          <div key={index} className="bg-gray-50 p-4 mt-4 rounded-md shadow flex flex-col md:flex-row items-center">
            {/* 🐾 Pet Image */}
            <img src={foundPet.imageUrl} alt="Found Pet" className="w-32 h-32 object-cover rounded-md border" />

            {/* 🐾 Pet Details */}
            <div className="ml-0 md:ml-4 flex-grow mt-2 md:mt-0">
              <p className="text-gray-700">
                📍 Found At: {foundPet.latitude}, {foundPet.longitude}
              </p>
              <p className="text-gray-700">👤 User Address: {truncateAddress(foundPet.user)}</p>
              <p className="text-gray-700">📝 Description: {foundPet.description}</p>
              <div className="flex justify-center mt-2">
                <button
                  onClick={() => handleLocationClick(foundPet.latitude, foundPet.longitude)}
                  className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition"
                >
                  View on Map
                </button>
              </div>
            </div>

            {/* 🔹 Verify Button */}
            <button
              onClick={() => handleVerify(foundPet.isVerified, foundPet.sightingId)}
              disabled={foundPet.isVerified || foundPet.owner !== account}
              className={`mt-4 ml-0 md:ml-4 px-6 py-3 text-lg font-semibold rounded-lg shadow-md transition-all duration-200 ${foundPet.isVerified || foundPet.owner !== account
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
            >
              {foundPet.isVerified ? "Verified ✅" : "Verify"}
            </button>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No found pets reported yet.</p>
      )}

      {/* Map Display */}
      {selectedLocation && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Location Map</h2>
            <div className="h-64 w-full">
              <Map
                initialViewState={{
                  longitude: selectedLocation.lng,
                  latitude: selectedLocation.lat,
                  zoom: 12,
                }}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
              >
                <Marker longitude={selectedLocation.lng} latitude={selectedLocation.lat} />
              </Map>
            </div>
            <button onClick={() => setSelectedLocation(null)} className="mt-4 bg-red-500 text-white py-2 px-4 rounded">
              Close Map
            </button>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">🐾 Report a Found Pet</h2>

            {/* Close Button */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl font-bold"
            >
              ✕
            </button>

            {/* Scrollable Content */}
            <div className="overflow-y-auto max-h-[75vh] px-2">
              <form className="space-y-6">
                {/* Image Upload */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700">Pet Image</span>
                  </label>
                  <div className="flex flex-col items-center space-y-4">
                    {previewUrl ? (
                      <div className="relative w-full max-w-sm">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-48 object-contain rounded-md shadow-md"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedImage(null);
                            setPreviewUrl(null);
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-100 transition">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <p className="mb-2 text-sm text-gray-500">Click to upload</p>
                          <p className="text-xs text-gray-500">PNG, JPG, JPEG</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/png, image/jpeg, image/jpg"
                          onChange={handleImageChange}
                          required
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Last Seen Location */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700">Last Seen Location</span>
                  </label>
                  <div id="geocoder-container" className="mb-2"></div>
                  <input
                    type="text"
                    name="lastSeen"
                    value={formData.lastSeen}
                    readOnly
                    className="input input-bordered w-full rounded-md shadow-sm cursor-not-allowed text-gray-900 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    required
                  />
                  <div className="mt-2 h-64 rounded-md border border-gray-300 overflow-hidden">
                    <div ref={mapContainerRef} className="w-full h-full"></div>
                  </div>
                </div>

                {/* Description */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700">Description</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Provide additional details (age, distinctive marks, behavior, etc.)"
                    className="textarea textarea-bordered w-full h-32 rounded-md shadow-sm text-gray-900 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="form-control mt-6">
                  <button
                    onClick={handleSubmitFoundPet}
                    type="submit"
                    className="btn bg-blue-500 hover:bg-blue-600 text-white font-semibold w-full py-2 rounded-md shadow-md"
                  >
                    Upload Report
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default () => (
  <AuthGuard requireAuth={true}>
    <PetDescription />
  </AuthGuard>
);
