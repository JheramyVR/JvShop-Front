import { tesloApi } from "@/api/tesloApi";
import type { AuthResponse } from "../interfaces/auth.response";
import type { AxiosError } from "axios";

export const registerAction = async (
    email: string,
    fullName: string,
    password: string
): Promise<AuthResponse> => {
    try {
        const { data } = await tesloApi.post("/auth/register", {
            email,
            fullName,
            password,
        });

        return data;
    } catch (err) {
        throw err as AxiosError<{
            message: string;
            error: string;
            statusCode: number;
        }>;
    }
};
