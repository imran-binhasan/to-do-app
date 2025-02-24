const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

const PORT = process.env.PORT || 4000;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const startServer = async () => {
  try {
    await connectDB();
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    app.listen(PORT, () => {
      console.log(`Listening on PORT: ${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
startServer();
