import { useState} from 'react';
import type { ChangeEvent }  from 'react';
import { ImCross } from 'react-icons/im';

import axios from 'axios';
import './App.css'; // Optional: You can keep or delete this file

// 1. Define what our data looks like
interface FoodItem {
  item: string;
  confidence: number;
}

interface ScanResponse {
  food_found: FoodItem[];
  missing_food: string[];
}


function App() {
  // 2. Define state with types
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [expectedFood, setExpectedFood] = useState<string[]>(() => {
  const saved = localStorage.getItem("expectedFood");
  return saved ? JSON.parse(saved) : [];
});

const [newItem, setNewItem] = useState<string>("");



const [missingFood, setMissingFood] = useState<string[]>([]);


  // 3. Handle file selection
  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create a fake URL to preview the image
      setSelectedImage(URL.createObjectURL(file));
      processImage(file);
    }
  };

  // 4. Send image to FastAPI
  const processImage = async (file: File) => {
  setLoading(true);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("expected_items", JSON.stringify(expectedFood));

  try {
    const response = await axios.post<ScanResponse>(
      "http://127.0.0.1:8000/scan-fridge",
      formData
    );

    setFoodItems(response.data.food_found);
    setMissingFood(response.data.missing_food);

  } catch (error) {
    console.error("Error scanning image:", error);
    alert("Failed to connect to the server.");
  } finally {
    setLoading(false);
  }
};

  const addFoodItem = () => {
  if (!newItem.trim()) return;

  if (!expectedFood.includes(newItem.toLowerCase())) {
    const updated = [...expectedFood, newItem.toLowerCase()];
    setExpectedFood(updated);
    localStorage.setItem("expectedFood", JSON.stringify(updated));
  }

  setNewItem("");
};

const removeFoodItem = (item: string) => {
  const updated = expectedFood.filter(food => food !== item);
  setExpectedFood(updated);
  localStorage.setItem("expectedFood", JSON.stringify(updated));
};



  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px", fontFamily: "sans-serif", textAlign: "center" }}>
      <h1>🧊 Fridge Scanner</h1>

      {/* Manage Expected Food List */}
<div style={{ marginBottom: "30px", textAlign: "left" }}>
  <h2>📋 My Fridge List</h2>

  <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
    <input
      type="text"
      placeholder="Add food (e.g. milk)"
      value={newItem}
      onChange={(e) => setNewItem(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          addFoodItem();
        }
      }}
      style={{
        flex: 1,
        padding: "8px",
        borderRadius: "6px",
        border: "1px solid #ccc"
      }}
    />
    <button
      onClick={addFoodItem}
      style={{
        padding: "8px 12px",
        borderRadius: "6px",
        border: "none",
        background: "#4caf50",
        color: "white",
        cursor: "pointer"
      }}
    >
      Add
    </button>
  </div>

  <ul style={{ listStyle: "none", padding: 0 }}>
    {expectedFood.map((item, index) => (
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
          paddingLeft : "12px"
        }}
      >
        <span>{item}</span>
        <button
          onClick={() => removeFoodItem(item)}
          style={{
            border: "none",
            background: "transparent",
            color: "#e53935",
            fontSize: "1.1rem",
            cursor: "pointer"
          }}
        >
          <ImCross />
        </button>
      </li>
    ))}
  </ul>
</div>

      
      {/* Upload Button */}
      <div style={{ marginBottom: "20px", border: "2px dashed #ccc", padding: "20px", borderRadius: "10px" }}>
        <p>Tap below to take a picture or upload</p>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageUpload} 
        />
      </div>

      {/* Image Preview */}
      {selectedImage && (
        <div style={{ marginBottom: "20px" }}>
          <img 
            src={selectedImage} 
            alt="Fridge Upload" 
            style={{ width: "100%", maxHeight: "300px", objectFit: "contain", borderRadius: "10px" }} 
          />
        </div>
      )}

      {/* Loading State */}
      {loading && <p>🔍 Analyzing your fridge...</p>}

      {/* Results List */}
      <div style={{ textAlign: "left" }}>
        {foodItems.length > 0 && <h2>Detected Food:</h2>}
        <ul style={{ listStyle: "none", padding: 0 }}>
          {foodItems.map((food, index) => (
            <li 
              key={index} 
              style={{ 
                background: "#f9f9f9",
                margin: "10px 0", 
                padding: "10px", 
                borderRadius: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid #eee"
              }}
            >
              <span style={{ color: "#666", fontSize: "1.2rem" }}>✅ <strong>{food.item}</strong></span>
              <span style={{ color: "#666", fontSize: "0.9rem" }}>{(food.confidence * 100).toFixed(0)}%</span>
            </li>
          ))}
        </ul>
      </div>
      {missingFood.length > 0 && (
  <div style={{ textAlign: "left", marginTop: "30px" }}>
    <h2>🛒 Missing Food</h2>
    <ul style={{ listStyle: "none", padding: 0 }}>
      {missingFood.map((item, index) => (
        <li
          key={index}
          style={{
            background: "#fff3f3",
            color: "#666",
            margin: "10px 0",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ffcccc"
          }}
        >
          <ImCross style={{color : "#ff0000"}}/> <strong>{item}</strong>
        </li>
      ))}
    </ul>
  </div>
)}

    </div>
  );
}

export default App;