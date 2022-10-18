import { createContext, useCallback, useMemo, useRef, useState } from "react";
import { Modal } from "react-native";
import WebView from "react-native-webview";
const baseURL = "https://auth.oneidtech.com/auth";
const OneidContext = createContext(null);
export const OneidProvider = ({ children, apiKey }) => {
    const uri = useMemo(() => `${baseURL}?type=login&api_key=${apiKey}`, [apiKey]);
    const [webviewOpen, setWebviewOpen] = useState(false);
    const resolveRef = useRef(null);
    const rejectRef = useRef(null);
    const closeModal = useCallback(() => {
        var _a;
        (_a = rejectRef.current) === null || _a === void 0 ? void 0 : _a.call(rejectRef, "Window Closed");
        setWebviewOpen(false);
    }, []);
    const login = useCallback(() => {
        setWebviewOpen(true);
        return new Promise((resolve, reject) => {
            resolveRef.current = resolve;
            rejectRef.current = reject;
        });
    }, []);
    return (<OneidContext.Provider value={null}>
      {children}
      <Modal visible={webviewOpen} onDismiss={closeModal} onRequestClose={closeModal} animationType="slide" presentationStyle="fullScreen">
        <WebView source={{ uri: uri }} onNavigationStateChange={({ mainDocumentURL, url }) => {
            var _a;
            if (url.includes("https://auth.oneidtech.com/undefined")) {
                let searchParams = new URLSearchParams(url);
                if (searchParams.get("token") && searchParams.get("user")) {
                    let token = searchParams.get("token");
                    let userString = searchParams.get("user");
                    const user = JSON.parse(userString);
                    (_a = resolveRef.current) === null || _a === void 0 ? void 0 : _a.call(resolveRef, {
                        token,
                        user,
                    });
                }
                closeModal();
            }
        }}/>
      </Modal>
    </OneidContext.Provider>);
};
