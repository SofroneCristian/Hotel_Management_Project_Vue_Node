<template>
    <app-navbar />
    <div class="login-container">
        <h1>Login</h1>
        <form @submit.prevent="login">
            <div>
                <label for="email">Email:</label>
                <input type="email" id="email" v-model="email" required>
            </div>
            <div>
                <label for="password">Password:</label>
                <input type="password" id="password" v-model="password" required>
            </div>
            <button type="submit">Login</button>
        </form>

        <template v-if="isError">
            <p class="error-message">Invalid credentials. Please try again.</p>
        </template>
    </div>
</template>

<script>
    import AppNavbar from "../components/AppNavbar.vue";
    // import axios from 'axios';
    export default {
        name: 'LoginPage',
        components: {
            AppNavbar,
        },
        data() {
            return {
                email: '',
                password: '',
                isError: false,
            };
        },
        created() {
            // console.log("Entering login created()");
            // if(localStorage.getItem('token')){
            //     this.$router.push('/');
            // }
        },
        methods: {
            login() {
                fetch('http://localhost:3000/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: this.email,
                        password: this.password
                    })
                })
                    .then(response => {
                        if (response.ok) {
                            return response.json();
                        } else {
                            // Handle other status codes
                            this.isError = true;
                            throw new Error('Login failed. Please try again.');
                        }
                    })
                    .then(data => {
                        // Handle successful login data
                        console.log("Verifying the data from the login() function");
                        const token = data.token;
                        localStorage.setItem('token', token);
                        this.verifyToken();
                    })
                    .catch(error => {
                        this.isError = true;
                        console.error('An error occurred during login:', error);
                        this.errorMessage = 'An error occurred during login. Please try again.';
                    });
            },

            verifyToken() {
                fetch('http://localhost:3000/protected', {
                    method: 'GET',
                    headers: {
                        'Authorization': `${localStorage.getItem('token')}`
                    }
                })
                    .then(response => {
                        if (response.ok) {
                            return response.json();
                        } else {
                            if (response.status == 403) {
                                if (localStorage.getItem('token')) {
                                    localStorage.removeItem('token');
                                }
                            }
                            throw new Error('Failed to fetch the data.');
                        }
                    })
                    .then(data => {
                        localStorage.setItem('id', data.userId);
                        localStorage.setItem('userRole', data.userRole);
                        this.$router.push(`/`);
                    })
                    .catch(error => {
                        console.error('An error occurred while fetching protected data:', error);
                    });
            }
        },
    };
</script>


<style scoped>
    .error-message {
        color: red;
        margin-top: 10px;
    }

    .home-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
    }

    .content-container {
        flex-grow: 1;
        position: relative;
        overflow: auto;
    }

    .login-container {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        max-width: 600px;
        min-width: 350px;
        padding: 20px;
        background-color: #ffffff;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        text-align: center;
    }

    .login-container h1 {
        margin-bottom: 20px;
    }

    .login-container form {
        /* display: flex; */
        flex-direction: column;
        align-items: center;
    }

    .login-container label {
        font-weight: bold;
    }

    .login-container input {
        margin: 10px 0;
        padding: 10px;
        width: 100%;
        border: 1px solid #ddd;
        border-radius: 4px;
    }

    .login-container button {
        margin-top: 20px;
        padding: 10px 20px;
        background-color: #ca5132;
        color: #ffffff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        text-align: center;
    }

    .login-container button:hover {
        background-color: #ad412b;
        transition: background-color 0.3s ease;
    }
</style>



<!-- <style scoped>
    .login-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
    }

    h1 {
        margin-bottom: 1rem;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    input[type="email"],
    input[type="password"] {
        width: 100%;
        padding: 0.5rem;
    }
</style> -->

<!-- <template>
    <div class="login-form">
        <h2>Login</h2>

        <form>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" v-model="email" class="form-control" placeholder="Enter your email">
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" v-model="password" class="form-control"
                    placeholder="Enter your password">
            </div>

            <div class="form-group">
                <button type="submit" class="btn btn-primary" @click.prevent="login">Login</button>
                <button type="button" class="btn btn-secondary" @click.prevent="signUp">Sign Up</button>
            </div>

            <div class="form-group">
                <a href="/forgot-password">Forgot Password?</a>
            </div>
        </form>
    </div>
</template>
<script>
    export default {
        name: 'LoginPage',
        data() {
            return {
                // email: '',
                // password: '',
                // guests: [],
                // error: "",
                // state: 'loading'
            };
        },
        methods: {
            async loadUser(email) {
                try {
                    var url = "http://localhost:3000/user" + "/" + email;
                    console.log(url);
                    const guests = await fetch(url);
                    // this.guests = await guests.json();
                    return await guests.json();
                } catch (exception) {
                    console.log(exception);
                    this.state = 'error';
                }
            },
            login() {
                const enteredEmail = this.email;
                const enteredPassword = this.password;

                // Implement your login logic here
                console.log('Logging in...');
                console.log('Email:', enteredEmail);
                console.log('Password:', enteredPassword);

                var users = this.loadUser(enteredEmail);
                console.log(users);

                // users.forEach((item) => {
                //     // Access individual objects in the array
                //     console.log(item);
                //     // Access specific properties of each object
                //     console.log(item.username, item.password);
                // });

                // for="item in guests"
                // console.log("username: " + users.username);
                // console.log("test length: " + users.length);
                // console.log("test length: " + users.length);


            },
        },
    }

//     export default {
//   data() {
//     return {
//       email: '',
//       password: '',
//     };
//   },
//   methods: {
//     login() {
//       // Implement your login logic here
//       console.log('Logging in...');
//     },
//     signUp() {
//       // Implement your sign up logic here
//       console.log('Signing up...');
//     },
//   },
// };
</script>

<style scoped>
    .login-form {
        max-width: 300px;
        margin: 0 auto;
        padding: 20px;
    }

    .form-group {
        margin-bottom: 10px;
    }

    .btn-primary {
        margin-right: 10px;
    }

    a {
        color: #337ab7;
    }
</style> -->