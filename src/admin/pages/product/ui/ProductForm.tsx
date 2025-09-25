import { AdminTitle } from "@/admin/components/AdminTitle";
import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";

import type { Product, Size } from "@/interfaces/product.interface";
import { SaveAll, Tag, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { cn } from "@/lib/utils";

interface Props {
    title: string;
    subTitle: string;
    product: Product;
    isPosting: boolean;

    //Methods

    onSubmit: (
        productLike: Partial<Product> & { files?: File[] } //se concatena a ese partialproduct el propiedad files
    ) => Promise<void>;
}

const availableSizes: Size[] = ["XS", "S", "M", "L", "XL", "XXL"];

interface FormInputs extends Product {
    //Extendemos la interfaz product
    files?: File[];
}

// Al presionar "Actualizar" o "Guardar cambios":
// 1. React vuelve a ejecutar el cuerpo del componente (todo el ProductForm), incluyendo el return y la inicialización de hooks.
// 2. Los props cambian (product con los datos nuevos del post).
// 3. Sin embargo, los estados locales de React y los estados manejados por React Hook Form **se mantienen**, porque React considera que el componente sigue siendo el mismo (misma URL).
// 4. Solo se re-renderiza el componente para reflejar los cambios de props en el JSX, pero no se reinicia ni se vuelven a inicializar los estados.
export const ProductForm = ({
    title,
    subTitle,
    product,
    onSubmit,
    isPosting,
}: Props) => {
    console.log("Hola");
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        reset, //Sirve para mandar a inicializar denuevo el formulario.
        setValue,
        watch,
    } = useForm<FormInputs>({
        // <FormInputs> tipa el formulario: el form solo aceptará propiedades y tipos definidos en esa interfaz.
        defaultValues: product,
    });

    useEffect(() => {
        // Cada vez que cambie el producto (por ejemplo, tras crear o actualizar),
        // reseteamos el formulario con los nuevos valores.
        // Esto asegura que los estados internos de useForm reflejen siempre el producto actual,
        // evitando inconsistencias con valores anteriores.
        reset(product);
    }, [product]); /// osea Useeefect para que cada que cambie el product osea cuando se actualize o cree el producto se vuelve a inizialiar los estados del form, es necesario ya que sino solo mantiene le ultimo estado anterior que tuvo el form y no cogera el nuevo que se paso del product del post que se hizo , lo cual puede que haya errores, no tendria que haber pero por buena practica mejor volver a resetear los estados del form con el nuevo product.

    const [dragActive, setDragActive] = useState(false);

    const filesWatch = watch("files") || [];
    const sizesWatch = watch("sizes"); //con el watch te da el estado osea renderiza cada que cambia el sizes.
    const tagsWatch = watch("tags");
    const stockWatch = watch("stock");

    const inputTag = useRef<HTMLInputElement>(null);

    const addTag = () => {
        const tagsSet = new Set(getValues("tags"));
        const lastTag: string = inputTag.current?.value ?? "";

        //Si el nuevo tag no es vacio y si no esta incluido ya en los tags actuales, entonces.
        if (lastTag.trim() && !Array.from(tagsSet).includes(lastTag.trim())) {
            tagsSet.add(lastTag);
            setValue("tags", Array.from(tagsSet));
            if (inputTag.current) {
                inputTag.current.value = "";
            }
            //lastTag="" no hacer eso porque lasttag obtiene un valor del inputtag el cual si es dinamico y referenciado que puedes modificar.
            // setProduct((prev) => ({
            //     ...prev,
            //     tags: [...prev.tags, newTag.trim()],
            // }));
        }
    };

    const removeTag = (tagToRemove: string) => {
        const tagsSet = new Set(getValues("tags"));
        tagsSet.delete(tagToRemove);
        setValue("tags", Array.from(tagsSet));

        // setProduct((prev) => ({
        //     ...prev,
        //     tags: prev.tags.filter((tag) => tag !== tagToRemove),
        // }));
    };

    const addSize = (size: Size) => {
        const sizeSet = new Set(getValues("sizes"));
        sizeSet.add(size);
        setValue("sizes", Array.from(sizeSet));

        // if (!product.sizes.includes(size)) {
        //     setProduct((prev) => ({
        //         ...prev,
        //         sizes: [...prev.sizes, size],
        //     }));
        // }
    };

    const removeSize = (size: Size) => {
        const sizeSet = new Set(getValues("sizes"));
        sizeSet.delete(size);
        setValue("sizes", Array.from(sizeSet));

        // setProduct((prev) => ({
        //     ...prev,
        //     sizes: prev.sizes.filter((size) => size !== sizeToRemove),
        // }));
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const files = e.dataTransfer.files;
        if (!files) return;
        //setFiles((prevFiles) => [...prevFiles, ...Array.from(files)]); //Se puede eliminar esto porque ya estmaos gestionando con el el hook form pero aun lo estamos usando para mostrar las imagenes asi que refactoriza

        //Verdadera gestion con estas lineas
        const currentFiles = getValues("files") || [];
        setValue("files", [...currentFiles, ...Array.from(files)]);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        if (!files) return;

        //setFiles((prevFiles) => [...prevFiles, ...Array.from(files)]); //Se puede eliminar esto porque ya estmaos gestionando con el el hook form

        //Verdadera gestion con estas lineas
        const currentFiles = getValues("files") || [];
        setValue("files", [...currentFiles, ...Array.from(files)]);
    };

    return (
        <form
            onSubmit={handleSubmit((data) => {
                onSubmit({ ...data, images: transformImages(data.images) }); //Formateamos cadena de images osea sus nombres como el backend lo espera (nombre.extension)
            })}
        >
            {/* handleSubmit es una función que hace varias cosas:

                Evita el comportamiento por defecto del form (event.preventDefault()).

                Valida todos los campos según las reglas que pasaste en register o formState.errors.

                Si pasa la validación, llama a tu onSubmit con un objeto que tiene todos los valores actuales de los inputs. */}

            {/* Cancelar y guardar cambios */}
            <div className="flex justify-between items-center">
                <AdminTitle title={title} subTitle={subTitle} />
                <div className="flex justify-end mb-10 gap-4">
                    <Button variant="outline" type="button">
                        <Link
                            to="/admin/products"
                            className="flex items-center gap-2"
                        >
                            <X className="w-4 h-4" />
                            Cancelar
                        </Link>
                    </Button>

                    <Button type="submit" disabled={isPosting}>
                        <SaveAll className="w-4 h-4" />
                        Guardar cambios
                    </Button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                            <h2 className="text-xl font-semibold text-slate-800 mb-6">
                                Información del producto
                            </h2>

                            <div className="space-y-6">
                                {/* Titulo */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Título del producto
                                    </label>
                                    <input
                                        type="text"
                                        {...register("title", {
                                            required: true,
                                        })}
                                        className={cn(
                                            "w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200",
                                            {
                                                "border-red-500": errors.title,
                                            }
                                        )}
                                        placeholder="Título del producto"
                                    />
                                    {errors.title && (
                                        <p className="text-red-500 text-sm">
                                            El título es requerido
                                        </p>
                                    )}
                                </div>

                                {/* Precio */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Precio ($)
                                        </label>
                                        <input
                                            type="number"
                                            {...register("price", {
                                                required: true,
                                                min: 1,
                                            })}
                                            className={cn(
                                                "w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200",
                                                {
                                                    "border-red-500":
                                                        errors.price,
                                                }
                                            )}
                                            placeholder="Precio del producto"
                                        />
                                        {errors.price && (
                                            <p className="text-red-500 text-sm">
                                                El precio debe ser mayor a 0
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            Stock del producto
                                        </label>
                                        <input
                                            type="number"
                                            {...register("stock", {
                                                required: true,
                                                min: 1,
                                            })}
                                            className={cn(
                                                "w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200",
                                                {
                                                    "border-red-500":
                                                        errors.stock,
                                                }
                                            )}
                                            placeholder="Stock del producto"
                                        />
                                        {errors.stock && (
                                            <p className="text-red-500 text-sm">
                                                El inventario debe ser mayor a 0
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Slug */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Slug del producto
                                    </label>
                                    <input
                                        type="text"
                                        // value={product.slug}
                                        // onChange={(e) =>
                                        //     handleInputChange(
                                        //         "slug",
                                        //         e.target.value
                                        //     )
                                        // }
                                        {...register("slug", {
                                            required: true,
                                            validate: (value) =>
                                                !/\s/.test(value) || //Prueba con exp reg que no haya espacios en blanco
                                                "El slug no puede contener espacios en blanco",
                                        })}
                                        className={cn(
                                            "w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200",
                                            {
                                                "border-red-500": errors.slug,
                                            }
                                        )}
                                        placeholder="Slug del producto"
                                    />
                                    {errors.slug && (
                                        <p className="text-red-500 text-sm">
                                            {errors.slug.message ||
                                                "El slug es requerido"}
                                        </p>
                                    )}
                                </div>

                                {/* Genero */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Género del producto
                                    </label>
                                    <select
                                        // value={product.gender}
                                        // onChange={(e) =>
                                        //     handleInputChange(
                                        //         "gender",
                                        //         e.target.value
                                        //     )
                                        // }
                                        {...register("gender")}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    >
                                        <option value="men">Hombre</option>
                                        <option value="women">Mujer</option>
                                        <option value="unisex">Unisex</option>
                                        <option value="kids">Niño</option>
                                    </select>
                                </div>

                                {/* Descripcion */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Descripción del producto
                                    </label>
                                    <textarea
                                        {...register("description", {
                                            required: true,
                                        })}
                                        rows={5}
                                        className={cn(
                                            "w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200",
                                            {
                                                "border-red-500":
                                                    errors.description,
                                            }
                                        )}
                                        placeholder="Descripción del producto"
                                    />
                                    {errors.description && (
                                        <p className="text-red-500 text-sm">
                                            La descripcion es requerida
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sizes */}
                        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                            <h2 className="text-xl font-semibold text-slate-800 mb-6">
                                Tallas disponibles
                            </h2>

                            <div className="space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    {availableSizes.map((size) => (
                                        <span
                                            key={size}
                                            className={cn(
                                                "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200",
                                                {
                                                    hidden: !sizesWatch.includes(
                                                        size
                                                    ), //Se gestiona para mostrar todas las tallas pero ocultar con display none cuando talla ya esta disponible osea se oculta, esto mantiene le orden de tallas
                                                }
                                            )}
                                        >
                                            {size}
                                            <button
                                                type="button"
                                                onClick={() => removeSize(size)}
                                                className="cursor-pointer ml-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>

                                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200">
                                    <span className="text-sm text-slate-600 mr-2">
                                        Añadir tallas:
                                    </span>
                                    {availableSizes.map((size) => (
                                        <button
                                            type="button"
                                            key={size}
                                            onClick={() => addSize(size)}
                                            disabled={sizesWatch.includes(size)}
                                            className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                                                sizesWatch.includes(size)
                                                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                                    : "bg-slate-200 text-slate-700 hover:bg-slate-300 cursor-pointer"
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                            <h2 className="text-xl font-semibold text-slate-800 mb-6">
                                Etiquetas
                            </h2>

                            <div className="space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    {tagsWatch.map(
                                        (
                                            tag //cada que cambia los tags en los estados que lo maneja el hook react form entonces renderiza denuevo para mostrar los nuevos tags.
                                        ) => (
                                            <span
                                                key={tag}
                                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200"
                                            >
                                                <Tag className="h-3 w-3 mr-1" />
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeTag(tag)
                                                    }
                                                    className="ml-2 text-green-600 hover:text-green-800 transition-colors duration-200"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        )
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <input
                                        ref={inputTag}
                                        type="text"
                                        // value={newTag}
                                        // onChange={(e) =>
                                        //     setNewTag(e.target.value)
                                        // }
                                        // onKeyDown={(e) =>
                                        //     e.key === "Enter" && addTag()
                                        // }
                                        onKeyDown={(e) => {
                                            if (
                                                e.key === "Enter" ||
                                                e.key === " " ||
                                                e.key === ","
                                            ) {
                                                //TODO: hacer el codigo.
                                                e.preventDefault();
                                                addTag();
                                            }
                                        }}
                                        placeholder="Añadir nueva etiqueta..."
                                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    />
                                    {/* <Button
                                        // onClick={addTag}
                                        className="px-4 py-2rounded-lg "
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button> */}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Product Images */}
                        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                            <h2 className="text-xl font-semibold text-slate-800 mb-6">
                                Imágenes del producto
                            </h2>

                            {/* Drag & Drop Zone - Zona donde sueltan imagenes o seleccionan imagnes */}
                            <div
                                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
                                    dragActive
                                        ? "border-blue-400 bg-blue-50"
                                        : "border-slate-300 hover:border-slate-400"
                                }`}
                                //eventos nativos de html de arrastrar y soltar
                                onDragEnter={handleDrag} //Objeto entra al area
                                onDragLeave={handleDrag} //Cuando sale sale del area
                                onDragOver={handleDrag} // cuando esta encima
                                onDrop={handleDrop} //Se suelta dentro del area
                            >
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleFileChange}
                                />
                                <div className="space-y-4">
                                    <Upload className="mx-auto h-12 w-12 text-slate-400" />
                                    <div>
                                        <p className="text-lg font-medium text-slate-700">
                                            Arrastra las imágenes aquí
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            o haz clic para buscar
                                        </p>
                                    </div>
                                    <p className="text-xs text-slate-400">
                                        PNG, JPG, WebP hasta 10MB cada una
                                    </p>
                                </div>
                            </div>

                            {/* Current Images */}
                            <div className="mt-6 space-y-3">
                                <h3 className="text-sm font-medium text-slate-700">
                                    Imágenes actuales
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {product.images.map((image, index) => (
                                        <div
                                            key={index}
                                            className="relative group"
                                        >
                                            <div className="aspect-square bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center">
                                                <img
                                                    src={image}
                                                    alt="Product"
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            </div>
                                            <button className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                <X className="h-3 w-3" />
                                            </button>
                                            <p className="mt-1 text-xs text-slate-600 truncate">
                                                {image}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Imagenes por cargas */}
                            <div
                                className={cn("mt-6 space-y-3", {
                                    hidden: filesWatch.length === 0,
                                })}
                            >
                                <h3 className="text-sm font-medium text-slate-700">
                                    Imágenes por Cargar
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {filesWatch.map((file, index) => (
                                        <img
                                            src={URL.createObjectURL(file)} //Para que nos de el url de el objeto file que seria el url de la imagen.
                                            alt="Product"
                                            key={index}
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Product Status */}
                        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                            <h2 className="text-xl font-semibold text-slate-800 mb-6">
                                Estado del producto
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <span className="text-sm font-medium text-slate-700">
                                        Estado
                                    </span>
                                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                        Activo
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <span className="text-sm font-medium text-slate-700">
                                        Inventario
                                    </span>
                                    <span
                                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            stockWatch > 5
                                                ? "bg-green-100 text-green-800"
                                                : stockWatch > 0
                                                ? "bg-yellow-100 text-yellow-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {stockWatch > 5
                                            ? "En stock"
                                            : stockWatch > 0
                                            ? "Bajo stock"
                                            : "Sin stock"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <span className="text-sm font-medium text-slate-700">
                                        Imágenes
                                    </span>
                                    <span className="text-sm text-slate-600">
                                        {product.images.length} imágenes
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <span className="text-sm font-medium text-slate-700">
                                        Tallas disponibles
                                    </span>
                                    <span className="text-sm text-slate-600">
                                        {sizesWatch.length} tallas
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

//Funcion para extraer nombre.extension de cada imagen (util para cuando se mandara al api para un post o path para actualizar ya que el backend espera solo nombre.extension no el prefijo localhost.../.../nombre.extesion .)
const transformImages = (images: string[]) => {
    return images.map((img) => {
        const parts = img.split("/"); // separar por '/'
        return parts[parts.length - 1]; // quedarse solo con el nombre.extension osea el ultimo elemento puedes usar tambien .pop si quieres que elimina y retorna el ultimo elemento de un array
    });
};
