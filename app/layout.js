import './globals.css';
import { Montserrat, Playfair_Display, PT_Serif, Great_Vibes } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-playfair-display',
  display: 'swap',
});

const ptSerif = PT_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-pt-serif',
  display: 'swap',
});

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-great-vibes',
  display: 'swap',
});

export const viewport = {
  themeColor: '#4A3B32',
};

export const metadata = {
  title: 'Convite de Casamento - Danielly & Leonardo',
  description: 'Com a bênção de Deus, temos a alegria de convidar você para celebrar o nosso casamento! 23 de Agosto de 2026.',
  openGraph: {
    title: 'Convite de Casamento - Danielly & Leonardo',
    description: 'Com a bênção de Deus, temos a alegria de convidar você para celebrar o nosso casamento! 23 de Agosto de 2026.',
    images: ['https://iili.io/CK4MAZB.jpg'],
    url: 'https://danieleonardo.com.br',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${montserrat.variable} ${playfairDisplay.variable} ${ptSerif.variable} ${greatVibes.variable}`}>
      <head>
        <link rel="preload" as="image" href="/background.webp" />
        <link
          rel="preload"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          as="style"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          media="print"
          id="font-awesome-css"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var lnk = document.getElementById('font-awesome-css');
                if (lnk) {
                  if (lnk.sheet) {
                    lnk.media = 'all';
                  } else {
                    lnk.addEventListener('load', function() { this.media = 'all'; });
                  }
                }
              } catch (e) {}
            `
          }}
        />
      </head>
      <body className="bg-stone-200 selection:bg-[#B65B46] selection:text-white">
        {children}
      </body>
    </html>
  );
}
