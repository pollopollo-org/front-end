/**
 * Helper method that creates a promise, that will be resolved once the
 * specified timeout (in milliseconds) expires.
 */
export async function asyncTimeout(timeout: number): Promise<void> {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, timeout);
    });
}
