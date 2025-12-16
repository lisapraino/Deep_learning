import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

import type { FoodItem, ScanResponse } from './types';

import { ImageUploader } from './components/ImageUploader';
import { ImagePreview } from './components/ImagePreview';
import { FoodList } from './components/FoodList';
import { ExpectedFoodManager } from './components/ExpectedFoodManager';
import { MissingFoodList } from './components/MissingFoodList';
import { ReloadButton } from './components/ReloadButton';

import { normalizeFoodName } from './normalizeFood';

function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [missingFood, setMissingFood] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [expectedFood, setExpectedFood] = useState<string[]>(() => {
    const saved = localStorage.getItem("expectedFood");
    return saved ? JSON.parse(saved) : [];
  });

  /* ---------- EXPECTED FOOD ---------- */

  const handleAddExpected = (newItem: string) => {
    const normalized = normalizeFoodName(newItem);
    if (!expectedFood.includes(normalized)) {
      const updated = [...expectedFood, normalized];
      setExpectedFood(updated);
      localStorage.setItem("expectedFood", JSON.stringify(updated));
    }
  };

  const handleRemoveExpected = (item: string) => {
    const updated = expectedFood.filter(f => f !== item);
    setExpectedFood(updated);
    localStorage.setItem("expectedFood", JSON.stringify(updated));
  };

  /* ---------- IMAGE UPLOAD ---------- */

  const handleFileSelect = (file: File) => {
    setSelectedImage(URL.createObjectURL(file));
    setSelectedFile(file);
    processImage(file);
  };

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
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- REAL-TIME MISSING FOOD ---------- */

  useEffect(() => {
    if (foodItems.length === 0) {
      setMissingFood([]);
      return;
    }

    const detectedNormalized = foodItems.map(food =>
      normalizeFoodName(food.item)
    );

    const missing = expectedFood.filter(
      item => !detectedNormalized.includes(item)
    );

    setMissingFood(missing);
  }, [foodItems, expectedFood]);

  const handleReloadClick = () => {
    if (selectedFile) processImage(selectedFile);
  };

  /* ---------- UI ---------- */

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>🧊 Fridge Scanner</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: "30px",
          marginTop: "30px"
        }}
      >
        {/* LEFT COLUMN */}
        <ExpectedFoodManager
          items={expectedFood}
          onAdd={handleAddExpected}
          onRemove={handleRemoveExpected}
        />

        {/* RIGHT COLUMN */}
        <div>
          <ImageUploader onFileSelect={handleFileSelect} disabled={loading} />
          <ImagePreview imageSrc={selectedImage} />
          {loading && <p>🔍 Analyzing your fridge...</p>}
          <ReloadButton onButtonClick={handleReloadClick} />
          <FoodList items={foodItems} expectedFood={expectedFood} />
          <MissingFoodList items={missingFood} />
        </div>
      </div>
    </div>
  );
}

export default App;
