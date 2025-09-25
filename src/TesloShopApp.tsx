import { RouterProvider } from "react-router";
import { appRouter } from "./app.router";
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import type { PropsWithChildren } from "react";
import { CustomFullScreenLoading } from "./components/custom/CustomFullScreenLoading";
import { useAuthStore } from "./auth/store/auth.store";

const queryClient = new QueryClient(); //Creamos o instanciamos cliente de tanstack

//Componente jsx que llama al metodo de chekeo de status y manejo de inicio segun estado de logeo de usuario
const CheckAuthProvider = ({ children }: PropsWithChildren) => {
    const { checkAuthStatus } = useAuthStore(); //Accion de store de authenticacion

    //Peticion para comprobar usuario authenticado
    const { isLoading } = useQuery({
        queryKey: ["auth"],
        queryFn: checkAuthStatus,
        retry: false, //Para que si falla una vez osea no hay token no vuelva a hacer la peticion
        refetchInterval: 1000 * 60 * 1.5,
        refetchOnWindowFocus: true, //Para actualizar tokens cada cierto tiempo e interaccion.
    });

    if (isLoading) return <CustomFullScreenLoading />;

    return children;
};

export const TesloShopApp = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <Toaster />
            <CheckAuthProvider>
                <RouterProvider router={appRouter} />
            </CheckAuthProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};
