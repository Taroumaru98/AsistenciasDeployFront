import { defineStore } from "pinia";
import axios from "axios";
import { Notify } from "quasar";
import { useUsuariosStore } from "../stores/usuarios.js";

export const useAprendizStore = defineStore("Aprendiz", () => {
    const useUsuarios = useUsuariosStore();

    const listarAprendiz = async () => {
        try {
            let res = await axios.get("http://localhost:4500/api/Aprendices/Listar", {
                headers: {
                    "x-token": useUsuarios.xtoken,
                },
            });
            return res;
        } catch (error) {
            console.error(error);
            return error;
        }
    };

    const guardarAprediz = async (cc, nombre, email, telefono, IdFicha) => {
        try {
            let res = await axios.post(
                "http://localhost:4500/api/Aprendices",
                {
                    cc: cc,
                    nombre: nombre,
                    email: email,
                    telefono: telefono,
                    IdFicha: IdFicha
                },
                {
                    headers: {
                        "x-token": useUsuarios.xtoken,
                    },
                }
            );
            Notify.create({
                color: "positive",
                message: "Aprendiz creado exitosamente",
                icon: "check",
                timeout: 2500,
            });
            return res;
        } catch (error) {
            console.error(error);
            Notify.create({
                color: "negative",
                message: error.response?.data?.error || "Error al crear aprendiz",
                icon: "error",
                timeout: 2500,
            });
            return error;
        }
    };

    const editarAprendiz = async (id, data) => {
        console.log(id);
        try {
            let r = await axios.put(
                `http://localhost:4500/api/Aprendices/editar/${id}`,
                data, {
                headers: {
                    "x-token": useUsuarios.xtoken,
                },
            }
            );
            console.log(r);
            Notify.create({
                color: "positive",
                message: "Edición exitosa",
                icon: "error",
                timeout: 2500,
            });
            return r;
        } catch (error) {
            console.log(error);
            Notify.create({
                color: "negative",
                message: error.response.data.errors[0].msg,
                icon: "error",
                timeout: 2500,
            });
            return error;
        }
    };

    const activarDesactivarAprendiz = async (id) => {
        try {
            let res = await axios.put(
                `http://localhost:4500/api/Aprendices/activar/${id}`,
                {},
                {
                    headers: {
                        "x-token": useUsuarios.xtoken,
                    },
                }
            );
            Notify.create({
                color: res.data.estado == 1 ? "positive" : "negative",
                message: res.data.estado == 1 ? "Aprendiz activado" : "Aprendiz desactivado",
                icon: res.data.estado == 1 ? "check" : "close",
                timeout: 2500,
            });
            return res;
        } catch (error) {
            console.error(error);
            Notify.create({
                color: "negative",
                message: error.response?.data?.error || "Error al cambiar estado del aprendiz",
                icon: "error",
                timeout: 2500,
            });
            return error;
        }
    };

    return {
        listarAprendiz,
        guardarAprediz,
        editarAprendiz,
        activarDesactivarAprendiz,
    };
});
