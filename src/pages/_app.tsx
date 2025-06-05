import React from "react";
import { GameProvider } from "src/context/gameContext";
import "src/styles/globals.css";

export default function App({ Component, pageProps }: any)
{
  return (
    <GameProvider>
      <React.StrictMode>
        <Component {...pageProps} />
      </React.StrictMode>
    </GameProvider>
  );
}
