import { useState } from "react";
import { useContractWrite } from "wagmi";
// Import your contract ABI and address here

interface MintPetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onMintSuccess: (newPet: any) => void;
}

export const MintPetModal = ({ isOpen, onClose, onMintSuccess }: MintPetModalProps) => {
    const [formData, setFormData] = useState({
        name: "",
        breed: "",
        color: "",
        description: "",
        image: null as File | null,
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData({ ...formData, image: file });
            // Create preview URL
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Step 1: Upload the image to Pinata
        const uploadData = new FormData();
        if (formData.image) {
            uploadData.append("file", formData.image);
        } else {
            console.error("No image selected for upload.");
            return;
        }

        const pinataToken = process.env.NEXT_PUBLIC_PINATA_TOKEN; // Use the token if needed

        try {
            const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${pinataToken}`, // Use the Bearer token if required
                    // Do not set Content-Type; let the browser handle it
                },
                body: uploadData,
            });

            const data = await response.json();
            if (response.ok) {
                const ipfsHash = data.IpfsHash; // Get the IPFS URL
                console.log("Image uploaded successfully:", ipfsHash);
 
                // Step 2: Prepare metadata for the NFT
                const metadata = {
                    name: formData.name,
                    description: formData.description,
                    image: `ipfs://${ipfsHash}`, // Storing image as per ERC-721 standard
                    attributes: [
                        { trait_type: "Breed", value: formData.breed },
                        { trait_type: "Color", value: formData.color },
                    ],
                };

                // Step 3: Call the smart contract to mint the NFT
                await mintNFT(metadata); // Replace with your actual minting function

                // Step 4: Call onMintSuccess with the new pet data
                onMintSuccess({ ...formData, image: ipfsHash });
            } else {
                console.error("Error uploading image:", data);
            }
        } catch (error) {
            console.error("Error uploading to Pinata:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black/30" onClick={onClose} />
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Header */}
                    <div className="p-4 border-b">
                        <h3 className="text-lg font-bold text-gray-900">Create New Pet NFT</h3>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-4">
                        {/* Image Upload Section */}
                        <div className="mb-4">
                            <div className="flex items-center justify-center w-full">
                                <label className="relative flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="absolute inset-0 w-full h-full object-contain rounded-lg p-2"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-3">
                                            <svg className="w-6 h-6 mb-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            <p className="text-xs text-gray-500">Click to upload pet image</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        required
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Form Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="col-span-2">
                                <label className="block text-xs font-medium text-gray-700 mb-1">Pet Name</label>
                                <input
                                    type="text"
                                    className="w-full px-2.5 py-1.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Breed</label>
                                <input
                                    type="text"
                                    className="w-full px-2.5 py-1.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                    value={formData.breed}
                                    onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Color</label>
                                <input
                                    type="text"
                                    className="w-full px-2.5 py-1.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                    value={formData.color}
                                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    className="w-full px-2.5 py-1.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                    rows={2}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-4 flex items-center justify-end gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-3 py-1.5 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                                Create NFT
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}; 