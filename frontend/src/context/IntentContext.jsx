import React, { createContext, useContext, useState } from 'react';
import { usersAPI } from '../services/api';

const IntentContext = createContext();

export const IntentProvider = ({ children }) => {
  const [activeIntents, setActiveIntents] = useState([
    { tag: 'Endurance Running', weight: 0.8 },
    { tag: 'Wireless Audio', weight: 0.5 },
  ]);
  const [lastAction, setLastAction] = useState(null);

  const trackAction = async (productId, action, metadata = '') => {
    try {
      setLastAction({ productId, action, timestamp: new Date().toLocaleTimeString() });
      await usersAPI.trackBehavior(productId, action);
    } catch (err) {
      console.warn('Real-time behavior log warning:', err);
    }
  };

  return (
    <IntentContext.Provider value={{ activeIntents, setActiveIntents, trackAction, lastAction }}>
      {children}
    </IntentContext.Provider>
  );
};

export const useIntent = () => useContext(IntentContext);
