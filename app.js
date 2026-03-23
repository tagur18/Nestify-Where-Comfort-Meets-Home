if(process.env.NODE_ENV != "production"){
require('dotenv').config();
}
// console.log(process.env);


const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const Expresserr = require("./utils/Expresserrorr.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const dbURL = process.env.ATLAS_URL ;
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// 🔹 Routes
const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const userRoutes = require("./routes/userid.js");
// 🔹 EJS Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);



const store = MongoStore.create({
  mongoUrl: dbURL,
  crypto: { 
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

  store.on("error",()=>{
  console.log("ERROR in Mongo-Session Store! ",err);
  });

// 🔹 Session Config
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};


app.use(session(sessionOptions));
app.use(flash());

// 🔹 Passport Setup
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// 🔹 Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));



async function main() {
  await mongoose.connect(dbURL);
}

main()
  .then(() => console.log("✅ Connected to DB"))
  .catch((err) => console.log(err));

// 🔹 Flash Middleware (GLOBAL)
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser  = req.user;
  
  next();
});

// // 🔹 HOME ROUTE
// app.get("/", (req, res) => {
//   res.redirect("/listings");
// });

// 🔹 DEMO USER (for testing)
app.get("/demouser", async (req, res) => {
  let fakeUser = new User({
    username: "Tagur_Kethavth",
    email: "tagur123@gmail.com",
  });

  let registeredUser = await User.register(fakeUser, "tagur");
  res.send(registeredUser);
});

app.get("/allusers", async (req, res) => {
  const users = await User.find({});
  res.send(users);
});
// 🔹 Use Routes
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/users", userRoutes);

// =======================
// ⚠️ ERROR HANDLERS
// =======================

// 404 Handler
app.use((req, res, next) => {
  next(new Expresserr(404, "Page Not Found!!"));
});

// General Error Handler
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// 🔹 SERVER START
app.listen(8080, () => {
  console.log("🚀 Server is listening on port 8080");
});