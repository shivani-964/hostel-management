// src/components/Dashboards/AdminDashboard/RegisterStudent.js
import { useState } from "react";
import Input from "./components/Input";
import PrimaryButton from "./components/PrimaryButton";
import { Loader } from "../Common/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const RegisterStudent = () => {
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [cmsId, setCmsId] = useState("");
  const [roomNo, setRoomNo] = useState("");
  const [batch, setBatch] = useState("");
  const [dept, setDept] = useState("");
  const [course, setCourse] = useState("");
  const [email, setEmail] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");
  const [hostel, setHostel] = useState(
    JSON.parse(localStorage.getItem("hostel")).name
  );
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = {
      name,
      cms_id: cmsId,
      room_no: roomNo,
      batch,
      dept,
      course,
      email,
      father_name: fatherName,
      contact,
      address,
      dob,
      hostel,
      password,
    };

    console.log(formData);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/student/register-student",
        formData
      );
      const data = response.data;
      if (data.success) {
        toast.success(`Student ${data.student.name} Registered Successfully!`);
        setName("");
        setCmsId("");
        setRoomNo("");
        setBatch("");
        setDept("");
        setCourse("");
        setEmail("");
        setFatherName("");
        setContact("");
        setAddress("");
        setDob("");
        setPassword("");
      } else {
        data.errors.forEach((err) => {
          toast.error(err.msg);
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-h-screen pt-20 flex flex-col items-center justify-center">
      <h1 className="text-white font-bold text-5xl mt-10 mb-5">
        Register Student
      </h1>
      <div className="md:w-[60vw] w-full p-10 bg-neutral-950 rounded-lg shadow-xl mb-10 overflow-auto">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex gap-5 flex-wrap justify-center md:w-full sw-[100vw]">
            <Input
              field={{
                name: "name",
                placeholder: "Student Name",
                type: "text",
                req: true,
                value: name,
                onChange: (e) => setName(e.target.value),
              }}
            />
            <Input
              field={{
                name: "college_id",
                placeholder: "college_id",
                type: "number",
                req: true,
                value: cmsId,
                onChange: (e) => setCmsId(e.target.value),
              }}
            />
            <Input
              field={{
                name: "dob",
                placeholder: "Student DOB",
                type: "date",
                req: true,
                value: dob,
                onChange: (e) => setDob(e.target.value),
              }}
            />
            <Input
              field={{
                name: "email",
                placeholder: "Student Email",
                type: "email",
                req: true,
                value: email,
                onChange: (e) => setEmail(e.target.value),
              }}
            />
          </div>
          <div className="flex gap-5 w-full flex-wrap justify-center">
            <Input
              field={{
                name: "contact",
                placeholder: "Student Contact",
                type: "text",
                req: true,
                value: contact,
                onChange: (e) => setContact(e.target.value),
              }}
            />
            <Input
              field={{
                name: "father_name",
                placeholder: "Student's Father Name",
                type: "text",
                req: true,
                value: fatherName,
                onChange: (e) => setFatherName(e.target.value),
              }}
            />
          </div>
          <div className="mx-12">
            <label
              htmlFor="address"
              className="block mb-2 text-sm font-medium text-white"
            >
              Address
            </label>
            <textarea
              name="address"
              placeholder="Student Address"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border flex-grow sm:text-sm rounded-lg block w-full p-2.5 bg-neutral-700 border-neutral-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-5 w-full justify-center">
            <Input
              field={{
                name: "room_no",
                placeholder: "Student Room",
                type: "number",
                req: true,
                value: roomNo,
                onChange: (e) => setRoomNo(e.target.value),
              }}
            />
            <Input
              field={{
                name: "hostel",
                placeholder: "Student Hostel",
                type: "text",
                req: true,
                value: hostel,
                disabled: true,
              }}
            />
            <Input
              field={{
                name: "dept",
                placeholder: "Student Department",
                type: "text",
                req: true,
                value: dept,
                onChange: (e) => setDept(e.target.value),
              }}
            />
          </div>
          <div className="flex flex-wrap justify-center gap-5">
            <Input
              field={{
                name: "course",
                placeholder: "Student Course",
                type: "text",
                req: true,
                value: course,
                onChange: (e) => setCourse(e.target.value),
              }}
            />
            <Input
              field={{
                name: "batch",
                placeholder: "Student Batch",
                type: "number",
                req: true,
                value: batch,
                onChange: (e) => setBatch(e.target.value),
              }}
            />
            <Input
              field={{
                name: "password",
                placeholder: "Student Password",
                type: "password",
                req: true,
                value: password,
                onChange: (e) => setPassword(e.target.value),
              }}
            />
          </div>
          <div className="flex items-center justify-center my-5">
            {loading ? (
              <Loader />
            ) : (
              <PrimaryButton type="submit">Register Student</PrimaryButton>
            )}
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default RegisterStudent;
