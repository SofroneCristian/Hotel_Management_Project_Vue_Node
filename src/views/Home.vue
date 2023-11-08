<template>
    <div class="app">
        <app-navbar />
        <div class="content">
            <h1>Welcome to Our Hotel</h1>
          </div>
      </div>
   
   
</template>
<script>
    import AppNavbar from "../components/AppNavbar.vue";
    export default {
        name: 'HomePage',
        components: {
            AppNavbar,
        },
    }
</script>



<style scoped>
    .app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
  z-index: 1;
  padding: 20px;
}

.content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('../assets/background2.jpg') center/cover;
  filter: brightness(70%);
  z-index: -1;
}

h1 {
  color: #ffffff;
  font-size: 60px;
  margin: 10px;
}
p {
  color: #ffffff;
  font-size: 20px;
  margin: 10px;
  display: none;
}

@media (max-width: 768px) {
  .content {
    padding: 10px;
  }
}
</style>