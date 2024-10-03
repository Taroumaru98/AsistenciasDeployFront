import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { Notify } from "quasar";

export const useUsuariosStore = defineStore("usuario", () => {
  let xtoken = ref("");
  let usuario = ref({});
  let loading = ref(false);

  const listarUsuarios = async () => {
    try {
      let r = await axios.get("http://localhost:4500/api/Usuarios/listar", {
        headers: {
          "x-token": xtoken.value,
        },
      });
      console.log(r);
      return r;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const login = async (email, password) => {
    loading.value = true;
    try {
      let r = await axios.post("http://localhost:4500/api/Usuarios/login", {
        email: email,
        password: password,
      });
      xtoken.value = r.data.token;
      usuario.value = r.data.usuario;
      Notify.create({
        type: "positive",
        message: "Inicio de sesión exitoso",
      });
      return r;
    } catch (error) {
      console.log(error);
      Notify.create({
        type: "negative",
        message: "Error al iniciar sesión",
      });
      return error;
    }
    finally {
      loading.value = false;
    }
  }

  const logout = async () => {
    xtoken.value = ""
  }

  const activarDesactivarusuario = async (id) => {
    try {
      let res = await axios.put(
        `http://localhost:4500/api/Usuarios/activarDesactivar/${id}`,
        {},
        {
          headers: {
            "x-token": xtoken.value,
          },
        }
      );
      console.log('Respuesta del servidor:', res.data);

      const usuarioEstado = res.data.estado;
  
      if (usuarioEstado === 1) {
        Notify.create({
          color: "positive",
          message: "Usuario Activado Correctamente",
          icon:  "check",
          timeout: 2500,
        });
      } else if (usuarioEstado === 0) {
        Notify.create({
          color: "positive",
          message: "Usuario Desactivado Correctamente",
          icon:  "check",
          timeout: 2500,
        });
      }
  
      return res;

    } catch (error) {
      console.error(error);
      Notify.create({
        color: "negative",
        message: error.response?.data?.error || "Error al cambiar estado del usuario",
        icon: "error",
        timeout: 2500,
      });
      return error;
    }
  };
  

  const requestPasswordReset = async (email) => {
    loading.value = true;
    try {
      let r = await axios.post("http://localhost:4500/api/Usuarios/recuperar-contrasena", {
        email: email
      });
      Notify.create({
        type: "positive",
        message: "Enlace de restablecimiento enviado. Revisa tu correo electrónico.",
      });
      return r;
    } catch (error) {
      console.log(error);
      Notify.create({
        type: "negative",
        message: "Error al enviar el enlace de restablecimiento.",
      });
      return error;
    } finally {
      loading.value = false;
    }
  };

  const resetPassword = async (token, newPassword) => {
    loading.value = true;
    try {
      const response = await axios.post(`http://localhost:4500/api/Usuarios/restablecer-contrasena`, {
        token, 
        nuevaPassword: newPassword 
      });
      Notify.create({
        type: 'positive',
        message: 'Contraseña restablecida con éxito.'
      });
      return response;
    } catch (error) {
      console.error('Error al restablecer la contraseña:', error);
      Notify.create({
        type: 'negative',
        message: 'Error al restablecer la contraseña.'
      });
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const editarUsuario = async (id, emial, nom) => {
    console.log(id);
    try {
      let r = await axios.put(
        `http://localhost:4500/api/Usuarios/editar/${id}`,
        { email: emial, nombre: nom },
        {
          headers: {
            "x-token": xtoken.value,
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

  return {

    listarUsuarios,
    login,
    logout,
    xtoken,
    usuario,
    requestPasswordReset,
    resetPassword,
    loading,
    activarDesactivarusuario,
    editarUsuario
  };

}, { persist: true });