const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const authRoute = require("./controller/auth.js");
const userRoute = require("./controller/user.js");
const bookingRoute = require("./controller/booking.js");
const listingRoute = require("./controller/listing.js");


// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URL); // Simplified connection
      console.log("MongoDB connected successfully");
    } catch (error) {
      console.error("MongoDB connection failed:", error);
      process.exit(1); // Exit process with failure
    }
  };
  

// Serve static files for uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==================== File Upload Setup ====================
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploadLocal = multer({ storage: localStorage });

// File upload route
app.post("/upload-local", uploadLocal.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded!" });
  }

  res.status(200).json({
    success: true,
    message: "File uploaded successfully!",
    filePath: `/uploads/${req.file.filename}`,
  });
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/booking", bookingRoute);
app.use("/api/listing", listingRoute);

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to Rental Website!");
});

// Start server and connect to the database
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on http://localhost:${PORT}`);
});
