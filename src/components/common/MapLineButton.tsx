import { useEffect, useState } from 'react';
import Image from 'next/image';
import useMapContext from '@/map/useMapContext';
import ToolButton from './ToolButton';

const MapLineButton = ({ disabled }: { disabled: boolean }) => {
  const { map, draw, selectedTool, setSelectedTool, addDraw, removeDraw } = useMapContext();
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    if (draw && selectedTool === 'draw_line_string') {
      draw.changeMode('draw_line_string');
    } else if (selectedTool !== 'draw_line_string') {
      setSelected(false);
    }
  }, [draw, selectedTool]);

  useEffect(() => {
    if (map && selected) {
      if (!draw) addDraw();
      setSelectedTool('draw_line_string');
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
            src="/chat/line-button.svg"
            alt="Line Button"
            color={selected ? '#080D23' : '#5A5E77'}
          />
        </ToolButton>
      </div>
    </div>
  );
};

export default MapLineButton;
