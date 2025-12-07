import "./Controls.css";

type Props = {
  onPlay: () => void;
  onOpenSettings: () => void;
};

export default function Controls({ onPlay, onOpenSettings }: Props) {
  return (
    <div className="controls">
      <button className="btn btn-primary" onClick={onPlay}>▶ Play</button>
      <button className="btn btn-secondary" onClick={onOpenSettings}>⚙ Settings</button>
    </div>
  );
}
