// Default configuration values for AMS2 Server UI

export const DEFAULT_CONFIG = {
  // Basic server options
  name: 'My dedicated server',
  password: '',
  maxPlayerCount: 30,
  secure: true,
  allowEmptyJoin: true,
  controlGameSetup: true,
  
  // Network settings
  bindIP: '',
  steamPort: 8766,
  hostPort: 27015,
  queryPort: 27016,
  
  // Performance settings
  sleepWaiting: 50,
  sleepActive: 10,
  
  // HTTP API settings
  enableHttpApi: true,
  httpApiPort: 9000,
  httpApiInterface: '127.0.0.1',
  
  // Session attributes
  serverControlsTrack: 1,
  serverControlsVehicleClass: 1,
  serverControlsVehicle: 1,
  gridSize: 20,
  maxPlayers: 1,
  opponentDifficulty: 50,
  damageType: 3,
  tireWearType: 6,
  fuelUsageType: 0,
  penaltiesType: 1,
  allowedViews: 0,
  raceWeatherSlots: 1,



  // Session flags (applied to all rotation maps)
  selectedFlags: [8, 32, 64, 128, 512, 131072, 524288],

  // Rotation settings
  persistRotationIndex: true,
};

export const DEFAULT_ROTATION_MAPS = [
  {
    id: 1,
    name: 'Map 1',
    trackId: -1478712571,
    vehicleClassId: 492525831,
    vehicleModelId: 1323381033,
    practiceLength: 10,
    qualifyLength: 10,
    raceLength: 10,
    raceDateHour: 11,
    raceWeatherSlots: 1,
    weatherSlots: [-934211870, -934211870, -934211870, -934211870],
  },
]; 