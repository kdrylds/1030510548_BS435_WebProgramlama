import { useEffect, useState } from "react";
import "./NormalMode.css";
import { pickNormalSet, type GameImage } from "../../../utils/imageLoader";
import FailOverlay from "../../../components/FailOverlay/FailOverlay";
import type { SettingsData } from "../../../utils/settingsConfig";
import { saveScore } from "../../../utils/storage";

interface NormalModeProps {
  onExit: () => void;
  settings: SettingsData;
}

const ROUNDS = 5;
const NormalMode = ({ onExit, settings }: NormalModeProps) => {
  const [images, setImages] = useState<GameImage[]>(() => pickNormalSet());
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState<string>("");
  const [finished, setFinished] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [showFail, setShowFail] = useState(false);

  useEffect(() => {
    setLoadedCount(0);
  }, [images]);

  const loadNextRound = () => {
    if (round >= ROUNDS) {
      setFinished(true);
      return;
    }
    setRound((r) => r + 1);
    setImages(pickNormalSet());
    setSelectedIndex(null);
    setMessage("");
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
        saveScore("normal", settings.playerName || "Anonymous", score);
      }
      setShowFail(true);
    }
  };

  return (
    <div className={`normal-mode-overlay theme-${settings.theme}`}>
      <div className="normal-mode-container">
        <div className="game-header">
          <div className="round-info">Round {round}/{ROUNDS}</div>
          <div className="score-info">Score: {score}</div>
          <button onClick={onExit} className="exit-btn">Exit</button>
        </div>
        
        <div className="instruction">
          Which image is AI-generated?
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
            setShowFail(false);
            setSelectedIndex(null);
            setMessage("");
            setScore(0);
            setRound(1);
            setFinished(false);
            setImages(pickNormalSet());
            onExit();
          }}
        />
      )}
    </div>
  );
};

export default NormalMode;
