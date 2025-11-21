import { useState } from "react";
import type { SettingsData } from "../settingsConfig";

type ModeKey = "easy" | "normal" | "hard";

type Props = {
  visible: boolean;
  settings: SettingsData;
  onSelect: (mode: ModeKey) => void;
  onClose: () => void;
  playClick?: () => void;
};

export default function ModeSelect({ visible, settings, onSelect, onClose, playClick }: Props) {
  if (!visible) return null;

  const modes: { key: ModeKey; title: string; desc: string; subtitle: string; img?: string }[] = [
    {
      key: "easy",
      title: "Easy",
      subtitle: "3 images — find the AI-made one",
      desc: "Three images. One is AI-generated. No timer; good for practice.",
      img: new URL("../assets/kolay.png", import.meta.url).href,
    },
    {
      key: "normal",
      title: "Normal",
      subtitle: "5 images — casual mode",
      desc: "Five images. No timer. Test your eye against multiple options.",
      img: new URL("../assets/normal.png", import.meta.url).href,
    },
    {
      key: "hard",
      title: "Hard",
      subtitle: "5 images — timed challenge",
      desc: "Five images with a time limit. Speed + accuracy required.",
      img: new URL("../assets/zor.png", import.meta.url).href,
    },
  ];

  const [failed, setFailed] = useState<Record<ModeKey, boolean>>({
    easy: false,
    normal: false,
    hard: false,
  });

  return (
    <div className={`mode-modal theme-${settings.theme}`} role="dialog" aria-modal="true">
      {/* tema sınıfı outer ve panel'a uygulanıyor */}
      <div className={`mode-panel theme-${settings.theme}`}>
        <header className="mode-header">
          <h2>Select Mode</h2>
          <button className="close-btn" onClick={() => { playClick?.(); onClose(); }}>✕</button>
        </header>

        <div className="mode-grid">
          {modes.map((m) => (
            <button
              key={m.key}
              className={`mode-card theme-${settings.theme}`}
              onClick={() => {
                playClick?.();
                onSelect(m.key);
              }}
              aria-label={m.title}
              type="button"
            >
              <div className="mode-thumb">
                {!failed[m.key] && m.img ? (
                  <img
                    src={m.img}
                    alt={m.title}
                    className="mode-img"
                    onError={() => setFailed((p) => ({ ...p, [m.key]: true }))}
                  />
                ) : (
                  <div className="mode-img-fallback">
                    <div className="fallback-icon">🖼</div>
                    <div className="fallback-text">No image</div>
                  </div>
                )}
              </div>

              <div className="mode-body">
                <h3>{m.title}</h3>
                <div className="mode-sub">{m.subtitle}</div>
                <p className="mode-desc">{m.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}