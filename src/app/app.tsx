import type { AppProps } from 'next/app';
import { Catamaran } from 'next/font/google';
import 'init/axios.defaults';

import '@/theme/globals.css';

const catamaran = Catamaran({
  weight: ['400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-catamaran',
});

function App({ Component, pageProps }: AppProps) {
  return (
    <main className={`${catamaran.variable} font-sans text-dark`}>
      <Component {...pageProps} />
    </main>
  );
}

export default App;
