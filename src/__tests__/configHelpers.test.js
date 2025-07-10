/* eslint-env jest */
import {
  validateServerName,
  flagsToString,
  damageTypeToString,
  tireWearTypeToString,
  fuelUsageTypeToString,
  penaltiesTypeToString,
  getWeatherName,
  getTrackNameById,
  getVehicleClassNameById,
  getInputValue,
} from '../utils/configHelpers';

// Mock the data imports
jest.mock('../data/ams2Data', () => ({
  tracksData: [
    { id: -1478712571, name: 'Interlagos_GP', gridsize: 24 },
    { id: 123456, name: 'Test_Track', gridsize: 20 },
  ],
  carsData: [
    { value: 492525831, name: 'StockCarV8' },
    { value: 123456, name: 'Test_Car' },
  ],
  weatherData: [
    { value: -934211870, name: 'Clear' },
    { value: 123456, name: 'Test_Weather' },
  ],
}));

describe('configHelpers', () => {
  describe('validateServerName', () => {
    it('should remove invalid characters from server name', () => {
      expect(validateServerName('My Server <>"|?*')).toBe('My_Server');
    });

    it('should replace spaces with underscores', () => {
      expect(validateServerName('My Server Name')).toBe('My_Server_Name');
    });

    it('should remove leading and trailing dots', () => {
      expect(validateServerName('...My Server...')).toBe('My_Server');
    });

    it('should limit length to 255 characters', () => {
      const longName = 'a'.repeat(300);
      expect(validateServerName(longName).length).toBeLessThanOrEqual(255);
    });

    it('should return empty string for invalid names', () => {
      expect(validateServerName('')).toBe('');
      expect(validateServerName('...')).toBe('');
    });
  });

  describe('flagsToString', () => {
    it('should convert flags array to string format', () => {
      const flags = [8, 32, 64];
      const result = flagsToString(flags);
      expect(result).toBe('ALLOW_CUSTOM_VEHICLE_SETUP,ABS_ALLOWED,SC_ALLOWED');
    });

    it('should handle unknown flags', () => {
      const flags = [999999];
      const result = flagsToString(flags);
      expect(result).toBe('FLAG_999999');
    });

    it('should handle empty array', () => {
      const result = flagsToString([]);
      expect(result).toBe('');
    });

    it('should map all sessionFlags values to their correct names', () => {
      // Import the sessionFlags mapping
      const { sessionFlags } = require('../data/sessionFlags');
      const allFlagValues = sessionFlags.map(f => f.value);
      const allFlagNames = sessionFlags.map(f => f.name);
      const result = flagsToString(allFlagValues);
      expect(result).toBe(allFlagNames.join(','));
    });
  });

  describe('type conversion functions', () => {
    describe('damageTypeToString', () => {
      it('should convert damage types correctly', () => {
        expect(damageTypeToString(0)).toBe('OFF');
        expect(damageTypeToString(1)).toBe('VISUAL_ONLY');
        expect(damageTypeToString(2)).toBe('PERFORMANCEIMPACTING');
        expect(damageTypeToString(3)).toBe('FULL');
        expect(damageTypeToString(999)).toBe('FULL'); // default
      });
    });

    describe('tireWearTypeToString', () => {
      it('should convert tire wear types correctly', () => {
        expect(tireWearTypeToString(2)).toBe('X5');
        expect(tireWearTypeToString(3)).toBe('X4');
        expect(tireWearTypeToString(4)).toBe('X3');
        expect(tireWearTypeToString(5)).toBe('X2');
        expect(tireWearTypeToString(6)).toBe('STANDARD');
        expect(tireWearTypeToString(8)).toBe('OFF');
        expect(tireWearTypeToString(999)).toBe('STANDARD'); // default
      });
    });

    describe('fuelUsageTypeToString', () => {
      it('should convert fuel usage types correctly', () => {
        expect(fuelUsageTypeToString(0)).toBe('STANDARD');
        expect(fuelUsageTypeToString(2)).toBe('OFF');
        expect(fuelUsageTypeToString(3)).toBe('X5');
        expect(fuelUsageTypeToString(4)).toBe('X4');
        expect(fuelUsageTypeToString(5)).toBe('X3');
        expect(fuelUsageTypeToString(6)).toBe('X2');
        expect(fuelUsageTypeToString(999)).toBe('STANDARD'); // default
      });
    });

    describe('penaltiesTypeToString', () => {
      it('should convert penalties types correctly', () => {
        expect(penaltiesTypeToString(0)).toBe('NONE');
        expect(penaltiesTypeToString(1)).toBe('FULL');
        expect(penaltiesTypeToString(999)).toBe('FULL'); // default
      });
    });
  });

  describe('data lookup functions', () => {
    describe('getWeatherName', () => {
      it('should return weather name for valid ID', () => {
        expect(getWeatherName(-934211870)).toBe('Clear');
      });

      it('should return default for invalid ID', () => {
        expect(getWeatherName(999999)).toBe('Clear');
      });
    });

    describe('getTrackNameById', () => {
      it('should return track name for valid ID', () => {
        expect(getTrackNameById(-1478712571)).toBe('Interlagos_GP');
      });

      it('should return default for invalid ID', () => {
        expect(getTrackNameById(999999)).toBe('Interlagos_GP');
      });
    });

    describe('getVehicleClassNameById', () => {
      it('should return vehicle class name for valid ID', () => {
        expect(getVehicleClassNameById(492525831)).toBe('StockCarV8');
      });

      it('should return default for invalid ID', () => {
        expect(getVehicleClassNameById(999999)).toBe('StockCarV8');
      });
    });
  });

  describe('getInputValue', () => {
    it('should convert values to strings safely', () => {
      expect(getInputValue(123)).toBe('123');
      expect(getInputValue('test')).toBe('test');
      expect(getInputValue(0)).toBe('0');
    });

    it('should handle null, undefined, and NaN', () => {
      expect(getInputValue(null)).toBe('');
      expect(getInputValue(undefined)).toBe('');
      expect(getInputValue(NaN)).toBe('');
    });

    it('should handle empty values', () => {
      expect(getInputValue('')).toBe('');
      expect(getInputValue(0)).toBe('0');
    });
  });
}); 