import { useEffect, useState } from "react";
import { getNextOccasion } from "../data";

export default function CountdownCard() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const { occasion, date, daysLeft } = getNextOccasion();
  const dateStr = date.toLocaleDateString("ar-EG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 bg-gradient-to-bl from-[#534AB7] via-[#A87FD1] to-[#C8A8E9] shadow-xl text-white fade-up">
        <div className="absolute -top-8 -left-8 text-[8rem] opacity-20 select-none float-slow">
          {occasion.emoji}
        </div>
        <div className="absolute -bottom-10 -right-6 text-[7rem] opacity-15 select-none float-slow">
          🎉
        </div>

        <div className="relative grid sm:grid-cols-[auto_1fr] items-center gap-6 sm:gap-10 text-center sm:text-right">
          <div className="flex flex-col items-center bg-white/15 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/30 shadow-lg">
            <div
              key={daysLeft}
              className="text-5xl sm:text-7xl font-black leading-none fade-up"
            >
              {daysLeft}
            </div>
            <div className="text-sm sm:text-base font-semibold mt-1 opacity-90">
              {daysLeft === 1 ? "يوم" : "يوم"}
            </div>
          </div>

          <div>
            <div className="text-sm opacity-90 mb-1 font-semibold">
              المناسبة القادمة
            </div>
            <h3 className="text-2xl sm:text-4xl font-extrabold mb-2">
              باقي {daysLeft} يوم على {occasion.name} {occasion.emoji}
            </h3>
            <p className="text-sm sm:text-base opacity-90">
              {dateStr} — جهّزي هديتك من الآن قبل نفاد الكميات 🎁
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
