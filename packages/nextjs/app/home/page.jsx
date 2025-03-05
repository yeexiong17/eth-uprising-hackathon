"use client";

import Link from "next/link";
import Map, { Marker, Popup } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useRouter } from "next/navigation";
import { useEffect } from 'react';
import { AuthGuard } from "~~/components/AuthGuard";
import { useState } from 'react';
import petData from "../../data/petData.json";

const Home = () => {
    const router = useRouter();
    const [selectedPet, setSelectedPet] = useState(null);
    const mapCenter = { latitude: 3.2003, longitude: 101.7118 };
    const [viewState, setViewState] = useState({
        ...mapCenter,
        zoom: 11.5
    });
    const [pets, setPets] = useState([]);

    useEffect(() => {
        const loadPetData = () => {
            try {
                // First try to get data from localStorage
                const storedPetsJSON = localStorage.getItem('petData');
                if (storedPetsJSON) {
                    const storedPets = JSON.parse(storedPetsJSON);
                    setPets(storedPets.pets);
                } else {
                    // If no data in localStorage, use the default petData
                    setPets(petData.pets);
                }
            } catch (error) {
                console.error('Error loading pet data:', error);
                setPets(petData.pets); // Fallback to default data
            }
        };

        loadPetData();
    }, []);


    // Add this placeholder image URL
    const placeholderImage = "https://placehold.co/400x300/e2e8f0/1e293b?text=Pet+Image";

    const handleMarkerClick = (pet) => {
        setSelectedPet(pet);
        // Add a latitude offset to move the center point up
        const latitudeOffset = -0.008; // Adjust this value to move more or less
        setViewState({
            latitude: pet.latitude + latitudeOffset,
            longitude: pet.longitude,
            zoom: 13,
            transitionDuration: 500
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            {/* Header Section */}
            <div className="bg-white shadow-md py-6 md:py-8">
                <div className="container mx-auto px-4">
                    <h1 className="text-2xl md:text-4xl font-bold text-center text-gray-800 mb-3">
                        Pet Location Tracker
                    </h1>
                    <div className="flex flex-wrap justify-center items-center gap-2 text-gray-600">
                        <span className="flex items-center gap-1">
                            <span className="text-lg">🔴</span> Lost Pets
                        </span>
                        <span className="hidden md:block mx-2">•</span>
                        <span className="flex items-center gap-1">
                            <span className="text-lg">🟢</span> Found Pets
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-2 md:px-4 py-4 md:py-8">
                {/* Map Section */}
                <div className="bg-white rounded-xl shadow-lg p-3 md:p-6 mb-4 md:mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 md:mb-6 gap-2">
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                            Pet Locations Map
                        </h2>
                        <div className="text-xs md:text-sm text-gray-600 bg-gray-50 px-3 py-1.5 md:px-4 md:py-2 rounded-lg">
                            Click on markers to view details
                        </div>
                    </div>
                    {/* Adjust map height based on screen size */}
                    <div className="h-[calc(100vh-280px)] md:h-[600px] rounded-xl overflow-hidden border border-gray-100">
                        <Map
                            {...viewState}
                            onMove={evt => setViewState(evt.viewState)}
                            style={{ width: "100%", height: "100%" }}
                            mapStyle="mapbox://styles/mapbox/streets-v11"
                            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                            onClick={() => {
                                setSelectedPet(null);
                                setViewState({
                                    ...mapCenter,
                                    zoom: 11.5,
                                    transitionDuration: 500
                                });
                            }}
                        >
                            {pets.map((pet) => (
                                <Marker
                                    key={pet.id}
                                    latitude={pet.latitude}
                                    longitude={pet.longitude}
                                    onClick={(e) => {
                                        e.originalEvent.stopPropagation();
                                        handleMarkerClick(pet);
                                    }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="text-xl md:text-2xl transform hover:scale-110 transition-transform duration-200" title={pet.name}>
                                        {pet.status === "Lost" ? "🔴" : "🟢"}
                                    </div>
                                </Marker>
                            ))}

                            {selectedPet && (
                                <Popup
                                    latitude={selectedPet.latitude}
                                    longitude={selectedPet.longitude}
                                    onClose={() => setSelectedPet(null)}
                                    closeButton={true}
                                    closeOnClick={true}
                                    offset={25}
                                    maxWidth="300px"
                                >
                                    <div className="p-2 w-full bg-white rounded-lg">
                                        {/* Main Content - Horizontal Layout */}
                                        <div className="flex gap-3">
                                            {/* Left Side - Image */}
                                            <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-gray-100">
                                                <img
                                                    src={selectedPet.image || placeholderImage}
                                                    alt={`${selectedPet.breed || 'Pet'} image`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = placeholderImage;
                                                    }}
                                                />
                                            </div>

                                            {/* Right Side - Details */}
                                            <div className="flex-1 min-w-0">
                                                {/* Status Badge */}
                                                <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mb-1 ${selectedPet.status === "Lost"
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-green-100 text-green-800"
                                                    }`}>
                                                    {selectedPet.status}
                                                </div>

                                                {/* Pet Name */}
                                                <h3 className="font-bold text-base text-gray-800 mb-1 truncate">
                                                    {selectedPet.name}
                                                </h3>

                                                {/* Pet Details */}
                                                <div className="space-y-0.5 text-xs text-gray-600">
                                                    <p className="truncate">
                                                        <span className="font-medium text-gray-700">Breed:</span>{' '}
                                                        {selectedPet.breed}
                                                    </p>
                                                    <p className="truncate">
                                                        <span className="font-medium text-gray-700">Color:</span>{' '}
                                                        {selectedPet.color}
                                                    </p>
                                                    <p className="truncate">
                                                        <span className="font-medium text-gray-700">Last Seen:</span>{' '}
                                                        {selectedPet.lastSeen}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <button
                                            onClick={() => router.push(`/petDescription?id=${selectedPet.id}`)}
                                            className="bg-blue-500 text-white px-2 py-1 rounded-lg text-xs hover:bg-blue-600 w-full mt-2 font-medium transition-all duration-200 hover:shadow-md"
                                        >
                                            View Full Details
                                        </button>
                                    </div>
                                </Popup>
                            )}
                        </Map>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="grid ">
                    

                    <Link href="/uploadLostPet" className="group">
                        <div className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl shadow-md p-4 md:p-8 transition-all duration-200 transform group-hover:-translate-y-1">
                            <h3 className="text-xl md:text-2xl font-semibold mb-2 md:mb-3">Report a Pet</h3>
                            <p className="text-green-100 text-xs md:text-sm">Help reunite lost pets with their families</p>
                            <div className="mt-3 md:mt-4 text-green-200 group-hover:translate-x-2 transition-transform duration-200">
                                →
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

const ProtectedPetDescription = () => {
    return (
        <AuthGuard requireAuth={true}>
            <Home />
        </AuthGuard>
    );
};

export default ProtectedPetDescription;
