import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang='en' data-theme='light'>
      <Head>
        <link rel='manifest' href='/manifest.json' />
        <link rel='apple-touch-icon' href='/pwa/app-icon-512.png'></link>
        <meta name='theme-color' content='#000' />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
