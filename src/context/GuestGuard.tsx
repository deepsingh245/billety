import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { ROUTES } from "../constants/routes.constants";
import Loader from "../components/Loader/Loader";
import Box from "@mui/material/Box";

export const GuestGuard = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <Loader />
            </Box>
        );
    }

    if (user) {
        return <Navigate to={`${ROUTES.DASHBOARD.ROOT}/${ROUTES.DASHBOARD.HOME}`} replace />;
    }

    return <>{children}</>;
};
