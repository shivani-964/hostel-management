import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Checkin = () => {
  const studentData = localStorage.getItem("student"); // Fetch student ID from localStorage
  const { _id } = JSON.parse(studentData);
  const [message, setMessage] = useState("");
  const [checkinDate, setCheckinDate] = useState(new Date());
  const [checkoutDate, setCheckoutDate] = useState(null);
  console.log(_id);
  const handleCheckin = async () => {
    const response = await fetch(
      "http://localhost:3000/api/checkin-checkout/checkin",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id, checkinDate }),
      }
    );

    const data = await response.json();
    if (data.success) {
      localStorage.setItem("checkinId", data.checkin._id); // Store check-in ID in localStorage
      setMessage("Checked in successfully");
    } else {
      setMessage(data.message);
    }
  };

  const handleCheckout = async () => {
    const checkinId = localStorage.getItem("checkinId"); // Fetch check-in ID from localStorage
    const response = await fetch(
      "http://localhost:3000/api/checkin-checkout/checkout",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ checkinId, checkoutTime: checkoutDate }),
      }
    );

    const data = await response.json();
    if (data.success) {
      setMessage("Checked out successfully");
    } else {
      setMessage(data.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
      <div className="mb-4">
        <label className="block text-gray-700">Check-in Date:</label>
        <DatePicker
          selected={checkinDate}
          onChange={(date) => setCheckinDate(date)}
          showTimeSelect
          dateFormat="Pp"
          className="mt-1 p-2 border border-gray-300 rounded w-full"
        />
      </div>
      <button
        onClick={handleCheckin}
        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
      >
        Check In
      </button>
      <div className="mt-4 mb-4">
        <label className="block text-gray-700">Check-out Date:</label>
        <DatePicker
          selected={checkoutDate}
          onChange={(date) => setCheckoutDate(date)}
          showTimeSelect
          dateFormat="Pp"
          className="mt-1 p-2 border border-gray-300 rounded w-full"
        />
      </div>
      <button
        onClick={handleCheckout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Check Out
      </button>
      {message && <div className="mt-4 text-green-500">{message}</div>}
    </div>
  );
};

export default Checkin;
