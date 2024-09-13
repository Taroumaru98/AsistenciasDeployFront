<template>
  <div class="background-container">
    <q-card class="reset-password-card">
      <q-card-section class="card-header">
        <div class="text-h6">Restablecer Contraseña</div>
      </q-card-section>

      <q-card-section class="card-body">
        <q-input
          v-model="newPassword"
          :type="passwordVisible ? 'text' : 'password'"
          filled
          label="Nueva Contraseña"
          dense
          class="input-field"
        >
          <template v-slot:append>
            <q-btn
              flat
              round
              dense
              icon="visibility"
              @click="togglePasswordVisibility"
            />
          </template>
        </q-input>
        <q-input
          v-model="confirmPassword"
          :type="passwordVisible ? 'text' : 'password'"
          filled
          label="Confirmar Contraseña"
          dense
          class="q-mt-md input-field"
        >
          <template v-slot:append>
            <q-btn
              flat
              round
              dense
              icon="visibility"
              @click="togglePasswordVisibility"
            />
          </template>
        </q-input>
      </q-card-section>

      <q-card-actions align="center" class="card-actions">
        <q-btn
          :loading="loading"
          class="reset-button"
          @click="resetPassword"
          label="Actualizar Contraseña"
        />
        <template v-slot:loading>
          <q-spinner color="white" size="1em" :thickness="10" />
        </template>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUsuariosStore } from '../stores/usuarios.js';

const route = useRoute();
const router = useRouter();
const useUsuarios = useUsuariosStore();
const newPassword = ref('');
const confirmPassword = ref('');
const loading = ref(false);

// Obtener el token desde `data` (ajusta la propiedad `data` según sea necesario)
const token = ref(localStorage.getItem('resetToken') || ''); // Recupera el token almacenado

// Función para restablecer la contraseña
const resetPassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    alert('Las contraseñas no coinciden.');
    return;
  }

  if (!token.value) {
    alert('Token de restablecimiento no válido.');
    return;
  }

  loading.value = true;
  try {
    await useUsuarios.resetPassword(token.value, newPassword.value);
    router.push('/login'); // Redirigir al login después de restablecer la contraseña
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
  } finally {
    loading.value = false;
  }
};

// Al montar el componente, extraemos el token desde localStorage si no se ha extraído anteriormente
onMounted(() => {
  if (!token.value) {
    console.error('Token no encontrado en localStorage.');
  } else {
    console.log('Token extraído:', token.value); // Verifica el token en consola
  }
});
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

.reset-password-card {
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
