import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "react-router";

export const FilterSidebar = () => {
    //Recuerda siempre que un setSearchParams() siempre dispara un re-render y gracias a eso se maneja el flujo de este componente. Osea vuelve la URL un estado.

    const [SearchParams, setSearchParams] = useSearchParams(); //Obtenemos los parametros de busqueda ej: https://midominio.com/productos?categoria=ropa&orden=asc

    const currentSizes = SearchParams.get("sizes")?.split(",") || []; //xs,l,xl
    const currentPrices = SearchParams.get("prices") || "any";

    //Gestion de rangos de precios.
    const handlePriceChanged = (price: string) => {
        /* Forma mas legible
        if (currentPrices.includes(price)) {
            newPrice = currentPrices.filter((p) => p != price);
        } else {
            newPrice = [...currentPrices, price];
        }
        */
        SearchParams.set("page", "1");
        SearchParams.set("prices", price);
        setSearchParams(SearchParams);
    };

    //Gesion de eleccion de tallas.
    const handleSizeChanged = (size: string) => {
        const newSizes = currentSizes.includes(size)
            ? currentSizes.filter((s) => s != size)
            : [...currentSizes, size];

        SearchParams.set("page", "1");
        if (newSizes.length > 0) {
            SearchParams.set("sizes", newSizes.join(","));
        } else {
            SearchParams.delete("sizes"); // 👈 elimina el param si está vacío
        }
        setSearchParams(SearchParams);
    };

    const sizes = [
        { id: "xs", label: "XS" },
        { id: "s", label: "S" },
        { id: "m", label: "M" },
        { id: "l", label: "L" },
        { id: "xl", label: "XL" },
        { id: "xxl", label: "XXL" },
    ];

    return (
        <div className="w-64 space-y-6">
            <div>
                <h3 className="font-semibold text-lg mb-4">Filtros</h3>
            </div>

            {/* Sizes */}
            <div className="space-y-4">
                <h4 className="font-medium">Tallas</h4>
                <div className="grid grid-cols-3 gap-2">
                    {sizes.map((size) => (
                        <Button
                            onClick={() => handleSizeChanged(size.id)}
                            key={size.id}
                            variant={
                                currentSizes.includes(size.id)
                                    ? "default"
                                    : "outline"
                            }
                            // variant="outline"
                            size="sm"
                            className="h-8"
                        >
                            {size.label}
                        </Button>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Price Range */}
            <div className="space-y-4">
                <h4 className="font-medium">Precio</h4>
                <RadioGroup defaultValue="" className="space-y-3">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem
                            value="any"
                            id="priceAny"
                            checked={currentPrices === "any"}
                            onClick={() => handlePriceChanged("any")}
                        />
                        <Label
                            htmlFor="priceAny"
                            className="text-sm cursor-pointer"
                        >
                            Cualquier precio
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem
                            value="0-50"
                            id="price1"
                            checked={currentPrices === "0-50"}
                            onClick={() => handlePriceChanged("0-50")}
                        />
                        <Label
                            htmlFor="price1"
                            className="text-sm cursor-pointer"
                        >
                            $0 - $50
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem
                            value="50-100"
                            id="price2"
                            checked={currentPrices === "50-100"}
                            onClick={() => handlePriceChanged("50-100")}
                        />
                        <Label
                            htmlFor="price2"
                            className="text-sm cursor-pointer"
                        >
                            $50 - $100
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem
                            value="100-200"
                            id="price3"
                            checked={currentPrices === "100-200"}
                            onClick={() => handlePriceChanged("100-200")}
                        />
                        <Label
                            htmlFor="price3"
                            className="text-sm cursor-pointer"
                        >
                            $100 - $200
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem
                            value="200+"
                            id="price4"
                            checked={currentPrices === "200+"}
                            onClick={() => handlePriceChanged("200+")}
                        />
                        <Label
                            htmlFor="price4"
                            className="text-sm cursor-pointer"
                        >
                            $200+
                        </Label>
                    </div>
                </RadioGroup>
            </div>
        </div>
    );
};
