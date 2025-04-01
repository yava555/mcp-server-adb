import { AdbClient } from '../adb/client.js';
import { AdbCommands } from '../adb/commands.js';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Class for handling device operations
 */
export class DeviceController {
    private adbClient: AdbClient;
    private deviceSerial: string;

    constructor(deviceSerial: string) {
        this.adbClient = AdbClient.getInstance();
        this.deviceSerial = deviceSerial;
    }

    /**
     * Take a screenshot of the device
     * @param outputPath - Path to save the screenshot
     */
    public async takeScreenshot(outputPath: string): Promise<string> {
        const tempPath = '/sdcard/screenshot.png';
        
        try {
            // Capture screenshot to device
            await this.adbClient.executeCommand(
                AdbCommands.TAKE_SCREENSHOT(this.deviceSerial, tempPath)
            );

            // Create output directory if it doesn't exist
            const outputDir = path.dirname(outputPath);
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            // Pull screenshot from device
            await this.adbClient.executeCommand(
                `-s ${this.deviceSerial} pull ${tempPath} ${outputPath}`
            );

            // Clean up temporary file on device
            await this.adbClient.executeCommand(
                `-s ${this.deviceSerial} shell rm ${tempPath}`
            );

            return outputPath;
        } catch (error: any) {
            throw new Error(`Failed to take screenshot: ${error.message}`);
        }
    }

    /**
     * Get device information
     */
    public async getDeviceInfo(): Promise<{model: string; androidVersion: string}> {
        const model = await this.adbClient.executeCommand(
            AdbCommands.GET_DEVICE_MODEL(this.deviceSerial)
        );
        const androidVersion = await this.adbClient.executeCommand(
            AdbCommands.GET_ANDROID_VERSION(this.deviceSerial)
        );

        return {
            model,
            androidVersion
        };
    }
} 