# MCP Inspector Guide

The MCP Inspector is an interactive developer tool for testing and debugging Model Context Protocol servers.

## Getting Started

### Installation and Basic Usage
The Inspector runs directly through npx without requiring installation:

```powershell
npx @modelcontextprotocol/inspector <command>
```

### Inspecting Local Servers
To inspect locally developed servers:

```powershell
npx @modelcontextprotocol/inspector node path/to/server/index.js args...
```

## Feature Overview

The Inspector provides several features for interacting with your MCP server:

### Server Connection Pane
* Allows selecting the transport for connecting to the server
* For local servers, supports customizing the command-line arguments and environment

### Resources Tab
* Lists all available resources
* Shows resource metadata (MIME types, descriptions)
* Allows resource content inspection
* Supports subscription testing

### Prompts Tab
* Displays available prompt templates
* Shows prompt arguments and descriptions
* Enables prompt testing with custom arguments
* Previews generated messages

### Tools Tab
* Lists available tools
* Shows tool schemas and descriptions
* Enables tool testing with custom inputs
* Displays tool execution results

### Notifications Pane
* Presents all logs recorded from the server
* Shows notifications received from the server

## Best Practices

### Development Workflow

1. **Start Development**
   * Launch Inspector with your server
   * Verify basic connectivity
   * Check capability negotiation

2. **Iterative Testing**
   * Make server changes
   * Rebuild the server
   * Reconnect the Inspector
   * Test affected features
   * Monitor messages

3. **Test Edge Cases**
   * Invalid inputs
   * Missing prompt arguments
   * Concurrent operations
   * Verify error handling and error responses
