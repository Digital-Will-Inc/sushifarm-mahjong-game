import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document()
{
  return (
    <Html lang="en">
      <Head title="Sushi card matching">
        <title>Sushi Tower</title>
        <Script
          src="https://storage.googleapis.com/cdn-wortal-ai/v2/wortal-core.js"
          strategy="beforeInteractive"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/assets/sushi/10.png" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
