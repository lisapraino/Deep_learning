import { ImCross } from 'react-icons/im';

interface MissingFoodListProps {
  items: string[];
}

export const MissingFoodList = ({ items }: MissingFoodListProps) => {
  if (items.length === 0) return null;

  return (
    <div style={{ textAlign: "left", marginTop: "30px" }}>
      <h2>🛒 Missing Food</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map((item, index) => (
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
            <span style={{fontSize: "1.2rem"}}>
              <ImCross style={{ color: "#ff0000", marginRight: "8px" }} /> 
              <strong>{item}</strong>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};