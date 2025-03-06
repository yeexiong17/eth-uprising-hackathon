"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { AuthGuard } from "~~/components/AuthGuard";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

const PetDescription = () => {
  const searchParams = useSearchParams();
  const petId = searchParams.get("id");

  const [pet, setPet] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [foundPets, setFoundPets] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    color: "",
    lastSeen: "",
    description: "",
    location: { lat: null, lng: null },
    prizeAmount: 0,
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [verifiedPets, setVerifiedPets] = useState([]);
   const [rewardAmount, setRewardAmount] = useState(100); // Example total reward amount
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const geocoderRef = useRef<MapboxGeocoder | null>(null);

  useEffect(() => {
    if (!petId) return;

    // Fetch pet details
    const storedPetsJSON = localStorage.getItem("petData");
    const storedPets = storedPetsJSON ? JSON.parse(storedPetsJSON).pets : [];
    const foundPet = storedPets.find((p) => p.id.toString() === petId);
    if (foundPet) setPet(foundPet);

    // Fetch found pets for this pet
    const storedFoundPetsJSON = localStorage.getItem(`foundPets_${petId}`);
    if (storedFoundPetsJSON) {
      setFoundPets(JSON.parse(storedFoundPetsJSON));
    }

    // Fetch verified pets
    const storedVerifiedPetsJSON = localStorage.getItem(`verifiedPets_${petId}`);
    if (storedVerifiedPetsJSON) {
      setVerifiedPets(JSON.parse(storedVerifiedPetsJSON));
    }
  }, [petId]);

  const handleVerify = (foundPetId) => {
    if (verifiedPets.includes(foundPetId)) return;

    const updatedVerifiedPets = [...verifiedPets, foundPetId];
    setVerifiedPets(updatedVerifiedPets);
    localStorage.setItem(`verifiedPets_${petId}`, JSON.stringify(updatedVerifiedPets));
  };

  const [isPetFound, setIsPetFound] = useState(() => {
    return localStorage.getItem(`petFound_${petId}`) === "true";
  });
  
  const handleDistributeRewards = () => {
    if (verifiedPets.length === 0) return;
  
    const amountPerUser = rewardAmount / verifiedPets.length;
    alert(`Reward of ${amountPerUser} ETH has been distributed to each verified user!`);
  
    // ✅ Disable both buttons after pet is found
    setIsPetFound(true);
    localStorage.setItem(`petFound_${petId}`, "true"); // 🔥 Save to localStorage
  
    updatePetStatus();
  };
  
  // ✅ Restore pet found status on page load
  useEffect(() => {
    const storedPetFound = localStorage.getItem(`petFound_${petId}`);
    if (storedPetFound === "true") {
      setIsPetFound(true);
    }
  }, [petId]);
  


  const updatePetStatus = () => {
    const storedPetsJSON = localStorage.getItem("petData");
    if (!storedPetsJSON) return;

    const storedPets = JSON.parse(storedPetsJSON);
    const updatedPets = storedPets.pets.map((p) =>
      p.id.toString() === petId ? { ...p, status: "Found" } : p
    );

    // ✅ Save updated pet status to localStorage
    localStorage.setItem("petData", JSON.stringify({ pets: updatedPets }));

    // ✅ Update UI
    setPet((prevPet) => prevPet ? { ...prevPet, status: "Found" } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.location.lat || !formData.location.lng) return alert("Please select a valid location.");
    if (!selectedImage) return alert("Please upload an image of the pet.");

    const imageBase64 = await convertImageToBase64(selectedImage);

    const newFoundPet = {
      id: Date.now().toString(),
      name: formData.name,
      breed: formData.breed,
      color: formData.color,
      lastSeen: formData.lastSeen,
      latitude: formData.location.lat,
      longitude: formData.location.lng,
      image: imageBase64,
      description: formData.description,
      prizeAmount: pet?.prizeAmount || 0, // Use the original pet's prize amount
    };

    // 🔥 Retrieve the existing found pets for this specific pet
    const storedFoundPetsJSON = localStorage.getItem(`foundPets_${petId}`);
    const storedFoundPets = storedFoundPetsJSON ? JSON.parse(storedFoundPetsJSON) : [];

    // 🔥 Add the new found pet ONLY to this specific pet's list
    const updatedFoundPets = [...storedFoundPets, newFoundPet];
    localStorage.setItem(`foundPets_${petId}`, JSON.stringify(updatedFoundPets));

    // ✅ Update state only for this pet's found reports
    setFoundPets(updatedFoundPets);

    // Reset form and close modal
    setModalOpen(false);
    setFormData({ name: "", breed: "", color: "", lastSeen: "", description: "", location: { lat: null, lng: null }, prizeAmount: 0 });
    setPreviewUrl(null);
    setSelectedImage(null);
  };


  useEffect(() => {
    if (!modalOpen || !mapContainerRef.current) return;

    // 🔥 Remove old Mapbox instance before creating a new one
    if (mapRef.current) {
      mapRef.current.remove();
    }

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [101.7118, 3.2003],
      zoom: 12,
    });

    geocoderRef.current = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      placeholder: "Search for a location...",
      marker: false,
    });

    const geocoderContainer = document.getElementById("geocoder-container");
    if (geocoderContainer) {
      geocoderContainer.innerHTML = ""; // Clear previous geocoder
      geocoderContainer.appendChild(geocoderRef.current.onAdd(mapRef.current));
    }

    geocoderRef.current.on("result", (e) => {
      const { center, place_name } = e.result;
      if (center) {
        const [lng, lat] = center;
        setFormData((prev) => ({ ...prev, lastSeen: place_name, location: { lat, lng } }));
        mapRef.current?.flyTo({ center: [lng, lat], zoom: 14 });

        if (markerRef.current) markerRef.current.remove();
        markerRef.current = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(mapRef.current);
      }
    });

    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, [modalOpen]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => setPreviewUrl(reader.result as string);
    }
  };


  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
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
        <img
          src={pet?.image || "/placeholder.jpg"}
          alt={pet?.name}
          className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-md border"
        />

        {/* 🔹 Pet Info */}
        <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left flex-grow">
          <h2 className="text-xl md:text-2xl font-semibold">{pet?.name}</h2>
          <p className="text-gray-700">🐕 Breed: {pet?.breed}</p>
          <p className="text-gray-700">🎨 Color: {pet?.color}</p>
          <p className="text-gray-700">📍 Last Seen: {pet?.lastSeen}</p>
          <p className="text-gray-700">📝 {pet?.description}</p>
          <p className="text-gray-700 font-semibold">💰 Prize: {pet?.prizeAmount} ETH</p>
        </div>

        <div className="mt-4 md:mt-0 flex flex-col space-y-4">
  {/* ✅ "Report a Found Pet" button - Disabled if pet is found */}
  <button
    onClick={() => setModalOpen(true)}
    disabled={isPetFound}
    className={`px-6 py-3 text-lg font-semibold rounded-lg shadow-md transition-all duration-200 ${
      isPetFound
        ? "bg-gray-400 text-white cursor-not-allowed"
        : "bg-green-500 hover:bg-green-600 text-white hover:shadow-lg"
    }`}
  >
    📝 Report a Found Pet
  </button>

  {/* ✅ "Pet Found - Distribute Reward" button - Disabled after clicking */}
  {verifiedPets.length > 0 && (
    <button
      onClick={handleDistributeRewards}
      disabled={isPetFound}
      className={`px-6 py-3 text-lg font-semibold rounded-lg shadow-md transition-all duration-200 ${
        isPetFound
          ? "bg-gray-400 text-white cursor-not-allowed"
          : "bg-purple-500 hover:bg-purple-600 text-white hover:shadow-lg"
      }`}
    >
      🎉 Pet Found - Distribute Reward
    </button>
  )}
