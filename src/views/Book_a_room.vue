<template>
    <div>
        <app-navbar />
        <div class="container">
            <h1 style="margin: 30px 0px 50px 0px;">Available Rooms</h1>
            <div class="card-container">
                <div v-for="room in availableRooms" :key="room.id" class="card">
                    <img :src="require('../../public/images/' + room.picture_of_room)" alt="Room Picture"
                        class="card-image">
                    <div class="card-content">
                        <h2>{{ room.room_number }}</h2>
                        <p>Price: {{ room.price }}</p>
                        <p>TV: {{ room.tv ? 'Yes' : 'No' }}</p>
                        <p>WiFi: {{ room.wifi ? 'Yes' : 'No' }}</p>
                        <p>Air Conditioning: {{ room.air_conditioning ? 'Yes' : 'No' }}</p>
                        <p>Safe Box: {{ room.safe_box ? 'Yes' : 'No' }}</p>
                        <p>Gym Access: {{ room.gym_access ? 'Yes' : 'No' }}</p>
                        <p>Balcony: {{ room.balcony ? 'Yes' : 'No' }}</p>
                        <button class="button" @click="showReservationForm(room.id)">Create Reservation</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Reservation Form -->
        <div v-if="showForm" class="reservation-form-overlay">
            <div class="reservation-form">
                <h2>Create Reservation</h2>
                <form @submit.prevent="createReservation">
                    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
                    <div class="form-group">
                        <label for="checkin-date">Check-In Date</label>
                        <input type="date" id="checkin-date" v-model="checkinDate"
                            :class="{ 'disabled-date': isDateBooked(checkinDate) }" required>
                        <div v-if="isDateBooked(checkinDate)" class="error-message">{{ isDateBookedMessage }}</div>
                    </div>
                    <div class="form-group">
                        <label for="checkout-date">Check-Out Date</label>
                        <input type="date" id="checkout-date" v-model="checkoutDate"
                            :class="{ 'disabled-date': isDateBooked(checkoutDate) }" required>
                        <div v-if="isDateBooked(checkoutDate)" class="error-message">{{ isDateBookedMessage }}</div>
                    </div>
                    <div class="form-group">
                        <label for="numberOfPeople">Number of People</label>
                        <input type="number" id="numberOfPeople" v-model="numberOfPeople" required>
                    </div>
                    <div class="form-actions">
                        <button class="button" type="submit">Make Reservation</button>
                        <button class="button" @click="cancelReservation">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    import { verifyToken } from '../tokenUtils.js';
    import AppNavbar from "../components/AppNavbar.vue";
    import axios from 'axios';

    export default {
        name: 'Book_a_room',
        components: {
            AppNavbar,
        },
        data() {
            return {
                availableRooms: [],
                showForm: false,
                numberOfPeople: '',
                checkinDate: '',
                checkoutDate: '',
                selectedRoomId: null,
                errorMessage: '',
                isDateBookedMessage: '',
                bookedDates: [], // Stores the booked dates for the selected room
            };
        },
        mounted() {
            this.fetchAvailableRooms();
            document.addEventListener('click', this.handleTicketRefresh);
        },
        beforeUnmount() {
            document.removeEventListener('click', this.handleTicketRefresh);
        },
        // async handleClick() {
        // const isTokenValid = await verifyToken();
        // if (!isTokenValid) {
        //     console.log("Please login");
        //     this.$router.push('./login');
        //     return;
        // }
        // },
        methods: {
            async handleTicketRefresh() {
                const isTokenValid = await verifyToken();
                if (!isTokenValid) {
                    console.log("Please login");
                    this.$router.push('./login');
                    return;
                }
            },
            //adauga toate camerele in available rooms
            fetchAvailableRooms() {
                axios.get('http://localhost:3000/allRooms')
                    .then(response => {
                        this.availableRooms = response.data;
                    })
                    .catch(error => {
                        console.error(error);
                    });
            },
            //form rezervare
            async showReservationForm(roomId) {
                this.selectedRoomId = roomId;
                this.showForm = true;
                console.log("We are in show reservations, going to call fetch BookedDates");
                this.fetchBookedDates();
            },
            //Ia datele de booking pentru fiecare camera
            fetchBookedDates() {
                console.log("Entering fetchBookedDates");
                console.log("Room ID: " + this.selectedRoomId);
                axios.get('http://localhost:3000/bookedDates', {
                    params: {
                        roomId: this.selectedRoomId,
                    }
                })
                    .then(response => {
                        this.bookedDates = response.data;
                        console.log(this.bookedDates); // Verify the retrieved data
                    })
                    .catch(error => {
                        console.error(error);
                    });
            },
            //verifici data introdusa cu datele booked
            isDateBooked(date) {
                return this.bookedDates.some(bookedDate => {
                    console.log("entered isDateBooked");
                    console.log("date: " + date);
                    const selectedDate = new Date(date);
                    console.log("selected date : " + selectedDate);
                    // ---------------------------------------
                    const selectedDayDate = selectedDate.getDate();
                    const selectedMonth = selectedDate.getMonth();
                    const selectedYear = selectedDate.getFullYear();

                    console.log("selected day date: " + selectedDayDate);
                    console.log("selectedMonth: " + selectedDayDate);
                    console.log("selectedYear: " + selectedDayDate);


                    const bookedCheckinDate = new Date(bookedDate.checkinDate);

                    // ---------------------------------------
                    const bookedCheckinDayDate = bookedCheckinDate.getDate();
                    const bookedCheckinMonth = bookedCheckinDate.getMonth();
                    const bookedCheckinYear = bookedCheckinDate.getFullYear();

                    console.log("bookedCheckinDayDate: " + bookedCheckinDayDate);
                    console.log("bookedCheckinMonth: " + bookedCheckinMonth);
                    console.log("bookedCheckinYear: " + bookedCheckinYear);



                    const bookedCheckoutDate = new Date(bookedDate.checkoutDate);
                    // ---------------------------------------
                    const bookedCheckoutDayDate = bookedCheckoutDate.getDate();
                    const bookedCheckoutMonth = bookedCheckoutDate.getMonth();
                    const bookedCheckoutYear = bookedCheckoutDate.getFullYear();

                    console.log("bookedCheckoutDayDate: " + bookedCheckoutDayDate);
                    console.log("bookedCheckoutMonth: " + bookedCheckoutMonth);
                    console.log("bookedCheckoutYear: " + bookedCheckoutYear);


                    if (selectedDayDate >= bookedCheckinDayDate && selectedMonth == bookedCheckinMonth && selectedYear == bookedCheckinYear && selectedDayDate <= bookedCheckoutDayDate && selectedMonth == bookedCheckoutMonth && selectedYear == bookedCheckoutYear) {
                        this.isDateBookedMessage = "The date has already been booked.";
                        return true;
                    } else {
                        return false;
                    }

                    // return selectedDayDate >= bookedCheckinDayDate && selectedMonth == bookedCheckinMonth && selectedYear == bookedCheckinYear && selectedDayDate <= bookedCheckoutDayDate && selectedMonth == bookedCheckoutMonth && selectedYear == bookedCheckoutYear;

                    // de la selectat este  28.05.2023 => 27.05.2023 ---- 30.05.2023
                    // return selectedDate >= bookedCheckinDate && selectedDate <= bookedCheckoutDate;
                });
            },
            createReservation() {
                const checkinDateTime = new Date(this.checkinDate + 'T12:00:00');
                const checkoutDateTime = new Date(this.checkoutDate + 'T12:00:00');


                // Adjust for the local time zone offset
                const checkinOffset = checkinDateTime.getTimezoneOffset() * 60000;
                const checkoutOffset = checkoutDateTime.getTimezoneOffset() * 60000;

                const checkinLocalDateTime = new Date(checkinDateTime - checkinOffset); 
                const checkoutLocalDateTime = new Date(checkoutDateTime - checkoutOffset);


                const currentDate = new Date();
                // ---------------------------------------
                const currentDayDate = currentDate.getDate();
                const currentMonth = currentDate.getMonth();
                const currentYear = currentDate.getFullYear();

                const selectedCheckinDate = new Date(this.checkinDate);
                // ---------------------------------------
                const selectedCheckinDayDate = selectedCheckinDate.getDate();
                const selectedCheckinMonth = selectedCheckinDate.getMonth();
                const selectedCheckinYear = selectedCheckinDate.getFullYear();

                const selectedCheckoutDate = new Date(this.checkoutDate);
                // ---------------------------------------
                const selectedCheckoutDayDate = selectedCheckoutDate.getDate();
                const selectedCheckoutMonth = selectedCheckoutDate.getMonth();
                const selectedCheckoutYear = selectedCheckoutDate.getFullYear();

                
                if (!this.isDateBooked(selectedCheckinDate) && !this.isDateBooked(selectedCheckoutDate)) {

                    if (
                        (selectedCheckinYear > currentYear) ||
                        (selectedCheckinYear === currentYear && selectedCheckinMonth > currentMonth) ||
                        (selectedCheckinYear === currentYear && selectedCheckinMonth === currentMonth && selectedCheckinDayDate > currentDayDate)
                    ) {
                        if (
                            (selectedCheckoutYear > selectedCheckinYear) ||
                            (selectedCheckoutYear === selectedCheckinYear && selectedCheckoutMonth > selectedCheckinMonth) ||
                            (selectedCheckoutYear === selectedCheckinYear && selectedCheckoutMonth === selectedCheckinMonth && selectedCheckoutDayDate > selectedCheckinDayDate)
                        ) {
                            
                            axios.post('http://localhost:3000/createReservation', {
                                userId: localStorage.getItem("id"),
                                roomId: this.selectedRoomId,
                                checkin_date: checkinLocalDateTime.toISOString(),
                                checkout_date: checkoutLocalDateTime.toISOString(),
                                nr_of_people: this.numberOfPeople
                            })
                                .then(response => {
                                    console.log(response);
                                    alert("The reservation has been created!");
                                })
                                .catch(error => {
                                    console.error(error);
                                });


                            this.cancelReservation();


                        } else {
                            this.errorMessage = "Invalid Check-out-date. Please select a date that is higher with at least 1 than the Check-in-date";
                        }

                    } else {
                        this.errorMessage = "Invalid Check-in-date. Please select a date equal to or later than the current date.";
                    }
                } else {
                    this.errorMessage = "The dates are already booked";
                }
            },
            cancelReservation() {
                this.showForm = false;
                this.selectedRoomId = null;
                this.checkinDate = '';
                this.checkoutDate = '';
                this.numberOfPeople = '';
                this.errorMessage = '';
                this.isDateBookedMessage = '';
            },
        },
    };
