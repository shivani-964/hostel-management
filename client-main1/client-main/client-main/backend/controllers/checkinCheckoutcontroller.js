const CheckinCheckout = require("../models/ChcekinCheckout");
const Student = require("../models/Student");

exports.checkin = async (req, res) => {
  try {
    const { _id } = req.body;
    console.log(_id);

    const student = await Student.findById(_id);
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    const checkin = new CheckinCheckout({ student: _id });
    await checkin.save();

    res.status(201).json({ success: true, checkin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.checkout = async (req, res) => {
  try {
    const { checkinId } = req.body;

    const checkin = await CheckinCheckout.findById(checkinId);
    if (!checkin) {
      return res
        .status(404)
        .json({ success: false, message: "Check-in not found" });
    }

    if (checkin.status === "checked-out") {
      return res
        .status(400)
        .json({ success: false, message: "Already checked out" });
    }

    checkin.checkoutTime = Date.now();
    checkin.status = "checked-out";
    await checkin.save();

    res.status(200).json({ success: true, checkout: checkin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.getStudentCheckins = async (req, res) => {
  try {
    const { _id } = req.params;

    const checkins = await CheckinCheckout.find({
      student: _id,
    }).populate("student");

    if (!checkins.length) {
      return res.status(404).json({
        success: false,
        message: "No check-ins found for this student",
      });
    }

    res.status(200).json({ success: true, checkins });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.getAllCheckinCheckouts = async (req, res) => {
  try {
    const checkinCheckouts = await CheckinCheckout.find().populate("student");

    if (!checkinCheckouts.length) {
      return res.status(404).json({
        success: false,
        message: "No check-in/check-out records found",
      });
    }

    res.status(200).json({ success: true, checkinCheckouts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
