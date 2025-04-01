/**
 * Collection of ADB commands
 */
export const AdbCommands = {
    // Device commands
    DEVICES: 'devices',
    START_SERVER: 'start-server',
    KILL_SERVER: 'kill-server',
    
    // Device info commands
    GET_DEVICE_INFO: (serial: string) => `-s ${serial} shell getprop`,
    GET_DEVICE_MODEL: (serial: string) => `-s ${serial} shell getprop ro.product.model`,
    GET_ANDROID_VERSION: (serial: string) => `-s ${serial} shell getprop ro.build.version.release`,
    
    // Package management commands
    LIST_PACKAGES: (serial: string) => `-s ${serial} shell pm list packages`,
    INSTALL_APP: (serial: string, apkPath: string) => `-s ${serial} install ${apkPath}`,
    UNINSTALL_APP: (serial: string, packageName: string) => `-s ${serial} uninstall ${packageName}`,
    
    // App control commands
    START_APP: (serial: string, packageName: string) => `-s ${serial} shell monkey -p ${packageName} 1`,
    STOP_APP: (serial: string, packageName: string) => `-s ${serial} shell am force-stop ${packageName}`,
    
    // Input commands
    TAP: (serial: string, x: number, y: number) => `-s ${serial} shell input tap ${x} ${y}`,
    SWIPE: (serial: string, x1: number, y1: number, x2: number, y2: number) => 
        `-s ${serial} shell input swipe ${x1} ${y1} ${x2} ${y2}`,
    INPUT_TEXT: (serial: string, text: string) => `-s ${serial} shell input text "${text}"`,
    PRESS_KEY: (serial: string, keycode: string) => `-s ${serial} shell input keyevent ${keycode}`,
    
    // Screenshot command
    TAKE_SCREENSHOT: (serial: string, path: string) => `-s ${serial} shell screencap -p ${path}`,
}; 