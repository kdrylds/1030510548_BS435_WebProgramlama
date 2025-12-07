import { useState, useEffect, useRef } from "react";
import "./HardMode.css";
import { pickHardSet, type GameImage } from "../../../utils/imageLoader";
import FailOverlay from "../../../components/FailOverlay/FailOverlay";
import type { SettingsData } from "../../../utils/settingsConfig";
import { saveScore } from "../../../utils/storage";

interface HardModeProps {
  onExit: () => void;
  settings: SettingsData;
}

const ROUNDS = 5;
const START_TIME = 30;

const HardMode = ({ onExit, settings }: HardModeProps) => {
  const [images, setImages] = useState<GameImage[]>(() => pickHardSet());
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(START_TIME);
  const [message, setMessage] = useState<string>("");
  const [finished, setFinished] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [showFail, setShowFail] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setLoadedCount(0);
  }, [images]);

  const resetTimer = () => {
    setTimeLeft(START_TIME);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  const loadNextRound = () => {
    if (round >= ROUNDS) {
      setFinished(true);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    setRound((r) => r + 1);
    setImages(pickHardSet());
    setSelectedIndex(null);
    setMessage("");
  };

  const handleTimeout = () => {
    if (selectedIndex !== null || finished || showFail) return;
    setMessage("Süre doldu!");
    if (score > 0) {
      saveScore("hard", settings.playerName || "Anonymous", score);
    }
    setShowFail(true);
  };

  const handleImageClick = (index: number) => {
    if (selectedIndex !== null || finished || showFail) return;
    setSelectedIndex(index);
    const chosen = images[index];
    const aiOne = images.find((img) => img.isAI);
    const correct = Boolean(chosen?.isAI);
    if (correct) {
      setScore((s) => s + 50);
      setMessage("Doğru!");
      setTimeout(loadNextRound, 1200);
    } else {
      setMessage(aiOne ? `Yanlış. AI görseli ${images.indexOf(aiOne) + 1}. sıradaydı.` : "Yanlış.");
      if (score > 0) {
        saveScore("hard", settings.playerName || "Anonymous", score);
      }
      setShowFail(true);
    }
  };

  const timerClass = timeLeft <= 5 ? "timer-warning" : "";

  return (
    <div className={`hard-mode-overlay theme-${settings.theme}`}>
      <div className="hard-mode-container">
        <div className="game-header">
          <div className="round-info">Round {round}/{ROUNDS}</div>
          <div className={`timer ${timerClass}`}>⏱ {timeLeft}s</div>
          <div className="score-info">Score: {score}</div>
          <button onClick={onExit} className="exit-btn">Exit</button>
        </div>
        
        <div className="instruction">
          Which image is AI-generated? <span className="timer-hint">(Hurry!)</span>
        </div>
        
        <div className="game-grid-wrapper">
          {!(images.length > 0 && loadedCount >= images.length) && (
            <div className="skeleton-layer">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="image-card skeleton" />
              ))}
            </div>
          )}

          <div className={`images-grid ${!(images.length > 0 && loadedCount >= images.length) ? "hidden-grid" : ""}`}>
            {images.map((img, idx) => (
              <div
                key={idx}
                className={`image-card ${selectedIndex === idx ? "selected" : ""}`}
                onClick={() => handleImageClick(idx)}
              >
                <img
                  src={img.src}
                  alt={`Option ${idx + 1}`}
                  onLoad={() => setLoadedCount((c) => c + 1)}
                  onError={() => setLoadedCount((c) => c + 1)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="instruction">{message || (finished ? "Oyun bitti" : "")}</div>
      </div>

      {showFail && (
        <FailOverlay
          score={score}
          onRetry={() => {
            if (timerRef.current) clearInterval(timerRef.current);
            setShowFail(false);
            setSelectedIndex(null);
            setMessage("");
            setScore(0);
            setRound(1);
            setFinished(false);
            setTimeLeft(START_TIME);
            setImages(pickHardSet());
            onExit();
          }}
        />
      )}
    </div>
  );
};

export default HardMode;
