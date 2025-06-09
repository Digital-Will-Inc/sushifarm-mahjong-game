import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
  useEffect,
  useRef
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
  const [loading, setLoading] = useState(false);
  const [progressBorderSettings, setProgressBorderSettings] = useState<ProgressBorderSettings>(defaultProgressBorderSettings);
  const TotalCardsType = 22;

  const [currentUser, setCurrentUser] = useState<User | null>({
    id: '1',
    email: 'local@player.com',
    username: 'Player',
    score: 0,
    lastRound: false
  });

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
    const bg_audio = new Audio('/assets/audio/BG16.wav');
    const winAudio = new Audio('/assets/audio/win.wav');
    const dropAudio = new Audio('/assets/audio/drop.wav');
    const loseAudio = new Audio('/assets/audio/lose.wav');
    const jokerAudio = new Audio('/assets/audio/joker.mp3');
    setBackgroundMusic(bg_audio);
    setWinMusic(winAudio);
    setDropMusic(dropAudio);
    setLoseMusic(loseAudio);
    setJokerMusic(jokerAudio);
  }, [])

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

      // Cleanup on unmount
      return () =>
      {
        backgroundMusic.removeEventListener('timeupdate', handleLoop);
      };
    }
  }, [backgroundMusic]);

  useEffect(() =>
  {
    if (backgroundMusic == null) return;
    if (musicOff)
    {
      backgroundMusic.pause();
    }
    else
    {
      backgroundMusic.play();
    }
  }, [musicOff])

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
      const formattedEntries = entries.map((entry) =>
      ({
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
        username: userName,
        score: 0,
        lastRound: false
      });

      if (wortal.player.isFirstPlay)
      {
        wortal.logTutorialStart('game_tutorial');
      }
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

  // Mock VIP status check
  const checkVIPStatus = async (wallet: string): Promise<boolean> =>
  {
    // Simulate a smart contract call
    return new Promise((resolve) => setTimeout(() => resolve(Math.random() > 0.5), 1000));
  };

  // Shuffle cards to randomize their position and parents
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

  // Function to check if a card overlaps with another card
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
        _tempArray.splice(randomIndex, 1); // Remove the selected position directly

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
    // const totalCards: number = Math.floor(0.6 * cardTypeNumber) * lcd(cardMatchingCount, deepLayer);

    const addToGeneratedCards = (t: number, l: number, offset: number, layer: number, layer_array_size: number) =>
    {
      let parents = [];
      // Check for overlap with other cards in the same layer and higher layers
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
        state: layer === deepLayer || parents.length === 0 ? "available" : "unavailable", // Cards in the deepest layer or those with no parents are available
        array_size: layer_array_size,
        isInBucket: false,
        isInAdditionalSlot: false,
        highlight: false
      };
      generatedCards.push(newCard);
    }

    // Step 1: Create a pool of cards with shuffled types
    for (let i = 0; i < totalCards / cardMatchingCount; i++)
    {
      const type = i % cardTypeNumber + typeOffest;
      allCards.push(type);
      allCards.push(type);
      allCards.push(type);
    }

    //step 2: generate cards count per layer
    for (let i = 0; i < deepLayer - 1; i++) cardsPerLayer.push(totalCards / deepLayer);
    difficulty ? cardsPerLayer.push(totalCards / deepLayer + 1) : cardsPerLayer.push(totalCards / deepLayer); // for Joker Card
    for (let i = 0; i < Math.floor(deepLayer / 2); i++)
    {
      const _rand_amount = Math.min(Math.floor(Math.random() * Math.max(Math.min(totalCards / deepLayer, 10), 4)), 10);
      const pul_or_min = (Math.random() * 100) > 50;
      cardsPerLayer[i] += (pul_or_min ? 1 : -1) * _rand_amount;
      cardsPerLayer[deepLayer - i - 1] += (pul_or_min ? -1 : 1) * _rand_amount;

      if (maxCardsLayer < cardsPerLayer[deepLayer - i - 1]) maxCardsLayer = cardsPerLayer[i];
    }

    // Step 3: Shuffle the cards to randomize their order

    shuffleCards(allCards);
    shuffleCards(allCards);

    if (difficulty) allCards.splice(totalCards / 2, 0, -1);    //Joker Card

    // Step 4: Generate the cards layer by layer
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

  // Move first three cards to additional slots
  const moveToAdditionalSlots = () =>
  {
    setSlotAvailablity(false);
    setRollbackAvailable(false);
    setAdditionalSlots((prevSlots) =>
    {
      if (bucket.length > 0)
      {
        const firstThree = bucket.slice(0, Math.min(cardMatchingCount, bucket.length));  // Get first 3 items
        const remainingBucket = bucket.slice(Math.min(cardMatchingCount, bucket.length));  // Get the remaining items after first 3

        // Update bucket state with the remaining items
        setBucket(remainingBucket);

        // Mark the moved cards as being in the additional slots
        firstThree.forEach(card => card.isInAdditionalSlot = true);

        return [...prevSlots, ...firstThree];  // Add the first 3 cards to the additional slots
      }
      return prevSlots;
    });
  };

  // Rollback cards from additional slots to the bucket
  const rollbackFromAdditionalSlots = () =>
  {
    setRollbackPressed(true);

    // Find the last `CardNode` item from the `bucket` array
    if (bucket.length > 0)
    {
      const lastCardNode = bucket[bucket.length - 1];

      // Remove the last item from the `bucket` array
      bucket.pop();

      // Add the last `CardNode` item to the `cards` array
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

  // Start the next round
  const startNextRound = () =>
  {
    setBucket([]);

    //additional features
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
  };

  const startCurrentRound = () =>
  {
    setBucket([]);
    setAdditionalSlots([]);
    generateCards(currentRound);
  };

  // Add card to the bucket
  const addToBucket = (card: CardNode) =>
  {
    setBucket((prevBucket) =>
    {
      let updatedBucket: CardNode[] = [...prevBucket, { ...card, isInBucket: true }];
      let jokerCardthere = false;
      let _highlighted = false;

      // Check for triplets in the bucket
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

      // If there is a triplet (three cards of the same type), remove them and add points
      for (const [typeId, count] of Object.entries(typeCounts))
      {
        if (count >= cardMatchingCount)
        {
          // Update the score for triplets
          if (parseInt(typeId) === -1)
          {
            setScore((prevScore) => prevScore + 50);
            setStackedScore((prevScore) => prevScore + 50);
          }
          else
          {
            setScore((prevScore) => prevScore + 10); // Award points for triplets
            setStackedScore((prevScore) => prevScore + 10);
          }
          setRollbackAvailable(false);

          // Remove 3 matching cards from the bucket
          updatedBucket = updatedBucket.filter((card) => card.type !== parseInt(typeId));
        } else if (jokerCardthere && (count === cardMatchingCount - 1) && (parseInt(typeId) !== -1))
        {
          // Highlight cards when jokerCardthere condition is met
          setHighlighted(true);
          _highlighted = true;
          updatedBucket = updatedBucket.map((card) =>
          {
            if (card.type === parseInt(typeId)) return { ...card, highlight: true };
            return card;
          });
        }
      }

      // Check for bucket overflow (7 cards limit)
      if (updatedBucket.length === maxBucket && !loseLifeCalledRef.current && !_highlighted)
      {
        loseLifeCalledRef.current = true; // Mark that loseLife is being called
        setTimeout(() =>
        {
          loseLife();
          loseLifeCalledRef.current = false; // Reset after timeout
        }, 1);
      }

      return updatedBucket;
    });
  };

  const loseLife = () =>
  {
    const audio = new Audio('/assets/audio/lose.wav');
    !soundOff && audio.play();

    if (lives > 1)
    {
      setLives((prev) => prev - 1);
      startCurrentRound();
    } else
    {
      setGameOver(true);
      // restartGame();
    }
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
      // Submit to Wortal leaderboard
      await wortal.setScore('global_leaderboard', newScore, `Round ${currentRound.roundNumber}`);

      // Log the score
      wortal.logScore(newScore.toString());

      // Save to Wortal player data
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
        const newScore = prevScore + 10; // Award points for triplets
        return newScore;
      });
      setStackedScore((prevScore) => prevScore + 10);

      setRollbackAvailable(false);

      // Remove 3 matching cards from the bucket
      const removedCards = prevCards.filter((card) => card.type !== _type && card.type !== -1);
      return removedCards.map((card) => ({ ...card, highlight: false }));
    })
    setHighlighted(false);
  }

  const restartGame = () =>
  {
    if (gameStarted && wortal.isWortalAvailable)
    {
      wortal.logLevelEnd(
        `round_${currentRound.roundNumber}`,
        score.toString(),
        false // Game was restarted, not completed
      );
    }
    if (backgroundMusic && !isPlaying && !musicOff)
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
  };

  // Handle card click
  const handleCardClick = (card: CardNode) =>
  {
    if (highlighted) return;
    if (card.type > -1)
    {
      const audio = new Audio('/assets/audio/drop.wav'); // Path to your audio file
      !soundOff && audio.play();
    } else
    {
      const audio = new Audio('/assets/audio/Joker.mp3'); // Path to your audio file
      !soundOff && audio.play();
    }

    if (card.state == "available") setRollbackAvailable(true && !rollbackPressed);
    if (card.isInAdditionalSlot)
    {
      setAdditionalSlots((prevSlots) =>
      {
        // Remove the clicked card from the additional slots
        const newSlots = prevSlots.filter((slotCard) => slotCard.id !== card.id);

        // Ensure the card is returned to the bucket
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

    // Add to the bucket
    addToBucket(card);

    // Remove the card from the board (cards state)
    setCards((prevCards) =>
    {
      const updatedCards = prevCards.filter((c) => c.id !== card.id);

      // Update the parents of the remaining cards
      return updatedCards.map((c) =>
      {
        if (c.parents.some((parent) => parent.id === card.id))
        {
          const updatedParents = c.parents.filter((parent) => parent.id !== card.id);

          // If the card has no parents left, set the state to "available"
          if (updatedParents.length === 0)
          {
            return { ...c, state: "available", parents: updatedParents };
          }

          // If there are still parents left, check if all are "available" 
          const allParentsAvailable = updatedParents.every((parent) => parent.state === "available");
          if (allParentsAvailable)
          {
            return { ...c, state: "unavailable", parents: updatedParents };
          }

          // If not all parents are available, leave the state unchanged but update parents
          return { ...c, parents: updatedParents };
        }

        // If the card doesn't have `card` as a parent, return it unchanged
        return c;
      });
    });
  };

  const handleAdditionalCardClick = (card: CardNode) =>
  {
    // Move the card back from the additional slots to the bucket
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
      // Fallback to localStorage
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
        bucket: bucket.map(card => ({ ...card, parents: [] })), // Simplify for storage
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
      // Fallback to localStorage
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

        // Generate new cards instead of loading old positions
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
      leaderBoard,
      isConnected: true,
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
      handleLoad
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
      rollbackPressed
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
