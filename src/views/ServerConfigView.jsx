import { useState, useRef, useEffect } from 'react';
import { tracksData, carsData, weatherData } from '../data/ams2Data';
import BasicSettings from '../components/BasicSettings';
import NetworkSettings from '../components/NetworkSettings';
import SessionSettings from '../components/SessionSettings';
import FlagsSettings from '../components/FlagsSettings';
import GameSettings from '../components/GameSettings';
import FilePathSettings from '../components/FilePathSettings';
import {
  validateServerName,
  flagsToString,
  damageTypeToString,
  penaltiesTypeToString,
  getWeatherName,
  getTrackNameById,
  getVehicleClassNameById,
  getInputValue,
  tireWearTypeToString,
  fuelUsageTypeToString,
  damageScaleToString,
  pitControlToString,
  startTypeToRollingStart,
} from '../utils/configHelpers';
import generateServerCfg from '../utils/generateServerCfg';
import { DEFAULT_CONFIG, DEFAULT_ROTATION_MAPS } from '../utils/defaultConfig';
import './ServerConfigView.css';

const ServerConfig = () => {
  const [config, setConfig] = useState(DEFAULT_CONFIG);

  // Rotation maps state
  const [rotationMaps, setRotationMaps] = useState(DEFAULT_ROTATION_MAPS);

  const [activeTab, setActiveTab] = useState('basic');
  const [savedConfig, setSavedConfig] = useState(null);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const saveTimeoutRef = useRef(null);
  const [steamUrlToast, setSteamUrlToast] = useState(null);
  const steamUrlTimeoutRef = useRef(null);
  // Move fileHandles state up here
  const [fileHandles, setFileHandles] = useState({ serverCfg: null, smsRotate: null });
  const [updateFilesToast, setUpdateFilesToast] = useState(null);
  const updateFilesTimeoutRef = useRef(null);
  const [showSavedCheck, setShowSavedCheck] = useState(false);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      if (steamUrlTimeoutRef.current) clearTimeout(steamUrlTimeoutRef.current);
      if (updateFilesTimeoutRef.current) clearTimeout(updateFilesTimeoutRef.current);
    };
  }, []);

  const handleInputChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileHandlesChange = (newFileHandles) => {
    setFileHandles(newFileHandles);
  };

  // Rotation map management functions
  const addRotationMap = () => {
    const newId = Math.max(...rotationMaps.map(m => m.id), 0) + 1;
    const newMap = {
      id: newId,
      name: `Map ${newId}`,
      trackId: -1478712571,
      vehicleClassId: 492525831,
      vehicleModelId: 1323381033,
      practiceLength: 10,
      qualifyLength: 10,
      raceLength: 10,
      raceDateHour: 11,
      raceWeatherSlots: 1,
      weatherSlots: [-934211870, -934211870, -934211870, -934211870],
    };
    setRotationMaps(prev => [...prev, newMap]);
  };

  const removeRotationMap = (mapId) => {
    if (rotationMaps.length > 1) {
      setRotationMaps(prev => prev.filter(m => m.id !== mapId));
    }
  };

  const updateRotationMap = (mapId, field, value) => {
    setRotationMaps(prev => prev.map(m =>
      m.id === mapId ? { ...m, [field]: value } : m,
    ));
  };

  const updateRotationMapWeather = (mapId, slotIndex, weatherId) => {
    setRotationMaps(prev => prev.map(m => {
      if (m.id === mapId) {
        const newWeatherSlots = [...m.weatherSlots];
        newWeatherSlots[slotIndex] = weatherId;
        return { ...m, weatherSlots: newWeatherSlots };
      }
      return m;
    }));
  };

  // Flags are now managed globally in the config.selectedFlags
  // No need for individual map flag management

  const handleFlagToggle = (flagValue) => {
    setConfig(prev => {
      const newFlags = prev.selectedFlags.includes(flagValue)
        ? prev.selectedFlags.filter(f => f !== flagValue)
        : [...prev.selectedFlags, flagValue];
      return { ...prev, selectedFlags: newFlags };
    });
  };

  // Save current configuration internally
  const handleSaveConfiguration = () => {
    const currentConfig = {
      config: { ...config },
      rotationMaps: [...rotationMaps],
      timestamp: new Date().toISOString(),
    };
    setSavedConfig(currentConfig);
    setShowSavedCheck(true);
    setShowSaveSuccess(true);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      setShowSaveSuccess(false);
      setShowSavedCheck(false);
    }, 2500);
  };

  // Reset all settings to defaults from original files
  const handleResetToDefaults = () => {
    // Reset config to original server.cfg values
    setConfig(DEFAULT_CONFIG);

    // Reset rotation maps to original sms_rotate_config.json values
    setRotationMaps(DEFAULT_ROTATION_MAPS);

    // Clear any saved configuration
    setSavedConfig(null);

    // Configuration reset to defaults
  };

  // Update files using stored file handles
  const handleUpdateFiles = async () => {
    if (!savedConfig) {
      setUpdateFilesToast('Please save your configuration first before updating files');
      if (updateFilesTimeoutRef.current) clearTimeout(updateFilesTimeoutRef.current);
      updateFilesTimeoutRef.current = setTimeout(() => {
        setUpdateFilesToast(null);
      }, 3000);
      return;
    }

    if (!fileHandles.serverCfg || !fileHandles.smsRotate) {
      setUpdateFilesToast('No files selected. Please go to File Paths tab to select your configuration files.');
      if (updateFilesTimeoutRef.current) clearTimeout(updateFilesTimeoutRef.current);
      updateFilesTimeoutRef.current = setTimeout(() => {
        setUpdateFilesToast(null);
      }, 4000);
      return;
    }

    const serverName = validateServerName(config.name);
    if (!serverName) {
      setUpdateFilesToast('Please enter a valid server name');
      if (updateFilesTimeoutRef.current) clearTimeout(updateFilesTimeoutRef.current);
      updateFilesTimeoutRef.current = setTimeout(() => {
        setUpdateFilesToast(null);
      }, 3000);
      return;
    }

    try {
      // Generate configuration content
      const serverCfgContent = generateServerCfg(config, rotationMaps);
      const defaultMap = rotationMaps[0];
      const rotationConfigContent = `// Config version.
version : 7

// Default configuration.
config : {

	// Is the current rotation index persistent? If true, the rotation will continue after server restart,
	// If false, the rotation will always start from the first setup.
	// You can always delete the sms_rotate_data.json file from lua_config to reset the persisted index.
	"persist_index" : ${config.persistRotationIndex},

	// The default setup. This is a table with attributes and values.
	"default" : {
		"PracticeLength" : ${defaultMap.practiceLength},
		"QualifyLength" : ${defaultMap.qualifyLength},
		"RaceLength" : ${defaultMap.raceLength},

		"Flags" : "${flagsToString(config.selectedFlags)}",
		"DamageType" : "${damageTypeToString(config.damageType)}",
		"DamageScale" : "${damageScaleToString(config.damageScale)}",
		"TireWearType" : "${tireWearTypeToString(config.tireWearType)}",
		"FuelUsageType" : "${fuelUsageTypeToString(config.fuelUsageType)}",
		"PenaltiesType" : "${penaltiesTypeToString(config.penaltiesType)}",
		"ManualPitStops" : "${pitControlToString(config.manualPitStops)}",
		"RaceRollingStart" : ${startTypeToRollingStart(config.startType)},
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

	// The rotation. Array of setups to rotate. If empty, just the default setup will be used with no actual rotation happening.
	"rotation" : [
${rotationMaps.map(map => `		{
			"VehicleClassId" : "${getVehicleClassNameById(map.vehicleClassId)}",
			"TrackId" : "${getTrackNameById(map.trackId)}",
			"PracticeLength" : ${map.practiceLength},
			"QualifyLength" : ${map.qualifyLength},
			"RaceLength" : ${map.raceLength},
			"RaceDateHour" : ${map.raceDateHour},
			"RaceRollingStart" : ${startTypeToRollingStart(config.startType)},
			
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

      // Write to server.cfg
      const serverCfgWritable = await fileHandles.serverCfg.createWritable();
      await serverCfgWritable.write(serverCfgContent);
      await serverCfgWritable.close();

      // Write to sms_rotate_config.json
      const smsRotateWritable = await fileHandles.smsRotate.createWritable();
      await smsRotateWritable.write(rotationConfigContent);
      await smsRotateWritable.close();

      setUpdateFilesToast('Files updated successfully! Your AMS2 server configuration has been updated.');
      if (updateFilesTimeoutRef.current) clearTimeout(updateFilesTimeoutRef.current);
      updateFilesTimeoutRef.current = setTimeout(() => {
        setUpdateFilesToast(null);
      }, 4000);

    } catch (error) {
      setUpdateFilesToast('Error updating files: ' + error.message);
      if (updateFilesTimeoutRef.current) clearTimeout(updateFilesTimeoutRef.current);
      updateFilesTimeoutRef.current = setTimeout(() => {
        setUpdateFilesToast(null);
      }, 4000);
    }
  };

  // Open Steam lobby URL in new tab
  const handleGoToLobby = () => {
    if (!savedConfig) {
      setSteamUrlToast('Please save your configuration first before going to lobby');
      if (steamUrlTimeoutRef.current) clearTimeout(steamUrlTimeoutRef.current);
      steamUrlTimeoutRef.current = setTimeout(() => {
        setSteamUrlToast(null);
      }, 3000);
      return;
    }

    const serverName = validateServerName(config.name);
    if (!serverName) {
      setSteamUrlToast('Please enter a valid server name');
      if (steamUrlTimeoutRef.current) clearTimeout(steamUrlTimeoutRef.current);
      steamUrlTimeoutRef.current = setTimeout(() => {
        setSteamUrlToast(null);
      }, 3000);
      return;
    }

    // Get server IP and port
    const serverIP = config.bindIP || 'localhost'; // Use bindIP if set, otherwise localhost
    const gamePort = config.hostPort || 0; // Use hostPort for game connection

    if (!gamePort || gamePort === 0) {
      setSteamUrlToast('Please configure a valid host port');
      if (steamUrlTimeoutRef.current) clearTimeout(steamUrlTimeoutRef.current);
      steamUrlTimeoutRef.current = setTimeout(() => {
        setSteamUrlToast(null);
      }, 3000);
      return;
    }

    // Build the Steam URL
    let steamUrl = `steam://run/1066890//-connect ${serverIP}:${gamePort}`;
    
    // Add password if set
    if (config.password && config.password.trim() !== '') {
      steamUrl += ` -password ${config.password}`;
    }

    // Open in new tab
    window.open(steamUrl, '_blank');
    setSteamUrlToast('Opening Steam lobby...');
    if (steamUrlTimeoutRef.current) clearTimeout(steamUrlTimeoutRef.current);
    steamUrlTimeoutRef.current = setTimeout(() => {
      setSteamUrlToast(null);
    }, 2500);
  };



  const renderBasicSettings = () => (
    <BasicSettings config={config} handleInputChange={handleInputChange} />
  );

  const renderNetworkSettings = () => (
    <NetworkSettings config={config} handleInputChange={handleInputChange} />
  );

  const renderSessionSettings = () => (
    <SessionSettings config={config} handleInputChange={handleInputChange} />
  );

  const renderFlags = () => (
    <FlagsSettings config={config} handleFlagToggle={handleFlagToggle} />
  );

  const renderGameSettings = () => (
    <GameSettings config={config} handleInputChange={handleInputChange} />
  );

  const renderFilePathSettings = () => (
    <FilePathSettings 
      fileHandles={fileHandles}
      setFileHandles={setFileHandles}
      onFileHandlesChange={handleFileHandlesChange}
    />
  );

  const renderRotationSettings = () => (
    <div className="config-section">
      <h3>Map Rotation Settings</h3>
      <div className="rotation-controls">
        <button
          className="btn-secondary"
          onClick={addRotationMap}
        >
          Add Map
        </button>
        <p className="info-text">
          {rotationMaps.length === 1
            ? 'Single map mode: Only one map will be used'
            : `Multiple maps: ${rotationMaps.length} map(s) in rotation`}
        </p>
      </div>
      <div className="rotation-maps">
        {rotationMaps.map((map) => (
          <div key={map.id} className="rotation-map-item">
            <div className="map-header">
        <input
                type="text"
                value={map.name}
                onChange={(e) => updateRotationMap(map.id, 'name', e.target.value)}
                className="map-name-input"
              />
              {rotationMaps.length > 1 && (
                <button
                  className="btn-danger"
                  onClick={() => removeRotationMap(map.id)}
                >
                  Remove
                </button>
              )}
            </div>
            <div className="map-settings">
              <div className="form-group">
                                  <label>Track:</label>
                  <select
                    value={getInputValue(map.trackId)}
                    onChange={(e) => updateRotationMap(map.id, 'trackId', parseInt(e.target.value) || 0)}
                  >
                    {tracksData
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map(track => (
                    <option key={track.id} value={track.id}>
                      {track.name}{track.dlc ? ' [DLC]' : ''} (Grid: {track.gridsize})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Vehicle Class:</label>
                <select
                  value={getInputValue(map.vehicleClassId)}
                  onChange={(e) => updateRotationMap(map.id, 'vehicleClassId', parseInt(e.target.value) || 0)}
                >
                  {carsData
                    .sort((a, b) => a.translated_name.localeCompare(b.translated_name))
                    .map(car => (
                    <option key={car.value} value={car.value}>
                      {car.translated_name}{car.dlc ? ' [DLC]' : ''}
                    </option>
                  ))}
                </select>
      </div>
      <div className="form-group">
        <label>Practice Length (minutes):</label>
        <input
          type="number"
          min="0"
                  value={getInputValue(map.practiceLength)}
                  onChange={(e) => updateRotationMap(map.id, 'practiceLength', parseInt(e.target.value) || 0)}
        />
      </div>
      <div className="form-group">
        <label>Qualify Length (minutes):</label>
        <input
          type="number"
          min="0"
                  value={getInputValue(map.qualifyLength)}
                  onChange={(e) => updateRotationMap(map.id, 'qualifyLength', parseInt(e.target.value) || 0)}
        />
      </div>
      <div className="form-group">
        <label>Race Length (laps):</label>
        <input
          type="number"
          min="1"
                  value={getInputValue(map.raceLength)}
                  onChange={(e) => updateRotationMap(map.id, 'raceLength', parseInt(e.target.value) || 0)}
        />
      </div>
      <div className="form-group">
        <label>Race Date Hour:</label>
        <input
          type="number"
          min="0"
          max="23"
                  value={getInputValue(map.raceDateHour)}
                  onChange={(e) => updateRotationMap(map.id, 'raceDateHour', parseInt(e.target.value) || 0)}
        />
      </div>
      <div className="weather-section">
        <div className="form-group">
          <label>Weather Slots:</label>
          <select
                    value={getInputValue(map.raceWeatherSlots)}
                    onChange={(e) => updateRotationMap(map.id, 'raceWeatherSlots', parseInt(e.target.value) || 0)}
          >
            <option value={1}>1 Slot</option>
            <option value={2}>2 Slots</option>
            <option value={3}>3 Slots</option>
            <option value={4}>4 Slots</option>
          </select>
        </div>
        
        <div className="weather-slots-container">
          {Array.from({ length: map.raceWeatherSlots }, (_, i) => (
            <div key={i} className="weather-slot-item">
              <label>Weather Slot {i + 1}:</label>
              <select
                        value={getInputValue(map.weatherSlots[i])}
                        onChange={(e) => updateRotationMapWeather(map.id, i, parseInt(e.target.value) || 0)}
              >
                {weatherData
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map(weather => (
                  <option key={weather.value} value={weather.value}>
                    {weather.name}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
              {/* Session flags are managed globally in the Flags tab */}
    </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="server-config">
      <h2>Racing Server Configuration</h2>
      
      <div className="disclaimer">
        <p><strong>Disclaimer:</strong> This is an unofficial tool for educational and personal use only. 
        Not affiliated with any game studio. Use at your own discretion.</p>
      </div>

      <div className="tabs">
        <button
          className={activeTab === 'basic' ? 'active' : ''}
          onClick={() => setActiveTab('basic')}
        >
          Basic Settings
        </button>
        <button
          className={activeTab === 'network' ? 'active' : ''}
          onClick={() => setActiveTab('network')}
        >
          Network
        </button>
        <button
          className={activeTab === 'session' ? 'active' : ''}
          onClick={() => setActiveTab('session')}
        >
          Session
        </button>
        <button
          className={activeTab === 'flags' ? 'active' : ''}
          onClick={() => setActiveTab('flags')}
        >
          Flags
        </button>
        <button
          className={activeTab === 'game' ? 'active' : ''}
          onClick={() => setActiveTab('game')}
        >
          Game Settings
        </button>
        <button
          className={activeTab === 'file-path' ? 'active' : ''}
          onClick={() => setActiveTab('file-path')}
        >
          File Paths
        </button>
        <button
          className={activeTab === 'rotation' ? 'active' : ''}
          onClick={() => setActiveTab('rotation')}
        >
          Rotation
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'basic' && renderBasicSettings()}
        {activeTab === 'network' && renderNetworkSettings()}
        {activeTab === 'session' && renderSessionSettings()}
        {activeTab === 'flags' && renderFlags()}
        {activeTab === 'game' && renderGameSettings()}
        {activeTab === 'file-path' && renderFilePathSettings()}
        {activeTab === 'rotation' && renderRotationSettings()}
      </div>
      
      {showSaveSuccess && (
        <div className="save-success-toast">
          Configuration saved successfully!
        </div>
      )}
      
      {steamUrlToast && (
        <div className="steam-url-toast">
          {steamUrlToast}
        </div>
      )}
      
      {updateFilesToast && (
        <div className="update-files-toast">
          {updateFilesToast}
        </div>
      )}
      <div className="config-actions">
        <button
          className="btn-primary"
          onClick={handleSaveConfiguration}
        >
          {showSavedCheck ? 'Configuration Saved ✓' : 'Save Configuration'}
        </button>
        <button
          className="btn-secondary"
          onClick={handleResetToDefaults}
        >
          Reset to Defaults
        </button>
        <div className="export-section">
          {/* Removed Export Configuration button and logic */}
          <button
            className={`btn-update-files ${fileHandles.serverCfg && fileHandles.smsRotate ? 'active' : ''}`}
            style={{ padding: '15px 30px', fontSize: '14px', minWidth: '140px', height: '48px', borderRadius: '8px' }}
            onClick={handleUpdateFiles}
            disabled={!savedConfig || !fileHandles.serverCfg || !fileHandles.smsRotate}
          >
            {fileHandles.serverCfg && fileHandles.smsRotate ? 'Update Files' : 'Update Files (Select in File Paths)'}
          </button>
        </div>
        <button
          className="btn-secondary"
          onClick={handleGoToLobby}
        >
          Go to Lobby
        </button>
      </div>
      
    </div>
  );
};

export default ServerConfig; 
