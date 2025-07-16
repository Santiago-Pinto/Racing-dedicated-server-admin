import { useState, useEffect } from 'react';
import { set, get } from 'idb-keyval';

const FILE_KEYS = ['serverCfg', 'smsRotate', 'smsStatsData', 'smsStatsConfig'];

const FilePathSettings = ({ fileHandles, setFileHandles, onFileHandlesChange }) => {
  const [isFileSystemSupported] = [ 'showOpenFilePicker' in window ];
  const [statusMessage, setStatusMessage] = useState('');

  // Restore file handles from IndexedDB on mount
  useEffect(() => {
    (async () => {
      if (!isFileSystemSupported) return;
      const restored = {};
      for (const key of FILE_KEYS) {
        try {
          const handle = await get(key);
          if (handle) restored[key] = handle;
        } catch { /* ignore errors restoring file handles */ }
      }
      if (Object.keys(restored).length > 0) {
        setFileHandles(prev => ({ ...prev, ...restored }));
      }
    })();
    // eslint-disable-next-line
  }, []);

  // Notify parent component when file handles change
  useEffect(() => {
    if (onFileHandlesChange) {
      onFileHandlesChange(fileHandles);
    }
  }, [fileHandles, onFileHandlesChange]);

  const handleSelectServerCfg = async () => {
    if (!isFileSystemSupported) {
      setStatusMessage('File System Access API not supported in this browser.');
      return;
    }
    try {
      const handles = await window.showOpenFilePicker({
        multiple: false,
        types: [{
          description: 'Server Configuration File',
          accept: { 'text/plain': ['.cfg'] }
        }]
      });
      setFileHandles(prev => ({ ...prev, serverCfg: handles[0] }));
      await set('serverCfg', handles[0]);
      setStatusMessage('Server.cfg file selected successfully!');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (error) {
      if (error.name === 'AbortError') {
        setStatusMessage('File selection cancelled.');
      } else {
        setStatusMessage('Error selecting server.cfg file: ' + error.message);
      }
      setTimeout(() => setStatusMessage(''), 4000);
    }
  };

  const handleSelectSmsRotate = async () => {
    if (!isFileSystemSupported) {
      setStatusMessage('File System Access API not supported in this browser.');
      return;
    }
    try {
      const handles = await window.showOpenFilePicker({
        multiple: false,
        types: [{
          description: 'SMS Rotation Configuration',
          accept: { 'application/json': ['.json'] }
        }]
      });
      setFileHandles(prev => ({ ...prev, smsRotate: handles[0] }));
      await set('smsRotate', handles[0]);
      setStatusMessage('SMS rotate config file selected successfully!');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (error) {
      if (error.name === 'AbortError') {
        setStatusMessage('File selection cancelled.');
      } else {
        setStatusMessage('Error selecting SMS rotate config file: ' + error.message);
      }
      setTimeout(() => setStatusMessage(''), 4000);
    }
  };

  const handleSelectSmsStatsData = async () => {
    if (!isFileSystemSupported) {
      setStatusMessage('File System Access API not supported in this browser.');
      return;
    }
    try {
      const handles = await window.showOpenFilePicker({
        multiple: false,
        types: [{
          description: 'SMS Stats Data File',
          accept: { 'application/json': ['.json'] }
        }]
      });
      setFileHandles(prev => ({ ...prev, smsStatsData: handles[0] }));
      await set('smsStatsData', handles[0]);
      setStatusMessage('SMS stats data file selected successfully!');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (error) {
      if (error.name === 'AbortError') {
        setStatusMessage('File selection cancelled.');
      } else {
        setStatusMessage('Error selecting SMS stats data file: ' + error.message);
      }
      setTimeout(() => setStatusMessage(''), 4000);
    }
  };

  const handleSelectSmsStatsConfig = async () => {
    if (!isFileSystemSupported) {
      setStatusMessage('File System Access API not supported in this browser.');
      return;
    }
    try {
      const handles = await window.showOpenFilePicker({
        multiple: false,
        types: [{
          description: 'SMS Stats Configuration File',
          accept: { 'application/json': ['.json'] }
        }]
      });
      setFileHandles(prev => ({ ...prev, smsStatsConfig: handles[0] }));
      await set('smsStatsConfig', handles[0]);
      setStatusMessage('SMS stats config file selected successfully!');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (error) {
      if (error.name === 'AbortError') {
        setStatusMessage('File selection cancelled.');
      } else {
        setStatusMessage('Error selecting SMS stats config file: ' + error.message);
      }
      setTimeout(() => setStatusMessage(''), 4000);
    }
  };

  const handleClearFileHandles = async () => {
    setFileHandles({ serverCfg: null, smsRotate: null, smsStatsData: null, smsStatsConfig: null });
    for (const key of FILE_KEYS) {
      await set(key, null);
    }
    setStatusMessage('File handles cleared.');
    setTimeout(() => setStatusMessage(''), 2000);
  };

  const getFileName = (handle) => {
    return handle ? handle.name : 'Not selected';
  };

  return (
    <div className="config-section">
      <h3>File Override Settings</h3>
      <div className="file-override-info">
        <p>
          <strong>Set up automatic file overriding:</strong> Select your existing AMS2 server configuration files 
          and the app will automatically update them when you click "Update Files" in the main actions area.
        </p>
      </div>
      <div className="file-selection-group">
        <div className="file-selection-item">
          <label>Server.cfg File:</label>
          <div className="file-selection-controls">
            <span className="file-name">{getFileName(fileHandles.serverCfg)}</span>
            <button
              className="btn-select-file"
              onClick={handleSelectServerCfg}
            >
              {fileHandles.serverCfg ? 'Change File' : 'Select File'}
            </button>
          </div>
        </div>
        <div className="file-selection-item">
          <label>SMS Rotate Config File:</label>
          <div className="file-selection-controls">
            <span className="file-name">{getFileName(fileHandles.smsRotate)}</span>
            <button
              className="btn-select-file"
              onClick={handleSelectSmsRotate}
            >
              {fileHandles.smsRotate ? 'Change File' : 'Select File'}
            </button>
          </div>
        </div>
        
        <div className="file-selection-divider">
          <span className="divider-text">Optional Files (Required for Career Mode)</span>
        </div>
        
        <div className="file-selection-item optional-file">
          <label>SMS Stats Data File: <span className="optional-badge">(Optional)</span></label>
          <div className="file-selection-controls">
            <span className="file-name">{getFileName(fileHandles.smsStatsData)}</span>
            <button
              className="btn-select-file"
              onClick={handleSelectSmsStatsData}
            >
              {fileHandles.smsStatsData ? 'Change File' : 'Select File'}
            </button>
          </div>
          <p className="file-description">Required for Career Mode server logs and statistics tracking.</p>
        </div>
        <div className="file-selection-item optional-file">
          <label>SMS Stats Config File: <span className="optional-badge">(Optional)</span></label>
          <div className="file-selection-controls">
            <span className="file-name">{getFileName(fileHandles.smsStatsConfig)}</span>
            <button
              className="btn-select-file"
              onClick={handleSelectSmsStatsConfig}
            >
              {fileHandles.smsStatsConfig ? 'Change File' : 'Select File'}
            </button>
          </div>
          <p className="file-description">Required for Career Mode statistics configuration and history settings.</p>
        </div>
      </div>
      {(fileHandles.serverCfg || fileHandles.smsRotate || fileHandles.smsStatsData || fileHandles.smsStatsConfig) && (
        <div className="file-actions">
          <button
            className="btn-clear-files"
            onClick={handleClearFileHandles}
          >
            Clear All File Selections
          </button>
        </div>
      )}
      {statusMessage && (
        <div className="status-message">
          {statusMessage}
        </div>
      )}
      {!isFileSystemSupported && (
        <div className="warning-message">
          <p>
            <strong>Note:</strong> Your browser doesn't support the File System Access API.
            You will not be able to update files directly from the UI.
          </p>
        </div>
      )}
      <div className="file-override-instructions">
        <h4>How to use:</h4>
        <ol>
          <li>Select your existing <code>server.cfg</code> and <code>sms_rotate_config.json</code> files (required for dedicated server)</li>
          <li><strong>Optional:</strong> Select <code>sms_stats_data.json</code> and <code>sms_stats_config.json</code> files for Career Mode features</li>
          <li>Configure your server settings in the other tabs</li>
          <li>Save your configuration</li>
          <li>Go to the main actions area and click "Update Files" to override the selected files</li>
        </ol>
      </div>
    </div>
  );
};

export default FilePathSettings; 