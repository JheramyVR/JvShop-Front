import { tesloApi } from "@/api/tesloApi";
import type { Product } from "@/interfaces/product.interface";
import { sleep } from "@/lib/sleep";

export const createUpdateProductAction = async (
    productLike: Partial<Product> & { files?: File[] }
): Promise<Product> => {
    await sleep(1500); //Opcional : simula demora real de backend
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, user, images = [], files = [], ...dataRest } = productLike; //files=[] significa si no viene files entonces un arreglo vacio asi se lee

    const isCreating = id === "new";

    dataRest.stock = Number(dataRest.stock || 0);
    dataRest.price = Number(dataRest.price || 0);

    //Preparar las imagenes
    if (files.length > 0) {
        const newImageNames = await uploadFiles(files); //pasa los archivos tal cual a la funcion que sube los archivos a la api. y recibe los nombres de los archivos.
        console.log(
            "nombres de las imagenes que se regreso en la api.",
            newImageNames
        );
        //La idea es que images sea del mismo formato que newimagesnames que es nombre.extension y no el prefijo , porque asi tenemos que mandar todo luego al post o actualizacion o path , entonces ahi que asegurarse de eso.
        images.push(...newImageNames); //Agrega a la propiedad images los nuevos nombres que devuelve la api al subir los archivos (devuelve nombre.extesion sin prefijo).
        console.log("se agrego imagenes o imagen", images);

        //eso lo hace porque el post o path que hara al actualizar o crear un producto no sabe aun de nuevas imagenes,yq que estas son subidas por su cuenta , pero al actualizar el producto este se guiara por la propiedad images que le pasemos (arreglo de nombres.extesion) no de archivos.
    }

    console.log(files);

    const { data } = await tesloApi<Product>({
        url: isCreating ? "/products" : `/products/${id}`,
        method: isCreating ? "POST" : "PATCH",
        data: {
            ...dataRest,
            images: images,
        },
    });

    return {
        ...data,
        images: data.images.map((image) => {
            if (image.includes("http")) return image;
            return `${import.meta.env.VITE_API_URL}/files/product/${image}`;
        }),
    };
};

export interface FileUploadResponse {
    secureUrl: string;
    fileName: string;
}

//Funcion que sube un arreglo de archivos a la api.
const uploadFiles = async (files: File[]) => {
    const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const { data } = await tesloApi.post<FileUploadResponse>(
            "/files/product",
            formData
        );

        return data.fileName;
    }); //Retorna todas las promesas que estan ejecutandose
    const uploadedFileNames = await Promise.all(uploadPromises); //Espera que terminen de ejecutarse las promesas.
    return uploadedFileNames; //retorna los datos.
};

/*
Cada await dentro del map espera solo dentro de esa promesa, para que cada promesa devuelva data.fileName.

Pero map no espera; crea todas las promesas inmediatamente., ya que no pertenece a la funcion async que hace el await.

Promise.all es el que espera a que todas las promesas se resuelvan para devolver el array final.

Exacto, el map solo crea las promesas, no espera a que terminen. Cada promesa “recuerda” la operación que le asignaste, es decir, la llamada a tesloApi.post.

Cuando haces map(async file => { ... }), lo que obtienes inmediatamente es un array de promesas.

Cada promesa contiene internamente la función que hará la petición y almacenará el resultado cuando termine.

El map no hace la llamada “de nuevo”; la llamada se ejecuta automáticamente porque la función async se invoca durante el map.

Luego, Promise.all(uploadPromises) simplemente espera que todas esas promesas que ya existen se resuelvan y devuelve sus resultados.*/
