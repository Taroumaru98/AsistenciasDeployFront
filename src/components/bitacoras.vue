<template>
  <div>
    <div id="en">
      <div style="padding-top: 30px;">
        <q-btn @click="home" icon="arrow_back" color="green" round />
      </div>
      <h3 class="title" id="programas">BITACORAS</h3>
    </div>
    <hr />
    <div style="margin: 0px;">
      <!-- Filtros de fechas -->
      <div style="margin-bottom: 20px; display: flex; gap: 10px;">
        <q-input v-model="fechaInicio" mask="date" filled label="Fecha Inicio" type="date" />
        <q-input v-model="fechaFin" mask="date" filled label="Fecha Fin" type="date" />
        <q-btn @click="buscarPorFechas" color="primary" label="Buscar" />
      </div>

      <div>
        <q-select
      rounded
      outlined
      v-model="IdFicha"
      :options="options"
      @change="filtrarPorFicha"
      label="Búsqueda por Ficha"
    />
      </div>

      <div class="tablafichas">
        <div style="margin-top: 0px;"></div>
        <q-table :rows="rows" :columns="columns" row-key="codigo" title="">
          <template v-slot:body-cell-opciones="props">
            <q-td :props="props">
              <q-btn @click="traerDatos(props.row)" color="primary">📝</q-btn>
            </q-td>
          </template>
          <template v-slot:body-cell-estado="props">
            <q-td :props="props">
              <q-select
                v-model="props.row.estado"
                :options="['pendiente', 'asistió', 'faltó', 'excusa']"
                @update:model-value="(val) => cambiarEstado(props.row._id, val)"
                style="width: 150px; margin: auto;"
              />
            </q-td>
          </template>
        </q-table>

        <q-btn @click="goToArchivo" color="primary" label="Ir a informes" class="q-mt-md" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onBeforeMount } from 'vue';
import { useQuasar } from 'quasar';
import { useBitacorasStore } from '../stores/bitacoras.js';
import { useAprendizStore } from "../stores/aprendiz.js";
import { useFichaStore } from "../stores/fichas.js";

const router = useRouter();
const useBitacora = useBitacorasStore();
const useAprendiz = useAprendizStore();
const useFicha = useFichaStore();
const $q = useQuasar();

let confirm = ref(false);
let num = ref("");
let cod = ref("");
let b = ref(false);
let id = ref("");
const rows = ref([]);
const IdFicha = ref('');
const fichas = ref([]);
const aprendiz = ref([]);
const fechaInicio = ref('');
const fechaFin = ref('');
const options = ref([]); // Declare options here

onBeforeMount(() => {
  traer();
  obtenerFichas();
});

async function traer() {
  try {
    const res = await useBitacora.listarBitacoras();
    let ris = await useFicha.listarFichas();
    
    // Initialize options with fichas
    options.value = ris.data.map(item => ({
      label: item.nombre,
      value: item._id
    }));

    let ros = await useAprendiz.listarAprendiz();
    aprendiz.value = ros.data.map(item => ({
      label: item.nombre,
      value: item._id
    }));

    rows.value = res.data.map(bitacora => {
      const fecha = new Date(bitacora.fecha);
      const dia = String(fecha.getDate()).padStart(2, '0');
      const mes = String(fecha.getMonth() + 1).padStart(2, '0');
      const año = fecha.getFullYear();
      bitacora.fecha = `${dia}/${mes}/${año}`;
      return bitacora;
    });
  } catch (error) {
    console.error("Error al traer bitácoras:", error);
    $q.notify({
      type: 'negative',
      message: 'Error al traer bitácoras.'
    });
  }
}

async function obtenerFichas() {
  try {
    const res = await useFicha.listarFichas();
    fichas.value = res.data.map(item => ({
      label: item.nombre,  // Mostrar el nombre en el select
      value: item._id      // Usar el _id para las consultas
    }));
  } catch (error) {
    console.error('Error al obtener fichas:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al obtener fichas.'
    });
  }
}

