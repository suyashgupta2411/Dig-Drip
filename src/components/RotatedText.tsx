import React from "react";

const RotatedText: React.FC = () => {
  return (
    <div className="fixed left-16 top-1/2 -translate-y-1/2 transform -rotate-90 origin-center z-10">
      <div className="flex flex-col text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-black">
        <span className="leading-none whitespace-nowrap">Drip Hard</span>
        <span className="leading-none whitespace-nowrap">Flex Harder</span>
      </div>
    </div>
  );
};

export default RotatedText;
