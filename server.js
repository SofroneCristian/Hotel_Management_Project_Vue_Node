// Database connection
//import client database.js
const client = require("./src/database.js");
// Express framework pentru Requesturi API
const express = require("express");
//handling HTTP GET PUT ALEA
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
//Token securitate
const jwt = require("jsonwebtoken");
const cors = require("cors");

// USED IN ORDER TO GET THE KEY FROM THE .env FILE
require("dotenv").config();
const app = express();
// Server PORT
const port = 3000;

const SECRET_KEY = process.env.SECRET_KEY;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
//conexiunea la baza de date
client.connect();

// Login route
//Verifica daca parolele coincid, folosind bcrypt pt comparare, daca este corecta compararea se genereaza un token
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  console.log("email entered: " + email);
  console.log("password entered: " + password);
  //
  // Find by EMAIL (putem schimba in viitor, cautam dupa username de ex)
  client.query(
    "SELECT * FROM users WHERE email = $1",
    [email],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "An unexpected error occurred." });
      } else if (result.rows.length === 0) {
        res.status(401).json({ error: "Invalid email or password." });
      } else {
        const user = result.rows[0];
        // Compare the password
        bcrypt.compare(password, user.password, (err, match) => {
          if (err) {
            // console.error(err);
            res.status(500).json({ error: "An unexpected error occurred." });
          } else if (!match) {
            res.status(401).json({ error: "Invalid email or password." });
          } else {
            // Generate a JWT token
            const token = jwt.sign(
              {
                userId: user.id,
                userRole: user.role,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
              },
              SECRET_KEY,
              { expiresIn: "60m" }
            );
            res.json({ token });
          }
        });
      }
    }
  );
});

// Signup route
app.post("/signup", (req, res) => {
  const { email, password, first_name, last_name, role } = req.body;

  // Hash the password using bcrypt
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    // console.log("entered password: " + password);
    if (err) {
      console.error(err);
      res.status(500).json({ error: "An unexpected error occurred." });
    } else {
      client.query(
        "INSERT INTO users (email, password, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5)",
        [email, hashedPassword, first_name, last_name, role],
        (err) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: "An unexpected error occurred." });
          } else {
            res.json({ message: "User registered successfully." });
          }
        }
      );
    }
  });
});
//Se foloseste doar cand se face loginu initial primeste toate datele userului si apeleaza verifytoken sa verifice daca a expirat sau este inca corect
// Protected route
  app.get("/protected", verifyToken, (req, res) => {
    // console.log("req.userId: " + req.userId);
    // console.log("req.role: " + req.userRole);
    res.json({
      message: "Login done successfully.",
      userId: req.userId,
    userRole: req.userRole,
    email: req.email,
    first_name: req.first_name,
    last_name: req.last_name,
  });
});
//verificare token
// Middleware to verify JWT token
function verifyToken(req, res, next) {
  // Primim un token prin 'authorization'
  const token = req.headers["authorization"];
  if (!token) {
    res.status(401).json({ error: "No token provided." });
  } else {
    // Ii dam decode folosindu-ne de SECRET_KEY
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          console.error("Token has expired");
          res.status(403).json({ error: "Token has expired" });
        } else {
          res.status(401).json({ error: "Invalid token." });
        }
      } else {
        // DACA SE DECODEAZA => AVEM user, role pe care le luam din jwt (primite in sign)
        req.userId = decoded.userId;
        req.userRole = decoded.userRole;
        req.email = decoded.email;
        req.first_name = decoded.first_name;
        req.last_name = decoded.last_name;

        // next() continua flow-ul prin sebsecvente, pana ajunge la final route handler
        next();
      }
    });
  }
}

// GETS ALL THE ROOMS THAT HAVE THE AVAILABILITY SET TO 0
app.get("/allRooms", async (req, res) => {
  const hotelId = 1;

  client.query(
    "SELECT * FROM rooms where hotel_id = $1",
    [hotelId],
    (err, result) => {
      if (!err) {
        res.send(result.rows);
      } else {
        console.log("err: " + err);
      }
    }
  );
});

