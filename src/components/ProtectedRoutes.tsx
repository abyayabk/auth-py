import React from "react"
import { Navigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import api from '../api'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants'
import { useState, useEffect } from "react"


function ProtectedRoutes({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    useEffect(() => {
        checkAuth().catch( () => {
            setIsAuthenticated(false);
        });
    }, []);

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);

        if (!refreshToken) {
            setIsAuthenticated(false);
            return;
        }

        try {
            const response = await api.post('/api/token/refresh/', {
                refresh: refreshToken,
            });

            if (response.status !== 200) {
                setIsAuthenticated(false);
                return;
            }

            localStorage.setItem(ACCESS_TOKEN, response.data.access);
            localStorage.setItem(REFRESH_TOKEN, response.data.refresh);

            setIsAuthenticated(true);
        } catch (error) {
            setIsAuthenticated(false);
        }
    }

    const checkAuth = async () => {
        const accessToken = localStorage.getItem(ACCESS_TOKEN);
        console.log(accessToken);

        if (!accessToken) {
            setIsAuthenticated(false);
            return;
        }

        try {
            const decoded = jwtDecode(accessToken);
            const currentTime = Date.now() / 1000;
            console.log(decoded);
            if (decoded.exp && decoded.exp < currentTime) {
                await refreshToken();
            } else {
                setIsAuthenticated(true);
            }
        } catch (error) {
            setIsAuthenticated(false);
        }
    }

    if (isAuthenticated === null) return <div>Loading...</div>;

    return isAuthenticated ? children : <Navigate to="/login" />;
}

export default ProtectedRoutes;