import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import Settings from "./Settings";
import Controls from "./components/Controls";
import MetaInfo from "./components/MetaInfo";
import AudioManager from "./audio/AudioManager";
import { saveSettingsSafely } from "./utils/storage";
import type { SettingsData } from "./settingsConfig";
import { DEFAULT_SETTINGS } from "./settingsConfig";
import ModeSelect from "./components/ModeSelect";

// use URL(...) to avoid Vite import resolution edge-cases
const videoBg = new URL("./assets/cyberpunk.mp4", import.meta.url).href;
const bgMusicUrl = new URL("./assets/bg-music.mp3", import.meta.url).href;
const clickSfxUrl = new URL("./assets/click.wav", import.meta.url).href;

const App: React.FC = () => {
  const [settings, setSettings] = useState<SettingsData>(DEFAULT_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);
  const [showModeSelect, setShowModeSelect] = useState(false);
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
    // update in-memory settings with whatever got stored
    setSettings((_) => ({ ...DEFAULT_SETTINGS, ...s, avatarDataUrl: res.stored?.avatarDataUrl ?? "" }));
    setShowSettings(false);
  };

  return (
    <div className={`app-container theme-${settings.theme}`}>
      <video className="background-video" autoPlay loop muted playsInline>
        <source src={videoBg} type="video/mp4" />
      </video>

      <div className="content">
        <h1 className="title">⚡ ⚡</h1>
        <p className="subtitle">Are you ready to uncover the secrets?</p>

        <Controls
          onPlay={() => {
            playClick();
            setShowModeSelect(true);
          }}
          onOpenSettings={() => {
            playClick();
            setShowSettings(true);
          }}
        />

        <MetaInfo settings={settings} />
      </div>

      {showSettings && (
        <Settings initial={settings} onSave={handleSave} onClose={() => setShowSettings(false)} playClick={playClick} />
      )}

      {showModeSelect && (
        <ModeSelect
          visible={showModeSelect}
          settings={settings}
          playClick={playClick}
          onClose={() => setShowModeSelect(false)}
          onSelect={(mode) => {
            // seçime göre oyun başlatma logic'i buraya konacak
            console.log("Selected mode:", mode);
            setShowModeSelect(false);
            // TODO: route / start game with mode
          }}
        />
      )}
    </div>
  );
};

export default App;
