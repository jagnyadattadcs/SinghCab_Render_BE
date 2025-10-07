import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/database.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import bookingRoutes from "./routes/bookingRoutes.js"; // <-- Import new routes
import getCarDetailsRoutes from "./routes/getCarDetails.js"; // <-- Import car routes
import emailRoutes from "./routes/emailroutes.js";
import fetch from "node-fetch";

// 🆕 Image Gallery imports
import multer from "multer";
import fs from "fs";
import Image from "./Models/Image.js"; // You’ll create this model below

dotenv.config();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SELF_URL = "https://singhcabbackend-0lu9.onrender.com";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Make uploads folder static (already in your code)
app.use("/api/uploads", express.static(path.join(__dirname, "/uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/admin/cars", adminRoutes);
app.use("/api/bookings", bookingRoutes); // <-- Use new routes
app.use("/api/cars", getCarDetailsRoutes); 
app.use("/api/email", emailRoutes);

// 🖼️ ---------- Image Gallery Section Starts ----------

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Upload Image
app.post("/api/gallery", upload.single("image"), async (req, res) => {
  try {
    const newImage = new Image({
      title: req.body.title,
      imageUrl: `${req.protocol}://${req.get("host")}/api/uploads/${
        req.file.filename
      }`,
    });
    await newImage.save();
    res.json({ success: true, image: newImage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Images
app.get("/api/gallery", async (req, res) => {
  try {
    const images = await Image.find();
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Image
app.delete("/api/gallery/:id", async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ message: "Image not found" });

    const filename = image.imageUrl.split("/api/uploads/")[1];
    fs.unlinkSync(`uploads/${filename}`);

    await image.deleteOne();
    res.json({ success: true, message: "Image deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit / Replace Image
app.put("/api/gallery/:id", upload.single("image"), async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ message: "Image not found" });

    // delete old file
    const oldFilename = image.imageUrl.split("/api/uploads/")[1];
    fs.unlinkSync(`uploads/${oldFilename}`);

    // update new data
    image.title = req.body.title || image.title;
    image.imageUrl = `${req.protocol}://${req.get("host")}/api/uploads/${
      req.file.filename
    }`;
    await image.save();

    res.json({ success: true, image });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

// Ping every 14 minutes (840,000 ms)
setInterval(async () => {
  try {
    const res = await fetch(SELF_URL);
    console.log(`Self-ping status: ${res.status} at ${new Date().toISOString()}`);
  } catch (err) {
    console.error("Self-ping failed:", err.message);
  }
}, 14 * 60 * 1000);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
