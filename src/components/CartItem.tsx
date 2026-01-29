"use client";

import Image from "next/image";
import { CartItem, useCart } from "@/context/CartContext";

type CartItemProps = {
  item: CartItem;
};

export default function CartItemNew({ item }: CartItemProps) {
  const { removeItem } = useCart();

  // Збираємо масив опцій для відображення на основі boolean значень
  const options = [];
  if (item.premium) options.push("Друк преміум");
  if (item.laminate) options.push("Ламінування");
  if (item.glue) options.push("Клей у комплекті");

  const handleRemove = () => {
    if (window.confirm(`Видалити "${item.name}" з кошика?`)) {
      removeItem(item.id);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start">
      <div className="min-w-40 max-sm:min-w-50 aspect-square bg-mock rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
        <Image
          src={item.imageUrl || "/placeholder.jpg"}
          alt={item.name}
          width={128}
          height={128}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col justify-between w-full">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-xl text-navy mb-1">
              {item.name}
            </h3>
            <button
              onClick={handleRemove}
              className="text-gray-400 hover:text-red-500 transition-colors font-bold text-2xl"
              aria-label="Видалити товар"
            >
              &times;
            </button>
          </div>
          <div className=" text-teal mb-1">Артикул: {item.productId}</div>
          <div className=" text-gray-700 mb-1">
            Розмір:{" "}
            <span className="font-semibold">
              {item.width}см x {item.height}см
            </span>
          </div>
          <div className=" text-navy text-semibold mb-1">
            Матеріал: {item.material}
          </div>
        </div>
        <div className="flex justify-between items-end mt-2">
          <div className=" text-teal">
            {options.map((opt, i) => (
              <div key={i}>+ {opt}</div>
            ))}
          </div>
          <div className="font-bold text-navy text-lg">
            {item.price.toFixed(2)} грн
          </div>
        </div>
      </div>
    </div>
  );
}
