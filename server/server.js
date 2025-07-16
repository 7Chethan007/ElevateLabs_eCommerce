const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello, World!");   
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})







// Connect to MongoDB

const URL = process.env.MONGODB_URL;

mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() =>{
    console.log("MongoDB connected successfully");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});