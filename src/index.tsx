import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { Modal } from "react-native";
import WebView from "react-native-webview";
import "react-native-url-polyfill/auto";
const baseURL = "https://auth.oneidtech.com/auth";

export interface User {
  _id: string;
  username: string;
  oneId: string;
  email: string;
  isVerified: boolean;
  fullName?: string;
  gender?: string;
  dob?: string;
  phone?: string;
  maritalStatus?: string;
  primaryAddress?: string;
  secondaryAddress?: string;
  country?: string;
  postalCode?: string;
  [key: string]: any;
}

type Resp = {
  token: string;
  user: User;
};

let initialContext: {
  login: () => Promise<Resp>;
} | null = null;

const OneidContext = createContext(initialContext!);

interface OneidProviderProps {
  children: React.ReactNode;
  apiKey: string;
}

export const OneidProvider = ({ children, apiKey }: OneidProviderProps) => {
  const uri = useMemo(() => `${baseURL}?type=login&api_key=${apiKey}`, [apiKey]);
  const [webviewOpen, setWebviewOpen] = useState(false);
  const resolveRef = useRef<((value: Resp | PromiseLike<Resp>) => void) | null>(null);
  const rejectRef = useRef<null | ((value?: any) => void)>(null);

  const closeModal = useCallback(() => {
    rejectRef.current?.("Window Closed");
    setWebviewOpen(false);
  }, []);
  const login = useCallback(() => {
    setWebviewOpen(true);
    return new Promise<Resp>((resolve, reject) => {
      resolveRef.current = resolve;
      rejectRef.current = reject;
    });
  }, []);

  const value = useMemo(() => ({ login }), []);

  return (
    <OneidContext.Provider value={value}>
      {children}
      <Modal
        visible={webviewOpen}
        onDismiss={closeModal}
        onRequestClose={closeModal}
        animationType="slide"
        presentationStyle="fullScreen">
        <WebView
          source={{ uri: uri }}
          onNavigationStateChange={({ url }) => {
            if (url.includes("https://auth.oneidtech.com/undefined")) {
              let u = new URL(url);
              if (u.searchParams.get("token") && u.searchParams.get("user")) {
                let token = u.searchParams.get("token")!;
                let userString = u.searchParams.get("user")!;
                const user = JSON.parse(userString);
                resolveRef.current?.({
                  token,
                  user,
                });
              }
              closeModal();
            }
          }}
        />
      </Modal>
    </OneidContext.Provider>
  );
};

export const useOneid = () => {
  const context = useContext(OneidContext);
  if (context === undefined) {
    throw new Error("useOneid must be used within a OneidProvider");
  }
  return context;
};
