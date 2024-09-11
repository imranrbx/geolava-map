import { useEffect, useState } from 'react';
import Image from 'next/image';
import useMapContext from '@/map/useMapContext';
import ToolButton from './ToolButton';

const MapCommentButton = ({ disabled }: { disabled: boolean }) => {
  const { map, draw, setSelectedTool, addDraw, removeDraw } = useMapContext();
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    if (map && selected) {
      if (!draw) addDraw();
      setSelectedTool('simple_select');
    }
  }, [selected, map]);

  const onHandleClick = () => {
    if (selected) {
      removeDraw();
    }
    setSelected(!selected);
  };

  return (
    <div>
      <div className="relative" id="tool-mappin-button">
        <ToolButton onClick={onHandleClick} selected={selected} disabled={disabled}>
          <Image
            width={24}
            height={24}
            src="/chat/comment-button.svg"
            alt="Comment Button"
            color={selected ? '#080D23' : '#5A5E77'}
          />
        </ToolButton>
      </div>
    </div>
  );
};

export default MapCommentButton;
