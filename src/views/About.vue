<script>
    import AppNavbar from "../components/AppNavbar.vue";
    export default {
        name: 'AboutPage',
        components: {
            AppNavbar
        }
    }
</script>


<template>

    <app-navbar />
    <div class="about-page">
        <h1>About Us</h1>
        <div class="about-text">
            <p>Bine ați venit la Hotel Sinaia, un uimitor centru de liniște și eleganță al orașului de munte. 
                În împrejurimile minunate ale orașului nostru, Sinaia oferă un sejur încântător pentru 
                turiștii exigenți. Având în vedere confortul și frumusețea, camerele și apartamentele noastre opulente 
                oferă vederi uluitoare ale munților din apropiere.</p>
                <p> Bucurați-vă de bucătăria delicioasă pregătită cu o fuziune 
                încântătoare de arome regionale și internaționale la restaurantul nostru. Relaxați-vă în zona noastră de spa și wellness, 
                unde vă puteți găsi odihnă și reînnoire. Hotelul Sinaia garantează un refugiu de neuitat pentru o vacanță ideală, 
                cu servicii de primă clasă și o atmosferă calmă.</p>
        </div>
        <div class="card-container">
            <div class="card">
                <div class="card-header">
                    <img src="../assets/2038263.png" alt="Amenities" class="card-image">
                    <h3>Amenities</h3>
                </div>
                <div class="card-body">
                    <h2>All services below are free</h2>
                    <p>Wi-fi</p>
                    <p>Breakfast</p>
                    <p>Gym</p>
                    <p>Spa</p>
                    <div class="d-grid gap-2">
                        <button type="button" class="btn btn-lg btn-outline-dark btn-block">Make A Reservation</button>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <img src="../assets/swimming-pool-icon-png-3.png" alt="Pool" class="card-image">
                    <h3>Pool</h3>
                </div>
                <div class="card-body">
                    <h2>Benefits</h2>
                    <p>Olympic size</p>
                    <p>Free Bar</p>
                    <p>Kid's area</p>
                    <div class="d-grid gap-2">
                        <button type="button" class="btn btn-lg btn-outline-dark btn-block">Make A Reservation</button>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <img src="../assets/100445.png" alt="Rooms" class="card-image">
                    <h3>Rooms</h3>
                </div>
                <div class="card-body">
                    <h2>Benefits</h2>
                    <p>Smart TVs</p>
                    <p>Air conditioner</p>
                    <p>24/7 Room service</p>
                    <p>View to pool</p>
                    <div class="d-grid gap-2">
                        <button type="button" class="btn btn-lg btn-outline-dark btn-block">Make A Reservation</button>
                    </div>
                </div>
            </div>
        </div>


    </div>
</template>

<style scoped>
    .about-page {
        text-align: center;
        /* background-color: #f2f2f2; */
        padding: 50px 0;
        margin:20px;
    }

    h1 {
        color: #333;
        margin-bottom: 30px;
    }

    .card-container {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-bottom: 30px;
        margin-top:50px;
    }

    .card {
        width: 300px;
        border: 1px solid #ccc;
        border-radius: 10px;
        overflow: hidden;
    }

    .card-header {
        position: relative;
    }

    .card-header h3 {
        margin: 0;
        padding: 10px;
        background-color: #333;
        color: #fff;
        font-size: 18px;
    }

    .card-image {
        width: 100px;
        height: auto;
        object-fit: cover;
    }

    .card-body {
        padding: 20px;
    }

    .card-body h2 {
        font-size: 18px;
        margin-top: 0;
    }

    .card-body p {
        margin-bottom: 5px;
    }

    .btn {
        margin-top: 10px;
    }

    .about-text {
        max-width: 800px;
        margin: 0 auto;
        text-align: justify;
        line-height: 1.5;
        color: #333;
    }
</style>