import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { Modal } from "react-native";
import WebView from "react-native-webview";
import "react-native-url-polyfill/auto";
const baseURL = "https://auth.oneidtech.com/auth";
let initialContext = null;
const OneidContext = createContext(initialContext);
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
    const value = useMemo(() => ({ login }), []);
    return (<OneidContext.Provider value={value}>
      {children}
      <Modal visible={webviewOpen} onDismiss={closeModal} onRequestClose={closeModal} animationType="slide" presentationStyle="fullScreen">
        <WebView source={{ uri: uri }} onNavigationStateChange={({ url }) => {
            var _a;
            if (url.includes("https://auth.oneidtech.com/undefined")) {
                let u = new URL(url);
                if (u.searchParams.get("token") && u.searchParams.get("user")) {
                    let token = u.searchParams.get("token");
                    let userString = u.searchParams.get("user");
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
export const useOneid = () => {
    const context = useContext(OneidContext);
    if (context === undefined) {
        throw new Error("useOneid must be used within a OneidProvider");
    }
    return context;
};
