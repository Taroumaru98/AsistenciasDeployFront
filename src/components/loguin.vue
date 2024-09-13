<template>
  <q-page class="flex flex-center" style="background-image: url('https://img.freepik.com/foto-gratis/hombre-negocios-examen-papeles-tabla_1262-3706.jpg?t=st=1725590410~exp=1725594010~hmac=d72e9355595bb584feeba2ea8604d8090c8cea810ea3ab95ed1cd85bfd7a5713&w=1380'); background-size: cover; background-position: center; min-height: 85.3vh;">
    <q-card class="q-pa-md" style="width: 400px; max-width: 90%; border-radius: 12px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); overflow: hidden;">
      <q-card-section style="background-color: #2F7D32; color: white; border-radius: 12px 12px 0 0; padding: 16px;">
        <div class="text-h6" style="font-weight: bold; text-align: center;">
          INICIAR SESIÓN
        </div>
      </q-card-section>

      <q-card-section style="padding: 16px;">
        <q-input
          v-model="email"
          filled
          label="Nombre de Usuario"
          dense
          style="background-color: #f1f8e9; border: 1px solid #c8e6c9; border-radius: 8px;"
        />
        <q-input
          v-model="password"
          :type="passwordVisible ? 'text' : 'password'"
          filled
          label="Contraseña"
          dense
          class="q-mt-md"
          style="background-color: #f1f8e9; border: 1px solid #c8e6c9; border-radius: 8px;"
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

      <q-card-actions align="center" style="padding: 16px;">
        <q-btn
          :loading="useUsuarios.loading"
          :style="{ backgroundColor: '#2F7D32', color: 'white', borderRadius: '8px', fontWeight: 'bold' }"
          @click="login()"
          label="Iniciar Sesión"
        />
        <template v-slot:loading>
          <q-spinner color="white" size="1em" :thickness="10" />
        </template>
      </q-card-actions>
    </q-card>
  </q-page>
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

async function login() {
  try {
    let res = await useUsuarios.login(email.value, password.value);
    console.log(res);
    if (res.status == 200) {
      router.push("/home");
    } else {
      console.error('Error en el inicio de sesión:', res.message);
    }
  } catch (error) {
    console.error('Error en el inicio de sesión:', error.message);
  }
}
</script>

<style scoped>
.q-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}
</style>
