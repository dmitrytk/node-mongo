const mongoose = require("mongoose");
const fs = require("fs");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

const WellSchema = new mongoose.Schema({
  name: String,
  bottom: Number,
  alt: Number,
});

const FieldSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  location: String,
  wells: [WellSchema],
});
const Field = mongoose.model("Field", FieldSchema);

const db = mongoose.connection;

db.once("open", async function () {
  await Field.deleteMany({});

  const fld = new Field({
    name: "Carichan",
    type: "gas",
    wells: [
      { name: "99R", alt: 85.5, bottom: 3250.6 },
      { name: "100R", alt: 85.5, bottom: 3250.6 },
    ],
  });

  await fld.save().then((res) => {});

  await Field.findOne({ name: "Carichan" }).then(async (field) => {
    const well = field.wells[0];
    well.name = "990R";
    await field.save();
  });

  await Field.aggregate()
    .match({ name: "Carichan" })
    .exec((res) => {
      console.log(res);
    });

  let docs = await Field.aggregate()
    .match({ name: "Carichan" })
    .group({ _id: "$wells.name", count: { $sum: 1 } });
  console.log(docs);

  // Field.find({ name: "Carichan" }, { wells: 1, _id: 0 })
  //   .find()
  //   .then((data) => {
  //     console.log(data[0].wells);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
});
