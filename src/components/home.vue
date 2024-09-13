<template>
  <div class="q-pa-md">
    <q-layout view="hHh LpR fFf" container style="height: 100vh; overflow: hidden;" class="shadow-2 rounded-borders">
      <!-- Header -->
      <q-header elevated :class="$q.dark.isActive ? 'bg-secondary' : 'bg-green-8'">
        <q-toolbar>
          <q-btn flat @click="toggleDrawer" round dense icon="menu" />
          <q-toolbar-title>ASISTE</q-toolbar-title>
          <q-btn @click="Logout" icon="arrow_back" :style="{ backgroundColor: 'rgba(47, 125, 50, 0.9)', color: 'white' }" />
        </q-toolbar>
      </q-header>

      <!-- Drawer -->
      <q-drawer v-model="drawer" :width="250" side="left" overlay :mini="miniState" @mouseover="miniState = false"
      @mouseout="miniState = true" bordered :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-green-dark'" dark elevated>
        <q-img class="absolute-top" src="" style="height: 150px; background-color: rgba(47, 125, 50, 0.9);"></q-img>
        <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; background-color: rgba(47, 125, 50, 0.9);">
          <q-list padding>
            <!-- Home Button -->
            <q-item clickable to="/home" v-ripple class="drawer-item">
              <q-item-section avatar>
                <q-icon name="home" class="drawer-icon" />
              </q-item-section>
              <q-item-section class="drawer-label">Home</q-item-section>
            </q-item>

            <!-- Bitacoras Button -->
            <q-item clickable to="/bitacoras" v-ripple class="drawer-item">
              <q-item-section avatar>
                <q-icon name="person" class="drawer-icon" />
              </q-item-section>
              <q-item-section class="drawer-label">Bitacoras</q-item-section>
            </q-item>

            <!-- Fichas Button -->
            <q-item clickable to="/fichas" v-ripple class="drawer-item">
              <q-item-section avatar>
                <q-icon name="drafts" class="drawer-icon" />
              </q-item-section>
              <q-item-section class="drawer-label">Fichas</q-item-section>
            </q-item>

            <!-- Aprendices Button -->
            <q-item clickable to="/aprendiz" v-ripple class="drawer-item">
              <q-item-section avatar>
                <q-icon name="star" class="drawer-icon" />
              </q-item-section>
              <q-item-section class="drawer-label">Aprendices</q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-page-container>
        <!-- Condicional para mostrar las tarjetas solo en la ruta /home -->
        <div v-if="currentPath === '/home'" class="cards">
          <div class="q-pa-lg" style="max-width: 1200px; width: 90%;">
            <div class="row q-col-gutter-lg">
              <!-- Primer Card -->
              <div class="col-xs-12 col-md-6">
                <q-card class="card">
                  <q-card-section class="card-header">
                    <div class="text-h6">FICHAS</div>
                  </q-card-section>
                  <q-img src="https://img.freepik.com/foto-gratis/equipo-negocios-exitoso-feliz_53876-74892.jpg?w=1380&t=st=1725588859~exp=1725589459~hmac=b6f5a044e441e2b720da0572b94451ec3603ee9b5069b12d98ffc5d10dc9ad17" class="q-mx-auto q-mb-md" />
                  <q-card-actions align="center">
                    <q-btn clickable to="/fichas" class="btn-styled" label="ENTRAR" />
                  </q-card-actions>
                </q-card>
              </div>

              <!-- Segundo Card -->
              <div class="col-xs-12 col-md-6">
                <q-card class="card">
                  <q-card-section class="card-header">
                    <div class="text-h6">APRENDICES</div>
                  </q-card-section>
                  <q-img src="https://img.freepik.com/foto-gratis/disenadores-graficos-reunion_1170-2002.jpg?w=1380&t=st=1725588892~exp=1725589492~hmac=8620f6551dc8b476ac31c191a31da1798e5cb45889dd9faf37958f77676fbdaf" class="q-mx-auto q-mb-md" />
                  <q-card-actions align="center">
                    <q-btn clickable to="/aprendiz" class="btn-styled" label="ENTRAR" />
                  </q-card-actions>
                </q-card>
              </div>
            </div>

            <div class="row q-col-gutter-lg q-mt-lg">
              <!-- Tercer Card -->
              <div class="col-xs-12 col-md-6">
                <q-card class="card">
                  <q-card-section class="card-header">
                    <div class="text-h6">BITACORAS</div>
                  </q-card-section>
                  <q-img src="https://img.freepik.com/foto-gratis/concepto-control-calidad-estandar-m_23-2150041854.jpg?t=st=1725588975~exp=1725592575~hmac=d4f0c27f586960dbf6f75333ef511f07f170e1c6719d06d339914580f77df157&w=1380" class="q-mx-auto q-mb-md" />
                  <q-card-actions align="center">
                    <q-btn clickable to="/bitacoras" class="btn-styled" label="ENTRAR" />
                  </q-card-actions>
                </q-card>
              </div>

              <!-- Cuarto Card -->
              <div class="col-xs-12 col-md-6">
                <q-card class="card">
                  <q-card-section class="card-header">
                    <div class="text-h6">USUARIOS</div>
                  </q-card-section>
                  <q-img src="https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" class="q-mx-auto q-mb-md" />
                  <q-card-actions align="center">
                    <q-btn class="btn-styled" label="ENTRAR" clickable to="/usuario" />
                  </q-card-actions>
                </q-card>
              </div>
            </div>
          </div>
        </div>
        
        <router-view />
      </q-page-container>

      <!-- Footer -->
      <q-footer elevated class="bg-green-9" style="padding: 20px 0;">
        <q-toolbar style="justify-content: center;">
          <q-toolbar-title class="text-center">
            <span class="text-bold" style="color: white; font-size: 22px; letter-spacing: 0.5px;">
              2024 Todos los derechos reservados
            </span>
          </q-toolbar-title>
        </q-toolbar>
      </q-footer>
    </q-layout>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUsuariosStore } from "../stores/usuarios.js";

const router = useRouter();
const route = useRoute(); 
const useUsuarios = useUsuariosStore();
const drawer = ref(false);
const miniState = ref(true);

const toggleDrawer = () => {
  drawer.value = !drawer.value;
};

const Logout = async () => {
  await useUsuarios.logout();
  router.replace("/");
};

// Computed property to check the current path
const currentPath = computed(() => route.path);
</script>

<style scoped>
/* General layout padding */
.q-pa-md {
  margin: 0;
  padding: 0;
}

/* Drawer styles */
.q-drawer {
  background-color: rgba(47, 125, 50, 0.9) !important;
  color: white;
}

.drawer-item {
  background-color: white;
  border-radius: 12px;
  color: #2F7D32;
  margin-bottom: 15px;
  padding: 10px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.drawer-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.drawer-icon {
  font-size: 24px;
}

.drawer-label {
  font-size: 16px;
  font-weight: bold;
}

/* Card styles */
.card {
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.card-header {
  background-color: rgba(47, 125, 50, 0.9);
  color: white;
  border-radius: 12px 12px 0 0;
  padding: 15px;
}

.q-img {
  border-radius: 12px;
}

.btn-styled {
  background-color: rgba(47, 125, 50, 0.9);
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.btn-styled:hover {
  background-color: rgba(47, 125, 50, 1);
}

.cards {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
}

</style>
