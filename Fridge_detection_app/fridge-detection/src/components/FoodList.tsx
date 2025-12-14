import type { FoodItem } from '../types';

interface FoodListProps {
  items: FoodItem[];
}

export const FoodList = ({ items }: FoodListProps) => {
  if (items.length === 0) return null;

  return (
    <div style={{ textAlign: "left" }}>
      <h2>Detected Food:</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map((food, index) => (
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
            <span style={{ color: "#666", fontSize: "1.2rem" }}>
              ✅ <strong>{food.item}</strong>
            </span>
            <span style={{ color: "#666", fontSize: "0.9rem" }}>
              {(food.confidence * 100).toFixed(0)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};