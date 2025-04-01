/**
 * Utility functions for ADB operations
 */

/**
 * Parse device list output from ADB
 * @param output - Raw output from ADB devices command
 * @returns Array of device objects with serial and state
 */
export function parseDeviceList(output: string): Array<{ serial: string; state: string }> {
    return output
        .split('\n')
        .slice(1) // Skip the "List of devices attached" header
        .filter(line => line.trim().length > 0)
        .map(line => {
            const [serial, state] = line.split('\t');
            return { serial, state };
        });
}

/**
 * Parse package list output from ADB
 * @param output - Raw output from package list command
 * @returns Array of package names
 */
export function parsePackageList(output: string): string[] {
    return output
        .split('\n')
        .filter(line => line.startsWith('package:'))
        .map(line => line.replace('package:', '').trim());
}

/**
 * Parse device properties output
 * @param output - Raw output from getprop command
 * @returns Object containing device properties
 */
export function parseDeviceProps(output: string): Record<string, string> {
    const props: Record<string, string> = {};
    const propRegex = /\[([^\]]+)\]: \[([^\]]*)\]/g;
    let match;

    while ((match = propRegex.exec(output)) !== null) {
        const [, key, value] = match;
        if (key && value) {
            props[key] = value;
        }
    }

    return props;
}

/**
 * Validate serial number format
 * @param serial - Device serial number to validate
 * @returns boolean indicating if serial is valid
 */
export function isValidSerial(serial: string): boolean {
    return /^[A-Za-z0-9._-]+$/.test(serial);
}

/**
 * Escape special characters in text input
 * @param text - Text to escape
 * @returns Escaped text safe for shell input
 */
export function escapeShellInput(text: string): string {
    return text.replace(/[&;$"'|<>()]/g, '\\$&');
} 