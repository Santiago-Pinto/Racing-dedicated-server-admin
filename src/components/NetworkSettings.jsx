import { getInputValue } from '../utils/configHelpers';

const NetworkSettings = ({ config, handleInputChange }) => {
  return (
    <div className="config-section">
      <h3>Network Settings</h3>
      <div className="form-group">
        <label>Bind IP:</label>
        <input
          type="text"
          value={config.bindIP}
          onChange={(e) => handleInputChange('bindIP', e.target.value)}
          placeholder="Leave empty for all interfaces"
        />
      </div>

      <div className="form-group">
        <label>Steam Port:</label>
        <input
          type="number"
          value={getInputValue(config.steamPort)}
          onChange={(e) => handleInputChange('steamPort', parseInt(e.target.value) || 0)}
        />
      </div>

      <div className="form-group">
        <label>Host Port:</label>
        <input
          type="number"
          value={getInputValue(config.hostPort)}
          onChange={(e) => handleInputChange('hostPort', parseInt(e.target.value) || 0)}
        />
      </div>

      <div className="form-group">
        <label>Query Port:</label>
        <input
          type="number"
          value={getInputValue(config.queryPort)}
          onChange={(e) => handleInputChange('queryPort', parseInt(e.target.value) || 0)}
        />
      </div>

      <div className="form-group">
        <label>HTTP API Port:</label>
        <input
          type="number"
          value={getInputValue(config.httpApiPort)}
          onChange={(e) => handleInputChange('httpApiPort', parseInt(e.target.value) || 0)}
        />
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={config.enableHttpApi}
            onChange={(e) => handleInputChange('enableHttpApi', e.target.checked)}
          />
          Enable HTTP API
        </label>
      </div>
    </div>
  );
};

export default NetworkSettings;
