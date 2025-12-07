import { useState } from "react";
import { getTopScoresForMode, type GameMode } from "../../utils/storage";
import type { SettingsData } from "../../utils/settingsConfig";
import "./Leaderboard.css";

type Props = {
  settings: SettingsData;
  onClose: () => void;
};

export default function Leaderboard({ settings, onClose }: Props) {
  const [selectedMode, setSelectedMode] = useState<GameMode>("easy");
  const [, setRefresh] = useState(0);
  
  const topScores = getTopScoresForMode(selectedMode, 5);

  const medals = ["🥇", "🥈", "🥉"];

  const handleClearLeaderboard = () => {
    if (confirm("İdare butonu: Tüm skorları silmek istediğinizden emin misiniz?")) {
      localStorage.removeItem("game-leaderboard");
      setRefresh((r) => r + 1); // Re-render tetikle
    }
  };

  return (
    <div className={`leaderboard-overlay theme-${settings.theme}`}>
      <div className="leaderboard-container">
        <header className="leaderboard-header">
          <h2>LEADERBOARD</h2>
          <div className="header-actions">
            <button className="clear-btn" onClick={handleClearLeaderboard} title="Sıfırla (İdare)">
              🗑️
            </button>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>
        </header>

        <div className="mode-tabs">
          <button
            className={selectedMode === "easy" ? "active" : ""}
            onClick={() => setSelectedMode("easy")}
          >
            Easy
          </button>
          <button
            className={selectedMode === "normal" ? "active" : ""}
            onClick={() => setSelectedMode("normal")}
          >
            Normal
          </button>
          <button
            className={selectedMode === "hard" ? "active" : ""}
            onClick={() => setSelectedMode("hard")}
          >
            Hard
          </button>
        </div>

        <div className="leaderboard-list">
          {topScores.length === 0 ? (
            <div className="empty-state">No scores yet. Play to set a record!</div>
          ) : (
            topScores.map((entry, idx) => (
              <div key={idx} className="leaderboard-entry">
                <div className="rank">
                  {idx < 3 ? medals[idx] : idx + 1}
                </div>
                <div className="player-avatar">
                  {settings.avatarDataUrl ? (
                    <img src={settings.avatarDataUrl} alt="Avatar" />
                  ) : (
                    <div className="default-avatar">👤</div>
                  )}
                </div>
                <div className="player-name">{entry.playerName}</div>
                <div className="stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < Math.min(5, Math.floor(entry.score / 100)) ? "filled" : ""}>
                      ⭐
                    </span>
                  ))}
                </div>
                <div className="player-score">{entry.score}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
