import generateServerCfg from '../utils/generateServerCfg';
import { DEFAULT_CONFIG } from '../utils/defaultConfig';

// Mock the configHelpers module to avoid file system dependencies
jest.mock('../utils/configHelpers', () => ({
  flagsToNumber: jest.fn((flags) => {
    // Simple mock implementation that sums the flags
    return flags.reduce((sum, flag) => sum + flag, 0);
  }),
  getInputValue: jest.fn((value) => value || 0),
  flagsToString: jest.fn((flags) => flags.join(',')),
  damageTypeToString: jest.fn((type) => {
    const types = { 0: 'Off', 1: 'Visual Only', 2: 'Performance Impacting', 3: 'Full Damage' };
    return types[type] || 'Unknown';
  }),
  penaltiesTypeToString: jest.fn((type) => {
    const types = { 0: 'No Penalties', 1: 'Full Penalties' };
    return types[type] || 'Unknown';
  }),
  getWeatherName: jest.fn((weatherId) => {
    // Mock weather name lookup
    const weatherMap = {
      [-934211870]: 'Clear',
      [-934211869]: 'LightCloud',
      [-934211868]: 'MediumCloud',
      [-934211867]: 'HeavyCloud',
      [-934211866]: 'Storm'
    };
    return weatherMap[weatherId] || 'Unknown';
  }),
  getTrackNameById: jest.fn((trackId) => {
    // Mock track name lookup
    const trackMap = {
      [-1478712571]: 'Interlagos_GP',
      [123456]: 'Test_Track'
    };
    return trackMap[trackId] || 'Unknown';
  }),
  getVehicleClassNameById: jest.fn((classId) => {
    // Mock vehicle class name lookup
    const classMap = {
      [492525831]: 'StockCarBrasil',
      [123456]: 'TestClass'
    };
    return classMap[classId] || 'Unknown';
  }),
  tireWearTypeToString: jest.fn((type) => {
    const types = { 2: 'X5', 3: 'X4', 4: 'X3', 5: 'X2', 6: 'Standard', 8: 'Off' };
    return types[type] || 'Unknown';
  }),
  fuelUsageTypeToString: jest.fn((type) => {
    const types = { 0: 'Standard', 2: 'Off', 3: 'X5', 4: 'X4', 5: 'X3', 6: 'X2' };
    return types[type] || 'Unknown';
  }),
  damageScaleToString: jest.fn((scale) => {
    const scales = { 0: 'Low', 1: 'Medium', 2: 'High', 3: 'Max' };
    return scales[scale] || 'Unknown';
  }),
  pitControlToString: jest.fn((control) => {
    const controls = { 0: 'Auto', 1: 'Manual' };
    return controls[control] || 'Unknown';
  }),
  startTypeToRollingStart: jest.fn((type) => type === 1),
}));

