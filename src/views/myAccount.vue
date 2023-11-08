<template>
    <app-navbar />

    <div class="user-data-container">
        <div class="content-container">
            <h1><b>User Data</b></h1>
            <div class="user-info">
                <div class="info-item">
                    <label>First Name:</label>
                    <span>{{ userData.firstName }}</span>
                </div>
                <div class="info-item">
                    <label>Last Name:</label>
                    <span>{{ userData.lastName }}</span>
                </div>
                <div class="info-item">
                    <label>Email:</label>
                    <span>{{ userData.email }}</span>
                </div>
                <!-- Add more user data fields as needed -->
            </div>

            <template v-if="userData.role == 0">
                <ul>
                    <h1 style="margin-top:30px; margin-bottom:15px;"><b>Personal Reservations</b></h1>
                    <li v-for="room in sortedRoomDetails" :key="room.reservation_id">
                        <template v-if="!room.expired_reservation">
                            <b>Reservation Nr:</b> {{ room.reservation_id }},
                            <b>Room:</b> {{ room.room_number }},
                            <b>Check-in Date:</b> {{ formatDateTime(room.checkin_date) }},
                            <b>Checkout Date:</b> {{ formatDateTime(room.checkout_date) }},
                            <b>Payment:</b> {{ room.price }}
                            <button class="remove-button"
                                @click="removeReservation(room.reservation_id)">Remove</button>
                        </template>
                        <template v-else>
                            <b><span style="color:red">EXPIRED:</span> Reservation Nr:</b> {{ room.reservation_id }},
                            <b>Room:</b> {{ room.room_number }},
                            <b>Check-in Date:</b> {{ formatDateTime(room.checkin_date) }},
                            <b>Checkout Date:</b> {{ formatDateTime(room.checkout_date) }},
                            <b>Payment:</b> {{ room.price }}
                            <button v-if="!room.review" class="review-button" @click="openForm(room.reservation_id)">
                                Review
                            </button>
                        </template>
                    </li>
                </ul>

                <div v-if="showForm" class="form-overlay">
                    <div class="form-container">
                        <h1 style="padding-bottom:0px">Please write your review</h1>
                        <h6 style="color:gray ;font-size: 12px; padding-bottom:20px">(maximum 250 characters)</h6>
                        <button class="close-button" @click="closeForm">X</button>
                        <form @submit.prevent="submitReview">
                            <textarea v-model="reviewText" placeholder="Enter your review" maxlength="250"></textarea>
                            <button class="submit-button">Submit</button>
                        </form>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>


