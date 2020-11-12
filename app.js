const mongoose = require("mongoose");
const moment = require("moment");
const fs = require("fs");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

// #region Schema
const IncSchema = new mongoose.Schema({
  md: Number,
  inc: Number,
  azi: Number,
});

const MerSchema = new mongoose.Schema({
  date: String,
  status: String,
  rate: Number,
  production: Number,
  work_days: Number,
});

const RateSchema = new mongoose.Schema({
  date: String,
  rate: Number,
  dynamic: Number,
  static: Number,
});

const WellSchema = new mongoose.Schema({
  name: String,
  pad: String,
  type: { type: String },
  status: String,
  bottom: Number,
  alt: Number,
  x: Number,
  y: Number,
  lat: Number,
  lng: Number,
  inc: [IncSchema],
  mer: [MerSchema],
  rates: [RateSchema],
});

const CoordSchema = new mongoose.Schema({
  x: Number,
  y: Number,
  lat: Number,
  lng: Number,
});

const FieldSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  location: String,
  coordinates: [CoordSchema],
  wells: [WellSchema],
});
// #endregion Schema

const Field = mongoose.model("Field", FieldSchema);

const db = mongoose.connection;

const populate = async () => {
  await Field.deleteMany({});
  const fields = JSON.parse(fs.readFileSync("./data.json"));
  await Field.insertMany(fields).then((res) => {
    console.log("Data loaded!");
  });
};

const loadInc = async (fieldId, data) => {
  const res = {};
  data.forEach((el) => {
    if (res[el.well]) res[el.well].push(el);
    else {
      res[el.well] = [];
      res[el.well].push(el);
    }
  });
  console.log(res);
  // await Field.findByIdAndUpdate(fieldId, { wells: res }, { upsert: true });
};
const data = [
  { well: "12R", md: 10, inc: 12, azi: 25.0 },
  { well: "12R", md: 10, inc: 12, azi: 25.0 },
  { well: "99R", md: 10, inc: 12, azi: 25.0 },
  { well: "99R", md: 10, inc: 12, azi: 25.0 },
];
const id = "5fad016b4356c52908408255";

db.once("open", async function () {
  // Populate DB
  // await populate();

  // Field.find({}, { name: 1 }).then((res) => {
  //   console.log(res);
  // });
  Field.aggregate([{}, { $unwind: "wells" }]).then((res) => {
    console.log(res);
  });
});