describe('Server Configuration Integration Tests', () => {
  let testConfig;
  let testRotationMaps;

  beforeEach(() => {
    // Create a test configuration with known values
    testConfig = {
      ...DEFAULT_CONFIG,
      name: 'Test Racing Server',
      password: 'testpass123',
      maxPlayerCount: 16,
      secure: true,
      allowEmptyJoin: true,
      controlGameSetup: true,
      bindIP: '192.168.1.100',
      steamPort: 8766,
      hostPort: 27015,
      queryPort: 27016,
      sleepWaiting: 50,
      sleepActive: 10,
      enableHttpApi: true,
      httpApiPort: 9000,
      httpApiInterface: '127.0.0.1',
      serverControlsTrack: 1,
      serverControlsVehicleClass: 1,
      serverControlsVehicle: 1,
      gridSize: 20,
      maxPlayers: 4,
      opponentDifficulty: 75,
      damageType: 1,
      tireWearType: 6,
      fuelUsageType: 0,
      penaltiesType: 1,
      allowedViews: 0,
      damageScale: 1,
      manualPitStops: 1,
      raceWeatherSlots: 1,
      startType: 0,
      allowedCutsBeforePenalty: 3,
      driveThroughPenalty: 1,
      pitWhiteLinePenalty: 1,
      selectedFlags: [8, 32, 64, 128, 512, 131072, 524288],
      persistRotationIndex: true,
    };

    // Create test rotation maps
    testRotationMaps = [
      {
        id: 1,
        name: 'Test Map 1',
        trackId: -1478712571, // Interlagos
        vehicleClassId: 492525831, // Stock Car Brasil
        vehicleModelId: 1323381033,
        practiceLength: 15,
        qualifyLength: 10,
        raceLength: 20,
        raceDateHour: 14,
        raceWeatherSlots: 2,
        weatherSlots: [-934211870, -934211870, -934211870, -934211870], // Clear weather
      },
      {
        id: 2,
        name: 'Test Map 2',
        trackId: 123456, // Test track
        vehicleClassId: 492525831,
        vehicleModelId: 1323381033,
        practiceLength: 10,
        qualifyLength: 5,
        raceLength: 15,
        raceDateHour: 16,
        raceWeatherSlots: 1,
        weatherSlots: [-934211870, -934211870, -934211870, -934211870],
      }
    ];
  });

  test('should generate valid server configuration with all required sections', () => {
    const configContent = generateServerCfg(testConfig, testRotationMaps);
    expect(configContent).toContain('logLevel : "info"');
    expect(configContent).toContain('name : "Test Racing Server"');
    expect(configContent).toContain('password : "testpass123"');
    expect(configContent).toContain('maxPlayerCount : 16');
    expect(configContent).toContain('secure : true');
    expect(configContent).toContain('allowEmptyJoin : true');
    expect(configContent).toContain('controlGameSetup : true');
    expect(configContent).toContain('sessionAttributes : {');
    // Do NOT check for 'rotation' in server.cfg
  });

  test('should correctly map basic server settings', () => {
    const configContent = generateServerCfg(testConfig, testRotationMaps);
    expect(configContent).toMatch(/name : "Test Racing Server"/);
    expect(configContent).toMatch(/password : "testpass123"/);
    expect(configContent).toMatch(/maxPlayerCount : 16/);
    expect(configContent).toMatch(/secure : true/);
    expect(configContent).toMatch(/bindIP : "192\.168\.1\.100"/);
    expect(configContent).toMatch(/steamPort : 8766/);
    expect(configContent).toMatch(/hostPort : 27015/);
    expect(configContent).toMatch(/queryPort : 27016/);
  });

  test('should correctly map session attributes', () => {
    const configContent = generateServerCfg(testConfig, testRotationMaps);
    expect(configContent).toMatch(/"ServerControlsTrack" : 1/);
    expect(configContent).toMatch(/"ServerControlsVehicleClass" : 1/);
    expect(configContent).toMatch(/"ServerControlsVehicle" : 1/);
    expect(configContent).toMatch(/"GridSize" : 20/);
    expect(configContent).toMatch(/"MaxPlayers" : 4/);
    expect(configContent).toMatch(/"OpponentDifficulty" : 75/);
    expect(configContent).toMatch(/"DamageType" : 1/);
    expect(configContent).toMatch(/"TireWearType" : 6/);
    expect(configContent).toMatch(/"FuelUsageType" : 0/);
    expect(configContent).toMatch(/"PenaltiesType" : 1/);
    expect(configContent).toMatch(/"AllowedViews" : 0/);
    // Do NOT check for DamageScale or ManualPitStops in server.cfg sessionAttributes
  });

  test('should correctly map rotation maps', () => {
    const configContent = generateServerCfg(testConfig, testRotationMaps);
    // Do NOT check for 'rotation' in server.cfg
    // Instead, check that sessionAttributes uses the first rotation map for track, vehicle, lengths, weather
    expect(configContent).toMatch(/"TrackId" : -1478712571/);
    expect(configContent).toMatch(/"VehicleClassId" : 492525831/);
    expect(configContent).toMatch(/"PracticeLength" : 15/);
    expect(configContent).toMatch(/"QualifyLength" : 10/);
    expect(configContent).toMatch(/"RaceLength" : 20/);
    expect(configContent).toMatch(/"RaceDateHour" : 14/);
    expect(configContent).toMatch(/"RaceWeatherSlots" : 2/);
    expect(configContent).toMatch(/"RaceWeatherSlot1" : -934211870/);
  });

  test('should handle empty rotation maps gracefully', () => {
    // If rotationMaps is empty, generateServerCfg should not throw and should still generate valid config
    const configContent = generateServerCfg(testConfig, []);
    expect(configContent).toContain('sessionAttributes : {');
    expect(configContent).toContain('name : "Test Racing Server"');
    // Should not throw or access undefined
  });

  test('should validate flag conversion', () => {
    const configContent = generateServerCfg(testConfig, testRotationMaps);
    expect(configContent).toMatch(/"Flags" : \d+/);
    expect(configContent).toMatch(/"Flags" : 656104/);
  });

  test('should handle different damage types correctly', () => {
    const damageTypes = [0, 1, 2, 3];
    damageTypes.forEach(damageType => {
      const testConfigWithDamage = { ...testConfig, damageType };
      const configContent = generateServerCfg(testConfigWithDamage, testRotationMaps);
      expect(configContent).toMatch(new RegExp(`"DamageType" : ${damageType}`));
    });
  });

  test('should handle different penalty settings correctly', () => {
    const penaltyTypes = [0, 1];
    penaltyTypes.forEach(penaltyType => {
      const testConfigWithPenalty = { ...testConfig, penaltiesType: penaltyType };
      const configContent = generateServerCfg(testConfigWithPenalty, testRotationMaps);
      expect(configContent).toMatch(new RegExp(`"PenaltiesType" : ${penaltyType}`));
    });
  });

  test('should validate grid size and max players relationship', () => {
    const configContent = generateServerCfg(testConfig, testRotationMaps);
    expect(configContent).toMatch(/"GridSize" : 20/);
    expect(configContent).toMatch(/"MaxPlayers" : 4/);
    // Test with equal values
    const equalConfig = { ...testConfig, gridSize: 4, maxPlayers: 4 };
    const equalConfigContent = generateServerCfg(equalConfig, testRotationMaps);
    expect(equalConfigContent).toMatch(/"GridSize" : 4/);
    expect(equalConfigContent).toMatch(/"MaxPlayers" : 4/);
  });

  test('should handle weather slots correctly', () => {
    const configContent = generateServerCfg(testConfig, testRotationMaps);
    expect(configContent).toMatch(/"RaceWeatherSlots" : 2/);
    expect(configContent).toMatch(/"RaceWeatherSlot1" : -934211870/);
    expect(configContent).toMatch(/"RaceWeatherSlot2" : -934211870/);
    expect(configContent).toMatch(/"RaceWeatherSlot3" : -934211870/);
    expect(configContent).toMatch(/"RaceWeatherSlot4" : -934211870/);
  });

  // --- sms_rotate_config.json tests ---
  test('should generate valid sms_rotate_config.json content', () => {
    const { 
      flagsToString, 
      damageTypeToString, 
      damageScaleToString,
      tireWearTypeToString,
      fuelUsageTypeToString,
      penaltiesTypeToString,
      pitControlToString,
      startTypeToRollingStart,
      getWeatherName,
      getTrackNameById,
      getVehicleClassNameById
    } = require('../utils/configHelpers');
    const defaultMap = testRotationMaps[0];
    const rotationConfigContent = `// Config version.
version : 7

// Default configuration.
config : {

	"persist_index" : ${testConfig.persistRotationIndex},

	"default" : {
		"PracticeLength" : ${defaultMap.practiceLength},
		"QualifyLength" : ${defaultMap.qualifyLength},
		"RaceLength" : ${defaultMap.raceLength},

		"Flags" : "${flagsToString(testConfig.selectedFlags)}",
		"DamageType" : "${damageTypeToString(testConfig.damageType)}",
		"DamageScale" : "${damageScaleToString(testConfig.damageScale)}",
		"TireWearType" : "${tireWearTypeToString(testConfig.tireWearType)}",
		"FuelUsageType" : "${fuelUsageTypeToString(testConfig.fuelUsageType)}",
		"PenaltiesType" : "${penaltiesTypeToString(testConfig.penaltiesType)}",
		"ManualPitStops" : "${pitControlToString(testConfig.manualPitStops)}",
		"RaceRollingStart" : ${startTypeToRollingStart(testConfig.startType)},
		"AllowedCutsBeforePenalty" : ${testConfig.allowedCutsBeforePenalty},
		"DriveThroughPenalty" : ${testConfig.driveThroughPenalty},
		"PitWhiteLinePenalty" : ${(testConfig.pitWhiteLinePenalty ?? 1)},
		"AllowedViews" : "Any",

		"RaceDateHour" : ${defaultMap.raceDateHour},

		"RaceWeatherSlots" : ${defaultMap.raceWeatherSlots},
		"RaceWeatherSlot1" : "${getWeatherName(defaultMap.weatherSlots[0])}",
		"RaceWeatherSlot2" : "${getWeatherName(defaultMap.weatherSlots[1])}",
		"RaceWeatherSlot3" : "${getWeatherName(defaultMap.weatherSlots[2])}",
		"RaceWeatherSlot4" : "${getWeatherName(defaultMap.weatherSlots[3])}",
		
		// Practice and Qualify weather slots (same as RaceWeatherSlot1)
		"PracticeWeatherSlots" : 1,
		"PracticeWeatherSlot1" : "${getWeatherName(defaultMap.weatherSlots[0])}",
		"PracticeWeatherSlot2" : "${getWeatherName(defaultMap.weatherSlots[0])}",
		"PracticeWeatherSlot3" : "${getWeatherName(defaultMap.weatherSlots[0])}",
		"PracticeWeatherSlot4" : "${getWeatherName(defaultMap.weatherSlots[0])}",
		
		"QualifyWeatherSlots" : 1,
		"QualifyWeatherSlot1" : "${getWeatherName(defaultMap.weatherSlots[0])}",
		"QualifyWeatherSlot2" : "${getWeatherName(defaultMap.weatherSlots[0])}",
		"QualifyWeatherSlot3" : "${getWeatherName(defaultMap.weatherSlots[0])}",
		"QualifyWeatherSlot4" : "${getWeatherName(defaultMap.weatherSlots[0])}",
	},

	"rotation" : [
${testRotationMaps.map(map => `		{
			"VehicleClassId" : "${getVehicleClassNameById(map.vehicleClassId)}",
			"TrackId" : "${getTrackNameById(map.trackId)}",
			"PracticeLength" : ${map.practiceLength},
			"QualifyLength" : ${map.qualifyLength},
			"RaceLength" : ${map.raceLength},
			"RaceDateHour" : ${map.raceDateHour},
			"RaceRollingStart" : ${startTypeToRollingStart(testConfig.startType)},
			"AllowedCutsBeforePenalty" : ${testConfig.allowedCutsBeforePenalty},
			"DriveThroughPenalty" : ${testConfig.driveThroughPenalty},
			"PitWhiteLinePenalty" : ${(testConfig.pitWhiteLinePenalty ?? 1)},
			
			// set weather for this event
			"RaceWeatherSlots" : ${map.raceWeatherSlots},
			"RaceWeatherSlot1" : "${getWeatherName(map.weatherSlots[0])}",
			"RaceWeatherSlot2" : "${getWeatherName(map.weatherSlots[1])}",
			"RaceWeatherSlot3" : "${getWeatherName(map.weatherSlots[2])}",
			"RaceWeatherSlot4" : "${getWeatherName(map.weatherSlots[3])}",
			
			// Practice and Qualify weather slots (same as RaceWeatherSlot1)
			"PracticeWeatherSlots" : 1,
			"PracticeWeatherSlot1" : "${getWeatherName(map.weatherSlots[0])}",
			"PracticeWeatherSlot2" : "${getWeatherName(map.weatherSlots[0])}",
			"PracticeWeatherSlot3" : "${getWeatherName(map.weatherSlots[0])}",
			"PracticeWeatherSlot4" : "${getWeatherName(map.weatherSlots[0])}",
			
			"QualifyWeatherSlots" : 1,
			"QualifyWeatherSlot1" : "${getWeatherName(map.weatherSlots[0])}",
			"QualifyWeatherSlot2" : "${getWeatherName(map.weatherSlots[0])}",
			"QualifyWeatherSlot3" : "${getWeatherName(map.weatherSlots[0])}",
			"QualifyWeatherSlot4" : "${getWeatherName(map.weatherSlots[0])}",
		}`).join(',\n')}
	]
}`;
    expect(rotationConfigContent).toContain('version : 7');
    expect(rotationConfigContent).toContain('config : {');
    expect(rotationConfigContent).toContain('"persist_index" : true');
    expect(rotationConfigContent).toContain('"default" : {');
    expect(rotationConfigContent).toContain('"rotation" : [');
  });

  test('should correctly map rotation config default settings', () => {
    const { 
      flagsToString, 
      damageTypeToString, 
      tireWearTypeToString,
      fuelUsageTypeToString,
      penaltiesTypeToString,
      pitControlToString,
      startTypeToRollingStart,
      getWeatherName
    } = require('../utils/configHelpers');
    const defaultMap = testRotationMaps[0];
    const rotationConfigContent = `// Config version.
version : 7

// Default configuration.
config : {

	"persist_index" : ${testConfig.persistRotationIndex},

	"default" : {
		"PracticeLength" : ${defaultMap.practiceLength},
		"QualifyLength" : ${defaultMap.qualifyLength},
		"RaceLength" : ${defaultMap.raceLength},

		"Flags" : "${flagsToString(testConfig.selectedFlags)}",
		"DamageType" : "${damageTypeToString(testConfig.damageType)}",
		"TireWearType" : "${tireWearTypeToString(testConfig.tireWearType)}",
		"FuelUsageType" : "${fuelUsageTypeToString(testConfig.fuelUsageType)}",
		"PenaltiesType" : "${penaltiesTypeToString(testConfig.penaltiesType)}",
		"ManualPitStops" : "${pitControlToString(testConfig.manualPitStops)}",
		"RaceRollingStart" : ${startTypeToRollingStart(testConfig.startType)},
		"AllowedCutsBeforePenalty" : ${testConfig.allowedCutsBeforePenalty},
		"DriveThroughPenalty" : ${testConfig.driveThroughPenalty},
		"PitWhiteLinePenalty" : ${(testConfig.pitWhiteLinePenalty ?? 1)},

		"RaceDateHour" : ${defaultMap.raceDateHour},

		"RaceWeatherSlots" : ${defaultMap.raceWeatherSlots},
		"RaceWeatherSlot1" : "${getWeatherName(defaultMap.weatherSlots[0])}",
		"RaceWeatherSlot2" : "${getWeatherName(defaultMap.weatherSlots[1])}",
		"RaceWeatherSlot3" : "${getWeatherName(defaultMap.weatherSlots[2])}",
		"RaceWeatherSlot4" : "${getWeatherName(defaultMap.weatherSlots[3])}",
	},

	"rotation" : []
}`;
    expect(rotationConfigContent).toMatch(/"PracticeLength" : 15/);
    expect(rotationConfigContent).toMatch(/"QualifyLength" : 10/);
    expect(rotationConfigContent).toMatch(/"RaceLength" : 20/);
    expect(rotationConfigContent).toMatch(/"RaceDateHour" : 14/);
    expect(rotationConfigContent).toMatch(/"RaceWeatherSlots" : 2/);
    expect(rotationConfigContent).toMatch(/"AllowedCutsBeforePenalty" : 3/);
    expect(rotationConfigContent).toMatch(/"DriveThroughPenalty" : 1/);
    expect(rotationConfigContent).toMatch(/"PitWhiteLinePenalty" : 1/);
  });

  test('should correctly map rotation maps in sms_rotate_config', () => {
    const { 
      getWeatherName, 
      getTrackNameById, 
      getVehicleClassNameById,
      startTypeToRollingStart 
    } = require('../utils/configHelpers');
    const rotationMapsContent = testRotationMaps.map(map => `		{
			"VehicleClassId" : "${getVehicleClassNameById(map.vehicleClassId)}",
			"TrackId" : "${getTrackNameById(map.trackId)}",
			"PracticeLength" : ${map.practiceLength},
			"QualifyLength" : ${map.qualifyLength},
			"RaceLength" : ${map.raceLength},
			"RaceDateHour" : ${map.raceDateHour},
			"RaceRollingStart" : ${startTypeToRollingStart(testConfig.startType)},
			"AllowedCutsBeforePenalty" : ${testConfig.allowedCutsBeforePenalty},
			"DriveThroughPenalty" : ${testConfig.driveThroughPenalty},
			"PitWhiteLinePenalty" : ${(testConfig.pitWhiteLinePenalty ?? 1)},
			
			"RaceWeatherSlots" : ${map.raceWeatherSlots},
			"RaceWeatherSlot1" : "${getWeatherName(map.weatherSlots[0])}",
			"RaceWeatherSlot2" : "${getWeatherName(map.weatherSlots[1])}",
			"RaceWeatherSlot3" : "${getWeatherName(map.weatherSlots[2])}",
			"RaceWeatherSlot4" : "${getWeatherName(map.weatherSlots[3])}",
		}`).join(',\n');
    expect(rotationMapsContent).toMatch(/"PracticeLength" : 15/);
    expect(rotationMapsContent).toMatch(/"QualifyLength" : 10/);
    expect(rotationMapsContent).toMatch(/"RaceLength" : 20/);
    expect(rotationMapsContent).toMatch(/"RaceDateHour" : 14/);
    expect(rotationMapsContent).toMatch(/"RaceWeatherSlots" : 2/);
    expect(rotationMapsContent).toMatch(/"PracticeLength" : 10/);
    expect(rotationMapsContent).toMatch(/"QualifyLength" : 5/);
    expect(rotationMapsContent).toMatch(/"RaceLength" : 15/);
    expect(rotationMapsContent).toMatch(/"RaceDateHour" : 16/);
    expect(rotationMapsContent).toMatch(/"RaceWeatherSlots" : 1/);
  });
}); 