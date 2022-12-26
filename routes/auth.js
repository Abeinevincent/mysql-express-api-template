const express = require("express");
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { generateToken } = require("../helpers/jsonwebtoken");

// REGISTER ***********************
router.post("/register", async (req, res) => {
  // Generate userId with a custom function
  const generateUserId = () => {
    let dt = new Date().getTime();
    let userID = "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      let r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
    return userID;
  };
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // Capture user details
  const newUser = {
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    birthday: req.body.birthday,
    phone: req.body.phone,
    email: req.body.email,
    profileImage: req.body.profileImage,
    coverImage: req.body.coverImage,
    // Hash/encrypt the password using CryptoJS and cypher algorithm
    password: hashedPassword,
    userId: generateUserId(),
  };

  const user = await Users.findOne({ where: { email: req.body.email } });
  if (user) {
    return res.status(500).json({
      error: `User with email: (${req.body.email}) already exists, try again.`,
    });
  } else {
    try {
      //   Create user, save him in the db and send response
      const user = await Users.create(newUser);
      return res
        .status(201)
        .json({ message: "User created successfully", user });
    } catch (err) {
      //  This is a general status code when there is an internal server error and does
      // not specify what happed exactly in the server
      return res.status(500).json(err);

      /* ************  Handle other server errors below this line   ************ */
      // Here...
    }
  }
});

// LOGIN **************************
router.post("/login", async (req, res) => {
  try {
    const user = await Users.findOne({
      where: { email: req.body.email },
    });

    if (!user) {
      return res
        .status(404)
        .json(
          "User with the provided email doesnot exist, please create an account!"
        );
    }

    // Compare passwords and if password is incorrect, tell the user to try again
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(400).json("Incorrect pasword, please try again!");
    }

    // Token payload
    const tokenPayload = {
      id: user.userId,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    // If the request is succcessful, return success message and user details
    // This is done for development as it helps the frontend guy easily
    // recognise the key-value pairs in the response
    
    // const {password, ...others} = user

    return res.status(200).json({
      message: "User login successful",
      user,
      token: generateToken(tokenPayload),
    });
  } catch (err) {
    //  This is a general status code when there is an internal server error and does
    // not specify what happed exactly in the server
    console.log(err);
    return res.status(500).json(err);

    /* ************  Handle other server errors below this line   ************ */
    // Here...
  }
});

module.exports = router;
