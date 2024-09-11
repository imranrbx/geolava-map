import React from 'react';

interface ToggleProps {
  isToggled: boolean;
  handleToggle: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const Toggle: React.FC<ToggleProps> = ({ isToggled, handleToggle }) => (
  <div
    className={`relative w-11 h-6 cursor-pointer ${
      isToggled ? 'bg-[#1B1925]' : 'bg-[#1B1925]'
    } rounded-full transition-colors duration-300 ease-in-out`}
    onClick={handleToggle}
    role="button"
    tabIndex={0}
    aria-label="Toggle"
    onKeyDown={e => {}}
  >
    <div
      className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full outline outline-2 outline-[#FFFFFF33] outline-solid shadow-md transform transition-transform duration-300 ease-in-out ${
        isToggled ? 'translate-x-5' : ''
      }`}
    />
  </div>
);

export default Toggle;
