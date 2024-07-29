import { useState, useRef, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingBar from "react-top-loading-bar";

// Register the required components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const mealTimes = ["Breakfast", "Lunch", "Dinner"];

function MessOff() {
  const [progress, setProgress] = useState(0);
  const [newReqs, setNewReqs] = useState([]);
  const [approvedReqs, setApprovedReqs] = useState(0);
  const [rejectedReqs, setRejectedReqs] = useState(0);

  const [weeklyRecipes, setWeeklyRecipes] = useState({});
  const [selectedDay, setSelectedDay] = useState(daysOfWeek[0]);
  const [selectedMealTime, setSelectedMealTime] = useState(mealTimes[0]);
  const [recipeName, setRecipeName] = useState("");
  const [recipeIngredients, setRecipeIngredients] = useState("");
  const graphData = useRef([approvedReqs, rejectedReqs, newReqs.length]);

  const getRequests = async () => {
    setProgress(30);
    const hostel = JSON.parse(localStorage.getItem("hostel"));
    const res = await fetch("http://localhost:3000/api/messoff/list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hostel: hostel._id }),
    });
    setProgress(40);
    const data = await res.json();
    console.log(data);
    setProgress(60);
    if (data.success) {
      data.list.forEach((req) => {
        req.id = req._id;
        req.from = new Date(req.leaving_date).toDateString().slice(4, 10);
        req.to = new Date(req.return_date).toDateString().slice(4, 10);
        req._id = req.student._id;
        req.student.name = req.student.name;
        req.student.room_no = req.student.room_no;
        req.status = req.status;
        setProgress((prevProgress) => prevProgress + 10);
      });
      setProgress(80);
      setNewReqs(data.list);
      setApprovedReqs(data.approved);
      setRejectedReqs(data.rejected);
      graphData.current = [data.approved, data.rejected, data.list.length];
    }
    setProgress(100);
  };

  const updateRequest = async (id, status) => {
    const res = await fetch("http://localhost:3000/api/messoff/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, status }),
    });
    const data = await res.json();
    if (data.success) {
      let student = newReqs.find((req) => req.id === id).student;
      toast.success(`Request from ${student.name} has been ${status}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
      });
    } else {
      toast.error("Something went wrong", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
      });
    }
  };

  const approve = (id) => {
    setNewReqs((newReqs) => newReqs.filter((req) => req.id !== id));
    updateRequest(id, "approved");
  };

  const reject = (id) => {
    setNewReqs((newReqs) => newReqs.filter((req) => req.id !== id));
    updateRequest(id, "rejected");
  };

  const getWeeklyRecipes = async () => {
    const res = await fetch("http://localhost:3000/api/recipes/weekly");
    const data = await res.json();
    if (data.success) {
      setWeeklyRecipes(data.recipes);
    }
  };

  const addWeeklyRecipe = async () => {
    const res = await fetch("http://localhost:3000/api/recipes/addWeekly", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        day: selectedDay,
        mealTime: selectedMealTime,
        name: recipeName,
        ingredients: recipeIngredients,
      }),
    });
    const data = await res.json();
    if (data.success) {
      setRecipeName("");
      setRecipeIngredients("");
      toast.success("Recipe added successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
      });
      getWeeklyRecipes();
    } else {
      toast.error("Failed to add recipe", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
      });
    }
  };

  const deleteWeeklyRecipe = async (day, mealTime) => {
    const res = await fetch(`http://localhost:3000/api/recipes/deleteWeekly`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ day, mealTime }),
    });
    const data = await res.json();
    if (data.success) {
      toast.success("Recipe deleted successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
      });
      getWeeklyRecipes();
    } else {
      toast.error("Failed to delete recipe", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
      });
    }
  };

  const graph = (
    <Bar
      data={{
        labels: ["accepted", "rejected", "unmarked"],
        datasets: [
          {
            label: "Requests",
            data: graphData.current,
            backgroundColor: "blue",
            borderRadius: 5,
            borderWidth: 1,
            barThickness: 60,
          },
        ],
      }}
    />
  );

  useEffect(() => {
    getRequests();
    getWeeklyRecipes();
  }, [newReqs.length, approvedReqs, rejectedReqs]);

  return (
    <div className="w-full h-screen flex flex-col gap-3 items-center justify-center">
      <LoadingBar
        color="#0000FF"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <h1 className="text-white font-bold text-5xl">Manage Mess</h1>
      <div className="w-96 h-52">{graph}</div>
      <div className="bg-neutral-950 px-10 py-5 rounded-xl shadow-xl sm:w-[50%] sm:min-w-[450px] w-full mt-5 max-h-96 overflow-auto">
        <span className="text-white font-bold text-xl">All Requests</span>
        <ul role="list" className="divide-y divide-gray-700 text-white">
          {newReqs.length === 0 ? (
            <li className="mt-2">No new requests</li>
          ) : (
            newReqs.map((req) => (
              <li
                className="group py-3 px-5 rounded sm:py-4 hover:bg-neutral-700 hover:shadow-xl hover:scale-105 transition-all cursor-pointer"
                key={req.id}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 group-hover:scale-105 group-hover:text-yellow-500 transition-all"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-white">
                      {req.student.name} [Room: {req.student.room_no}]
                    </p>
                    <p className="text-sm truncate text-gray-400">
                      from: {req.from} to: {req.to}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      className="group/show relative z-0"
                      onClick={() => approve(req.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 hover:text-green-600 hover:scale-125 transition-all"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm hidden absolute px-2 -right-10 top-6 bg-black text-center group-hover/show:block rounded">
                        Approve.
                      </span>
                    </button>
                    <button
                      className="group/show relative z-0"
                      onClick={() => reject(req.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 hover:text-red-500 hover:scale-125 transition-all"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm hidden absolute px-2 -right-10 top-6 bg-black text-center group-hover/show:block rounded">
                        Reject.
                      </span>
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick={true}
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={true}
          pauseOnHover={false}
          theme="dark"
        />
      </div>
      <div className="bg-neutral-950 px-10 py-5 rounded-xl shadow-xl sm:w-[50%] sm:min-w-[450px] w-full mt-5 max-h-96 overflow-auto">
        <span className="text-white font-bold text-xl">
          Manage Weekly Recipes
        </span>
        <div className="mt-3">
          <div>
            <div>
              <select
                onChange={(e) => setSelectedDay(e.target.value)}
                className="mt-1.5 w-full rounded-md mb-5 h-[35px] border-gray-300 text-gray-700 sm:text-sm"
              >
                {daysOfWeek.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                onChange={(e) => setSelectedMealTime(e.target.value)}
                className="mt-1.5 w-full rounded-md mb-5 h-[35px] border-gray-300 text-gray-700 sm:text-sm"
              >
                {mealTimes.map((meal) => (
                  <option key={meal} value={meal}>
                    {meal}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <input
            type="text"
            placeholder="Recipe Name"
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
            className="w-full mb-2 px-4 py-2 rounded-md"
          />
          <textarea
            placeholder="Ingredients"
            value={recipeIngredients}
            onChange={(e) => setRecipeIngredients(e.target.value)}
            className="w-full mb-2 px-4 py-2 rounded-md"
          />
          <button
            onClick={addWeeklyRecipe}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Add Recipe
          </button>
        </div>
        <ul role="list" className="divide-y divide-gray-700 text-white mt-4">
          {daysOfWeek.map((day) => (
            <li key={day} className="mt-2">
              <div className="font-bold text-lg">{day}</div>
              {mealTimes.map((meal) => (
                <div key={meal} className="mt-2">
                  <div className="font-bold">{meal}</div>
                  <ul
                    role="list"
                    className="divide-y divide-gray-700 text-white mt-1"
                  >
                    {weeklyRecipes[day] && weeklyRecipes[day][meal] ? (
                      <li className="py-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium">
                              {weeklyRecipes[day][meal].name}
                            </p>
                            <p className="text-sm text-gray-400">
                              {weeklyRecipes[day][meal].ingredients}
                            </p>
                          </div>
                          <button
                            onClick={() => deleteWeeklyRecipe(day, meal)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ) : (
                      <li className="py-2 text-gray-400">No recipe added</li>
                    )}
                  </ul>
                </div>
              ))}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MessOff;
