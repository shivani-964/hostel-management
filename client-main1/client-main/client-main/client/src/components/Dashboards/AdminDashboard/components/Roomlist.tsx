import React, { useEffect, useState } from "react";
import axios from "axios";

const RoomList = () => {
  const [studentData, setStudentData] = useState([]);
  const [hostelData, setHostelData] = useState(null);
  const [selectedHostel, setSelectedHostel] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getStudentRoomsAndHostel = async () => {
    if (selectedHostel) {
      setLoading(true);
      setError(null);
      try {
        const [hostelResponse, studentResponse] = await Promise.all([
          axios.post("http://localhost:3000/api/hostel", {
            hostelId: selectedHostel,
            isAdmin: true,
          }),
          axios.post("http://localhost:3000/api/student/get-all-students", {
            hostel: selectedHostel,
            isAdmin: true,
          }),
        ]);

        setStudentData(studentResponse.data.students);
        setHostelData(hostelResponse.data);
      } catch (err) {
        setError("An error occurred while fetching data. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSelectHostel = (e) => {
    setSelectedHostel(e.target.value);
  };

  useEffect(() => {
    getStudentRoomsAndHostel();
  }, [selectedHostel]);

  return (
    <>
      <div className="flex justify-between py-2 mb-5 items-center">
        <div className="mt-10 font-semibold">
          hostel-room-capacity: {hostelData?.data?.capacity || "N/A"}
        </div>
        <div>
          <label
            htmlFor="HeadlineAct"
            className="block text-sm font-medium text-gray-900"
          >
            Headliner
          </label>
          <select
            onChange={handleSelectHostel}
            name="HeadlineAct"
            id="HeadlineAct"
            className="mt-1.5 w-[150px] h-[35px] rounded-lg border-gray-300 text-gray-700 sm:text-sm"
          >
            <option value="">Select Hostel</option>
            <option value="645aae56db7005c0dc64fd92">
              mahindra university hostel1
            </option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : studentData.length === 0 ? (
          <p>No students found.</p>
        ) : (
          <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead className="ltr:text-left rtl:text-right">
              <tr>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  student-name
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  Room-no
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {studentData.map((item) => (
                <tr key={item._id} className="odd:bg-gray-50 text-center">
                  <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    {item.room_no}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                    Occupied
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default RoomList;
