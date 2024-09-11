import { useEffect, useState } from 'react';
import Image from 'next/image';
import useMapContext from '@/map/useMapContext';
import ToolButton from './ToolButton';

const MapSelectButton = ({ disabled }: { disabled: boolean }) => {
  const { map, draw, userAddedGeojson, selectedTool, setSelectedTool, addDraw, removeDraw } =
    useMapContext();
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    if (draw && selectedTool === 'simple_select') {
      if (userAddedGeojson && draw?.set) {
        draw?.set(userAddedGeojson);
      }
      draw.changeMode('simple_select');
    } else if (selectedTool !== 'simple_select') {
      setSelected(false);
    }
  }, [draw, selectedTool]);

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
            src="/chat/select-button.svg"
            alt="Select Button"
            color={selected ? '#080D23' : '#5A5E77'}
          />
        </ToolButton>
      </div>
    </div>
  );
};

export default MapSelectButton;