</div>
      </div>


      {/* 🐾 Reporting Found Pets */}
      <h2 className="text-xl md:text-2xl font-semibold text-green-600 mt-6">
        🐾 Reporting Found Pets
      </h2>

      {foundPets.length === 0 ? (
        <p className="text-gray-500">No found pets reported yet.</p>
      ) : (
        foundPets.map((foundPet) => (
          <div key={foundPet.id} className="bg-gray-50 p-4 mt-4 rounded-md shadow flex items-center">
          {/* 🐾 Pet Image */}
          <img src={foundPet.image} alt="Found Pet" className="w-32 h-32 object-cover rounded-md border" />

          {/* 🐾 Pet Details */}
          <div className="ml-4 flex-grow">
            <p className="text-lg font-semibold">🐶 {foundPet.name}</p>
            <p className="text-gray-700">🐕 Breed: {foundPet.breed}</p>
            <p className="text-gray-700">🎨 Color: {foundPet.color}</p>
            <p className="text-gray-700">📍 Found At: {foundPet.lastSeen}</p>
            <p className="text-gray-700">📝 {foundPet.description}</p>
          </div>

          {/* 🔹 Verify Button - Moved to Right */}
          <button
              onClick={() => handleVerify(foundPet.id)}
              disabled={verifiedPets.includes(foundPet.id)}
              className={`ml-4 px-6 py-3 text-lg font-semibold rounded-lg shadow-md transition-all duration-200 hover:shadow-lg ${
                verifiedPets.includes(foundPet.id)
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {verifiedPets.includes(foundPet.id) ? "Verified ✅" : "Verify"}
            </button>
        </div>
        ))
      )}



      {/* Report Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
              🐾 Report a Found Pet
            </h2>

            {/* Close Button */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl font-bold"
            >
              ✕
            </button>

            {/* Scrollable Content */}
            <div className="overflow-y-auto max-h-[75vh] px-2">
              <form onSubmit={handleSubmit} className="space-y-6">
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
                          className="w-full h-48 object-cover rounded-md shadow-md"
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
                        <input type="file" className="hidden" accept="image/png, image/jpeg, image/jpg" onChange={handleImageChange} required />
                      </label>
                    )}
                  </div>
                </div>

                {/* Breed Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700">Pet Breed</span>
                  </label>
                  <input
                    type="text"
                    name="breed"
                    value={formData.breed}
                    onChange={handleInputChange}
                    placeholder="e.g., Golden Retriever"
                    className="input input-bordered w-full rounded-md shadow-sm"
                    required
                  />
                </div>

                {/* Color Input */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-gray-700">Pet Color</span>
                  </label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    placeholder="e.g., Golden Brown"
                    className="input input-bordered w-full rounded-md shadow-sm"
                    required
                  />
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
                    className="input input-bordered w-full rounded-md shadow-sm cursor-not-allowed"
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
                    className="textarea textarea-bordered w-full h-32 rounded-md shadow-sm"
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="form-control mt-6">
                  <button type="submit" className="btn bg-blue-500 hover:bg-blue-600 text-white font-semibold w-full py-2 rounded-md shadow-md">
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

export default () => <AuthGuard requireAuth={true}><PetDescription /></AuthGuard>;
