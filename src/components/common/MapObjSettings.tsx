import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { MapObjSetting, MapObjType } from '@/types/entityTypes';
import { throttle, isEqual } from 'lodash';
import RangeSlider from './RangeSlider';
import ColorPicker from './ColorPicker';
import Toggle from './Toggle';

interface MapObjSettingsProps {
  featureId: string;
  type: MapObjType;
  settings: MapObjSetting;
  updateSettings: (featureId: string, settings: MapObjSetting) => void;
  deleteFeature: (featureId: string) => void;
}

const ObjDefaultColors = {
  [MapObjType.LINESTRING]: '#39D652',
  [MapObjType.POINT]: '#DC952A',
  [MapObjType.POLYGON]: '#DC952A',
};
const MapObjSettings: React.FC<MapObjSettingsProps> = ({
  featureId,
  type,
  settings,
  updateSettings,
  deleteFeature,
}) => {
  const [currentSettings, setCurrentSettings] = useState<MapObjSetting | null>(null);
  const [closed, setClosed] = useState<boolean>(false);
  const [inputName, setInputName] = useState('');

  // Function to toggle the state
  const handleLabelToggle = () => {
    setCurrentSettings(prev => ({ ...prev, show_label: !currentSettings?.show_label }));
  };

  const handleWidthChange = (values: number[]) =>
    setCurrentSettings(prev => ({ ...prev, user_width: values[0] }));
  const handleColorChange = (color: string) =>
    setCurrentSettings(prev => ({ ...prev, user_color: color }));

  const throttledNameUpdate = useCallback(
    throttle(value => {
      setCurrentSettings(prev => ({ ...prev, name: value }));
    }, 500),
    [],
  );

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputName(event.target.value);
    // Use throttled update
    throttledNameUpdate(event.target.value);
  };

  const handleDelete = () => {
    setClosed(true);
    deleteFeature(featureId);
  };

  useEffect(() => {
    setClosed(false);
    if (settings) {
      setCurrentSettings(settings);
      setInputName(settings.name || '');
    }
  }, [featureId, type, settings]);

  useEffect(() => {
    if (currentSettings && !isEqual(currentSettings, settings)) {
      updateSettings(featureId, currentSettings);
    }
  }, [currentSettings]);

  const settingWrapperStyle = `flex justify-between items-center mt-4`;
  const settingLabelStyle = `text-[#ADABB0] text-xs mr-4`;
  let title = '';
  switch (type) {
    case MapObjType.LINESTRING:
      title = 'Line Settings';
      break;
    case MapObjType.POINT:
      title = 'Pin Settings';
      break;
    case MapObjType.POLYGON:
      title = 'Polygon Settings';
      break;
    default:
  }
  if (closed) {
    return <></>;
  }
  return (
    <div className="mapObjSettings">
      <div className="p-4 rounded-3xl bg-[#3F3956] w-72">
        <div className="flex justify-between items-start mb-1">
          <p className="text-[16px] text-white pt-1 font-[500]">{title}</p>
          <Image
            src="/chat/close.svg"
            alt="Close"
            width={16}
            height={16}
            className="shrink-0 cursor-pointer"
            onClick={() => setClosed(true)}
          />
        </div>
        <input
          className="bg-[#3F3956] text-[#ADABB0] w-full border-none outline-none text-xs mb-4 font-semibold"
          placeholder="Add a name"
          type="text"
          value={inputName}
          onChange={handleNameChange}
        />
        <div className="w-full border-t border-[#51496E]" />
        {type !== MapObjType.POINT && (
          <div className={settingWrapperStyle}>
            <p className={settingLabelStyle}>Width</p>
            <RangeSlider
              values={[currentSettings?.user_width || 2]}
              setValues={handleWidthChange}
              min={1}
              max={30}
            />
          </div>
        )}
        <div className={settingWrapperStyle}>
          <p className={settingLabelStyle}> Color </p>
          <ColorPicker
            color={currentSettings?.user_color || ObjDefaultColors[type]}
            setColor={handleColorChange}
          />
        </div>
        {type !== MapObjType.POINT && (
          <div className={settingWrapperStyle}>
            <p className={settingLabelStyle}>
              {' '}
              {type === MapObjType.POLYGON ? 'Area' : 'Distance'}{' '}
            </p>
            <Toggle
              isToggled={currentSettings?.show_label || false}
              handleToggle={handleLabelToggle}
            />
          </div>
        )}
        <div className="w-full border-t border-[#51496E] mt-2" />
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            className="bg-[#3F3956] flex items-center text-xs text-white font-[500] "
            id="delete-button"
            aria-expanded="true"
            aria-haspopup="true"
            onClick={handleDelete}
          >
            Delete
            <Image
              src="/chat/trash.svg"
              alt="Trash"
              width={16}
              height={16}
              className="shrink-0 cursor-pointer ml-2"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapObjSettings;
