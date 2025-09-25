import { createBrowserRouter, Navigate } from "react-router";
import { ShopLayout } from "./shop/layouts/ShopLayout";
import { HomePage } from "./shop/pages/home/HomePage";
import { ProductPage } from "./shop/pages/product/ProductPage";
import { GenderPage } from "./shop/pages/gender/GenderPage";
import { LoginPage } from "./auth/pages/login/LoginPage";
import { RegisterPage } from "./auth/pages/register/RegisterPage";
import { DashboardPage } from "./admin/pages/dashboard/DashboardPage";
import { AdminProductPage } from "./admin/pages/product/AdminProductPage";
import { AdminProductsPage } from "./admin/pages/products/AdminProductsPage";
import { lazy } from "react";
import {
    AdminRoute,
    NotAuthenticatedRoute,
} from "./components/routes/ProtectedRoutes";

//Carga perezoza para algunos componentes menos visitados.
const AuthLayout = lazy(() => import("./auth/layouts/AuthLayout"));
const AdminLayout = lazy(() => import("./admin/layouts/AdminLayout"));

export const appRouter = createBrowserRouter([
    //Public Routes
    {
        element: <ShopLayout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: "product/:idSlug",
                element: <ProductPage />,
            },
            {
                path: "gender/:gender",
                element: <GenderPage />,
            },
        ],
    },

    //Auth Routes
    {
        path: "auth",
        //element: <AuthLayout />,
        element: (
            //Componente que permite ingreso solo a usuarios no logueados
            <NotAuthenticatedRoute>
                <AuthLayout />
            </NotAuthenticatedRoute>
        ),
        children: [
            {
                index: true,
                element: <Navigate to="/auth/login" />,
            },
            {
                path: "login",
                element: <LoginPage />,
            },
            {
                path: "register",
                element: <RegisterPage />,
            },
        ],
    },

    //Admin Routes

    {
        path: "admin",
        // element: <AdminLayout />,
        element: (
            //Componente que permite ingreso solo a usuarios autorizados
            <AdminRoute>
                <AdminLayout />
            </AdminRoute>
        ),
        children: [
            {
                index: true,
                element: <DashboardPage />,
            },
            {
                path: "products/:id",
                element: <AdminProductPage />,
            },
            {
                path: "products",
                element: <AdminProductsPage />,
            },
        ],
    },
    {
        path: "*",
        element: <Navigate to="/" />,
    },
]);
