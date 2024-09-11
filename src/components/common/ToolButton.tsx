import React, { ReactNode, useState } from 'react';

interface ToolButtonProps {
  selected: boolean;
  children: ReactNode;
  onClick: () => void;
  disabled: boolean;
}

const ToolButton: React.FC<ToolButtonProps> = ({ selected, children, onClick, disabled }) => (
  <button
    className={`relative flex justify-center p-2.5 rounded-full ${selected ? 'bg-[#7553FF]' : 'transparent'} hover:bg-[#262233]`}
    onClick={onClick}
    type="button"
    disabled={disabled}
  >
    {children}
  </button>
);

export default ToolButton;
