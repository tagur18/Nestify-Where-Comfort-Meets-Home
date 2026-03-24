require("dotenv").config();
const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

const dbURL = process.env.MONGO_URL|| "mongodb://127.0.0.1:27017/Airbnb";

async function main() {
  await mongoose.connect(dbURL);
  console.log("Connected to DB");
  await initDB();
}

const initDB = async () => {
  await Listing.deleteMany({});  // clears old data

  const updatedData = initdata.data.map((obj) => ({
    ...obj,
    owner: "69bf683e8e05e893498da949",
  }));

  await Listing.insertMany(updatedData);

  console.log("Data was initialized!");
};

main().catch(err => console.log(err));