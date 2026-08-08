import React, { createContext, useContext, useState } from 'react';

const IntentContext = createContext();

export const INTENTS = [
  { id: "budget", name: "Budget shopping", desc: "Prioritizes cost-efficiency & strict price ceilings under ₹2500", tag: "budget" },
  { id: "urgent", name: "Urgent purchase", desc: "Filters for items available with Express 24h delivery", tag: "urgent" },
  { id: "fashion", name: "Fashion matching", desc: "Matches clothing, shoes & style color combinations", tag: "fashion" },
  { id: "seasonal", name: "Seasonal shopping", desc: "Focuses on summer, winter & monsoon seasonal essentials", tag: "seasonal" },
  { id: "browse", name: "Casual browsing", desc: "Exploratory discovery across all popular catalog items", tag: "browse" }
];

export const IntentProvider = ({ children }) => {
  const [activeIntent, setActiveIntent] = useState("Casual browsing");
  const [clickstream, setClickstream] = useState([]);
  const [recentSearch, setRecentSearch] = useState("");

  const trackProductClick = (product) => {
    setClickstream(prev => [product, ...prev.slice(0, 9)]);
  };

  return (
    <IntentContext.Provider value={{
      activeIntent,
      setActiveIntent,
      intents: INTENTS,
      clickstream,
      trackProductClick,
      recentSearch,
      setRecentSearch
    }}>
      {children}
    </IntentContext.Provider>
  );
};

export const useIntent = () => useContext(IntentContext);
