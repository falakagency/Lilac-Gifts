import { useMemo } from "react";

const PETAL_COUNT = 15;
const COLORS = ["#C8A8E9", "#EDE0F7", "#f8c8d4"];

type Petal = {
  left: number;
  size: number;
  duration: number;
  delay: number;
  swayDuration: number;
  swayDelay: number;
  color: string;
  drift: number;
};

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function Petals() {
  const petals = useMemo<Petal[]>(
    () =>
      Array.from({ length: PETAL_COUNT }, () => ({
        left: rand(0, 100),
        size: rand(10, 20),
        duration: rand(3, 8),
        delay: rand(-8, 0),
        swayDuration: rand(2, 4),
        swayDelay: rand(-3, 0),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        drift: rand(-30, 30),
      })),
    [],
  );

  return (
    <div className="petals-layer" aria-hidden="true">
      {petals.map((p, i) => (
        <span
          key={i}
          className="petal-fall"
          style={{
            left: `${p.left}%`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            // pass drift as CSS var
            ["--petal-drift" as string]: `${p.drift}px`,
          }}
        >
          <span
            className="petal-sway"
            style={{
              animationDuration: `${p.swayDuration}s`,
              animationDelay: `${p.swayDelay}s`,
              fontSize: `${p.size}px`,
              color: p.color,
            }}
          >
            🌸
          </span>
        </span>
      ))}
    </div>
  );
}
