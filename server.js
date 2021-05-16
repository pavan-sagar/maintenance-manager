const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const passport = require("passport");
const session = require("express-session");
const bcrypt = require("bcrypt");

mongoose.set("debug", true);

//Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "http://localhost:3001","http://localhost:3002"],
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

//Users collection schema
const residentsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    societyName: {
      type: String,
      required: true,
    },
    flatNo: {
      type: Number,
      required: true,
    },
    wing: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: true,
    },
    pincode: {
      type: Number,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { collection: "residents" }
);

//Societies collection scheme

const societiesSchema = new mongoose.Schema({
  adminEmail: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  wings: {
    type: [String],
    required: true,
  },
  pincode: {
    type: Number,
    required: true,
  },
});

//Transactions Schema

const transactionsSchema = new mongoose.Schema(
  {
    flatID: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    period: {
      type: String,
      required: true,
    },
    paidOn: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//Residents model
const residents =  mongoose.model("residents", residentsSchema);

//Societies model
const societies = mongoose.model("societies", societiesSchema);

//Transactions Model
const transactions = mongoose.model("transactions", transactionsSchema);

const initializePassport = require("./passport-config");
const { default: next } = require("next");
initializePassport(passport, residents);

app.use(
  session({
    secret: "cool cat",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

//APIS here

//Authenticate / Sign In
app.all("/api/signin", checkNotAuthenticated, function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.send(info);
    }

    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.send({ message: "Success", userInfo: user });
    });
  })(req, res, next);
});

//Sign Out
app.get("/api/signout", checkAuthenticated, (req, res) => {
  req.logOut();
  res.send({ message: "logged out" });
});

//Check authentication status
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.send({ message: "please log in" });
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.send({ message: "Already authenticated" });
  }
  return next();
}

//GET societies
app.get("/api/get/societies", (req, res) => {
  societies.find(null, "name wings area pincode", (err, societies) => {
    if (err) res.send(err);
    res.send(societies);
  });
});

//ADD resident / New resident registration
app.post("/api/add/resident", async (req, res, next) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  //Check if the flat no is already registered
  residents.find(
    {
      societyName: req.body.societyName,
      pincode: req.body.pincode,
      area: req.body.area,
      wing: req.body.wing,
      flatNo: req.body.flatNo,
    },
    (err, resident) => {
      if (err) next(err);

      if (resident.length) {
        res.status(400).send("This flat is already registered.");
      } else {
        //New registration
        residents.create(
          { ...req.body, password: hashedPassword },
          (err, resident) => {
            if (resident) {
              res.status(200).send("Resident created successfully");
            }
            if (err) {
              next(err);
            }
          }
        );
      }
    }
  );
});

//Send payment / Transact
app.post("/api/transact", (req, res, next) => {
  transactions.create(
    {
      flatID: req.body.flatID,
      amount: req.body.amount,
      period: req.body.period,
      paidOn: req.body.paidOn,
    },
    (err, transaction) => {
      if (err) next(err);
    }
  );
});

//GET transactions
app.get('/api/get/transactions',(req,res,next)=>{
  transactions.find({flatID:req.query.flatID},(err,transaction)=>{
    if (err) next(err)
    res.send(transaction)
  })
})

// Not found middleware
app.use((req, res, next) => {
  return next({ status: 404, message: "not found" });
});

// Error Handling middleware
app.use((err, req, res, next) => {
  console.log("inside error handler");
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