app.post("/createReservation", (req, res) => {
  const { userId, roomId, checkin_date, checkout_date, nr_of_people } =
    req.body;

  console.log("checkin_date: " + checkin_date);
  console.log("checkout_date: " + checkout_date);

  client.query(
    "INSERT INTO reservations (user_id, room_id, checkin_date, checkout_date, no_of_people) VALUES ($1, $2, $3, $4, $5)",
    [userId, roomId, checkin_date, checkout_date, nr_of_people],
    (err) => {
      if (err) {
        console.error(err);
      } else {
        res.json({ message: "Reservation created!" });
      }
    }
  );
});

// GETS ALL THE ROOMS THAT HAVE THE AVAILABILITY SET TO 0
// app.get('/allRooms', async (req, res) => {

//   const hotelId = 1;

//   client.query('SELECT * FROM rooms where hotel_id = $1', [hotelId], (err, result) => {
//     if (!err) {
//       res.send(result.rows);
//     } else {
//       console.log("err: " + err);
//     }
//   });
// });

app.get("/bookedDates", (req, res) => {
  const { roomId } = req.query;

  client.query(
    "SELECT checkin_date, checkout_date FROM reservations WHERE room_id = $1",
    [roomId],
    (err, result) => {
      if (!err) {
        const bookedDates = result.rows.map((row) => ({
          checkinDate: row.checkin_date,
          checkoutDate: row.checkout_date,
        }));

        console.log(bookedDates);

        return res.json(bookedDates);
      } else {
        console.log("err: " + err);
      }
    }
  );
});

app.delete("/removeReservation", (req, res) => {
  const { reservation_id } = req.query;

  client.query(
    "delete from reservations where id = $1",
    [reservation_id],
    (err, result) => {
      if (!err) {
        return res.json("Reservation deleted");
      } else {
        console.log("err: " + err);
      }
    }
  );
});

app.put("/updateExpiredReservation", (req, res) => {
  const { reservation_id } = req.body;

  console.log(reservation_id);
  client.query(
    "UPDATE reservations SET expired_reservation = true where id=$1",
    [reservation_id],
    (err, result) => {
      if (!err) {
        return res.json("Reservation updated");
      } else {
        console.log("err: " + err);
      }
    }
  );
});

app.put("/updateReservationReview", (req, res) => {
  const { review, reservation_id } = req.body;

  console.log("review: " + review);
  console.log("reservation_id: " + reservation_id);
  client.query(
    "UPDATE reservations SET review = $1 where id=$2",
    [review, reservation_id],
    (err, result) => {
      if (!err) {
        return res.json("Reservation updated");
      } else {
        console.log("err: " + err);
      }
    }
  );
});

// app.put('/updateAvailability', (req, res) => {
//   const { roomId } = req.body;

//   client.query(
//     'UPDATE rooms SET available = false WHERE id = $1',
//     [roomId],
//     (err) => {
//       if (err) {
//         console.error(err);
//       } else {
//         res.json({ message: 'Updated the room availability' });
//       }
//     }
//   );
// });

// GETS ALL THE PERSONAL RESERVATIONS BASED ON THE ID
app.get("/allPersonalReservations/:id", async (req, res) => {
  const { id } = req.params;

  client.query(
    "SELECT * FROM reservations WHERE user_id = $1",
    [id],
    (err, result) => {
      if (!err) {
        res.send(result.rows);
      }
    }
  );
});

app.get("/allReservations", async (req, res) => {
  client.query("SELECT * FROM reservations", (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
});

app.get("/user", async (req, res) => {
  const { userId } = req.query;
  client.query(
    "SELECT first_name, last_name, email FROM users where id= $1",
    [userId],
    (err, result) => {
      if (!err) {
        res.send(result.rows);
      }
    }
  );
});

// GETS ALL THE PERSONAL RESERVATIONS BASED ON THE ID
app.get("/getRoom/:id", async (req, res) => {
  const { id } = req.params;

  client.query("SELECT * FROM rooms WHERE id = $1", [id], (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
});

// MAKES THE APP LISTEN TO THE PORT THAT WE CREATED
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
