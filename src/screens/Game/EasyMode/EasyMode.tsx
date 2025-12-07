import { useEffect, useState } from "react";
import "./EasyMode.css";
import type { SettingsData } from "../../../utils/settingsConfig";
import { pickEasySet, type GameImage } from "../../../utils/imageLoader";
import FailOverlay from "../../../components/FailOverlay/FailOverlay";
import { saveScore } from "../../../utils/storage";

type Props = {
  settings: SettingsData;
  onExit: () => void;
  playClick?: () => void;
};

export default function EasyMode({ settings, onExit, playClick }: Props) {
  const [images, setImages] = useState<GameImage[]>(() => pickEasySet());
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [result, setResult] = useState<string>("");
  const [loadedCount, setLoadedCount] = useState(0);
  const [score, setScore] = useState(0);
  const [showFail, setShowFail] = useState(false);

  useEffect(() => {
    // Yeni set geldiğinde yükleme sayacını sıfırla
    setLoadedCount(0);
  }, [images]);

  const loadNewSet = () => {
    setImages(pickEasySet());
    setSelectedImage(null);
    setResult("");
    setLoadedCount(0);
  };

  const handleImageClick = (id: number) => {
    if (selectedImage !== null || showFail) return; // aynı elde ikinci seçim olmasın
    playClick?.();
    setSelectedImage(id);

    const chosen = images.find((img) => img.id === id);
    const aiOne = images.find((img) => img.isAI);
    if (chosen?.isAI) {
      setScore((s) => s + 50);
      setResult("Doğru! AI görseli yakaladın.");
      setTimeout(loadNewSet, 1000);
    } else {
      setResult(aiOne ? `Yanlış. AI görseli Image ${aiOne.id} idi.` : "Yanlış.");
      if (score > 0) {
        saveScore("easy", settings.playerName || "Anonymous", score);
      }
      setShowFail(true);
    }
  };

  const allLoaded = images.length > 0 && loadedCount >= images.length;

  return (
    <div className={`easy-mode theme-${settings.theme}`}>
      <div className="game-container">
        <header className="game-header">
          <h2>Easy Mode</h2>
          <div className="score">Score: {score}</div>
          <button className="close-btn" onClick={() => { playClick?.(); onExit(); }}>✕</button>
        </header>

        <div className="game-info">
          <p>Find the AI-generated image among 3 images. No time limit!</p>
        </div>

        <div className="game-grid-wrapper">
          {!allLoaded && (
            <div className="skeleton-layer">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="game-image-card skeleton" />
              ))}
            </div>
          )}

          <div className={`game-grid ${!allLoaded ? "hidden-grid" : ""}`}>
            {images.map((img) => (
              <button
                key={img.id}
                className={`game-image-card ${selectedImage === img.id ? 'selected' : ''}`}
                onClick={() => handleImageClick(img.id)}
              >
                <img
                  src={img.src}
                  alt={`Image ${img.id}`}
                  onLoad={() => setLoadedCount((c) => c + 1)}
                  onError={() => setLoadedCount((c) => c + 1)}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="game-status">
          {selectedImage !== null && <p>{result}</p>}
          <div className="game-actions">
            <button className="retry-btn" onClick={() => { playClick?.(); onExit(); }}>Çık</button>
          </div>
        </div>
      </div>

      {showFail && (
        <FailOverlay
          score={score}
          onRetry={() => {
            setShowFail(false);
            setSelectedImage(null);
            setResult("");
            setScore(0);
            loadNewSet();
            onExit();
          }}
        />
      )}
    </div>
  );
}
