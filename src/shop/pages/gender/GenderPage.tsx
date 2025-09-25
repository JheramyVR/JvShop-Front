import { CustomPagination } from "@/components/custom/CustomPagination";
import { CustomJumbotton } from "@/shop/components/CustomJumbotton";
import { ProductsGrid } from "@/shop/components/ProductsGrid";
import { useProducts } from "@/shop/hooks/useProducts";
import { useParams } from "react-router";

export const GenderPage = () => {
    const { gender } = useParams();
    const { data } = useProducts();

    //Entregamos solo los productos segun gender.

    const genderLabel =
        gender === "men" ? "Hombres" : gender === "women" ? "Mujeres" : "Niños";

    return (
        <>
            <CustomJumbotton title={`Productos para ${genderLabel}`} />
            <ProductsGrid products={data ? data.products : []} />
            <CustomPagination totalPages={data ? data.pages : 0} />
        </>
    );
};
