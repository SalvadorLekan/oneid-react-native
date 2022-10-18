import { createContext, useCallback, useMemo, useRef, useState } from "react";
import { Modal } from "react-native";
import WebView from "react-native-webview";

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

const OneidContext = createContext(null);

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
  return (
    <OneidContext.Provider value={null}>
      {children}
      <Modal
        visible={webviewOpen}
        onDismiss={closeModal}
        onRequestClose={closeModal}
        animationType="slide"
        presentationStyle="fullScreen">
        <WebView
          source={{ uri: uri }}
          onNavigationStateChange={({ mainDocumentURL, url }) => {
            if (url.includes("https://auth.oneidtech.com/undefined")) {
              let searchParams = new URLSearchParams(url);
              if (searchParams.get("token") && searchParams.get("user")) {
                let token = searchParams.get("token")!;
                let userString = searchParams.get("user")!;
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
