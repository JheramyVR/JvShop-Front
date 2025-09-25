//Archivo creado por mi xd
//Funcion que formatea numeros en formato de monedas.
export const currencyFormatter = (value: number) => {
    return value.toLocaleString("es-ES", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
    });
};
