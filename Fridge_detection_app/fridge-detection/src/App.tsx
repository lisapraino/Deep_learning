import { useState } from 'react';
import axios from 'axios';
import './App.css';

// Types
import type { FoodItem, ScanResponse } from './types';

// Components
import { ImageUploader } from './components/ImageUploader';
import { ImagePreview } from './components/ImagePreview';
import { FoodList } from './components/FoodList'; // Reuse the previous one for Detected items
import { ExpectedFoodManager } from './components/ExpectedFoodManager'; // New
import { MissingFoodList } from './components/MissingFoodList'; // New

function App() {
  // --- State ---
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [missingFood, setMissingFood] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Initialize expectedFood from localStorage
  const [expectedFood, setExpectedFood] = useState<string[]>(() => {
    const saved = localStorage.getItem("expectedFood");
    return saved ? JSON.parse(saved) : [];
  });

  // --- Handlers ---

  // 1. Add item to Expected List
  const handleAddExpected = (newItem: string) => {
    const normalizedItem = newItem.toLowerCase();
    if (!expectedFood.includes(normalizedItem)) {
      const updated = [...expectedFood, normalizedItem];
      setExpectedFood(updated);
      localStorage.setItem("expectedFood", JSON.stringify(updated));
    }
  };

  // 2. Remove item from Expected List
  const handleRemoveExpected = (itemToRemove: string) => {
    const updated = expectedFood.filter(item => item !== itemToRemove);
    setExpectedFood(updated);
    localStorage.setItem("expectedFood", JSON.stringify(updated));
  };

  // 3. Handle File Selection
  const handleFileSelect = (file: File) => {
    setSelectedImage(URL.createObjectURL(file));
    processImage(file);
  };

  // 4. API Call
  const processImage = async (file: File) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("expected_items", JSON.stringify(expectedFood));

    try {
      const response = await axios.post<ScanResponse>("http://127.0.0.1:8000/scan-fridge", formData);
      setFoodItems(response.data.food_found);
      setMissingFood(response.data.missing_food);
    } catch (error) {
      console.error("Error scanning image:", error);
      alert("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px", fontFamily: "sans-serif", textAlign: "center" }}>
      <h1>🧊 Fridge Scanner</h1>

      {/* 1. Manage Expected Food */}
      <ExpectedFoodManager 
        items={expectedFood} 
        onAdd={handleAddExpected} 
        onRemove={handleRemoveExpected} 
      />
      
      {/* 2. Upload Component */}
      <ImageUploader onFileSelect={handleFileSelect} disabled={loading} />

      {/* 3. Preview Component */}
      <ImagePreview imageSrc={selectedImage} />

      {/* 4. Loading State */}
      {loading && <p>🔍 Analyzing your fridge...</p>}

      {/* 5. Detected Food Results */}
      <FoodList items={foodItems} />

      {/* 6. Missing Food Results */}
      <MissingFoodList items={missingFood} />
    </div>
  );
}

export default App;