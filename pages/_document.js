import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="description" content="Cyber Jagruti: National Cyber Threat Intelligence & Spatial Risk Platform (2020–2026 YTD). Real-time telemetry, MHA I4C 1930 recovery models, and ISRO Bhuvan geospatial analysis." />
        <meta name="keywords" content="Cyber Jagruti, India Cybercrime, Threat Intelligence, ISRO Bhuvan, MHA I4C, CERT-In, Digital Arrest, Ransomware" />
        <meta name="author" content="M Tejas Yadav" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🛡️</text></svg>" />
        
        {/* Google Fonts: Inter */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

        {/* FontAwesome 6 Icons */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossOrigin="anonymous" referrerPolicy="no-referrer" />

        {/* Leaflet CSS */}
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossOrigin="" />

        {/* Tailwind CSS CDN */}
        <script src="https://cdn.tailwindcss.com"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                darkMode: 'class',
                theme: {
                  extend: {
                    fontFamily: {
                      sans: ['Inter', 'sans-serif'],
                      mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
                    }
                  }
                }
              };
            `
          }}
        />
      </Head>
      <body className="antialiased min-h-screen text-slate-900 bg-[#FAFAFA] dark:bg-[#000000] dark:text-zinc-100">
        <Main />
        <NextScript />

        {/* Third-Party Runtime Scripts */}
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" crossOrigin=""></script>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
        <script src="/india_states.js"></script>
        <script src="/app.js"></script>
      </body>
    </Html>
  );
}
