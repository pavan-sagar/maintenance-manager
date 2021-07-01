const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const passport = require("passport");
const session = require("express-session");
const bcrypt = require("bcrypt");
const subMonths = require("date-fns/subMonths");
const addMonths = require("date-fns/addMonths");
const eachMonthOfInterval = require("date-fns/eachMonthOfInterval");

mongoose.set("debug", true);

//Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(
  cors({
    credentials: true,
    origin: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

//Residents collection schema
const residentsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    societyName: {
      type: String,
    },
    flatNo: {
      type: Number,
    },
    wing: {
      type: String,
    },
    area: {
      type: String,
    },
    pincode: {
      type: Number,
    },
    flatID: {
      type: String,
    },
    buildingID: {
      type: String,
    },

    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
    },
    managedProperty: mongoose.Schema.Types.Mixed,
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
  societyID: String,
  area: String,
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
      type: [Number],
      required: true,
    },
    paidOn: {
      type: Date,
    },
    year: {
      type: Number,
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
  upcomingDueDetails: mongoose.Schema.Types.Mixed,
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

//GET all societies and CREATE societies
app.get("/api/get/societies", (req, res) => {
  //To verify if a society with given values already exists
  if (req.query.createSociety) {
    const { name, pincode } = req.query;
    societies.find({ name, pincode }, (err, society) => {
      if (err) next(err);
      if (society.length) {
        res.send("Society already exists.");
      } else {
        societies.create(req.query, (err, society) => {
          if (err) next(err);
          if (society) {
            res.status(200).send("Society created successfully !");
          }
        });
      }
    });
  } else {
    societies.find(
      null,
      "name wings area pincode adminEmail",
      (err, societies) => {
        if (err) res.send(err);
        res.send(societies);
      }
    );
  }
});

//UPDATE society
app.post("/api/update/society", (req, res) => {
  societies.findOneAndUpdate(
    { societyID: req.body.societyID },
    {
      $push: {
        wings: {
          $each: req.body.wingsArr,
          $sort: 1,
        },
      },
    },
    (err, output) => {
      if (err) next(err);
      res.status(200).send("Society Updated Successfully.");
    }
  );
});

//GET building
app.get("/api/get/building", (req, res, next) => {
  buildings.findOne(req.query, (err, output) => {
    if (err) next(err);
    res.status(200).send(output);
  });
});

//UPDATE building
app.post("/api/update/building", (req, res, next) => {
  buildings.updateOne(
    { buildingID: req.body.buildingID },
    req.body,
    (err, output) => {
      if (err) next(err);
      if (output.nModified) {
        res.send("Building updated successfully.");
      }
    }
  );
});

//ADD resident / New resident registration
app.post("/api/add/resident", async (req, res, next) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  //Check if admin account with given email id already exists
  if (req.body.isAdmin) {
    residents.find({ email: req.body.email }, (err, resident) => {
      if (err) next(err);
      if (resident.length) {
        res
          .status(400)
          .send("An admin account with this email id already exists.");
      } else {
        //New registration
        residents.create(
          { ...req.body, password: hashedPassword },
          (err, resident) => {
            if (resident) {
              res.status(200).send("Admin account created successfully.");
            }
            if (err) next(err);
          }
        );
      }
    });
  } else {
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
                res.status(200).send("Flat registered successfully.");
              }
              if (err) {
                next(err);
              }
            }
          );
        }
      }
    );
  }
});

//UPDATE resident
app.patch("/api/update/resident", (req, res, next) => {
  const { flatID, email } = req.body;
  //Check if a flat is already registered by another resident.
  residents.findOne({ flatID }, (err, output) => {
    if (err) next(err);

    if (output) {
      res.status(422).send("This flat is already registered.");
    } else {
      residents.updateOne({ email }, { ...req.body }, (err, output) => {
        if (err) next(err);
        if (output.nModified) {
          res.send("Flat registered successfully.");
        }
      });
    }
  });
});

//Send payment / Transact
app.post("/api/transact", (req, res, next) => {
  transactions.create(
    {
      flatID: req.body.flatID,
      amount: req.body.amount,
      period: req.body.period,
      year: req.body.year,
      paidOn: req.body?.paidOn || new Date(Date.now()),
    },
    (err, transaction) => {
      if (err) next(err);
      res.send(transaction);
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
    "amount paidOn period year",
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
      if (due.length) {
        res.send(due);
      } else {
        res.send([]);
      }
    }
  );
});

