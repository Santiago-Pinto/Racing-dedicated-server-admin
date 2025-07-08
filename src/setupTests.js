/* eslint-env jest */
import '@testing-library/jest-dom';

// Mock browser APIs
global.URL.revokeObjectURL = jest.fn();
global.document.createElement = jest.fn(() => ({
  click: jest.fn(),
}));
global.document.body.appendChild = jest.fn();
global.document.body.removeChild = jest.fn(); 