"use client";

type MultiOptionChecklistProps = {
  label: string;
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
  helperText?: string;
  emptyText?: string;
};

export function MultiOptionChecklist({
  label,
  options,
  selected,
  onChange,
  helperText,
  emptyText = "Nenhuma opção disponível.",
}: MultiOptionChecklistProps) {
  const toggleOption = (value: string, checked: boolean) => {
    if (checked) {
      if (selected.includes(value)) {
        return;
      }
      onChange([...selected, value]);
      return;
    }
    onChange(selected.filter((item) => item !== value));
  };

  const selectAll = () => {
    onChange(options);
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className="text-sm font-semibold text-[#2f4050]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span>{label}</span>
        {options.length > 0 && (
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em]">
            <button
              type="button"
              onClick={selectAll}
              className="rounded-full border border-[#1f6dd1]/30 px-2 py-1 text-[#1f6dd1] transition hover:bg-[#f2f6ff]"
            >
              Selecionar todas
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="rounded-full border border-[#8a98a5]/30 px-2 py-1 text-[#5b6b78] transition hover:bg-[#f7f4ef]"
            >
              Limpar
            </button>
          </div>
        )}
      </div>
      <div className="mt-2 max-h-44 overflow-auto rounded-2xl border border-[#e5d6c5] bg-white/90 p-3">
        {options.length === 0 ? (
          <div className="text-xs font-medium text-[#8a98a5]">{emptyText}</div>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {options.map((option) => {
              const checked = selected.includes(option);
              return (
                <label
                  key={option}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#e5d6c5] bg-white px-3 py-2 text-xs font-medium text-[#2f4050] transition hover:border-[#1f6dd1]/35 hover:bg-[#f8fbff]"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(event) => toggleOption(option, event.target.checked)}
                    className="h-4 w-4 rounded border-[#1f6dd1]/35 text-[#1f6dd1]"
                  />
                  <span>{option}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>
      <div className="mt-1 flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-[#8a98a5]">
        <span>{helperText}</span>
        {options.length > 0 && (
          <span className="rounded-full bg-[#f2f6ff] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#1f6dd1]">
            {selected.length} selecionada(s)
          </span>
        )}
      </div>
    </div>
  );
}
