const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 🔥 FORCE correct import
const passportLocalMongoose =
  require("passport-local-mongoose").default ||
  require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
});

// Debug check (optional)
console.log("TYPE:", typeof passportLocalMongoose);

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);