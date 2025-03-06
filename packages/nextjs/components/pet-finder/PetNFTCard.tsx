import { useState, useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { PetDetailsModal } from "./PetDetailsModal";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface PetNFTCardProps {
    pet: {
        tokenId: string;
        name: string;
        breed: string;
        color: string;
        description: string;
        imageUrl: string;
    };
}

export const PetNFTCard = ({ pet }: PetNFTCardProps) => {
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [prizeAmount, setPrizeAmount] = useState("");
    const [lastSeen, setLastSeen] = useState("");
    const [location, setLocation] = useState<{ lat: number | null; lng: number | null }>({ lat: null, lng: null });

    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const markerRef = useRef<mapboxgl.Marker | null>(null);
    const geocoderRef = useRef<MapboxGeocoder | null>(null);

    useEffect(() => {
        if (!isReportModalOpen || !mapContainerRef.current) return;

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
            geocoderContainer.appendChild(geocoderRef.current.onAdd(mapRef.current));
        }

        geocoderRef.current.on("result", (e) => {
            const { center, place_name } = e.result;
            if (center) {
                const [lng, lat] = center;
                setLastSeen(place_name);
                setLocation({ lat, lng });

                mapRef.current?.flyTo({ center: [lng, lat], zoom: 14 });

                if (markerRef.current) markerRef.current.remove();
                markerRef.current = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(mapRef.current!);
            }
        });

        mapRef.current.on("click", (e) => {
            const { lng, lat } = e.lngLat;
            setLastSeen(`Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`);
            setLocation({ lat, lng });

            if (markerRef.current) markerRef.current.remove();
            markerRef.current = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(mapRef.current!);
        });

        return () => {
            mapRef.current?.remove();
        };
    }, [isReportModalOpen]);

    const handleSubmitReport = () => {
        if (!location.lat || !location.lng || isNaN(location.lat) || isNaN(location.lng)) {
            alert("Please select a valid location on the map.");
            return;
        }

        if (!prizeAmount) {
            alert("Please enter a prize amount.");
            return;
        }

        const lostPetReport = {
            id: pet.tokenId,
            name: pet.name,
            breed: pet.breed,
            color: pet.color,
            description: pet.description,
            imageUrl: pet.imageUrl,
            lastSeen,
            latitude: parseFloat(location.lat.toString()),  // ✅ Ensure it's a number
            longitude: parseFloat(location.lng.toString()), // ✅ Ensure it's a number
            prizeAmount,
            status: "Lost"
        };

        // 🔥 Save lost pet reports in localStorage
        const storedReports = localStorage.getItem("lostPetReports");
        const reports = storedReports ? JSON.parse(storedReports) : [];
        reports.push(lostPetReport);
        localStorage.setItem("lostPetReports", JSON.stringify(reports));

        alert("Lost pet report submitted successfully!");

        // 🔥 Notify home page to refresh map markers
        window.dispatchEvent(new Event("lostPetUpdated"));

        setIsReportModalOpen(false);
    };



    return (
        <>
            <div className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                <div className="relative h-40 overflow-hidden bg-gray-100">
                    <img
                        src={pet.imageUrl}
                        alt={pet.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                </div>

                <div className="p-2 space-y-1">
                    <h3 className="text-sm font-bold text-gray-800 mb-0 truncate">{pet.name}</h3>
                    <button onClick={() => setIsDetailsModalOpen(true)} className="btn btn-primary btn-xs w-full">
                        View Details
                    </button>
                    <button onClick={() => setIsReportModalOpen(true)} className="btn btn-secondary btn-xs w-full mt-1">
                        Report Lost Location
                    </button>
                </div>
            </div>

            {isReportModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Report Lost Location</h3>
                            <button
                                onClick={() => setIsReportModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div id="geocoder-container" className="mb-2"></div>
                        <input
                            type="text"
                            value={lastSeen}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
                        />
                        <div className="mt-2 h-48 border border-gray-300 rounded-md overflow-hidden">
                            <div ref={mapContainerRef} className="w-full h-full"></div>
                        </div>

                        <label className="block text-sm font-medium text-gray-700 mb-1 mt-2">Reward Prize (ETH)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={prizeAmount}
                            onChange={(e) => setPrizeAmount(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"
                            placeholder="Enter reward amount"
                        />

                        <button onClick={handleSubmitReport} className="btn btn-primary w-full mt-4">
                            Submit Report
                        </button>
                    </div>
                </div>
            )}

            <PetDetailsModal pet={pet} isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} />
        </>
    );
};
