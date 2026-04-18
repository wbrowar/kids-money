export interface Adjustment {
    createdDate: string;
    dollarAdjustment: number;
    id: number;
    kid: number;
    percentAdjustment: number;
    totalToDate: number;
}

export interface Kid {
    adjustments?: Adjustment[]
    allowance: number;
    color: string;
    id: number;
    interest: number;
    name: string;
    photoUrl?: string;
    savingFor?: string;
    slug: string;
}

export enum LocalStorageItems {
    CurrentUser = 'current-user',
}

export enum Route {
    Admin = 'admin',
    Adjustments = 'adjustments',
    Home = 'home',
    Login = 'login',
    Logout = 'logout',
    Settings = 'settings',
}
export enum ServerRoute {
    GetKids = 'get-kids',
    Login = 'login',
}

export interface User {
    grownUp: boolean;
    id: number;
    username: string;
}
