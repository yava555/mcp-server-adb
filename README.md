# MCP Server for Android Debug Bridge

这是一个基于 Model Context Protocol (MCP) 的服务器，用于控制和管理 Android 设备。通过该服务器，你可以使用 MCP 协议来执行各种 Android 设备操作。

## 功能特性

### Resources (资源)
- `device://list` - 列出所有已连接的 Android 设备
- `device://{serial}/info` - 获取特定设备的详细信息
- `device://{serial}/packages` - 获取设备上安装的应用列表
- `device://{serial}/screenshot` - 获取设备的屏幕截图

### Tools (工具)

**设备控制**
- `connect_device` - 连接指定设备
- `disconnect_device` - 断开设备连接

**设备操作**
- `tap` - 点击屏幕
- `swipe` - 滑动屏幕
- `input_text` - 输入文本
- `press_key` - 按键操作
- `take_screenshot` - 截图

**应用管理（即将推出）**
- `install_app` - 安装 APK
- `uninstall_app` - 卸载应用
- `start_app` - 启动应用
- `stop_app` - 停止应用

### Prompts (提示)
- `analyze_device` - 分析设备状态和信息
- `analyze_app_list` - 分析已安装应用列表（即将推出）
- `analyze_screen` - 分析当前屏幕内容（即将推出）

## 系统要求

- Node.js >= 18
- Android Debug Bridge (adb) 已安装并配置在系统路径中
- 支持的操作系统：macOS, Linux, Windows

## 安装

1. 克隆仓库：
```bash
git clone [repository-url]
cd mcp-server-adb
```

2. 安装依赖：
```bash
npm install
```

3. 构建项目：
```bash
npm run build
```

## 使用方法

1. 确保 ADB 已经正确安装并可以在命令行中使用：
```bash
adb version
```

2. 启动服务器：
```bash
npm start
```

### 工具使用示例

**连接设备**
```json
{
  "name": "connect_device",
  "arguments": {
    "host": "192.168.1.100:5555"
  }
}
```

**点击屏幕**
```json
{
  "name": "tap",
  "arguments": {
    "serial": "device_serial",
    "x": 100,
    "y": 200
  }
}
```

**滑动屏幕**
```json
{
  "name": "swipe",
  "arguments": {
    "serial": "device_serial",
    "startX": 100,
    "startY": 200,
    "endX": 300,
    "endY": 400
  }
}
```

**输入文本**
```json
{
  "name": "input_text",
  "arguments": {
    "serial": "device_serial",
    "text": "Hello World"
  }
}
```

**按键操作**
```json
{
  "name": "press_key",
  "arguments": {
    "serial": "device_serial",
    "keycode": "KEYCODE_HOME"
  }
}
```

**截图**
```json
{
  "name": "take_screenshot",
  "arguments": {
    "serial": "device_serial",
    "path": "./screenshots/screen.png"
  }
}
```

## 开发

### 项目结构
```
src/
├── index.ts              // 主入口文件
├── adb/
│   ├── client.ts        // ADB 客户端封装
│   ├── commands.ts      // ADB 命令集
│   └── utils.ts         // 工具函数
├── resources/
│   ├── devices.ts       // 设备资源处理
│   ├── packages.ts      // 应用资源处理
│   └── screenshots.ts   // 截图资源处理
├── tools/
│   ├── device.ts        // 设备控制工具
│   ├── app.ts          // 应用管理工具
│   └── input.ts        // 输入控制工具
└── prompts/
    └── analyzers.ts     // 分析器提示
```

### 构建和测试
```bash
# 构建项目
npm run build

# 运行测试
npm test
```

## 许可证

MIT License
