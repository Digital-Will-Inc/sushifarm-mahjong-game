import React, {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useState,
    useCallback,
    useMemo
} from "react";

// Wortal SDK Types
declare global
{
    interface Window
    {
        Wortal: {
            // Core
            initializeAsync(): Promise<void>;
            startGameAsync(): Promise<void>;
            setLoadingProgress(progress: number): void;

            // Player
            player: {
                getID(): string;
                getName(): string | null;
                getPhoto(): string | null;
                isFirstPlay(): boolean;
                getDataAsync(keys: string[]): Promise<Record<string, any>>;
                setDataAsync(data: Record<string, any>): Promise<void>;
                flushDataAsync(): Promise<void>;
            };

            // Context
            context: {
                getId(): string;
                getType(): string;
                isSizeBetween(min: number, max: number): boolean;
                switchAsync(id: string): Promise<void>;
                createAsync(playerId: string): Promise<string>;
                chooseAsync(options?: any): Promise<string>;
                shareAsync(payload: any): Promise<void>;
            };

            // Leaderboard
            leaderboard: {
                getLeaderboardAsync(name: string): Promise<any>;
                getEntriesAsync(name: string, count: number, offset: number): Promise<any[]>;
                setScoreAsync(name: string, score: number, details?: string): Promise<any>;
                getPlayerEntryAsync(name: string): Promise<any>;
                getConnectedPlayersEntriesAsync(name: string): Promise<any[]>;
            };

            // Ads
            ads: {
                isAdBlocked(): boolean;
                showInterstitial(placement: string, description?: string, beforeAd?: () => void, afterAd?: () => void, noShow?: () => void): void;
                showRewarded(description: string, beforeAd: () => void, afterAd: () => void, adDismissed: () => void, adViewed: () => void, noShow?: () => void): void;
            };

            // Analytics
            analytics: {
                logLevelStart(level: string): void;
                logLevelEnd(level: string, score?: string, wasCompleted?: boolean): void;
                logLevelUp(level: string): void;
                logScore(score: string): void;
                logGameChoice(decision: string): void;
                logSocialInvite(placement: string): void;
                logSocialShare(placement: string): void;
                logPurchase(productID: string, details?: string): void;
                logPurchaseSubscription(productID: string, details?: string): void;
                logTutorialStart(tutorial: string): void;
                logTutorialEnd(tutorial: string, wasCompleted?: boolean): void;
            };

            // Tournament
            tournament: {
                getCurrentAsync(): Promise<any>;
                getAllAsync(): Promise<any[]>;
                postScoreAsync(score: number): Promise<void>;
                createAsync(initialScore: number, config: any, data: any): Promise<any>;
                shareAsync(payload: any): Promise<boolean>;
                joinAsync(tournamentID: string): Promise<void>;
            };

            // Achievements
            achievements: {
                getAchievementsAsync(): Promise<any[]>;
                unlockAchievementAsync(achievementName: string): Promise<void>;
            };

            // Session
            session: {
                getDevice(): string;
                getEntryPoint(): string;
                getEntryPointData(): any;
                getLocale(): string;
                getOrientation(): string;
                getPlatform(): string;
                getTrafficSource(): any;
                onOrientationChange(callback: (orientation: string) => void): void;
                setSessionData(data: any): void;
                getSessionData(): any;
                switchGameAsync(gameID: string, data?: any): Promise<void>;
                gameplayStart(): void;
                gameplayStop(): void;
            };
        };
    }
}

// Types
export interface WortalPlayer
{
    id: string;
    name: string | null;
    photo: string | null;
    isFirstPlay: boolean;
}

export interface LeaderboardEntry
{
    player: WortalPlayer;
    score: number;
    rank: number;
    details?: string;
    timestamp: number;
}

export interface TournamentData
{
    id: string;
    title: string;
    payload: any;
    endTime: number;
}

export interface AdCallbacks
{
    beforeAd?: () => void;
    afterAd?: () => void;
    adDismissed?: () => void;
    adViewed?: () => void;
    noShow?: () => void;
}

