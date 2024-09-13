<template>
  <div class="background-container">

    <q-card class="login-card" style="width: 400px;">
      <q-card-section style="background-color: #2F7D32; color: white;">
        <div class="text-h6">Registrar Asistencia</div>
      </q-card-section>

      <q-card-section>
        <q-input v-model="cc" filled label="Número de Documento" dense />
      </q-card-section>

      <q-card-actions align="center">
        <q-btn
          :loading="loading"
          class="registrobtn"
          label="Registrar"
          @click="registrarAsistencia"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useBitacorasStore } from '../stores/bitacoras.js';
import { useRouter } from 'vue-router';

const router = useRouter();
const cc = ref('');
const loading = ref(false);
const useBitacora = useBitacorasStore();

const registrarAsistencia = async () => {
  if (!cc.value.trim()) {
    // Si el campo está vacío, puedes mostrar una notificación o mensaje de error
    console.log('Por favor ingresa un número de documento.');
    return;
  }

  loading.value = true;

  try {
    // Llamada a la store para registrar la asistencia
    await useBitacora.registrarAsistencia(cc.value);

    // Una vez registrado, puedes redirigir o limpiar el campo si lo deseas
    cc.value = '';
  } catch (error) {
    console.error('Error al registrar asistencia:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.background-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('https://www.sena.edu.co/es-co/Noticias/PublishingImages/LMS_2024.jpg');
  background-size: cover;
  background-position: center;
  min-height: 100vh; /* Ocupa toda la altura de la pantalla */
  margin: 0;
}

.login-card {
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

.registrobtn {
  background-color: #2F7D32;
  color: white;
  border-radius: 8px;
  font-weight: bold;
}
</style>