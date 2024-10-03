import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { Notify } from "quasar";
import { useUsuariosStore } from "../stores/usuarios.js";

export const useBitacorasStore = defineStore("Bitacora", () => {
  const useUsuarios = useUsuariosStore();
  const token = ref("");

  const registrarAsistencia = async (cc) => {
    try {
      const r = await axios.post(
        "http://localhost:4500/api/Bitacoras",
        { cc }
      );
      Notify.create({
        type: "positive",
        message: "Bitácora creada correctamente",
      });
      return r.data;
    } catch (error) {
      console.log(error);
      Notify.create({
        type: "negative",
        message: "Hubo un error al crear la bitácora",
      });
      return error;
    }
  };

  // Listar todas las bitácoras
  const listarBitacoras = async () => {
    try {
      const response = await axios.get("http://localhost:4500/api/Bitacoras/Listar", {
        headers: {
          "x-token": useUsuarios.xtoken,
        },
      });
      return response;
    } catch (error) {
      console.error("Error al listar bitácoras:", error);
      Notify.create({
        type: "negative",
        message: "Error al listar las bitácoras.",
      });
      return error;
    }
  };

  // Listar bitácoras por fechas
  const listarBitacorasFecha = async (fechaInicio, fechaFin) => {
    try {
      const response = await axios.get("http://localhost:4500/api/Bitacoras/ListarPorFechas", {
        headers: {
          "x-token": useUsuarios.xtoken,
        },
        params: {
          fechaInicio,
          fechaFin
        }
      });
      return response;
    } catch (error) {
      console.error("Error al listar bitácoras por fechas:", error);
      Notify.create({
        type: "negative",
        message: "Error al listar las bitácoras por fechas.",
      });
      return error;
    }
  };

  // Listar bitácoras por aprendiz
  const listarBitacorasPorAprendiz = async (id) => {
    try {
      const response = await axios.get(`http://localhost:4500/api/Bitacoras/ListarAprendis/${id}`, {
        headers: {
          "x-token": useUsuarios.xtoken,
        },
      });
      return response;
    } catch (error) {
      console.error("Error al listar bitácoras por aprendiz:", error);
      Notify.create({
        type: "negative",
        message: "Error al listar las bitácoras por aprendiz.",
      });
      return error;
    }
  };

  // Listar bitácoras por ficha
  const listarBitacorasPorFicha = async (id) => {
    if (!id || typeof id !== 'string') {
      console.error("ID de ficha no válido:", id);
      Notify.create({
        type: "negative",
        message: "ID de ficha no válido.",
      });
      return null; // Devolver null si el ID no es válido
    }
  
    try {
      const response = await axios.get(`http://localhost:4500/api/Bitacoras/ListarFicha/${id}`, {
        headers: {
          "x-token": useUsuarios.xtoken,
        },
      });
      return response.data; // Solo devolver los datos
    } catch (error) {
      console.error("Error al listar bitácoras por ficha:", error);
      Notify.create({
        type: "negative",
        message: "Error al listar las bitácoras por ficha.",
      });
      return null; // Devolver null si hay un error
    }
  };
  
  

  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      console.log("ID:", id, "Nuevo Estado:", nuevoEstado);
      const response = await axios.put(`http://localhost:4500/api/Bitacoras/actualizarEstado/${id}`, 
        { estado: nuevoEstado }, 
        {
          headers: {
            "x-token": useUsuarios.xtoken,
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      throw error;
    }
  };

  return {
    registrarAsistencia,
    listarBitacoras,
    listarBitacorasFecha,
    listarBitacorasPorAprendiz,
    listarBitacorasPorFicha,
    actualizarEstado,
    token
  };
}, { persist: true });