async function buscarPorFechas() {
  try {
    const res = await useBitacora.listarBitacorasFecha(fechaInicio.value, fechaFin.value);
    rows.value = res.data.map(bitacora => {
      const fecha = new Date(bitacora.fecha);
      const dia = String(fecha.getDate()).padStart(2, '0');
      const mes = String(fecha.getMonth() + 1).padStart(2, '0');
      const año = fecha.getFullYear();
      bitacora.fecha = `${dia}/${mes}/${año}`;
      return bitacora;
    });
  } catch (error) {
    console.error('Error al listar bitácoras por fechas:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al listar bitácoras por fechas.'
    });
  }
}

function cambiarEstado(id, nuevoEstado) {
  console.log("Cambiando estado a:", nuevoEstado);
  
  useBitacora.actualizarEstado(id, nuevoEstado)
    .then(() => {
      $q.notify({
        type: 'positive',
        message: 'Estado actualizado correctamente.'
      });
      traer(); // refrescar datos
    })
    .catch(error => {
      console.error('Error al cambiar estado:', error);
      $q.notify({
        type: 'negative',
        message: 'Error al cambiar estado.'
      });
    });
}

const columns = ref([
  { name: 'fecha', label: 'Fecha', field: 'fecha', align: 'center', sortable: true },
  { name: 'IdAprendiz', align: 'center', label: 'Nombre Aprendiz', field: (row) => row?.IdAprendis?.nombre, sortable: true },
  { name: 'Telefono Aprendiz', align: 'center', label: 'Telefono Aprendiz', field: (row) => row?.IdAprendis?.telefono, sortable: true },
  { name: 'Email Aprendiz', align: 'center', label: 'Email Aprendiz', field: (row) => row?.IdAprendis?.email, sortable: true },
  { name: 'Número Documento', align: 'center', label: 'Número Documento', field: (row) => row?.IdAprendis?.cc, sortable: true },
  { name: 'nombreFicha', align: 'center', label: 'Nombre Ficha', field: row => row?.IdAprendis?.IdFicha?.nombre, sortable: true },
  { name: 'codigoFicha', align: 'center', label: 'Código Ficha', field: row => row?.IdAprendis?.IdFicha?.codigo, sortable: true },
  { name: 'estado', align: 'center', label: 'Estado', field: 'estado', sortable: true },
]);

const home = () => {
  router.push('/home');
};

const goToArchivo = () => {
  router.push('/informes');
};

function filterFn(val, update, abort) {
  update(() => {
    const needle = val.toLowerCase();
    options.value = fichas.value.filter(v => v.label.toLowerCase().indexOf(needle) > -1);
  });
}

async function filtrarPorFicha() {
      console.log('ID de ficha seleccionado:', IdFicha.value); // Verifica el valor de IdFicha
      if (!IdFicha.value) return;  // Asegúrate de que IdFicha tiene un valor

      try {
        const res = await useBitacora.listarBitacorasPorFicha(IdFicha.value); // Usa el valor de IdFicha
        if (res.data) {
          rows.value = res.data.map(bitacora => {
            const fecha = new Date(bitacora.fecha);
            const dia = String(fecha.getDate()).padStart(2, '0');
            const mes = String(fecha.getMonth() + 1).padStart(2, '0');
            const año = fecha.getFullYear();
            bitacora.fecha = `${dia}/${mes}/${año}`;
            return bitacora;
          });
        }
      } catch (error) {
        console.error('Error al listar bitácoras por ficha:', error);
        this.$q.notify({
          type: 'negative',
          message: 'Error al listar bitácoras por ficha.'
        });
      }
    };


async function traerDatos(row) {
  console.log(row);
  // Implementar lógica para manejar el clic en el botón de la tabla.
}
</script>

<style scoped>
.tablafichas {
  max-width: 1500px;
  margin: auto;
}
</style>
