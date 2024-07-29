import { useState } from "react";
import Roomlist from "../AdminDashboard/components/Roomlist";

const Rooms = () => {
  const [rooms, setRooms] = useState([
    { id: "1", name: "Deluxe Room", type: "Deluxe", price: 120 },
    { id: "2", name: "Standard Room", type: "Standard", price: 80 },
  ]);

  return (
    <div className="mt-10 pt-10 px-10 text-white">
      <Roomlist rooms={rooms} />
    </div>
  );
};

export default Rooms;
