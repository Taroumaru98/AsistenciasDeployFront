<template>
  <q-page-container style="background-color: white">
    <div style="margin: 10px">
      <q-btn @click="home" icon="arrow_back" color="green" round />
      <h2 class="title">FICHAS</h2>
      <div style="display: flex; justify-content: right; margin-top: 35px; margin-right: 150px; margin-bottom: 25px;">
        <q-btn @click="fixed = true" :style="{ backgroundColor: '#2F7D32', color: 'white' }" :icon="'add'" label="CREAR" />
      </div>

      <div style="max-width: 1600px; margin: auto">
        <q-table :rows="rows" :columns="columns" row-key="name">
          <template v-slot:body-cell-opciones="props">
            <q-td :props="props">
              <q-btn @click="traerDatos(props.row)" color="posion" icon="edit" round dense :style="{ backgroundColor: '#2F7D32', color: 'white' }" class="q-mr-sm" />
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
              {{ b == true ? "✏️ Editar Ficha" : "📝 Guardar Ficha" }}
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section style="max-height: 50vh" class="scroll">
            <q-input filled v-model="num" label="Nombre De La Ficha" :dense="dense" style="--q-primary-color: #388e3c; --q-primary-focus: #2e7d32; border: 2px solid #4caf50; border-radius: 8px; transition: transform 0.3s; padding: 10px;" />
            <q-input filled v-model="cod" label="Código De La Ficha" :dense="dense" style="--q-primary-color: #388e3c; --q-primary-focus: #2e7d32; border: 2px solid #4caf50; border-radius: 8px; transition: transform 0.3s; padding: 10px; margin-top: 15px;" />
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn flat label="Cerrar" color="green-10" style="background-color: #a5d6a7; color: #1b5e20; font-weight: bold; box-shadow: 0 4px 8px rgba(0, 128, 0, 0.2); transition: transform 0.3s;" @click="cerrar" />
            <q-btn flat label="Guardar" color="green-10" style="background-color: #66bb6a; color: white; font-weight: bold; box-shadow: 0 4px 8px rgba(0, 128, 0, 0.2); transition: transform 0.3s; margin-left: 10px;" @click="crearFicha" />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="confirm" persistent :backdrop-filter="'blur(4px) saturate(150%)'" transition-show="rotate" transition-hide="rotate">
      </q-dialog>
    </div>
  </q-page-container>
</template>

<script setup>
import axios from "axios";
import { ref, onBeforeMount, watch } from "vue";
import { Notify } from "quasar";
import { useQuasar } from "quasar";
import { useFichaStore } from "../stores/fichas.js";
import { Dark } from "quasar";
import { useRouter } from 'vue-router';

const router = useRouter();
const useFicha = useFichaStore();
const $q = useQuasar();

let confirm = ref(false);
let r = ref("");
let fixed = ref(false);
let num = ref("");
let cod = ref("");
let error = ref("");
let b = ref(false);
let id = ref("");

const isDark = ref(Dark.isActive);
watch(isDark, (val) => {
  Dark.set(val);
});

const rows = ref([]);
const loadingStates = ref({});

onBeforeMount(() => {
  traer();
});

function ides(ids) {
  id.value = ids;
  confirm.value = true;
}

async function traer() {
  let res = await useFicha.listarFichas();
  rows.value = res.data;
}

function traerDatos(datos) {
  id.value = datos._id;
  fixed.value = true;
  b.value = true;
  num.value = datos.nombre;
  cod.value = datos.codigo;
}

function cerrar() {
  b.value = false;
  num.value = "";
  cod.value = "";
  fixed.value = false;  
}

async function activar(id, row) {
  loadingStates.value[id] = true;
  let res = await useFicha.activarDesactivarFichas(id);
  await traer();
  loadingStates.value[id] = false;
}

function validateFields() {
  if (!num.value.trim() || !cod.value.trim()) {
    Notify.create({
      color: 'negative',
      message: 'Todos los campos son obligatorios.',
      icon: 'error'
    });
    return false;
  }
  return true;
}

async function crearFicha() {
  if (!validateFields()) return;

  if (b.value == true) {
    const res = await editarFicha(id.value);
    if (res?.response?.data?.errors) {
      fixed.value = true;
    } else {
      await traer();
      cerrar(); // Cierra el formulario
    }
  } else {
    let res = await useFicha.guardarFicha(cod.value.trim(), num.value.trim());
    if (res?.response?.data?.errors) {
      fixed.value = true;
    } else {
      await traer();
      cerrar(); // Cierra el formulario
    }
  }
}

async function editarFicha() {
  let res = await useFicha.editarFicha(id.value, cod.value.trim(), num.value.trim());
  await traer();
  return res;
}

const columns = ref([
  {
    name: "nombre1",
    required: true,
    label: "NOMBRE",
    align: "center",
    field: "nombre",
    sortable: true,
  },
  {
    name: "codigo1",
    align: "center",
    label: "CÓDIGO",
    field: "codigo",
    sortable: true,
  },
  {
    name: "estado1",
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
  border-bottom: 4px solid #2f7d32;
  padding-bottom: 8px;
  margin-bottom: 0;
  font-weight: bold;
}
</style>