const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const app = express(); // ✅ Declare app before use

app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose
  .connect("mongodb://127.0.0.1:27017/registerDB")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Mongoose model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

// Register
const bcrypt = require("bcrypt"); // Add at the top

app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing)
    return res.status(400).json({ message: "Email already exists" });

  const hashpass = await bcrypt.hash(password, 10); // ✅ Correct usage
  const user = new User({ name, email, password: hashpass });

  await user.save();
  res.json({ message: "Registered successfully!" });
});

// Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid password" });

  res.json({ message: "Login successful", user });
});


// Start server
app.listen(5000, () =>
  console.log("🚀 Server running at http://localhost:5000")
);
