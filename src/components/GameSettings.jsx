import { getInputValue } from '../utils/configHelpers';

const GameSettings = ({ config, handleInputChange }) => {
  return (
    <div className="config-section">
      <h3>Game Settings</h3>

      <div className="form-group">
        <label>Damage Type:</label>
        <select
          value={getInputValue(config.damageType)}
          onChange={(e) => handleInputChange('damageType', parseInt(e.target.value) || 0)}
        >
          <option value={0}>No Damage</option>
          <option value={1}>Visual Only</option>
          <option value={2}>Full Damage</option>
        </select>
      </div>

      <div className="form-group">
        <label>Tire Wear:</label>
        <select
          value={getInputValue(config.tireWearType)}
          onChange={(e) => handleInputChange('tireWearType', parseInt(e.target.value) || 0)}
        >
          <option value={0}>No Tire Wear</option>
          <option value={1}>Realistic</option>
          <option value={2}>Accelerated</option>
        </select>
      </div>

      <div className="form-group">
        <label>Fuel Usage:</label>
        <select
          value={getInputValue(config.fuelUsageType)}
          onChange={(e) => handleInputChange('fuelUsageType', parseInt(e.target.value) || 0)}
        >
          <option value={0}>No Fuel Usage</option>
          <option value={1}>Realistic</option>
          <option value={2}>Accelerated</option>
        </select>
      </div>

      <div className="form-group">
        <label>Penalties:</label>
        <select
          value={getInputValue(config.penaltiesType)}
          onChange={(e) => handleInputChange('penaltiesType', parseInt(e.target.value) || 0)}
        >
          <option value={0}>No Penalties</option>
          <option value={1}>Full Penalties</option>
        </select>
      </div>
    </div>
  );
};

export default GameSettings;
