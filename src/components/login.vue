<template>
  <div class="background-container">
    <q-card class="login-card">
      <q-card-section class="card-header">
        <div class="text-h6">Iniciar Sesión</div>
      </q-card-section>

      <q-card-section class="card-body">
        <q-input
          v-model="email"
          filled
          label="Nombre de Usuario"
          dense
          class="input-field"
        />
        <q-input
          v-model="password"
          :type="passwordVisible ? 'text' : 'password'"
          filled
          label="Contraseña"
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
          :loading="useUsuarios.loading"
          class="login-button"
          @click="login()"
          label="Iniciar Sesión"
        />
        <template v-slot:loading>
          <q-spinner color="white" size="1em" :thickness="10" />
        </template>

        <!-- Enlace para restablecimiento de contraseña -->
        <q-btn
          flat
          class="forgot-password-btn"
          @click="goToResetPassword"
          label="¿Olvidaste tu contraseña?"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUsuariosStore } from "../stores/usuarios.js";
import { useRouter } from "vue-router";

const router = useRouter();
const email = ref('');
const password = ref('');
const passwordVisible = ref(false);  // Para controlar la visibilidad de la contraseña
const useUsuarios = useUsuariosStore();

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

const validateInputs = () => {
  // Elimina espacios en blanco al inicio y al final
  const trimmedEmail = email.value.trim();
  const trimmedPassword = password.value.trim();
  
  // Validación de campos vacíos o solo con espacios en blanco
  if (!trimmedEmail || !trimmedPassword) {
    return false; // Inputs no válidos
  }
  return true; // Inputs válidos
};

async function login() {
  if (validateInputs()) {
    try {
      let res = await useUsuarios.login(email.value.trim(), password.value.trim());
      console.log(res);
      if (res.status == 200) {
        router.push("/home");
      } else {
        console.error('Error en el inicio de sesión:', res.message);
      }
    } catch (error) {
      console.error('Error en el inicio de sesión:', error.message);
    }
  } else {
    console.warn('Los campos de usuario y contraseña no pueden estar vacíos.');
  }
}

// Función para ir a la página de restablecimiento de contraseña
const goToResetPassword = () => {
  router.push("/respassword");
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
  display: flex;
  flex-direction: column;
  align-items: center;
}

.login-button {
  background-color: #2F7D32;
  color: white;
  border-radius: 8px;
  font-weight: bold;
}

.forgot-password-btn {
  margin-top: 10px;
  color: #2F7D32;
}
</style>
