import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback
} from "react";
import { User, CardNode, Round, LeaderboardUser } from "src/types/type";
import { useWortal } from "./wortalContext";

interface position
{
  x: number,
  y: number
}

interface layerCards
{
  array: position[],
  offset: number,
  array_size: number //cardboard array size for this layer
}

type ProgressBorderSettings = {
  strokeWidth: number;
  color: string;
  borderRadius: number;
  variant: 'rainbow' | 'glow' | 'pulse' | 'gradient';
  position: 'overlay' | 'behind' | 'inset';
};

const defaultProgressBorderSettings: ProgressBorderSettings = {
  strokeWidth: 20,
  color: "#FFD700",
  borderRadius: 36,
  variant: "rainbow",
  position: "behind"
};

type LeaderBoard = LeaderboardUser[];

type GameContextType = {
  currentRound: Round;
  bucket: CardNode[];
  additionalSlots: CardNode[];
  lives: number;
  cards: CardNode[];
  cardSize: number;
  leaderBoard: LeaderBoard;
  score: number;
  slotAvailablity: boolean;
  cardBoardWidth: number;
  rollbackAvailable: boolean;
  rollbackPressed: boolean;
  gameStarted: boolean;
  gameRestarted: boolean;
  topCards: CardNode[];
  hintCards: CardNode[];
  isHint: boolean;
  gameOver: boolean;
  maxBucket: number;
  showConfirmModal: boolean;
  currentUser: User | null;
  showEditModal: boolean;
  soundOff: boolean;
  musicOff: boolean;
  jokerClaimed: boolean;
  showSettingsModal: boolean;
  stackedScore: number;
  showGuide: boolean;
  layerNumber: number;
  loading: boolean;

  // New Wortal-specific properties
  gameplayActive: boolean;
  adPlaying: boolean;
  gameLoadingFinished: boolean;
  sdkInitialized: boolean;
  audioMutedForAd: boolean;

  setCardSize: (s: number) => void;
  setShowGuide: (f: boolean) => void;
  setStackedScore: (n: number) => void;
  setBGMusicTime: () => void;
  setShowSettingsModal: (f: boolean) => void;
  progressBorderSettings: ProgressBorderSettings;
  setProgressBorderSettings: (settings: ProgressBorderSettings) => void;
  removeJokerPair: (n: number) => void;
  setJokerClaimed: (f: boolean) => void;
  setMusicOff: (f: boolean) => void;
  setSoundOff: (f: boolean) => void;
  setShowEditModal: (f: boolean) => void;
  setShowConfirmModal: (f: boolean) => void;
  resetHintCards: () => void;
  setMaxBucketCount: (n: number) => void;
  handleHintSelected: () => void;
  setGameStarted: (f: boolean) => void;
  registerUser: (email: string, user: string) => Promise<void>;
  changeUserName: (email: string, user: string) => Promise<void>;
  restartGame: () => void;
  generateCards: (round: Round) => void;
  startNextRound: () => void;
  loseLife: () => void;
  sendScore: (score: number) => void;
  handleCardClick: (card: CardNode) => void;
  moveToAdditionalSlots: () => void;
  rollbackFromAdditionalSlots: () => void;
  setCards: (cards: CardNode[]) => void;
  setSlotAvailablity: (flag: boolean) => void;
  handleAdditionalCardClick: (card: CardNode) => void;
  setCardBoardWidth: (width: number) => void;
  fetchLeaderboard: () => Promise<void>;
  handleSave: () => Promise<void>;
  handleLoad: () => Promise<void>;

  // New Wortal-specific methods
  fireGameplayStart: () => void;
  fireGameplayStop: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  muteAudioForAd: () => void;
  unmuteAudioAfterAd: () => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: PropsWithChildren) =>
{
  const wortal = useWortal();
  const initialRound: Round = { roundNumber: 1, cardTypeNumber: 4, deepLayer: 3, difficulty: false, typeOffest: 0, totalCards: 12 };
  const [currentRound, setCurrentRound] = useState<Round>(initialRound);
  const [bucket, setBucket] = useState<CardNode[]>([]);
  const [additionalSlots, setAdditionalSlots] = useState<CardNode[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(1);
  const [cards, setCards] = useState<CardNode[]>([]);
  const [topCards, setTopCards] = useState<CardNode[]>([]);
  const [hintCards, setHintCards] = useState<CardNode[]>([]);
  const [tempCards, setTempCards] = useState<CardNode[]>([]);
  const [isHint, setIsHint] = useState(false);
  const [leaderBoard, setLeaderBoard] = useState<LeaderBoard>([]);
  const [slotAvailablity, setSlotAvailablity] = useState(true);
  const loseLifeCalledRef = useRef(false);
  const [cardBoardWidth, setCardBoardWidth] = useState(0);
  const [cardMatchingCount, setCardMatchingCount] = useState(3);
  const [rollbackAvailable, setRollbackAvailable] = useState(false);
  const [rollbackPressed, setRollbackPressed] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameRestarted, setGameRestarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [jokerClaimed, setJokerClaimed] = useState(false);
  const [highlighted, setHighlighted] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [soundOff, setSoundOff] = useState(false);
  const [musicOff, setMusicOff] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [maxBucket, setMaxBucketCount] = useState(7);
  const [backgroundMusic, setBackgroundMusic] = useState<HTMLAudioElement | null>(null);
  const [dropMusic, setDropMusic] = useState<HTMLAudioElement | null>(null);
  const [winMusic, setWinMusic] = useState<HTMLAudioElement | null>(null);
  const [loseMusic, setLoseMusic] = useState<HTMLAudioElement | null>(null);
  const [jokerMusic, setJokerMusic] = useState<HTMLAudioElement | null>(null);
  const [layerNumber, setLayerNumber] = useState(0);
  const [limit, setLimit] = useState(5);
  const [stackedScore, setStackedScore] = useState(0);
  const [cardSize, setCardSize] = useState(40);
  const [loading, setLoading] = useState(true);
  const [progressBorderSettings, setProgressBorderSettings] = useState<ProgressBorderSettings>(defaultProgressBorderSettings);
  const [gameInitialized, setGameInitialized] = useState(false);

  // New Wortal-specific state
  const [gameplayActive, setGameplayActive] = useState(false);
  const [adPlaying, setAdPlaying] = useState(false);
  const [gameLoadingFinished, setGameLoadingFinished] = useState(false);
  const [sdkInitialized, setSdkInitialized] = useState(false);
  const [audioMutedForAd, setAudioMutedForAd] = useState(false);
  const [gameplayStartFired, setGameplayStartFired] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Audio state backup for ad muting
  const [audioStateBeforeAd, setAudioStateBeforeAd] = useState({
    backgroundMusicVolume: 1,
    backgroundMusicPlaying: false,
    soundEnabled: true,
    musicEnabled: true
  });

  const TotalCardsType = 22;

  const [currentUser, setCurrentUser] = useState<User | null>({
    id: '1',
    email: 'local@player.com',
    username: 'Player',
    score: 0,
    lastRound: false
  });

  // Fire gameplay start event
  const fireGameplayStart = useCallback(() =>
  {
    if (!gameplayStartFired && !adPlaying && gameLoadingFinished)
    {
      setGameplayActive(true);
      setGameplayStartFired(true);

      if (wortal.isWortalAvailable)
      {
        window.Wortal.session.gameplayStart()
      }
    }
  }, [gameplayStartFired, adPlaying, gameLoadingFinished, currentRound.roundNumber, score, wortal.isWortalAvailable]);

  // Fire gameplay stop event
  const fireGameplayStop = useCallback(() =>
  {
    if (gameplayActive)
    {
      setGameplayActive(false);
      setGameplayStartFired(false);

      if (wortal.isWortalAvailable)
      {
        window.Wortal.session.gameplayStop()
      }
    }
  }, [gameplayActive, currentRound.roundNumber, score, gameOver, isPaused, wortal.isWortalAvailable]);

  // Pause game functionality
  const pauseGame = useCallback(() =>
  {
    if (gameplayActive && !isPaused)
    {
      setIsPaused(true);
      fireGameplayStop();

      // Pause background music
      if (backgroundMusic && !backgroundMusic.paused)
      {
        backgroundMusic.pause();
      }

      console.log('Game Paused');
    }
  }, [gameplayActive, isPaused, fireGameplayStop, backgroundMusic]);

  // Resume game functionality
  const resumeGame = useCallback(() =>
  {
    if (isPaused)
    {
      setIsPaused(false);
      fireGameplayStart();

      // Resume background music if it was playing and not muted
      if (backgroundMusic && !musicOff && !audioMutedForAd)
      {
        backgroundMusic.play().catch(console.error);
      }

      console.log('Game Resumed');
    }
  }, [isPaused, fireGameplayStart, backgroundMusic, musicOff, audioMutedForAd]);

  // Mute audio for ads
  const muteAudioForAd = useCallback(() =>
  {
    if (!audioMutedForAd)
    {
      // Store current audio state
      setAudioStateBeforeAd({
        backgroundMusicVolume: backgroundMusic?.volume || 1,
        backgroundMusicPlaying: backgroundMusic ? !backgroundMusic.paused : false,
        soundEnabled: !soundOff,
        musicEnabled: !musicOff
      });

      // Mute all audio elements
      [backgroundMusic, dropMusic, winMusic, loseMusic, jokerMusic].forEach(audio =>
      {
        if (audio)
        {
          audio.volume = 0;
          audio.pause();
          // Ensure any queued audio playback is cancelled
          audio.currentTime = 0;
        }
      });

      // Set global mute flag
      setAudioMutedForAd(true);
      setSoundOff(true);
      setMusicOff(true);
      console.log('All audio muted for ad');
    }
  }, [audioMutedForAd, backgroundMusic, dropMusic, winMusic, loseMusic, jokerMusic, setSoundOff, setMusicOff]);

  // Unmute audio after ads
  const unmuteAudioAfterAd = useCallback(() =>
  {
    if (audioMutedForAd)
    {
      // Restore all audio elements
      [backgroundMusic, dropMusic, winMusic, loseMusic, jokerMusic].forEach(audio =>
      {
        if (audio)
        {
          audio.volume = audioStateBeforeAd.backgroundMusicVolume;
          if (audio === backgroundMusic && audioStateBeforeAd.backgroundMusicPlaying && !musicOff)
          {
            audio.play().catch(console.error);
          }
        }
      });

      // Restore global audio state
      setAudioMutedForAd(false);
      setSoundOff(!audioStateBeforeAd.soundEnabled);
      setMusicOff(!audioStateBeforeAd.musicEnabled);
      console.log('All audio restored after ad');
    }
  }, [audioMutedForAd, backgroundMusic, dropMusic, winMusic, loseMusic, jokerMusic, audioStateBeforeAd, musicOff, setSoundOff, setMusicOff]);

  // Initialize game assets and Wortal SDK
  useEffect(() =>
  {
    const initializeGame = async () =>
    {
      try
      {
        setLoading(true);
        console.log('Starting game initialization...');

        // Initialize audio assets first
        const bg_audio = new Audio('./assets/audio/BG16.wav');
        const winAudio = new Audio('./assets/audio/win.wav');
        const dropAudio = new Audio('./assets/audio/drop.wav');
        const loseAudio = new Audio('./assets/audio/lose.wav');
        const jokerAudio = new Audio('./assets/audio/joker.mp3');

        setBackgroundMusic(bg_audio);
        setWinMusic(winAudio);
        setDropMusic(dropAudio);
        setLoseMusic(loseAudio);
        setJokerMusic(jokerAudio);

        // Wait for Wortal to be initialized
        if (wortal.isWortalAvailable && !wortal.isInitialized)
        {
          console.log('Initializing Wortal SDK...');
          await wortal.initializeWortal();
          setSdkInitialized(true);
          console.log('Wortal SDK initialized successfully');
        } else if (!wortal.isWortalAvailable)
        {
          setSdkInitialized(false);
          console.log('Wortal SDK not available - running in standalone mode');
        }

        // Initialize game data
        await registerUser();

        // Generate initial cards
        generateCards(initialRound);

        // Fetch leaderboard if available
        if (wortal.isWortalAvailable)
        {
          await fetchLeaderboard();
        }

        // Complete loading
        wortal.setLoadingProgress(100);
        console.log("[context] Wortal initialized and loading progress set to 100%");

        setLoading(false);
        setGameInitialized(true);
        setGameLoadingFinished(true);

        // Fire gameLoadingFinished event
        window.dispatchEvent(new CustomEvent('gameLoadingFinished', {
          detail: {
            timestamp: Date.now(),
            sdkInitialized: wortal.isWortalAvailable && wortal.isInitialized
          }
        }));

        console.log('Game loading finished event fired');

        // Start the game through Wortal
        if (wortal.isWortalAvailable)
        {
          await wortal.startGame();
          console.log('Wortal game started');
        }

      } catch (error)
      {
        console.error('Failed to initialize game:', error);
        setLoading(false);
        setGameInitialized(true);
        setGameLoadingFinished(true);
        setSdkInitialized(false);
      }
    };

    initializeGame();
  }, []);

  // Enhanced ad handling with proper audio management
  const showInterstitialAdWithAudioHandling = useCallback((placement: string, description?: string) =>
  {
    if (!wortal.isWortalAvailable) return;

    setAdPlaying(true);
    fireGameplayStop(); // Stop gameplay before ad

    window.Wortal.ads.showInterstitial(
      placement,
      description,
      () =>
      {
        console.log('Interstitial ad starting');
        muteAudioForAd();
      },
      () =>
      {
        console.log('Interstitial ad finished');
        unmuteAudioAfterAd();
        setAdPlaying(false);
      },
      () =>
      {
        console.log('Interstitial ad not shown');
        setAdPlaying(false);
      }
    );
  }, [wortal, fireGameplayStop, muteAudioForAd, unmuteAudioAfterAd]);

  const showRewardedAdWithAudioHandling = useCallback((description: string, onReward: () => void) =>
  {
    if (!wortal.isWortalAvailable) return;

    setAdPlaying(true);
    fireGameplayStop(); // Stop gameplay before ad

    window.Wortal.ads.showRewarded(description,
      () =>
      {
        muteAudioForAd();
        console.log('Rewarded ad starting');
      },
      () =>
      {
        unmuteAudioAfterAd();
        setAdPlaying(false);
        console.log('Rewarded ad finished');
      },
      () =>
      {
        unmuteAudioAfterAd();
        setAdPlaying(false);
        console.log('Rewarded ad dismissed');
      },
      () =>
      {
        onReward();
        console.log('Rewarded ad viewed - reward granted');
      },
      () =>
      {
        setAdPlaying(false);
        console.log('Rewarded ad not shown');
      }
    );
  }, [wortal, fireGameplayStop, muteAudioForAd, unmuteAudioAfterAd]);

  // Auto-fire gameplay start when game actually starts
  useEffect(() =>
  {
    if (gameStarted && gameLoadingFinished && !gameOver && !isPaused && !adPlaying)
    {
      fireGameplayStart();
    }
  }, [gameStarted, gameLoadingFinished, gameOver, isPaused, adPlaying, fireGameplayStart]);

  // Auto-fire gameplay stop when game ends or is paused
  useEffect(() =>
  {
    if (gameOver || isPaused)
    {
      fireGameplayStop();
    }
  }, [gameOver, isPaused, fireGameplayStop]);

  // Handle visibility change for pause/resume
  useEffect(() =>
  {
    const handleVisibilityChange = () =>
    {
      if (document.hidden && gameplayActive && !adPlaying)
      {
        pauseGame();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [gameplayActive, adPlaying, pauseGame]);

  // Prevent space bar and other controls during ads
  useEffect(() =>
  {
    const handleKeyDown = (event: KeyboardEvent) =>
    {
      if (adPlaying)
      {
        // Prevent all keyboard interactions during ads
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    };

    const handleClick = (event: MouseEvent) =>
    {
      if (adPlaying)
      {
        // Prevent clicks during ads (except on ad content)
        const target = event.target as HTMLElement;
        if (!target.closest('[data-ad-content]'))
        {
          event.preventDefault();
          event.stopPropagation();
          return false;
        }
      }
    };

    if (adPlaying)
    {
      document.addEventListener('keydown', handleKeyDown, true);
      document.addEventListener('click', handleClick, true);
    }

    return () =>
    {
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('click', handleClick, true);
    };
  }, [adPlaying]);

  // Rest of your existing useEffect hooks remain the same...
  useEffect(() =>
  {
    if (isHint && layerNumber == 0) handleHintSelected();
  }, [layerNumber])

  useEffect(() =>
  {
    const allCards: CardNode[] = [...cards, ...bucket];
    if (allCards.length === 1)
    {
      const newCards: CardNode[] = [];
      let lastcard = allCards[0];
      let secondCard: CardNode = { ...lastcard, id: lastcard.id + 1, zIndex: lastcard.zIndex + 2, state: "unavailable", parents: [lastcard] }
      if (lastcard.isInBucket)
      {
        secondCard.state = "available";
        secondCard.parents = [];
      }
      else newCards.push({ ...lastcard, zIndex: lastcard.zIndex + 3 });
      newCards.push(secondCard)
      newCards.push({ ...lastcard, id: lastcard.id + 2, zIndex: lastcard.zIndex + 1, state: "unavailable", parents: [secondCard] })
      setCards(newCards);
    }
  }, [cards])

  useEffect(() =>
  {
    if (isHint) setLayerNumber(1);
    else setLayerNumber(0);
  }, [isHint])

  useEffect(() =>
  {
    if (backgroundMusic)
    {
      backgroundMusic.loop = true;
      const handleLoop = () =>
      {
        if (backgroundMusic.currentTime > backgroundMusic.duration)
        {
          backgroundMusic.currentTime = 0;
        }
      };

      backgroundMusic.addEventListener('timeupdate', handleLoop);

      return () =>
      {
        backgroundMusic.removeEventListener('timeupdate', handleLoop);
      };
    }
  }, [backgroundMusic]);

  useEffect(() =>
  {
    if (backgroundMusic == null) return;
    if (musicOff || audioMutedForAd)
    {
      backgroundMusic.pause();
    } else if (!isPaused && !adPlaying)
    {
      backgroundMusic.play();
    }
  }, [musicOff, audioMutedForAd, isPaused, adPlaying, backgroundMusic])

  useEffect(() =>
  {
    if (currentUser && stackedScore > 50)
    {
      setStackedScore(0);
      sendScore(stackedScore);
    }
  }, [stackedScore])

  useEffect(() =>
  {
    if (cards.length > 0)
    {
      rearrangeCards();
    }
  }, [cardBoardWidth])

  const fetchLeaderboard = async () =>
  {
    if (!wortal.isWortalAvailable) return;

    try
    {
      const entries = await wortal.getLeaderboardEntries('global_leaderboard', 10, 0);
      const formattedEntries = entries.map((entry) => ({
        id: entry.player.id,
        username: entry.player.name || 'Anonymous',
        score: entry.score,
        rank: entry.rank,
        current_score: entry.score,
        email: '',
        isVIP: false,
        top_score: entry.score,
        wallet: ''
      }));
      setLeaderBoard(formattedEntries);
    } catch (error)
    {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const setBGMusicTime = () =>
  {
    if (backgroundMusic) backgroundMusic.currentTime = 59;
  }

  const registerUser = async (email: string = 'local@player.com', userName: string = 'Player') =>
  {
    if (wortal.isWortalAvailable && wortal.player)
    {
      setCurrentUser({
        id: wortal.player.id,
        email: email,
        username: wortal.player.name || userName,
        score: 0,
        lastRound: false
      });
    } else
    {
      setCurrentUser({
        id: '1',
        email: email,
        username: userName,
        score: 0,
        lastRound: false
      });
    }
  };

  const changeUserName = async (email: string, userName: string) =>
  {
    setCurrentUser((_prevUser) =>
    {
      return {
        ..._prevUser!,
        email: email,
        username: userName,
      }
    });
  };

  // Enhanced restart game with proper event handling
  const restartGame = () =>
  {
    if (gameStarted && wortal.isWortalAvailable)
    {
      fireGameplayStop(); // Fire stop before restart
      wortal.logLevelEnd(
        `round_${currentRound.roundNumber}`,
        score.toString(),
        false // Game was restarted, not completed
      );
    }

    if (backgroundMusic && !isPlaying && !musicOff && !audioMutedForAd)
    {
      backgroundMusic
        .play()
        .then(() =>
        {
          setIsPlaying(true);
        })
        .catch((err) =>
        {
          console.error('Failed to play audio:', err);
        });
    }

    setHighlighted(false);
    setGameOver(false);
    setGameStarted(true);
    setGameRestarted(false);
    setIsPaused(false);
    setBucket([]);
    setAdditionalSlots([]);
    setRollbackAvailable(false);
    setRollbackPressed(false);
    setSlotAvailablity(true);
    setLives(1);
    setScore(0);
    setMaxBucketCount(7);
    setCurrentRound(initialRound);
    generateCards(initialRound);
    registerUser(currentUser?.email!, currentUser?.username!);

    // Log new game start and fire gameplay start
    if (wortal.isWortalAvailable)
    {
      wortal.logLevelStart(`round_${initialRound.roundNumber}`);
    }
  };

  // Enhanced start next round with proper event handling
  const startNextRound = () =>
  {
    if (wortal.isWortalAvailable)
    {
      fireGameplayStop(); // Stop current round
      wortal.logLevelEnd(
        `round_${currentRound.roundNumber}`,
        score.toString(),
        true // Level was completed
      );
      wortal.logLevelUp(`round_${currentRound.roundNumber + 1}`);
    }

    setBucket([]);
    setAdditionalSlots([]);
    setRollbackAvailable(false);
    setRollbackPressed(false);
    setSlotAvailablity(true);
    const _cardTypeNumber = currentRound.difficulty === true ? currentRound.cardTypeNumber - 4 : Math.min(currentRound.cardTypeNumber + 2, TotalCardsType);
    const _deepLayer = currentRound.difficulty === true ? Math.max(currentRound.deepLayer - 3, 3) : (currentRound.roundNumber + 1) % 4 === 0 ? currentRound.deepLayer + 3 : currentRound.deepLayer;
    const _round: Round = {
      roundNumber: currentRound.roundNumber + 1,
      cardTypeNumber: _cardTypeNumber,
      deepLayer: _deepLayer,
      difficulty: currentRound.difficulty === true ? false : _cardTypeNumber * _deepLayer > 60 ? true : false,
      typeOffest: Math.floor(Math.random() * (TotalCardsType - _cardTypeNumber)),
      totalCards: _cardTypeNumber * _deepLayer
    }
    if (_round.roundNumber > 4) setMaxBucketCount(8);
    else setMaxBucketCount(7);

    setCurrentRound(_round);
    generateCards(_round);

    // Log new level start
    if (wortal.isWortalAvailable)
    {
      wortal.logLevelStart(`round_${_round.roundNumber}`);
    }

    // Show interstitial ad between rounds (optional)
    if (_round.roundNumber % 3 === 0)
    {
      showInterstitialAdWithAudioHandling('next', 'NextLevel');
    }
  };

  // Enhanced lose life with proper event handling
  const loseLife = () =>
  {
    fireGameplayStop(); // Stop gameplay when losing life

    const audio = new Audio('./assets/audio/lose.wav');
    !soundOff && !audioMutedForAd && audio.play();

    if (lives > 1)
    {
      setLives((prev) => prev - 1);
      startCurrentRound();
      // Offer rewarded ad for extra life
      if (wortal.isWortalAvailable)
      {
        showRewardedAdWithAudioHandling('Watch ad for extra life?', () =>
        {
          setLives((prev) => prev + 1);
        });
      }
    } else
    {
      setGameOver(true);
      if (wortal.isWortalAvailable)
      {
        wortal.logLevelEnd(
          `round_${currentRound.roundNumber}`,
          score.toString(),
          false // Level was not completed
        );
        // Show interstitial ad on game over
        showInterstitialAdWithAudioHandling('next', 'Game Over');
      }
    }
  };

  // All other existing methods remain the same...
  // (gcd, lcd, checkVIPStatus, shuffleCards, etc.)

  const gcd = (x: number, y: number): number =>
  {
    while (y !== 0)
    {
      const temp = y;
      y = x % y;
      x = temp;
    }
    return x;
  };

  const lcd = (x: number, y: number): number =>
  {
    return x * y / gcd(x, y);
  }

  const checkVIPStatus = async (wallet: string): Promise<boolean> =>
  {
    return new Promise((resolve) => setTimeout(() => resolve(Math.random() > 0.5), 1000));
  };

  const shuffleCards = (array: number[]) =>
  {
    for (let i = array.length - 1; i > 0; i--)
    {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const shuffleSignCards = (array: position[]) =>
  {
    for (let i = array.length - 1; i > 0; i--)
    {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const isOverlapping = (left1: number, left2: number, top1: number, top2: number,) =>
  {
    return Math.abs(left1 - left2) < cardSize && Math.abs(top1 - top2) < cardSize;
  };

  const generateCardsByLayer = (cardsAmount: number, layer: number, offset: number = 1): layerCards =>
  {
    const arraySize = Math.min(Math.floor(Math.sqrt(cardsAmount) + Math.min(4, offset)), 7);
    const n = arraySize * 2 - 1;
    const numberizedArray = Array.from({ length: n + 1 }, () => Array(n + 1).fill(0));
    let markedArray: position[] = [];

    const setMarkArray = (t: number, b: number) =>
    {
      numberizedArray[t][b] = 1;
      numberizedArray[t][b + 1] = 1;
      numberizedArray[t + 1][b] = 1;
      numberizedArray[t + 1][b + 1] = 1;
    };

    const checkArray = (s: number, l: number, es: number, el: number): boolean =>
    {
      for (let i = Math.max(0, s); i <= es; i++)
      {
        for (let j = Math.max(0, l); j <= el; j++)
        {
          if (numberizedArray[i][j] === 1) return false;
        }
      }
      return true;
    };

    const getNewPosition = (): position =>
    {
      let _tempArray: position[] = [...markedArray];
      while (_tempArray.length > 0)
      {
        const randomIndex = Math.floor(Math.random() * _tempArray.length);
        const selectedPosition = _tempArray[randomIndex];
        _tempArray.splice(randomIndex, 1);

        const signArray: position[] = [
          { x: -2, y: -2 },
          { x: 0, y: -2 },
          { x: 2, y: -2 },
          { x: -2, y: 0 },
          { x: 2, y: 0 },
          { x: -2, y: 2 },
          { x: 0, y: 2 },
          { x: 2, y: 2 },
        ];

        shuffleSignCards(signArray);

        for (const offset of signArray)
        {
          const left = selectedPosition.x + offset.x;
          const top = selectedPosition.y + offset.y;

          if (top >= 0 && top <= n - 1 && left >= 0 && left <= n - 1 && checkArray(top - 1, left - 1, top + 1, left + 1))
            return { x: left, y: top };
        }
      }
      return { x: -1, y: -1 };
    };

    const initial_x = Math.floor(Math.random() * (n - 1));
    const initial_y = Math.floor(Math.random() * (n - 1));
    setMarkArray(initial_y, initial_x);
    markedArray.push({ x: initial_x, y: initial_y });

    for (let i = 1; i < cardsAmount; i++)
    {
      const newPosition = getNewPosition();
      if (newPosition.x === -1)
      {
        return generateCardsByLayer(cardsAmount, layer, offset + 1);
      }
      setMarkArray(newPosition.y, newPosition.x);
      markedArray.push({ x: newPosition.x, y: newPosition.y });
    }
    const offsetSize = (cardBoardWidth - arraySize * cardSize) / 2;
    markedArray = markedArray.map((array) => ({ x: array.x * cardSize / 2, y: array.y * cardSize / 2 }));
    return { array: markedArray, offset: offsetSize, array_size: arraySize };
  };

  const resetHintCards = () =>
  {
    setIsHint(false);
    setTopCards([]);
    setHintCards([]);
    setTempCards([]);
  }

  const handleHintSelected = () =>
  {
    setIsHint(true);
    setLayerNumber((prev) => prev + 1);
    const _topCards = cards.filter((card) => card.state === 'available');
    setTopCards(_topCards);

    let _tempCards: CardNode[];
    if (tempCards.length === 0)
    {
      _tempCards = cards.filter((card) => !_topCards.some((topCard) => topCard.id === card.id));
      _tempCards = _tempCards.map((card) => ({
        ...card,
        parents: card.parents.filter((parent) => !_topCards.some((topCard) => topCard.id === parent.id))
      }))
    } else
    {
      _tempCards = tempCards.filter((card) => !hintCards.some((hintCard) => hintCard.id === card.id));
      _tempCards = _tempCards.map((card) => ({
        ...card,
        parents: card.parents.filter((parent) => !hintCards.some((hintCard) => hintCard.id === parent.id))
      }))
    }
    setTempCards(_tempCards);
    const _hintCards = _tempCards.filter((card) => card.state === 'unavailable' && card.parents.length == 0);
    if (_hintCards.length === 0) setLayerNumber(0);
    setHintCards(_hintCards);
  }

  const generateCards = (round: Round) =>
  {
    const { cardTypeNumber, deepLayer, difficulty, roundNumber, typeOffest, totalCards } = round;
    const generatedCards: CardNode[] = [];
    const allCards: number[] = [];
    const cardsPerLayer: number[] = [];
    let maxCardsLayer: number = 0;

    const addToGeneratedCards = (t: number, l: number, offset: number, layer: number, layer_array_size: number) =>
    {
      let parents = [];
      for (const card of generatedCards)
      {
        if (isOverlapping(card.left + card.offset, t + offset, card.top + card.offset, l + offset) && (card.zIndex > layer))
        {
          parents.push(card);
        }
      }
      const newCard: CardNode = {
        id: generatedCards.length,
        type: allCards[generatedCards.length],
        top: l,
        left: t,
        offset: offset,
        size: { width: cardSize, height: cardSize },
        zIndex: layer,
        parents,
        state: layer === deepLayer || parents.length === 0 ? "available" : "unavailable",
        array_size: layer_array_size,
        isInBucket: false,
        isInAdditionalSlot: false,
        highlight: false
      };
      generatedCards.push(newCard);
    }

    for (let i = 0; i < totalCards / cardMatchingCount; i++)
    {
      const type = i % cardTypeNumber + typeOffest;
      allCards.push(type);
      allCards.push(type);
      allCards.push(type);
    }

    for (let i = 0; i < deepLayer - 1; i++) cardsPerLayer.push(totalCards / deepLayer);
    difficulty ? cardsPerLayer.push(totalCards / deepLayer + 1) : cardsPerLayer.push(totalCards / deepLayer);
    for (let i = 0; i < Math.floor(deepLayer / 2); i++)
    {
      const _rand_amount = Math.min(Math.floor(Math.random() * Math.max(Math.min(totalCards / deepLayer, 10), 4)), 10);
      const pul_or_min = (Math.random() * 100) > 50;
      cardsPerLayer[i] += (pul_or_min ? 1 : -1) * _rand_amount;
      cardsPerLayer[deepLayer - i - 1] += (pul_or_min ? -1 : 1) * _rand_amount;

      if (maxCardsLayer < cardsPerLayer[deepLayer - i - 1]) maxCardsLayer = cardsPerLayer[i];
    }

    shuffleCards(allCards);
    shuffleCards(allCards);

    if (difficulty) allCards.splice(totalCards / 2, 0, -1);

    for (let layer = deepLayer - 1; layer >= 0; layer--)
    {
      const layerCards: layerCards = generateCardsByLayer(cardsPerLayer[layer], layer, 1);
      layerCards.array.forEach((card) =>
      {
        addToGeneratedCards(card.x, card.y, layerCards.offset, layer, layerCards.array_size);
      })
    }
    setCards(generatedCards);
    setSlotAvailablity(true);
  };

  const rearrangeCards = () =>
  {
    setCards((prevCards) =>
    {
      return prevCards.map((card) =>
      {
        const newOffset = (cardBoardWidth - card.array_size * cardSize) / 2;
        const old_size = card.size.width;
        const row = (card.top - card.offset) / old_size;
        const col = (card.left - card.offset) / old_size;
        return ({
          ...card,
          size: {
            width: cardSize,
            height: cardSize
          },
          top: newOffset + cardSize * row,
          left: newOffset + cardSize * col,
          offset: (cardBoardWidth - card.array_size * cardSize) / 2
        })
      })
    });
  }

  const moveToAdditionalSlots = () =>
  {
    setSlotAvailablity(false);
    setRollbackAvailable(false);
    setAdditionalSlots((prevSlots) =>
    {
      if (bucket.length > 0)
      {
        const firstThree = bucket.slice(0, Math.min(cardMatchingCount, bucket.length));
        const remainingBucket = bucket.slice(Math.min(cardMatchingCount, bucket.length));

        setBucket(remainingBucket);
        firstThree.forEach(card => card.isInAdditionalSlot = true);
        return [...prevSlots, ...firstThree];
      }
      return prevSlots;
    });
  };

  const rollbackFromAdditionalSlots = () =>
  {
    setRollbackPressed(true);

    if (bucket.length > 0)
    {
      const lastCardNode = bucket[bucket.length - 1];
      bucket.pop();

      setCards((prevCards) =>
      {
        const updatedCards = [...prevCards, lastCardNode];
        return updatedCards.map((card) =>
        {
          if (isOverlapping(card.left, lastCardNode.left, card.top, lastCardNode.top) && card.id != lastCardNode.id)
          {
            const updatedParents = [...card.parents, lastCardNode];
            return {
              ...card,
              state: "unavailable",
              parents: updatedParents
            }
          }
          return card;
        })
      });
    }
  };

  const startCurrentRound = () =>
  {
    setBucket([]);
    setAdditionalSlots([]);
    generateCards(currentRound);
  };

  const addToBucket = (card: CardNode) =>
  {
    setBucket((prevBucket) =>
    {
      let updatedBucket: CardNode[] = [...prevBucket, { ...card, isInBucket: true }];
      let jokerCardthere = false;
      let _highlighted = false;

      const typeCounts = updatedBucket.reduce((acc, curr) =>
      {
        acc[curr.type] = (acc[curr.type] || 0) + 1;
        if (curr.type == -1)
        {
          jokerCardthere = true;
          setJokerClaimed(true);
        }
        return acc;
      }, {} as Record<number, number>);

      for (const [typeId, count] of Object.entries(typeCounts))
      {
        if (count >= cardMatchingCount)
        {
          if (parseInt(typeId) === -1)
          {
            setScore((prevScore) => prevScore + 50);
            setStackedScore((prevScore) => prevScore + 50);
          } else
          {
            setScore((prevScore) => prevScore + 10);
            setStackedScore((prevScore) => prevScore + 10);
          }
          setRollbackAvailable(false);
          updatedBucket = updatedBucket.filter((card) => card.type !== parseInt(typeId));
        } else if (jokerCardthere && (count === cardMatchingCount - 1) && (parseInt(typeId) !== -1))
        {
          setHighlighted(true);
          _highlighted = true;
          updatedBucket = updatedBucket.map((card) =>
          {
            if (card.type === parseInt(typeId)) return { ...card, highlight: true };
            return card;
          });
        }
      }

      if (updatedBucket.length === maxBucket && !loseLifeCalledRef.current && !_highlighted)
      {
        loseLifeCalledRef.current = true;
        setTimeout(() =>
        {
          loseLife();
          loseLifeCalledRef.current = false;
        }, 1);
      }

      return updatedBucket;
    });
  };

  const sendScore = async (newScore: number) =>
  {
    if (!wortal.isWortalAvailable)
    {
      setStackedScore(0);
      return;
    }

    try
    {
      await wortal.setScore('global_leaderboard', newScore, `Round ${currentRound.roundNumber}`);
      wortal.logScore(newScore.toString());

      const currentData = await wortal.getPlayerData(['highScore', 'currentRound']);
      if (newScore > (currentData.highScore || 0))
      {
        await wortal.setPlayerData({
          ...currentData,
          highScore: newScore,
          currentRound: currentRound.roundNumber,
          lastPlayed: Date.now()
        });
      }

      setStackedScore(0);
    } catch (error)
    {
      console.error('Failed to send score:', error);
      setStackedScore(0);
    }
  };

  const removeJokerPair = (_type: number) =>
  {
    setBucket((prevCards) =>
    {
      setScore((prevScore) =>
      {
        const newScore = prevScore + 10;
        return newScore;
      });
      setStackedScore((prevScore) => prevScore + 10);
      setRollbackAvailable(false);

      const removedCards = prevCards.filter((card) => card.type !== _type && card.type !== -1);
      return removedCards.map((card) => ({ ...card, highlight: false }));
    })
    setHighlighted(false);
  }

  // Enhanced handle card click with audio management
  const handleCardClick = (card: CardNode) =>
  {
    if (highlighted || adPlaying) return; // Don't allow clicks during ads

    if (card.type > -1)
    {
      const audio = new Audio('./assets/audio/drop.wav');
      !soundOff && !audioMutedForAd && audio.play();
    } else
    {
      const audio = new Audio('./assets/audio/Joker.mp3');
      !soundOff && !audioMutedForAd && audio.play();
    }

    if (card.state == "available") setRollbackAvailable(true && !rollbackPressed);
    if (card.isInAdditionalSlot)
    {
      setAdditionalSlots((prevSlots) =>
      {
        const newSlots = prevSlots.filter((slotCard) => slotCard.id !== card.id);
        setBucket((prevBucket) =>
        {
          const updatedBucket = [...prevBucket, { ...card, isInAdditionalSlot: false }];
          return updatedBucket;
        });
        return newSlots;
      });
      return;
    }

    if (card.state !== "available")
    {
      return;
    }

    addToBucket(card);

    setCards((prevCards) =>
    {
      const updatedCards = prevCards.filter((c) => c.id !== card.id);

      return updatedCards.map((c) =>
      {
        if (c.parents.some((parent) => parent.id === card.id))
        {
          const updatedParents = c.parents.filter((parent) => parent.id !== card.id);

          if (updatedParents.length === 0)
          {
            return { ...c, state: "available", parents: updatedParents };
          }

          const allParentsAvailable = updatedParents.every((parent) => parent.state === "available");
          if (allParentsAvailable)
          {
            return { ...c, state: "unavailable", parents: updatedParents };
          }

          return { ...c, parents: updatedParents };
        }

        return c;
      });
    });
  };

  const handleAdditionalCardClick = (card: CardNode) =>
  {
    if (adPlaying) return; // Don't allow clicks during ads

    setAdditionalSlots((prevSlots) =>
    {
      const newSlots = prevSlots.filter((slotCard) => slotCard.id !== card.id);
      return newSlots;
    });
    card.isInAdditionalSlot = false;
    addToBucket(card);
  };

  const handleSave = async () =>
  {
    if (!wortal.isWortalAvailable)
    {
      const gameState = {
        currentRound,
        score,
        currentUser
      };
      localStorage.setItem('gameState', JSON.stringify(gameState));
      return;
    }

    try
    {
      const gameState = {
        currentRound,
        score,
        lives,
        bucket: bucket.map(card => ({ ...card, parents: [] })),
        additionalSlots: additionalSlots.map(card => ({ ...card, parents: [] })),
        cards: cards.map(card => ({ ...card, parents: [] })),
        currentUser,
        timestamp: Date.now()
      };

      await wortal.setPlayerData({
        savedGame: gameState
      });
      await wortal.flushPlayerData();

      console.log('Game saved to Wortal');
    } catch (error)
    {
      console.error('Failed to save game:', error);
    }
  };

  const handleLoad = async () =>
  {
    if (!wortal.isWortalAvailable)
    {
      const savedState = localStorage.getItem('gameState');
      if (savedState)
      {
        const { currentRound: savedRound, score: savedScore, currentUser: savedUser } = JSON.parse(savedState);
        setCurrentRound(savedRound);
        setScore(savedScore);
        setStackedScore(0);
        generateCards(savedRound);
        setGameStarted(true);
        setBucket([]);
        if (savedRound.roundNumber > 4) setMaxBucketCount(8);
        else setMaxBucketCount(7);
        setAdditionalSlots([]);
        setRollbackAvailable(false);
        setRollbackPressed(false);
        setSlotAvailablity(true);
        if (savedUser)
        {
          setCurrentUser(savedUser);
        }
      }
      return;
    }

    try
    {
      const data = await wortal.getPlayerData(['savedGame']);
      if (data.savedGame)
      {
        const gameState = data.savedGame;
        setCurrentRound(gameState.currentRound);
        setScore(gameState.score);
        setLives(gameState.lives);
        setStackedScore(0);

        generateCards(gameState.currentRound);
        setGameStarted(true);

        setBucket([]);
        if (gameState.currentRound.roundNumber > 4) setMaxBucketCount(8);
        else setMaxBucketCount(7);

        setAdditionalSlots([]);
        setRollbackAvailable(false);
        setRollbackPressed(false);
        setSlotAvailablity(true);

        if (gameState.currentUser)
        {
          setCurrentUser(gameState.currentUser);
        }

        console.log('Game loaded from Wortal');
      }
    } catch (error)
    {
      console.error('Failed to load game:', error);
    }
  };

  const value = useMemo(
    () => ({
      currentRound,
      bucket,
      additionalSlots,
      lives,
      gameRestarted,
      cards,
      cardSize,
      leaderBoard,
      score,
      slotAvailablity,
      cardBoardWidth,
      rollbackAvailable,
      rollbackPressed,
      gameStarted,
      topCards,
      hintCards,
      isHint,
      gameOver,
      maxBucket,
      showConfirmModal,
      currentUser,
      showEditModal,
      soundOff,
      musicOff,
      jokerClaimed,
      showSettingsModal,
      stackedScore,
      showGuide,
      layerNumber,
      loading,

      // New Wortal-specific values
      gameplayActive,
      adPlaying,
      gameLoadingFinished,
      sdkInitialized,
      audioMutedForAd,

      progressBorderSettings: progressBorderSettings,
      setProgressBorderSettings,
      setCardSize,
      setShowGuide,
      setStackedScore,
      setBGMusicTime,
      setShowSettingsModal,
      setJokerClaimed,
      setMusicOff,
      setSoundOff,
      setShowEditModal,
      setShowConfirmModal,
      resetHintCards,
      setMaxBucketCount,
      handleHintSelected,
      setGameStarted,
      registerUser,
      changeUserName,
      restartGame,
      generateCards,
      startNextRound,
      loseLife,
      sendScore,
      handleCardClick,
      moveToAdditionalSlots,
      rollbackFromAdditionalSlots,
      setCards,
      setSlotAvailablity,
      handleAdditionalCardClick,
      setCardBoardWidth,
      fetchLeaderboard,
      removeJokerPair,
      handleSave,
      handleLoad,

      // New Wortal-specific methods
      fireGameplayStart,
      fireGameplayStop,
      pauseGame,
      resumeGame,
      muteAudioForAd,
      unmuteAudioAfterAd,
    }),
    [
      loading,
      cardSize,
      layerNumber,
      showGuide,
      stackedScore,
      showSettingsModal,
      musicOff,
      jokerClaimed,
      currentUser,
      maxBucket,
      gameOver,
      progressBorderSettings,
      setProgressBorderSettings,
      showConfirmModal,
      showEditModal,
      soundOff,
      topCards,
      hintCards,
      isHint,
      gameStarted,
      gameRestarted,
      currentRound,
      bucket,
      additionalSlots,
      lives,
      cards,
      leaderBoard,
      score,
      slotAvailablity,
      cardBoardWidth,
      rollbackAvailable,
      rollbackPressed,
      gameplayActive,
      adPlaying,
      gameLoadingFinished,
      sdkInitialized,
      audioMutedForAd,
      fireGameplayStart,
      fireGameplayStop,
      pauseGame,
      resumeGame,
      muteAudioForAd,
      unmuteAudioAfterAd,
    ]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGameContext = () =>
{
  const context = useContext(GameContext);
  if (!context)
  {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};
