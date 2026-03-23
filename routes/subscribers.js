const express = require("express");
const router = express.Router();
const sendMail = require("../utils/sendMail");
const Subscriber = require("../models/subscriber.js");

router.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  try {
    const existing = await Subscriber.findOne({ email });

    if (existing) {
      req.flash("error", "You are already subscribed!");
      return res.redirect("/listings");
    }

    await Subscriber.create({ email });

    await sendMail(email);

    req.flash("success", "Check your email 🎉");
    res.redirect("/listings");

  } catch (err) {
    req.flash("error", "Something went wrong!");
    res.redirect("/listings");
  }
});

module.exports = router;