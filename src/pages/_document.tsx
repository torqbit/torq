import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";
import Document, { Head, Html, Main, NextScript } from "next/document";
import type { DocumentContext } from "next/document";
import React from "react";

export default function MyDocument() {
  return (
    <Html lang='en' data-theme='light'>
      <Head>
        <link rel='manifest' href='/manifest.json' />
        <link rel='apple-touch-icon' href='/favicon.ico'></link>
        <meta name='theme-color' content='#000' />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link href='https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;1,500&display=swap' rel='stylesheet'></link>
        <link href='https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css' rel='stylesheet'></link>
        <script src='https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js'></script>
        <script src='https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.js'></script>
        <script async src='https://www.googletagmanager.com/gtag/js?id=AW-16675115378'></script>

        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
        function gtag(){
        dataLayer.push(arguments);
        }
  gtag('js', new Date());

  gtag('config', 'AW-16675115378');`,
          }}></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KL4Z7XBR');`,
          }}></script>

        <script
          dangerouslySetInnerHTML={{
            __html: `
            gtag('event', 'conversion', {'send_to': 'AW-16675115378/d1JCCK3D6uAZEPKiqI8-'});`,
          }}></script>
      </Head>
      <body>
        <noscript
          dangerouslySetInnerHTML={{
            __html: `
            <iframe
            src='https://www.googletagmanager.com/ns.html?id=GTM-KL4Z7XBR'
            height='0'
            width='0'
            style={{ display: "none", visibility: "hidden" }}></iframe>`,
          }}></noscript>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const cache = createCache();
  const originalRenderPage = ctx.renderPage;
  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) =>
        (
          <StyleProvider cache={cache}>
            <App {...props} />
          </StyleProvider>
        ),
    });

  const initialProps = await Document.getInitialProps(ctx);
  const style = extractStyle(cache, true);
  return {
    ...initialProps,
    styles: (
      <>
        {initialProps.styles}
        <style dangerouslySetInnerHTML={{ __html: style }} />
      </>
    ),
  };
};
