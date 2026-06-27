export default function Achievements({ streak }) {
  return (
    <div className="card">
      <h3>Achievements</h3>

      {streak >= 7 && <p>🔥 7 Day Streak Badge</p>}
      {streak >= 30 && <p>🏆 30 Day Streak Badge</p>}
      {streak >= 100 && <p>💎 100 Days Master</p>}
    </div>
  );
}