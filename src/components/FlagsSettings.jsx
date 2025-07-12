import { sessionFlags } from '../data/sessionFlags';

const FlagsSettings = ({ config, handleFlagToggle }) => {
  // Tooltip data for specific flags
  const tooltips = {
    64: 'Stability Control Allowed',
    128: 'Traction Control Settings Allowed'
  };

  const handleBoxClick = (flagValue, event) => {
    // Allow the checkbox and label to handle their own events
    if (event.target.type === 'checkbox' || event.target.tagName === 'LABEL') {
      return;
    }
    handleFlagToggle(flagValue);
  };

  return (
    <div className="config-section">
      <h3>Session Flags</h3>
      <div className="flags-grid">
        {sessionFlags
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(flag => (
          <div 
            key={flag.value} 
            className="flag-item" 
            style={{ position: 'relative', cursor: 'pointer' }}
            onClick={(e) => handleBoxClick(flag.value, e)}
          >
            <label>
              <input
                type="checkbox"
                checked={config.selectedFlags.includes(flag.value)}
                onChange={() => handleFlagToggle(flag.value)}
              />
              {flag.name}
            </label>
            <small>{flag.description}</small>
            {tooltips[flag.value] && (
              <span 
                className="tooltip-icon" 
                title={tooltips[flag.value]}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: '2px solid #ff0000',
                  backgroundColor: '#ff0000',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  lineHeight: '1',
                  userSelect: 'none'
                }}
              >
                ?
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlagsSettings;
