import './globals.css';

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
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Great+Vibes&family=Montserrat:wght@300;400;500;600;700&family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&family=Pinyon+Script&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className="bg-stone-200 selection:bg-[#B65B46] selection:text-white">
        {children}
      </body>
    </html>
  );
}
