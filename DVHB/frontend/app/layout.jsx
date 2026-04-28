import Script from 'next/script';
import './globals.css';
import { Providers } from '@/app/providers';
import { GlobalRouteBar } from '@/components/GlobalRouteBar';

export const metadata = {
  title: 'DevHub Web - Marketplace de Softwares Empresariais',
  description: 'Encontre softwares empresariais de alto valor em um só lugar. Centralize a busca por soluções de estoque, farmácia, PDV, ERP e analytics com vendedores nacionais verificados.',
  keywords: 'software marketplace, ERP, PDV, analytics, soluções empresariais',
  authors: [{ name: 'DevHub' }],
  openGraph: {
    title: 'DevHub Web - Marketplace de Softwares Empresariais',
    description: 'Encontre softwares empresariais de alto valor em um só lugar.',
    url: 'https://devhub477.vercel.app',
    siteName: 'DevHub',
    images: [
      {
        url: 'https://devhub477.vercel.app/assets/logo.png', // assuming logo exists
        width: 1200,
        height: 630,
        alt: 'DevHub Logo',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevHub Web - Marketplace de Softwares Empresariais',
    description: 'Encontre softwares empresariais de alto valor em um só lugar.',
    images: ['https://devhub477.vercel.app/assets/logo.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700;900&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
        <Script
          id="tailwind-cdn"
          src="https://cdn.tailwindcss.com?plugins=forms,container-queries"
          strategy="beforeInteractive"
        />
        <Script
          id="tailwind-config"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html:
              "tailwind.config={darkMode:'class',theme:{extend:{colors:{primary:'#6b26d9','background-light':'#f7f6f8','background-dark':'#171220'},fontFamily:{display:['Inter','sans-serif']},borderRadius:{DEFAULT:'0.25rem',lg:'0.5rem',xl:'0.75rem',full:'9999px'}}}}",
          }}
        />
        <Script
          id="organization-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "DevHub",
              "url": "https://devhub477.vercel.app",
              "logo": "https://devhub477.vercel.app/assets/logo.png",
              "description": "Marketplace de softwares empresariais",
              "sameAs": [
                // add social links if any
              ]
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <Providers>
          <header className="site-header">
            <GlobalRouteBar />
          </header>
          <main className="app-content">
            {children}
          </main>
          <footer className="site-footer">
            <div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-semibold text-white">DevHub</p>
                <div className="footer-links text-slate-300">
                  <a href="/privacy">Privacidade</a>
                  <a href="/terms">Termos</a>
                  <a href="/contact">Contato</a>
                  <a href="/marketplace">Marketplace</a>
                </div>
              </div>
              <p className="text-slate-400">© {new Date().getFullYear()} DevHub. Todos os direitos reservados.</p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
