import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const RoomForm = ({ rooms, onSave }) => {
  const [room, setRoom] = useState({ name: "", type: "", price: "" });
  const navigate = useNavigate();
  const { roomId } = useParams();

  useEffect(() => {
    if (roomId) {
      const existingRoom = rooms.find((r) => r.id === roomId);
      if (existingRoom) {
        setRoom(existingRoom);
      }
    }
  }, [roomId, rooms]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoom({ ...room, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(room);
    navigate("/admin-dashboard/rooms");
  };

  return (
    <div>
      <h2>{roomId ? "Edit Room" : "Add Room"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={room.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Type:</label>
          <input
            type="text"
            name="type"
            value={room.type}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={room.price}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default RoomForm;
