import Head from 'next/head';
import fs from 'fs';
import path from 'path';

export default function Home({ htmlBody }) {
  return (
    <>
      <Head>
        <title>Cyber Jagruti — India Cybercrime Intelligence Portal (2020–2026 YTD)</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div id="cyber-jagruti-root" dangerouslySetInnerHTML={{ __html: htmlBody }} />
    </>
  );
}

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'index.html');
  const rawHtml = fs.readFileSync(filePath, 'utf8');
  
  // Extract body contents between <body...> and </body>
  const bodyMatch = rawHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let bodyContent = bodyMatch ? bodyMatch[1] : rawHtml;

  // Strip script tags from inner HTML body (since Next.js _document loads them securely)
  bodyContent = bodyContent.replace(/<script[\s\S]*?<\/script>/gi, '');

  return {
    props: {
      htmlBody: bodyContent
    }
  };
}
