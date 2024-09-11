import React from 'react';
import { Range } from 'react-range';
import { IRenderTrackParams } from 'react-range/lib/types';

interface RangeSliderProps {
  values: number[];
  setValues: (values: number[]) => void;
  min: number;
  max: number;
}
interface ITrackBackground {
  min: number;
  max: number;
  values: number[];
  colors: string[];
}
function getTrackBackground({ values, colors, min, max }: ITrackBackground) {
  const progress = values
    .slice(0)
    .sort((a, b) => a - b)
    .map(value => ((value - min) / (max - min)) * 100);
  const middle = progress.reduce(
    (acc, point, index) => `${acc}, ${colors[index]} ${point}%, ${colors[index + 1]} ${point}%`,
    '',
  );
  return `linear-gradient(to right, ${colors[0]} 0%${middle}, ${colors[colors.length - 1]} 100%)`;
}

const RangeSlider: React.FC<RangeSliderProps> = ({ values, setValues, min, max }) => (
  <Range
    label="Select your value"
    step={1}
    min={min}
    max={max}
    values={values}
    onChange={(val: number[]) => setValues(val)}
    renderTrack={({ props, children }: IRenderTrackParams) => (
      <div
        role="button"
        tabIndex={0}
        onMouseDown={props.onMouseDown}
        onTouchStart={props.onTouchStart}
        className="w-full"
        style={props.style}
      >
        <div
          ref={props.ref}
          className="h-1 w-full rounded-full"
          style={{
            background: getTrackBackground({
              values,
              colors: ['white', '#1B1925'],
              min,
              max,
            }),
          }}
        >
          {children}
        </div>
      </div>
    )}
    renderThumb={({ props, isDragged }) => (
      <div
        {...props}
        className="w-3 h-3 bg-white rounded-full outline outline-4 outline-[#FFFFFF33] outline-solid"
      />
    )}
  />
);

export default RangeSlider;
