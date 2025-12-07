import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import Settings from "./screens/Settings/Settings";
import MainMenu from "./screens/MainMenu/MainMenu";
import ModeSelect from "./screens/ModeSelect/ModeSelect";
import EasyMode from "./screens/Game/EasyMode/EasyMode";
import NormalMode from "./screens/Game/NormalMode/NormalMode";
import HardMode from "./screens/Game/HardMode/HardMode";
import Leaderboard from "./screens/Leaderboard/Leaderboard";
import AudioManager from "./audio/AudioManager";
import { saveSettingsSafely } from "./utils/storage";
import type { SettingsData } from "./utils/settingsConfig";
import { DEFAULT_SETTINGS } from "./utils/settingsConfig";

type ModeKey = "easy" | "normal" | "hard";

// use URL(...) to avoid Vite import resolution edge-cases
const videoBg = new URL("./assets/cyberpunk.mp4", import.meta.url).href;
const bgMusicUrl = new URL("./assets/bg-music.mp3", import.meta.url).href;
const clickSfxUrl = new URL("./assets/click.wav", import.meta.url).href;

const App: React.FC = () => {
  const [settings, setSettings] = useState<SettingsData>(DEFAULT_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);
  const [showModeSelect, setShowModeSelect] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [currentMode, setCurrentMode] = useState<ModeKey | null>(null);
  const audioRef = useRef<AudioManager | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("game-settings");
      if (raw) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(raw) });
    } catch {}
    audioRef.current = new AudioManager(bgMusicUrl, clickSfxUrl);
    audioRef.current.init();
    audioRef.current.setMasterVolume(DEFAULT_SETTINGS.masterVolume);
    audioRef.current.setMusic(DEFAULT_SETTINGS.musicOn);
    return () => audioRef.current?.dispose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    audioRef.current?.setMasterVolume(settings.masterVolume);
    audioRef.current?.setMusic(settings.musicOn);
  }, [settings.masterVolume, settings.musicOn]);

  const playClick = () => {
    if (settings.sfxOn) audioRef.current?.playClick();
  };

  const handleSave = async (s: SettingsData) => {
    playClick();
    const res = await saveSettingsSafely(s);
    setSettings((_) => ({ ...DEFAULT_SETTINGS, ...s, avatarDataUrl: res.stored?.avatarDataUrl ?? "" }));
    setShowSettings(false);
  };

  const handleOpenSettings = () => {
    playClick();
    // Settings açılırken localStorage'dan güncel veriyi oku
    try {
      const raw = localStorage.getItem("game-settings");
      if (raw) {
        const stored = JSON.parse(raw);
        setSettings((prev) => ({ ...prev, ...stored }));
      }
    } catch {}
    setShowSettings(true);
  };

  return (
    <div className={`app-container theme-${settings.theme}`}>
      <video className="background-video" autoPlay loop muted playsInline>
        <source src={videoBg} type="video/mp4" />
      </video>

      <div className="content">
        <MainMenu
          settings={settings}
          onPlay={() => {
            playClick();
            setShowModeSelect(true);
          }}
          onOpenSettings={() => {
            handleOpenSettings();
          }}
          onOpenLeaderboard={() => {
            playClick();
            setShowLeaderboard(true);
          }}
        />
      </div>

      {showSettings && (
        <Settings initial={settings} onSave={handleSave} onClose={() => setShowSettings(false)} playClick={playClick} />
      )}

      {showLeaderboard && (
        <Leaderboard settings={settings} onClose={() => setShowLeaderboard(false)} />
      )}

      {showModeSelect && (
        <ModeSelect
          visible={showModeSelect}
          settings={settings}
          playClick={playClick}
          onClose={() => setShowModeSelect(false)}
          onSelect={(mode) => {
            playClick();
            setCurrentMode(mode);
            setShowModeSelect(false);
          }}
        />
      )}

      {currentMode === "easy" && (
        <EasyMode settings={settings} playClick={playClick} onExit={() => setCurrentMode(null)} />
      )}

      {currentMode === "normal" && (
        <NormalMode settings={settings} onExit={() => setCurrentMode(null)} />
      )}

      {currentMode === "hard" && (
        <HardMode settings={settings} onExit={() => setCurrentMode(null)} />
      )}
    </div>
  );
};

export default App;
