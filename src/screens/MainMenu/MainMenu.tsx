import "./MainMenu.css";
import type { SettingsData } from "../../utils/settingsConfig";
import Controls from "../../components/Controls/Controls";
import MetaInfo from "../../components/MetaInfo/MetaInfo";
import podiumImg from "../../assets/podium.png";

type Props = {
  settings: SettingsData;
  onPlay: () => void;
  onOpenSettings: () => void;
  onOpenLeaderboard: () => void;
};

export default function MainMenu({ settings, onPlay, onOpenSettings, onOpenLeaderboard }: Props) {
  return (
    <div className="main-menu">
      <button className="leaderboard-icon-btn" onClick={onOpenLeaderboard}>
        <img src={podiumImg} alt="Leaderboard" className="leaderboard-icon" />
        <span className="leaderboard-tooltip">Leaderboard</span>
      </button>
      <h1 className="title">⚡ AI DETECTION GAME ⚡</h1>
      <p className="subtitle">Are you ready to uncover the secrets?</p>
      <Controls onPlay={onPlay} onOpenSettings={onOpenSettings} />
      <MetaInfo settings={settings} />
    </div>
  );
}
