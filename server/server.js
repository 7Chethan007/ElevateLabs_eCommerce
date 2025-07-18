const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello, World!");   
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})


// Routers
app.use('/user', require('./routes/useRoute'));




// Connect to MongoDB

const URL = process.env.MONGODB_URL;

mongoose.connect(URL)
.then(() =>{
    console.log("MongoDB connected successfully");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
});