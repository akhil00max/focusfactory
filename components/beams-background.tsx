"use client"

export function Beams() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <style>{`
        @keyframes beam-flow {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(100%);
            opacity: 0;
          }
        }

        .beam-container {
          position: absolute;
          width: 2px;
          height: 200%;
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(198, 255, 0, 0.4),
            transparent
          );
          animation: beam-flow 5s ease-in infinite;
          filter: blur(3px);
        }

        .beam-container:nth-child(1) { left: 5%; animation-delay: 0s; }
        .beam-container:nth-child(2) { left: 15%; animation-delay: 0.4s; }
        .beam-container:nth-child(3) { left: 25%; animation-delay: 0.8s; }
        .beam-container:nth-child(4) { left: 35%; animation-delay: 1.2s; }
        .beam-container:nth-child(5) { left: 50%; animation-delay: 1.6s; }
        .beam-container:nth-child(6) { left: 65%; animation-delay: 0.2s; }
        .beam-container:nth-child(7) { left: 75%; animation-delay: 0.6s; }
        .beam-container:nth-child(8) { left: 85%; animation-delay: 1s; }
        .beam-container:nth-child(9) { left: 95%; animation-delay: 1.4s; }
      `}</style>

      {/* Beams Container */}
      <div className="absolute inset-0">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="beam-container" />
        ))}
      </div>

      {/* Gradient Overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
    </div>
  )
}
