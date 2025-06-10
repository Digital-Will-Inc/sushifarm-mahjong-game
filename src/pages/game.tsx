import React, { useEffect } from "react";
import { GamePage } from "src/components";

const Game: React.FC = () =>
{
  useEffect(() =>
  {
    const initializeWortal = async () =>
    {
      await window.Wortal.initializeAsync();
      window.Wortal.setLoadingProgress(100);
      await window.Wortal.startGameAsync();
    };

    initializeWortal();
  }, []); //runs once when component mounts

  return <GamePage />;
};

export default Game;