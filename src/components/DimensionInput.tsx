import React from "react";

interface DimensionInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  unit?: string;
  icon?: React.ReactNode;
}

export default function DimensionInput({
  label,
  value,
  onChange,
  min = 1,
  max = 999,
  unit = "см",
  icon,
}: DimensionInputProps) {
  return (
    <div>
      <div className="text-xl text-navy mb-1">{label}</div>
      <div className="flex flex-row items-center rounded-lg overflow-hidden w-auto h-10 py-4 px-6 border border-teal">
        {icon && <div className="flex text-2xl mr-2">{icon}</div>}
        <div className="flex ml-2">
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            onChange={(e) => onChange(Number(e.target.value))}
            className="text-center text-black outline-none bg-transparent text-lg font-normal"
          />
        </div>
        <div className="text-navy text-lg ml-2">{unit}</div>
      </div>
      <div className="text-navy text-sm mt-2 text-right">
        = {(value / 100).toFixed(2)} м
      </div>
    </div>
  );
}
