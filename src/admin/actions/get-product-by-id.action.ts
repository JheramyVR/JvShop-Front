import { tesloApi } from "@/api/tesloApi";
import type { Product } from "@/interfaces/product.interface";

export const getProductByIdAction = async (id: string): Promise<Product> => {
    if (!id) throw new Error("Id is required");

    if (id === "new") {
        return {
            id: "new",
            title: "",
            price: 0,
            description: "",
            slug: "",
            stock: 0,
            sizes: [],
            gender: "men",
            tags: [],
            images: [],
        } as unknown as Product;
        /*
        es un truco de TypeScript para forzar el tipo. Te explico:

        Lo que devuelves es un objeto literal con todas las propiedades de Product.

        Pero como Product seguramente tiene validaciones más estrictas (por ejemplo: tipos exactos, campos opcionales/obligatorios, union types en gender, etc.), TypeScript puede quejarse y no te deje hacer el cast directo con as Product.

        Para saltarse esa restricción, se usa as unknown as Product:

        Primero se castea a unknown → cualquier cosa puede convertirse en unknown.

        Luego de unknown a Product → y TypeScript ya no protesta.

        Es básicamente decirle al compilador:

        “Confía en mí, este objeto es un Product, aunque tú no lo sepas comprobar bien.” 😅
        
        */
    }

    const { data } = await tesloApi.get<Product>(`/products/${id}`);

    const images = data.images.map((image) => {
        if (image.includes("http")) return image;
        return `${import.meta.env.VITE_API_URL}/files/product/${image}`;
    });

    console.log("pasaste por el get de un product");

    return {
        ...data,
        images,
    };
};