<script>
    import AppNavbar from "../components/AppNavbar.vue";
    import axios from 'axios';
    export default {
        data() {
            return {
                userData: {
                    email: '',
                    firstName: '',
                    lastName: '',
                    role:'',
                },
                roomDetails: [],
                id: '',
                showForm: false,
                reviewText: '',
                currentReservationId: '',
            };
        },
        components: {
            AppNavbar,
        },
        computed: {
            sortedRoomDetails() {
                const roomDetailsCopy = [...this.roomDetails];

                roomDetailsCopy.sort((a, b) => {
                    const dateA = new Date(a.checkin_date);
                    const dateB = new Date(b.checkin_date);

                    return dateA.getMonth() - dateB.getMonth();
                });

                return roomDetailsCopy;
            },
        },
        mounted() {
            this.userData.email = localStorage.getItem('email');
            this.userData.firstName = localStorage.getItem('first_name');
            this.userData.lastName = localStorage.getItem('last_name');
            this.id = localStorage.getItem('id');
            this.userData.role = localStorage.getItem('userRole');
            this.getAllReservationData();
            document.addEventListener('click', this.handleTicketRefresh);

        },
        beforeUnmount() {
            document.removeEventListener('click', this.handleTicketRefresh);
        },
        methods: {
            //inchide form review
            closeForm() {
                this.showForm = false;
                this.currentReservationId = '';
                this.reviewText = '';
            },
            //deschide form review
            openForm(reservationId) {
                this.showForm = true;
                this.currentReservationId = reservationId;
            },
            async submitReview() {
                try {
                    console.log("entered submitReview with reservation id: " + this.currentReservationId + " and " + this.reviewText);
                    const url = `http://localhost:3000/updateReservationReview`;
                    await axios.put(url, {
                        review: this.reviewText,
                        reservation_id: this.currentReservationId
                    });

                    // console.log(response.data);

                    alert("Review submitted");
                    this.closeForm();
                    window.location.reload();
                } catch (error) {
                    console.error(error);
                }
            },
            //pune exxpired cand expira
            async checkRoomExpiration() {
                console.log("checkRoomExpiration()");
                const roomDetailsCopy = [...this.roomDetails];
                // console.log(roomDetailsCopy);

                for (var i = 0; i < roomDetailsCopy.length; i++) {
                    var currentRoomDetail = roomDetailsCopy[i];
                    // console.log(currentRoomDetail);
                    // console.log(currentRoomDetail.expired_reservation);
                    if (!currentRoomDetail.expired_reservation) {
                        console.log("entered it is not expired");
                        var current_reservation_id = currentRoomDetail.reservation_id;
                        console.log(current_reservation_id);

                        var currentDate = new Date();
                        // ---------------------------------------
                        const currentDayDate = currentDate.getDate();
                        const currentMonth = currentDate.getMonth();
                        const currentYear = currentDate.getFullYear();

                        var checkoutDate = new Date(currentRoomDetail.checkout_date);
                        // ---------------------------------------
                        const checkoutDateDayDate = checkoutDate.getDate();
                        const checkoutDateMonth = checkoutDate.getMonth();
                        const checkoutDateYear = checkoutDate.getFullYear();

                        // console.log("currentDate: " + currentDate);
                        // console.log("checkoutDate: " + checkoutDate);

                        if (
                            (currentYear > checkoutDateYear) ||
                            (currentYear === checkoutDateYear && currentMonth > checkoutDateMonth) ||
                            (currentYear === checkoutDateYear && currentMonth === checkoutDateMonth && currentDayDate > checkoutDateDayDate)) {

                            // console.log("entered ");
                            this.roomDetails[i].expired_reservation = true;


                            try {
                                const url = `http://localhost:3000/updateExpiredReservation`;
                                await axios.put(url, { reservation_id: current_reservation_id });
                                // console.log(response.data); // Log the response from the server
                                alert("Reservation has been canceled");
                                // Perform any additional actions after the reservation has been canceled
                            } catch (error) {
                                console.error(error);
                            }

                        }



                        // console.log("entered");
                        // this.roomDetails[i].expired = true;
                        // console.log(this.roomDetails);
                    } 
                }

            },
            formatDateTime(dateTime) {
                const options = {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                };

                const formattedDate = new Intl.DateTimeFormat(undefined, options).format(new Date(dateTime));

                // Manually adjust 12 AM to 12 PM
                if (formattedDate.includes('12:00 AM')) {
                    return formattedDate.replace('12:00 AM', '12:00 PM');
                }

                return formattedDate;
            },

            // GETS ALL THE RESERVATION DATA
            async getAllReservationData() {
                console.log("Entering getAllReservationData()");
                try {
                    const url = 'http://localhost:3000/allPersonalReservations/' + this.id;
                    // console.log(url);
                    const response = await axios.get(url);
                    const reservations = response.data;

                    for (const reservation of reservations) {
                        // console.log("Reservation: ", reservation);
                        await this.getRoomDetails(reservation.room_id, reservation.id, reservation.checkin_date, reservation.checkout_date, reservation.expired_reservation, reservation.review);
                    }


                    this.checkRoomExpiration();
                    // console.log(this.roomDetails);
                } catch (error) {
                    console.error(error);
                }
            },

            // removeReservation() is used to work with the button that lets us remove the reservation
            async removeReservation(reservationId) {
                try {
                    const url = `http://localhost:3000/removeReservation`;
                    await axios.delete(url, {
                        params: {
                            reservation_id: reservationId,
                        },
                    });

                    alert("Reservation has been canceled");
                    window.location.reload();
                } catch (error) {
                    console.error(error);
                }
            },

            // WE USE GetRoomDetails() to get all the details of the room that has been booked
            async getRoomDetails(room_id, reservation_id, checkin_date, checkout_date, expired_reservation, review) {
                try {
                    console.log("Entering getRoomDetails()");
                    const url = 'http://localhost:3000/getRoom/' + room_id;
                    // console.log(url);
                    const response = await axios.get(url);
                    const roomResponse = response.data;


                    for (const roomDetail of roomResponse) {
                        // console.log("Room Detail: ", roomDetail);

                        var roomDetailsObj = {
                            'room_id': room_id,
                            'reservation_id': reservation_id,
                            'hotel_id': roomDetail.hotel_id,
                            'room_number': roomDetail.room_number,
                            'price': roomDetail.price,
                            'checkin_date': checkin_date,
                            'checkout_date': checkout_date,
                            'expired_reservation': expired_reservation,
                            'review': review,
                        };


                        // console.log("checkin_date: " + checkin_date);
                        // console.log("checkout_date: " + checkout_date);

                        this.roomDetails.push(roomDetailsObj);
                    }
                } catch (error) {
                    console.error(error);
                }
            }

        },
    };
