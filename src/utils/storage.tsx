import type { SettingsData } from "./settingsConfig";

export type GameMode = "easy" | "normal" | "hard";

export interface LeaderboardEntry {
  mode: GameMode;
  playerName: string;
  score: number;
  timestamp: number;
}

/** Simple image compressor (dataURL -> jpeg) */
export async function compressDataUrl(dataUrl: string, maxBytes = 150_000): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxDim = 512;
      const { width, height } = img;
      const scale = Math.min(1, maxDim / Math.max(width, height));
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(dataUrl);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      let quality = 0.92;
      const step = 0.08;
      const tryCompress = () => {
        const out = canvas.toDataURL("image/jpeg", quality);
        if (out.length <= maxBytes || quality <= 0.32) return resolve(out);
        quality -= step;
        setTimeout(tryCompress, 0);
      };
      tryCompress();
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

/** Save settings safely, try compressing avatar and fallback to removing avatar on quota errors */
export async function saveSettingsSafely(s: SettingsData) {
  const copy: SettingsData = { ...s };
  try {
    if (copy.avatarDataUrl && copy.avatarDataUrl.length > 200_000) {
      copy.avatarDataUrl = await compressDataUrl(copy.avatarDataUrl, 150_000);
    }
    localStorage.setItem("game-settings", JSON.stringify(copy));
    return { saved: true, stored: copy };
  } catch (err: any) {
    // quota exceeded -> drop avatar and retry
    try {
      const noAvatar = { ...copy, avatarDataUrl: "" };
      localStorage.setItem("game-settings", JSON.stringify(noAvatar));
      return { saved: true, stored: noAvatar, droppedAvatar: true };
    } catch {
      return { saved: false };
    }
  }
}

/** Get all leaderboard entries */
export function getLeaderboard(): LeaderboardEntry[] {
  try {
    const data = localStorage.getItem("game-leaderboard");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/** Save a new score to leaderboard */
export function saveScore(mode: GameMode, playerName: string, score: number) {
  try {
    const entries = getLeaderboard();
    entries.push({
      mode,
      playerName,
      score,
      timestamp: Date.now(),
    });
    // Keep top 100 scores only
    entries.sort((a, b) => b.score - a.score);
    const trimmed = entries.slice(0, 100);
    localStorage.setItem("game-leaderboard", JSON.stringify(trimmed));
  } catch {
    // Ignore quota errors
  }
}

/** Get top scores for a specific mode */
export function getTopScoresForMode(mode: GameMode, limit = 5): LeaderboardEntry[] {
  const all = getLeaderboard();
  return all
    .filter((e) => e.mode === mode)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}