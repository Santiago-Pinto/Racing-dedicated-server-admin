import { getInputValue } from '../utils/configHelpers';

const GameSettings = ({ config, handleInputChange }) => {
  return (
    <div className="config-section game-settings-grid">
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
        <label>Damage Scale:</label>
        <select
          value={getInputValue(config.damageScale)}
          onChange={(e) => handleInputChange('damageScale', parseInt(e.target.value) || 1)}
        >
          <option value={0}>Low</option>
          <option value={1}>Medium</option>
          <option value={2}>High</option>
          <option value={3}>Max</option>
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

      <div className="form-group">
        <label>Pit Control:</label>
        <select
          value={getInputValue(config.manualPitStops)}
          onChange={(e) => handleInputChange('manualPitStops', parseInt(e.target.value) || 0)}
        >
          <option value={0}>Auto</option>
          <option value={1}>Manual</option>
        </select>
      </div>

      <div className="form-group">
        <label>Start Type:</label>
        <select
          value={getInputValue(config.startType)}
          onChange={(e) => handleInputChange('startType', parseInt(e.target.value) || 0)}
        >
          <option value={0}>Standing</option>
          <option value={1}>Rolling Start</option>
        </select>
      </div>

      <div className="form-group">
        <label>Allowed Cuts Before Penalty:</label>
        <select
          value={getInputValue(config.allowedCutsBeforePenalty)}
          onChange={(e) => handleInputChange('allowedCutsBeforePenalty', parseInt(e.target.value) || 1)}
        >
          <option value={1}>1 Cut</option>
          <option value={2}>2 Cuts</option>
          <option value={3}>3 Cuts</option>
          <option value={4}>4 Cuts</option>
          <option value={5}>5 Cuts</option>
        </select>
      </div>

      <div className="form-group">
        <label>Drive-Through Penalty:</label>
        <select
          value={getInputValue(config.driveThroughPenalty)}
          onChange={(e) => handleInputChange('driveThroughPenalty', parseInt(e.target.value) || 0)}
        >
          <option value={0}>Disabled</option>
          <option value={1}>Enabled</option>
        </select>
      </div>

      <div className="form-group">
        <label>Pit White Line Penalty:</label>
        <select
          value={getInputValue(config.pitWhiteLinePenalty)}
          onChange={(e) => handleInputChange('pitWhiteLinePenalty', parseInt(e.target.value) || 0)}
        >
          <option value={0}>Disabled</option>
          <option value={1}>Enabled</option>
        </select>
      </div>
    </div>
  );
};

export default GameSettings;
