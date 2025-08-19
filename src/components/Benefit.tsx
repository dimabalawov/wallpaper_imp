import React from "react";

interface BenefitProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const Benefit: React.FC<BenefitProps> = ({ title, description, icon }) => (
  <div className="flex max-xl:flex-row flex-col w-full gap-4">
    <div className="flex-shrink-0 flex items-center justify-center w-16 h-16">
      {icon}
    </div>
    <div className="flex-1">
      <h3 className="text-2xl font-semibold text-black">{title}</h3>
      <p className="text-lg text-black leading-snug">{description}</p>
    </div>
  </div>
);

export default Benefit;
