import React from "react"
import { Navigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import api from '../api'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants'
import { useState, useEffect } from "react"
import { useAuth } from '../contexts/AuthContext'

function ProtectedRoutes({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        checkAuth().catch(() => {
            setIsAuthenticated(false);
            // Clear tokens on authentication failure
            localStorage.removeItem(ACCESS_TOKEN);
            localStorage.removeItem(REFRESH_TOKEN);
        });
    }, []);

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);

        if (!refreshToken) {
            setIsAuthenticated(false);
            localStorage.removeItem(ACCESS_TOKEN);
            localStorage.removeItem(REFRESH_TOKEN);
            return;
        }

        try {
            const response = await api.post('/api/token/refresh/', {
                refresh: refreshToken,
            });

            if (response.status !== 200) {
                setIsAuthenticated(false);
                localStorage.removeItem(ACCESS_TOKEN);
                localStorage.removeItem(REFRESH_TOKEN);
                return;
            }

            localStorage.setItem(ACCESS_TOKEN, response.data.access);
            localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
            setIsAuthenticated(true);
        } catch (error) {
            setIsAuthenticated(false);
            localStorage.removeItem(ACCESS_TOKEN);
            localStorage.removeItem(REFRESH_TOKEN);
        }
    }

    const checkAuth = async () => {
        const accessToken = localStorage.getItem(ACCESS_TOKEN);

        if (!accessToken) {
            setIsAuthenticated(false);
            return;
        }

        try {
            const decoded = jwtDecode(accessToken);
            const currentTime = Date.now() / 1000;
            if (decoded.exp && decoded.exp < currentTime) {
                await refreshToken();
            } else {
                setIsAuthenticated(true);
            }
        } catch (error) {
            setIsAuthenticated(false);
            localStorage.removeItem(ACCESS_TOKEN);
            localStorage.removeItem(REFRESH_TOKEN);
        }
    }

    if (isAuthenticated === null) return <div>Loading...</div>;

    // Check both authentication and user role
    return isAuthenticated && user ? children : <Navigate to="/login" />;
}

export default ProtectedRoutes;