"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";

const UploadPage = () => {
  const router = useRouter();
  const { address, isConnected, isConnecting, isReconnecting } = useAccount();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [formData, setFormData] = useState({
    breed: "",
    color: "",
    lastSeen: "",
    description: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Authentication check with proper loading state handling
  useEffect(() => {
    const checkAuth = () => {
      if (!isConnecting && !isReconnecting) {
        setIsAuthChecking(false);
        if (!isConnected) {
          router.push("/");
        }
      }
    };
    checkAuth();
  }, [isConnecting, isReconnecting, isConnected, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      // Create preview URL for the selected image
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement the upload logic here
    console.log("Form submitted:", { ...formData, image: selectedImage });
  };

  // Cleanup preview URL when component unmounts or new image is selected
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Show loading state while checking authentication
  if (isAuthChecking || isConnecting || isReconnecting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-center">
          <div className="text-lg mb-2">Checking authentication...</div>
          <div className="text-sm opacity-60">Please wait</div>
        </div>
      </div>
    );
  }

  // If not authenticated after checking, don't render the page content
  if (!isConnected) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-2xl w-full bg-base-100 shadow-xl rounded-md p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Report Lost Pet</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                <div className="w-full">
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-md cursor-pointer hover:bg-base-200 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-4 text-gray-500"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">Click to upload</p>
                      <p className="text-xs text-gray-500">PNG, JPG or JPEG</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handleImageChange}
                      required
                    />
                  </label>
                </div>
              )}
            </div>
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
              placeholder="e.g., Golden Retriever"
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
              <span className="label-text">Last Seen Location</span>
            </label>
            <textarea
              name="lastSeen"
              value={formData.lastSeen}
              onChange={handleInputChange}
              placeholder="Describe where the pet was last seen..."
              className="textarea textarea-bordered w-full h-24 rounded-md"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Provide additional details about your pet (age, distinctive marks, behavior, etc.)"
              className="textarea textarea-bordered w-full h-32 rounded-md"
              required
            />
          </div>

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

export default UploadPage;