</script>


<style scoped>
    input[type="date"].disabled-date {
        border-color: red;
    }

    .error-message {
        margin-bottom: 10px;
        color: red;
    }

    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
    }

    .card-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 370px));
        grid-gap: 20px;
    }

    .card {
        background-color: #f2f2f2;
        border-radius: 10px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        /* width: 400px; */
    }

    .card-image {
        max-width: 100%;
        height: 200px;
        border-radius: 10px;
        margin-bottom: 10px;
    }

    .card-content {
        flex-grow: 1;
    }

    h1 {
        text-align: center;
    }

    h2 {
        margin-bottom: 10px;
    }

    p {
        margin-bottom: 5px;
    }

    /* Reservation Form Styles */

    .reservation-form-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.6);
    }

    .reservation-form {
        background-color: white;
        padding: 20px;
        border-radius: 10px;
        width: 400px;
    }

    .form-group {
        margin-bottom: 20px;
    }

    .form-group input[type="number"] {
        width: 100%;
        padding: 10px;
        border-radius: 4px;
        border: 1px solid #ccc;
    }

    label {
        display: block;
        font-weight: bold;
        margin-bottom: 5px;
    }

    input[type="date"] {
        width: 100%;
        padding: 10px;
        border-radius: 5px;
        border: 1px solid #ccc;
    }

    .form-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
    }

    .button {
        display: inline-block;
        padding: 10px 20px;
        background-color: #ca5132;
        color: white;
        text-align: center;
        text-decoration: none;
        border-radius: 5px;
        border: none;
        cursor: pointer;
        font-size: 16px;
        transition-duration: 0.4s;
        margin: 20px 10px 0px 0px;
    }

    .button:hover {
        background-color: #ad412b;
    }

    @media (max-width: 768px) {
        .reservation-form {
            width: 90%;
        }
    }
</style>