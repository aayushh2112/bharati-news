const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const newsRoutes = require("./routes/news");

const app = express();

// Connect to database
connectDB();


const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://bharati-news-1.onrender.com", // deployed frontend on Render
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Body parser middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ message: "News API is running!" });
});

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});



// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();

// const connectDB = require("./config/db");
// const authRoutes = require("./routes/auth");
// const newsRoutes = require("./routes/news");

// const app = express();

// // Connect to database
// connectDB();

// // Middleware
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );
// app.use(express.json());

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/news", newsRoutes);

// // Health check
// app.get("/api/health", (req, res) => {
//   res.json({ message: "News API is running!" });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
