"use client";

import Link from "next/link";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  // Center of the map
  const mapCenter = { lat: 3.2003, lng: 101.7118 }; // Setapak, Kuala Lumpur

  // Sample pet locations
  const petLocations = [
    { id: 1, lat: 3.1965, lng: 101.7033, name: "Buddy" }, // Near TARC University College
    { id: 2, lat: 3.2023, lng: 101.7175, name: "Husky Found" }, // Near Wangsa Maju LRT
    { id: 3, lat: 3.2078, lng: 101.7290, name: "Shepherd Found" }, // Near Setapak Central Mall
    { id: 4, lat: 3.2105, lng: 101.7181, name: "Luna" }, // Near Columbia Asia Hospital
    { id: 5, lat: 3.1989, lng: 101.7132, name: "Milo" }, // Near Sri Utama International School
    { id: 6, lat: 3.2054, lng: 101.7229, name: "Snowy" }, // Near PV128 Mall
    { id: 7, lat: 3.1906, lng: 101.7057, name: "Rocky" }, // Near Melati Utama
    { id: 8, lat: 3.1942, lng: 101.7091, name: "Shadow" }, // Near Festival City Mall (Setapak Central)
    { id: 9, lat: 3.1998, lng: 101.7167, name: "Max" }, // Near Wangsa Walk Mall
    { id: 10, lat: 3.2084, lng: 101.7250, name: "Bella" }, // Near Sri Rampai LRT
  ];

  // Handle marker click -> Navigate to Pet Description Page
  const handleMarkerClick = (id) => {
    router.push(`/petDescription?id=${id}`);
  };

  // Load Google Maps API correctly
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">
        Lost & Found Pet Locations
      </h1>

      {/* Google Maps Integration */}
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "400px" }}
        center={mapCenter}
        zoom={12}
      >
        {petLocations.map((pet) => (
          <Marker
            key={pet.id}
            position={{ lat: pet.lat, lng: pet.lng }}
            onClick={() => handleMarkerClick(pet.id)}
          />
        ))}
      </GoogleMap>

      {/* Navigation Buttons */}
      <div className="flex gap-4 mt-6">
        <Link href="/petDescription">
          <button className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600">
            Go to Pet Description Page
          </button>
        </Link>

        <Link href="/upload">
          <button className="px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600">
            Go to Upload Page
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
