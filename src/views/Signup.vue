<template>
    <div class="signup-container">
      <app-navbar />
      
      <div class="content-container">
        <div class="signup-form">
          <h1>Signup</h1>
          <form @submit.prevent="signup">
            <div class = "formContainer">
                <label for="email">Email:</label>
                <input type="email" id="email" v-model="email" required>
            </div>
            <div class = "formContainer">
                <label for="password">Password:</label>
                <input type="password" id="password" v-model="password" required>
            </div>
            <div class = "formContainer">
                <label for="firstName">First Name:</label>
                <input type="text" id="firstName" v-model="firstName" required>
            </div>
            <div class = "formContainer">
                <label for="lastName">Last Name:</label>
                <input type="text" id="lastName" v-model="lastName" required>
            </div>
            <!-- <div class = "formContainer">
                <label for="username">Username:</label>
                <input type="text" id="username" v-model="username" required>
            </div> -->
            <button type="submit">Sign Up</button>
        </form>
        </div>
      </div>
    </div>
  </template>


<!-- <template>
    <div class="signup-container">
        <h1>Sign Up</h1>
        <form @submit.prevent="signup">
            <div>
                <label for="email">Email:</label>
                <input type="email" id="email" v-model="email" required>
            </div>
            <div>
                <label for="password">Password:</label>
                <input type="password" id="password" v-model="password" required>
            </div>
            <div>
                <label for="firstName">First Name:</label>
                <input type="text" id="firstName" v-model="firstName" required>
            </div>
            <div>
                <label for="lastName">Last Name:</label>
                <input type="text" id="lastName" v-model="lastName" required>
            </div>
            <div>
                <label for="username">Username:</label>
                <input type="text" id="username" v-model="username" required>
            </div>
            <button type="submit">Sign Up</button>
        </form>
    </div>
</template> -->

<script>
    import axios from 'axios';
    import AppNavbar from "../components/AppNavbar.vue";

    export default {
        name: 'SignupPage',
        components: {
            AppNavbar,
        },
        data() {
            return {
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                username: '',
            };
        },
        created() {
            // if(localStorage.getItem('token')){
            //     this.$router.push('/');
            // }
        },
        methods: {
            signup() {
                axios.post('http://localhost:3000/signup', {
                    email: this.email,
                    password: this.password,
                    first_name: this.firstName,
                    last_name: this.lastName,
                    username: this.username,
                    role: 0
                })
                    .then(response => {
                        console.log('User registered successfully:', response.data);
                        this.$router.push(`/login`);
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }
        }
    };
</script>



<!-- <style scoped>
    .signup-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    
    .content-container {
      flex-grow: 1;
      position: relative;
      overflow-y: auto;
      padding: 20px;
    }
    
    .signup-form {
      margin: 0 auto;
      max-width: 450px;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      text-align: center;
      margin-top:40px;
    }

    .formContainer{
        /* background-color: rebeccapurple; */
        /* display: inline-block; */
        margin:20px;
        text-align: right;
    }
    
    .signup-form h1 {
      margin-bottom: 35px;
    }
    
    /* .signup-form form {
      display: flex;
      flex-direction: column;
      align-items: center;
     }  */
    
    .signup-form .form-group {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    
    .signup-form label {
      margin-right: 30px;
      font-weight: bold;
      align-items: center;
      
    }
    
    .signup-form input {
      flex-grow: 1;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    .signup-form button {
      margin-top: 20px;
      padding: 10px 20px;
      background-color: #ca5132;
      color: #ffffff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .signup-form button:hover {
      background-color: #ad412b;
    }
    
    @media (max-width: 768px) {
      .signup-form {
        max-width: 100%;
        padding: 20px;
      }
    }
    </style> -->



<style scoped>
    .signup-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    
    .content-container {
      flex-grow: 1;
      position: relative;
      overflow: auto;
    }
    
    .signup-form {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      max-width: 400px;
      min-width: 400px;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      text-align: center;
    }
    
    .signup-form h1 {
      margin-bottom: 30px;
    }
    
    /* .signup-form form {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
     */
    .signup-form label {
      font-weight: bold;
    }
    
    .signup-form input {
      margin: 10px 0;
      padding: 10px;
      width: 100%;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    .signup-form button {
      margin-top: 20px;
      padding: 10px 20px;
      background-color: #ca5132;
      color: #ffffff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .signup-form button:hover {
      background-color: #ad412b;
    }
    </style>