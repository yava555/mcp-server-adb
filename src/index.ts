#!/usr/bin/env node

/**
 * This is a template MCP server that implements a simple notes system.
 * It demonstrates core MCP concepts like resources and tools by allowing:
 * - Listing notes as resources
 * - Reading individual notes
 * - Creating new notes via a tool
 * - Summarizing all notes via a prompt
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { AdbClient } from "./adb/client.js";
import { parseDeviceList, parseDeviceProps } from "./adb/utils.js";

/**
 * Type alias for a note object.
 */
type Note = { title: string, content: string };

/**
 * Simple in-memory storage for notes.
 * In a real implementation, this would likely be backed by a database.
 */
const notes: { [id: string]: Note } = {
  "1": { title: "First Note", content: "This is note 1" },
  "2": { title: "Second Note", content: "This is note 2" }
};

// Initialize ADB client
const adbClient = AdbClient.getInstance();

/**
 * Create an MCP server with capabilities for resources (to list/read notes),
 * tools (to create new notes), and prompts (to summarize notes).
 */
const server = new Server(
  {
    name: "mcp-server-adb",
    version: "0.1.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
      prompts: {},
    },
  }
);

/**
 * Handler for listing available devices as resources
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  await adbClient.startServer();
  const devicesOutput = await adbClient.executeCommand('devices');
  const devices = parseDeviceList(devicesOutput);

  return {
    resources: [
      // List all devices
      {
        uri: "device://list",
        mimeType: "application/json",
        name: "Connected Devices",
        description: "List of all connected Android devices"
      },
      // Add individual device resources
      ...devices.map(device => ({
        uri: `device://${device.serial}/info`,
        mimeType: "application/json",
        name: `Device ${device.serial}`,
        description: `Information about device ${device.serial}`
      }))
    ]
  };
});

/**
 * Handler for reading device resources
 */
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const url = new URL(request.params.uri);
  
  // Handle different resource types
  switch (url.host) {
    case "list": {
      // Return list of all devices
      const devicesOutput = await adbClient.executeCommand('devices');
      const devices = parseDeviceList(devicesOutput);
      return {
        contents: [{
          uri: request.params.uri,
          mimeType: "application/json",
          text: JSON.stringify(devices, null, 2)
        }]
      };
    }
    
    default: {
      // Handle individual device info
      const serial = url.host;
      const type = url.pathname.slice(1); // Remove leading slash
      
      if (type === "info") {
        const propsOutput = await adbClient.executeCommand(`-s ${serial} shell getprop`);
        const deviceProps = parseDeviceProps(propsOutput);
        return {
          contents: [{
            uri: request.params.uri,
            mimeType: "application/json",
            text: JSON.stringify(deviceProps, null, 2)
          }]
        };
      }
      
      throw new Error(`Unknown resource type: ${type}`);
    }
  }
});

/**
 * Handler that lists available tools.
 * Exposes a single "create_note" tool that lets clients create new notes.
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "connect_device",
        description: "Connect to an Android device",
        inputSchema: {
          type: "object",
          properties: {
            host: {
              type: "string",
              description: "Host address of the device (e.g. 192.168.1.100:5555)"
            }
          },
          required: ["host"]
        }
      },
      {
        name: "disconnect_device",
        description: "Disconnect from an Android device",
        inputSchema: {
          type: "object",
          properties: {
            host: {
              type: "string",
              description: "Host address of the device to disconnect"
            }
          },
          required: ["host"]
        }
      }
    ]
  };
});

/**
 * Handler for the create_note tool.
 * Creates a new note with the provided title and content, and returns success message.
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "connect_device": {
      const host = String(request.params.arguments?.host);
      await adbClient.executeCommand(`connect ${host}`);
      return {
        content: [{
          type: "text",
          text: `Connected to device at ${host}`
        }]
      };
    }

    case "disconnect_device": {
      const host = String(request.params.arguments?.host);
      await adbClient.executeCommand(`disconnect ${host}`);
      return {
        content: [{
          type: "text",
          text: `Disconnected from device at ${host}`
        }]
      };
    }

    default:
      throw new Error("Unknown tool");
  }
});

/**
 * Handler that lists available prompts.
 * Exposes a single "summarize_notes" prompt that summarizes all notes.
 */
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: "analyze_device",
        description: "Analyze device status and information",
      }
    ]
  };
});

/**
 * Handler for the summarize_notes prompt.
 * Returns a prompt that requests summarization of all notes, with the notes' contents embedded as resources.
 */
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  if (request.params.name !== "analyze_device") {
    throw new Error("Unknown prompt");
  }

  const devicesOutput = await adbClient.executeCommand('devices');
  const devices = parseDeviceList(devicesOutput);

  const deviceInfoPromises = devices.map(async (device) => {
    const propsOutput = await adbClient.executeCommand(`-s ${device.serial} shell getprop`);
    const props = parseDeviceProps(propsOutput);
    return {
      serial: device.serial,
      state: device.state,
      properties: props
    };
  });

  const deviceInfo = await Promise.all(deviceInfoPromises);

  return {
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: "Please analyze the following Android devices:"
        }
      },
      {
        role: "user",
        content: {
          type: "text",
          text: JSON.stringify(deviceInfo, null, 2)
        }
      },
      {
        role: "user",
        content: {
          type: "text",
          text: "Provide a detailed analysis of the connected devices, including their status, Android version, and key specifications."
        }
      }
    ]
  };
});

/**
 * Start the server using stdio transport.
 * This allows the server to communicate via standard input/output streams.
 */
async function main() {
  try {
    // Start ADB server first
    await adbClient.startServer();
    
    // Then start MCP server
    const transport = new StdioServerTransport();
    await server.connect(transport);
  } catch (error) {
    console.error("Server error:", error);
    process.exit(1);
  }
}

main();
