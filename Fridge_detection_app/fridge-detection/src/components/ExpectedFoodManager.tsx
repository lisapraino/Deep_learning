import { useState } from 'react';
import { ImCross } from 'react-icons/im';
import { LuClipboardList } from "react-icons/lu";

interface ExpectedFoodManagerProps {
  items: string[];
  onAdd: (item: string) => void;
  onRemove: (item: string) => void;
}

export const ExpectedFoodManager = ({ items, onAdd, onRemove }: ExpectedFoodManagerProps) => {
  const [newItem, setNewItem] = useState("");

  const handleAdd = () => {
    if (newItem.trim()) {
      onAdd(newItem);
      setNewItem(""); // Clear input after adding
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div style={{ marginBottom: "30px", textAlign: "left" }}>
      <h2><LuClipboardList /> My Fridge List</h2>

      {/* Input Section */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Add food (e.g. milk)"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
        />
        <button
          onClick={handleAdd}
          style={{ padding: "8px 12px", borderRadius: "6px", border: "none", background: "#4caf50", color: "white", cursor: "pointer" }}
        >
          Add
        </button>
      </div>

      {/* List Section */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map((item, index) => (
          <li
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#f1f1f1",
              color: "#666",
              padding: "8px",
              borderRadius: "6px",
              marginBottom: "6px",
              paddingLeft: "12px"
            }}
          >
            <span style={{fontSize : "1.2rem"}}><strong>{item}</strong></span>
            <button
              onClick={() => onRemove(item)}
              style={{ border: "none", background: "transparent", color: "#e53935", fontSize: "1.1rem", cursor: "pointer" }}
            >
              <ImCross />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};