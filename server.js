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
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
    ],
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

//Dues schema
const duesSchema = new mongoose.Schema(
  {
    flatID: String,
    dueDate: Date,
    status: String,
    amount: Number,
    period: [Number],
    year: Number,
  },
  {
    timestamps: true,
  }
);

//Buildings Schema
const buildingsSchema = new mongoose.Schema({
  buildingID: String,
  chairman: String,
  maintenancePerMonth: Number,
  collectAfterHowManyMonths: Number,
  collectionOrder: String,
  dueDay: Number,
  mainStartPeriod: Number,
  mainStartYear: Number,
});

//Residents model
const residents = mongoose.model("residents", residentsSchema);

//Societies model
const societies = mongoose.model("societies", societiesSchema);

//Transactions Model
const transactions = mongoose.model("transactions", transactionsSchema);

//Buildings Model
const buildings = mongoose.model("buildings", buildingsSchema);

//Dues model
const dues = mongoose.model("dues", duesSchema);

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
app.get("/api/get/transactions", (req, res, next) => {
  transactions.find({ flatID: req.query.flatID }, (err, transaction) => {
    if (err) next(err);
    res.send(transaction);
  });
});

//GET last payment info
app.get("/api/get/transactions/last", (req, res, next) => {
  transactions.findOne(
    { flatID: req.query.flatID },
    null,
    { sort: { createdAt: -1 } },
    (err, transaction) => {
      if (err) next(err);

      res.send(transaction);
    }
  );
});

//GET dues
app.get("/api/get/dues", (req, res, next) => {
  dues.find(
    { flatID: req.query.flatID, status: "Pending" },
    "period year amount",
    (err, due) => {
      if (err) next(err);
      res.send(due);
    }
  );
});

//Calculate dues
app.get("/api/calculate/dues", (req, res, next) => {
  //1. For each society

  societies.find({}, "name wings pincode", (err, society) => {
    if (err) next(err);
    society.map((soc) => {
      const { name, pincode } = soc;
      //2. For each building in that society
      soc.wings.map((building) => {
        const buildingID = `${building}-${name}-${pincode}`;
        buildings.find({ buildingID }, { chairman: 0 }, async (err, build) => {
          if (err) next(err);

          //Building is registered
          if (build.length > 0) {
            const [
              {
                maintenancePerMonth,
                collectAfterHowManyMonths,
                collectionOrder,
                dueDay,
                mainStartPeriod,
                mainStartYear,
              },
            ] = build;

            let startMainMonth;
            let startMainYear;

            //Get the start period and year of maintenance collection beginning,
            //Get the month frequency and order (Pre/Post) of the collection and calculation due dates

            //Values to test logic
            // let collectionOrder = "Postpaid";
            // let mainStartPeriod = 1;
            // let collectAfterHowManyMonths = 12;
            // let mainStartYear = 2022;
            // let dueDay = 10

            const getNextDueDate = (
              startPeriod,
              startYear,
              incrementalMonths
            ) => {
              let nextMonth =
                (startPeriod + incrementalMonths) % 12 == 0
                  ? 12
                  : (startPeriod + incrementalMonths) % 12;

              let nextYear =
                startPeriod + incrementalMonths > 12
                  ? startYear + 1
                  : startYear;

              return [nextMonth, nextYear];
            };

            //Calculate first due date of beginning of maintenance collection
            if (collectionOrder === "Prepaid") {
              startMainMonth =
                mainStartPeriod - 1 > 0
                  ? (mainStartPeriod - 1) % 12
                  : 12 - ((mainStartPeriod - 1) % 12);
              startMainYear = mainStartYear;

              if (mainStartPeriod == 1) {
                startMainYear = mainStartYear - 1;
              }
            } else {
              [startMainMonth, startMainYear] = getNextDueDate(
                mainStartPeriod,
                mainStartYear,
                collectAfterHowManyMonths
              );
            }

            let dueDateList = [];

            const firstDueDate = new Date(
              startMainYear,
              startMainMonth - 1,
              dueDay
            );

            dueDateList.push(firstDueDate);

            let nextDueDate = firstDueDate;

            while (nextDueDate < new Date(2030, 12, 10)) {
              let [nextMonth, nextYear] = getNextDueDate(
                nextDueDate.getMonth() + 1,
                nextDueDate.getFullYear(),
                collectAfterHowManyMonths
              );

              nextDueDate = new Date(nextYear, nextMonth - 1, dueDay);
              if (nextDueDate < new Date(2030, 12, 10))
                dueDateList.push(nextDueDate);
            }
          }
        });
      });
    });
  });
  //2. For each building in that society
  //Get the start period and year of maintenance collection beginning,
  //Get the month frequency and order (Pre/Post) of the collection and calculation due dates
  //For each due date and payment period
  //3.For each resident in that building
  //4.Check the list of transactions and find if payment is missed for any of the month given in above payment period
  //If yes, add an entry into dues table
  //If no, continue to next resident
});

// Not found middleware
app.use((req, res, next) => {
  return next({ status: 404, message: "not found" });
});

// Error Handling middleware
app.use((err, req, res, next) => {
  console.log("inside error handler", err);
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
