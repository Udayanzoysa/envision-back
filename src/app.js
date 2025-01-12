const express = require("express");
const bodyParser = require("body-parser");
const errorHandler = require("./utils/error.handler");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const blogRoutes = require("./routes/blog.routes");

const app = express();
app.use(bodyParser.json());

app.use(
  cors({
    origin: ["http://localhost:5173", "https://envision-olive.vercel.app"], // Replace with your React app's URLs
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/blog", blogRoutes);

app.use(errorHandler);

module.exports = app;
