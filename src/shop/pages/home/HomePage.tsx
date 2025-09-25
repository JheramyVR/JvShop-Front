import { CustomPagination } from "@/components/custom/CustomPagination";
import { CustomJumbotton } from "@/shop/components/CustomJumbotton";
import { ProductsGrid } from "@/shop/components/ProductsGrid";
import { useProducts } from "@/shop/hooks/useProducts";

export const HomePage = () => {
    const { data, isLoading, isError } = useProducts();

    // if (isLoading === true) {
    //     console.log("espera estoy cargando");
    // } else {
    //     console.log(data);
    // }

    return (
        <>
            <CustomJumbotton title="Todos los productos" />
            <ProductsGrid products={data ? data.products : []} />
            <CustomPagination totalPages={data ? data.pages : 0} />
        </>
    );
};
