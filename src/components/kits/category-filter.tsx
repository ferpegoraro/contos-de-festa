"use client";

interface FilterOption {
  id: string;
  name: string;
}

interface FilterPillsProps {
  /** Rótulo pequeno antes das pills (ex.: "categoria", "tipo"). */
  label?: string;
  options: FilterOption[];
  active: string | null;
  onChange: (id: string | null) => void;
}

export function FilterPills({
  label,
  options,
  active,
  onChange,
}: FilterPillsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {label && (
        <span className="font-body text-[10px] font-bold tracking-[0.3em] uppercase text-white/35 mr-1">
          {label}
        </span>
      )}
      <button
        onClick={() => onChange(null)}
        className={pillClass(!active)}
      >
        Todos
      </button>
      {options.map((option) => {
        const isActive = active === option.id;
        return (
          <button
            key={option.id}
            onClick={() => onChange(isActive ? null : option.id)}
            className={pillClass(isActive)}
          >
            {option.name}
          </button>
        );
      })}
    </div>
  );
}

function pillClass(isActive: boolean): string {
  return `px-4 py-2 rounded-full text-sm font-semibold font-body transition-all duration-300 border ${
    isActive
      ? "bg-[#e8a0b4]/20 border-[#e8a0b4]/40 text-[#e8a0b4]"
      : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white/80"
  }`;
}

/** Compatibilidade com o uso antigo (pills de categoria). */
import type { Category } from "@/types/kit";

interface CategoryFilterProps {
  categories: Category[];
  active: string | null;
  onChange: (categoryId: string | null) => void;
}

export function CategoryFilter({
  categories,
  active,
  onChange,
}: CategoryFilterProps) {
  return (
    <FilterPills options={categories} active={active} onChange={onChange} />
  );
}
