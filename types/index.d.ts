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

export type AdjustmentType = 'dollar' | 'interest';

/**
 * TODO
 */
export interface AdjustmentDto extends Pick<Adjustment, 'dollarAdjustment', 'reason'> {
    adjustmentType: AdjustmentType;
    kidId: number;
}

/**
 * TODO
 */
type IconName = (typeof iconNames)[number];

/**
 * TODO
 */
export type InterestThresholds = number[][]

/**
 * A lookup table of kids and their adjustments.
 */
export type KidAdjustments = Record<Kid['id'], Adjustment[]>

/**
 * Represents a person who money is being tracked for. This includes settings and other preferences configured by the admin.
 */
export interface Kid {
    adjustments?: Adjustment[]
    color: string;
    id: number;
    interest: number;
    interestThresholds?: string;
    name: string;
    photoUrl?: string;
    savingFor?: string;
    savingForValue: number;
}

/**
 * Represents a user of the application.
 */
export interface User {
    /* Enables the admin route and the ability to create and edit kids. */
    grownUp: boolean;
    /* The internal ID of the user stored in the database. */
    id: number;
    /* TODO */
    kidId?: number;
    /* The username of the user, as used to log into the application. */
    username: string;
}

/**
 * TODO
 */
export type UserDto = Pick<User, 'kidId', 'username'>
