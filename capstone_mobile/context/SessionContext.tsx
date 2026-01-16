import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";
import SessionExpiredModal from "../components/SessionExpiredModal";

type SessionContextType = {
  showSessionExpired: () => void;
};

const SessionContext = createContext<SessionContextType | null>(null);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [visible, setVisible] = useState(false);
  const triggeredRef = useRef(false);

  const showSessionExpired = () => {
    if (!triggeredRef.current) {
      triggeredRef.current = true;
      setVisible(true);
    }
  };

  const reset = () => {
    triggeredRef.current = false;
    setVisible(false);
  };
  
  useEffect(() => {
    (global as any).sessionExpired = showSessionExpired;

    return () => {
      (global as any).sessionExpired = undefined;
    };
  }, []);

  return (
    <SessionContext.Provider value={{ showSessionExpired }}>
      {children}
      <SessionExpiredModal visible={visible} onClose={reset} />
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside SessionProvider");
  return ctx;
};
