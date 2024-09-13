<template>
  <q-page-container style="background-color: white">  
    <div style="margin: 10px">
      <q-btn @click="home" icon="arrow_back" color="green" round />
      <h3 class="title">APRENDICES</h3>
      <div style="display: flex; justify-content: right; margin-top: 35px; margin-right: 150px; margin-bottom: 25px;">         
        <q-btn @click="openDialog" :style="{ backgroundColor: '#2F7D32', color: 'white' }" icon="add" label="CREAR" />
      </div>

      <div style="max-width: 1600px; margin: auto">
        <q-table :rows="rows" :columns="columns" row-key="_id">
          <template v-slot:body-cell-opciones="props">
            <q-td :props="props">
              <q-btn @click="traerDatos(props.row)" color="green" icon="edit" round dense class="q-mr-sm" />
              <q-btn @click="activar(props.row._id)" v-if="props.row.estado == 0" color="green" icon="check" round dense class="q-mr-sm" />
              <q-btn @click="activar(props.row._id)" v-else color="negative" icon="close" round dense class="q-mr-sm" />
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

      <q-dialog v-model="fixed" persistent>
        <q-card>
          <q-card-section>
            <div class="text-h5">{{ b ? "✏️ Editar Aprendiz" : "📝 Guardar Aprendiz" }}</div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <q-input filled v-model="nombre" label="Nombre del Aprendiz" />
            <q-input filled v-model="cc" label="Numero de Documento" />
            <q-select rounded outlined v-model="IdFicha" use-input hide-selected fill-input input-debounce="0"
        :options="options" @filter="filterFn" label="Selecciona una ficha"/>
            <q-input filled v-model="email" label="Email" />
            <q-input filled v-model="telefono" label="Telefono" />
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn flat label="Cerrar" color="negative" @click="cerrar" />
            <q-btn flat label="Guardar" color="positive" @click="crearAprendiz()" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page-container>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { useAprendizStore } from "../stores/aprendiz.js";
import { useFichaStore } from "../stores/fichas.js";
import { useRouter } from 'vue-router';

const router = useRouter();
const useAprendiz = useAprendizStore();
const useFicha = useFichaStore();

const rows = ref([]);
const fichas = ref([]);
const nombre = ref("");
const cc = ref("");
const email = ref("");
const telefono = ref("");
const IdFicha = ref(null);
const b = ref(false);
const fixed = ref(false);
let id = ref("");
let ccOriginal = ref("");
let emailOriginal = ref("");
const nombreError = ref(false);
const ccError = ref(false);
const emailError = ref(false);
const telefonoError = ref(false);
let options = ref(fichas.value);

// Función para abrir el diálogo
const openDialog = () => {
  fixed.value = true;
  limpiarCampos();
};

async function traer() {
      let res = await useAprendiz.listarAprendiz();
      let ris = await useFicha.listarFichas();
      fichas.value = ris.data.map(item => ({
          label: item.nombre,
          value: item._id
      }));
      rows.value = res.data;
  }

const traerDatos = (datos) => {
  console.log(datos)
  id.value = datos._id;
  fixed.value = true;
  b.value = true;
  nombre.value = datos.nombre;
  cc.value = datos.cc;
  email.value = datos.email;
  telefono.value = datos.telefono;
  IdFicha.value = {
    label: datos.IdFicha.nombre,
    value: datos.IdFicha._id
  };
  ccOriginal.value = datos.cc;
  emailOriginal.value = datos.email;
}

const cerrar = () => {
  fixed.value = false;
  limpiarCampos();
};

const limpiarCampos = () => {
  nombre.value = "";
  cc.value = "";
  email.value = "";
  telefono.value = "";
  IdFicha.value = null;
  b.value = false;
};

 async function crearAprendiz() {

      nombreError.value = !nombre.value;
      ccError.value = !cc.value;
      emailError.value = !email.value;
      telefonoError.value = !telefono.value;
  
      if (nombreError.value || ccError.value || emailError.value || telefonoError.value) {
          return;
      }
  
      if (b.value) {
          const res = await editarAprendiz();
          cerrar();
          if (res?.response?.data?.errors) {
              fixed.value = true;
          } else {
              await traer();
              fixed.value = false;
          }
      } else {
          let res = await useAprendiz.guardarAprediz(cc.value, nombre.value, email.value, telefono.value, IdFicha.value.value);
          if (res?.response?.data?.errors) {
              fixed.value = true;
          } else {
              await traer();
              fixed.value = false;
          }
      }
  }
async function editarAprendiz() {
      const datosActualizados = {};
  
      if (cc.value !== ccOriginal.value) {
          datosActualizados.cc = cc.value;
      }
      if (email.value !== emailOriginal.value) {
          datosActualizados.email = email.value;
      }
      if (nombre.value) {
          datosActualizados.nombre = nombre.value;
      }
      if (telefono.value) {
          datosActualizados.telefono = telefono.value;
      }
      if (IdFicha.value) {
          datosActualizados.IdFicha = IdFicha.value.value;
      }
  
      let res = await useAprendiz.editarAprendiz(id.value, datosActualizados);
      await traer();
      return res;
  }





onBeforeMount(() => {
  traer();
});

const home = () => {
  router.push("/home");
};


function filterFn(val, update, abort) {
      update(() => {
          const needle = val.toLowerCase();
          options.value = fichas.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
      });
  }

const columns = ref([
  { name: "nombre", label: "Nombre del Aprendiz", align: "center", field: "nombre", sortable: true },
  { name: "documento", label: "Numero de Documento", align: "center", field: "cc", sortable: true },
  { name: "ficha", label: "Nombre de Ficha", align: "center", field: row => (row.IdFicha ? row.IdFicha.nombre : "N/A"), sortable: true },
  { name: "email", label: "Correo", align: "center", field: "email", sortable: true },
  { name: "telefono", label: "Telefono", align: "center", field: "telefono", sortable: true },
  { name: "estado", label: "Estado", align: "center", field: "estado", sortable: true },
  { name: "opciones", label: "Opciones", align: "center" },
]);
</script>

<style scoped>
.title {
  text-align: center;
  border-bottom: 4px solid #2f7d32;
  padding-bottom: 8px;
  font-weight: bold;
}
</style>