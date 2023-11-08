<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  // import Home from '@/components/Home.vue';

  export default {
    // numele paginii in cauza (App -> va fi folosit pentru mount)
    name: 'App',
    // Componentele de se baga
    components: {
    },
    // Pentru a defini care pagina are ce href -> App o sa tina atat home cat si celelalte pagini
    // router: new VueRouter({
    //   routes: [
    //     {
    //       path: '/home',
    //       component: Home, // your home component
    //     },
    //     // {
    //     //   path: '/about',
    //     //   component: About, // your about component
    //     // },
    //   ],
    // }),
  };
</script>

<style>
  /* #app { */
    /* font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50; */
    /* margin-top: 60px; */
  /* } */
</style>