"use client";

import { useConnectModal } from '@rainbow-me/rainbowkit';
import { AuthGuard } from "~~/components/AuthGuard";

const Public = () => {
  const { openConnectModal } = useConnectModal();

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-8 text-primary">Pets Lost & Found</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Welcome to your community's pet recovery platform. Help reunite lost pets with their families or find your missing furry friend.
          </p>
          <button
            className="btn btn-primary btn-lg"
            onClick={openConnectModal}
          >
            Connect Wallet to Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

const ProtectedHomePage = () => {
  return (
    <AuthGuard requireAuth={false}>
      <Public />
    </AuthGuard>
  );
};

export default ProtectedHomePage;
