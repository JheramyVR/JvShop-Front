import type { User } from "@/interfaces/user.interface";

//Login, register,CheckStatus
export interface AuthResponse {
    user: User;
    token: string;
}
