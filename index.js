const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const cors = require("cors");
const database = require("./models");
const authRoute = require("./routes/auth");
const usersRoute = require("./routes/users");

// Middleware
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);

// Configure sequelize to sync all models and create corresponding tables accordingly
database.sequelize.sync().then(() => {
  console.log("Db connection successful");
  const PORT = process.env.PORT || 8000
  app.listen(PORT , () => {
    console.log(`Backend server is listening at port ${PORT}`);
  });
});