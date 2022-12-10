export interface Adjustment {
    createdDate: string;
    dollarAdjustment: number;
    id: number;
    kid: number;
    percentAdjustment: number;
    totalToDate: number;
}

export interface Kid {
    allowance: number;
    color: string;
    id: number;
    interest: number;
    name: string;
    photoUrl?: string;
    savingFor?: string;
    slug: string;
}

export interface User {
    grownUp: boolean;
    id: number;
    username: string;
}
