interface ExpirationPanelProps {
  items: { name: string; expirationDate: string }[];
}

export const ExpirationPanel = ({ items }: ExpirationPanelProps) => {
  const today = new Date();

  const withDiff = items.map(item => {
    const diff =
      (new Date(item.expirationDate).getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24);

    return { ...item, diffDays: Math.ceil(diff) };
  });

  const alerts = withDiff.filter(i => i.diffDays <= 3);

  return (
    <div>
      <h2>📅 Expiration Dates</h2>
      <ul>
        {withDiff.map((item, index) => (
          <li key={index}>
            <strong>{item.name}</strong> — {item.expirationDate}
          </li>
        ))}
      </ul>

      {alerts.length > 0 && (
        <>
          <h3>⚠️ Alerts</h3>
          <ul>
            {alerts.map((item, index) => (
              <li key={index} style={{ color: "red" }}>
                ⚠️ {item.name} expires in {item.diffDays} day(s)
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};
