import axios from "axios";

const tesloApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

//TODO: interceptores

tesloApi.interceptors.request.use((config) => {
    //El config tiene todos los parametros que mandaste en una peticion.

    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("se envio el token");
    }
    //El token ahora se envia en toda peticion, lo necesite o no, get post patch todo lo que use tesloApi esto puede ser mas eficiente (que se envei solo cuando lo neceita) pero solo si lo necesitas.

    return config;
});

export { tesloApi };
