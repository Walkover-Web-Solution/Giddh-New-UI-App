export function isElectron() {
    return (typeof process !== "undefined") && process.versions && (process.versions.electron !== undefined);
}