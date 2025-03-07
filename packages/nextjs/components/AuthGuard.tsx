"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAccount } from "wagmi";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean; // true for protected pages, false for public pages
}

export const AuthGuard = ({ children, requireAuth = true }: AuthGuardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isConnected, isConnecting, isReconnecting } = useAccount();
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (!isConnecting && !isReconnecting) {
        setIsAuthChecking(false);

        // If user is connected and tries to access root page
        if (isConnected && pathname === "/") {
          router.push("/home");
          return;
        }

        // If user is not connected and tries to access protected page
        if (!isConnected && requireAuth) {
          router.push("/");
          return;
        }

        // If user is connected and tries to access protected page
        if (isConnected && !requireAuth && pathname === "/") {
          router.push("/home");
          return;
        }
      }
    };
    checkAuth();
  }, [isConnecting, isReconnecting, isConnected, router, pathname, requireAuth]);

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

  // For protected pages, don't render if not connected
  if (requireAuth && !isConnected) {
    return null;
  }

  // For public pages (like root), don't render if connected
  if (!requireAuth && isConnected) {
    return null;
  }

  return <>{children}</>;
};
