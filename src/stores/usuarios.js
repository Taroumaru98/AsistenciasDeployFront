import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { Notify } from "quasar";

export const useUsuariosStore = defineStore("usuario", () => {
  let xtoken = ref("");
  let usuario = ref("");
  let loading = ref(false);
  const listarUsuarios = async () => {
    try {
      let r = await axios.get("https://asistenciasdeploy.onrender.com/api/Usuarios/listar");
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
      let r = await axios.post("https://asistenciasdeploy.onrender.com/api/Usuarios/login", {
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

  const requestPasswordReset = async (email) => {
    loading.value = true;
    try {
      let r = await axios.post("https://asistenciasdeploy.onrender.com/api/Usuarios/recuperar-contrasena", {
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
      const response = await axios.post(`https://asistenciasdeploy.onrender.com/api/Usuarios/restablecer-contrasena`, {
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

  return {

    listarUsuarios,
    login,
    logout,
    xtoken,
    usuario,
    requestPasswordReset,
    resetPassword,
    loading
  };

}, { persist: true });