import React from "react";

const StatCard = ({ emoji, title, value, sub, bg }) => {
  return (
    <div className={`${bg} rounded-3xl p-6 flex flex-col gap-3`}>
      <span className="text-3xl">{emoji}</span>
      <div>
        <p className="text-xs text-[#4A4A6A]/60 mb-1">{title}</p>
        <p className="text-2xl font-semibold text-[#4A4A6A]">{value}</p>
        {sub && <p className="text-xs text-[#4A4A6A]/50 mt-1">{sub}</p>}
      </div>
    </div>
  );
};

export default StatCard;
