const express = require("express");
const app = express();

const cors = require("cors");

const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("debug", true);

//Connect to DB

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static("public"));

//APIS here

//Users collection schema
let usersSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { collection: "users" }
);

//Users model
let users = mongoose.model("users", usersSchema);

//Check if user is registered and password is correct
app.post("/login", (req, res) => {
  users.findOne({ email: req.body.email }, (err, user) => {
    if (err) res.send("An error has occured");
    if (user) {
      users.findOne({ password: req.body.password }, (err, password) => {
        if (err) console.log(err);
        if (password) {
          res.send("You have successfully been authenticated!!!");
        } else {
          res.send("Incorrect Password");
        }
      });
    } else {
      res.send("Wrong email. Please provide correct email id");
    }
  });
});

// Not found middleware
app.use((req, res, next) => {
  return next({ status: 404, message: "not found" });
});

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage;

  if (err.errors) {
    // mongoose validation error
    errCode = 400; // bad request
    const keys = Object.keys(err.errors);
    // report the first validation error
    errMessage = err.errors[keys[0]].message;
  } else {
    // generic or custom error
    errCode = err.status || 500;
    errMessage = err.message || "Internal Server Error";
  }
  res.status(errCode).type("txt").send(errMessage);
});

const listener = app.listen(process.env.PORT || 3001, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
