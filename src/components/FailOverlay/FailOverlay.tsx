import "./FailOverlay.css";

interface FailOverlayProps {
  score: number;
  onRetry: () => void;
}

export default function FailOverlay({ score, onRetry }: FailOverlayProps) {
  return (
    <div className="fail-overlay">
      <div className="fail-card">
        <div className="fail-emoji">💥</div>
        <h3>Yanlış seçim!</h3>
        <p className="fail-score">Skorun: {score}</p>
        <p className="fail-sub">Tekrar denemek için butona bas.</p>
        <button className="fail-btn" onClick={onRetry}>Tekrar dene</button>
      </div>
    </div>
  );
}
