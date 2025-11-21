
import type { SettingsData } from "../settingsConfig";

export default function MetaInfo({ settings }: { settings: SettingsData }) {
  return (
    <div className="meta">
      <span>Player: {settings.playerName}</span>
      {settings.avatarDataUrl ? (
        <img src={settings.avatarDataUrl} alt={`${settings.playerName} avatar`} className="meta-avatar" />
      ) : (
        <div className="meta-avatar meta-avatar--placeholder">No avatar</div>
      )}
    </div>
  );
}