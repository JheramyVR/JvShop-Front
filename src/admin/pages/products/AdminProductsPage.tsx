import { AdminTitle } from "@/admin/components/AdminTitle";
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreenLoading";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { currencyFormatter } from "@/lib/currency-formatter";
import { useProducts } from "@/shop/hooks/useProducts";
import { PencilIcon, PlusIcon } from "lucide-react";
import { Link } from "react-router";

export const AdminProductsPage = () => {
    const { data, isLoading, isError } = useProducts();
    const products = data?.products;

    if (isLoading) return <CustomFullScreenLoading />;
    if (isError) return <p>Error cargando productos</p>;
    if (!products?.length) return <p>No hay productos</p>;

    return (
        <>
            <div className="flex justify-between items-center">
                <AdminTitle
                    title="Productos"
                    subTitle="Aquí puedes very administrar tus productos"
                />

                <div className="flex justify-end mb-10 gap-4">
                    {" "}
                    <Link to="/admin/products/new">
                        <Button>
                            <PlusIcon />
                            Nuevo Producto
                        </Button>
                    </Link>
                </div>
            </div>

            <Table className="bg-white p-10 shadow-xs border border-gray-200 mb-10">
                <TableHeader>
                    <TableRow>
                        <TableHead>Imagen</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Inventario</TableHead>
                        <TableHead>Tallas</TableHead>

                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {/* <TableRow>
                        <TableCell className="font-medium">1</TableCell>
                        <TableCell>
                            <img
                                src="https://placehold.co/250x250"
                                alt="Product"
                                className="w-20 h-20 object-cover rounded-md"
                            />
                        </TableCell>
                        <TableCell>Producto 1</TableCell>
                        <TableCell>$250.00</TableCell>

                        <TableCell>Categoría 1</TableCell>
                        <TableCell>100 stock</TableCell>

                        <TableCell>XS,S,L</TableCell>

                        <TableCell className="text-right">
                            <Link to={`/admin/products/t-shirt-teslo`}>
                                Editar
                            </Link>
                        </TableCell>
                    </TableRow> */}
                    {data?.products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell>
                                <img
                                    src={product.images[0]}
                                    alt={product.title}
                                    className="w-20 h-20 object-cover rounded-md"
                                />
                            </TableCell>
                            <TableCell>
                                <Link
                                    to={`/admin/products/${product.id}`}
                                    className="hover:text-blue-500 underline"
                                >
                                    {product.title}
                                </Link>
                            </TableCell>
                            <TableCell>
                                {currencyFormatter(product.price)}
                            </TableCell>

                            <TableCell>{product.gender}</TableCell>
                            <TableCell>{product.stock}</TableCell>

                            <TableCell>{product.sizes.join(", ")}</TableCell>

                            <TableCell className="text-right">
                                <Link to={`/admin/products/${product.id}`}>
                                    <PencilIcon className="w-4 h-4 text-blue-500" />
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <CustomPagination totalPages={data ? data.pages : 0} />
        </>
    );
};
