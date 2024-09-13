<template>
  <div>
    <h3>Registro de Asistencia y Aprobación del Acta No-</h3>
    <p>Del día _____ del mes de _____ del año 2024</p>

    <table border="1" cellspacing="0" cellpadding="5" style="width: 100%; text-align: center;">
      <thead>
        <tr>
          <th>No.</th>
          <th>NOMBRES Y APELLIDOS</th>
          <th>No. DOCUMENTO</th>
          <th>PLANTA</th>
          <th>CONTRATISTA</th>
          <th>OTRO ¿CUÁL?</th>
          <th>DEPENDENCIA/EMPRESA</th>
          <th>CORREO ELECTRÓNICO</th>
          <th>TELÉFONO/EXT. SENA</th>
          <th>AUTORIZA GRABACIÓN</th>
          <th>FIRMA O PARTICIPACIÓN VIRTUAL</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(bitacora, index) in bitacoras" :key="bitacora._id">
          <td>{{ index + 1 }}</td>
          <td>{{ bitacora.IdAprendis?.nombre }}</td>
          <td>{{ bitacora.IdAprendis?.cc }}</td>
          <td>{{ bitacora.planta }}</td>
          <td>{{ bitacora.contratista }}</td>
          <td>{{ bitacora.otro }}</td>
          <td>{{ bitacora.empresa }}</td>
          <td>{{ bitacora.IdAprendis?.email }}</td>
          <td>{{ bitacora.IdAprendis?.telefono }}</td>
          <td>{{ bitacora.autorizaGrabacion ? 'Sí' : 'No' }}</td>
          <td>{{ bitacora.participacionVirtual ? 'Sí' : 'No' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useBitacorasStore } from '../stores/bitacoras.js';

const useBitacora = useBitacorasStore();
const bitacoras = ref([]);

onBeforeMount(async () => {
  try {
    const res = await useBitacora.listarBitacoras();
    bitacoras.value = res.data;
  } catch (error) {
    console.error("Error al obtener bitácoras:", error);
  }
});
</script>

<style>
/* Estilos de la tabla */
table {
  border-collapse: collapse;
}

th, td {
  border: 1px solid black;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
}
</style>
