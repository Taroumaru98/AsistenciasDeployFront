<template>
  <div class="background-container">
    <q-card class="request-reset-card">
      <q-card-section class="card-header">
        <div class="text-h6">Restablecer Contraseña</div>
      </q-card-section>

      <q-card-section class="card-body">
        <q-input
          v-model="email"
          filled
          label="Correo Electrónico"
          dense
          class="input-field"
        />
      </q-card-section>

      <q-card-actions align="center" class="card-actions">
        <q-btn
          :loading="loading"
          class="reset-button"
          @click="handleButtonClick"
          :label="buttonLabel"
        />
        <template v-slot:loading>
          <q-spinner color="white" size="1em" :thickness="10" />
        </template>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUsuariosStore } from '../stores/usuarios.js';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const useUsuarios = useUsuariosStore();
const loading = ref(false);
const isResetRequested = ref(false); // Para controlar si se ha enviado el correo
const buttonLabel = ref('Enviar Enlace de Restablecimiento');

const requestPasswordReset = async () => {
  if (email.value.trim()) {
    loading.value = true;
    try {
      const res = await useUsuarios.requestPasswordReset(email.value.trim());
      if (res.status === 200) {
        isResetRequested.value = true;
        buttonLabel.value = 'Regresar'; // Cambiar el texto del botón
      }
    } catch (error) {
      console.error('Error al solicitar restablecimiento de contraseña:', error);
    } finally {
      loading.value = false;
    }
  } else {
    console.warn('El campo de correo electrónico no puede estar vacío.');
  }
};

const handleButtonClick = () => {
  if (isResetRequested.value) {
    router.push('/'); // Regresar a la página de inicio de sesión
  } else {
    requestPasswordReset();
  }
};
</script>

<style scoped>
.background-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('https://img.freepik.com/foto-gratis/hombre-negocios-examen-papeles-tabla_1262-3706.jpg?t=st=1725590410~exp=1725594010~hmac=d72e9355595bb584feeba2ea8604d8090c8cea810ea3ab95ed1cd85bfd7a5713&w=1380');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  margin: 0;
}

.request-reset-card {
  width: 400px;
  max-width: 90%;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.card-header {
  background-color: #2F7D32;
  color: white;
  border-radius: 12px 12px 0 0;
  padding: 16px;
  text-align: center;
}

.card-body {
  padding: 16px;
}

.input-field {
  background-color: #f1f8e9;
  border: 1px solid #c8e6c9;
  border-radius: 8px;
}

.card-actions {
  padding: 16px;
}

.reset-button {
  background-color: #2F7D32;
  color: white;
  border-radius: 8px;
  font-weight: bold;
}
</style>
