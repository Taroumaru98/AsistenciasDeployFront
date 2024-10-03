<template>
    <q-page-container style="background-color: white">
      <div style="margin: 10px">
        <q-btn @click="home" icon="arrow_back" color="green" round />
        <h2 class="title">USUARIOS</h2>
        <div style="display: flex; justify-content: right; margin-top: 35px; margin-right: 150px; margin-bottom: 25px;">
          <q-btn @click="fixed = true" :style="{ backgroundColor: '#2F7D32', color: 'white' }" :icon="'add'" label="CREAR" />
        </div>
  
        <div style="max-width: 1600px; margin: auto">
          <q-table :rows="rows" :columns="columns" row-key="id">
            <template v-slot:body-cell-opciones="props">
              <q-td :props="props">
                <q-btn @click="traerDatos(props.row)" color="positive" icon="edit" round dense :style="{ backgroundColor: '#2F7D32', color: 'white' }" class="q-mr-sm" />
                <q-btn icon="check" round dense @click="activar(props.row._id, props.row)" :color="props.row.estado == 1 ? 'green' : 'red'" :loading="loadingStates[props.row._id]" :style="{ backgroundColor: props.row.estado == 1 ? '#2F7D32' : '#D32F2F', color: 'white' }" class="q-mr-sm">
                  <q-spinner v-if="loadingStates[props.row._id]" color="white" size="8px" />
                </q-btn>
              </q-td>
            </template>
            <template v-slot:body-cell-estado1="props">
              <q-td :props="props">
                <p v-if="props.row.estado == 1" style="display: inline-block; color: white; background-color: #2f7d32; padding: 4px 8px; border-radius: 10rem;">
                  Activo
                </p>
                <p v-else style="display: inline-block; color: white; background-color: red; padding: 4px 8px; border-radius: 10rem;">
                  Inactivo
                </p>
              </q-td>
            </template>
          </q-table>
        </div>
  
        <q-dialog v-model="fixed" :backdrop-filter="'blur(6px) saturate(180%)'" persistent>
          <q-card style="background-color: #e8f5e9; box-shadow: 0 8px 16px rgba(0, 128, 0, 0.3); border-radius: 12px;">
            <q-card-section>
              <div class="text-h5" style="color: #1b5e20; font-weight: bold; text-align: center; letter-spacing: 1px; padding: 10px 0; background: linear-gradient(45deg, #66bb6a, #1b5e20); border-radius: 8px; color: white;">
                {{ b ? "✏️ Editar Usuario" : "📝 Guardar Usuario" }}
              </div>
            </q-card-section>
  
            <q-separator />
  
            <q-card-section style="max-height: 50vh" class="scroll">
              <q-input filled v-model="nombre" label="Nombre" :dense="dense" style="--q-primary-color: #388e3c; --q-primary-focus: #2e7d32; border: 2px solid #4caf50; border-radius: 8px; transition: transform 0.3s; padding: 10px;" />
              <q-input filled v-model="email" label="Email" :dense="dense" style="--q-primary-color: #388e3c; --q-primary-focus: #2e7d32; border: 2px solid #4caf50; border-radius: 8px; transition: transform 0.3s; padding: 10px; margin-top: 15px;" />
            </q-card-section>
  
            <q-separator />
  
            <q-card-actions align="right">
              <q-btn flat label="Cerrar" color="green-10" style="background-color: #a5d6a7; color: #1b5e20; font-weight: bold; box-shadow: 0 4px 8px rgba(0, 128, 0, 0.2); transition: transform 0.3s;" @click="cerrar" />
              <q-btn flat label="Guardar" color="green-10" style="background-color: #66bb6a; color: white; font-weight: bold; box-shadow: 0 4px 8px rgba(0, 128, 0, 0.2); transition: transform 0.3s; margin-left: 10px;" @click="crearUsuario" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </q-page-container>
  </template>
  
  <script setup>
  import { ref, onBeforeMount } from "vue";
  import { Notify } from "quasar";
  import { useQuasar } from "quasar";
  import { useUsuariosStore } from "../stores/usuarios.js";
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const useUsuario = useUsuariosStore();
  const $q = useQuasar();
  
  const fixed = ref(false);
  const nombre = ref("");
  const email = ref("");
  const b = ref(false);
  const id = ref("");
  
  const rows = ref([]); // Asegúrate de que rows es un arreglo.
  const loadingStates = ref({});
  
  onBeforeMount(() => {
    listarUsuarios();
  });
  
  async function listarUsuarios() {
    try {
      const res = await useUsuario.listarUsuarios();
      rows.value = Array.isArray(res.data) ? res.data : []; // Verifica que res.data sea un arreglo.
    } catch (error) {
      console.error("Error al listar usuarios:", error);
      Notify.create({
        message: 'Error al cargar usuarios',
        color: 'negative',
        position: 'top'
      });
    }
  }
  
  function traerDatos(datos) {
    id.value = datos._id;
    fixed.value = true;
    b.value = true;
    nombre.value = datos.nombre;
    email.value = datos.email;
  }
  
  function cerrar() {
    b.value = false;
    nombre.value = "";
    email.value = "";
    fixed.value = false;  
  }
  
  async function crearUsuario() {
    if (b.value) {
      await editarUsuario(id.value);
    } else {
      try {
        await useUsuario.crearUsuario(nombre.value.trim(), email.value.trim());
        await listarUsuarios();
        cerrar(); // Cierra el formulario
      } catch (error) {
        console.error("Error al crear usuario:", error);
        Notify.create({
          message: 'Error al crear usuario',
          color: 'negative',
          position: 'top'
        });
      }
    }
  }
  
  async function activar(id, row) {
  loadingStates.value[id] = true;
  let res = await useUsuario.activarDesactivarusuario(id);
  await listarUsuarios();
  loadingStates.value[id] = false;
}

  async function editarUsuario() {
    try {
      await useUsuario.editarUsuario(id.value, nombre.value.trim(), email.value.trim());
      await listarUsuarios();
      cerrar(); // Cierra el formulario
    } catch (error) {
      console.error("Error al editar usuario:", error);
      Notify.create({
        message: 'Error al editar usuario',
        color: 'negative',
        position: 'top'
      });
    }
  }
  
  const columns = ref([
    {
      name: "nombre",
      required: true,
      label: "NOMBRE",
      align: "center",
      field: "nombre",
      sortable: true,
    },
    {
      name: "email",
      align: "center",
      label: "EMAIL",
      field: "email",
      sortable: true,
    },
    {
      name: "estado",
      align: "center",
      label: "ESTADO",
      field: "estado",
      sortable: true,
    },
    { name: "opciones", label: "OPCIONES", align: "center" },
  ]);
  
  const home = () => {
    router.push('/home');
  };
  </script>
  
  <style scoped>
  .title {
    text-align: center;
    border-bottom: 4px solid #388e3c;
  }
  </style>
  