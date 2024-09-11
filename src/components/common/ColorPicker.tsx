import React, { useState, useRef, useEffect } from 'react';
import { SketchPicker, ColorResult } from 'react-color';
import Image from 'next/image';

interface ColorPickerProps {
  color?: string;
  setColor: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, setColor }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleChangeComplete = (chosenColor: ColorResult) => {
    setColor(chosenColor.hex);
  };
  // Function to handle outside click
  const handleClickOutside = (event: MouseEvent) => {
    // Check if the click is outside the dropdownRef
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setShowColorPicker(false);
    }
  };

  // Add and remove event listener on component mount/unmount
  useEffect(() => {
    // Add event listener on document to detect outside clicks
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Cleanup the event listener on component unmount
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        className="bg-[#3F3956] flex items-center"
        id="menu-button"
        aria-expanded="true"
        aria-haspopup="true"
        aria-label="Color Picker"
        onClick={() => setShowColorPicker(!showColorPicker)}
      >
        <div className="w-6 h-6 rounded-[4px]" style={{ backgroundColor: color }} />
        <Image
          src="/chat/chevron-bottom.svg"
          alt="chevron-bottom"
          width={20}
          height={20}
          className="ml-1 h-5 w-5"
        />
      </button>
      {showColorPicker && (
        <div
          className="origin-top-left absolute top-[-300px] left-[60px] mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <SketchPicker color={color} onChangeComplete={handleChangeComplete} />
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
