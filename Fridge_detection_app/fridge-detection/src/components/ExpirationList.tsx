interface ExpiringItem {
  name: string;
  expirationDate: string;
}

interface ExpirationListProps {
  items: ExpiringItem[];
}

export const ExpirationList = ({ items }: ExpirationListProps) => {
  <div style={{ textAlign: "left" }}>
  <h2>📆 Expiration Dates</h2>
  {items.length === 0 ? (
    <p style={{ color: "#999" }}>No expiration dates yet</p>
  ) : (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {items.map((item, index) => (
        <li key={index}>
          <strong>{item.name}</strong> – {item.expirationDate}
        </li>
      ))}
    </ul>
  )}
</div>


  const today = new Date();

  // Calcul des alertes
  const alerts = items
    .map(item => {
      const expDate = new Date(item.expirationDate);
      const diffTime = expDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return { ...item, diffDays };
    })
    .filter(item => item.diffDays <= 7 && item.diffDays >= 0);

  return (
    <div style={{ textAlign: "left" }}>
      <h2>📆 Expiration Dates</h2>

      {/* LISTE DES DATES */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map((item, index) => (
          <li
            key={index}
            style={{
              background: "#f9f9f9",
              margin: "8px 0",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #eee"
            }}
          >
            <strong>{item.name}</strong>
            <br />
            Expires on: {item.expirationDate}
          </li>
        ))}
      </ul>

      {/* ALERTES */}
      {alerts.length > 0 && (
        <>
          <h3 style={{ marginTop: "20px", color: "#d32f2f" }}>
            ⚠️ Expiring Soon
          </h3>

          <ul style={{ listStyle: "none", padding: 0 }}>
            {alerts.map((item, index) => (
              <li
                key={index}
                style={{
                  background: "#fff3cd",
                  color: "#856404",
                  margin: "8px 0",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ffeeba"
                }}
              >
                ⚠️ <strong>{item.name}</strong>{" "}
                {item.diffDays === 0
                  ? "expires today!"
                  : item.diffDays === 1
                  ? "expires tomorrow!"
                  : `expires in ${item.diffDays} days`}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};
