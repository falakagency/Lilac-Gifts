import { BUDGET_OPTIONS, type BudgetFilterValue } from "../data";

type Props = {
  value: BudgetFilterValue;
  onChange: (v: BudgetFilterValue) => void;
};

export default function BudgetFilter({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
      <span className="text-sm text-[#A87FD1] font-semibold ml-2 hidden sm:inline">
        الميزانية:
      </span>
      {BUDGET_OPTIONS.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`btn-anim px-4 py-2 rounded-full text-sm font-bold border-2 ${
              active
                ? "bg-[#534AB7] text-white border-[#534AB7] shadow-md"
                : "bg-white dark:bg-[#16213e] text-[#534AB7] dark:text-[#C8A8E9] border-[#EDE0F7] dark:border-[#2a2f4a] hover:border-[#C8A8E9] hover:bg-[#EDE0F7] dark:hover:bg-[#2a2f4a]"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
