import { useAuthStore } from "@/auth/store/auth.store";
import type { PropsWithChildren } from "react";
import { Navigate } from "react-router";

//Para rutas de admin mandarlo al login
export const AuthenticatedRoute = ({ children }: PropsWithChildren) => {
    const { authStatus } = useAuthStore();
    if (authStatus === "checking") return null;
    if (authStatus === "not-authenticated")
        return <Navigate to="/auth/login" />;

    return children;
};

//Para usuario authenticado no puede entrar a rutas como login.
export const NotAuthenticatedRoute = ({ children }: PropsWithChildren) => {
    const { authStatus } = useAuthStore();
    if (authStatus === "checking") return null;
    if (authStatus === "authenticated") return <Navigate to="/" />;

    return children;
};

export const AdminRoute = ({ children }: PropsWithChildren) => {
    const { authStatus, isAdmin } = useAuthStore();
    if (authStatus === "checking") return null;
    if (authStatus === "not-authenticated")
        return <Navigate to="/auth/login" />;

    if (!isAdmin()) return <Navigate to="/" />;

    return children;
};
