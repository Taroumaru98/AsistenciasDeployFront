import { createRouter, createWebHashHistory } from 'vue-router';
import home from '../components/home.vue';
import fichas from '../components/fichas.vue';
import aprendiz from '../components/aprendiz.vue';
import usuario from '../components/usuario.vue';
import bitacoras from '../components/bitacoras.vue';
import informes from '../components/informe.vue';
import login from '../components/login.vue';
import archivo from '../components/archivo.vue';
import registro from '../components/registro.vue';
import respass from '../components/respass.vue';
import restablecerContrasena from '../components/uppass.vue';

const routes = [
  { path: '/home', component: home, children:[
    { path: '/fichas', component: fichas },
    { path: '/aprendiz', component: aprendiz },
    { path: '/usuario', component: usuario },
    { path: '/bitacoras', component: bitacoras },
    { path: '/informes', component: informes },
  ]},
  { path: '/archivo', component: archivo }, 
  { path: '/registro', component: registro },
  { path: '/respassword', component: respass },
  { path: '/uppass', name: 'restablecerContrasena', component: restablecerContrasena},
  { path: '/', component: login },
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});


export default router;
