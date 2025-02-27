const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const jwt = require('jsonwebtoken')
dotenv.config();
const session = require('express-session');
const passport = require('passport');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes')
const protectedRoutes = require('./routes/protectedRoutes')
require('./config/passport')

const app = express();

// Middleware List
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);


app.use(cookieParser());
app.use(session({secret:process.env.SESSION_SECRET,resave:false,saveUninitialized:false,cookie:{secure:false}}));
app.use(passport.initialize());
app.use(passport.session());

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

    // Routes
    app.get('/test', (req,res) => {
        res.send('Hello from test endpoint !')
    })

    app.use('/api/auth', authRoutes);
    app.use('/api/protected', protectedRoutes);
    app.use('/api/task', taskRoutes)





    app.listen(PORT, () => {
      console.log(`Listening on PORT: ${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
startServer();
