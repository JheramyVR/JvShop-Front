import { tesloApi } from "@/api/tesloApi";
import type { ProductsResponse } from "@/interfaces/products.response";

//Peticion GET de Productos

export interface Options {
    limit?: number | string;
    offset?: number | string;
    gender?: string;
    sizes?: string;
    maxPrice?: number;
    minPrice?: number;
    query?: string;
}

//Toda funcion async si o si devuelve una promesa ya sea resuelta o denegada ,entonces el tipo de dato es promise <tipodedatodeladatarespondida>

export const getProductsAction = async (
    options: Options
): Promise<ProductsResponse> => {
    console.log("hola , pasaste por la peticion.");
    const { limit, offset, gender, sizes, maxPrice, minPrice, query } = options;
    //Tipado de respuestas se hace con las interfaces creadas con la extension , apoyate con postman y la extension.
    const { data } = await tesloApi.get<ProductsResponse>("/products", {
        params: {
            limit,
            offset,
            ...(gender ? { gender } : {}),
            ...(sizes ? { sizes } : {}),
            ...(maxPrice ? { maxPrice } : {}),
            ...(minPrice ? { minPrice } : {}),
            ...(query ? { q: query } : {}),
        },
    });

    console.log(data);

    //Esto entiende que las imagenes recibidas de la api son string solo del nombre.extension entonces le pone el prefijo localhost....... etc. a todos no verifica a todos ,asume que el backend le manda la data limpia solo nombre.extension.
    const productsWithImageUrl = data.products.map((product) => ({
        ...product,
        images: product.images.map(
            (image) => `${import.meta.env.VITE_API_URL}/files/product/${image}`
        ),
    }));

    console.log(productsWithImageUrl);

    return {
        ...data,
        products: productsWithImageUrl,
    };
};