interface WortalContextType
{
    // Initialization
    isInitialized: boolean;
    isGameStarted: boolean;
    initializeWortal: () => Promise<void>;
    startGame: () => Promise<void>;
    setLoadingProgress: (progress: number) => void;

    // Player
    player: WortalPlayer | null;
    getPlayerData: (keys: string[]) => Promise<Record<string, any>>;
    setPlayerData: (data: Record<string, any>) => Promise<void>;
    flushPlayerData: () => Promise<void>;

    // Leaderboard
    getLeaderboard: (name: string) => Promise<any>;
    getLeaderboardEntries: (name: string, count?: number, offset?: number) => Promise<LeaderboardEntry[]>;
    setScore: (name: string, score: number, details?: string) => Promise<any>;
    getPlayerEntry: (name: string) => Promise<any>;

    // Ads
    isAdBlocked: boolean;
    showInterstitialAd: (placement: string, description?: string, callbacks?: AdCallbacks) => void;
    showRewardedAd: (description: string, callbacks: Required<Pick<AdCallbacks, 'beforeAd' | 'afterAd' | 'adDismissed' | 'adViewed'>> & Pick<AdCallbacks, 'noShow'>) => void;

    // Analytics
    logLevelStart: (level: string) => void;
    logLevelEnd: (level: string, score?: string, wasCompleted?: boolean) => void;
    logLevelUp: (level: string) => void;
    logScore: (score: string) => void;
    logGameChoice: (decision: string) => void;
    logTutorialStart: (tutorial: string) => void;
    logTutorialEnd: (tutorial: string, wasCompleted?: boolean) => void;

    // Tournament
    getCurrentTournament: () => Promise<TournamentData | null>;
    getAllTournaments: () => Promise<TournamentData[]>;
    postTournamentScore: (score: number) => Promise<void>;
    createTournament: (initialScore: number, config: any, data: any) => Promise<any>;
    shareTournament: (payload: any) => Promise<boolean>;
    joinTournament: (tournamentID: string) => Promise<void>;

    // Achievements
    getAchievements: () => Promise<any[]>;
    unlockAchievement: (achievementName: string) => Promise<void>;

    // Session
    device: string;
    platform: string;
    locale: string;
    orientation: string;
    entryPoint: string;
    getSessionData: () => any;
    setSessionData: (data: any) => void;

    // Context/Social
    shareGame: (payload: any) => Promise<void>;
    inviteFriends: () => Promise<void>;

    // Utilities
    isWortalAvailable: boolean;
    error: string | null;
}

const WortalContext = createContext<WortalContextType | undefined>(undefined);

