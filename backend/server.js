const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs"); // Import bcrypt for password hashing
const authRoutes = require("./routes/auth"); 

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection URL and Database name
const uri = "mongodb://localhost:27017";
const dbName = "project";

// Function to connect to MongoDB
const connectToDb = async () => {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  return client.db(dbName);
};


app.use("/api", authRoutes);

// API for patient registration
app.post("/api/register", async (req, res) => {
  const { name, email, phone, password, age, patientID, consultedDoctors, medicalHistory } = req.body;

 
  if (!name || !email || !phone || !password || !age || !patientID || !consultedDoctors || !medicalHistory) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const db = await connectToDb();
    const usersCollection = db.collection("patients");

    // Check if the email or patientID already exists in the database
    const existingUser = await usersCollection.findOne({ $or: [{ email }, { patientID }] });
    if (existingUser) {
      return res.status(400).json({ message: "Email or Patient ID already exists" });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object
    const newUser = {
      name,
      email,
      phone,
      password: hashedPassword,
      age,
      patientID,
      consultedDoctors,
      medicalHistory
    };

    // Insert the new user into the database
    await usersCollection.insertOne(newUser);
    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "An error occurred during registration" });
  }
});

// API to handle appointment booking
app.post("/api/book-appointment", async (req, res) => {
  const { doctorId, patientId, date, time } = req.body;

  if (!doctorId || !patientId || !date || !time) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const db = await connectToDb();
    const appointmentsCollection = db.collection("appointments");

    // Check if the appointment slot is already booked for the given date and time
    const existingAppointment = await appointmentsCollection.findOne({ date, time });

    if (existingAppointment) {
      return res.status(400).json({ message: "This time slot is already booked." });
    }

    // Insert the new appointment into the database
    const newAppointment = { doctorId, patientId, date, time, status: "booked" };
    await appointmentsCollection.insertOne(newAppointment);

    res.status(201).json({ message: "Appointment booked successfully", appointment: newAppointment });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ message: "Problem booking appointment" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
