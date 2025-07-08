import { getInputValue } from '../utils/configHelpers';

const SessionSettings = ({ config, handleInputChange }) => {
  return (
    <div className="config-section">
      <h3>Session Settings</h3>

      <div className="form-group">
        <label>Grid Size:</label>
        <input
          type="number"
          min="1"
          max="32"
          value={getInputValue(config.gridSize)}
          onChange={(e) => handleInputChange('gridSize', parseInt(e.target.value) || 0)}
        />
      </div>

      <div className="form-group">
        <label>Max Players:</label>
        <input
          type="number"
          min="1"
          max="32"
          value={getInputValue(config.maxPlayers)}
          onChange={(e) => handleInputChange('maxPlayers', parseInt(e.target.value) || 0)}
        />
      </div>

      <div className="form-group">
        <label>AI Difficulty (0-100):</label>
        <input
          type="range"
          min="0"
          max="100"
          value={getInputValue(config.opponentDifficulty)}
          onChange={(e) => handleInputChange('opponentDifficulty', parseInt(e.target.value) || 0)}
        />
        <span>{config.opponentDifficulty}</span>
      </div>
    </div>
  );
};

export default SessionSettings;
