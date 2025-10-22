import React from "react";
import Image from "next/image";

interface MaterialProps {
  label: string;
  desc: string;
  checked: boolean;
  imageUrl?: string;
  onChange: () => void;
}

const Material: React.FC<MaterialProps> = ({
  label,
  desc,
  checked,
  imageUrl,
  onChange,
}) => (
  <label className="flex items-center border border-teal text-navy  rounded-xl px-4 py-3 cursor-pointer transition-colors">
    <input
      type="radio"
      name="material"
      checked={checked}
      onChange={onChange}
      className="accent-teal self-start mt-5 mr-3"
    />
    <div className="flex-1 p-2">
      <div className="font-semibold sm:text-lg mb-1">{label}</div>
      <div className="text-navy font-normal text-sm sm:text-base">{desc}</div>
    </div>
    <div className="aspect-square w-20 bg-mock rounded-lg ml-4">
      <Image
        src={imageUrl || "/placeholder.jpg"}
        alt={label}
        width={80}
        height={80}
        className="w-full h-full object-cover rounded-lg"
      />
    </div>
  </label>
);

export default Material;
