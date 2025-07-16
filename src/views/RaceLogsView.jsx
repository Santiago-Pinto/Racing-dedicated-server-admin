import { useRaceLog } from '../context/RaceLogContext';

const EVENT_TYPES = [
  'State',
  'Impact',
  'Lap',
  'CutTrackStart',
  'CutTrackEnd',
];

function CounterBox({ title, counters }) {
  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, margin: 16, minWidth: 220 }}>
      <h3>{title}</h3>
      {EVENT_TYPES.map((type) => (
        <div key={type} style={{ margin: '8px 0' }}>
          <strong>{type}:</strong> {counters?.[type] || 0}
        </div>
      ))}
    </div>
  );
}

export default function RaceLogsView() {
  const { raceLog } = useRaceLog();

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>Race Logs</h2>
      {!raceLog && <div>No race log data available yet. Start a session from Dedicated Server Setup and wait for results.</div>}
      {raceLog && (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
            <CounterBox title="Qualifying Events" counters={raceLog.qualifying} />
            <CounterBox title="Race Events" counters={raceLog.race} />
          </div>
          <div style={{ marginTop: 32, fontSize: 18 }}>
            <div><strong>Player Final Position:</strong> {raceLog.position !== null ? raceLog.position : '-'}</div>
            <div><strong>Total Collision Damage:</strong> {raceLog.collisionStats.total}</div>
            <div><strong>Max Collision Damage:</strong> {raceLog.collisionStats.max}</div>
          </div>
        </>
      )}
    </div>
  );
} 