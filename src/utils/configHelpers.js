import { tracksData, carsData, weatherData } from '../data/ams2Data';
import { sessionFlags } from '../data/sessionFlags';

// Validate server name for folder creation
export const validateServerName = (name) => {
  // Remove or replace invalid characters for folder names
  let cleaned = name
    .replace(/[<>:"/\\|?*]/g, '') // Remove invalid characters
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/^\.+|\.+$/g, '') // Remove leading/trailing dots
    .substring(0, 255); // Limit length
  // Remove leading/trailing underscores
  cleaned = cleaned.replace(/^_+|_+$/g, '');
  return cleaned;
};

// Convert flags array to string format for config files
export const flagsToString = (flags) => {
  // Build a map from value to name from sessionFlags
  const flagMap = new Map(sessionFlags.map(f => [f.value, f.name]));
  return flags.map(flag => flagMap.get(flag) || `FLAG_${flag}`).join(',');
};

// Convert flags array to summed number for server.cfg format
export const flagsToNumber = (flags) => {
  return flags.reduce((sum, flag) => sum + flag, 0);
};

// Convert damage type to string
export const damageTypeToString = (type) => {
  switch (type) {
  case 0: return 'OFF';
  case 1: return 'VISUAL_ONLY';
  case 2: return 'PERFORMANCEIMPACTING';
  case 3: return 'FULL';
  default: return 'FULL';
  }
};

// Convert tire wear type to string
export const tireWearTypeToString = (type) => {
  switch (type) {
  case 2: return 'X5';
  case 3: return 'X4';
  case 4: return 'X3';
  case 5: return 'X2';
  case 6: return 'STANDARD';
  case 8: return 'OFF';
  default: return 'STANDARD';
  }
};

// Convert fuel usage type to string
export const fuelUsageTypeToString = (type) => {
  switch (type) {
  case 0: return 'STANDARD';
  case 2: return 'OFF';
  case 3: return 'X5';
  case 4: return 'X4';
  case 5: return 'X3';
  case 6: return 'X2';
  default: return 'STANDARD';
  }
};

// Convert penalties type to string
export const penaltiesTypeToString = (type) => {
  switch (type) {
  case 0: return 'NONE';
  case 1: return 'FULL';
  default: return 'FULL';
  }
};

// Convert damage scale to string
export const damageScaleToString = (type) => {
  switch (type) {
  case 0: return 'LOW';
  case 1: return 'MEDIUM';
  case 2: return 'HIGH';
  case 3: return 'MAX';
  default: return 'MEDIUM';
  }
};

// Convert pit control to string
export const pitControlToString = (type) => {
  switch (type) {
  case 0: return 'Auto';
  case 1: return 'Manual';
  default: return 'Auto';
  }
};

// Convert start type to rolling start value
export const startTypeToRollingStart = (type) => {
  switch (type) {
  case 0: return 0; // Standing start
  case 1: return 1; // Rolling start
  default: return 0; // Default to standing start
  }
};

// Get weather name by ID
export const getWeatherName = (weatherId) => {
  const weather = weatherData.find(w => w.value === weatherId);
  return weather ? weather.name : 'Clear';
};

// Get track name by ID
export const getTrackNameById = (trackId) => {
  const track = tracksData.find(t => t.id === trackId);
  return track ? track.name : 'Interlagos_GP';
};

// Get vehicle class name by ID
export const getVehicleClassNameById = (classId) => {
  const vehicleClass = carsData.find(c => c.value === classId);
  return vehicleClass ? vehicleClass.name : 'StockCarV8';
};

// Get track name
export const getTrackName = (trackId) => {
  const track = tracksData.find(t => t.id === trackId);
  return track ? track.name : 'Unknown Track';
};

// Get vehicle class name
export const getVehicleClassName = (classId) => {
  const vehicleClass = carsData.find(c => c.value === classId);
  return vehicleClass ? vehicleClass.translated_name : 'Unknown Class';
};

// Helper function to safely convert values to strings for input fields
export const getInputValue = (value) => {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'number' && isNaN(value)) {
    return '';
  }
  return String(value);
};
