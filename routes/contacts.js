const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Contact = require("../models/Contact");
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");

//@route    GET api/contacts
//@desc     Get a users contacts
//@access   Private
router.get("/", auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json(contacts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//@route    POST api/contacts
//@desc     Add a new contact
//@access   Private
router.post(
  "/",
  [auth, [check("name", "name is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, type } = req.body;

    try {
      const newContact = new Contact({
        name,
        email,
        phone,
        type,
        user: req.user.id,
      });

      const contact = await newContact.save();
      res.json(contact);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route    PUT api/contacts/:id
//@desc     Update contacts
//@access   Private
router.put("/:id", (req, res) => {
  res.send("update contact");
});

//@route    DELETE api/contacts/:id
//@desc     Delete contact
//@access   Private
router.delete("/:id", (req, res) => {
  res.send("delete contact");
});

module.exports = router;
