import { useEffect, useState } from "react";

const WeeklyRecipesTable = () => {
  const [recipes, setRecipes] = useState({});

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/recipes/weekly"
        );
        const data = await response.json();
        if (data.success) {
          setRecipes(data.recipes[0]);
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, []);

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

  return (
    <div className="container mx-auto p-4">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Day
            </th>
            {mealTimes.map((mealTime) => (
              <th
                key={mealTime}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {mealTime}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {daysOfWeek.map((day) => (
            <tr key={day}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {day}
              </td>
              {mealTimes.map((mealTime) => (
                <td
                  key={mealTime}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >
                  {recipes[day] && recipes[day][mealTime] ? (
                    <div>
                      <div className="font-bold">
                        {recipes[day][mealTime].name}
                      </div>
                      <div className="text-xs">
                        {recipes[day][mealTime].ingredients}
                      </div>
                    </div>
                  ) : (
                    <span>No recipe</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WeeklyRecipesTable;
