import React, { ReactNode, useState } from 'react';

interface TooltipProps {
  text: string;
  children: ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          className={`absolute left-1/2 transform -translate-x-1/2 bottom-[-85%] mb-2 bg-[#1B1925] text-white text-xs rounded-full shadow-lg text-center px-4 py-1 border-[1px] border-[#3F3956] `}
        >
          <p className="whitespace-nowrap">{text}</p>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