//Calculate dues of particular flat
app.get("/api/calculate/dues/", (req, res, next) => {
  const flatID = req.query.flatID;

  const buildingID = flatID.split("-").slice(1).join("-");

  buildings.find({ buildingID }, { chairman: 0 }, async (err, build) => {
    if (err) next(err);

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

    //Calculate first due date of beginning of maintenance collection

    const getNextDueDate = (year, period, isFirstDueDate = false) => {
      let nextDueDate;
      if (collectionOrder === "Prepaid" && isFirstDueDate) {
        nextDueDate = subMonths(new Date(year, period - 1, dueDay), 1);
      } else {
        nextDueDate = addMonths(
          new Date(year, period - 1, dueDay),
          collectAfterHowManyMonths
        );
      }

      return nextDueDate;
    };

    let firstDueDate = getNextDueDate(mainStartYear, mainStartPeriod, true);

    let dueDateList = [];
    let upcomingDueDetails = {
      periodRange: [],
    };

    if (firstDueDate < new Date(Date.now())) {
      dueDateList.push(firstDueDate);
    } else {
      upcomingDueDetails.date = firstDueDate;
    }

    let nextDueDate = firstDueDate;

    while (nextDueDate < new Date(Date.now())) {
      nextDueDate = getNextDueDate(
        nextDueDate.getFullYear(),
        nextDueDate.getMonth() + 1
      );

      if (nextDueDate < new Date(Date.now())) {
        dueDateList.push(nextDueDate);
      } else {
        upcomingDueDetails.date = nextDueDate;
      }
    }

    //Calculate and save data of future/upcoming due details
    const setFutureDueDetails = () => {
      let startDueDate;
      let endDueDate;
      let dueDate = upcomingDueDetails.date;

      if (collectionOrder === "Prepaid") {
        startDueDate = addMonths(dueDate, 1);

        endDueDate = addMonths(dueDate, collectAfterHowManyMonths);
      } else {
        startDueDate = subMonths(dueDate, collectAfterHowManyMonths);

        endDueDate = subMonths(dueDate, 1);
      }

      if (startDueDate === endDueDate) {
        //Collection is monthly
        upcomingDueDetails.periodRange = [startDueDate.getMonth() + 1];
        upcomingDueDetails.year = startDueDate.getFullYear();
        upcomingDueDetails.amount = maintenancePerMonth;
      } else {
        let dueDatesIntervals = eachMonthOfInterval({
          start: startDueDate,
          end: endDueDate,
        });
        upcomingDueDetails.year = endDueDate.getFullYear();

        dueDatesIntervals.map((item) => {
          let month = item.getMonth() + 1;
          upcomingDueDetails.periodRange.push(month);
        });

        upcomingDueDetails.amount =
          upcomingDueDetails.periodRange.length * maintenancePerMonth;
      }

      buildings.findOneAndUpdate(
        { buildingID },
        { upcomingDueDetails },
        (err, output) => {
          if (err) next(err);
          console.log(output);
        }
      );
    };

    setFutureDueDetails();

    //Check the list of transactions and find if payment is missed for any of the month given in above payment period
    transactions.find({ flatID }, "amount period year", (err, transactions) => {
      if (err) next(err);

      //Some transaction has been done by user
      if (transactions.length > 0) {
        dueDateList.map((dueDate) => {
          let startDueDate;
          let endDueDate;

          //Calculate the months for which payment has to be made by that due date

          if (collectionOrder === "Prepaid") {
            startDueDate = addMonths(dueDate, 1);

            endDueDate = addMonths(dueDate, collectAfterHowManyMonths);
          } else {
            startDueDate = subMonths(dueDate, collectAfterHowManyMonths);

            endDueDate = subMonths(dueDate, 1);
          }

          // We are creating a data structure like below where each key is year of due
          // and its value will be an array containing periods for which maintenance is due.

          // {
          //   "2020": [...],
          //   "2021":[...]
          // }

          let duePeriodArrObj = {};
          if (startDueDate === endDueDate) {
            //Collection is monthly
            if (startDueDate.getFullYear() in duePeriodArrObj) {
              duePeriodArrObj[startDueDate.getFullYear()].push(
                startDueDate.getMonth() + 1
              );
            } else {
              duePeriodArrObj[startDueDate.getFullYear()] = [
                startDueDate.getMonth() + 1,
              ];
            }
          } else {
            let dueDatesIntervals = eachMonthOfInterval({
              start: startDueDate,
              end: endDueDate,
            });

            dueDatesIntervals.map((item) => {
              let month = item.getMonth() + 1;
              let year = item.getFullYear();

              if (year in duePeriodArrObj) {
                duePeriodArrObj[year].push(month);
              } else {
                duePeriodArrObj[year] = [month];
              }
            });
          }

          let dueYearsArr = Object.keys(duePeriodArrObj);

          dueYearsArr.map((year) => {
            let paidPeriods = transactions
              .filter((trx) => trx.year === Number(year))
              .map((trx) => trx.period)
              .flat();

            let periodsNotPaid = duePeriodArrObj[year].filter(
              (duePeriod) => !paidPeriods.includes(duePeriod)
            );

            if (periodsNotPaid.length > 0) {
              let query = {
                flatID,
                status: "Pending",
                period: periodsNotPaid,
                year,
              };
              let update = {
                flatID,
                dueDate,
                status: "Pending",
                amount: maintenancePerMonth * periodsNotPaid.length,
                period: periodsNotPaid,
                year,
              };

              let condition = { upsert: true, new: true };

              dues.findOneAndUpdate(query, update, condition, (err, due) => {
                if (err) next(err);
              });
            }
          });
        });
      }
    });
  });

  res.status(200).send({ status: "Success" });
  //   }); //
  // }//
  // })
});

