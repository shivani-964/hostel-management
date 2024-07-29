import { useEffect, useState } from "react";
import axios from "axios";

const RoomInfo = () => {
  const student = localStorage.getItem("student"); // Fetch student ID from localStorage
  const [studentInfo, setStudentInfo] = useState(null);
  const { _id } = JSON.parse(student);
  const token = localStorage.getItem("token");
  console.log(token);
  console.log(_id);

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const response = await axios.post(
          `http://localhost:3000/api/student/get-student/`,
          {
            id: _id,
            isAdmin: false,
            token: token,
          }
        );
        console.log(response.data.student);
        setStudentInfo(response.data.student);
      } catch (error) {
        console.error("Error fetching student information:", error);
      }
    };

    fetchStudentInfo();
  }, [_id]);

  return (
    <div className="p-20">
      <h1 className="text-2xl font-bold mb-4 text-white">Room Information</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded">
          <thead>
            <tr>
              <th className="py-2 px-4 bg-gray-200">Field</th>
              <th className="py-2 px-4 bg-gray-200">Value</th>
            </tr>
          </thead>
          <tbody>
            {studentInfo && (
              <>
                <tr>
                  <td className="py-2 px-4 border-b">Student Name</td>
                  <td className="py-2 px-4 border-b">{studentInfo.name}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">Student ID</td>
                  <td className="py-2 px-4 border-b">{studentInfo.cms_id}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">Email</td>
                  <td className="py-2 px-4 border-b">{studentInfo.email}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">Room Number</td>
                  <td className="py-2 px-4 border-b">{studentInfo.room_no}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">Batch</td>
                  <td className="py-2 px-4 border-b">{studentInfo.batch}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">Department</td>
                  <td className="py-2 px-4 border-b">{studentInfo.dept}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">Course</td>
                  <td className="py-2 px-4 border-b">{studentInfo.course}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">Father's Name</td>
                  <td className="py-2 px-4 border-b">
                    {studentInfo.father_name}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">Contact</td>
                  <td className="py-2 px-4 border-b">{studentInfo.contact}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">Address</td>
                  <td className="py-2 px-4 border-b">{studentInfo.address}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">Date of Birth</td>
                  <td className="py-2 px-4 border-b">
                    {new Date(studentInfo.dob).toLocaleDateString()}
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoomInfo;
