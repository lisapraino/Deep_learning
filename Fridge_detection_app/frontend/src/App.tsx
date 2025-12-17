import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import { GiIceCube } from "react-icons/gi";

import type { ExpiringItem, FoodItem, ScanResponse } from './types';
import { ImageUploader } from './components/ImageUploader';
import { ImagePreview } from './components/ImagePreview';
import { FoodList } from './components/FoodList';
import { ExpectedFoodManager } from './components/ExpectedFoodManager';
import { MissingFoodList } from './components/MissingFoodList';
import { ReloadButton } from './components/ReloadButton';

import { normalizeFoodName } from './normalizeFood';
import { ExpirationList } from './components/ExpirationList';

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

  const [expiringFood, setExpiringFood] = useState<ExpiringItem[]>(() => {
    const savedExpiring = localStorage.getItem("expiringFood");
    return savedExpiring ? JSON.parse(savedExpiring) : [];
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
        "http://localhost:8000/scan-fridge",
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

  useEffect(() => {
    localStorage.setItem("expiringFood", JSON.stringify(expiringFood));
  }, [expiringFood]);

  const handleAddExpiration = (item: string, date: string) => {
    if (!date) return;
    
    setExpiringFood(prev => {
      const updated = prev.filter(f => f.name !== item); 
      return [...updated, { name: item, expirationDate: date }];
    });
  };

  const handleRemoveExpiration = (itemName: string) => {
    setExpiringFood(prev => prev.filter(item => item.name !== itemName));
  };

  /* ---------- UI ---------- */

  return (
    <div>
      <h1><GiIceCube style={{color: "#87CEEB"}}/> Fridge Scanner</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr 1fr",
          gap: "30px",
          marginTop: "30px"
        }}
      >
        {/* Left Column */}
        <div>
          <ExpectedFoodManager
            items={expectedFood}
            onAdd={handleAddExpected}
            onRemove={handleRemoveExpected}
          />
        </div>

        {/* Middle Column */}
        <div>
          <ImageUploader onFileSelect={handleFileSelect} disabled={loading} />

          <ImagePreview imageSrc={selectedImage} />

          {loading && <p>🔍 Analyzing your fridge...</p>}

          <ReloadButton onButtonClick={handleReloadClick} />

          <FoodList
            items={foodItems}
            expectedFood={expectedFood}
            onAddExpiration={handleAddExpiration}
            onRemoveExpiration={handleRemoveExpiration}
          />

          <MissingFoodList items={missingFood} />
        </div>

        {/* Right Column */}
        <div>
          <ExpirationList 
            items={expiringFood}
            onRemoveExpiration={handleRemoveExpiration}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
