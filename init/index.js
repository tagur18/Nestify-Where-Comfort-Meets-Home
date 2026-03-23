const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

const mongourl =  "mongodb://127.0.0.1:27017/Airbnb";
main().then(() => {
console.log("Connected to DB");
}).catch(err =>{
    console.log(err);
});
async function main() {
  await mongoose.connect(mongourl);
}

const initDB = async () =>{
  await Listing.deleteMany({});
  initdata.data = initdata.data.map((obj) => ({
  ...obj,
  image : obj.image,
  owner: "69bf683e8e05e893498da949"
}));
 await Listing.insertMany(initdata.data);
 console.log("Data was initialized !");

};
initDB();

