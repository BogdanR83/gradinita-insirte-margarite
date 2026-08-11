export function FloatingBeads() {
  const beads = [
    { top: "12%", left: "6%", size: 18, color: "#FFC94A", delay: "0s", duration: "4.2s" },
    { top: "22%", left: "88%", size: 14, color: "#FF7A6B", delay: "0.4s", duration: "3.6s" },
    { top: "58%", left: "4%", size: 12, color: "#4EB8E8", delay: "0.8s", duration: "4.8s" },
    { top: "70%", left: "92%", size: 16, color: "#3DBE7A", delay: "1.1s", duration: "3.9s" },
    { top: "38%", left: "95%", size: 10, color: "#FFC94A", delay: "0.2s", duration: "5.1s" },
  ];

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {beads.map((bead, index) => (
        <span
          key={index}
          className="bead"
          style={{
            top: bead.top,
            left: bead.left,
            width: bead.size,
            height: bead.size,
            background: bead.color,
            animationDelay: bead.delay,
            animationDuration: bead.duration,
          }}
        />
      ))}
    </div>
  );
}
