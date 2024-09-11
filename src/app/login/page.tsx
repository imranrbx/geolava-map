'use client';

import { redirect, useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { AuthContext } from '@/context/authContext';
import { Rubik } from 'next/font/google';
import Google from '@/root/public/Google';
import Image from 'next/image';
import Link from 'next/link';

const rubik = Rubik({
  subsets: ['latin'],
  display: 'swap',
});

function LoginPage() {
  const { handleGoogleLogin, user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      redirect('/');
    }
  });

  const handleGoogle = async () => {
    await handleGoogleLogin();
    router.push('/');
  };
  return (
    <Link id="LoginLink" href="/login">
      <div className="absolute overflow-hidden inset-0 bg-mapBg flex flex-row">
        <div className="basis-1/2 content-center px-20">
          <div className="md:flex">
            <div className="md:shrink-0">
              <Image
                height={20}
                width={80}
                className="flex-shrink-0 max-w-[106px] max-h-[27px]"
                src="/chat/geolavalogo.svg"
                alt="AI Logo"
                onClick={() => redirect('https://geolava.com')}
              />
              <div className="image-container mt-6 my-4">
                <Image height={48} width={48} className="mr-4" src="/chat/globe.svg" alt="Globe" />{' '}
                <Image height={48} width={48} src="/chat/H4.svg" alt="H4" />{' '}
              </div>
            </div>
          </div>
          <div className={`${rubik.className} flex-shrink-0 text-4xl text-white`}>
            Ask anything about a Location
          </div>
          <div className="flex mt-8">
            <button
              onClick={handleGoogle}
              type="button"
              className="flex items-center justify-center w-full bg-white hover:bg-gray-100 font-medium leading-5 py-2 px-4 gap-1 rounded-full"
            >
              <Google />
              <span className={`${rubik.className}`}>Sign in with Google</span>
            </button>
          </div>
        </div>
        <div className="basis-1/2 ">
          <Image
            height={0}
            width={0}
            className="top-0 left-0 w-full h-full object-cover"
            src="/chat/Map.svg"
            alt="Sample Map"
          />
        </div>
      </div>
    </Link>
  );
}

export default LoginPage;
