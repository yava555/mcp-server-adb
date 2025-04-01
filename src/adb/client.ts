import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * ADB Client class for managing Android Debug Bridge operations
 */
export class AdbClient {
    private static instance: AdbClient;
    private adbPath: string = 'adb';

    private constructor() {}

    /**
     * Get singleton instance of AdbClient
     */
    public static getInstance(): AdbClient {
        if (!AdbClient.instance) {
            AdbClient.instance = new AdbClient();
        }
        return AdbClient.instance;
    }

    /**
     * Execute an ADB command
     * @param command - The ADB command to execute
     * @returns Promise with command output
     */
    public async executeCommand(command: string): Promise<string> {
        try {
            const { stdout, stderr } = await execAsync(`${this.adbPath} ${command}`);
            if (stderr) {
                throw new Error(stderr);
            }
            return stdout.trim();
        } catch (error: any) {
            throw new Error(`ADB command failed: ${error.message}`);
        }
    }

    /**
     * Check if ADB server is running and start it if needed
     */
    public async startServer(): Promise<void> {
        try {
            await this.executeCommand('start-server');
        } catch (error: any) {
            throw new Error(`Failed to start ADB server: ${error.message}`);
        }
    }

    /**
     * Stop the ADB server
     */
    public async killServer(): Promise<void> {
        try {
            await this.executeCommand('kill-server');
        } catch (error: any) {
            throw new Error(`Failed to kill ADB server: ${error.message}`);
        }
    }

    /**
     * Get list of connected devices
     * @returns Promise with array of device serials
     */
    public async getDevices(): Promise<string[]> {
        try {
            const output = await this.executeCommand('devices');
            return output
                .split('\n')
                .slice(1) // Skip the "List of devices attached" header
                .filter(line => line.trim().length > 0)
                .map(line => line.split('\t')[0]);
        } catch (error: any) {
            throw new Error(`Failed to get device list: ${error.message}`);
        }
    }
} 