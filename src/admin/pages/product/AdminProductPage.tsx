// https://github.com/Klerith/bolt-product-editor

import { Navigate, useNavigate, useParams } from "react-router";
import { useProduct } from "@/admin/hooks/useProduct";
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreenLoading";
import { ProductForm } from "./ui/ProductForm";
import type { Product } from "@/interfaces/product.interface";
import { toast } from "sonner";

export const AdminProductPage = () => {
    // Todo el componente y sus estados se mantienen mientras el URL (id) no cambie.
    // Si cambias de producto (nuevo id), React Router monta un nuevo componente y los estados se reinician.
    const { id } = useParams(); //Trae el id que estableciste del router.
    const navigate = useNavigate(); //Para redireccioner.
    const { productQuery, productMutation } = useProduct(id || "");

    const { isLoading, isError, data: product } = productQuery;

    const title = id === "new" ? "Nuevo producto" : "Editar producto";
    const subTitle =
        id === "new"
            ? "Aquí puedes crear un nuevo producto."
            : "Aquí puedes editar el producto.";

    const handleSubmit = async (
        productLike: Partial<Product> & { files?: File[] }
    ) => {
        await productMutation.mutateAsync(productLike, {
            onSuccess: (data) => {
                toast.success("Producto actualizado correctamente", {
                    position: "top-right",
                });
                navigate(`/admin/products/${data.id}`); //al actualizar o crear te manda denuevo a l
                console.log("navegasteee");
            },
            onError: (error) => {
                console.log(error);
                toast.error("Error al actualizar producto");
            },
        });
    };

    if (isError) {
        return <Navigate to="admin/products" />; //Si modifican el id de un producto te manda a la pagina de productos denuevo
    }

    if (isLoading) {
        return <CustomFullScreenLoading />;
    }

    if (!product) {
        return <Navigate to="/admin/products" />;
    }

    return (
        <ProductForm
            title={title}
            subTitle={subTitle}
            product={product}
            onSubmit={handleSubmit}
            isPosting={productMutation.isPending}
        />
    );
};
