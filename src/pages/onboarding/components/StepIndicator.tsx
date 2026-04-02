type Props = {
  total: number;
  current: number;
};

export function StepIndicator({ total, current }: Props) {
  return (
    <div
      style={{
        display: "flex",
        gap: "6px",
        justifyContent: "center",
        marginBottom: "32px",
      }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            height: "4px",
            borderRadius: "2px",
            background: i <= current ? "#7C3AED" : "#2a2a2a",
            flex: i === current ? 2 : 1,
            transition: "all 0.3s ease",
          }}
        />
      ))}
    </div>
  );
}
