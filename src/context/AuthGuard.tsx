import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { ROUTES } from "../constants/routes.constants";
import Loader from "../components/Loader/Loader";
import Box from "@mui/material/Box";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

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

    if (!user) {
        return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
    }

    return <>{children}</>;
};
