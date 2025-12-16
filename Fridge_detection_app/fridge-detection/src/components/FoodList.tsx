import type { FoodItem } from '../types';
import { FaCheckSquare } from "react-icons/fa";
import { normalizeFoodName } from '../normalizeFood';

interface FoodListProps {
  items: FoodItem[];
  expectedFood: string[];
  onAddExpiration: (item: string, date: string) => void;
  onRemoveExpiration: (itemName: string) => void;
}

export const FoodList = ({ items, expectedFood, onAddExpiration, onRemoveExpiration }: FoodListProps) => {
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
              color: "#666",
              margin: "10px 0",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #eee"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "1.2rem" }}>
                  {isExpected && <FaCheckSquare color="#11b851" style={{ marginRight: "6px" }} />}
                  <strong>{food.item}</strong>
                </span>
                <span>{(food.confidence * 100).toFixed(0)}%</span>
              </div>

              <div style={{ marginTop: "8px" }}>
                <input
                  type="date"
                  onChange={(e) => {
                    const dateValue = e.target.value;
                    if (dateValue) {
                      onAddExpiration(food.item, dateValue);
                    } else {
                      onRemoveExpiration(food.item);
                    }
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
