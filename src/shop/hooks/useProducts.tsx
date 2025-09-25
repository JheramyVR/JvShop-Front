import { useQuery } from "@tanstack/react-query";
import {
    getProductsAction,
    type Options,
} from "../actions/get-products.action";
import { useParams, useSearchParams } from "react-router";

// Gestión de caché de resultados de productos en memoria con TanStack Query

interface Prices {
    isRange: boolean;
    maxPrice?: number;
    minPrice?: number;
}

export const useProducts = () => {
    const [searchParams] = useSearchParams();

    //Parametros que se manejaran siempre
    const limit = searchParams.get("limit") || 9;
    const page = searchParams.get("page") || 1;
    const offset = (Number(page) - 1) * Number(limit);

    //Parametros opcionales puede que se envien o no dependeiendo de la ruta y si se activo opciones.
    const query = searchParams.get("query") || undefined;
    const sizes = searchParams.get("sizes") || "";
    const pricesString = searchParams.get("prices"); //any,0-50,100-200,200+

    const { gender } = useParams(); //Hock de react router que da los parametros dinamicos que se definieron en router y su valor si esque esta en esa ruta.
    //osea que si esta en seccion todos, sera gender=undefinded.

    const prices: Prices = {
        isRange: false,
    };

    if (pricesString?.includes("-")) {
        const [minStr, maxStr] = pricesString.split("-");
        const min = Number(minStr);
        const max = Number(maxStr); //Number devolvera NaN si no encuentra numero en string, asi que manejamos posible caso:

        if (!isNaN(min) && !isNaN(max)) {
            prices.isRange = true;
            prices.maxPrice = max;
            prices.minPrice = min;
        }
    } else if (pricesString?.includes("+")) {
        prices.isRange = true;
        prices.minPrice = Number(pricesString.replace("+", ""));
    }

    //limit: numero de productos a mostrar por pagina.
    //offset: desde qué posición empezar.
    /*
        Ejemplo:

        Supongamos que tienes 100 productos en total.

        limit = 10 (quieres mostrar 10 productos por página).

        👉 Página 1 → offset = 0, devuelve productos 1–10
        👉 Página 2 → offset = 10, devuelve productos 11–20
        👉 Página 3 → offset = 20, devue  lve productos 21–30
    
    */

    const getProductQuery = useQuery({
        // queryKey: ["products"],
        queryKey: ["products", { offset, limit, gender, sizes, prices, query }], //Cada que cambian esos parametros entonces se volvera a hacer la peticion , siesque esta no esta fresca.
        //en realidad eso es un objeto algo asi : offset : offset, limit:limit y asi sucesivamente eso es importante ya que la key esta compuesta por las propiedades o nombres de ellas.
        queryFn: () => {
            const params: Options = {
                limit: isNaN(+limit) ? 9 : limit,
                offset: isNaN(offset) ? 0 : offset,
                ...(gender ? { gender } : {}), //Para asegurar no enviar datos undefined o vacios a la api cuando no se tengan , pero si la api gestiona esos casos no hay problemas.
                ...(sizes ? { sizes } : {}),
                ...(prices.isRange
                    ? { minPrice: prices.minPrice, maxPrice: prices.maxPrice }
                    : {}),
                ...(query ? { query } : {}),
            };

            //Forma un poco mas legible
            // if (gender) {
            //     params.gender = gender;
            // }
            return getProductsAction(params);
        },
        staleTime: 1000 * 60 * 5, //Para la misma conbinacion de products y sus parametros se mantiene en cache sus datos por 5 minutos.
    });

    return getProductQuery;
};

/*
    queryKey es el identificador único de la query.
    Normalmente es un array: [nombre, parámetros].
    Debe ser serializable (nada de funciones, fechas sin transformar, etc.).
*/
