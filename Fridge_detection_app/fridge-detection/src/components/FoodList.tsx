import type { FoodItem } from '../types';
import { FaCheckSquare } from "react-icons/fa";
import { normalizeFoodName } from '../normalizeFood';

interface FoodListProps {
  items: FoodItem[];
  expectedFood: string[];
}

export const FoodList = ({ items, expectedFood }: FoodListProps) => {
  if (items.length === 0) return null;

  const expectedNormalized = expectedFood.map(normalizeFoodName);

  return (
    <div style={{ textAlign: "left" }}>
      <h2>Detected Food:</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map((food, index) => {
          const isExpected = expectedNormalized.includes(
            normalizeFoodName(food.item)
          );

          return (
            <li key={index} style={{
              background: "#f9f9f9",
              margin: "10px 0",
              padding: "10px",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: "1px solid #eee"
            }}>
              <span style={{ color: "#666", fontSize: "1.2rem" }}>
                {isExpected && <FaCheckSquare color="#11b851" style={{ marginRight: "8px" }} />}
                <strong>{food.item}</strong>
              </span>
              <span>{(food.confidence * 100).toFixed(0)}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
