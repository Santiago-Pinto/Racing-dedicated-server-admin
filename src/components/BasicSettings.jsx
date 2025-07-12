import { getInputValue } from '../utils/configHelpers';

const BasicSettings = ({ config, handleInputChange }) => {
  return (
    <div className="config-section">
      <h3>Basic Server Settings</h3>
      <div className="form-group">
        <label>Server Name:</label>
        <input
          type="text"
          value={config.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Enter server name"
        />
      </div>

      <div className="form-group">
        <label>Password:</label>
        <input
          type="password"
          value={config.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          placeholder="Leave empty for no password"
        />
      </div>

      <div className="form-group">
        <label>Max Players:</label>
        <input
          type="number"
          min="1"
          max="32"
          value={getInputValue(config.maxPlayerCount)}
          onChange={(e) => handleInputChange('maxPlayerCount', parseInt(e.target.value) || 0)}
        />
        <small className="setting-note">Server capacity limit (total connections)</small>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={config.secure}
            onChange={(e) => handleInputChange('secure', e.target.checked)}
          />
          Secure (Steam VAC authentication)
        </label>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={config.allowEmptyJoin}
            onChange={(e) => handleInputChange('allowEmptyJoin', e.target.checked)}
          />
          Allow empty server joins
        </label>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={config.controlGameSetup}
            onChange={(e) => handleInputChange('controlGameSetup', e.target.checked)}
          />
          Server controls game setup
        </label>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={config.persistRotationIndex}
            onChange={(e) => handleInputChange('persistRotationIndex', e.target.checked)}
          />
          Persist Rotation Index (Continue after server restart)
        </label>
      </div>
    </div>
  );
};

export default BasicSettings;
