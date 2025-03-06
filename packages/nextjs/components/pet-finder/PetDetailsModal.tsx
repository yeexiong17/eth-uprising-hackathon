interface PetDetailsModalProps {
    pet: {
        tokenId: string;
        name: string;
        breed: string;
        color: string;
        description: string;
        imageUrl: string;
    };
    isOpen: boolean;
    onClose: () => void;
}

export const PetDetailsModal = ({ pet, isOpen, onClose }: PetDetailsModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black/30" onClick={onClose} />
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute right-2 top-2 z-10 bg-white/80 hover:bg-white rounded-full p-1 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Image */}
                    <div className="relative h-48 rounded-t-lg overflow-hidden bg-gray-100">
                        <img
                            src={pet.imageUrl}
                            alt={pet.name}
                            className="w-full h-full object-contain"
                        />
                    </div>

                    {/* Content */}
                    <div className="p-4">
                        {/* Header */}
                        <div className="mb-3">
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-bold mb-0 text-gray-800">{pet.name}</h3>
                                <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                                    #{pet.tokenId}
                                </span>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-2">
                            <div>
                                <h4 className="text-xs font-bold text-gray-700">Breed</h4>
                                <p className="text-sm text-gray-600 mt-0">{pet.breed}</p>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-gray-700">Color</h4>
                                <p className="text-sm text-gray-600 mt-0">{pet.color}</p>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-gray-700">Description</h4>
                                <p className="text-sm text-gray-600 mt-0">{pet.description}</p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={onClose}
                                className="btn btn-primary btn-sm"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};