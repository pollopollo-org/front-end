import platform from "platform";

/**
 * Detects whether the user is accessing the website from an iOS-based device.
 */
export function isIOS(): boolean {
    return !!(platform.os && platform.os.family === "iOS");
}
