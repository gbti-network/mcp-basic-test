# MCP Debugging Guide

A comprehensive guide to debugging Model Context Protocol (MCP) integrations.

## Debugging Tools Overview

MCP provides several tools for debugging at different levels:

1. **MCP Inspector**
   * Interactive debugging interface
   * Direct server testing
   * See the Inspector guide for details

2. **Claude Desktop Developer Tools**
   * Integration testing
   * Log collection
   * Chrome DevTools integration

3. **Server Logging**
   * Custom logging implementations
   * Error tracking
   * Performance monitoring

## Common Issues

### Working Directory
When using MCP servers with Windsurf:

* The working directory for servers launched via `mcp_config.json` may be undefined
* Always use absolute paths in your configuration
* For testing servers directly via command line, the working directory will be where you run the command

For example in `mcp_config.json`, use:

```json
{
  "command": "npx",
  "args": ["--yes", "node", "D:/_Outfits/GBTI/MCP Servers/TestMCP/index.js"]
}
```

Instead of relative paths like `./index.js`

### Environment Variables
MCP servers inherit only a subset of environment variables automatically.

To override the default variables or provide your own, you can specify an `env` key in `mcp_config.json`:

```json
{
  "myserver": {
    "command": "mcp-server-myapp",
    "env": {
      "MYAPP_API_KEY": "some_key"
    }
  }
}
```

### Server Initialization
Common initialization problems:

1. **Path Issues**
   * Incorrect server executable path
   * Missing required files
   * Permission problems
   * Try using an absolute path for `command`

2. **Configuration Errors**
   * Invalid JSON syntax
   * Missing required fields
   * Type mismatches

3. **Environment Problems**
   * Missing environment variables
   * Incorrect variable values
   * Permission restrictions

### Connection Problems
When servers fail to connect:

1. Check Windsurf logs
2. Verify server process is running
3. Test standalone with Inspector
4. Verify protocol compatibility

## Implementing Logging

### Server-side Logging
When building a server that uses the local stdio transport, all messages logged to stderr (standard error) will be captured by the host application (e.g., Windsurf) automatically.

> ⚠️ Warning: Local MCP servers should not log messages to stdout (standard out), as this will interfere with protocol operation.

Important events to log:

* Initialization steps
* Resource access
* Tool execution
* Error conditions
* Performance metrics

### Client-side Logging
In client applications:

1. Enable debug logging
2. Monitor network traffic
3. Track message exchanges
4. Record error states

## Debugging Workflow

### Development Cycle
1. Initial Development
   * Use Inspector for basic testing
   * Implement core functionality
   * Add logging points

2. Integration Testing
   * Test in Windsurf
   * Monitor logs
   * Check error handling

### Testing Changes
To test changes efficiently:

* **Configuration changes**: Restart Windsurf
* **Server code changes**: Restart the MCP server
* **Quick iteration**: Use Inspector during development

## Best Practices

### Logging Strategy
1. **Structured Logging**
   * Use consistent formats
   * Include context
   * Add timestamps
   * Track request IDs

2. **Error Handling**
   * Log stack traces
   * Include error context
   * Track error patterns
   * Monitor recovery

3. **Performance Tracking**
   * Log operation timing
   * Monitor resource usage
   * Track message sizes
   * Measure latency

### Security Considerations
When debugging:

1. **Sensitive Data**
   * Sanitize logs
   * Protect credentials
   * Mask personal information

2. **Access Control**
   * Verify permissions
   * Check authentication
   * Monitor access patterns
