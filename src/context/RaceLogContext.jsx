import { createContext, useContext, useState } from 'react';

const RaceLogContext = createContext();

export function RaceLogProvider({ children }) {
  const [raceLog, setRaceLog] = useState(null);
  return (
    <RaceLogContext.Provider value={{ raceLog, setRaceLog }}>
      {children}
    </RaceLogContext.Provider>
  );
}

export function useRaceLog() {
  return useContext(RaceLogContext);
} 