import React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from '../contexts/AuthContext'

function ProtectedRoutes({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated, isLoading } = useAuth();

    // Wait for authentication check to complete
    if (isLoading) {
        return <div>Loading...</div>;
    }

    // Check both authentication and user existence
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" />;
    }

    return <>{children}</>;
}

export default ProtectedRoutes;