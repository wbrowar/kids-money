import {signal} from "@lit-labs/signals";
import {Route} from "types";

export const currentRoute = signal(Route.Login);
export const currentUser = signal('');
export const currentUserIsAdmin = signal(false);
export const errorDialogMessage = signal('');
export const screenshotMode = signal(false);