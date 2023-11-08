
<template>
   <!-- Diferite butoane pt client si administrator -->
  <!-- <LoginChecker></LoginChecker> -->
  <nav class="app-navbar">
    <div class="left-links">
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
      <template v-if="isLoggedIn">
        <div class="reservations">
          <template v-if="userRole == '0'">
            <router-link to="/book_a_room">Book a room</router-link>
          </template>
          <template v-else>
            <router-link to="/all_reservations">View all reservations</router-link>
          </template>
        </div>
      </template>
    </div>
    <div class="right-links">
      <template v-if="isLoggedIn">
        <template v-if="userRole == '1'">
          <router-link to="/account">
            <font-awesome-icon :icon="['fas', 'user']" />
            Account
          </router-link>
        </template>
        <template v-else>
          <router-link to="/account">
            <font-awesome-icon :icon="['fas', 'user']" />
            Account
          </router-link>
        </template>
        <router-link to="/logout">Logout</router-link>
      </template>
      <template v-else>
        <router-link to="/login">Login</router-link>
        <router-link to="/signup">Sign Up</router-link>
      </template>
    </div>
  </nav>
</template>

<script>

  // import LoginChecker from "../components/LoginCheckerComponent.vue";
  export default {
    name: 'AppNavbar',
    components: {
      // LoginChecker
    },
    data() {
      return {
        isLoggedIn: false,
        userRole: null,
      };
    },
    created() {
      console.log("Entering navbar created");
      if (localStorage.getItem('token')) {
        this.isLoggedIn = true;
        this.userRole = localStorage.getItem('userRole');
        // this.verifyToken(token);
      }
    },
    methods: {
    }
  };
</script>

<style scoped>
  /* @import 'path/to/font-awesome/css/all.min.css'; */
  /* Gray: #808080 (Medium gray) */
  /* Peach: #FFB6C1 (Light peach) */
  /* Yellow: #FFD700 (Gold yellow) */
  /* Green: #1b582f (Emerald green) */

  .app-navbar {
    /* position: fixed; */
    display: flex;
    justify-content: space-between;
    padding: 15px;
    background-color: #2a2e2c;
    color: #ffffff;
    border-bottom: 2px solid #ca5132;
  }

  .left-links,
  .right-links {
    display: flex;
    align-items: center;
  }

  .right-links {
    margin-left: auto;
  }

  .app-navbar a {
    margin-right: 15px;
    color: #ffffff;
    text-decoration: none;
  }

  .app-navbar .right-links a {
    color: white;
    text-align: center;
    font-weight: bold;
    background-color: #ca5132;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    padding: 10px;
    margin-right: 10px;
  }

  .reservations {
    background-color: #ca5132;
    transition: background-color 0.3s ease;
    padding: 10px;
    color: white;
    border: none;
    border-radius: 4px;
    text-align: center;
  }

  .reservations a {
    margin: 0px;
  }


  .reservations:hover {
    background-color: #ad412b;
    color: white;
  }

  .app-navbar a:hover {
    /* position: relative; */
    /* background-color: #ddd; */
    color: #ca5132;
    /* float: right; */
    /* background-color: #ad412b; */
  }

  .reservations a:hover {
    color: white;
  }

  .app-navbar .right-links a:hover {
    /* position: relative; */
    /* background-color: #ddd; */
    /* color: rgb(218, 187, 178); */
    /* float: right; */
    background-color: #ad412b;
    color: white;
  }

  /* Responsive styles */
  @media (max-width: 768px) {
    .app-navbar {
      flex-direction: column;
      align-items: flex-start;
      padding: 10px 20px;
    }

    .right-links {
      margin-left: 0;
      margin-top: 10px;
    }

    .app-navbar a {
      margin: 0 10px 10px 0;
    }
  }
</style>