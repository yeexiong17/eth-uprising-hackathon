"use client";

import { useConnectModal } from '@rainbow-me/rainbowkit';
import { AuthGuard } from "~~/components/AuthGuard";
import { StatsCards } from "~~/components/pet-finder/StatsCards";

const PublicPage = () => {
  const { openConnectModal } = useConnectModal();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Welcome to PawChain
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Helping lost pets find their way back home
          </p>
          <button
            className="bg-blue-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors duration-200"
            onClick={openConnectModal}
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <StatsCards />

      {/* Additional Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Lost a Pet?
            </h2>
            <p className="text-gray-600 mb-4">
              Report your lost pet quickly and easily. Our community will help you find them.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Found a Pet?
            </h2>
            <p className="text-gray-600 mb-4">
              Help reunite a lost pet with their family by reporting your find.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">Create a Report</h3>
              <p className="text-gray-600">Submit details about the lost or found pet</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">Pet Verification</h3>
              <p className="text-gray-600">Owner can verify the pet based on sighting report from other users</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="text-xl font-semibold mb-2">Incentive-based System</h3>
              <p className="text-gray-600">Users can earn rewards for making correct sighting reports</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProtectedHomePage = () => {
  return (
    <AuthGuard requireAuth={false}>
      <PublicPage />
    </AuthGuard>
  );
};

export default ProtectedHomePage;
