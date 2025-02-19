import React, { createContext, useState, useContext } from 'react';

// Create a context for the vote state and language
const VoteContext = createContext();

export const useVote = () => useContext(VoteContext);

export const VoteProvider = ({ children }) => {
  const [hasVoted, setHasVoted] = useState(false);

  const toggleVote = () => {
    setHasVoted(!hasVoted);
  };



  return (
    <VoteContext.Provider value={{ toggleVote }}>
      {children}
    </VoteContext.Provider>
  );
};
