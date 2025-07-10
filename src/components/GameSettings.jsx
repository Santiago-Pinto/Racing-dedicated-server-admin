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
          <option value={0}>Off</option>
          <option value={1}>Visual Only</option>
          <option value={2}>Performance Impacting</option>
          <option value={3}>Full Damage</option>
        </select>
      </div>

      <div className="form-group">
        <label>Tire Wear:</label>
        <select
          value={getInputValue(config.tireWearType)}
          onChange={(e) => handleInputChange('tireWearType', parseInt(e.target.value) || 6)}
        >
          <option value={2}>X5</option>
          <option value={3}>X4</option>
          <option value={4}>X3</option>
          <option value={5}>X2</option>
          <option value={6}>Standard</option>
          <option value={8}>Off</option>
        </select>
      </div>

      <div className="form-group">
        <label>Fuel Usage:</label>
        <select
          value={getInputValue(config.fuelUsageType)}
          onChange={(e) => handleInputChange('fuelUsageType', parseInt(e.target.value) || 0)}
        >
          <option value={0}>Standard</option>
          <option value={2}>Off</option>
          <option value={3}>X5</option>
          <option value={4}>X4</option>
          <option value={5}>X3</option>
          <option value={6}>X2</option>
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
