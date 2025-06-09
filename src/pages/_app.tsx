import React from "react";
import { GameProvider } from "src/context/gameContext";
import { WortalProvider } from "src/context/wortalContext";
import "src/styles/globals.css";

export default function App({ Component, pageProps }: any)
{
  return (
    <WortalProvider>
      <GameProvider>
        <React.StrictMode>
          <Component {...pageProps} />
        </React.StrictMode>
      </GameProvider>
    </WortalProvider>
  );
}
