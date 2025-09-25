import type { User } from "@/interfaces/user.interface";
import { create } from "zustand";
import { loginAction } from "../actions/login.action";
import { checkAuthAction } from "../actions/check-auth.action";
import { registerAction } from "../actions/register.action";
import type { AxiosError } from "axios";

type AuthStatus = "authenticated" | "not-authenticated" | "checking";

type AuthStore = {
    //Properties
    user: User | null;
    token: string | null;
    authStatus: AuthStatus;
    //Getters

    isAdmin: () => boolean;

    //Action
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    register: (
        email: string,
        fullname: string,
        password: string
    ) => Promise<{ ok: boolean; message?: string }>;
    checkAuthStatus: () => Promise<boolean>;
};

export const useAuthStore = create<AuthStore>()((set, get) => ({
    //Set nos sirve para actualizar o cambiar el valor de nuestros estados del store y el get para obtneerlo
    //get().user; asi por ejemplo
    user: null,
    token: null,
    authStatus: "checking",

    //Getters

    isAdmin: () => {
        const roles = get().user?.roles || [];
        return roles.includes("admin");
    },

    login: async (email: string, password: string) => {
        console.log({ email, password });

        try {
            const data = await loginAction(email, password); //Enviamos datos a nuestro POST en la API que valida esto y retorna segun sea el caso.
            localStorage.setItem("token", data.token);
            set({
                user: data.user,
                token: data.token,
                authStatus: "authenticated",
            }); //No necesitas actualizar todo solo lo que uqieres.
            return true;
        } catch {
            localStorage.removeItem("token");
            set({ user: null, token: null, authStatus: "not-authenticated" }); //No necesitas actualizar todo solo lo que uqieres.
            return false;
        }
    },

    logout: () => {
        localStorage.removeItem("token");
        set({ user: null, token: null, authStatus: "not-authenticated" });
    },
    checkAuthStatus: async () => {
        try {
            const { user, token } = await checkAuthAction();
            set({
                user: user,
                token: token,
                authStatus: "authenticated",
            });
            return true;
        } catch {
            set({
                user: undefined,
                token: undefined,
                authStatus: "not-authenticated",
            });
            return false;
        }
    },
    register: async (email: string, fullName: string, password: string) => {
        try {
            const data = await registerAction(email, fullName, password);
            console.log("Register response:", data);
            const loggedIn = await get().login(email, password);
            return {
                ok: loggedIn,
                message: loggedIn
                    ? "Registro exitoso"
                    : "No se pudo iniciar sesión",
            };
        } catch (err) {
            const error = err as AxiosError<{
                message: string;
                error: string;
                statusCode: number;
            }>;
            const message =
                error.response?.data?.message ||
                "Error desconocido en el registro";
            return { ok: false, message };
        }
    },
}));
