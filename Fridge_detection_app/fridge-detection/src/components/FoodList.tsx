import type { FoodItem } from '../types';
import { FaCheckSquare } from "react-icons/fa";
import { normalizeFoodName } from '../normalizeFood';

interface FoodListProps {
  items: FoodItem[];
  expectedFood: string[];
  onAddExpiration: (item: string, date: string) => void;
}

export const FoodList = ({ items, expectedFood, onAddExpiration }: FoodListProps) => {
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
              border: "1px solid #eee"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "1.1rem" }}>
                  {isExpected && <FaCheckSquare color="#11b851" style={{ marginRight: "6px" }} />}
                  <strong>{food.item}</strong>
                </span>
                <span>{(food.confidence * 100).toFixed(0)}%</span>
              </div>

              <div style={{ marginTop: "8px" }}>
                <input
                  type="date"
                  onChange={(e) =>
                    onAddExpiration(food.item, e.target.value)
                  }
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
