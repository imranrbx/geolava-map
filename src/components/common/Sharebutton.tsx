import { useState } from 'react';
import Image from 'next/image';
import { Rubik } from 'next/font/google';

const rubik = Rubik({
  subsets: ['latin'],
  display: 'swap',
});

const ShareButton = ({ disabled }: { disabled: boolean }) => {
  const [selected, setSelected] = useState(false);

  const onHandleClick = () => {
    setSelected(!selected);
  };

  return (
    <div className="">
      <div className="relative">
        <button
          className="flex py-2	px-4 justify-center items-center gap-2 shareButton"
          onClick={onHandleClick}
          type="button"
          disabled={disabled}
        >
          <Image
            width={24}
            height={24}
            src="/chat/share-users.svg"
            alt="Upload Button"
            color={selected ? '#080D23' : '#5A5E77'}
          />
          <span className={`text-white text-center font-geo-regular ${rubik.className}`}>
            Share
          </span>
        </button>
      </div>
    </div>
  );
};

export default ShareButton;
