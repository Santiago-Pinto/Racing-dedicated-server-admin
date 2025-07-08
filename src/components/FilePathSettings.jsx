import { useState, useEffect } from 'react';

const FilePathSettings = ({ fileHandles, setFileHandles, onFileHandlesChange }) => {
  const [isFileSystemSupported] = [ 'showOpenFilePicker' in window ];
  const [statusMessage, setStatusMessage] = useState('');

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

  const handleClearFileHandles = () => {
    setFileHandles({ serverCfg: null, smsRotate: null });
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
      </div>
      {(fileHandles.serverCfg || fileHandles.smsRotate) && (
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
          <li>Select your existing <code>server.cfg</code> and <code>sms_rotate_config.json</code> files</li>
          <li>Configure your server settings in the other tabs</li>
          <li>Save your configuration</li>
          <li>Go to the main actions area and click "Update Files" to override the selected files</li>
        </ol>
      </div>
    </div>
  );
};

export default FilePathSettings; 