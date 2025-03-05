"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "~~/components/AuthGuard";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

const UploadPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    breed: "", 
    color: "",
    lastSeen: "",
    description: "",
    location: { lat: null, lng: null },
    prizeAmount: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const geocoderRef = useRef<MapboxGeocoder | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize the Mapbox map
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [101.7118, 3.2003], // Default center (Malaysia)
      zoom: 12,
    });

    // Initialize the Mapbox Geocoder
    geocoderRef.current = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      placeholder: "Search for a location...",
      marker: false,
    });

    // Append the geocoder to the input field container
    const geocoderContainer = document.getElementById("geocoder-container");
    if (geocoderContainer) {
      geocoderContainer.appendChild(geocoderRef.current.onAdd(mapRef.current));
    }

    // Handle place selection from search
    geocoderRef.current.on("result", (e) => {
      const { center, place_name } = e.result;

      if (center) {
        const [lng, lat] = center;

        // Update state with selected location
        setFormData((prev) => ({
          ...prev,
          lastSeen: place_name,
          location: { lat, lng },
        }));

        // Move the map to the selected location
        mapRef.current?.flyTo({
          center: [lng, lat],
          zoom: 14,
        });

        // Remove previous marker if exists
        if (markerRef.current) markerRef.current.remove();

        // Add a new marker
        markerRef.current = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(mapRef.current);
      }
    });

    // Allow users to click on the map to select a location
    mapRef.current.on("click", (e) => {
      const { lng, lat } = e.lngLat;

      // Update state with selected location
      setFormData((prev) => ({
        ...prev,
        lastSeen: `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`,
        location: { lat, lng },
      }));

      // Remove previous marker if exists
      if (markerRef.current) markerRef.current.remove();

      // Add new marker
      markerRef.current = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(mapRef.current);
    });

    return () => {
      mapRef.current?.remove();
      if (geocoderRef.current) {
        geocoderRef.current.clear();
      }
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        setSelectedImage(file);

        // Convert image to Base64
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string);
        };
    }
};


const router = useRouter();
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.location.lat || !formData.location.lng) {
      alert("Please select a valid location on the map.");
      return;
  }

  if (!selectedImage) {
      alert("Please upload an image of the pet.");
      return;
  }

  try {
      // Convert the uploaded image to Base64
      const imageBase64 = await convertImageToBase64(selectedImage);

      // Create a new pet object with the form data
      const newPet = {
          id: Date.now().toString(), // Unique ID
          name: formData.name, // Using breed as name since no separate name field
          breed: formData.breed,
          color: formData.color,
          lastSeen: formData.lastSeen,
          latitude: formData.location.lat,
          longitude: formData.location.lng,
          status: "Lost", // Since this form is for lost pets
          image: imageBase64, // Store the image in Base64 format
          description: formData.description,
          prizeAmount: formData.prizeAmount,
      };

      // Get existing pets from localStorage or initialize
      const storedPetsJSON = localStorage.getItem("petData");
      const storedPets = storedPetsJSON ? JSON.parse(storedPetsJSON) : { pets: [] };

      // Append new pet
      storedPets.pets.push(newPet);

      // Save back to localStorage
      localStorage.setItem("petData", JSON.stringify(storedPets));

      console.log("Pet uploaded:", newPet);

      // Redirect to home page
      router.push("/");
  } catch (error) {
      console.error("Error saving pet data:", error);
      alert("Failed to save pet data. Please try again.");
  }
};

// Function to Convert Image to Base64
const convertImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
  });
};


  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-2xl w-full bg-base-100 shadow-xl rounded-md p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Report Lost Pet</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Pet Image</span>
            </label>
            <div className="flex flex-col items-center space-y-4">
              {previewUrl ? (
                <div className="relative w-full max-w-xs">
                  <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover rounded-md" />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(null);
                      setPreviewUrl(null);
                    }}
                    className="absolute top-2 right-2 btn btn-circle btn-sm btn-error"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-md cursor-pointer hover:bg-base-200 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <p className="mb-2 text-sm text-gray-500">Click to upload</p>
                    <p className="text-xs text-gray-500">PNG, JPG or JPEG</p>
                  </div>
                  <input type="file" className="hidden" accept="image/png, image/jpeg, image/jpg" onChange={handleImageChange} required />
                </label>
              )}
            </div>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Pet Name</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Max"
              className="input input-bordered w-full rounded-md"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Pet Color</span>
            </label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              placeholder="e.g., Golden Brown"
              className="input input-bordered w-full rounded-md"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Pet Breed</span>
            </label>
            <input
              type="text"
              name="breed"
              value={formData.breed}
              onChange={handleInputChange}
              placeholder="e.g., Golden Brown"
              className="input input-bordered w-full rounded-md"
              required
            />  
          </div>
       

          {/* Last Seen Location - Search & Clickable Map */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Last Seen Location</span>
            </label>
            <div id="geocoder-container" className="mb-2"></div>
            <input type="text" name="lastSeen" value={formData.lastSeen} readOnly className="input input-bordered w-full rounded-md cursor-not-allowed" required />
            <div className="mt-2 h-64 rounded-md border border-gray-300 overflow-hidden">
              <div ref={mapContainerRef} className="w-full h-full"></div>
            </div>
          </div>

          {/* Description */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Provide additional details about your pet (age, distinctive marks, behavior, etc.)" className="textarea textarea-bordered w-full h-32 rounded-md" required />
          </div>
          {/* Prize Award */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Prize Award (ETH)</span>
            </label>
            <input
              type="number"
              name="prizeAmount" 
              value={formData.prizeAmount}
              onChange={handleInputChange}
              placeholder="e.g., 0.1"
              step="0.001"
              min="0"
              className="input input-bordered w-full rounded-md"
              required
            />
            <label className="label">
              <span className="label-text-alt text-gray-500">Enter the amount you want to offer as a reward in ETH</span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="form-control mt-8">
            <button type="submit" className="btn btn-primary w-full rounded-md">
              Upload Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProtectedUploadPage = () => {
  return (
    <AuthGuard requireAuth={true}>
      <UploadPage />
    </AuthGuard>
  );
};

export default ProtectedUploadPage;
