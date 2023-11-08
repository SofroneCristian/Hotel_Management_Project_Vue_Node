<template>
    <app-navbar />

    <div class="user-data-container">
        <div class="content-container">
            <ul>
                <h1 style="margin-top:30px; margin-bottom:15px;"><b>All Reservations</b></h1>
                <li v-for="room in sortedRoomDetails" :key="room.reservation_id">
                    <template v-if="!room.expired_reservation">
                        <b>Reservation Nr:</b> {{ room.reservation_id }},
                        <b>Room:</b> {{ room.room_number }},
                        <b>First Name:</b> {{ room.first_name}},
                        <b>Last Name:</b> {{ room.last_name}},
                        <b>EMAIL:</b> {{ room.email}},
                        <b>Check-in Date:</b> {{ formatDateTime(room.checkin_date) }},
                        <b>Checkout Date:</b> {{ formatDateTime(room.checkout_date) }},
                        <b>Payment:</b> {{ room.price }}
                        <button class="remove-button" @click="removeReservation(room.reservation_id)">Remove</button>
                    </template>
                    <template v-else>
                        <b><span style="color:red">EXPIRED:</span> Reservation Nr:</b> {{ room.reservation_id }},
                        <b>Room:</b> {{ room.room_number }},
                        <b>First Name:</b> {{ room.first_name}},
                        <b>Last Name:</b> {{ room.last_name}},
                        <b>EMAIL:</b> {{ room.email}},
                        <b>Check-in Date:</b> {{ formatDateTime(room.checkin_date) }},
                        <b>Checkout Date:</b> {{ formatDateTime(room.checkout_date) }},
                        <b>Payment:</b> {{ room.price }}
                        <b>Review:</b> {{ room.review }}
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
                    role: '',
                },
                roomDetails: [],
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
            this.getAllReservationData();
            document.addEventListener('click', this.handleTicketRefresh);
        },
        beforeUnmount() {
            document.removeEventListener('click', this.handleTicketRefresh);
        },
        methods: {
            async checkRoomExpiration() {
                console.log("checkRoomExpiration()");
                const roomDetailsCopy = [...this.roomDetails];
                // console.log(roomDetailsCopy);

                for (var i = 0; i < roomDetailsCopy.length; i++) {
                    var currentRoomDetail = roomDetailsCopy[i];
                    // console.log(currentRoomDetail);
                    // console.log(currentRoomDetail.expired_reservation);
                    if (!currentRoomDetail.expired_reservation) {
                        // console.log("entered it is not expired");
                        var current_reservation_id = currentRoomDetail.reservation_id;
                        // console.log(current_reservation_id);

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


                        if (
                            (currentYear > checkoutDateYear) ||
                            (currentYear === checkoutDateYear && currentMonth > checkoutDateMonth) ||
                            (currentYear === checkoutDateYear && currentMonth === checkoutDateMonth && currentDayDate > checkoutDateDayDate)) {

                            this.roomDetails[i].expired_reservation = true;


                            try {
                                const url = `http://localhost:3000/updateExpiredReservation`;
                                await axios.put(url, { reservation_id: current_reservation_id });
                                alert("Reservation has been canceled");
                            } catch (error) {
                                console.error(error);
                            }

                        }
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

                if (formattedDate.includes('12:00 AM')) {
                    return formattedDate.replace('12:00 AM', '12:00 PM');
                }

                return formattedDate;
            },

            // GETS ALL THE RESERVATION DATA
            async getAllReservationData() {
                console.log("Entering getAllReservationData()");
                try {
                    const url = 'http://localhost:3000/allReservations';
                    const response = await axios.get(url);
                    const reservations = response.data;

                    for (const reservation of reservations) {
                        await this.getRoomDetails(reservation.user_id, reservation.room_id, reservation.id, reservation.checkin_date, reservation.checkout_date, reservation.expired_reservation, reservation.review);
                    }
                    this.checkRoomExpiration();
                } catch (error) {
                    console.error(error);
                }
            },


            async getRoomDetails(user_id, room_id, reservation_id, checkin_date, checkout_date, expired_reservation, review) {
                try {
                    console.log("Entering getRoomDetails()");
                    const url = 'http://localhost:3000/getRoom/' + room_id;
                    const response = await axios.get(url);
                    const roomResponse = response.data;

                    var first_name;
                    var last_name;
                    var email;

                    try {
                        const url = 'http://localhost:3000/user';
                        // console.log(url);
                        const response = await axios.get(url, {
                            params: {
                                userId: user_id,
                            }
                        });

                        first_name = response.data[0].first_name;
                        last_name = response.data[0].last_name;
                        email = response.data[0].email;

                    } catch (error) {
                        console.error(error);
                    }


                    for (const roomDetail of roomResponse) {
                        var detailsObj = {
                            'first_name': first_name,
                            'last_name': last_name,
                            'email': email,
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
                        this.roomDetails.push(detailsObj);
                    }
                } catch (error) {
                    console.error(error);
                }
            },
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

        },
    };
</script>

<style scoped>
    ul {
        list-style-type: none;
        padding: 0;
        margin-top: 30px;
        margin-bottom: 15px;
    }

    li {
        margin-bottom: 20px;
        border: 1px solid #cccccc9c;
        padding: 10px;
        border-radius: 10px;
    }

    h1 {
        font-size: 24px;
        font-weight: bold;
    }

    b {
        font-weight: bold;
    }

    .remove-button,
    .review-button {
        padding: 5px 10px;
        border: none;
        background-color: #4285f4;
        color: #fff;
        cursor: pointer;
    }

    .review-button {
        background-color: #ff5722;
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

    /* ul {
        list-style: none;
        padding: 0;
    } */

    /* li {
        margin-bottom: 10px;
    } */

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