import { AdbClient } from '../adb/client.js';
import { AdbCommands } from '../adb/commands.js';

/**
 * Class for handling device input operations
 */
export class InputController {
    private adbClient: AdbClient;
    private deviceSerial: string;

    constructor(deviceSerial: string) {
        this.adbClient = AdbClient.getInstance();
        this.deviceSerial = deviceSerial;
    }

    /**
     * Tap on screen at specified coordinates
     * @param x - X coordinate
     * @param y - Y coordinate
     */
    public async tap(x: number, y: number): Promise<void> {
        await this.adbClient.executeCommand(AdbCommands.TAP(this.deviceSerial, x, y));
    }

    /**
     * Swipe on screen from one point to another
     * @param startX - Starting X coordinate
     * @param startY - Starting Y coordinate
     * @param endX - Ending X coordinate
     * @param endY - Ending Y coordinate
     */
    public async swipe(startX: number, startY: number, endX: number, endY: number): Promise<void> {
        await this.adbClient.executeCommand(
            AdbCommands.SWIPE(this.deviceSerial, startX, startY, endX, endY)
        );
    }

    /**
     * Input text on device
     * @param text - Text to input
     */
    public async inputText(text: string): Promise<void> {
        await this.adbClient.executeCommand(AdbCommands.INPUT_TEXT(this.deviceSerial, text));
    }

    /**
     * Press a key on device
     * @param keycode - Android keycode to press
     */
    public async pressKey(keycode: string): Promise<void> {
        await this.adbClient.executeCommand(AdbCommands.PRESS_KEY(this.deviceSerial, keycode));
    }
} 