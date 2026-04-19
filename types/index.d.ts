/**
 * Currency codes used to convert from USD to selected currency.
 */
export enum Currency {
    Euro = 'EUR',
    JapaneseYen = 'JPY',
    MalaysianRinggit = 'MYR',
    SingaporeDollar = 'SGD',
    UnitedStatesDollar = 'USD',
}

/**
 * Tracked changes in a kid’s value of their savings. This includes the dollar amount that changed and the current total after the change was added in.
 */
export interface Adjustment {
    createdDate: string;
    dollarAdjustment: number;
    id: number;
    kid: number;
    percentAdjustment: number;
    reason: string;
    totalToDate: number;
}

/**
 * A lookup table of kids and their adjustments.
 */
export type KidAdjustments = Record<typeof Kid['id'], Adjustment[]>

/**
 * Represents a person who money is being tracked for. This includes settings and other preferences configured by the admin.
 */
export interface Kid {
    adjustments?: Adjustment[]
    color: string;
    id: number;
    interest: number;
    name: string;
    photoUrl?: string;
    savingFor?: string;
    savingForValue?: number;
}

/**
 * Keys for items stored in local storage.
 */
export enum LocalStorageItems {
    /* Stores the username and grownUp status of the logged-in user. */
    CurrentUser = 'current-user',
    /* Stores the latest value of the screenshot mode setting. */
    ScreenshotMode = 'screenshot-mode',
    /* Stores the key of the selected currency. */
    SelectedCurrency = 'selected-currency',
}

/**
 * A list of all routes available in the application.
 */
export enum Route {
    /* Displays all adjustments and related data for selected kid. */
    Adjustments = 'adjustments',
    /* Displays a list of all kids and a dashboard of combined data. */
    Home = 'home',
    /* The login page for the application. */
    Login = 'login',
    /* Logs the user out of the application. */
    Logout = 'logout',
    /* Allows admins to create and remove kids and adjust settings for the application. */
    Settings = 'settings',
}

/**
 * A list of server endpoints used through the application.
 */
export enum ServerRoute {
    /* Gets kid settings and all adjustments made in the past calendar year. */
    GetKids = 'get-kids',
    /* Uses a username and password to log the user in. */
    Login = 'login',
}

/**
 * Represents a user of the application.
 */
export interface User {
    /* Enables the admin route and the ability to create and edit kids. */
    grownUp: boolean;
    /* The internal ID of the user stored in the database. */
    id: number;
    /* The username of the user, as used to log into the application. */
    username: string;
}
