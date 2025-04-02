# mcp-server-adb

A Model Context Protocol server for Android Debug Bridge (ADB) control

This is a TypeScript-based MCP server that implements an ADB control system. It allows AI assistants to interact with Android devices through ADB commands, providing:

- Resources for device discovery and information
- Tools for device control and app management
- Prompts for device analysis and diagnostics

## Features

### Resources
- List connected devices via `device://list`
- Access device information via `device://{serial}/info`
- View installed packages via `device://{serial}/packages`
- Capture screenshots via `device://{serial}/screenshot`

### Tools
**Device Control**
- `connect_device` - Connect to a specified device
- `disconnect_device` - Disconnect from a device

**Device Operations**
- `tap` - Tap on the screen
- `swipe` - Swipe on the screen
- `input_text` - Input text
- `press_key` - Press a key
- `take_screenshot` - Take a screenshot

**Application Management (Coming Soon)**
- `install_app` - Install APK
- `uninstall_app` - Uninstall application
- `start_app` - Launch application
- `stop_app` - Stop application

### Prompts
- `analyze_device` - Analyze device status and specifications
- `analyze_app_list` - Analyze installed applications
- `analyze_screen` - Analyze current screen content

## Prerequisites

- Node.js 16 or higher
- Android Debug Bridge (ADB) installed and available in PATH
- Android device with USB debugging enabled or network ADB enabled

## Development

Install dependencies:
```bash
npm install
```

Build the server:
```bash
npm run build
```

For development with auto-rebuild:
```bash
npm run watch
```

## Installation

To use with Claude Desktop, add the server config:

On MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
On Windows: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "mcp-server-adb": {
      "command": "/path/to/mcp-server-adb/build/index.js"
    }
  }
}
```

### Debugging

Since MCP servers communicate over stdio, debugging can be challenging. We recommend using the [MCP Inspector](https://github.com/modelcontextprotocol/inspector), which is available as a package script:

```bash
npm run inspector
```

The Inspector will provide a URL to access debugging tools in your browser.

### Device Setup

1. Enable USB debugging on your Android device:
    - Go to Settings > About phone
    - Tap "Build number" 7 times to enable Developer options
    - Go to Settings > Developer options
    - Enable "USB debugging"

2. For network debugging:
    - Connect device via USB first
    - Enable "Wireless debugging" in Developer options
    - Use `connect_device` tool with the device's IP address

## License

MIT
