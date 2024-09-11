import { Rubik } from 'next/font/google';
import { useEffect, useState } from 'react';
import { useRoofPicture } from '@/hooks/useGeoAI';
import * as Slider from '@radix-ui/react-slider';
import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const rubik = Rubik({
  subsets: ['latin'],
  display: 'swap',
});

interface RoofConditionProps {
  roofCondition: number;
  wkt: string;
}

function RoofConditionAnswer({ roofCondition, wkt }: RoofConditionProps) {
  const { image } = useRoofPicture(wkt);
  const [blobURL, setBlobURL] = useState<string | null>(null);

  useEffect(() => {
    if (image) {
      setBlobURL(URL.createObjectURL(image));
    }
  }, [image]);

  return (
    <div className="flex flex-column gap-6 mt-4">
      <div className="w-5/12">
        {blobURL ? (
          <Image src={blobURL} width={500} height={500} alt="roof" className="border-4" />
        ) : (
          <Skeleton width={184} height={184} baseColor="#9D85FF" />
        )}
      </div>
      <div className="flex-row w-7/12">
        <div
          className={`flex-column font-geo-large gap-2 justify-between items-start ${rubik.className}`}
        >
          <span className="p-2"> Roof Score </span>
          <span className="roof-score"> {roofCondition}/10 </span>
        </div>
        <div className="gap-3 mt-3">
          <Slider.Root
            className="SliderRoot"
            value={[roofCondition]}
            max={10}
            min={0}
            step={1}
            disabled
          >
            <Slider.Track className="SliderTrack">
              <Slider.Range className="SliderRange" />
            </Slider.Track>
            <Slider.Thumb className="SliderThumb" aria-label="Volume" />
          </Slider.Root>
          <div className="flex flex-column justify-between font-geo-small text-[#CEC9DF]">
            <div>poor</div>
            <div>low</div>
            <div>good</div>
            <div>great</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoofConditionAnswer;