export const WortalProvider = ({ children }: PropsWithChildren) =>
{
    const [isInitialized, setIsInitialized] = useState(false);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [player, setPlayer] = useState<WortalPlayer | null>(null);
    const [isAdBlocked, setIsAdBlocked] = useState(false);
    const [device, setDevice] = useState('');
    const [platform, setPlatform] = useState('');
    const [locale, setLocale] = useState('');
    const [orientation, setOrientation] = useState('');
    const [entryPoint, setEntryPoint] = useState('');
    const [error, setError] = useState<string | null>(null);

    const isWortalAvailable = !!(typeof window !== 'undefined' && window.Wortal);

    // Initialize Wortal SDK
    const initializeWortal = useCallback(async () =>
    {
        if (!isWortalAvailable)
        {
            setError('Wortal SDK not available');
            return;
        }

        try
        {
            await window.Wortal.initializeAsync();
            setIsInitialized(true);

            // Get player info
            const playerData: WortalPlayer = {
                id: window.Wortal.player.getID(),
                name: window.Wortal.player.getName(),
                photo: window.Wortal.player.getPhoto(),
                isFirstPlay: window.Wortal.player.isFirstPlay()
            };
            setPlayer(playerData);

            // Get session info
            setDevice(window.Wortal.session.getDevice());
            setPlatform(window.Wortal.session.getPlatform());
            setLocale(window.Wortal.session.getLocale());
            setOrientation(window.Wortal.session.getOrientation());
            // setEntryPoint(window.Wortal.session.getEntryPoint()); //uncomment later when building for wortal

            // Check ad blocker
            setIsAdBlocked(window.Wortal.ads.isAdBlocked());

            // Set up orientation change listener
            window.Wortal.session.onOrientationChange((newOrientation: string) =>
            {
                setOrientation(newOrientation);
            });

            console.log('Wortal initialized successfully');
        } catch (err)
        {
            console.error('Failed to initialize Wortal:', err);
            setError('Failed to initialize Wortal SDK');
        }
    }, [isWortalAvailable]);

    // Start game
    const startGame = useCallback(async () =>
    {
        if (!isWortalAvailable || !isInitialized) return;

        try
        {
            await window.Wortal.startGameAsync();
            setIsGameStarted(true);
            console.log('Game started successfully');
        } catch (err)
        {
            console.error('Failed to start game:', err);
            setError('Failed to start game');
        }
    }, [isWortalAvailable, isInitialized]);

    // Set loading progress
    const setLoadingProgress = useCallback((progress: number) =>
    {
        if (!isWortalAvailable) return;
        window.Wortal.setLoadingProgress(progress);
    }, [isWortalAvailable]);

    // Player data methods
    const getPlayerData = useCallback(async (keys: string[]) =>
    {
        if (!isWortalAvailable) return {};
        try
        {
            return await window.Wortal.player.getDataAsync(keys);
        } catch (err)
        {
            console.error('Failed to get player data:', err);
            return {};
        }
    }, [isWortalAvailable]);

    const setPlayerData = useCallback(async (data: Record<string, any>) =>
    {
        if (!isWortalAvailable) return;
        try
        {
            await window.Wortal.player.setDataAsync(data);
        } catch (err)
        {
            console.error('Failed to set player data:', err);
        }
    }, [isWortalAvailable]);

    const flushPlayerData = useCallback(async () =>
    {
        if (!isWortalAvailable) return;
        try
        {
            await window.Wortal.player.flushDataAsync();
        } catch (err)
        {
            console.error('Failed to flush player data:', err);
        }
    }, [isWortalAvailable]);

    // Leaderboard methods
    const getLeaderboard = useCallback(async (name: string) =>
    {
        if (!isWortalAvailable) return null;
        try
        {
            return await window.Wortal.leaderboard.getLeaderboardAsync(name);
        } catch (err)
        {
            console.error('Failed to get leaderboard:', err);
            return null;
        }
    }, [isWortalAvailable]);

    const getLeaderboardEntries = useCallback(async (name: string, count = 10, offset = 0): Promise<LeaderboardEntry[]> =>
    {
        if (!isWortalAvailable) return [];
        try
        {
            return await window.Wortal.leaderboard.getEntriesAsync(name, count, offset);
        } catch (err)
        {
            console.error('Failed to get leaderboard entries:', err);
            return [];
        }
    }, [isWortalAvailable]);

    const setScore = useCallback(async (name: string, score: number, details?: string) =>
    {
        if (!isWortalAvailable) return null;
        try
        {
            // return await window.Wortal.leaderboard.setScoreAsync(name, score, details);
        } catch (err)
        {
            console.error('Failed to set score:', err);
            return null;
        }
    }, [isWortalAvailable]);

    const getPlayerEntry = useCallback(async (name: string) =>
    {
        if (!isWortalAvailable) return null;
        try
        {
            return await window.Wortal.leaderboard.getPlayerEntryAsync(name);
        } catch (err)
        {
            console.error('Failed to get player entry:', err);
            return null;
        }
    }, [isWortalAvailable]);

    // Ad methods
    const showInterstitialAd = useCallback((placement: string, description?: string, callbacks?: AdCallbacks) =>
    {
        if (!isWortalAvailable || isAdBlocked)
        {
            callbacks?.noShow?.();
            return;
        }

        window.Wortal.ads.showInterstitial(
            placement,
            description,
            callbacks?.beforeAd,
            callbacks?.afterAd,
            callbacks?.noShow
        );
    }, [isWortalAvailable, isAdBlocked]);

    const showRewardedAd = useCallback((description: string, callbacks: Required<Pick<AdCallbacks, 'beforeAd' | 'afterAd' | 'adDismissed' | 'adViewed'>> & Pick<AdCallbacks, 'noShow'>) =>
    {
        if (!isWortalAvailable || isAdBlocked)
        {
            callbacks?.noShow?.();
            return;
        }

        window.Wortal.ads.showRewarded(
            description,
            callbacks.beforeAd,
            callbacks.afterAd,
            callbacks.adDismissed,
            callbacks.adViewed,
            callbacks.noShow
        );
    }, [isWortalAvailable, isAdBlocked]);

    // Analytics methods
    const logLevelStart = useCallback((level: string) =>
    {
        if (!isWortalAvailable) return;
        window.Wortal.analytics.logLevelStart(level);
    }, [isWortalAvailable]);

    const logLevelEnd = useCallback((level: string, score?: string, wasCompleted?: boolean) =>
    {
        if (!isWortalAvailable) return;
        window.Wortal.analytics.logLevelEnd(level, score, wasCompleted);
    }, [isWortalAvailable]);

    const logLevelUp = useCallback((level: string) =>
    {
        if (!isWortalAvailable) return;
        window.Wortal.analytics.logLevelUp(level);
    }, [isWortalAvailable]);

    const logScore = useCallback((score: string) =>
    {
        if (!isWortalAvailable) return;
        window.Wortal.analytics.logScore(score);
    }, [isWortalAvailable]);

    const logGameChoice = useCallback((decision: string) =>
    {
        if (!isWortalAvailable) return;
        window.Wortal.analytics.logGameChoice(decision);
    }, [isWortalAvailable]);

    const logTutorialStart = useCallback((tutorial: string) =>
    {
        if (!isWortalAvailable) return;
        window.Wortal.analytics.logTutorialStart(tutorial);
    }, [isWortalAvailable]);

    const logTutorialEnd = useCallback((tutorial: string, wasCompleted?: boolean) =>
    {
        if (!isWortalAvailable) return;
        window.Wortal.analytics.logTutorialEnd(tutorial, wasCompleted);
    }, [isWortalAvailable]);

    // Tournament methods
    const getCurrentTournament = useCallback(async (): Promise<TournamentData | null> =>
    {
        if (!isWortalAvailable) return null;
        try
        {
            return await window.Wortal.tournament.getCurrentAsync();
        } catch (err)
        {
            console.error('Failed to get current tournament:', err);
            return null;
        }
    }, [isWortalAvailable]);

    const getAllTournaments = useCallback(async (): Promise<TournamentData[]> =>
    {
        if (!isWortalAvailable) return [];
        try
        {
            return await window.Wortal.tournament.getAllAsync();
        } catch (err)
        {
            console.error('Failed to get tournaments:', err);
            return [];
        }
    }, [isWortalAvailable]);

    const postTournamentScore = useCallback(async (score: number) =>
    {
        if (!isWortalAvailable) return;
        try
        {
            await window.Wortal.tournament.postScoreAsync(score);
        } catch (err)
        {
            console.error('Failed to post tournament score:', err);
        }
    }, [isWortalAvailable]);

    const createTournament = useCallback(async (initialScore: number, config: any, data: any) =>
    {
        if (!isWortalAvailable) return null;
        try
        {
            return await window.Wortal.tournament.createAsync(initialScore, config, data);
        } catch (err)
        {
            console.error('Failed to create tournament:', err);
            return null;
        }
    }, [isWortalAvailable]);

    const shareTournament = useCallback(async (payload: any): Promise<boolean> =>
    {
        if (!isWortalAvailable) return false;
        try
        {
            return await window.Wortal.tournament.shareAsync(payload);
        } catch (err)
        {
            console.error('Failed to share tournament:', err);
            return false;
        }
    }, [isWortalAvailable]);

    const joinTournament = useCallback(async (tournamentID: string) =>
    {
        if (!isWortalAvailable) return;
        try
        {
            await window.Wortal.tournament.joinAsync(tournamentID);
        } catch (err)
        {
            console.error('Failed to join tournament:', err);
        }
    }, [isWortalAvailable]);

    // Achievement methods
    const getAchievements = useCallback(async () =>
    {
        if (!isWortalAvailable) return [];
        try
        {
            return await window.Wortal.achievements.getAchievementsAsync();
        } catch (err)
        {
            console.error('Failed to get achievements:', err);
            return [];
        }
    }, [isWortalAvailable]);

    const unlockAchievement = useCallback(async (achievementName: string) =>
    {
        if (!isWortalAvailable) return;
        try
        {
            await window.Wortal.achievements.unlockAchievementAsync(achievementName);
        } catch (err)
        {
            console.error('Failed to unlock achievement:', err);
        }
    }, [isWortalAvailable]);

    // Session methods
    const getSessionData = useCallback(() =>
    {
        if (!isWortalAvailable) return null;
        return window.Wortal.session.getSessionData();
    }, [isWortalAvailable]);

    const setSessionData = useCallback((data: any) =>
    {
        if (!isWortalAvailable) return;
        window.Wortal.session.setSessionData(data);
    }, [isWortalAvailable]);

    // Social methods
    const shareGame = useCallback(async (payload: any) =>
    {
        if (!isWortalAvailable) return;
        try
        {
            await window.Wortal.context.shareAsync(payload);
            window.Wortal.analytics.logSocialShare('game_end');
        } catch (err)
        {
            console.error('Failed to share game:', err);
        }
    }, [isWortalAvailable]);

    const inviteFriends = useCallback(async () =>
    {
        if (!isWortalAvailable) return;
        try
        {
            await window.Wortal.context.chooseAsync();
            window.Wortal.analytics.logSocialInvite('main_menu');
        } catch (err)
        {
            console.error('Failed to invite friends:', err);
        }
    }, [isWortalAvailable]);

    // Auto-initialize on mount
    useEffect(() =>
    {
        if (isWortalAvailable && !isInitialized)
        {
            initializeWortal();
        }
    }, [isWortalAvailable, isInitialized, initializeWortal]);

    const value = useMemo(() => ({
        // Initialization
        isInitialized,
        isGameStarted,
        initializeWortal,
        startGame,
        setLoadingProgress,

        // Player
        player,
        getPlayerData,
        setPlayerData,
        flushPlayerData,

        // Leaderboard
        getLeaderboard,
        getLeaderboardEntries,
        setScore,
        getPlayerEntry,

        // Ads
        isAdBlocked,
        showInterstitialAd,
        showRewardedAd,

        // Analytics
        logLevelStart,
        logLevelEnd,
        logLevelUp,
        logScore,
        logGameChoice,
        logTutorialStart,
        logTutorialEnd,

        // Tournament
        getCurrentTournament,
        getAllTournaments,
        postTournamentScore,
        createTournament,
        shareTournament,
        joinTournament,

        // Achievements
        getAchievements,
        unlockAchievement,

        // Session
        device,
        platform,
        locale,
        orientation,
        entryPoint,
        getSessionData,
        setSessionData,

        // Social
        shareGame,
        inviteFriends,

        // Utilities
        isWortalAvailable,
        error
    }), [
        isInitialized,
        isGameStarted,
        initializeWortal,
        startGame,
        setLoadingProgress,
        player,
        getPlayerData,
        setPlayerData,
        flushPlayerData,
        getLeaderboard,
        getLeaderboardEntries,
        setScore,
        getPlayerEntry,
        isAdBlocked,
        showInterstitialAd,
        showRewardedAd,
        logLevelStart,
        logLevelEnd,
        logLevelUp,
        logScore,
        logGameChoice,
        logTutorialStart,
        logTutorialEnd,
        getCurrentTournament,
        getAllTournaments,
        postTournamentScore,
        createTournament,
        shareTournament,
        joinTournament,
        getAchievements,
        unlockAchievement,
        device,
        platform,
        locale,
        orientation,
        entryPoint,
        getSessionData,
        setSessionData,
        shareGame,
        inviteFriends,
        isWortalAvailable,
        error
    ]);

    return (
        <WortalContext.Provider value={value}>
            {children}
        </WortalContext.Provider>
    );
};

export const useWortal = () =>
{
    const context = useContext(WortalContext);
    if (!context)
    {
        throw new Error("useWortal must be used within a WortalProvider");
    }
    return context;
};