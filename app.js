const mongoose = require("mongoose");
const moment = require("moment");
const fs = require("fs");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const FieldSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  type: { type: String },
  location: String,
});

const IncSchema = new mongoose.Schema({
  md: Number,
  inc: Number,
  azi: Number,
});

const WellSchema = new mongoose.Schema({
  name: String,
  fieldName: String,
  type: { type: String },
  bottom: Number,
  alt: Number,
  inc: [IncSchema],
});

WellSchema.index({ name: 1, fieldName: 1 }, {unique:true});

const Field = mongoose.model("Field", FieldSchema);
const Well = mongoose.model("Well", WellSchema);

const db = mongoose.connection;

const populate = async () => {
  await Field.deleteMany({});
  await Well.deleteMany({});
  const fields = JSON.parse(fs.readFileSync("./fields.json"));
  const wells = JSON.parse(fs.readFileSync("./wells.json"));
  await Field.insertMany(fields).then((res) => {
    console.log("Fields loaded!");
  });
  await Well.insertMany(wells).then((res) => {
    console.log("Wells loaded!");
  });
};

db.once("open", async function () {
  await populate();

  // Field.find({}, { name: 1, type: 1 }).then((res) => {
  //   console.log(res);
  // });

  Well.find({}, { name: 1, inc:1 }).then((res) => {
    console.log(res);
  });

});
