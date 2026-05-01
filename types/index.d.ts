import {iconNames} from "../front-end/src/components/icon";

/**
 * Tracked changes in a kid’s value of their savings. This includes the dollar amount that changed and the current total after the change was added in.
 */
export interface Adjustment {
    /* The timestamp for the adjustment creation. */
    createdDate: string;
    /* The dollar amount added or subtracted by the adjustment. */
    dollarAdjustment: number;
    /* The ID number of the adjustment. When creating new adjustments, the ID will be generated automatically. */
    id: number;
    /* The ID number of the kid. */
    kid: number;
    /* The percentage used when creating an `interest` adjustment.` */
    percentAdjustment: number;
    /* A note about the reason for the adjustment. */
    reason: string;
    /* The sum of the value of `totalToDate` for the previous adjustment and `dollarAdjustment` value in this adjustment. */
    totalToDate: number;
}

/**
 * The type of adjustment that can be made when creating a new adjustment.
 *
 * Dollar adjustments will add or subtract the dollar amount to the current total. A note can be made for what the reason is for the adjustment (purchasing something, adding in tooth fairy money, etc...)
 *
 * Interest adjustments will calculate a dollar amount based on the `interest` and `interestThresholds` settings.
 */
export type AdjustmentType = 'dollar' | 'interest';

/**
 * Extra fields used when creating a new adjustment.
 */
export interface AdjustmentDto extends Pick<Adjustment, 'dollarAdjustment' | 'reason'> {
    /* The type of adjustment that will be made. */
    adjustmentType: AdjustmentType;
    /* The ID of the kid, as stored in the database. */
    kidId: number;
}

/**
 * The list of names that can be used as the `data-name` prop when using the `svg-icon` component.
 */
type IconName = (typeof iconNames)[number];

/**
 * The format used to store interest thresholds. This array of tuples should conform to this format:
 * [[MONEY_VALUE, INTEREST_RATE], [MONEY_VALUE, INTEREST_RATE], ...]
 *
 * The first MONEY_VALUE should be the highest, and it should descend until the last MONEY_VALUE.
 *
 * The INTEREST_RATE is the interest rate that will be used when the kid’s total is above the MONEY_VALUE. When the total is below the MONEY_VALUE of the last tuple, the default `interest` value will be used.
 *
 * So in this example, say the kid’s `interest` setting is `0.5` and the `interestThresholds` value is `[[300,0],[200,0.4]]`. When the total is $67, the interest rate will be `0.5`. When the total is $250, the interest will be `0.4`. And when the total is $300 or over, the interest rate will be `0` and no more interest will be added to the toal.
 */
export type InterestThresholds = number[][]

/**
 * The JavaScript-computed pair of colors used in `light` and `dark` mode. Charts use this since they do not currently support all CSS color formats.
 */
export type KidColors = { light: string; dark: string }

/**
 * Represents a person who money is being tracked for. This includes settings and other preferences configured by the admin.
 */
export interface Kid {
    /* A list of a year’s worth of transactions made for the kid. */
    adjustments?: Adjustment[]
    /* A color that represents the kid. It needs to be in CSS format, and the `light-dark()` function is recommended when wanting to support dark mode. */
    color: string;
    /* The `totalToDate` for the first item in the `adjustments` array. This is cached here so it doesn’t need to be recalculated for every place the kid’s total is shown. */
    currentTotal: number;
    /* The ID of the kid, as stored in the database */
    id: number;
    /* The default interest rate to be used when an `interest` adjustment is made. */
    interest: number;
    /* The interest thresholds to be used when an `interest` adjustment is made. */
    interestThresholds?: string;
    /* The name of the kid as they would like to be displayed. It can contain emoji and the name can be changed at any point. */
    name: string;
    /* A URL to an image hosted online. */
    photoUrl?: string;
    /* Something the kid is currently saving for. It can be an emoji or a string with a maximum character length of 25. */
    savingFor?: string;
    /* The money value for the subject of the `savingFor` field. This will get compared to USD, but it will be displayed in the currently-selected currency. */
    savingForValue: number;
    /* Calculated from the `color` value as a cache for performance. */
    themeColors: KidColors;
}

export type KidDto = Omit<Kid, 'themeColors' | 'currentTotal'>

/**
 * Represents a user of the application.
 */
export interface User {
    /* Enables the admin route and the ability to create and edit kids. */
    grownUp: boolean;
    /* The internal ID of the user stored in the database. */
    id: number;
    /* The ID of a kid as stored in the database. Think links the kid and the user to enabled more features when the user is logged in. */
    kidId?: number;
    /* The username of the user, as used to log into the application. */
    username: string;
}

/**
 * The properties to be supplied when updating a user record in the database.
 */
export type UserDto = Pick<User, 'kidId' | 'username'>
