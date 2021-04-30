const mongoose = require('mongoose');
// const moment = require('moment');
const fs = require('fs');
require('dotenv').config();

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

WellSchema.index({ name: 1, fieldName: 1 }, { unique: true });

const Field = mongoose.model('Field', FieldSchema);
const Well = mongoose.model('Well', WellSchema);

const db = mongoose.connection;

const populate = async () => {
  // Delete old data
  await Field.deleteMany({});
  await Well.deleteMany({});

  // Create fields
  const fields = JSON.parse(fs.readFileSync('./data/fields.json'));
  await Field.insertMany(fields).then(() => {
    console.log('Fields loaded!');
  });

  // Create wells
  const wells = JSON.parse(fs.readFileSync('./data/wells.json'));
  await Well.insertMany(wells).then(() => {
    console.log('Wells loaded!');
  });
};

db.once('open', async () => {
  await populate();

  const well = new Well({ name: '1Z', fieldName: 'Carichan' });
  well.save((err, data) => {
    console.log(data);
  });

  Well.find({ bottom: { $gt: 1400 } }).then((res) => {
    console.log(res);
  });
});
