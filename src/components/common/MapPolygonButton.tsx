import { useEffect, useState } from 'react';
import Image from 'next/image';
import useMapContext from '@/map/useMapContext';
import ToolButton from './ToolButton';

const MapPolygonButton = ({ disabled }: { disabled: boolean }) => {
  const { map, draw, selectedTool, setSelectedTool, addDraw, removeDraw } = useMapContext();
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    if (draw && selectedTool === 'draw_polygon') {
      draw.changeMode('draw_polygon');
    } else if (selectedTool !== 'draw_polygon') {
      setSelected(false);
    }
  }, [draw, selectedTool]);

  useEffect(() => {
    if (map && selected) {
      if (!draw) addDraw();
      setSelectedTool('draw_polygon');
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
            src="/chat/polygon-button.svg"
            alt="Polygon Button"
            color={selected ? '#080D23' : '#5A5E77'}
          />
        </ToolButton>
      </div>
    </div>
  );
};

export default MapPolygonButton;
