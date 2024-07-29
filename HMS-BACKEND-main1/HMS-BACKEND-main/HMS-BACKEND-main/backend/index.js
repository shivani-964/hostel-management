const express = require("express");
const connectDB = require("./utils/conn");
const cors = require("cors");
const { Hostel } = require("./models");

const app = express();

connectDB();

app.use(cors());
app.use(express.json({ extended: false }));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/student", require("./routes/studentRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/complaint", require("./routes/complaintRoutes"));
app.use("/api/invoice", require("./routes/invoiceRoutes"));
app.use("/api/messoff", require("./routes/messoffRoutes"));
app.use("/api/request", require("./routes/requestRoutes"));
app.use("/api/recipes", require("./routes/recipeRoute"));
app.use("/api/checkin-checkout", require("./routes/checkincheckout"));
app.use("/api/attendance", require("./routes/attendanceRoutes"));
app.use("/api/suggestion", require("./routes/suggestionRoutes"));

app.post("/api/hostel/", async (req, res) => {
  console.log(req.body);

  try {
    const hostelId = req.body.hostelId;

    const hostel = await Hostel.findById(hostelId);
    if (!hostel) {
      return res.status(404).json({
        message: "Hostel not found",
      });
    }

    return res.status(200).json({
      data: hostel,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
});

// Export the Express app for Vercel
module.exports = app;