//Calculate dues
app.get("/api/calculate/dues/all-societies", (req, res, next) => {
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

            //Get the start period and year of maintenance collection beginning,
            //Get the month frequency and order (Pre/Post) of the collection and calculation due dates

            //Values to test logic
            // let collectionOrder = "Postpaid";
            // let mainStartPeriod = 1;
            // let collectAfterHowManyMonths = 12;
            // let mainStartYear = 2022;
            // let dueDay = 10

            //Calculate first due date of beginning of maintenance collection

            const getNextDueDate = (year, period, isFirstDueDate = false) => {
              let nextDueDate;
              if (collectionOrder === "Prepaid" && isFirstDueDate) {
                nextDueDate = subMonths(new Date(year, period - 1, dueDay), 1);
              } else {
                nextDueDate = addMonths(
                  new Date(year, period - 1, dueDay),
                  collectAfterHowManyMonths
                );
              }

              return nextDueDate;
            };

            let firstDueDate = getNextDueDate(
              mainStartYear,
              mainStartPeriod,
              true
            );

            let dueDateList = [];

            if (firstDueDate <= new Date(Date.now()))
              dueDateList.push(firstDueDate);

            let nextDueDate = firstDueDate;

            while (nextDueDate < new Date(Date.now())) {
              nextDueDate = getNextDueDate(
                nextDueDate.getFullYear(),
                nextDueDate.getMonth() + 1
              );

              if (nextDueDate < new Date(Date.now()))
                dueDateList.push(nextDueDate);
            }

            //3.For each resident in that building

            residents.find({ buildingID }, (err, residents) => {
              if (err) next(err);
              // Residents that are registered
              if (residents.length > 0) {
                residents.map((resident) => {
                  const { flatID } = resident;

                  //4.Check the list of transactions and find if payment is missed for any of the month given in above payment period
                  transactions.find(
                    { flatID },
                    "amount period year",
                    (err, transactions) => {
                      if (err) next(err);

                      //Some transaction has been done by user
                      if (transactions.length > 0) {
                        dueDateList.map((dueDate) => {
                          let startDueDate;
                          let endDueDate;

                          //Calculate the months for which payment has to be made by that due date

                          if (collectionOrder === "Prepaid") {
                            startDueDate = addMonths(dueDate, 1);

                            endDueDate = addMonths(
                              dueDate,
                              collectAfterHowManyMonths
                            );
                          } else {
                            startDueDate = subMonths(
                              dueDate,
                              collectAfterHowManyMonths
                            );

                            endDueDate = subMonths(dueDate, 1);
                          }

                          // We are creating a data structure like below where each key is year of due
                          // and its value will be an array containing periods for which maintenance is due.

                          // {
                          //   "2020": [...],
                          //   "2021":[...]
                          // }

                          let duePeriodArrObj = {};
                          if (startDueDate === endDueDate) {
                            //Collection is monthly
                            if (startDueDate.getFullYear() in duePeriodArrObj) {
                              duePeriodArrObj[startDueDate.getFullYear()].push(
                                startDueDate.getMonth() + 1
                              );
                            } else {
                              duePeriodArrObj[startDueDate.getFullYear()] = [
                                startDueDate.getMonth() + 1,
                              ];
                            }
                          } else {
                            let dueDatesIntervals = eachMonthOfInterval({
                              start: startDueDate,
                              end: endDueDate,
                            });

                            dueDatesIntervals.map((item) => {
                              let month = item.getMonth() + 1;
                              let year = item.getFullYear();

                              if (year in duePeriodArrObj) {
                                duePeriodArrObj[year].push(month);
                              } else {
                                duePeriodArrObj[year] = [month];
                              }
                            });
                          }

                          let dueYearsArr = Object.keys(duePeriodArrObj);

                          dueYearsArr.map((year) => {
                            let paidPeriods = transactions
                              .filter((trx) => trx.year === Number(year))
                              .map((trx) => trx.period)
                              .flat();

                            let periodsNotPaid = duePeriodArrObj[year].filter(
                              (duePeriod) => !paidPeriods.includes(duePeriod)
                            );

                            if (periodsNotPaid.length > 0) {
                              let query = {
                                flatID,
                                status: "Pending",
                                period: periodsNotPaid,
                                year,
                              };
                              let update = {
                                flatID,
                                dueDate,
                                status: "Pending",
                                amount:
                                  maintenancePerMonth * periodsNotPaid.length,
                                period: periodsNotPaid,
                                year,
                              };

                              let condition = { upsert: true, new: true };

                              dues.findOneAndUpdate(
                                query,
                                update,
                                condition,
                                (err, due) => {
                                  if (err) next(err);
                                }
                              );
                            }
                          });
                        });
                      }
                    }
                  );
                });
              }
            });
          }
        });
      });
    });
    res.status(200).send({});
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
