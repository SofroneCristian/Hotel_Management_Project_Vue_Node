<template>
    <h>Logged out</h>
</template>

<script>
    export default {
        name: 'LogoutFunction',
        data() {
            return {
            };
        },
        created() {
            if (localStorage.getItem('token')) {
                localStorage.removeItem('token');
                localStorage.removeItem("id");
                localStorage.removeItem("userRole");
                localStorage.removeItem("email");
                localStorage.removeItem("first_name");
                localStorage.removeItem("last_name");
                localStorage.removeItem("username");
            }
            this.$router.push('/');
        },
    };
</script>


<style scoped>
</style>