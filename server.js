require("dotenv").config();
const authRoutes = require("./router/auth-router");

const ConnectDb = require("./database/db");

const express = require("express");
const homeRoute = require("./router/home-Route")
const adminRoute = require("./router/admin-route")
const uploadImageRoutes = require('./router/image-routes')

const app = express();
// Connect to mongodb Database
ConnectDb();

// Middleware
app.use(express.json());

//  all routes
app.use("/api/auth", authRoutes);
app.use("/api/home",homeRoute);
app.use("/api/admin",adminRoute);
app.use('/api/image', uploadImageRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
