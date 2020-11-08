const mongoose = require('mongoose');
require('dotenv').config();


mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true});

const FieldSchema = new mongoose.Schema({
    name: String,
    type:{type:String},
    location:String
  });
const Field = mongoose.model('Field', FieldSchema);

const db = mongoose.connection;
db.once('open', async function() {


   const fld = new Field({name:"Carichan", type:"gas"})
   await fld.save();


    Field.find({})
    .then(data=>{
        console.log(data);
    })
    .catch(err=>{
        console.log(err);
    })
});