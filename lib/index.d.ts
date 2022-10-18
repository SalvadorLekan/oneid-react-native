/// <reference types="react" />
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
declare type Resp = {
    token: string;
    user: User;
};
interface OneidProviderProps {
    children: React.ReactNode;
    apiKey: string;
}
export declare const OneidProvider: ({ children, apiKey }: OneidProviderProps) => JSX.Element;
export declare const useOneid: () => {
    login: () => Promise<Resp>;
};
export {};
//# sourceMappingURL=index.d.ts.map