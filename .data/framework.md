# MCP Server Framework Documentation

## Overview
The Model Context Protocol (MCP) server is implemented as a pure Node.js application that follows the JSON-RPC 2.0 specification. This document outlines the key components and message structures required for MCP compliance.

## Server Architecture

### 1. Core Components
- **Server Class**: Main class handling message processing and tool management
- **Logger Utility**: Custom logging system for debugging and monitoring
- **Tool Registry**: Map of available tools and their handlers

### 2. Protocol Implementation
- Protocol Version: 2024-11-05
- Transport: STDIO
- Message Format: JSON-RPC 2.0

### 3. Message Types

#### Initialize Request
```json
{
  "jsonrpc": "2.0",
  "id": 0,
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "capabilities": {
      "sampling": {},
      "roots": {
        "listChanged": true
      }
    },
    "clientInfo": {
      "name": "client-name",
      "version": "version-string"
    }
  }
}
```

#### Initialize Response
```json
{
  "jsonrpc": "2.0",
  "id": 0,
  "result": {
    "serverInfo": {
      "name": "server-name",
      "version": "version-string"
    },
    "protocolVersion": "2024-11-05",
    "capabilities": {
      "tools": {
        "toolName": {
          "name": "toolName",
          "description": "tool description",
          "inputSchema": {
            "type": "object",
            "properties": {},
            "additionalProperties": false,
            "required": []
          }
        }
      }
    }
  }
}
```

#### Tools/List Request
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list",
  "params": {}
}
```

#### Tools/List Response
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [
      {
        "name": "toolName",
        "description": "tool description",
        "inputSchema": {
          "type": "object",
          "properties": {},
          "additionalProperties": false,
          "required": []
        }
      }
    ]
  }
}
```

#### Tools/Call Request
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "_meta": {
      "progressToken": 0
    },
    "name": "toolName",
    "arguments": {}
  }
}
```

#### Tools/Call Response
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "tool-result-string"
      }
    ]
  }
}
```

## Implementation Requirements

### 1. Server State Management
- Track initialization state
- Maintain tool registry
- Handle connection lifecycle

### 2. Message Processing
- Parse incoming JSON-RPC messages
- Validate message format and contents
- Route messages to appropriate handlers
- Send properly formatted responses

### 3. Tool Implementation
- Define tool interface (name, description, inputSchema)
- Implement tool handlers
- Validate tool inputs
- Format tool outputs

### 4. Error Handling
- Send proper JSON-RPC error responses
- Log errors with appropriate severity
- Handle invalid requests gracefully
- Implement timeout handling

### 5. Logging
- Log all incoming/outgoing messages
- Track server state changes
- Record tool executions
- Debug information for troubleshooting

## Best Practices

1. **Message Handling**
   - Always validate message format
   - Check initialization state before processing tool requests
   - Use proper JSON-RPC 2.0 error codes

2. **Tool Development**
   - Define clear input schemas
   - Return structured content arrays
   - Implement proper error handling
   - Keep tool execution time reasonable

3. **Response Format**
   - Follow exact MCP response structures
   - Include all required fields
   - Format tool results correctly
   - Handle errors consistently

4. **Logging**
   - Log all significant events
   - Include relevant context
   - Use appropriate log levels
   - Maintain debugging information

## Testing
1. Use MCP Inspector for manual testing
2. Verify all message types
3. Test error conditions
4. Validate tool execution
5. Check response formats