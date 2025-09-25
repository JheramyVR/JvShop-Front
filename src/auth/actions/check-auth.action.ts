import { tesloApi } from "@/api/tesloApi";
import type { AuthResponse } from "../interfaces/auth.response";

export const checkAuthAction = async (): Promise<AuthResponse> => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    try {
        const { data } = await tesloApi.get<AuthResponse>(
            "/auth/check-status" /*,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            } Se podria hacer asi pero es mejor manejarlo con interceptores de axios, ahi se agregan los token ademas de los parametros que ya se han ingresado si esue hay*/
        );
        localStorage.setItem("token", data.token);

        return data;
    } catch (error) {
        console.log(error);
        localStorage.removeItem("token");
        throw new Error("Token expired or not valid");
    }
};
