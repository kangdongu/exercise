import { createContext, ReactNode, useContext, useState } from "react";


interface BadgesContextType {
  selectedBadges: string[];
  setSelectedBadges: React.Dispatch<React.SetStateAction<string[]>>;
}

const BadgesContext = createContext<BadgesContextType | undefined>(undefined);

export const BadgesProvider = ({ children }: { children: ReactNode }) => {
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);

  return (
    <BadgesContext.Provider value={{ selectedBadges, setSelectedBadges }}>
      {children}
    </BadgesContext.Provider>
  );
};

export const useBadgesContext = () => {
  const context = useContext(BadgesContext);
  if (!context) {
    throw new Error("useBadgesContext must be used within a BadgesProvider");
  }
  return context;
};
