import { useState } from 'react';
import Image from 'next/image';
import ToolButton from './ToolButton';

const MapPictureButton = ({ disabled }: { disabled: boolean }) => {
  const [selected, setSelected] = useState(false);

  const onHandleClick = () => {
    setSelected(!selected);
  };

  return (
    <div>
      <div className="relative" id="tool-mappin-button">
        <ToolButton onClick={onHandleClick} selected={selected} disabled={disabled}>
          <Image
            width={24}
            height={24}
            src="/chat/picture-button.svg"
            alt="Upload Button"
            color={selected ? '#080D23' : '#5A5E77'}
          />
        </ToolButton>
      </div>
    </div>
  );
};

export default MapPictureButton;
