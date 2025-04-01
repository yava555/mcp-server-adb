import { AdbClient } from './adb/client.js';
import { parseDeviceList, parseDeviceProps } from './adb/utils.js';
import { AdbCommands } from './adb/commands.js';

async function main() {
    try {
        // Get ADB client instance
        const adb = AdbClient.getInstance();
        
        console.log('Starting ADB server...');
        await adb.startServer();
        
        console.log('\nGetting connected devices...');
        const devices = await adb.executeCommand(AdbCommands.DEVICES);
        const parsedDevices = parseDeviceList(devices);
        console.log('Connected devices:', parsedDevices);
        
        if (parsedDevices.length > 0) {
            const device = parsedDevices[0];
            console.log(`\nGetting device info for ${device.serial}...`);
            
            // Get device model
            const model = await adb.executeCommand(AdbCommands.GET_DEVICE_MODEL(device.serial));
            console.log('Device model:', model);
            
            // Get Android version
            const version = await adb.executeCommand(AdbCommands.GET_ANDROID_VERSION(device.serial));
            console.log('Android version:', version);
            
            // Get installed packages
            console.log('\nGetting installed packages...');
            const packages = await adb.executeCommand(AdbCommands.LIST_PACKAGES(device.serial));
            const parsedPackages = packages.split('\n').slice(0, 5); // Show first 5 packages
            console.log('First 5 installed packages:', parsedPackages);
        }
        
    } catch (error: any) {
        console.error('Error:', error.message);
    }
}

main(); 