</script>

<style scoped>
    .form-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 999;
    }

    .form-container {
        position: relative;
        max-width: 350px;
        background-color: #fff;
        padding: 20px;
        border-radius: 10px;
        text-align: center;

        display: flex;
        flex-direction: column;
        align-items: center;
        width: 80%;
        margin: 0 auto;
        padding-top: 40px;
    }

    .close-button {
        position: absolute;
        top: 0px;
        right: 0px;
        font-size: 15px;
        background: none;
        border: none;
        cursor: pointer;
        color: #333;
        background-color: rgb(201, 10, 10);
        padding: 5px 9px 5px 9px;
        color: white;
        border-top-right-radius: 5px;
    }

    textarea {
        width: 300px;
        height: 150px;
        margin-bottom: 20px;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
    }

    .submit-button {
        display: block;
        width: 150px;
        margin: 0 auto;
        padding: 10px;
        background-color: #28862b;
        border: none;
        border-radius: 5px;
        color: #fff;
        font-weight: bold;
        cursor: pointer;
    }

    .remove-button {
        background-color: #f50404;
        transition: background-color 0.3s ease;
        color: #ffffff;
        border: none;
        border-radius: 4px;
        padding: 6px 14px;
        font-size: 14px;
        cursor: pointer;
        margin-left: 10px;
    }

    .remove-button:hover {
        background-color: #ec2727d8;
    }

    .review-button {
        background-color: #325f35;
        transition: background-color 0.3s ease;
        color: #ffffff;
        border: none;
        border-radius: 4px;
        padding: 6px 16px;
        font-size: 14px;
        cursor: pointer;
        margin-left: 10px;
    }

    .review-button:hover {
        background-color: #325f35e5;
    }


    .user-data-container {
        margin: 20px;
    }

    .content-container {
        background-color: #f5f5f5;
        padding: 20px;
    }

    h1 {
        font-size: 24px;
        margin-bottom: 10px;
    }

    .user-info {
        margin-bottom: 20px;
    }

    .info-item {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
    }

    .info-item label {
        font-weight: bold;
        margin-right: 10px;
    }

    ul {
        list-style: none;
        padding: 0;
    }

    li {
        margin-bottom: 10px;
    }

    .user-data-container {
        background-color: #fff;
    }

    .content-container {
        background-color: #f5f5f5;
    }

    h1 {
        color: #333;
    }

    .info-item label {
        color: #333;
    }
</style>