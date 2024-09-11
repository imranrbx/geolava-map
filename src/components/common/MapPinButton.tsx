import { useEffect, useState } from 'react';
import Image from 'next/image';
import useMapContext from '@/map/useMapContext';
import ToolButton from './ToolButton';

const MapPinButton = ({ disabled }: { disabled: boolean }) => {
  const { map, draw, selectedTool, setSelectedTool, addDraw, removeDraw } = useMapContext();
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    if (draw && selectedTool === 'draw_point') {
      draw.changeMode('draw_point');
    } else if (selectedTool !== 'draw_point') {
      setSelected(false);
    }
  }, [draw, selectedTool]);

  useEffect(() => {
    if (map && selected) {
      if (!draw) addDraw();
      setSelectedTool('draw_point');
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
          <Image width={24} height={24} src="/chat/pin-down.svg" alt="Pin Down" />
        </ToolButton>
      </div>
    </div>
  );
};

export default MapPinButton;
