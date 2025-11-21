import React, { useEffect, useRef, useState } from "react";

export type ThemeKey = "neon" | "dark" | "retro";

export interface SettingsData {
  playerName: string;
  masterVolume: number; // 0..1
  musicOn: boolean;
  sfxOn: boolean;
  avatarDataUrl: string;
  theme: ThemeKey;
}

export const DEFAULT_SETTINGS: SettingsData = {
  playerName: "Player",
  masterVolume: 0.8,
  musicOn: true,
  sfxOn: true,
  avatarDataUrl: "",
  theme: "neon",
};

type Props = {
  initial: SettingsData;
  onSave: (s: SettingsData) => void;
  onClose: () => void;
  playClick?: () => void;
};

const Settings: React.FC<Props> = ({ initial, onSave, onClose, playClick }) => {
  const [form, setForm] = useState<SettingsData>(initial);
  const [fileLoading, setFileLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const pendingSaveRef = useRef(false);

  useEffect(() => setForm(initial), [initial]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    setFileLoading(true);
    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      setForm((prev) => {
        const updated = { ...prev, avatarDataUrl: dataUrl };
        // if user already clicked Save while uploading, perform save now
        if (pendingSaveRef.current) {
          pendingSaveRef.current = false;
          playClick?.();
          onSave(updated);
          // parent will close modal; no need to setSaving(false) here
        }
        return updated;
      });
      setFileLoading(false);
    };
    reader.onerror = () => {
      setFileLoading(false);
      pendingSaveRef.current = false;
      setSaving(false);
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    playClick?.();
    setForm(DEFAULT_SETTINGS);
  };

  const handleSaveClick = () => {
    playClick?.();
    // if file still loading, mark pending and show saving indicator
    if (fileLoading) {
      pendingSaveRef.current = true;
      setSaving(true);
      return;
    }
    setSaving(true);
    onSave(form);
    // parent will close modal; no need to setSaving(false) here
  };

  return (
    <div className="settings-overlay" role="dialog" aria-modal="true">
      <div className="settings-panel">
        <header className="settings-header">
          <h2>Settings</h2>
          <button
            className="close-btn"
            onClick={() => {
              playClick?.();
              onClose();
            }}
          >
            ✕
          </button>
        </header>

        <div className="settings-body">
          <label className="field">
            <span>Player Name</span>
            <input
              type="text"
              value={form.playerName}
              onChange={(e) => setForm({ ...form, playerName: e.target.value })}
              maxLength={24}
            />
          </label>

          <label className="field">
            <span>Master Volume: {Math.round(form.masterVolume * 100)}%</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={form.masterVolume}
              onChange={(e) => setForm({ ...form, masterVolume: Number(e.target.value) })}
            />
          </label>

          <label className="field toggle-row">
            <span>Music</span>
            <input
              type="checkbox"
              checked={form.musicOn}
              onChange={(e) => setForm({ ...form, musicOn: e.target.checked })}
            />
          </label>

          <label className="field toggle-row">
            <span>Sound Effects</span>
            <input
              type="checkbox"
              checked={form.sfxOn}
              onChange={(e) => setForm({ ...form, sfxOn: e.target.checked })}
            />
          </label>

          <label className="field">
            <span>Avatar</span>
            <input type="file" accept="image/*" onChange={handleFile} />
            {form.avatarDataUrl ? (
              <img src={form.avatarDataUrl} alt="avatar preview" className="avatar-preview" />
            ) : (
              <div className="avatar-placeholder">No avatar</div>
            )}
            {fileLoading && <div style={{ color: "#9bdcff", fontSize: 12 }}>Uploading...</div>}
          </label>

          <div className="field">
            <span>Theme</span>
            <div className="theme-grid">
              <label className={`theme-option ${form.theme === "neon" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="theme"
                  value="neon"
                  checked={form.theme === "neon"}
                  onChange={() => setForm({ ...form, theme: "neon" })}
                />
                <div className="theme-preview neon">NEON</div>
              </label>

              <label className={`theme-option ${form.theme === "dark" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={form.theme === "dark"}
                  onChange={() => setForm({ ...form, theme: "dark" })}
                />
                <div className="theme-preview dark">DARK</div>
              </label>

              <label className={`theme-option ${form.theme === "retro" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="theme"
                  value="retro"
                  checked={form.theme === "retro"}
                  onChange={() => setForm({ ...form, theme: "retro" })}
                />
                <div className="theme-preview retro">RETRO</div>
              </label>
            </div>
          </div>
        </div>

        <footer className="settings-footer">
          <button
            className="btn btn-secondary"
            onClick={() => {
              handleReset();
            }}
            disabled={saving}
          >
            Reset
          </button>
          <div style={{ width: 12 }} />
          <button
            className="btn btn-primary"
            onClick={handleSaveClick}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default Settings;