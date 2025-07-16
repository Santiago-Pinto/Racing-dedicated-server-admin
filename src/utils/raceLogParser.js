// Encapsulated parser for race log events

const EVENT_TYPES = [
  'State',
  'Impact',
  'Lap',
  'CutTrackStart',
  'CutTrackEnd',
];

export function parseRaceLog(json, playerSteamId) {
  // Find the latest finished session
  const history = json.stats?.history || [];
  const session = [...history].reverse().find((h) => h.finished);
  if (!session) {
    return {
      qualifying: {},
      race: {},
      position: null,
      collisionStats: { total: 0, max: 0 },
      finished: false,
    };
  }

  // Find player participant id
  let playerId = null;
  for (const [pid, p] of Object.entries(session.participants || {})) {
    if (p.SteamID && String(p.SteamID) === String(playerSteamId)) {
      playerId = pid;
      break;
    }
  }
  if (!playerId) playerId = '0'; // fallback for single player

  // Helper to count events
  function countEvents(events) {
    const counters = {};
    let totalCollision = 0;
    let maxCollision = 0;
    for (const ev of events) {
      if (String(ev.participantid) !== String(playerId)) continue;
      const type = ev.event_name;
      if (EVENT_TYPES.includes(type)) {
        counters[type] = (counters[type] || 0) + 1;
      }
      if (type === 'Impact' && ev.attributes?.CollisionMagnitude) {
        totalCollision += ev.attributes.CollisionMagnitude;
        if (ev.attributes.CollisionMagnitude > maxCollision) {
          maxCollision = ev.attributes.CollisionMagnitude;
        }
      }
    }
    return { counters, totalCollision, maxCollision };
  }

  // Qualifying
  let qualEvents = [];
  if (session.stages?.qualifying1?.events) {
    qualEvents = session.stages.qualifying1.events;
  }
  const { counters: qualCounters } = countEvents(qualEvents);

  // Race
  let raceEvents = [];
  if (session.stages?.race1?.events) {
    raceEvents = session.stages.race1.events;
  }
  const { counters: raceCounters, totalCollision, maxCollision } = countEvents(raceEvents);

  // Player final position (from race results)
  let position = null;
  if (session.stages?.race1?.results) {
    const playerResult = session.stages.race1.results.find(
      (r) => String(r.participantid) === String(playerId)
    );
    if (playerResult && playerResult.attributes?.RacePosition != null) {
      position = playerResult.attributes.RacePosition;
    }
  }

  return {
    qualifying: qualCounters,
    race: raceCounters,
    position,
    collisionStats: { total: totalCollision, max: maxCollision },
    finished: true,
  };
} 