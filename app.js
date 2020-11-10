const mongoose = require("mongoose");
const moment = require("moment");
const fs = require("fs");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

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
  dyanmic: Number,
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

const Field = mongoose.model("Field", FieldSchema);

const db = mongoose.connection;

db.once("open", async function () {
  await Field.deleteMany({});

  const fields = JSON.parse(fs.readFileSync("./data.json"));

  await Field.insertMany(fields).then((res) => {
    console.log("Done!");
  });

  Field.find({ name: "Верхнесалымское" }).then((res) => {
    console.log(res[0].name);
  });
});
