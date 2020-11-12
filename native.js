const MongoClient = require("mongodb").MongoClient;

// Connection URL
const url = "mongodb://localhost:27017";

// Database Name
const dbName = "test";

// Create a new MongoClient
const client = new MongoClient(url);

// Data
// const well = {
//   name:"99R",
//   bottom:3250.6,
//   test:{red:25, blue:26},
//   inc:[
//     {md:10,inc:45.6, azi:63.3},
//     {md:120,inc:45.2, azi:63.32},
//   ]
// }
// const field ={
//     name:"Carichan",
//     type:"oil",
//     wells:[well, well],
// }

// Use connect method to connect to the Server
client.connect(async function (err) {
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  const fields = db.collection("fields");

  // await fields.insertOne(field);
  fields.find({}).toArray((err, docs) => {
    console.log(docs);
  });

  client.close();
});
