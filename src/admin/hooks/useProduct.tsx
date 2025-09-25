import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProductByIdAction } from "../actions/get-product-by-id.action";
import { createUpdateProductAction } from "../actions/create-update-product.action";
import type { Product } from "@/interfaces/product.interface";

export const useProduct = (id: string) => {
    const queryClient = useQueryClient(); //acceso al cache y manejo de queries

    const productQuery = useQuery({
        queryKey: ["product", { id }], //se define id como objeto asi que debes saber que es id:id algo asi , se puede definir suelto tmabien pero depende del enfoque que le des
        queryFn: () => getProductByIdAction(id),
        retry: false,
        staleTime: 1000 * 60 * 5, //5 minutos
    });

    //TODO MUTACION

    const productMutation = useMutation({
        mutationFn: createUpdateProductAction,
        onSuccess: (productResponse: Product) => {
            //Aca se maneja para que leugo de cada post  o path se haga el refresh de las vistas ya que el producto ha cambiado o ha sido actualizado o creado. se invalida las keys que se tenian de las grids o producto solo.
            queryClient.setQueryData(
                ["product", { id: productResponse.id }],
                productResponse
            );
            queryClient.invalidateQueries({ queryKey: ["products"] }); //Para que se actualize los productos en el grid de productos.
            // queryClient.invalidateQueries({
            //     queryKey: ["product", { id: productResponse.id }], //se hace id:productresponde.id porque necesitamos que se llame id el valor porque asi definimos el key en el cacheo de el getProduct entonces es lo mismo que poner productreponse.id solo pero le estamos igualando el nombre
            // });
        },
    });

    // const handleSubmitForm = async (productLike: Partial<Product>) => {
    //     //El partial convierte el objeto pasado a todas sus propiedades opcionales
    //     console.log(productLike);
    // };

    return { productQuery, productMutation };
};
