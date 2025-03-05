import { useState } from "react";
import { HeartIcon, TagIcon } from "@heroicons/react/24/outline";
import { PetDetailsModal } from "./PetDetailsModal";

interface PetNFTCardProps {
    pet: {
        id: string;
        name: string;
        breed: string;
        color: string;
        description: string;
        imageUrl: string;
    };
}

export const PetNFTCard = ({ pet }: PetNFTCardProps) => {
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    return (
        <>
            <div className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                {/* Image Container */}
                <div className="relative h-40 overflow-hidden bg-gray-100">
                    <img
                        src={pet.imageUrl}
                        alt={pet.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* NFT ID Badge */}
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-full shadow-sm">
                        <div className="flex items-center gap-0.5">
                            <span className="text-[10px] font-medium text-gray-800">#{pet.id}</span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-2 space-y-1">
                    {/* Name */}
                    <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-gray-800 mb-0 truncate">{pet.name}</h3>
                    </div>

                    {/* Breed */}
                    <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold text-gray-700">Breed:</span>
                        <span className="text-[10px] text-gray-600 truncate">{pet.breed}</span>
                    </div>

                    {/* Color */}
                    <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold text-gray-700">Color:</span>
                        <span className="text-[10px] text-gray-600 truncate">{pet.color}</span>
                    </div>

                    {/* Description */}
                    <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold text-gray-700">Description:</span>
                        <span className="text-[10px] text-gray-600 truncate">{pet.description}</span>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={() => setIsDetailsModalOpen(true)}
                        className="btn btn-primary btn-xs w-full h-6 min-h-0 text-[10px]"
                    >
                        View Details
                    </button>
                </div>
            </div>

            {/* Details Modal */}
            <PetDetailsModal
                pet={pet}
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
            />
        </>
    );
};